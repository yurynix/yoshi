const config = require('./baseConfig');

config.externals = { ...config.externals, externals: 'externals' };
module.exports = config;
