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
  return userController.reduce(
    (acc: Dictionary<string>, userControllerAbsolutePath) => {
      const widgetName = path.basename(
        path.dirname(userControllerAbsolutePath),
      );
      const generatedWidgetEntryPath = path.join(
        generatedWidgetEntriesPath,
        `${widgetName}ViewerScript.js`,
      );

      const generateSettingsEntryContent = `
    import {createControllers as createControllersWrapper, initAppForPage as initAppForPageWrapper} from '${viewerScriptWrapperPath}';
    import userController from '${userControllerAbsolutePath}';
    import userInitApp from '${userInitApp}';

    export const initAppForPage = initAppForPageWrapper;
    export const createControllers = createControllersWrapper(userController, userInitApp);`;

      fs.outputFileSync(generatedWidgetEntryPath, generateSettingsEntryContent);

      acc[`${widgetName}viewerScript`] = generatedWidgetEntryPath;

      return acc;
    },
    {},
  );
};

export default viewerScriptWrapper;
