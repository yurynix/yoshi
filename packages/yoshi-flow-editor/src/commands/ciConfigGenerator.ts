import fs from 'fs-extra';
import { CI_CONFIG } from '../constants';
import { FlowEditorModel } from '../model';

function generatePlatformBaseUrl(appName: string, baseUrl: string): string {
  return `appFields.platform.baseUrls.${appName}BaseUrl=>https://static.parastorage.com/services/${baseUrl}/{version}/`;
}

function generateViewerScriptUrl(baseUrl: string): string {
  return `appFields.platform.viewerScriptUrl=>https://static.parastorage.com/services/${baseUrl}/{version}/viewerScript.bundle.min.js`;
}

function generateWidgetsUrls(
  components: FlowEditorModel['components'],
  baseUrl: string,
  splitControllers: boolean,
): Array<string> {
  let controllerConfig;
  if (splitControllers) {
    controllerConfig = components.map(component =>
      generateWidgetControllerUrl(component, baseUrl),
    );
  } else {
    controllerConfig = [generateViewerScriptUrl(baseUrl)];
  }

  return controllerConfig.concat(
    components.map(component => generateWidgetComponentUrl(component, baseUrl)),
  );
}

function generateWidgetControllerUrl(
  { id, name }: FlowEditorModel['components'][0],
  baseUrl: string,
): string {
  return `widgets[?(@.widgetId=='${id}')].componentFields.controllerUrl=>https://static.parastorage.com/services/${baseUrl}/{version}/${name}Controller.bundle.min.js`;
}

function generateWidgetComponentUrl(
  { id, name }: FlowEditorModel['components'][0],
  baseUrl: string,
): string {
  return `widgets[?(@.widgetId=='${id}')].componentFields.componentUrl=>https://static.parastorage.com/services/${baseUrl}/{version}/${name}.bundle.min.js`;
}

export function generateCiConfig(model: FlowEditorModel) {
  const appName = model.components[0].name;
  const baseUrl = model.artifactId;
  const ciConfig = {
    app_def_id: model.appDefId,
    ignore_dependencies: 'clear',
    tpa_url_templates: [
      generatePlatformBaseUrl(appName, baseUrl),
      ...generateWidgetsUrls(model.components, baseUrl, model.splitControllers),
    ],
  };

  fs.outputJson(CI_CONFIG, ciConfig, { spaces: 2 });
}
