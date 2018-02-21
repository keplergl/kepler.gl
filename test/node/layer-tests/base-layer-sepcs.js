import test from 'tape-catch';
import Layer from 'keplergl-layers/base-layer';
import AggregationLayer from 'keplergl-layers/aggregation-layer';

test('#BaseLayer -> updateLayerDomain', t => {

  const data = [['a', 3], ['b', 4], ['c', 1], ['d', null]];
  const mockLayer = new Layer();

  mockLayer.updateLayerConfig({
    colorField: {
      tableFieldIndex: 2,
      type: 'real'
    },
    colorDomain: [0, 1],
    colorScale: 'quantile',
    sizeField: null,
    sizeDomain: [0, 1]
  });

  const expectedDomain = [1, 3, 4];
  const updatedLayer = mockLayer.updateLayerDomain({data, allData: data});

  t.deepEqual(updatedLayer.config.colorDomain, expectedDomain,
    'should calculate layer color domain');

  t.deepEqual(updatedLayer.config.sizeDomain, [0, 1],
    'should not calculate layer size domain');

  t.end();
});

test('#AggregationLayer -> updateLayerDomain', t => {
  const data = [['a', 3], ['b', 4], ['c', 1], ['d', null]];
  const mockLayer = new AggregationLayer();

  mockLayer.updateLayerConfig({
    colorField: {
      tableFieldIndex: 2,
      type: 'real'
    },
    colorDomain: [0, 1],
    colorScale: 'quantile',
    sizeField: null,
    sizeDomain: [0, 1]
  });

  const updatedLayer = mockLayer.updateLayerDomain({data, allData: data});
  t.deepEqual(updatedLayer.config.colorDomain, [0, 1],
    'should not calculate aggregation layer domain');

  t.end();
});
