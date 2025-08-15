import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Repack from '@callstack/repack';
import rspack from '@rspack/core';
import pkg from 'super-app-showcase-sdk';

const { getSharedDependencies, dependencies } = pkg; // expect semver strings here

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set this when running under the Host to avoid bundling fallbacks.
// Example: AS_REMOTE=1 pnpm start
const AS_REMOTE = process.env.AS_REMOTE === '1';

export default (env) => {
  const { mode, platform } = env;

  return {
    mode,
    context: __dirname,
    entry: './index.js',
    experiments: { incremental: mode === 'development' },
    resolve: { ...Repack.getResolveOptions() },
    output: { uniqueName: 'sas-booking' },
    module: {
      rules: [
        ...Repack.getJsTransformRules(),
        ...Repack.getAssetTransformRules({ inline: true }),
      ],
    },
    plugins: [
      new Repack.RepackPlugin(),
      new Repack.plugins.ModuleFederationPluginV2({
        name: 'booking',
        filename: 'booking.container.js.bundle',
        dts: false,
        exposes: {
          './App': './src/navigation/MainNavigator',
          './UpcomingScreen': './src/screens/UpcomingScreen',
        },
        remotes: {
          auth: `auth@http://localhost:9003/${platform}/mf-manifest.json`,
        },
        shared: {
          ...getSharedDependencies({ eager: false }),
          'react-native': {
            eager: true,
            singleton: true,
            requiredVersion: dependencies['react-native'].version,
            import: AS_REMOTE ? false : undefined,
          },
        },
      }),
      new Repack.plugins.CodeSigningPlugin({
        enabled: mode === 'production',
        privateKeyPath: path.join('..', '..', 'code-signing.pem'),
      }),
      new rspack.IgnorePlugin({ resourceRegExp: /^@react-native-masked-view/ }),
    ],
  };
};
