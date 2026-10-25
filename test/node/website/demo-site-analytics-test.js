// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import fs from 'fs';
import path from 'path';
import test from 'tape';

const ROOT = path.resolve(__dirname, '../../..');

const DEMO_SITE_SOURCES = [
  'website/src/static/index.html',
  'website/src/routes.js',
  'website/src/reducers/index.js'
];

test('demo site does not load Google Analytics', t => {
  DEMO_SITE_SOURCES.forEach(rel => {
    const source = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    t.notOk(source.includes('googletagmanager.com'), `${rel} should not load Google Tag Manager`);
    t.notOk(source.includes('google-analytics.com'), `${rel} should not load Google Analytics`);
    t.notOk(source.includes('UA-64694404'), `${rel} should not contain a Universal Analytics id`);
    t.notOk(/\bgtag\b/.test(source), `${rel} should not call gtag`);
  });

  t.notOk(
    fs.existsSync(path.join(ROOT, 'website/src/reducers/analytics.js')),
    'demo-site analytics middleware should be removed'
  );

  t.end();
});
