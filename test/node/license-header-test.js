// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import fs from 'fs';
import path from 'path';
import test from 'tape';
import {extract, parse} from 'jest-docblock';
import LicenseFixer from '../../scripts/license-header/license-fixer.mjs';

const license = fs.readFileSync(path.resolve(__dirname, '../../FILE-HEADER'), 'utf8');

test('license headers preserve Jest environment selection across repeated release runs', t => {
  const fixer = new LicenseFixer({silent: true});
  fixer.setLicense(license);
  fixer.addLicense(license);

  const body = "import WebSocket from 'ws';\n";
  const directive = '/** @jest-environment node */';
  const cases = [
    `${directive}\n\n${body}`,
    `/**\n * @jest-environment node\n * @jest-environment-options {"customExportConditions":["node"]}\n */\n${body}`,
    `${fixer.slashLicense}\n${directive}\n\n${body}`,
    `${fixer.slashLicense}\n${directive}${body}`
  ];

  cases.forEach((source, index) => {
    const result = fixer.fixContent('bridge-server.spec.ts', source);
    const pragmas = parse(extract(result));
    t.equal(pragmas['jest-environment'], 'node', `case ${index}: Jest selects Node`);
    t.ok(result.includes(fixer.slashLicense), `case ${index}: includes the license`);
    t.ok(result.endsWith(body), `case ${index}: preserves the test code`);
    t.equal(fixer.fixContent('bridge-server.spec.ts', result), result, `case ${index}: idempotent`);
    if (index === 1) {
      t.equal(
        pragmas['jest-environment-options'],
        '{"customExportConditions":["node"]}',
        'preserves environment options'
      );
    }
  });
  t.end();
});
