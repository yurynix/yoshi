import path from 'path';
import {
  SourceMapDevToolPlugin,
  EvalSourceMapDevToolPlugin,
  DevtoolModuleFilenameTemplateInfo,
} from 'webpack';

interface SourceMapPluginOpts {
  inline?: boolean;
  evaluate?: boolean;
  cheap?: boolean;
  moduleMaps?: boolean;
  showPathOnDisk?: boolean;
  publicPath?: string;
}

export function sourceMapPlugin({
  inline,
  evaluate,
  cheap,
  moduleMaps,
  showPathOnDisk,
  publicPath,
}: SourceMapPluginOpts = {}) {
  const Plugin = evaluate ? EvalSourceMapDevToolPlugin : SourceMapDevToolPlugin;

  return new Plugin({
    filename: inline ? null : '[file].map[query]',
    // Point sourcemap entries to original disk location (format as URL on Windows)
    moduleFilenameTemplate: showPathOnDisk
      ? (((info: DevtoolModuleFilenameTemplateInfo) =>
          path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')) as any)
      : undefined,
    module: moduleMaps ? true : cheap ? false : true,
    columns: cheap ? false : true,
    publicPath,
  });
}
