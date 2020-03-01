process.on('unhandledRejection', error => {
  throw error;
});

import path from 'path';
import fs from 'fs-extra';
import tempy from 'tempy';
import chalk from 'chalk';
import map from 'lodash/map';
import reverse from 'lodash/reverse';
import sortBy from 'lodash/sortBy';
import prompts from 'prompts';
import chokidar from 'chokidar';
// @ts-ignore
import clipboardy from 'clipboardy';
// import newsh from 'newsh';
import { replaceTemplates, getValuesMap } from '../src/index';
import TemplateModel from '../src/TemplateModel';
import createApp from '../src/createApp';
import { clearConsole } from '../src/utils';
import {
  symlinkModules,
  getYoshiModulesList,
} from '../../../scripts/utils/symlinkModules';
import installExternalDependencies from '../src/installExternalDependnecies';
import * as cache from './cache';

function startWatcher(workingDir: string, templateModel: TemplateModel) {
  const templatePath = templateModel.getPath();

  console.log(`Watching ${chalk.magenta(templatePath)} for changes...`);
  console.log();

  const watcher = chokidar.watch('.', {
    ignored: 'node_modules',
    persistent: true,
    ignoreInitial: true,
    cwd: templatePath,
  });

  const valuesMap = getValuesMap(templateModel);

  const generateFile = (relativePath: string) => {
    const fullPath = path.join(templatePath, relativePath);
    const fileContents = fs.readFileSync(fullPath, 'utf-8');
    const destinationPath = path.join(workingDir, relativePath);

    const transformedContents = replaceTemplates(fileContents, valuesMap, {
      graceful: true,
    });

    const transformedDestinationPath = replaceTemplates(
      destinationPath,
      valuesMap,
      { graceful: true },
    );

    fs.outputFileSync(transformedDestinationPath, transformedContents);

    console.log(
      `${path.join(path.basename(templatePath), relativePath)} ${chalk.magenta(
        '->',
      )} ${chalk.cyan(transformedDestinationPath)}`,
    );
  };

  watcher.on('change', relativePath => {
    generateFile(relativePath);
  });

  watcher.on('add', relativePath => {
    generateFile(relativePath);
  });

  watcher.on('unlink', relativePath => {
    const destinationPath = path.join(workingDir, relativePath);
    fs.removeSync(destinationPath);
    console.log(chalk.red('removed ') + chalk.cyan(destinationPath));
  });
}

async function askShouldContinueFromCache(cachedProjects: any) {
  const abortConstant = '__new_project__';
  let canceled;

  const projectsChoices = reverse(
    sortBy(
      map(cachedProjects, (value, title) => {
        const lastModified = new Date(value.lastModified);

        return {
          title: `${title}${chalk.dim.italic(
            ` (${lastModified.toLocaleString()})`,
          )}`,
          value,
        };
      }),
      'value.lastModified',
    ),
  );

  clearConsole();

  const response = await prompts(
    {
      type: 'select',
      name: 'value',
      message: `You can choose to continue an old session or start a new one`,
      choices: [
        { title: 'I want to start a new session', value: abortConstant },
        ...projectsChoices,
      ],
    },
    {
      onCancel: () => {
        canceled = true;
      },
    },
  );

  if (response.value === abortConstant || canceled) {
    return false;
  }

  response.value.templateModel = new TemplateModel(
    response.value.templateModel,
  );

  return response.value;
}

function upsertProjectInCache(
  templateModel: TemplateModel,
  workingDir: string,
) {
  const templateCacheObj = {
    [templateModel.getTitle()]: {
      templateModel,
      workingDir,
      lastModified: Date.now(),
    },
  };

  if (!cache.has()) {
    cache.set(templateCacheObj);
  } else {
    const cachedTemplates = cache.get();

    cache.set({ ...cachedTemplates, ...templateCacheObj });
  }
}

async function init() {
  let templateModel: TemplateModel;
  let workingDir;
  let chosenProject;

  if (cache.has()) {
    const cachedProjects = cache.get();

    chosenProject = await askShouldContinueFromCache(cachedProjects);
  }

  if (chosenProject) {
    // using a project from cache
    workingDir = chosenProject.workingDir;
    templateModel = chosenProject.templateModel;

    await createApp({
      workingDir,
      templateModel,
      commit: false,
      install: false,
      lint: false,
    });
  } else {
    // first time generation
    workingDir = path.join(tempy.directory(), 'generated');

    templateModel = await createApp({
      workingDir,
      install: false,
      commit: true,
      lint: false,
    });

    const yoshiModulesList = getYoshiModulesList();

    installExternalDependencies(workingDir, yoshiModulesList);
  }

  // symlink yoshi's packages
  symlinkModules(workingDir);

  upsertProjectInCache(templateModel, workingDir);

  clipboardy.writeSync(workingDir);

  console.log('> ', chalk.cyan('directory path has copied to clipboard 📋'));
  console.log();

  startWatcher(workingDir, templateModel);
}

init();
