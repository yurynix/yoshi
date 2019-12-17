declare module 'react-module-container';

declare module 'i18next' {
  type TranslationFunction = (key: string) => string;

  export const init: any;
}

declare module 'react-i18next' {
  import { TranslationFunction } from 'i18next';
  import { ComponentType } from 'react';

  export const I18nextProvider: any;

  export interface InjectedTranslateProps {
    t: TranslationFunction;
  }

  export const translate: (
    opts?: any,
  ) => <P extends InjectedTranslateProps>(
    component: ComponentType<P>,
  ) => ComponentType<Omit<P, keyof InjectedTranslateProps>>;
}
