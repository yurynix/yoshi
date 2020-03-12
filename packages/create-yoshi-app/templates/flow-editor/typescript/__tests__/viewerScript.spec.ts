import 'isomorphic-fetch';
import createController, {
  ControllerConfig,
} from '../src/components/button/controller';
import { EXPERIMENTS_SCOPE } from '../src/config/constants';
import { mockExperiments } from '../src/components/button/controller.spec';

describe('createControllers', () => {
  let widgetConfig: any;
  beforeEach(() => {
    widgetConfig = {
      appParams: {
        baseUrls: {
          staticsBaseUrl: 'http://localhost:3200/',
        },
      },
      wixCodeApi: {
        window: {
          multilingual: {
            isEnabled: false,
          },
        },
        site: {
          language: 'en',
        },
      },
    };
  });

  it('should return controllers with pageReady method given widgets config', async () => {
    const experiments = { someExperiment: 'true' };
    mockExperiments(EXPERIMENTS_SCOPE, experiments);
    const setPropsSpy = jest.fn();
    const appParams = {
      baseUrls: {
        staticsBaseUrl: 'http://some-static-url.com',
      },
    };
    const controllerConfig: ControllerConfig = {
      appParams,
      setProps: setPropsSpy,
      wixCodeApi: {
        window: {
          multilingual: {
            isEnabled: false,
          },
        },
        site: {
          language: 'en-US',
        },
      },
    };

    const result = createController({
      frameworkData: {
        experimentsPromise: () => Promise.resolve(experiments),
      },
      widgetConfig,
      controllerConfig,
    });

    await expect(result).resolves.toHaveProperty('pageReady');
  });
});
