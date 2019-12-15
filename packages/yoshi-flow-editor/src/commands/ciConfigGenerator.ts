import fs from 'fs-extra';
import { CI_CONFIG } from '../constants';

type Widget = { id: string; name: string };

function generatePlatformBaseUrl(appName: string, baseUrl: string): string {
  return `appFields.platform.baseUrls.${appName}BaseUrl=>https://static.parastorage.com/services/${baseUrl}/{version}/`;
}

function generateWidgetsUrls(
  widgets: Array<Widget>,
  baseUrl: string,
): Array<string> {
  return widgets
    .map(widget => generateWidgetComponentUrl(widget, baseUrl))
    .concat(
      widgets.map(widget => generateWidgetControllerUrl(widget, baseUrl)),
    );
}

function generateWidgetControllerUrl(
  { id, name }: Widget,
  baseUrl: string,
): string {
  return `widgets[?(@.widgetId=='${id}')].componentFields.controllerUrl=>https://static.parastorage.com/services/${baseUrl}/{version}/${name}Controller.bundle.min.js`;
}

function generateWidgetComponentUrl(
  { id, name }: Widget,
  baseUrl: string,
): string {
  return `widgets[?(@.widgetId=='${id}')].componentFields.componentUrl=>https://static.parastorage.com/services/${baseUrl}/{version}/${name}.bundle.min.js`;
}

export function generateCiConfig(
  appDefId: string,
  appName: string,
  baseUrl: string,
  widgets: Array<Widget>,
) {
  const ciConfig = {
    app_def_id: appDefId,
    ignore_dependencies: 'clear',
    tpa_url_templates: [
      generatePlatformBaseUrl(appName, baseUrl),
      ...generateWidgetsUrls(widgets, baseUrl),
    ],
  };

  fs.outputJson(CI_CONFIG, ciConfig, { spaces: 2 });
}
