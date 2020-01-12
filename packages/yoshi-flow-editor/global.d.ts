import { IWixStatic } from '@wix/native-components-infra/dist/es/src/types/wix-sdk';

declare global {
  interface Window {
    Wix: IWixStatic;
  }
}
