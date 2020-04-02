import t from './template';

type Opts = Record<
  | 'editorAppWrapperPath'
  | 'componentFileName'
  | 'controllerFileName'
  | 'viewerAppFileName'
  | 'componentName',
  string
>;

export default t<Opts>`
    import React from 'react';
    import ReactDOM from 'react-dom';
    import EditorAppWrapper from '${({ editorAppWrapperPath }) =>
      editorAppWrapperPath}';

    import Component from '${({ componentFileName }) => componentFileName}';
    import createController from '${({ controllerFileName }) =>
      controllerFileName}';
    import * as viewerApp from '${({ viewerAppFileName }) =>
      viewerAppFileName}';
    const importedApp = viewerApp;

    const EditorApp = EditorAppWrapper(Component, createController, importedApp.mapPlatformStateToAppData, importedApp.initAppForPage, '${({
      componentName,
    }) => componentName}');

    ReactDOM.render(React.createElement(EditorApp, null), document.getElementById('root'));
`;
