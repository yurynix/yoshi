import verifyNodeVersion from './verify-node-version';
import verifyDependencies from './verify-dependencies';
import verifyDependencyTree from './verify-dependency-tree';

const skipPreflight = process.env.SKIP_PREFLIGHT_CHECKS === 'true';

export default async function runPreflightChecks() {
  if (!skipPreflight) {
    verifyNodeVersion();
    await verifyDependencies();
    verifyDependencyTree();
  }
}
