const babelJest = require('babel-jest');
const createBabelConfig = require('yoshi-common/create-babel-config');

const babelConfig = createBabelConfig();

module.exports = babelJest.createTransformer(babelConfig);
