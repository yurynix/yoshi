// @ts-ignore wrong types
import { teardown as teardownPuppeteer } from 'jest-environment-puppeteer';

export default async (globalConfig: any) => {
  await teardownPuppeteer(globalConfig);
  global.teardown && global.teardown();
};
