import React from 'react';
import { withStyles } from '@wix/native-components-infra';
import { IHostProps } from '@wix/native-components-infra/dist/src/types/types';
import { IWixStatic } from '@wix/native-components-infra/dist/es/src/types/wix-sdk';
import { PublicDataProvider } from './react/PublicDataProvider';
import { createInstances } from './createInstances';
import { ControllerProvider } from './react/ControllerProvider';
import { ErrorBoundary } from './react/ErrorBoundary';
import { IControllerContext } from './react/ControllerContext';

declare global {
  interface Window {
    __STATICS_BASE_URL__: string;
  }
}
// TODO - improve this type or bring from controller wrapper
interface IFrameworkProps {
  __publicData__: Record<string, any>;
  experiments: any;
  cssBaseUrl?: string;
}

// This widget is going to be called inside entry-point wrappers
// Each widget should contain component to wrap name, so here we return a getter instead of component.
const getWidgetWrapper = (
  UserComponent: typeof React.Component,
  {
    name,
    Wix,
    isEditor,
  }: {
    name: string;
    Wix: IWixStatic | null;
    isEditor?: boolean;
  },
) => {
  const Widget = (props: IHostProps & IFrameworkProps & IControllerContext) => {
    return (
      <div>
        <ErrorBoundary handleException={error => console.log(error)}>
          <PublicDataProvider data={props.__publicData__} Wix={Wix}>
            <ControllerProvider data={props}>
              <UserComponent
                Wix={Wix}
                {...createInstances({ experiments: props.experiments })}
                {...props}
              />
            </ControllerProvider>
          </PublicDataProvider>
        </ErrorBoundary>
      </div>
    );
  };
  const cssPath = isEditor
    ? `${name}EditorMode.css`
    : `${name}ViewerWidget.css`;

  const stylablePath = isEditor
    ? `${name}EditorMode.stylable.bundle.css`
    : `${name}ViewerWidget.stylable.bundle.css`;

  return withStyles(Widget, {
    cssPath: [cssPath, stylablePath],
  });
};

export default getWidgetWrapper;
