// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import TripLayer from './trip-layer';
import KeplerTable from '@kepler.gl/table';
import {ALL_FIELD_TYPES, SCALE_TYPES} from '@kepler.gl/constants';

/**
 * Build a small taxi-trip table: 3 trips (2 points each) across 3 companies.
 * Rows are grouped by trip id so that feature index != row index — the first
 * trip occupies rows 0-1, so reading the color field by feature index would
 * return the first trip's company for the first two features.
 */
async function makeTripTable() {
  const table = new KeplerTable({color: [255, 0, 0]} as any);
  await table.importData({
    data: {
      rows: [
        // trip 1 (Uber): 2 points
        ['t1', 37.77, -122.42, '2024-01-01 00:00:00', 'Uber'],
        ['t1', 37.78, -122.41, '2024-01-01 00:00:10', 'Uber'],
        // trip 2 (Lyft): 2 points
        ['t2', 37.79, -122.4, '2024-01-01 00:00:20', 'Lyft'],
        ['t2', 37.8, -122.39, '2024-01-01 00:00:30', 'Lyft'],
        // trip 3 (Waymo): 2 points
        ['t3', 37.81, -122.38, '2024-01-01 00:00:40', 'Waymo'],
        ['t3', 37.82, -122.37, '2024-01-01 00:00:50', 'Waymo']
      ],
      fields: [
        {name: 'id', type: ALL_FIELD_TYPES.string},
        {name: 'latitude', type: ALL_FIELD_TYPES.real},
        {name: 'longitude', type: ALL_FIELD_TYPES.real},
        {name: 'timestamp', type: ALL_FIELD_TYPES.timestamp},
        {name: 'company', type: ALL_FIELD_TYPES.string}
      ]
    } as any
  });
  return table;
}

function makeTripLayer(table: KeplerTable) {
  const layer = new TripLayer({
    id: 'trip1',
    dataId: table.id,
    columnMode: 'table',
    columns: {
      id: {value: 'id', fieldIdx: table.fields.findIndex(f => f.name === 'id')},
      lat: {value: 'latitude', fieldIdx: table.fields.findIndex(f => f.name === 'latitude')},
      lng: {value: 'longitude', fieldIdx: table.fields.findIndex(f => f.name === 'longitude')},
      timestamp: {
        value: 'timestamp',
        fieldIdx: table.fields.findIndex(f => f.name === 'timestamp')
      },
      geojson: {value: null, fieldIdx: -1}
    }
  } as any);

  const companyField = table.fields.find(f => f.name === 'company')!;
  layer.updateLayerConfig({
    colorField: companyField,
    colorScale: SCALE_TYPES.customOrdinal,
    colorDomain: ['Uber', 'Lyft', 'Waymo'],
    visConfig: {
      ...layer.config.visConfig,
      colorRange: {
        name: 'custom',
        type: 'customOrdinal',
        category: 'Custom',
        colors: ['#000000', '#FF00BF', '#00A86B', '#E82127'],
        colorMap: [
          ['Lyft', '#000000'],
          ['Tesla', '#FF00BF'],
          ['Uber', '#00A86B'],
          ['Waymo', '#E82127']
        ]
      }
    }
  });
  return layer;
}

describe('TripLayer TABLE mode color by field', () => {
  it('getColor accessor maps each trip to its own company color', async () => {
    const table = await makeTripTable();
    const layer = makeTripLayer(table);

    layer.updateLayerMeta(table);
    const layerData = layer.formatLayerData({[table.id]: table}, null);

    // Each feature is a trip; getColor should return the trip's company color,
    // not the company of the row at the feature index.
    const colors = layerData.data.map(f => layerData.getColor(f));
    // Uber -> green [0,168,107], Lyft -> black [0,0,0], Waymo -> red [232,33,39]
    expect(colors[0]).toEqual([0, 168, 107]);
    expect(colors[1]).toEqual([0, 0, 0]);
    expect(colors[2]).toEqual([232, 33, 39]);
  });
});
