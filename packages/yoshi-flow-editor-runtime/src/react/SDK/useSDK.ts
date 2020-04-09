import { useContext } from 'react';
import { WixSDKContext, EditorSDKContext } from './SDKContext';

export function useWixSdk() {
  return useContext(WixSDKContext);
}

export function useEditorSdk() {
  return useContext(EditorSDKContext);
}
