import { BootstrapServer } from '@wix/wix-bootstrap-testkit';
import { AxiosInstance } from 'axios';

declare global {
  const app: BootstrapServer;
  const axios: AxiosInstance;
}

export {};
