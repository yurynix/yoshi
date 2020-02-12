import React from 'react';
import someModule from './someModule.foo';
import { functionToMock } from './moduleToMock';

export default () => <div id="jest-preset-overrides">{someModule}</div>;

export const ComponentForMocksTests = () => (
  <div id="jest-preset-overrides">{functionToMock('not-mocked')}</div>
);
