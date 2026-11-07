module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
    'jest/globals': true
  },
  globals: {
    page: true,
    browser: true,
    context: true,
    jestPuppeteer: true
  },
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:prettier/recommended', 'plugin:react-hooks/recommended'],
  plugins: ['babel', 'prettier', 'react'],
  rules: {
    'valid-jsdoc': 0,
    'no-var': 0,
    'max-len': 0,
    'react/no-did-mount-set-state': 0,
    'react/no-multi-comp': 0,
    'react/sort-comp': 0,
    'no-use-before-define': 'off',
    'prefer-spread': 1,
    'prefer-template': 1,
    'prettier/prettier': 'error',
    'quote-props': 0,
    'spaced-comment': 1,
    'max-params': 0,
    'no-multiple-empty-lines': 1,
    'no-process-env': 0,
    'no-inline-comments': 0,
    'no-invalid-this': 0,
    'no-unused-expressions': 0,
    'no-undef': 0,
    camelcase: 0,
    'consistent-return': 0,
    'comma-dangle': 1,
    'no-constant-condition': ['error', {checkLoops: false}],
    'no-unused-vars': ['warn', {argsIgnorePattern: '^_', varsIgnorePattern: '^_'}],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {argsIgnorePattern: '^_', varsIgnorePattern: '^_'}
    ]
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      // Plugins like @typescript-eslint provide different ruleset configs that can be extended
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        // This doesn't enable extra rules, but rather just helps with TS settings
        'plugin:import/typescript'
      ],
      rules: {
        // TODO: Replace any declarations and enable
        '@typescript-eslint/no-explicit-any': 'off',
        // TODO: Enable this rule and provide description or fix the errors
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-var-requires': 'off'
      }
    },
    {
      files: ['src/**/src/**/*.spec.js'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
      rules: {'jest/prefer-expect-assertions': 'off'}
    },
    {
      // Match the remaining Jest testMatch patterns without changing the rules
      // for the JavaScript specs covered above. Tape uses *-test.js.
      files: ['src/**/*.spec.{js,ts,tsx}', 'test/**/*.spec.js'],
      excludedFiles: ['src/**/src/**/*.spec.js'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
      rules: {
        'jest/prefer-expect-assertions': 'off',
        // Existing suites use conditional checks, dynamic titles, exported fixtures,
        // setup assertions and promises awaited later. Surface these for review
        // without blocking CI or rewriting unrelated tests during this rollout.
        'jest/no-conditional-expect': 'warn',
        'jest/no-identical-title': 'warn',
        'jest/no-export': 'warn',
        'jest/no-standalone-expect': 'warn',
        'jest/valid-expect': 'warn',
        'jest/valid-title': 'warn'
      }
    }
  ],
  settings: {
    react: {
      version: 'detect'
    },
    // Settings related to eslint-plugin-import
    'import/resolver': {
      // Settings for eslint-import-resolver-typescript which resolves
      // typescript aliases based on tsconfig.json "paths"
      typescript: {
        project: './tsconfig.json'
      }
    }
  }
};
