// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import fs from 'fs';
import path from 'path';
import test from 'tape';

const ROOT = path.resolve(__dirname, '../..');

const LOCKFILES = [
  'yarn.lock',
  'website/yarn.lock',
  'examples/demo-app/yarn.lock',
  'examples/demo-app-sqlrooms/yarn.lock',
  'examples/custom-reducer/yarn.lock',
  'examples/custom-theme/yarn.lock',
  'examples/node-app/yarn.lock',
  'examples/open-modal/yarn.lock',
  'examples/replace-component/yarn.lock'
];

// Minimum version on each release line. A 0.x line is major.minor because
// those packages break across minor versions.
const FLOORS = {
  '@xmldom/xmldom': {0.8: '0.8.15'},
  axios: {1: '1.20.0'},
  'brace-expansion': {1: '1.1.21', 2: '2.1.7', 5: '5.0.12'},
  compression: {1: '1.8.2'},
  dompurify: {3: '3.4.16'},
  'fast-uri': {3: '3.1.7'},
  fflate: {0.7: '0.7.5', 0.8: '0.8.3'},
  handlebars: {4: '4.7.10'},
  'ip-address': {10: '10.7.1'},
  'js-yaml': {3: '3.15.2', 4: '4.3.2'},
  'proxy-addr': {2: '2.0.8'},
  'shell-quote': {1: '1.11.0'},
  'source-map-js': {1: '1.2.2'}
};

function compareVersions(left, right) {
  const a = left.split('.').map(part => parseInt(part, 10));
  const b = right.split('.').map(part => parseInt(part, 10));
  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i++) {
    const diff = (a[i] || 0) - (b[i] || 0);
    if (diff !== 0) {
      return diff;
    }
  }
  return 0;
}

function releaseLine(version) {
  const [major, minor] = version.split('.');
  return major === '0' ? `0.${minor}` : major;
}

function resolvedVersions(lockText) {
  const versions = new Map();
  const lines = lockText.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line || line.startsWith(' ') || !line.endsWith(':')) {
      continue;
    }

    const header = line.replace(/^"|"?:$/g, '');
    const names = header
      .split(', ')
      .map(descriptor => {
        const match = descriptor.match(/^(@?[^@]+)@/);
        return match ? match[1] : null;
      })
      .filter(Boolean);

    let version = null;
    for (let j = i + 1; j < lines.length && lines[j].startsWith(' '); j++) {
      const match = lines[j].match(/^ {2}version: "?([^"\s]+)"?$/);
      if (match) {
        version = match[1];
        break;
      }
    }
    if (!version) {
      continue;
    }

    names.forEach(name => {
      if (!FLOORS[name]) {
        return;
      }
      if (!versions.has(name)) {
        versions.set(name, new Set());
      }
      versions.get(name).add(version);
    });
  }

  return versions;
}

test('lockfiles resolve patched versions of known vulnerable transitive dependencies', t => {
  LOCKFILES.forEach(rel => {
    const versions = resolvedVersions(fs.readFileSync(path.join(ROOT, rel), 'utf8'));

    Object.keys(FLOORS).forEach(name => {
      const resolved = versions.get(name);
      if (!resolved) {
        return;
      }

      resolved.forEach(version => {
        const floor = FLOORS[name][releaseLine(version)];
        t.ok(
          floor && compareVersions(version, floor) >= 0,
          `${rel} resolves ${name}@${version}, which must be >= ${
            floor || 'a patched release line'
          }`
        );
      });
    });
  });

  t.end();
});
