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
  'd3-color': {3: '3.1.0'},
  dompurify: {3: '3.4.17'},
  'fast-uri': {3: '3.1.9'},
  fflate: {0.7: '0.7.5', 0.8: '0.8.3'},
  'follow-redirects': {1: '1.16.1'},
  handlebars: {4: '4.7.10'},
  'ip-address': {10: '10.7.4'},
  'js-yaml': {3: '3.15.2', 4: '4.3.2'},
  moment: {2: '2.31.0'},
  'node-fetch': {2: '2.6.7'},
  'postcss-selector-parser': {6: '6.1.5', 7: '7.1.6'},
  'proxy-addr': {2: '2.0.8'},
  qs: {6: '6.16.1'},
  'shell-quote': {1: '1.11.0'},
  'smol-toml': {1: '1.9.0'},
  'source-map-js': {1: '1.2.2'},
  thrift: {0.23: '0.23.0'}
};

// The standalone projects use PostCSS 8. The root still has a legacy
// PostCSS 7 tree through Stylelint that needs a separate tooling upgrade.
const STANDALONE_FLOORS = {...FLOORS, postcss: {8: '8.5.23'}};

// These patches apply to the root build tools. Examples have separate trees.
const ROOT_FLOORS = {
  ...FLOORS,
  'launch-editor': {2: '2.14.2'},
  undici: {6: '6.29.1'}
};

// These existing legacy copies need parent upgrades. Other versions and
// lockfile locations must still fail the security checks.
const LEGACY_EXCEPTIONS = {
  'yarn.lock': {zod: '3.25.76'},
  'examples/demo-app/yarn.lock': {undici: '5.29.0'},
  'examples/demo-app-sqlrooms/yarn.lock': {undici: '5.29.0'}
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

function isKnownLegacyDependency(rel, name, version) {
  return LEGACY_EXCEPTIONS[rel]?.[name] === version;
}

function resolvedVersions(lockText, floors) {
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
      if (!floors[name]) {
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
    const floors = rel === 'yarn.lock' ? ROOT_FLOORS : STANDALONE_FLOORS;
    const versions = resolvedVersions(fs.readFileSync(path.join(ROOT, rel), 'utf8'), floors);

    Object.keys(floors).forEach(name => {
      const resolved = versions.get(name);
      if (!resolved) {
        return;
      }

      resolved.forEach(version => {
        const floor = floors[name][releaseLine(version)];
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

test('lockfiles keep patched Undici and Zod release lines above their security floors', t => {
  // Undici 5 and Zod 3 still need parent upgrades; do not present those legacy
  // release lines as patched by this round of compatible dependency updates.
  const floors = {
    undici: {6: '6.29.1', 7: '7.30.1', 8: '8.12.2'},
    zod: {4: '4.6.6'}
  };

  LOCKFILES.forEach(rel => {
    const versions = resolvedVersions(fs.readFileSync(path.join(ROOT, rel), 'utf8'), floors);
    versions.forEach((resolved, name) => {
      resolved.forEach(version => {
        if (isKnownLegacyDependency(rel, name, version)) {
          return;
        }
        const floor = floors[name][releaseLine(version)];
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

test('legacy security exceptions require the exact lockfile, dependency, and version', t => {
  [
    ['yarn.lock', 'zod', '3.25.76', true],
    ['examples/demo-app/yarn.lock', 'undici', '5.29.0', true],
    ['examples/demo-app-sqlrooms/yarn.lock', 'undici', '5.29.0', true],
    ['yarn.lock', 'zod', '3.25.75', false],
    ['yarn.lock', 'zod', '3.25.77', false],
    ['examples/demo-app/yarn.lock', 'undici', '5.0.0', false],
    ['examples/demo-app-sqlrooms/yarn.lock', 'undici', '5.29.1', false],
    ['examples/node-app/yarn.lock', 'undici', '5.29.0', false],
    ['website/yarn.lock', 'undici', '5.29.0', false],
    ['examples/demo-app/yarn.lock', 'zod', '3.25.76', false],
    ['examples/demo-app-sqlrooms/yarn.lock', 'zod', '3.25.76', false],
    ['yarn.lock', 'undici', '5.29.0', false]
  ].forEach(([rel, name, version, expected]) => {
    t.equal(
      isKnownLegacyDependency(rel, name, version),
      expected,
      `${rel} ${expected ? 'allows' : 'rejects'} ${name}@${version} as a legacy exception`
    );
  });

  t.end();
});
