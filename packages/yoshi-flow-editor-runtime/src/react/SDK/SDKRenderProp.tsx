import React from 'react';
import {
  WixSDKContext,
  EditorSDKContext,
  IWixSDKContext,
  IEditorSDKContext,
  IWixSDKEditorEnvironmentContext,
  IWixSDKViewerEnvironmentContext,
  defaultWixSDKContext,
  defaultEditorSDKContext,
} from './SDKContext';

declare global {
  interface Window {
    __EDITOR_MODE__?: boolean;
  }
}

const inViewer = (): boolean => {
  // We are checking SSR and CSR cases
  return typeof window === 'undefined' || !window.__EDITOR_MODE__;
};

interface IWixSDKConsumer {
  children: (sdk: IWixSDKContext) => JSX.Element;
  inEditor?: boolean;
}

interface IEditorSDKConsumer {
  children: (sdk: IEditorSDKContext) => JSX.Element;
}

interface ISDKConsumer {
  editorSDKSrc: string | null;
  children: (sdk: IWixSDKContext | IEditorSDKContext) => JSX.Element;
}

export const WixSDK: React.FC<IWixSDKConsumer> = props => {
  const { children, inEditor } = props;

  // We don't have Wix SDK for viewer part and going to return `{ Wix: null }`
  if (!inEditor && inViewer()) {
    return children(defaultWixSDKContext as IWixSDKViewerEnvironmentContext);
  }

  return (
    <WixSDKContext.Consumer>
      {(sdk: IWixSDKContext) =>
        sdk.Wix ? children(sdk as IWixSDKEditorEnvironmentContext) : null
      }
    </WixSDKContext.Consumer>
  );
};

export const EditorSDK: React.FC<IEditorSDKConsumer> = props => {
  const { children } = props;

  // We don't have Editor SDK for viewer part and going to return `{ editorSDK: null, editorSDKConfig: null }`
  if (inViewer()) {
    return children(defaultEditorSDKContext);
  }

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
