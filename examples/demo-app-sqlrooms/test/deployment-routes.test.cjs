// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const {test} = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const vm = require('node:vm');
const {transformSync} = require('@babel/core');

for (const basePath of ['/demo', '/demo-next']) {
  test(`sample and cloud links remain under ${basePath}`, async () => {
    const pushed = [];
    const window = {
      location: new URL(`https://kepler.gl${basePath}?sql=SELECT%201`),
      history: {pushState: (_state, _title, url) => pushed.push(url)}
    };
    // Exercise the actual action/provider methods without starting OAuth or
    // importing their UI and data-loading dependencies.
    function load(relative, settings) {
      const filename = path.resolve(__dirname, '../src', relative);
      const {code} = transformSync(fs.readFileSync(filename, 'utf8'), {
        filename,
        babelrc: false,
        configFile: false,
        plugins: ['@babel/plugin-transform-modules-commonjs']
      });
      const exports = {};
      vm.runInNewContext(code, {
        exports,
        window,
        process: {env: basePath === '/demo' ? {} : {DEMO_BASE_PATH: basePath}},
        require: name => {
          if (name.endsWith('constants/default-settings')) return settings;
          if (name === 'keymirror') return values => values;
          if (name === 'global/window') return window;
          if (name === '@kepler.gl/cloud-providers') return {Provider: class {}};
          return {};
        }
      });
      return exports;
    }
    const settings = load('constants/default-settings.js');
    const actions = load('actions.js', settings);
    actions.loadSample({id: 'earthquakes'})(() => {});
    assert.equal(pushed.pop(), `${basePath}/earthquakes?sql=SELECT%201`);
    actions.onLoadCloudMapSuccess({
      provider: {name: 'foursquare', getMapUrl: () => 'map-id'}
    })();
    assert.equal(pushed.pop(), `${basePath}/map/foursquare?path=map-id`);

    const Dropbox = load('cloud-providers/dropbox/dropbox-provider.js', settings).default;
    const dropbox = Object.create(Dropbox.prototype);
    assert.equal(
      dropbox._getMapPermalinkFromParams({path: 'map.json'}),
      `https://kepler.gl${basePath}/map/dropbox?path=map.json`
    );
    assert.equal(
      dropbox._getMapPermalink('https://example.com/map.json', false),
      `${basePath}/map?mapUrl=https://example.com/map.json`
    );

    const Carto = load('cloud-providers/carto/carto-provider.js', settings).default;
    const carto = Object.create(Carto.prototype);
    assert.equal(
      carto.getMapUrl(true, {mapId: 'map-id', owner: 'user', privateMap: false}),
      `https://kepler.gl${basePath}/map/carto?mapId=map-id&owner=user&privateMap=false`
    );

    const GoogleDrive = load(
      'cloud-providers/google-drive/google-drive-provider.js',
      settings
    ).default;
    const drive = Object.assign(Object.create(GoogleDrive.prototype), {
      _requireToken: async () => 'test-token',
      _ensureAppFolder: async () => 'folder-id',
      _findFileByName: async () => null,
      _createMultipartFile: async () => ({id: 'file-id'}),
      _makePublic: async () => {}
    });
    const uploaded = await drive.uploadMap({mapData: {map: {}}, options: {isPublic: true}});
    assert.equal(uploaded.shareUrl, `https://kepler.gl${basePath}/map/google-drive?id=file-id`);
  });
}
