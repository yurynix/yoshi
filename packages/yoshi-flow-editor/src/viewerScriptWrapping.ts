import path from 'path';
import fs from 'fs-extra';
import { Dictionary } from './types';

const viewerScriptWrapperPath =
  'yoshi-flow-editor-runtime/build/viewerScript.js';

const viewerScriptWrapper = (
  generatedWidgetEntriesPath: string,
  userController: Array<string>,
  userInitApp: string,
) => {
  const generatedViewerScriptEntryPath = path.join(
    generatedWidgetEntriesPath,
    `viewerScript.js`,
  );

  const generateViewerScriptEntryContent = `
    import {getControllerFactory, initController} from '${viewerScriptWrapperPath}';

    const createControllers = (controllerConfigs, controllerInstances) => {
      return controllerConfigs.map(props => {
        const ctrlFactory = getControllerFactory(controllerInstances, props.type);
        const ctrl = initController(ctrlFactory, props);
        return Promise.resolve(ctrl);
      });
    };
    export default createControllers;
  `;

  fs.outputFileSync(
    generatedViewerScriptEntryPath,
    generateViewerScriptEntryContent,
  );
  const viewerScript = generatedViewerScriptEntryPath;

  return userController.reduce(
    (acc: Dictionary<string>, userControllerAbsolutePath) => {
      const widgetName = path.basename(
        path.dirname(userControllerAbsolutePath),
      );
      const generatedWidgetEntryPath = path.join(
        generatedWidgetEntriesPath,
        `${widgetName}ViewerScript.js`,
      );

      const generateControllerEntryContent = `
    import {createControllers as createControllersWrapper, initAppForPage as initAppForPageWrapper} from '${viewerScriptWrapperPath}';
    import userController from '${userControllerAbsolutePath}';
    import userInitApp from '${userInitApp}';

    export const initAppForPage = initAppForPageWrapper;
    export const createControllers = createControllersWrapper(userController, userInitApp);`;

      fs.outputFileSync(
        generatedWidgetEntryPath,
        generateControllerEntryContent,
      );

      acc[`${widgetName}viewerScript`] = generatedWidgetEntryPath;

      return acc;
    },
    { viewerScript },
  );
};

export default viewerScriptWrapper;
