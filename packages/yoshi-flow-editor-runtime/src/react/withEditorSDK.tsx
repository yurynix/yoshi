import React from 'react';
import { EditorSDK } from '@wix/platform-editor-sdk';
import { IWixStatic } from '@wix/native-components-infra/dist/es/src/types/wix-sdk';
import { getQueryParams } from '../utils';
import { DEFAULT_EDITOR_SDK_SRC } from '../constants';

declare global {
  interface Window {
    __USE_PRIVATE_SDK_MOCK__: boolean;
    editorSDK: EditorSDK;
  }
}

export interface IState<P> {
  isSDKLoaded: boolean;
  config: EditorSDKConfig | null;
  Component: React.ComponentType<P> | null;
}

export interface EditorSDKConfig {
  token: string;
  origin?: string;
  initialData?: any;
}

export type WrappedComponentCallback<P> = (
  Wix: IWixStatic,
  editorSDK: EditorSDK,
) => React.ComponentType<P>;

const loadSDK = (scriptSrc: string) => {
  // We pass it when rendering app with usePrivateMock param
  if (window.__USE_PRIVATE_SDK_MOCK__) {
    return import('../wixPrivateMockPath');
  }
  return new Promise(resolve => {
    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = false;
    script.onload = resolve;

    document.body.appendChild(script);
  });
};

export default function WrapWithEditorSDK<P>(
  WrappedComponentCallback: WrappedComponentCallback<P>,
) {
  return class WithEditorSDK extends React.Component<P, IState<P>> {
    queryParams: URLSearchParams;
    Wix: IWixStatic = {} as IWixStatic;
    editorSDK: EditorSDK = {} as EditorSDK;
    state: IState<P> = {
      isSDKLoaded: false,
      Component: null,
      config: null,
    };

    constructor(props: P) {
      super(props);
      this.queryParams = getQueryParams();
      const editorSdkScriptSrc =
        this.queryParams.get('wix-sdk-version') || DEFAULT_EDITOR_SDK_SRC;

      loadSDK(editorSdkScriptSrc).then(() => {
        this.editorSDK = window.editorSDK;
        this.Wix = window.Wix;
        this.setState({
          isSDKLoaded: true,
          Component: WrappedComponentCallback(this.Wix, this.editorSDK),
        });
        if (this.editorSDK) {
          this.editorSDK.panel.onEvent(({ eventType, eventPayload }) => {
            if (eventType === 'startConfiguration') {
              this.setState({
                config: eventPayload,
              });
            }
          });
        }
      });
    }

    render() {
      const { isSDKLoaded, Component, config } = this.state;
      if (!isSDKLoaded || !Component) {
        return null;
      }
      return (
        <Component
          editorSDK={this.editorSDK}
          componentId={this.queryParams.get('componentId')}
          Wix={this.Wix}
          {...config}
          {...this.props}
        />
      );
    }
  };
}
