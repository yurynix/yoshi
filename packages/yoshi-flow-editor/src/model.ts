import path from 'path';
import globby from 'globby';
import { getProjectArtifactId } from 'yoshi-helpers/utils';
import resolve from 'resolve';
import fs from 'fs-extra';
import { Config } from 'yoshi-config/build/config';

export interface FlowEditorModel {
  appName: string;
  appDefId: string;
  artifactId: string;
  initApp: string;
  components: Array<ComponentModel>;
}

type ComponentType = 'widget' | 'page';

export interface ComponentModel {
  name: string;
  type: ComponentType;
  fileName: string;
  controllerFileName: string;
  settingsFileName: string | null;
  id: string | null;
}

export interface ComponentConfig {
  id: string;
}

const extensions = ['.tsx', '.ts', '.js', '.json'];
function resolveFrom(dir: string, fileName: string): string | null {
  try {
    return resolve.sync(path.join(dir, fileName), {
      extensions,
    });
  } catch (error) {
    return null;
  }
}

function getComponentConfig(path: string): ComponentConfig {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

export async function generateFlowEditorModel(
  config: Config,
): Promise<FlowEditorModel> {
  const artifactId = getProjectArtifactId();
  if (!artifactId) {
    throw new Error(`artifact id not provided.
    Please insert <artifactId>yourArtifactId</artifactId> in your "pom.xml"`);
  }

  const rootPath = process.cwd();
  const initApp = resolveFrom(path.join(rootPath, 'src'), 'app');
  if (!initApp) {
    throw new Error(`Missing app file.
    Please create "app.js/ts" file in "${path.resolve('./src')}" directory`);
  }

  const componentsDirectories = await globby('./src/components/*', {
    onlyDirectories: true,
    absolute: true,
  });

  const componentsModel: Array<ComponentModel> = componentsDirectories.map(
    componentDirectory => {
      const componentName = path.basename(componentDirectory);
      const resolveFromComponents = resolveFrom.bind(null, componentDirectory);

      const widgetFileName = resolveFromComponents('Widget');
      const pageFileName = resolveFromComponents('Page');
      const controllerFileName = resolveFromComponents('controller');
      const settingsFileName = resolveFromComponents('Settings');
      const configFileName = resolveFromComponents('.component');
      const componentConfig =
        configFileName && getComponentConfig(configFileName);
      const componentPathRelativeToRoot = path.relative(
        rootPath,
        componentDirectory,
      );

      // Use just console.errors on current project stage. Move to errors in future.
      if (!componentConfig || !componentConfig.id) {
        console.warn(`Seems like you added new component and didn't specify "id" for it.
You should register it in dev-center and paste id of it to ".component.json" in the widget directory: ${componentPathRelativeToRoot}.
For more info, visit http://tiny.cc/dev-center-registration`);
      }

      if (!controllerFileName) {
        throw new Error(`Missing controller file for the component in "${componentPathRelativeToRoot}".
        Please create "controller.js/ts" file in "${componentPathRelativeToRoot}" directory`);
      }

      if (!widgetFileName && !pageFileName) {
        throw new Error(`Missing widget or page file for the component in "${componentPathRelativeToRoot}".
        Please create either Widget.js/ts/tsx or Page.js/ts/tsx file in "${componentPathRelativeToRoot}" directory`);
      }

      return {
        name: componentName,
        fileName: (widgetFileName || pageFileName) as string,
        type: widgetFileName ? 'widget' : 'page',
        controllerFileName,
        settingsFileName,
        id: componentConfig ? componentConfig.id : null,
      };
    },
  );

  return {
    appName: config.name,
    // TODO: import from named export
    appDefId: '',
    artifactId,
    initApp,
    components: componentsModel,
  };
}
