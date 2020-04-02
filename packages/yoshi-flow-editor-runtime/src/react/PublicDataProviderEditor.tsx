import React from 'react';
import { IWixStatic } from '@wix/native-components-infra/dist/es/src/types/wix-sdk';
import { PublicDataContext } from './PublicDataContext';

// Later it can be passed into a hook as `usePublicData(scope)`
const scope = 'COMPONENT';
const PUBLIC_DATA_TIMEOUT = 1500;

interface IState {
  ready: boolean;
  data: Record<string, any>;
  readyPromise?: Promise<boolean>;
}

export interface PublicDataProviderEditorProps {
  Wix: IWixStatic;
}

export class PublicDataProviderEditor extends React.Component<
  PublicDataProviderEditorProps,
  IState
> {
  state: IState = {
    ready: false,
    data: {},
  };

  componentDidMount() {
    const { Wix } = this.props;

    const publicDataPromise = new Promise((resolve, reject) => {
      setTimeout(function() {
        reject(
          new Error(`timeout of ${PUBLIC_DATA_TIMEOUT}ms reached on Wix.Data.Public.getAll`),
        );
      }, PUBLIC_DATA_TIMEOUT);
      Wix.Data.Public.getAll(resolve, reject);
    }).then(
      (data: any) => {
        this.setState({
          data: data[scope] || {},
          ready: true,
        });
        return data[scope] || {};
      },
      e => {
        console.error(e);
        this.setState({
          data: {},
          ready: true,
        });
        return {};
      },
    );

    // Specifically for editor, can be in a different provider that's
    // only used in `WidgetWrapper`
    Wix.addEventListener(
      Wix.Events.PUBLIC_DATA_CHANGED,
      (newPublicData: Record<string, any>) => {
        this.setState({
          data: newPublicData || {},
        });
      },
    );

    this.setState({
      readyPromise: publicDataPromise,
    });
  }

  handleGetParam = (key: string) => {
    if (!this.state.ready) {
      return undefined;
    }

    return this.state.data[key];
  };

  handleSetParam = (key: string, value: any) => {
    const { Wix } = this.props;

    if (!this.state.ready) {
      throw this.state.readyPromise;
    }

    if (this.state.data[key] === value) {
      return;
    }

    this.setState((state: IState) => ({
      data: {
        ...state.data,
        [key]: value,
      },
    }));

    Wix.Data.Public.set(
      key,
      value,
      { scope },
      () => {},
      (error: string | undefined) => {
        throw new Error(error);
      },
    );
  };

  render() {
    return (
      <PublicDataContext.Provider
        value={{
          ready: this.state.ready,
          readyPromise: this.state.readyPromise,
          get: this.handleGetParam,
          set: this.handleSetParam,
          type: 'editor-public-data',
        }}
      >
        {this.props.children}
      </PublicDataContext.Provider>
    );
  }
}
