export default (presetOptions = {}) => ({
  presets: [[require.resolve('babel-preset-yoshi'), presetOptions]],
  babelrc: false,
  configFile: false,
});
