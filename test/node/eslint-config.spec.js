// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/** @jest-environment node */

const {ESLint} = require('eslint');

const eslint = new ESLint();

it.each([
  'src/utils/src/example.spec.ts',
  'src/components/src/example.spec.tsx',
  'src/utils/example.spec.js',
  'src/utils/src/example.spec.js',
  'test/node/example.spec.js'
])('rejects focused Jest tests in %s', async filePath => {
  const [result] = await eslint.lintText(
    "test.only('example', () => { expect(true).toBe(true); });",
    {
      filePath
    }
  );

  expect(result.messages).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ruleId: 'jest/no-focused-tests', severity: 2})
    ])
  );
});

it.each(['test/node/example-test.js', 'test/browser/example-test.js', 'src/utils/src/example.ts'])(
  'does not apply Jest rules to %s',
  async filePath => {
    const config = await eslint.calculateConfigForFile(filePath);
    expect(config.rules['jest/no-focused-tests']).toBeUndefined();
  }
);

it('preserves errors for the JavaScript specs already covered by the override', async () => {
  const existing = await eslint.calculateConfigForFile('src/utils/src/example.spec.js');
  const expanded = await eslint.calculateConfigForFile('src/utils/src/example.spec.ts');

  expect(existing.rules['jest/valid-expect'][0]).toBe('error');
  expect(expanded.rules['jest/valid-expect'][0]).toBe('warn');
});
