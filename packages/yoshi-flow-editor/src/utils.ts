import path from 'path';
import { URL } from 'url';
import { StartUrl } from 'yoshi-config/build/config';
import { FlowEditorModel, ComponentModel } from './model';

export const joinDirs = (...dirs: Array<string>) =>
  path.join(process.cwd(), ...dirs);

export const normalizeStartUrlOption = (urls: StartUrl): Array<string> => {
  if (Array.isArray(urls)) {
    return urls;
  } else if (typeof urls === 'string') {
    return [urls];
  }
  return [];
};

const widgetUrlFormatter = (component: ComponentModel, baseUrl: string) => {
  return `${component.id}=${baseUrl}/${component.name}ViewerWidget.bundle.js`;
};

const tpaUrlFormatterForType = (type: 'editor' | 'settings' = 'editor') => (
  component: ComponentModel,
  baseUrl: string,
) => {
  return `${component.id}=${baseUrl}/${type}/${component.name}`;
};

const viewerScriptUrlFormatter = (model: FlowEditorModel, baseUrl: string) => {
  return `${model.appDefId}=${baseUrl}/viewerScript.bundle.js`;
};

const withComponents = (components: Array<ComponentModel>) => {
  return (baseUrl: string) => {
    return (
      formatter: (component: ComponentModel, baseUrl: string) => string,
    ) => {
      return components
        .map(component => formatter(component, baseUrl))
        .join(',');
    };
  };
};

export const overrideQueryParamsWithModel = (
  model: FlowEditorModel,
  { cdnUrl, serverUrl }: { cdnUrl: string; serverUrl: string },
) => (url: string): string => {
  const urlWithParams = new URL(url);

  const componentsWithUrl = withComponents(model.components);
  const viewerComponentsWithFormatter = componentsWithUrl(cdnUrl);
  const editorComponentsWithFormatter = componentsWithUrl(serverUrl);

  urlWithParams.searchParams.set(
    'tpaWidgetUrlOverride',
    editorComponentsWithFormatter(tpaUrlFormatterForType('editor')),
  );
  urlWithParams.searchParams.set(
    'tpaSettingsUrlOverride',
    editorComponentsWithFormatter(tpaUrlFormatterForType('settings')),
  );
  urlWithParams.searchParams.set(
    'widgetsUrlOverride',
    viewerComponentsWithFormatter(widgetUrlFormatter),
  );
  urlWithParams.searchParams.set(
    'viewerPlatformOverrides',
    viewerScriptUrlFormatter(model, cdnUrl),
  );

  // We want to have raw url for debug purposes.
  // TODO: Remove before releasing stable version.
  return decodeURIComponent(urlWithParams.toString());
};
