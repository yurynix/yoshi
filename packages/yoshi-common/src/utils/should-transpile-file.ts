import path from 'path';
import config from 'yoshi-config';

export default (p: string): boolean => {
  const allSourcesButExternalModules = (filePath: string) => {
    filePath = path.normalize(filePath);

    return (
      filePath.startsWith(process.cwd()) && !filePath.includes('node_modules')
    );
  };

  // Hacky until `editor-elements`' build is ready
  const isEditorElements = (filePath: string) => {
    return (
      config.name === 'thunderbolt' && filePath.includes('editor-elements')
    );
  };

  const isWixStyleReactSource = (filePath: string) => {
    return filePath.includes('node_modules/wix-style-react/src');
  };

  const externalRegexList = config.externalUnprocessedModules.map(
    m => new RegExp(`node_modules/${m}`),
  );

  return (
    externalRegexList.some(regex => regex.test(p)) ||
    allSourcesButExternalModules(p) ||
    isWixStyleReactSource(p) ||
    isEditorElements(p)
  );
};
