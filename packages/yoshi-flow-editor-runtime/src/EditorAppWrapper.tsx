import React from 'react';
import { ViewerScriptWrapper } from '@wix/native-components-infra';
import WidgetWrapper from './WidgetWrapper';
import { createControllers, initAppForPageWrapper } from './viewerScript.js';
import withEditorSDK, { WrappedComponentCallback } from './react/withEditorSDK';

// TODO: fill overrides and whatnot from santawrapper
const EditorAppWrapper = (
  UserComponent: typeof React.Component,
  userController: Function,
  mapPlatformStateToAppData: Function,
  customInitAppForPage: Function,
  name: string,
) => {
  const WithViewerScript: WrappedComponentCallback<any> = Wix => {
    return ViewerScriptWrapper(
      WidgetWrapper(UserComponent, {
        name,
        Wix,
        isEditor: true,
      }),
      {
        viewerScript: {
          createControllers: createControllers(
            userController,
            mapPlatformStateToAppData,
          ),
          initAppForPage: initAppForPageWrapper(customInitAppForPage),
        },
        Wix,
        widgetConfig: {
          widgetId: '',
          getAllPublicData: true,
        },
        // overrides: {
        //   fedopsAppName: CART_ICON_APP_NAME,
        //   fedopsLogger,
        //   locale: window.__LOCALE__,
        //   siteBaseUrl: `${window.__APP_MODEL__.topology.baseDomain}/`,
        //   platform: {baseUrls: {cartIconBaseUrl: window.__BASE_STATIC_URL__}},
        // },
      },
    );
  };

  return withEditorSDK(WithViewerScript);
};

export default EditorAppWrapper;
