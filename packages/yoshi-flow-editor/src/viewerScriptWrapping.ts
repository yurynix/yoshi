import path from 'path';
import fs from 'fs-extra';
import { Dictionary } from './types';
import { FlowEditorModel } from './model';

const viewerScriptWrapperPath =
  'yoshi-flow-editor-runtime/build/viewerScript.js';

const viewerScriptWrapper = (
  generatedWidgetEntriesPath: string,
  model: FlowEditorModel,
) => {
  const generatedViewerScriptEntryPath = path.join(
    generatedWidgetEntriesPath,
    `viewerScript.js`,
  );

  const generateViewerScriptEntryContent = `
    import {createUnifiedControllers} from '${viewerScriptWrapperPath}';
    export default createUnifiedControllers;`;

  fs.outputFileSync(
    generatedViewerScriptEntryPath,
    generateViewerScriptEntryContent,
  );
  const viewerScript = generatedViewerScriptEntryPath;

  return model.components.reduce(
    (acc: Dictionary<string>, component: FlowEditorModel['components'][0]) => {
      const generatedWidgetEntryPath = path.join(
        generatedWidgetEntriesPath,
        `${component.name}ViewerScript.js`,
      );

      const generateControllerEntryContent = `
    import {createControllers as createControllersWrapper, initAppForPage as initAppForPageWrapper} from '${viewerScriptWrapperPath}';
    import userController from '${component.controller}';
    import userInitApp from '${model.initApp}';

    export const initAppForPage = initAppForPageWrapper;
    export const createControllers = createControllersWrapper(userController, userInitApp);`;

      fs.outputFileSync(
        generatedWidgetEntryPath,
        generateControllerEntryContent,
      );

      acc[`${component.name}viewerScript`] = generatedWidgetEntryPath;

      return acc;
    },
    { viewerScript },
  );
};

export default viewerScriptWrapper;
