import React from 'react';
import { EditorSDK } from '@wix/platform-editor-sdk';
import { loadScript } from '../../utils';
import {
  EditorSDKContext,
  IEditorSDKContext,
  defaultEditorSDKContext,
} from './SDKContext';

declare global {
  interface Window {
    __USE_PRIVATE_SDK_MOCK__: boolean;
    editorSDK: EditorSDK;
  }
}

interface IProps {
  editorSDKSrc: string;
}

interface IState {
  value: IEditorSDKContext;
}

export class EditorSDKProvider extends React.Component<IProps, IState> {
  state: IState = {
    value: defaultEditorSDKContext,
  };

  componentDidMount() {
    this.loadSDK(this.props.editorSDKSrc).then(() => {
      const editorSDK = window.editorSDK;

      editorSDK.panel.onEvent(
        ({ eventType, eventPayload: editorSDKConfig }) => {
          if (eventType === 'startConfiguration') {
            this.setState({
              value: {
                editorSDK,
                editorSDKConfig,
              },
            });
          }
        },
      );
    });
  }

  loadSDK(src: string) {
    // We pass it when rendering app with usePrivateMock param
    // We are going to ADD Mock for editor SDK in future
    // if (window.__USE_PRIVATE_SDK_MOCK__) {
    //   return import('../../wixPrivateMockPath');
    // }
    return loadScript(src);
  }

  render() {
    return (
      <EditorSDKContext.Provider value={this.state.value}>
        {this.props.children}
      </EditorSDKContext.Provider>
    );
  }
}
