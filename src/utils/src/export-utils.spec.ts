// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  downloadFile,
  exportHtml,
  exportImage,
  exportMap,
  exportJson,
  exportToJsonString
} from './export-utils';
import {exportMapToHTML} from './export-map-html';
import {getApplicationConfig} from './application-config';

jest.mock('./export-map-html', () => ({exportMapToHTML: jest.fn(() => '<html>map</html>')}));

function readJsonBlob(blob: Blob): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(JSON.parse(reader.result as string)));
    reader.addEventListener('error', () => reject(reader.error));
    reader.readAsText(blob);
  });
}

describe('exportJson', () => {
  test('exports config-only and data-inclusive maps with their intended schemas', async () => {
    const configOnlyMap = {
      version: 'v1',
      config: {visState: {layers: []}}
    };
    const dataInclusiveMap = {
      datasets: [],
      config: configOnlyMap,
      info: {app: 'kepler.gl'}
    };
    const state = {
      visState: {
        schema: {
          getConfigToSave: jest.fn(() => configOnlyMap),
          save: jest.fn(() => dataInclusiveMap)
        }
      }
    };
    const saveBlob = jest.fn();
    Object.defineProperty(window.navigator, 'msSaveOrOpenBlob', {
      configurable: true,
      value: saveBlob
    });

    exportJson(state, {
      hasData: false,
      appIcon: 'https://example.test/icon.svg',
      appNameColor: '#123456'
    });

    expect(await readJsonBlob(saveBlob.mock.calls[0][0])).toEqual(configOnlyMap);

    exportJson(state, {hasData: true});

    expect(await readJsonBlob(saveBlob.mock.calls[1][0])).toEqual({
      ...dataInclusiveMap,
      info: {
        ...dataInclusiveMap.info,
        appName: 'kepler.gl',
        appWebsite: 'http://kepler.gl/',
        source: 'kepler.gl'
      }
    });

    exportJson(state, {
      hasData: true,
      appIcon: 'https://example.test/icon.svg',
      appNameColor: '#123456'
    });

    expect(await readJsonBlob(saveBlob.mock.calls[2][0])).toEqual({
      ...dataInclusiveMap,
      info: {
        ...dataInclusiveMap.info,
        appName: 'kepler.gl',
        appWebsite: 'http://kepler.gl/',
        appIcon: 'https://example.test/icon.svg',
        appNameColor: '#123456',
        source: 'kepler.gl'
      }
    });
  });
});

describe('JSON export failures', () => {
  test('propagates serialization failures and never downloads an error-only file', () => {
    const cycle: any = {};
    cycle.self = cycle;
    const saveBlob = jest.fn();
    Object.defineProperty(window.navigator, 'msSaveOrOpenBlob', {
      configurable: true,
      value: saveBlob
    });
    expect(() => exportToJsonString(cycle)).toThrow(TypeError);
    expect(() => exportJson({visState: {schema: {save: () => cycle}}}, {hasData: true})).toThrow(
      TypeError
    );
    expect(saveBlob).not.toHaveBeenCalled();
    const failure = new Error('Cannot read export data');
    expect(() =>
      exportToJsonString({
        toJSON() {
          throw failure;
        }
      })
    ).toThrow(failure);
  });
});

describe('export file delivery', () => {
  const originalSave = Object.getOwnPropertyDescriptor(window.navigator, 'msSaveOrOpenBlob');
  const originalCreate = Object.getOwnPropertyDescriptor(URL, 'createObjectURL');
  const originalRevoke = Object.getOwnPropertyDescriptor(URL, 'revokeObjectURL');
  const save = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window.navigator, 'msSaveOrOpenBlob', {configurable: true, value: save});
  });
  afterEach(() => {
    jest.restoreAllMocks();
    for (const [target, name, descriptor] of [
      [window.navigator, 'msSaveOrOpenBlob', originalSave],
      [URL, 'createObjectURL', originalCreate],
      [URL, 'revokeObjectURL', originalRevoke]
    ] as const) {
      if (descriptor) Object.defineProperty(target, name, descriptor);
      else Reflect.deleteProperty(target, name);
    }
  });
  const map = {
    datasets: [
      {data: {metadata: {tile3dAccessToken: 'private', tilesetUrl: 'https://tiles.test'}}}
    ],
    info: {app: 'kepler.gl'}
  };
  const state = () => ({
    visState: {
      schema: {save: jest.fn(() => map), getConfigToSave: jest.fn(() => ({config: true}))}
    },
    uiState: {exportImage: {}}
  });

  test('dispatches a download from an attached link then releases its URL and element', () => {
    Reflect.deleteProperty(window.navigator, 'msSaveOrOpenBlob');
    const create = jest.fn(() => 'blob:export');
    const revoke = jest.fn();
    Object.defineProperty(URL, 'createObjectURL', {configurable: true, value: create});
    Object.defineProperty(URL, 'revokeObjectURL', {configurable: true, value: revoke});
    const dispatched: HTMLAnchorElement[] = [];
    jest
      .spyOn(HTMLAnchorElement.prototype, 'dispatchEvent')
      .mockImplementation(function (this: HTMLAnchorElement, event) {
        expect(document.body.contains(this)).toBe(true);
        expect(event.type).toBe('click');
        expect(event.cancelable).toBe(true);
        expect(this.getAttribute('href')).toBe('blob:export');
        expect(this.download).toBe('map.json');
        dispatched.push(this);
        return true;
      });
    const blob = new Blob(['{}']);
    downloadFile(blob, 'map.json');
    expect(create).toHaveBeenCalledWith(blob);
    expect(dispatched).toHaveLength(1);
    expect(document.body.contains(dispatched[0])).toBe(false);
    expect(revoke).toHaveBeenCalledWith('blob:export');
  });

  test('does not download an image before image rendering finishes', () => {
    exportImage({} as Parameters<typeof exportImage>[0]);
    expect(save).not.toHaveBeenCalled();
  });

  test('downloads PNG bytes with an explicit sanitized name overriding the saved image name', () => {
    exportImage(
      {imageDataUri: 'data:image/png;base64,AQID', fileName: 'old'} as Parameters<
        typeof exportImage
      >[0],
      'new/map.jpg'
    );
    expect(save.mock.calls[0][1]).toBe('new-map.png');
    expect(save.mock.calls[0][0].type).toBe('image/png');
    expect(save.mock.calls[0][0].size).toBe(3);
  });

  test('uses the configured image filename when no filename was provided', () => {
    exportImage({imageDataUri: 'data:image/png;base64,AQ=='} as Parameters<typeof exportImage>[0]);
    expect(save.mock.calls[0][1]).toBe(getApplicationConfig().defaultImageName);
  });

  test('exports HTML without private layer keys and preserves explicit branding and export token', () => {
    exportHtml(
      {...state(), appName: 'Host'},
      {
        includeLayerApiKeys: false,
        userMapboxToken: ' ',
        exportMapboxAccessToken: ' token ',
        mode: 'read',
        appName: 'Custom',
        appWebsite: '',
        appIcon: 'icon.svg',
        appNameColor: '#fff',
        fileName: 'share.json'
      }
    );
    expect(exportMapToHTML).toHaveBeenCalledWith(
      expect.objectContaining({
        datasets: [{data: {metadata: {tilesetUrl: 'https://tiles.test'}}}],
        mapboxApiAccessToken: 'token',
        mode: 'read',
        appName: 'Custom',
        appWebsite: '',
        appIcon: 'icon.svg',
        appNameColor: '#fff'
      })
    );
    expect(map.datasets[0].data.metadata.tile3dAccessToken).toBe('private');
    expect(save.mock.calls[0][1]).toBe('share.html');
    expect(save.mock.calls[0][0].type).toBe('text/html');
  });

  test('uses host branding and filename for HTML while keeping explicitly included keys', () => {
    exportHtml(
      {...state(), appName: 'My app', appWebsite: 'https://host.test'},
      {includeLayerApiKeys: true, userMapboxToken: ' user ', exportMapboxAccessToken: 'fallback'}
    );
    expect(exportMapToHTML).toHaveBeenCalledWith(
      expect.objectContaining({
        appName: 'My app',
        appWebsite: 'https://host.test',
        datasets: map.datasets,
        mapboxApiAccessToken: 'user'
      })
    );
    expect(save.mock.calls[0][1]).toBe('My app.html');
  });

  test('returns a thumbnail with a full saved map without starting a download', () => {
    const input = {
      ...state(),
      uiState: {exportImage: {imageDataUri: 'data:image/png;base64,AQID'}}
    };
    const result = exportMap(input, {hasData: true});
    expect(result.map).toBe(map);
    expect(result.thumbnail?.type).toBe('image/png');
    expect(result.thumbnail?.size).toBe(3);
    expect(save).not.toHaveBeenCalled();
  });

  test('returns config-only exports without a thumbnail when no preview exists', () => {
    const input = state();
    expect(exportMap(input, {hasData: false})).toEqual({map: {config: true}, thumbnail: null});
    expect(input.visState.schema.save).not.toHaveBeenCalled();
    expect(save).not.toHaveBeenCalled();
  });
});
