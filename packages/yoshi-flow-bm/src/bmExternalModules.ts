import { ExternalsElement } from 'webpack';

const bmExternalModules: ExternalsElement = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'react-addons-css-transition-group': 'React.addons.CSSTransitionGroup',
  lodash: '_',
  urijs: 'URI',
  '@wix/business-manager-api': 'BusinessManagerAPI',
  'react-module-container': 'reactModuleContainer',
  '@sentry/browser': 'Sentry',
};

export default bmExternalModules;
