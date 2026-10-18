// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {exportJson} from './export-utils';

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
