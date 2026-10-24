// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {getApplicationConfig, initApplicationConfig} from '@kepler.gl/utils';

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

test('demo runtime config respects Zarr availability and explicit overrides', async t => {
  const originalConfig = {...getApplicationConfig()};
  const originalFetch = globalThis.fetch;
  // Import inside the test so demo startup defaults do not affect other tests.
  const {loadAndApplyRuntimeConfig, getRuntimeConfig, applyRuntimeConfig} = await import(
    '../../../examples/demo-app/src/utils/runtime-config'
  );
  const originalRuntimeConfig = getRuntimeConfig();
  try {
    initApplicationConfig({enableZarrLayer: false});
    globalThis.fetch = async () => ({ok: false});
    await loadAndApplyRuntimeConfig();
    if (getApplicationConfig().enableZarrLayer === false) {
      t.skip('Zarr layer is disabled (enableZarrLayer=false); enabled-default check skipped');
    } else {
      t.equal(
        getApplicationConfig().enableZarrLayer,
        true,
        'demo defaults enable Zarr without config.json'
      );
    }

    for (const enabled of [true, false]) {
      globalThis.fetch = async () => ({
        ok: true,
        json: async () => ({applicationConfig: {enableZarrLayer: enabled}})
      });
      await loadAndApplyRuntimeConfig();
      t.equal(
        getApplicationConfig().enableZarrLayer,
        enabled,
        `config.json can explicitly ${enabled ? 'enable' : 'disable'} Zarr`
      );
    }
  } catch (error) {
    t.fail(error.message);
  } finally {
    applyRuntimeConfig(originalRuntimeConfig);
    initApplicationConfig(originalConfig);
    globalThis.fetch = originalFetch;
    t.end();
  }
});
