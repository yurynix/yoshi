import { createInstances, objectPromiseAll, fetchFrameworkData } from './utils';

let frameworkData: any;

export const createControllers = (
  createController: Function,
  initApp: Function,
) => (controllerConfigs: any) => {
  const wrappedControllers = controllerConfigs.map((controllerConfig: any) => {
    const { appParams, platformAPIs, wixCodeApi, csrfToken } = controllerConfig;

    initializeExperiments();

    const appData = initApp({
      controllerConfigs,
      frameworkData,
      appParams,
      platformAPIs,
      wixCodeApi,
      csrfToken,
    });

    const { setProps } = controllerConfig;

    const setState = (newState: any) => {
      const updatedState = {
        ...context.state,
        ...newState,
      };

      // Track state
      context.state = updatedState;

      // Run state change callback
      wrappedController.then((userController: any) => {
        userController.stateChange();
      });

      // Update render cycle
      return setProps(updatedState);
    };

    const context = {
      state: {},
      setState,
    };

    const userControllerPromise = createController.call(context, {
      controllerConfig,
      frameworkData,
      appData,
    });

    const wrappedController = Promise.resolve(userControllerPromise).then(
      (userController: any) => {
        return {
          ...userController,
          pageReady: async (...args: Array<any>) => {
            const awaitedFrameworkData = await objectPromiseAll(frameworkData);

            setProps({
              __publicData__: controllerConfig.config.publicData,
              ...awaitedFrameworkData,
              // Set initial state
              ...context.state,
              // Set methods
              ...userController.methods,
            });

            // Optional `pageReady`
            if (userController.pageReady) {
              return userController.pageReady(setProps, ...args);
            }
          },
        };
      },
    );
    return wrappedController;
  });

  return wrappedControllers;
};

const initializeExperiments = () => {
  frameworkData = fetchFrameworkData();

  // TODO: Generalize
  frameworkData.experimentsPromise = frameworkData.experimentsPromise.then(
    (experiments: any) => createInstances({ experiments }),
  );
};

export const initAppForPage = async () =>
  // initParams,
  // platformApis,
  // scopedSdkApis,
  // platformServicesApis,
  {};

const getCreateController = (controllerInstances: any, type: string) => {
  if (controllerInstances && controllerInstances[type]) {
    const controllerFunction = Object.keys(controllerInstances[type]).filter(
      k => k.toLowerCase().indexOf('controller') > -1,
    )[0];
    return controllerInstances[type][controllerFunction];
  }
};

export const createUnifiedControllers = (
  controllerConfigs: any,
  controllerInstances: any,
) => {
  return controllerConfigs.map((props: any) => {
    const createController = getCreateController(
      controllerInstances,
      props.type,
    );
    return Promise.resolve(
      createController({
        config: props.config,
        compId: props.compId,
        setProps: props.setProps,
        platformAPIs: props.platformAPIs,
        type: props.type,
        warmupData: props.warmupData,
        wixCodeApi: props.wixCodeApi,
      }),
    );
  });
};
