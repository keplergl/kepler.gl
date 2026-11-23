// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {DatasetType} from '@kepler.gl/constants';
import {processArrowTable, processKeplerglJSON} from '@kepler.gl/processors';
import {INITIAL_VIS_STATE} from '@kepler.gl/reducers';
import {KeplerTable} from '@kepler.gl/table';
import {Int64, Table, vectorFromArray} from 'apache-arrow';
import {serializeProject} from './project-export';

function makeTable(id: string, type = DatasetType.EXTERNALLY_HOSTED) {
  return new KeplerTable({
    info: {id, label: id, type},
    color: [1, 2, 3],
    metadata: {
      source: `https://example.test/${id}.csv?access_token=private&region=west`,
      sourceFormat: 'csv',
      refreshIntervalMs: 1000,
      lastFetchedAt: 100,
      refreshStatus: 'idle'
    }
  }).updateSchema({
    fields: [
      {name: 'value', type: 'integer', analyzerType: 'INT', format: ''},
      {name: 'description', type: 'string', analyzerType: 'STRING', format: ''}
    ],
    rows: [[7, 'https://example.test/value?token=data-value']]
  });
}

function stateFor(...tables: KeplerTable[]) {
  return {
    visState: {
      ...INITIAL_VIS_STATE,
      datasets: Object.fromEntries(tables.map(table => [table.id, table]))
    },
    mapStyle: {
      styleType: 'custom',
      mapStyles: {
        custom: {
          id: 'custom',
          custom: true,
          accessToken: 'private-style-token',
          url: 'https://user:password@styles.test/style.json?api_key=private&version=1'
        }
      }
    }
  };
}

describe('project serialization', () => {
  it('embeds remote tabular data as an independent local snapshot without changing live state', () => {
    const remote = makeTable('remote');
    const state = stateFor(remote);
    const originalMetadata = {...remote.metadata};
    const {text, warnings} = serializeProject(state, {
      dataMode: 'embedded',
      includeCredentials: false
    });
    const saved = JSON.parse(text);
    const restored = processKeplerglJSON(saved)?.datasets?.[0];

    expect(saved.datasets[0].data.type).toBe(DatasetType.LOCAL);
    expect(restored?.data.rows).toEqual([[7, 'https://example.test/value?token=data-value']]);
    expect(saved.datasets[0].data.metadata).not.toHaveProperty('source');
    expect(saved.datasets[0].data.metadata).not.toHaveProperty('refreshIntervalMs');
    expect(saved.datasets[0].data.metadata).not.toHaveProperty('lastFetchedAt');
    expect(warnings).not.toEqual(
      expect.arrayContaining([expect.objectContaining({code: 'remote-data-reference'})])
    );
    expect(remote.type).toBe(DatasetType.EXTERNALLY_HOSTED);
    expect(remote.metadata).toEqual(originalMetadata);
    expect(state.visState.datasets.remote).toBe(remote);
    expect(state.mapStyle.mapStyles.custom.accessToken).toBe('private-style-token');
  });

  it('uses the schema Arrow normalization for embedded external tables', () => {
    const remote = makeTable('arrow');
    const arrowData = processArrowTable({
      shape: 'arrow-table',
      data: new Table({value: vectorFromArray([42n, 9007199254740993n], new Int64())})
    });
    if (!arrowData) throw new Error('Invalid Arrow fixture');
    remote.updateSchema(arrowData);
    remote.metadata = {...remote.metadata, format: 'arrow', sourceFormat: 'arrow'};
    const {text} = serializeProject(stateFor(remote), {
      dataMode: 'embedded',
      includeCredentials: true
    });
    const saved = JSON.parse(text);

    expect(saved.datasets[0].data.allData).toEqual([[42], ['9007199254740993']]);
    expect(saved.datasets[0].data.metadata.format).toBe('row');
    expect(processKeplerglJSON(saved)?.datasets?.[0].data.rows).toEqual([
      [42],
      ['9007199254740993']
    ]);
    expect(remote.metadata.format).toBe('arrow');
  });

  it('preserves supported source references and embeds datasets that have no remote source', () => {
    const remote = makeTable('remote');
    const local = makeTable('local', DatasetType.LOCAL);
    local.metadata = {};
    const {text} = serializeProject(stateFor(remote, local), {
      dataMode: 'references',
      includeCredentials: true
    });
    const saved = JSON.parse(text);

    expect(saved.datasets[0].data).toMatchObject({
      type: DatasetType.EXTERNALLY_HOSTED,
      allData: [],
      metadata: {source: remote.metadata.source, format: 'csv', refreshIntervalMs: 1000}
    });
    expect(saved.datasets[1].data.allData).toEqual([
      [7, 'https://example.test/value?token=data-value']
    ]);
  });

  it.each([false, true])(
    'makes credential inclusion explicit (include: %s)',
    includeCredentials => {
      const remote = makeTable('remote');
      const tiles = makeTable('tiles', DatasetType.TILE_3D);
      tiles.metadata = {
        tile3dAccessToken: 'private-tile-token',
        tilesetUrl:
          'https://tiles.test/tileset.json?X-Amz-Signature=signed&X-Amz-Credential=private&v=2',
        nested: {headers: {Authorization: 'Bearer private'}, api_key: 'private-api-key'},
        label: 'Keep this metadata'
      };
      const {text, warnings} = serializeProject(stateFor(remote, tiles), {
        dataMode: 'references',
        includeCredentials
      });
      const saved = JSON.parse(text);
      const style = saved.config.config.mapStyle.mapStyles.custom;

      if (includeCredentials) {
        expect(saved.datasets[0].data.metadata.source).toBe(remote.metadata.source);
        expect(saved.datasets[1].data.metadata).toEqual(tiles.metadata);
        expect(style.accessToken).toBe('private-style-token');
        expect(style.url).toContain('user:password@');
        expect(warnings).toEqual([]);
      } else {
        expect(saved.datasets[0].data.metadata.source).toBe(
          'https://example.test/remote.csv?region=west'
        );
        expect(saved.datasets[1].data.metadata).toEqual({
          tilesetUrl: 'https://tiles.test/tileset.json?v=2',
          nested: {headers: {}},
          label: 'Keep this metadata'
        });
        expect(style).not.toHaveProperty('accessToken');
        expect(style.url).toBe('https://styles.test/style.json?version=1');
        expect(warnings).toContainEqual(expect.objectContaining({code: 'credentials-omitted'}));
      }
      expect(saved.datasets[1].data.allData).toEqual([
        [7, 'https://example.test/value?token=data-value']
      ]);
      expect(tiles.metadata.tile3dAccessToken).toBe('private-tile-token');
    }
  );

  it('reports remote layers that cannot be made portable by embedding tabular rows', () => {
    const tiles = makeTable('tiles', DatasetType.VECTOR_TILE);
    const zarr = makeTable('zarr', DatasetType.ZARR);
    zarr.metadata = {url: 'https://example.test/data.zarr', variable: 'temperature'};
    const {text, warnings} = serializeProject(stateFor(tiles, zarr), {
      dataMode: 'embedded',
      includeCredentials: true
    });

    expect(warnings).toEqual([
      expect.objectContaining({code: 'remote-data-reference', datasetId: 'tiles'}),
      expect.objectContaining({code: 'remote-data-reference', datasetId: 'zarr'})
    ]);
    expect(JSON.parse(text).datasets[1].data.metadata.url).toBe('https://example.test/data.zarr');
  });

  it.each([
    ['/styles.json?access_token=secret&v=1', '/styles.json?v=1'],
    ['../styles.json?api_key=secret&v=1#layer', '../styles.json?v=1#layer'],
    ['styles.json?token=secret', 'styles.json'],
    ['data:text/plain,example?token=content', 'data:text/plain,example?token=content'],
    ['//styles.test/style.json?key=secret&v=1', '//styles.test/style.json?v=1']
  ])('omits credentials from relative resource URLs: %s', (url, expected) => {
    const remote = makeTable('relative');
    remote.metadata.source = url;
    const state = stateFor(remote);
    state.mapStyle.mapStyles.custom.url = url;
    const saved = JSON.parse(
      serializeProject(state, {dataMode: 'references', includeCredentials: false}).text
    );

    expect(saved.datasets[0].data.metadata.source).toBe(expected);
    expect(saved.config.config.mapStyle.mapStyles.custom.url).toBe(expected);
    expect(remote.metadata.source).toBe(url);
    expect(state.mapStyle.mapStyles.custom.url).toBe(url);
  });

  it('rejects an unavailable external table instead of exporting an empty snapshot', () => {
    const remote = makeTable('missing');
    Reflect.deleteProperty(remote, 'dataContainer');

    expect(() =>
      serializeProject(stateFor(remote), {dataMode: 'embedded', includeCredentials: false})
    ).toThrow('Dataset "missing" has no loaded data to embed');
  });

  it.each([
    [
      'https://user:secret@tiles.test/{z}/{x}/{y}.pbf?access_token=private&style=a%2fb&tile={z}&label=hello%20world#layer-{x}',
      'https://tiles.test/{z}/{x}/{y}.pbf?style=a%2fb&tile={z}&label=hello%20world#layer-{x}'
    ],
    [
      '//user:secret@tiles.test/{z}/{x}/{y}.pbf?v=1&%61pi_key=private&v=2&token=other#layer-{y}',
      '//tiles.test/{z}/{x}/{y}.pbf?v=1&v=2#layer-{y}'
    ],
    [
      '../tiles/{z}/{x}/{y}.pbf?token=private&style=a%2fb&tile={x}&label=hello+world#layer-{z}',
      '../tiles/{z}/{x}/{y}.pbf?style=a%2fb&tile={x}&label=hello+world#layer-{z}'
    ]
  ])(
    'preserves tile templates and unrelated URL text when excluding credentials: %s',
    (url, expected) => {
      const tiles = makeTable('tiles', DatasetType.VECTOR_TILE);
      tiles.metadata = {tilesetDataUrl: url};
      const state = stateFor(tiles);
      state.mapStyle.mapStyles.custom.url = url;
      const saved = JSON.parse(
        serializeProject(state, {dataMode: 'references', includeCredentials: false}).text
      );

      expect(saved.datasets[0].data.metadata.tilesetDataUrl).toBe(expected);
      expect(saved.config.config.mapStyle.mapStyles.custom.url).toBe(expected);
      expect(processKeplerglJSON(saved)?.datasets?.[0]).toMatchObject({
        metadata: {tilesetDataUrl: expected}
      });
      expect(tiles.metadata.tilesetDataUrl).toBe(url);
      expect(state.mapStyle.mapStyles.custom.url).toBe(url);

      const withCredentials = JSON.parse(
        serializeProject(state, {dataMode: 'references', includeCredentials: true}).text
      );
      expect(withCredentials.datasets[0].data.metadata.tilesetDataUrl).toBe(url);
      expect(withCredentials.config.config.mapStyle.mapStyles.custom.url).toBe(url);
    }
  );
});
