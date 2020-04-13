import React from 'react';
import { IWixSDKContext, IEditorSDKContext } from '../SDK/SDKContext';
import { PublicDataProviderEditor } from './PublicDataProviderEditor';
import { PublicDataProviderViewer } from './PublicDataProviderViewer';

export const PublicDataProvider = (props: {
  sdk: IWixSDKContext | IEditorSDKContext;
  data: Record<string, any>;
  children: React.Component | React.ReactElement;
}) => {
  const { sdk, data, children } = props;

  const { Wix } = sdk as IWixSDKContext;
  const { editorSDK } = sdk as IEditorSDKContext;

  if (Wix) {
    return <PublicDataProviderEditor Wix={Wix} children={children} />;
  } else if (editorSDK) {
    // TODO: Use PublicData for new sdk;
    return <PublicDataProviderViewer data={data} children={children} />;
  }
  return <PublicDataProviderViewer data={data} children={children} />;
};
