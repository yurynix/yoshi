const transformer = require('./typescript');
const { withServerTransformer } = require('../utils');

module.exports = withServerTransformer(transformer);
