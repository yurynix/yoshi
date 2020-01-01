module.exports = {
  preset: 'jest-puppeteer',
  rootDir: './test/javascript/features',
  testResultsProcessor: 'jest-teamcity-reporter',
  testMatch: ['**/*.test.js'],
  globalSetup: require.resolve('./test/javascript/globalSetup'),
  globalTeardown: require.resolve('./test/javascript/globalTeardown'),
  transformIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: [require.resolve('./jest-setup')],
};
