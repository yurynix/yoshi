import React from 'react';
import { EditorSDKProvider } from './EditorSDKProvider';
import { WixSDKProvider } from './WixSDKProvider';

export const SDKProvider = (props: {
  editorSDKSrc: string | null;
  children: React.Component | React.ReactElement;
}) => {
  const { editorSDKSrc, children } = props;

  if (editorSDKSrc) {
    return (
      <EditorSDKProvider editorSDKSrc={editorSDKSrc} children={children} />
    );
  }
  return <WixSDKProvider children={children} />;
};
