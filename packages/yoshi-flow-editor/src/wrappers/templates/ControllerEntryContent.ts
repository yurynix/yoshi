import t from './template';

type Opts = Record<
  'viewerScriptWrapperPath' | 'controllerFileName' | 'viewerAppFileName',
  string
>;

export default t<Opts>`
  import {createControllers as createControllersWrapper, initAppForPageWrapper} from '${({
    viewerScriptWrapperPath,
  }) => viewerScriptWrapperPath}';
  import userController from '${({ controllerFileName }) =>
    controllerFileName}';
  import * as viewerApp from '${({ viewerAppFileName }) => viewerAppFileName}';
  var importedApp = viewerApp;

  export const initAppForPage = initAppForPageWrapper(importedApp.initAppForPage);
  export const createControllers = createControllersWrapper(userController, importedApp.mapPlatformStateToAppData);
`;
