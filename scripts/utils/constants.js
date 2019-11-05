const testRegistry = 'http://localhost:4873';

const ciEnv = {
  BUILD_NUMBER: 1,
  TEAMCITY_VERSION: 1,
  ARTIFACT_VERSION: '1.0.0-SNAPSHOT',
};

module.exports = { testRegistry, ciEnv };
