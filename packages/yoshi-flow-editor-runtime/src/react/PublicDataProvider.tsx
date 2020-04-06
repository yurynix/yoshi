import React from 'react';
import { IWixStatic } from '@wix/native-components-infra/dist/es/src/types/wix-sdk';
import { PublicDataProviderEditor } from './PublicDataProviderEditor';
import { PublicDataProviderViewer } from './PublicDataProviderViewer';

export const PublicDataProvider = (props: {
  Wix: IWixStatic | null;
  data: Record<string, any>;
  children: React.Component | React.ReactElement;
}) => {
  const { Wix, data, children } = props;
  if (Wix) {
    return <PublicDataProviderEditor Wix={Wix} children={children} />;
  }
  return <PublicDataProviderViewer data={data} children={children} />;
};
