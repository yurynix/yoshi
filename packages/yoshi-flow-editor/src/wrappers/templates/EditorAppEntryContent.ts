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

    import UserComponent from '${({ componentFileName }) => componentFileName}';
    import createController from '${({ controllerFileName }) =>
      controllerFileName}';
    import * as viewerApp from '${({ viewerAppFileName }) =>
      viewerAppFileName}';
    var importedApp = viewerApp;

    var componentName = '${({ componentName }) => componentName}';

    var WrappedEditorApp = () => React.createElement(EditorAppWrapper, {
      UserComponent,
      name: componentName,
      userController: createController,
      mapPlatformStateToAppData: importedApp.mapPlatformStateToAppData,
      customInitAppForPage: importedApp.initAppForPage
    });

    ReactDOM.render(React.createElement(WrappedEditorApp, null), document.getElementById('root'));
`;
