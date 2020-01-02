import { IWixStatic } from './wix-sdk';

declare global {
  interface Window {
    Wix: IWixStatic | any;
  }
}
