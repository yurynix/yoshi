import React from 'react';
import ReactDOM from 'react-dom';
import Component, { ComponentForMocksTests } from './component';
import moduleToMock from './moduleToMock';

jest.mock('./moduleToMock');

it('should pass', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Component />, div);
  expect(div.innerHTML).toContain('Stub module content');
});

it('should support overrides for "global", from jest-yoshi.config', async () => {
  expect(global['foo']).toEqual('bar');
});

it('should support overrides for "testURL", from jest-yoshi.config', async () => {
  expect(window.location.href).toEqual('http://localhost:3000/?query=param');
});

describe('should support overrides for "resetMocks", from jest-yoshi.config', () => {
  it('test to mock a function', async () => {
    moduleToMock.functionToMock.mockReturnValue('mocked');

    const div = document.createElement('div');
    ReactDOM.render(<ComponentForMocksTests />, div);
    expect(div.getElementsByTagName('div')[0].innerHTML).toEqual('mocked');
  });

  it('return value and mock calls should reset', async () => {
    const div = document.createElement('div');
    ReactDOM.render(<ComponentForMocksTests />, div);
    expect(div.getElementsByTagName('div')[0].innerHTML).toEqual('');
    expect(moduleToMock.functionToMock).toHaveBeenCalledTimes(1);
  });
});
