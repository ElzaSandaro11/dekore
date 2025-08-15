import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Repack from '@callstack/repack';
import rspack from '@rspack/core';
import pkg from 'super-app-showcase-sdk';

const { getSharedDependencies, dependencies } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STANDALONE = Boolean(process.env.STANDALONE);

/**
 * Rspack configuration enhanced with Re.Pack defaults for React Native.
 *
 * Learn about Rspack configuration: https://rspack.dev/config/
 * Learn about Re.Pack configuration: https://re-pack.dev/docs/guides/configuration
 */
const AS_REMOTE = process.env.AS_REMOTE === '1';

export default env => {
  const { mode, platform } = env;

  return {
    mode,
    context: __dirname,
    entry: './index.js',
    experiments: {
      incremental: mode === 'development',
    },
    resolve: {
      ...Repack.getResolveOptions(),
    },
    output: {
      uniqueName: 'sas-dashboard',
    },
    module: {
      rules: [
        ...Repack.getJsTransformRules(),
        ...Repack.getAssetTransformRules({ inline: !STANDALONE }),
      ],
    },
    plugins: [
      new Repack.RepackPlugin(),
      new Repack.plugins.ModuleFederationPluginV2({
        name: 'dashboard',
        filename: 'dashboard.container.js.bundle',
        dts: false,
        exposes: STANDALONE
          ? undefined
          : { './App': './src/navigation/MainNavigator' },
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
      // silence missing @react-native-masked-view optionally required by @react-navigation/elements
      new rspack.IgnorePlugin({
        resourceRegExp: /^@react-native-masked-view/,
      }),
    ],
  };
};
