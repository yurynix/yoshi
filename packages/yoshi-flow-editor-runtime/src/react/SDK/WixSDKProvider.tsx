import React from 'react';
import { IWixStatic } from '@wix/native-components-infra/dist/es/src/types/wix-sdk';
import { loadScript } from '../../utils';
import { DEFAULT_WIX_SDK_SRC } from '../../constants';
import {
  WixSDKContext,
  IWixSDKContext,
  defaultWixSDKContext,
} from './SDKContext';

declare global {
  interface Window {
    __USE_PRIVATE_SDK_MOCK__: boolean;
    Wix: IWixStatic;
  }
}

interface IState {
  value: IWixSDKContext;
}

export class WixSDKProvider extends React.Component<{}, IState> {
  state: IState = {
    value: defaultWixSDKContext,
  };

  componentDidMount() {
    const editorSdkScriptSrc = DEFAULT_WIX_SDK_SRC;

    this.loadSDK(editorSdkScriptSrc).then(() => {
      const Wix = window.Wix;

      this.setState({ value: { Wix } });
    });
  }

  loadSDK(src: string) {
    // We pass it when rendering app with usePrivateMock param
    if (window.__USE_PRIVATE_SDK_MOCK__) {
      return import('../../wixPrivateMockPath');
    }
    return loadScript(src);
  }

  render() {
    return (
      <WixSDKContext.Provider value={this.state.value}>
        {this.props.children}
      </WixSDKContext.Provider>
    );
  }
}
