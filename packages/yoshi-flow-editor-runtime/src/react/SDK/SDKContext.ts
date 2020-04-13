import { createContext } from 'react';
import { EditorSDK } from '@wix/platform-editor-sdk';
import { IWixStatic } from '@wix/native-components-infra/dist/es/src/types/wix-sdk';

export interface IEditorSDKConfig {
  token: string;
  origin?: string;
  initialData?: any;
}

export type IWixSDKContext =
  | IWixSDKEditorEnvironmentContext
  | IWixSDKViewerEnvironmentContext;

export interface IWixSDKEditorEnvironmentContext {
  Wix: IWixStatic;
}

export interface IWixSDKViewerEnvironmentContext {
  Wix: null;
}

export type IEditorSDKContext =
  | IEditorSDKLoadedContext
  | IEditorSDKDefaultContext;

export interface IEditorSDKLoadedContext {
  editorSDK: EditorSDK;
  editorSDKConfig: IEditorSDKConfig;
}

export interface IEditorSDKDefaultContext {
  editorSDK: null;
  editorSDKConfig: null;
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
