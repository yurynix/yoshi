import axios from 'axios';
import React, { ComponentType, FC, useMemo } from 'react';
import { wixAxiosConfig } from '@wix/wix-axios-config';
import TranslationProvider from './hooks/TranslationProvider';
import ExperimentsProvider from './hooks/ExperimentsProvider';
import ModuleProvider, { IBMModuleParams } from './hooks/ModuleProvider';
import { ExperimentsBag } from '@wix/wix-experiments';
import SentryProvider from './hooks/SentryProvider';
import FedopsProvider from './hooks/FedopsProvider';
import { BrowserClient } from '@sentry/browser';

wixAxiosConfig(axios, {
  baseURL: '/',
});

const withBM = (
  componentId: string,
  experiments: ExperimentsBag,
  translations: Record<string, string>,
  sentryClient: BrowserClient,
) => (Component: ComponentType) => {
  const Wrapped: FC<IBMModuleParams> = ({ children, ...props }) => {
    const experimentsOptions = useMemo(() => ({ experiments }), [experiments]);

    return (
      <ModuleProvider moduleParams={props}>
        <TranslationProvider translations={translations}>
          <ExperimentsProvider options={experimentsOptions}>
            <SentryProvider client={sentryClient}>
              <FedopsProvider appName={componentId}>
                <Component />
              </FedopsProvider>
            </SentryProvider>
          </ExperimentsProvider>
        </TranslationProvider>
      </ModuleProvider>
    );
  };

  return Wrapped;
};

export default withBM;
