import React, { Suspense } from 'react';
import { IHostProps } from '@wix/native-components-infra/dist/src/types/types';
import { IWixStatic } from '@wix/native-components-infra/dist/es/src/types/wix-sdk';
import { createInstances } from './createInstances';
import { ControllerProvider } from './react/ControllerProvider';
import { IControllerContext } from './react/ControllerContext';
import { TranslationProvider, Translations } from './react/TranslationProvider';
import { PublicDataProviderEditor } from './react/PublicDataProviderEditor';
import { PublicDataProviderViewer } from './react/PublicDataProviderViewer';
import { ErrorBoundary } from './react/ErrorBoundary';

declare global {
  interface Window {
    Wix: IWixStatic;
  }
}
// TODO - improve this type or bring from controller wrapper
interface IFrameworkProps {
  __publicData__: any;
  experiments: any;
  translations: Translations;
}

const PublicDataProvider: typeof React.Component =
  typeof window.Wix === 'undefined'
    ? PublicDataProviderViewer
    : PublicDataProviderEditor;

const WidgetWrapper = (UserComponent: typeof React.Component) => (
  props: IHostProps & IFrameworkProps & IControllerContext,
) => {
  return (
    <div>
      <link
        href="https://localhost:3200/todoViewerWidget.css"
        rel="stylesheet"
        type="text/css"
      />

      <ErrorBoundary handleException={error => console.log(error)}>
        <Suspense fallback={<div>Loading...</div>}>
          <PublicDataProvider data={props.__publicData__} Wix={window.Wix}>
            <TranslationProvider data={props.translations}>
              <ControllerProvider data={props}>
                <UserComponent
                  {...createInstances(props.experiments)}
                  {...props}
                />
              </ControllerProvider>
            </TranslationProvider>
          </PublicDataProvider>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default WidgetWrapper;
