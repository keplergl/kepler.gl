// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import test from 'tape';
import {
  testCreateCases,
  testFormatLayerDataCases,
  testRenderLayerCases
} from 'test/helpers/layer-utils';
import csvData from 'test/fixtures/test-csv-data';
import {KeplerGlLayers} from 'layers';
const {ClusterLayer} = KeplerGlLayers;

import {processCsvData} from 'processors/data-processor';

test('#ClusterLayer -> constructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'smoothie',
          isVisible: true,
          label: 'test cluster layer'
        },
        test: layer => {
          t.ok(
            layer.config.dataId === 'smoothie',
            'ClusterLayer dataId should be correct'
          );
          t.ok(layer.type === 'cluster', 'type should be cluster');
          t.ok(layer.isAggregated === true, 'ClusterLayer is aggregated');
        }
      }
    ]
  };

  testCreateCases(t, ClusterLayer, TEST_CASES.CREATE);
  t.end();
});

test('#ClusterLayer -> formatLayerData', t => {
  const {rows} = processCsvData(csvData);

  const filteredIndex = [0, 2, 4];
  const data = [rows[0], rows[2], rows[4]];

  const expectedLayerMeta = {
    bounds: [31.2148748, 29.9870074, 31.2590542, 30.0614122]
  };

  const TEST_CASES = [
    {
      props: {
        dataId: '0dj3h',
        label: 'gps point',
        columns: {
          lat: {
            value: 'gps_data.lat',
            fieldIdx: 1
          },
          lng: {
            value: 'gps_data.lng',
            fieldIdx: 2
          }
        }
      },
      data: [data, rows, filteredIndex, undefined],
      test: result => {
        const {layerData, layer} = result;
        const expectedLayerData = {
          data: [rows[0], rows[2], rows[4]],
          getPosition: () => {}
        };

        t.deepEqual(
          Object.keys(layerData).sort(),
          Object.keys(expectedLayerData).sort(),
          'layerData should have 6 keys'
        );
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct cluster layerData'
        );
        t.ok(
          typeof layerData.getPosition === 'function',
          'should have getPosition accessor as function'
        );
        t.deepEqual(
          layerData.getPosition(layerData.data[0]),
          [31.2590542, 29.9900937],
          'getPosition should return correct lat lng'
        );
        t.deepEqual(
          layer.meta,
          expectedLayerMeta,
          'should format correct cluster layer meta'
        );
      }
    }
  ];

  testFormatLayerDataCases(t, ClusterLayer, TEST_CASES);
  t.end();
});

test('#PointLayer -> renderLayer', t => {
  const {rows} = processCsvData(csvData);

  const filteredIndex = rows.map((d, i) => i);
  const data = rows;

  const TEST_CASES = [
    {
      props: {
        dataId: '0dj3h',
        label: 'gps point',
        id: 'test',
        columns: {
          lat: {
            value: 'gps_data.lat',
            fieldIdx: 1
          },
          lng: {
            value: 'gps_data.lng',
            fieldIdx: 2
          }
        }
      },
      renderArgs: {
        mapState: {
          height: 914,
          latitude: 30.05057028781603,
          longitude: 31.235150464409074,
          width: 1136,
          zoom: 11.447706282002736
        },
        layerCallbacks: {
          onSetLayerDomain: domain => {}
        }
      },
      data: [data, rows, filteredIndex, undefined],
      assert: (deckLayers, layer, result) => {
        t.equal(deckLayers.length, 2, 'should render 2 layers');

        t.deepEqual(
          deckLayers.map(l => l.id),
          ['test', 'test-cluster'],
          'should render 1 cluster, 1 point layer'
        );

        const clusterLayer = deckLayers[0];
        const {clusters} = clusterLayer.state;

        t.equal(clusters.length, 7, 'should create 7 clusters');
        clusters.forEach(cluster => {
          t.ok(
            cluster.properties.point_count === cluster.properties.points.length,
            'point count should be correct'
          );
        });
      }
    }
  ];

  testRenderLayerCases(t, ClusterLayer, TEST_CASES);
  t.end();
});
