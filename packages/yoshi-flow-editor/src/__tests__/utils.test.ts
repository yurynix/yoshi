import { silent as silentCwd } from 'import-cwd';
import lodash from 'lodash';
import { WIDGET_COMPONENT_TYPE, PAGE_COMPONENT_TYPE } from '../constants';
import { overrideQueryParamsWithModel, webWorkerExternals } from '../utils';

jest.mock('import-cwd', () => ({
  silent(pkg: string) {
    if (pkg === 'lodash') {
      const lodashMock = {};
      lodashMock.hasOwnProperty = prop => {
        if (prop === 'someNewLodashMethod') {
          return true;
        }
        return lodash.hasOwnProperty(prop);
      };
      return lodashMock;
    }
    return silentCwd(pkg);
  },
}));

describe('addOverrideQueryParamsWithModel', () => {
  const cdnUrl = 'https://localhost:5005/';
  const serverUrl = 'https://localhost:5004';
  it('generates override params for single url', () => {
    const overrideParams = overrideQueryParamsWithModel(
      {
        appName: 'app',
        artifactId: '7891',
        editorEntryFileName: 'a/b/editor.app.ts',
        viewerAppFileName: 'a/b',
        appDefId: 'APP_DEF_ID',
        components: [
          {
            name: 'comp',
            id: 'WIDGET_ID',
            type: WIDGET_COMPONENT_TYPE,
            widgetFileName: 'proj/comp/Widget.ts',
            viewerControllerFileName: 'proj/comp/controller.ts',
            editorControllerFileName: null,
            settingsFileName: 'proj/comp/settings.ts',
          },
        ],
      },
      { cdnUrl, serverUrl },
    );
    const urlWithParams = overrideParams('https://mysite.com');

    expect(urlWithParams).toBe(
      `https://mysite.com/?tpaWidgetUrlOverride=WIDGET_ID=${serverUrl}/editor/comp&tpaSettingsUrlOverride=WIDGET_ID=${serverUrl}/settings/comp&widgetsUrlOverride=WIDGET_ID=${cdnUrl}compViewerWidget.bundle.js&viewerPlatformOverrides=APP_DEF_ID=${cdnUrl}viewerScript.bundle.js&editorScriptUrlOverride=APP_DEF_ID=${cdnUrl}editorScript.bundle.js&overridePlatformBaseUrls=APP_DEF_ID={"staticsBaseUrl":"${cdnUrl}"}`,
    );
  });

  it('generates override params for multiple url', () => {
    const overrideParams = overrideQueryParamsWithModel(
      {
        appName: 'app',
        artifactId: '7891',
        editorEntryFileName: 'a/b/editor.app.ts',
        viewerAppFileName: 'a/b',
        appDefId: 'APP_DEF_ID',
        components: [
          {
            name: 'comp',
            id: 'COMP_WIDGET_ID',
            type: WIDGET_COMPONENT_TYPE,
            widgetFileName: 'proj/comp/Widget.ts',
            viewerControllerFileName: 'proj/comp/controller.ts',
            editorControllerFileName: null,
            settingsFileName: 'proj/comp/settings.ts',
          },
          {
            name: 'page',
            id: 'PAGE_WIDGET_ID',
            type: PAGE_COMPONENT_TYPE,
            widgetFileName: 'proj/page/Widget.ts',
            viewerControllerFileName: 'proj/page/controller.ts',
            editorControllerFileName: null,
            settingsFileName: 'proj/page/settings.ts',
          },
        ],
      },
      { cdnUrl, serverUrl },
    );
    const urlWithParams = overrideParams('https://mysite.com');

    expect(urlWithParams).toBe(
      `https://mysite.com/?tpaWidgetUrlOverride=COMP_WIDGET_ID=${serverUrl}/editor/comp,PAGE_WIDGET_ID=${serverUrl}/editor/page&tpaSettingsUrlOverride=COMP_WIDGET_ID=${serverUrl}/settings/comp,PAGE_WIDGET_ID=${serverUrl}/settings/page&widgetsUrlOverride=COMP_WIDGET_ID=${cdnUrl}compViewerWidget.bundle.js,PAGE_WIDGET_ID=${cdnUrl}pageViewerWidget.bundle.js&viewerPlatformOverrides=APP_DEF_ID=${cdnUrl}viewerScript.bundle.js&editorScriptUrlOverride=APP_DEF_ID=${cdnUrl}editorScript.bundle.js&overridePlatformBaseUrls=APP_DEF_ID={"staticsBaseUrl":"${cdnUrl}"}`,
    );
  });

  it("doesn't generate override params for editor script", () => {
    const overrideParams = overrideQueryParamsWithModel(
      {
        appName: 'app',
        artifactId: '7891',
        editorEntryFileName: null,
        viewerAppFileName: 'a/b',
        appDefId: 'APP_DEF_ID',
        components: [
          {
            name: 'comp',
            id: 'WIDGET_ID',
            type: WIDGET_COMPONENT_TYPE,
            widgetFileName: 'proj/comp/Widget.ts',
            viewerControllerFileName: 'proj/comp/controller.ts',
            editorControllerFileName: null,
            settingsFileName: 'proj/comp/settings.ts',
          },
        ],
      },
      { cdnUrl, serverUrl },
    );
    const urlWithParams = overrideParams('https://mysite.com');

    expect(urlWithParams).toBe(
      `https://mysite.com/?tpaWidgetUrlOverride=WIDGET_ID=${serverUrl}/editor/comp&tpaSettingsUrlOverride=WIDGET_ID=${serverUrl}/settings/comp&widgetsUrlOverride=WIDGET_ID=${cdnUrl}compViewerWidget.bundle.js&viewerPlatformOverrides=APP_DEF_ID=${cdnUrl}viewerScript.bundle.js&overridePlatformBaseUrls=APP_DEF_ID={"staticsBaseUrl":"${cdnUrl}"}`,
    );
  });
});

describe('webWorkerExternals', () => {
  const externalsFn = webWorkerExternals[0];
  it('should generate externals pointed to `_` for default lodash import (`lodash`)', () => {
    const fn = jest.fn();
    externalsFn(null, 'lodash', fn);
    expect(fn).toHaveBeenCalledWith(null, 'root _');
  });

  it('should generate externals pointed to `.get` for cherry-pick lodash import (`lodash/get`)', () => {
    const fn = jest.fn();
    externalsFn(null, 'lodash/get', fn);
    expect(fn).toHaveBeenCalledWith(null, 'root _.get');
  });

  it('should generate externals pointed to `.isFunction` for cherry-pick lodash import (`lodash/isFunction`)', () => {
    const fn = jest.fn();
    externalsFn(null, 'lodash/isFunction', fn);
    expect(fn).toHaveBeenCalledWith(null, 'root _.isFunction');
  });

  it("should ignore imports for lodash method that doesn't exist", () => {
    const fn = jest.fn();
    externalsFn(null, 'lodash/kekekek', fn);
    expect(fn).toHaveBeenCalledWith();
  });

  it('should generate externals pointed to `.someNewLodashMethod` for custom lodash version', () => {
    const fn = jest.fn();
    externalsFn(null, 'lodash/someNewLodashMethod', fn);
    expect(fn).toHaveBeenCalledWith(null, 'root _.someNewLodashMethod');
  });

  it('should ignore imports not related to lodash', () => {
    const fn = jest.fn();
    externalsFn(null, 'yoshi', fn);
    expect(fn).toHaveBeenCalledWith();
  });

  it('should ignore lodash-like imports', () => {
    const fn = jest.fn();
    externalsFn(null, 'lodash-fn', fn);
    expect(fn).toHaveBeenCalledWith();
  });
});
