// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';

import {getRuntimeConfigHref} from '../../../examples/demo-app/src/utils/get-runtime-config-href';

test('getRuntimeConfigHref defaults to origin-root /config.json', t => {
  t.equal(getRuntimeConfigHref(undefined), '/config.json');
  t.equal(getRuntimeConfigHref({}), '/config.json', 'SPA window without override or base');
  t.equal(
    getRuntimeConfigHref({
      document: {
        baseURI: 'http://localhost/demo/earthquakes',
        querySelector: () => null
      }
    }),
    '/config.json',
    'does not follow the SPA path (would miss config.json)'
  );
  t.end();
});

test('getRuntimeConfigHref prefers window.__KEPLER_CONFIG_HREF__', t => {
  t.equal(
    getRuntimeConfigHref({
      __KEPLER_CONFIG_HREF__: '/kepler/config.json',
      document: {
        baseURI: 'http://localhost/kepler/demo/x',
        querySelector: () => ({href: '/kepler/'})
      }
    }),
    '/kepler/config.json'
  );
  t.equal(
    getRuntimeConfigHref({__KEPLER_CONFIG_HREF__: '  /other/config.json  '}),
    '/other/config.json',
    'trims override'
  );
  t.end();
});

test('getRuntimeConfigHref resolves config.json against <base href>', t => {
  t.equal(
    getRuntimeConfigHref({
      document: {
        baseURI: 'http://localhost/kepler/',
        querySelector: selector => (selector === 'base[href]' ? {href: '/kepler/'} : null)
      }
    }),
    'http://localhost/kepler/config.json'
  );
  t.end();
});
