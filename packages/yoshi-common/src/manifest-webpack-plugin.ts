import ManifestPlugin from 'webpack-manifest-plugin';

export default class extends ManifestPlugin {
  constructor({ fileName, isDev }: { fileName: string; isDev: boolean }) {
    super({
      fileName: `${fileName}${isDev ? '' : '.min'}.json`,
      filter: ({
        isModuleAsset,
        isInitial,
        path: filePath,
      }: {
        isModuleAsset: boolean;
        isInitial: boolean;
        path: string;
      }) =>
        // Do not include assets
        !isModuleAsset &&
        // Only initial chunks included
        isInitial &&
        !filePath.endsWith('.rtl.min.css') &&
        !filePath.endsWith('.rtl.css') &&
        !filePath.endsWith('.map'),
    });
  }
}
