import path from 'path';

const moduleId = ''; // require('./package.json').name or artifactId
const { routeNamespace = moduleId, topology = {}, config = {} } = {}; // require('./src/config.json') OR somewhere

const groupId = 'com.wixpress';
const artifactId = '{%projectName%}';

export default (pages: Array<string>) => {
  const pageComponents = pages.map(filePath => {
    const { name } = path.parse(filePath);

    const pageComponentId = `${artifactId}.pages.${name}`;
    const pagesDir = path.resolve('src/poc/pages');
    const relativePath = path.relative(pagesDir, filePath);

    const route = path.join(
      routeNamespace,
      ...relativePath.split(path.delimiter).slice(0, -1),
      name !== 'index' ? name : '',
    );

    return {
      pageComponentId,
      pageComponentName: pageComponentId,
      route,
    };
  });

  return {
    moduleId: artifactId,
    mainPageComponentId: pageComponents.reduce((prev, { route, ...rest }) =>
      route.split(path.delimiter).length >
      prev.route.split(path.delimiter).length
        ? prev
        : { ...rest, route },
    ).pageComponentId,
    pageComponents,

    config: {
      topology: {
        staticsUrl: "<%= static_url('com.wixpress.{%projectName%}') %>",
        ...topology,
      },
      ...config,
    },
    bundles: [
      {
        file: `<%= static_url('${groupId}.${artifactId}') %>module.bundle.min.js`,
        debugFile: `<%= static_url('${groupId}.${artifactId}') %>module.bundle.js`,
      },
    ],
  };
};
