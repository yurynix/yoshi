const config = require('../../../../test/fixtures/javascript/base-template/yoshi.config');

config.externals = { ...config.externals, externals: 'externals' };
module.exports = config;
