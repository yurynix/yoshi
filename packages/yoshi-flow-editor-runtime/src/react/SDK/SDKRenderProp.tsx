import React from 'react';
import {
  WixSDKContext,
  EditorSDKContext,
  IWixSDKContext,
  IEditorSDKContext,
  defaultWixSDKContext,
  defaultEditorSDKContext,
} from './SDKContext';

declare global {
  interface Window {
    __EDITOR_MODE__?: boolean;
  }
}

const inViewer = (): boolean => {
  return typeof window === 'undefined' || !window.__EDITOR_MODE__;
};

interface IWixSDKConsumer {
  children: (sdk: IWixSDKContext) => React.ReactNode;
}

interface IEditorSDKConsumer {
  children: (sdk: IEditorSDKContext) => React.ReactNode;
}

interface ISDKConsumer {
  editorSDKSrc: string | null;
  children: (sdk: IWixSDKContext | IEditorSDKContext) => React.ReactNode;
}

export class WixSDK extends React.Component<IWixSDKConsumer> {
  render() {
    const { children } = this.props;

    // We don't have Wix SDK for viewer part and going to return Wix: null.
    if (inViewer()) {
      return children(defaultWixSDKContext);
    }

    return (
      <WixSDKContext.Consumer>
        {(sdk: IWixSDKContext) => (sdk.Wix ? children(sdk) : null)}
      </WixSDKContext.Consumer>
    );
  }
}

export class EditorSDK extends React.Component<IEditorSDKConsumer> {
  render() {
    const { children } = this.props;

    // We don't have Wix SDK for viewer part and going to return Wix: null.
    if (inViewer()) {
      return children(defaultEditorSDKContext);
    }

    return (
      <EditorSDKContext.Consumer>
        {(sdk: IEditorSDKContext) => (sdk.editorSDK ? children(sdk) : null)}
      </EditorSDKContext.Consumer>
    );
  }
}

export class SDK extends React.Component<ISDKConsumer> {
  render() {
    const { editorSDKSrc } = this.props;

    if (editorSDKSrc) {
      return <EditorSDK {...(this.props as IEditorSDKConsumer)} />;
    }

    return <WixSDK {...(this.props as IWixSDKConsumer)} />;
  }
}
