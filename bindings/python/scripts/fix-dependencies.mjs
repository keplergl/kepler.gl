// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {readFileSync, writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const widgetRoot = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(path.join(widgetRoot, 'package.json'));
const parquetDist = path.dirname(require.resolve('@loaders.gl/parquet'));
if (!parquetDist.startsWith(path.join(widgetRoot, 'node_modules') + path.sep)) {
  throw new Error('Install the widget dependencies before patching its Parquet decoder');
}

// loaders.gl 4.5.4 drops converted_type=0 (UTF8), returning buffers for plain
// string columns. Keep both module formats consistent until fixed upstream.
const before = 'if (schemaElement.converted_type) {';
const after = 'if (schemaElement.converted_type != null) {';
const updates = ['index.cjs', 'parquetjs/parser/decoders.js'].map(file => {
  const filename = path.join(parquetDist, file);
  const source = readFileSync(filename, 'utf8');
  if (source.includes(before)) {
    return {filename, source: source.replaceAll(before, after)};
  }
  if (!source.includes(after)) {
    throw new Error(`Review the Parquet UTF8 patch after upgrading ${filename}`);
  }
  return null;
});

for (const update of updates) {
  if (update) writeFileSync(update.filename, update.source);
}
