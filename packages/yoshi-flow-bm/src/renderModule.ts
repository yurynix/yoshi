import path from 'path';
import fs from 'fs';

const renderModule = () => {
  const tempPath = path.resolve(__dirname, '../tmp');
  const filePath = path.join(tempPath, 'module.ts');

  const moduleId = require(path.join(process.cwd(), 'package.json'))
    .name.split('/')
    .pop();

  const localePath = path.join(process.cwd(), 'translations');

  const pages = ['index'].map(filename => ({
    componentId: `${moduleId}.pages.${filename}`,
    componentPath: path.join(process.cwd(), `pages/${filename}`),
  })); // ./src/pages/**/*.{ts,tsx}

  const components = ['LegacyTodoList'].map(filename => ({
    componentId: `${moduleId}.components.${filename}`,
    componentPath: path.join(process.cwd(), `components/${filename}`),
  })); // ./src/components/**/*.{ts,tsx}

  const methods = ['getTodos'].map(filename => ({
    methodId: `${moduleId}.methods.${filename}`,
    methodPath: path.join(process.cwd(), `methods/${filename}`),
  })); // ./src/methods/**/*.{ts,tsx}

  const moduleInitPath = path.join(process.cwd(), 'moduleInit'); // require('./src/moduleInit.ts')

  const moduleConfig = {}; // require('./src/config.json') OR somewhere

  fs.mkdirSync(tempPath, { recursive: true });
  fs.writeFileSync(
    filePath,
    `import { createModule } from 'yoshi-flow-bm-runtime';

createModule({
  moduleId: '${moduleId}',
  pages: [
    ${pages.map(
      ({ componentId, componentPath }) => `
      {
        componentId: '${componentId}',
        loadComponent: async () => (await import('${componentPath}')).default,
      },
    `,
    )}
  ],
  components: [
    ${components.map(
      ({ componentId, componentPath }) => `
      {
        componentId: '${componentId}',
        loadComponent: async () => (await import('${componentPath}')).default,
      },
    `,
    )}
  ],
  methods: [
    ${methods.map(
      ({ methodId, methodPath }) => `
      {
        methodId: '${methodId}',
        loadMethod: () => require('${methodPath}').default,
      }`,
    )}
  ], // ${JSON.stringify(methods)},
  moduleInit: require('${moduleInitPath}').default,
  loadLocale: locale => import(\`${localePath}/\${locale}\`),
  config: ${JSON.stringify(moduleConfig)},
});`,
  );

  return filePath;
};

export default renderModule;
