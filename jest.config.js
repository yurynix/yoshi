module.exports = {
  preset: 'jest-puppeteer',
  // rootDir: './test/cases',
  // testMatch: ['**/*.test.js'],
  globals: {
    'ts-jest': {
      // https://github.com/kulshekhar/ts-jest/issues/805
      isolatedModules: true,
    },
  },

  testMatch: [
    '/Users/ronena/Projects/yoshi/packages/yoshi-common/src/__tests__/webpack.config/css-inclusion/css-inclusion.test.ts',
  ],
  transformIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: [require.resolve('./jest-setup')],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
};
