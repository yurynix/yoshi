import { createContext } from 'react';
import { EditorSDK } from '@wix/platform-editor-sdk';
import { IWixStatic } from '@wix/native-components-infra/dist/es/src/types/wix-sdk';

export interface IEditorSDKConfig {
  token: string;
  origin?: string;
  initialData?: any;
}

export interface IWixSDKContext {
  Wix: IWixStatic | null;
}

export interface IEditorSDKContext {
  editorSDK: EditorSDK | null;
  editorSDKConfig: IEditorSDKConfig | null;
}

export const defaultWixSDKContext = {
  Wix: null,
};

export const defaultEditorSDKContext = {
  editorSDK: null,
  editorSDKConfig: null,
};

export const WixSDKContext = createContext<IWixSDKContext>(
  defaultWixSDKContext,
);

export const EditorSDKContext = createContext<IEditorSDKContext>(
  defaultEditorSDKContext,
);
