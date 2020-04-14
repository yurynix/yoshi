import React from 'react';
import {
  WixSDKContext,
  EditorSDKContext,
  IWixSDKContext,
  IEditorSDKContext,
  IWixSDKEditorEnvironmentContext,
  IWixSDKViewerEnvironmentContext,
  defaultWixSDKContext,
} from './SDKContext';

declare global {
  interface Window {
    __EDITOR_MODE__?: boolean;
  }
}

const isEditor = (): boolean => {
  // We are checking SSR and CSR cases
  return typeof window !== 'undefined' && !!window.__EDITOR_MODE__;
};

type IWixSDKConsumerEditorChildren = (
  sdk: IWixSDKEditorEnvironmentContext,
) => React.ReactElement | null;

type IWixSDKConsumerViewerChildren = (
  sdk: IWixSDKViewerEnvironmentContext,
) => React.ReactElement | null;

interface IWixSDKConsumer {
  children: (
    sdk: IWixSDKEditorEnvironmentContext | IWixSDKViewerEnvironmentContext,
  ) => React.ReactElement | null;
  inEditor?: boolean;
}

interface IEditorSDKConsumer {
  children: (sdk: IEditorSDKContext) => React.ReactElement | null;
}

interface ISDKConsumer {
  editorSDKSrc: string | null;
  children: (
    sdk: IWixSDKContext | IEditorSDKContext,
  ) => React.ReactElement | null;
}

// We want to have flexible sdk render prop argument for different places of our app.
// We can use `isEditor` prop in settings place to excplictly notify our component that we expect sdk is always value
// For Widget part it will be flexible and users should consider Wix could be null (for viewer).
interface IWixSDKProps<T extends boolean> {
  isEditor?: T;
  children: (
    sdk: T extends true
      ? IWixSDKEditorEnvironmentContext
      : IWixSDKViewerEnvironmentContext | IWixSDKEditorEnvironmentContext,
  ) => React.ReactElement | null;
}
export class WixSDK<T extends boolean = false> extends React.Component<
  IWixSDKProps<T>
> {
  static defaultProps = {
    isEditor: isEditor(),
  };
  render() {
    const { children, isEditor } = this.props;

    if (isEditor) {
      return (
        <WixSDKContext.Consumer>
          {(sdk: IWixSDKContext) =>
            sdk.Wix
              ? (children as IWixSDKConsumerEditorChildren)(
                  sdk as IWixSDKEditorEnvironmentContext,
                )
              : null
          }
        </WixSDKContext.Consumer>
      );
    }

    return (children as IWixSDKConsumerViewerChildren)(
      defaultWixSDKContext as IWixSDKViewerEnvironmentContext,
    );
  }
}

export const EditorSDK: React.FC<IEditorSDKConsumer> = props => {
  const { children } = props;

  return (
    <EditorSDKContext.Consumer>
      {(sdk: IEditorSDKContext) => (sdk.editorSDK ? children(sdk) : null)}
    </EditorSDKContext.Consumer>
  );
};

export const SDK = (props: ISDKConsumer) => {
  if (props.editorSDKSrc) {
    return <EditorSDK {...(props as IEditorSDKConsumer)} />;
  }
  return <WixSDK {...(props as IWixSDKConsumer)} />;
};
