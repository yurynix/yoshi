module.exports = {
  preset: 'jest-puppeteer',
  rootDir: './test/typescript/features',
  testResultsProcessor: 'jest-teamcity-reporter',
  testMatch: ['**/*.test.js'],
  globalSetup: require.resolve('./test/typescript/globalSetup'),
  globalTeardown: require.resolve('./test/typescript/globalTeardown'),
  transformIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: [require.resolve('./jest-setup')],
};
