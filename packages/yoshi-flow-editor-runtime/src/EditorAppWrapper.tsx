import React, { Suspense } from 'react';
import { ViewerScriptWrapper } from '@wix/native-components-infra';
import { WixSDK } from './react/SDK/SDKRenderProp';
import WidgetWrapper from './WidgetWrapper';
import { createControllers, initAppForPageWrapper } from './viewerScript.js';
import { IWixSDKContext } from './react/SDK/SDKContext';
import { WixSDKProvider } from './react/SDK/WixSDKProvider';

interface IEditorAppCreatorProps {
  UserComponent: typeof React.Component;
  userController: Function;
  mapPlatformStateToAppData: Function;
  customInitAppForPage: Function;
  name: string;
}
interface IEditorAppWithWixSDKCreatorProps extends IEditorAppCreatorProps {
  sdk: IWixSDKContext;
}

interface IEditorAppWrapperProps extends IEditorAppCreatorProps {
  children: React.ReactNode;
}

// TODO: fill overrides and whatnot from santawrapper
const createEditorAppForWixSDK = ({
  UserComponent,
  userController,
  mapPlatformStateToAppData,
  customInitAppForPage,
  name,
  sdk,
}: IEditorAppWithWixSDKCreatorProps) => {
  return ViewerScriptWrapper(
    WidgetWrapper(UserComponent, {
      name,
      Wix: sdk.Wix,
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
      Wix: sdk.Wix,
      widgetConfig: {
        widgetId: '',
        getAllPublicData: true,
      },
    },
  );
};

interface IEditorAppWithCreatorState {
  EditorAppComponent: typeof React.Component | null;
}
interface IEditorAppWithCreatorProps extends IEditorAppWrapperProps {
  sdk: IWixSDKContext;
}

class EditorAppWithCreator extends React.Component<
  IEditorAppWithCreatorProps,
  IEditorAppWithCreatorState
> {
  constructor(props: IEditorAppWithCreatorProps) {
    super(props);

    let EditorAppComponent = null;
    if (props.sdk.Wix) {
      EditorAppComponent = createEditorAppForWixSDK(props);
      // Just to verify we are not exposing it.
    } else if ((props.sdk as any).editorSDK) {
      throw new Error('Editor App does not support editorSDK');
    }

    this.state = {
      EditorAppComponent,
    };
  }
  render() {
    const { EditorAppComponent } = this.state;

    if (!EditorAppComponent) {
      return null;
    }

    return <EditorAppComponent />;
  }
}

export default (props: IEditorAppWrapperProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WixSDKProvider>
        <WixSDK>
          {sdk => {
            return <EditorAppWithCreator sdk={sdk} {...props} />;
          }}
        </WixSDK>
      </WixSDKProvider>
    </Suspense>
  );
};
