import React, { Suspense } from 'react';
import { PublicDataProvider } from './react/PublicData/PublicDataProvider';
import { ErrorBoundary } from './react/ErrorBoundary';
import { getEditorSDKSrc } from './utils';
import { SDKProvider } from './react/SDK/SDKProvider';
import { SDK } from './react/SDK/SDKRenderProp';

interface SettingsWrapperProps {
  children: React.Component;
  __publicData__: Record<string, any>;
}

const SettingsWrapper = (props: SettingsWrapperProps) => {
  const editorSDKSrc = getEditorSDKSrc();

  return (
    <ErrorBoundary handleException={error => console.error(error)}>
      <Suspense fallback={<div>Loading...</div>}>
        <SDKProvider editorSDKSrc={editorSDKSrc}>
          <SDK editorSDKSrc={editorSDKSrc}>
            {sdk => {
              return (
                <PublicDataProvider sdk={sdk} data={props.__publicData__}>
                  {props.children}
                </PublicDataProvider>
              );
            }}
          </SDK>
        </SDKProvider>
      </Suspense>
    </ErrorBoundary>
  );
};

export default SettingsWrapper;
