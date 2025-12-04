// @ts-check
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintNestJs from '@darraghor/eslint-plugin-nestjs-typed';
import { baseConfig } from '../eslint-config-base/base.js';

const nestJsConfig = eslintNestJs.configs?.flatRecommended;

const spreadConfig = (config) => {
  if (!config) return [];
  return Array.isArray(config) ? config : [config];
};

export const config = [
  ...baseConfig,
  ...spreadConfig(nestJsConfig),
  {
    rules: {
      'class-methods-use-this': 'off',
      'consistent-return': 'off',
      'func-names': 'off',
      'max-len': ['error', { code: 130, ignoreTemplateLiterals: true }],
      'newline-per-chained-call': 'off',
      'no-await-in-loop': 'off',
      'no-continue': 'off',
      'no-tabs': 'off',
      'no-param-reassign': ['error', { props: false }],
      'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
      'no-underscore-dangle': [
        'error',
        { allow: ['_id', '_ga', '_gid', '_ip', '_money', '_first_deposite', '_fee', '_status_changed', '_ym_uid'] },
      ],
      'no-void': ['error', { allowAsStatement: true }],
      'object-curly-newline': 'off',
      'spaced-comment': ['error', 'always', { line: { markers: ['/', '#region', '#endregion'] } }],
      'operator-linebreak': [
        'error',
        'after',
        {
          overrides: {
            '?': 'before',
            ':': 'before',
          },
        },
      ],

      'no-dupe-class-members': 'off',
      'no-duplicate-imports': 'error',
      'no-loop-func': 'off',
      'no-return-await': 'off',
      'no-unused-expressions': 'off',
      'object-curly-spacing': 'off',
      'prefer-destructuring': 'off',

      '@typescript-eslint/consistent-indexed-object-style': 'error',
      '@typescript-eslint/consistent-type-assertions': ['error'],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-member-accessibility': ['error', { overrides: { constructors: 'no-public' } }],
      '@typescript-eslint/member-delimiter-style': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'default', format: ['strictCamelCase'] },
        {
          selector: ['variable', 'parameter', 'objectLiteralMethod'],
          modifiers: ['destructured'],
          format: ['strictCamelCase', 'snake_case'],
        },
        {
          selector: 'variable',
          format: ['strictCamelCase', 'UPPER_CASE', 'StrictPascalCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'parameter',
          modifiers: ['unused'],
          format: ['strictCamelCase'],
          leadingUnderscore: 'allow',
        },
        { selector: 'property', format: null },
        { selector: 'typeProperty', format: null },
        { selector: 'typeLike', format: ['StrictPascalCase'] },
        { selector: 'enumMember', format: ['UPPER_CASE'] },
        { selector: 'import', filter: { regex: '.Guard$', match: true }, format: ['StrictPascalCase'] },
        { selector: 'interface', format: ['PascalCase'], prefix: ['I'] },
        { selector: 'typeAlias', format: ['PascalCase'], prefix: ['T'] },
      ],
      '@typescript-eslint/no-dupe-class-members': 'error',
      '@typescript-eslint/no-floating-promises': ['error', { ignoreIIFE: true, ignoreVoid: true }],
      '@typescript-eslint/no-inferrable-types': ['error', { ignoreParameters: true, ignoreProperties: true }],
      '@typescript-eslint/no-loop-func': 'error',
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unnecessary-qualifier': 'error',
      '@typescript-eslint/no-unnecessary-type-arguments': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unnecessary-type-constraint': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/object-curly-spacing': ['error', 'always'],
      '@typescript-eslint/prefer-includes': 'off',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/return-await': 'off',
      '@typescript-eslint/typedef': [
        'error',
        { memberVariableDeclaration: true, parameter: true, propertyDeclaration: true },
      ],
      '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],
      '@typescript-eslint/indent': 'off',
      'sonarjs/assertions-in-tests': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '_',
          varsIgnorePattern: '_',
          caughtErrorsIgnorePattern: '_',
        },
      ],
      '@typescript-eslint/no-non-null-assertion': 'off',

      '@darraghor/nestjs-typed/validated-non-primitive-property-needs-type-decorator': [
        'error',
        { additionalTypeDecorators: ['IsIn'] },
      ],
      '@darraghor/nestjs-typed/api-method-should-specify-api-response': 'off',
    },
  },
  {
    files: ['src/shared/decorators/**.ts'],
    rules: {
      'no-use-extend-native/no-use-extend-native': 'off',
    },
  },
  {
    files: ['src/shared/pino-loger/**.ts', 'src/shared/decorators/**', 'src/shared/pino-loger/LoggerModule.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['src/shared/pino-loger/**'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
  {
    files: ['**/*.service.ts'],
    rules: { '@darraghor/nestjs-typed/param-decorator-name-matches-route-param': 'off' },
  },
  {
    files: ['**/LoggerModule.ts'],
    rules: { '@darraghor/nestjs-typed/provided-injected-should-match-factory-parameters': 'off' },
  },
  eslintConfigPrettier,
];

