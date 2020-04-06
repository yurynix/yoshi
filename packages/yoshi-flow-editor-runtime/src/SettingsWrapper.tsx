import React, { Suspense } from 'react';
import { IWixStatic } from '@wix/native-components-infra/dist/es/src/types/wix-sdk';
import { PublicDataProvider } from './react/PublicDataProvider';
import { ErrorBoundary } from './react/ErrorBoundary';
import withEditorSDK, { WrappedComponentCallback } from './react/withEditorSDK';

interface SettingsWrapperProps {
  children: (Wix: IWixStatic) => React.Component;
  __publicData__: Record<string, any>;
}

const SettingsWrapperCallback: WrappedComponentCallback<SettingsWrapperProps> = (
  Wix,
): React.FunctionComponent<SettingsWrapperProps> => props => {
  return (
    <ErrorBoundary handleException={error => console.error(error)}>
      <PublicDataProvider Wix={Wix} data={props.__publicData__}>
        <Suspense fallback={<div>Loading...</div>}>
          {props.children(Wix)}
        </Suspense>
      </PublicDataProvider>
    </ErrorBoundary>
  );
};

export default withEditorSDK(SettingsWrapperCallback);
