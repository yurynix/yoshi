// https://github.com/wix-platform/wix-node-platform/tree/master/bootstrap/wix-bootstrap-testkit
import * as BootstrapTestkit from '@wix/wix-bootstrap-testkit';

// https://github.com/wix-platform/wix-node-platform/tree/master/testing/wix-test-env
import * as TestEnv from '@wix/wix-test-env';

export const envBuilder = TestEnv.builder()
  .withMainApp(BootstrapTestkit.app('./index')) // start the server as an embedded app
  .withEnvVars({ DEBUG: process.env.DEBUG }) // suppress excessive logging
  .withMainAppConfigEmitter(builder =>
    builder.val('scripts_domain', 'static.parastorage.com'),
  )
  .withAxios();
