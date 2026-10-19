// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';

import {registerEntry} from '@kepler.gl/actions';
import keplerGlReducer from '@kepler.gl/reducers';
import {
  getMapJSON,
  exportToJsonString,
  getScaleFromImageSize,
  isMSEdge,
  calculateExportImageSize,
  omitLayerApiKeys,
  getExportFileName,
  getExportFileNameBase,
  exportMapToHTML
} from '@kepler.gl/utils';
import {resolveMapboxTokenForExport} from '../../../src/utils/src/export-utils';
import {EXPORT_IMG_RATIOS, RESOLUTIONS} from '@kepler.gl/constants';

test('exportUtils -> ExportJson', t => {
  const state = keplerGlReducer(undefined, registerEntry({id: 'test'})).test;
  const map = getMapJSON(state, {
    hasData: true,
    appName: '</script> Atlas',
    appWebsite: 'https://atlas.example.com/?next="map"'
  });
  const body = exportToJsonString(map);
  getScaleFromImageSize;
  t.equal(typeof body, 'string', 'Should validate the type of body to be a string');

  t.doesNotThrow(() => {
    JSON.parse(body);
  }, 'Should not throw when trying to parse body');
  t.equal(map.info.app, 'kepler.gl', 'should preserve the JSON format discriminator');
  t.equal(map.info.appName, '</script> Atlas', 'should preserve the application name');
  t.equal(
    map.info.appWebsite,
    'https://atlas.example.com/?next="map"',
    'should preserve the application website'
  );
  t.deepEqual(JSON.parse(body).info, map.info, 'should safely serialize branding as JSON metadata');

  t.end();
});

test('exportUtils -> ExportHtml includes map info', t => {
  const html = exportMapToHTML({
    datasets: [],
    config: {version: 'v1', config: {}},
    info: {title: 'Harbor', description: 'Ferry routes'},
    mode: 'READ'
  });

  t.ok(html.includes('"title":"Harbor"'), 'exported html should restore the map title');
  t.ok(
    html.includes('"description":"Ferry routes"'),
    'exported html should restore the map description'
  );
  t.ok(html.includes('info,'), 'exported html should pass info to addDataToMap');
  t.notOk(html.includes('google-analytics.com'), 'exported html should not load Google Analytics');
  t.notOk(
    html.includes('UA-64694404'),
    'exported html should not contain a Universal Analytics id'
  );

  t.end();
});

test('exportUtils -> ExportHtml preserves ruler annotation geometry and text settings', t => {
  const html = exportMapToHTML({
    datasets: [],
    config: {
      version: 'v1',
      config: {
        visState: {
          annotations: [
            {
              id: 'ruler-1',
              kind: 'RULER',
              anchorPoint: [0, 0, 10],
              endPoint: [1, 1, 80],
              showCustomText: false,
              showDistance: true
            }
          ]
        }
      }
    },
    mode: 'READ'
  });

  t.ok(html.includes('"kind":"RULER"'), 'HTML should embed the ruler variant');
  t.ok(html.includes('"endPoint":[1,1,80]'), 'HTML should embed its 3D endpoint');
  t.ok(html.includes('"showCustomText":false'), 'HTML should embed custom-text visibility');
  t.ok(html.includes('"showDistance":true'), 'HTML should embed distance visibility');

  t.end();
});

test('exportUtils -> ExportHtml escapes script terminators in map info', t => {
  const html = exportMapToHTML({
    datasets: [],
    config: {version: 'v1', config: {}},
    info: {title: '</script><script>window.pwned=1;</script>'},
    mode: 'READ'
  });

  t.notOk(
    html.includes('<script>window.pwned'),
    'a map title should not be able to close the inline script'
  );
  t.ok(html.includes('\\u003c/script>'), 'should escape `<` in the serialized map info');

  t.end();
});

test('exportUtils -> ExportHtml preserves custom branding', t => {
  const branding = {
    appName: 'Atlas Lab',
    appWebsite: 'https://atlas.example.com/maps'
  };
  const html = exportMapToHTML({
    datasets: [],
    config: {version: 'v1', config: {}},
    mode: 'READ',
    ...branding
  });
  const brandingMatch = html.match(/const branding = (.+);/);

  t.ok(brandingMatch, 'exported html should define branding settings');
  t.deepEqual(
    JSON.parse(brandingMatch[1]),
    branding,
    'exported html should serialize the custom branding'
  );
  t.ok(
    html.includes('<title>Atlas Lab embedded map</title>'),
    'exported html should use the app name in the document title'
  );
  t.ok(
    html.includes('href: branding.appWebsite'),
    'the read-only logo should link to the app website'
  );
  t.ok(
    html.includes('react.createElement("span", null, branding.appName)'),
    'the read-only logo should render the app name'
  );
  t.ok(html.includes('BrandLogo(),'), 'a read-only export should render the branding badge');
  t.ok(
    html.includes('appName: branding.appName') && html.includes('appWebsite: branding.appWebsite'),
    'the embedded component should receive the branding props'
  );

  t.end();
});

test('exportUtils -> ExportHtml normalizes branding websites', t => {
  const getBranding = appWebsite => {
    const html = exportMapToHTML({
      datasets: [],
      config: {version: 'v1', config: {}},
      mode: 'READ',
      appWebsite
    });
    const brandingMatch = html.match(/const branding = (.+);/);
    return JSON.parse(brandingMatch[1]);
  };

  t.equal(
    getBranding('  example.com/maps  ').appWebsite,
    'https://example.com/maps',
    'scheme-less websites should become absolute HTTPS URLs'
  );
  t.equal(
    getBranding('javascript:alert(1)').appWebsite,
    'http://kepler.gl/',
    'unsupported URL schemes should use the Kepler website'
  );
  t.equal(
    getBranding('   ').appWebsite,
    'http://kepler.gl/',
    'empty websites should use the Kepler website'
  );
  t.equal(
    getBranding('not a website').appWebsite,
    'http://kepler.gl/',
    'invalid websites should use the Kepler website'
  );

  t.end();
});

test('exportUtils -> ExportHtml uses default branding', t => {
  const html = exportMapToHTML({
    datasets: [],
    config: {version: 'v1', config: {}},
    mode: 'READ'
  });
  const brandingMatch = html.match(/const branding = (.+);/);

  t.ok(brandingMatch, 'exported html should define default branding settings');
  t.deepEqual(
    JSON.parse(brandingMatch[1]),
    {appName: 'kepler.gl', appWebsite: 'http://kepler.gl/'},
    'exported html should retain the Kepler defaults'
  );
  t.ok(
    html.includes('<title>kepler.gl embedded map</title>'),
    'the default document title should use the canonical app name'
  );

  t.end();
});

test('exportUtils -> ExportHtml safely serializes branding', t => {
  const appName = '</title><script>window.brandPwned=1;</script> & Map\u2028\u2029';
  const appWebsite =
    'https://example.com/?next=</script><script>window.websitePwned=1;</script>\u2028\u2029';
  const html = exportMapToHTML({
    datasets: [],
    config: {version: 'v1', config: {}},
    mode: 'READ',
    appName,
    appWebsite
  });
  const brandingMatch = html.match(/const branding = (.+);/);

  t.notOk(
    html.includes('<script>window.brandPwned'),
    'the app name should not be able to close the title element'
  );
  t.notOk(
    html.includes('<script>window.websitePwned'),
    'the app website should not be able to close the inline script'
  );
  t.ok(
    html.includes(
      '<title>&lt;/title&gt;&lt;script&gt;window.brandPwned=1;&lt;/script&gt; &amp; Map\u2028\u2029 embedded map</title>'
    ),
    'the app name should be escaped for the document title'
  );
  t.ok(html.includes('\\u003c/script>'), 'branding should escape `<` in inline scripts');
  t.ok(html.includes('\\u2028\\u2029'), 'branding should escape JavaScript line terminators');
  t.notOk(
    brandingMatch[1].includes('<'),
    'serialized branding should not contain literal opening angle brackets'
  );
  t.deepEqual(
    JSON.parse(brandingMatch[1]),
    {
      appName,
      appWebsite:
        'https://example.com/?next=%3C/script%3E%3Cscript%3Ewindow.websitePwned=1;%3C/script%3E'
    },
    'escaped branding should retain its normalized values at runtime'
  );

  t.end();
});

test('exportUtils -> resolveMapboxTokenForExport', t => {
  t.equal(
    resolveMapboxTokenForExport('   ', 'shared-token'),
    'shared-token',
    'whitespace-only user tokens should use the configured export token'
  );
  t.equal(
    resolveMapboxTokenForExport('  user-token  ', 'shared-token'),
    'user-token',
    'user tokens should be trimmed before export'
  );
  t.equal(
    resolveMapboxTokenForExport('', undefined),
    undefined,
    'missing user and export tokens should remain missing'
  );
  t.equal(
    resolveMapboxTokenForExport('', '   '),
    undefined,
    'whitespace-only configured export tokens should remain missing'
  );

  t.end();
});

test('exportUtils -> getScaleFromImageSize', t => {
  t.equal(
    getScaleFromImageSize(800, 600, 1400, 990),
    0.5714285714285714,
    'Should compute the right scale'
  );

  t.equal(
    getScaleFromImageSize(800, 600, 1400),
    1,
    'Should return 1 because we are not passing mapH'
  );

  t.equal(getScaleFromImageSize(800, 600, 1400, -1), 1, 'Should return 1 because mapH is negative');

  t.equal(getScaleFromImageSize(800, 600, 1400, 0), 1, 'Should return 1 because mapH is 0');

  t.end();
});

test('exportUtils -> calculateExportImageSize', t => {
  t.deepEqual(
    calculateExportImageSize({
      mapW: 1400,
      mapH: 990,
      ratio: EXPORT_IMG_RATIOS.SCREEN,
      resolution: RESOLUTIONS.ONE_X
    }),
    {zoomOffset: 0, scale: 1, imageW: 1400, imageH: 990},
    'Should calculate the correct export image size'
  );

  t.equal(
    calculateExportImageSize({
      mapW: -1,
      mapH: 990,
      ratio: EXPORT_IMG_RATIOS.SCREEN,
      resolution: RESOLUTIONS.ONE_X
    }),
    null,
    'Should return null because mapW is negative'
  );

  t.equal(
    calculateExportImageSize({
      mapW: 1440,
      mapH: -1,
      ratio: EXPORT_IMG_RATIOS.SCREEN,
      resolution: RESOLUTIONS.ONE_X
    }),
    null,
    'Should return null because mapH is negative'
  );

  t.deepEqual(
    calculateExportImageSize({
      mapW: 1440,
      mapH: 990,
      ratio: EXPORT_IMG_RATIOS.CUSTOM,
      resolution: RESOLUTIONS.ONE_X
    }),
    {zoomOffset: 0, scale: 1, imageW: 1440, imageH: 990},
    'Should return scale 1 for custom ratio (defaults to 1)'
  );

  t.deepEqual(
    calculateExportImageSize({
      mapW: 1440,
      mapH: 990,
      ratio: 'not-valid',
      resolution: RESOLUTIONS.ONE_X
    }),
    {zoomOffset: 0, scale: 1, imageW: 1440, imageH: 1080},
    'Should return a correct valid with a non valid ratio param'
  );

  t.deepEqual(
    calculateExportImageSize({
      mapW: 1440,
      mapH: 990,
      ratio: EXPORT_IMG_RATIOS.SCREEN,
      resolution: 'not-valid'
    }),
    {zoomOffset: 0, scale: 1, imageW: 1440, imageH: 990},
    'Should return a correct valid with a non valid resolution param'
  );

  // Test fixed resolution options
  t.deepEqual(
    calculateExportImageSize({
      mapW: 1440,
      mapH: 990,
      ratio: EXPORT_IMG_RATIOS.SCREEN,
      resolution: '1920x1080'
    }),
    {zoomOffset: 0, scale: 1, imageW: 1920, imageH: 1080},
    'Should return fixed resolution 1920x1080'
  );

  t.deepEqual(
    calculateExportImageSize({
      mapW: 1440,
      mapH: 990,
      ratio: EXPORT_IMG_RATIOS.SCREEN,
      resolution: '1280x720'
    }),
    {zoomOffset: 0, scale: 1, imageW: 1280, imageH: 720},
    'Should return fixed resolution 1280x720'
  );

  t.deepEqual(
    calculateExportImageSize({
      mapW: 1440,
      mapH: 990,
      ratio: EXPORT_IMG_RATIOS.SCREEN,
      resolution: '2560x1440'
    }),
    {zoomOffset: 0, scale: 1, imageW: 2560, imageH: 1440},
    'Should return fixed resolution 2560x1440'
  );

  t.end();
});

test('exportUtils -> isMSEdge', t => {
  t.equal(isMSEdge({}), false, 'Should return false because no navigator is defined');
  t.equal(
    isMSEdge({navigator: {}}),
    false,
    'Should return false because msSaveOrOpenBlob is not defined'
  );
  t.equal(
    isMSEdge({navigator: {msSaveOrOpenBlob: () => {}}}),
    true,
    'Should return true because both navigator and msSaveOrOpenBlob are defined'
  );
  t.end();
});

test('exportUtils -> exportToJsonString', t => {
  t.equal(exportToJsonString({test: 1}), '{"test":1}', 'Should convert object to string');
  t.end();
});

test('exportUtils -> omitLayerApiKeys', t => {
  const saved = {
    datasets: [
      {
        data: {
          id: 'tiles',
          metadata: {
            tile3dUrl: 'https://tile.googleapis.com/v1/3dtiles/root.json',
            tile3dAccessToken: 'secret-key',
            tile3dProvider: 'google'
          }
        }
      },
      {
        data: {
          id: 'points',
          metadata: {source: 'https://example.com/data.geojson'}
        }
      }
    ],
    config: {version: 'v1'}
  };

  const stripped = omitLayerApiKeys(saved);

  t.equal(
    stripped.datasets[0].data.metadata.tile3dAccessToken,
    undefined,
    'Should drop the tileset access token'
  );
  t.equal(
    stripped.datasets[0].data.metadata.tile3dUrl,
    saved.datasets[0].data.metadata.tile3dUrl,
    'Should keep the tileset URL'
  );
  t.equal(
    stripped.datasets[0].data.metadata.tile3dProvider,
    'google',
    'Should keep the tileset provider'
  );
  t.deepEqual(
    stripped.datasets[1].data.metadata,
    saved.datasets[1].data.metadata,
    'Should leave datasets without an API key unchanged'
  );
  t.equal(
    saved.datasets[0].data.metadata.tile3dAccessToken,
    'secret-key',
    'Should not mutate the original saved map'
  );
  t.deepEqual(
    omitLayerApiKeys({config: {}}),
    {config: {}},
    'Should return maps without datasets as-is'
  );

  t.end();
});

test('exportUtils -> getExportFileName', t => {
  t.equal(
    getExportFileName('', 'kepler.gl.json', 'json'),
    'kepler.gl.json',
    'empty name uses fallback'
  );
  t.equal(
    getExportFileName('census-2020', 'kepler.gl.json', 'json'),
    'census-2020.json',
    'appends format'
  );
  t.equal(
    getExportFileName('census-2020.json', 'kepler.gl.json', 'json'),
    'census-2020.json',
    'strips a matching extension before adding it again'
  );
  t.equal(
    getExportFileName('census-2020.html', 'kepler.gl.html', 'html'),
    'census-2020.html',
    'strips html extension typed by the user'
  );
  t.equal(
    getExportFileName('bad/name:file', 'kepler.gl.png', 'png'),
    'bad-name-file.png',
    'replaces illegal filename characters'
  );
  t.equal(getExportFileNameBase('', 'kepler.gl'), 'kepler.gl', 'base fallback is unchanged');
  t.end();
});
