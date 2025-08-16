import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Repack from '@callstack/repack';
import rspack from '@rspack/core';
import pkg from 'super-app-showcase-sdk';

const { getSharedDependencies, dependencies } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Rspack configuration enhanced with Re.Pack defaults for React Native.
 *
 * Learn about Rspack configuration: https://rspack.dev/config/
 * Learn about Re.Pack configuration: https://re-pack.dev/docs/guides/configuration
 */
const AS_REMOTE = process.env.AS_REMOTE === '1';
export default env => {
  const { mode, platform = process.env.PLATFORM } = env;

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
      uniqueName: 'sas-shell',
    },
    module: {
      rules: [
        ...Repack.getJsTransformRules(),
        ...Repack.getAssetTransformRules({ inline: true }),
      ],
    },
    plugins: [
      new Repack.RepackPlugin(),
      new Repack.plugins.ModuleFederationPluginV2({
        name: 'shell',
        filename: 'shell.container.js.bundle',
        dts: false,
        exposes: {
          './App': './src/App',
        },
        remotes: {
          booking: `booking@http://localhost:9000/${platform}/mf-manifest.json`,
          shopping: `shopping@http://localhost:9001/${platform}/mf-manifest.json`,
          dashboard: `dashboard@http://localhost:9002/${platform}/mf-manifest.json`,
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
          '@react-navigation/native-stack': {
            eager: true,
            singleton: true,
            requiredVersion: dependencies['@react-navigation/native-stack'].version,
            import: AS_REMOTE ? false : undefined,
          },
          '@react-navigation/native': {
            eager: true,
            singleton: true,
            requiredVersion: dependencies['@react-navigation/native'].version,
            import: AS_REMOTE ? false : undefined,
          },
          'react-native-screens': {
            eager: true,
            singleton: true,
            requiredVersion: dependencies['react-native-screens'].version,
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
