import t from './template';

type Opts = Record<
  'settingsWrapperPath' | 'componentFileName' | 'baseUIPath',
  string
>;

export default t<Opts>`
  import React from 'react';
  import ReactDOM from 'react-dom';
  import SettingsWrapper from '${({ settingsWrapperPath }) =>
    settingsWrapperPath}';
  import Settings from '${({ componentFileName }) => componentFileName}';
  import '${({ baseUIPath }) => baseUIPath}';

  const WithWixWrapper = Wix => React.createElement(Settings, { Wix });
  ReactDOM.render(React.createElement(SettingsWrapper, null, WithWixWrapper), document.getElementById('root'));
`;
