const transformer = require('./babel');
const { withServerTransformer } = require('../utils');

module.exports = withServerTransformer(transformer);
