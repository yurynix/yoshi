const stubContent = require('../src/someModule.foo');

it('should support overrides for "global", from jest-yoshi.config', async () => {
  expect(global['foo']).toEqual('bar');
});

it('should use moduleNameMapper in e2eOptions', () => {
  expect(stubContent).toEqual('Stub module content');
});
