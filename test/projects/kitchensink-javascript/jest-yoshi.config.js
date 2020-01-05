module.exports = {
  server: {
    command: 'node index.js',
    port: 3100,
  },
  e2eOptions: {
    moduleNameMapper: {
      '^[./a-zA-Z0-9$_-]+\\.foo$': '<rootDir>/stub.js',
    },
  },
  specOptions: {
    globals: {
      foo: 'bar',
    },
    testURL: 'http://localhost:3000/?query=param',
    moduleNameMapper: {
      '^[./a-zA-Z0-9$_-]+\\.foo$': '<rootDir>/stub.js',
      '^(?!.+\\.st\\.css$)^.+\\.(?:sass|s?css|less)$': 'identity-obj-proxy',
    },
  },
};
