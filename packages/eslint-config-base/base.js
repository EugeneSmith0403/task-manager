// @ts-check
import tseslint from 'typescript-eslint';
import eslintPluginNoUseExtendNative from 'eslint-plugin-no-use-extend-native';
import pluginPromise from 'eslint-plugin-promise';
import perfectionist from 'eslint-plugin-perfectionist';

const noUseExtendNativeConfig = eslintPluginNoUseExtendNative.configs?.recommended;
const promiseConfig = pluginPromise.configs?.['flat/recommended'];
const perfectionistConfig = perfectionist.configs?.['recommended-natural'];

const spreadConfig = (config) => {
  if (!config) return [];
  return Array.isArray(config) ? config : [config];
};

export const baseConfig = [
  {
    ignores: ['dist/**', '**/node_modules/**', 'eslint.config.mjs', '*.d.ts', '**/coverage'],
  },
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  ...spreadConfig(noUseExtendNativeConfig),
  ...spreadConfig(promiseConfig),
  ...spreadConfig(perfectionistConfig),
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.ts'],
  },
].filter(Boolean);

