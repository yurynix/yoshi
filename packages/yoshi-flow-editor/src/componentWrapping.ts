import path from 'path';
import fs from 'fs-extra';
import { Dictionary } from './types';
import { FlowEditorModel } from './model';

const widgetWrapperPath = 'yoshi-flow-editor-runtime/build/WidgetWrapper.js';

const componentWrapper = (
  generatedWidgetEntriesPath: string,
  model: FlowEditorModel,
) => {
  return model.components.reduce(
    (acc: Dictionary<string>, component: FlowEditorModel['components'][0]) => {
      const generatedWidgetEntryPath = path.join(
        generatedWidgetEntriesPath,
        `${component.name}Component.js`,
      );

      const generateWidgetEntryContent = `
    import WidgetWrapper from '${widgetWrapperPath}';
    import Widget from '${component.component}';

    export default { component: WidgetWrapper(Widget)};`;

      fs.outputFileSync(generatedWidgetEntryPath, generateWidgetEntryContent);

      acc[`${component.name}ViewerWidget`] = generatedWidgetEntryPath;

      return acc;
    },
    {},
  );
};

export default componentWrapper;
