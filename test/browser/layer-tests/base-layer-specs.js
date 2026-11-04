// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape-catch';
import {Layer, AggregationLayer, KeplerGlLayers} from '@kepler.gl/layers';
import {_compareProps} from '@deck.gl/core';
import {tableFromArrays} from 'apache-arrow';
import {getTextOffsetByRadius} from '../../../src/layers/src/layer-text-label';
import {KeplerTable} from '@kepler.gl/table';

test('#BaseLayer -> updateLayerDomain', t => {
  const rows = [
    ['a', 3],
    ['b', 4],
    ['c', 1],
    ['d', null],
    ['e', 5],
    ['f', 0]
  ];
  const fields = [
    {
      name: 'f1'
    },
    {
      name: 'f2'
    }
  ];
  const dataset = new KeplerTable({
    info: {
      id: 'test'
    }
  });
  dataset.importData({
    data: {
      rows,
      fields
    }
  });

  dataset.filteredIndex = [0, 1, 2, 3];
  dataset.filteredIndexForDomain = [0, 1, 2, 3, 4];

  const mockLayer = new Layer({dataId: 'test'});

  mockLayer.updateLayerConfig({
    colorField: dataset.fields[1],
    colorDomain: [0, 1],
    colorScale: 'quantile',
    sizeField: null,
    sizeDomain: [0, 1]
  });

  const expectedDomain = [1, 3, 4, 5];
  let updatedLayer = mockLayer.updateLayerDomain({
    test: dataset
  });

  t.deepEqual(
    updatedLayer.config.colorDomain,
    expectedDomain,
    'should calculate layer color domain'
  );

  t.deepEqual(updatedLayer.config.sizeDomain, [0, 1], 'should not calculate layer size domain');

  mockLayer.updateLayerConfig({
    colorField: dataset.fields[0],
    colorDomain: [0, 1],
    colorScale: 'ordinal',
    sizeField: null,
    sizeDomain: [0, 1]
  });

  updatedLayer = mockLayer.updateLayerDomain({
    test: dataset
  });

  const expectedOrdinalDomain = ['a', 'b', 'c', 'd', 'e', 'f'];

  t.deepEqual(
    updatedLayer.config.colorDomain,
    expectedOrdinalDomain,
    'should calculate layer color domain based on ordinal domain'
  );

  const dataset2 = new KeplerTable({
    info: {
      id: 'test'
    }
  });
  dataset2.importData({
    data: {
      rows: [
        ['a', 3],
        ['b', 4],
        ['c', 1],
        ['d', null],
        ['e', 5],
        ['f', 0],
        ['g', 6]
      ],
      fields
    }
  });

  dataset2.filteredIndex = [0, 1, 2, 3];
  dataset2.filteredIndexForDomain = [0, 1, 2, 3, 4];
  updatedLayer = mockLayer.updateLayerDomain({test: dataset2}, {id: 'newFilter'});

  t.deepEqual(
    updatedLayer.config.colorDomain,
    expectedOrdinalDomain,
    'should skip domain calculation if field is ordinal'
  );

  t.end();
});

test('#BaseLayer -> getVisChannelScale, by zoom', t => {
  const scale = 'quantize';
  const domain = {
    z: [2, 3, 4, 5],
    stops: [
      [0, 20],
      [0, 30],
      [0, 40],
      [0, 50]
    ]
  };
  const range = ['#010101', '#020202', '#030303'];

  const mockLayer = new Layer({dataId: 'test'});

  const scaleFunc = mockLayer.getVisChannelScale(scale, domain, range);

  t.ok(scaleFunc.byZoom, true, 'should set by zoom to be truthy');
  const scale1 = scaleFunc(1);
  const scale2 = scaleFunc(3.2);
  const scale3 = scaleFunc(9);

  t.deepEqual(scale1.domain(), [0, 20], 'should set domain by zoom');
  t.deepEqual(scale1.range(), range, 'should set range');
  t.deepEqual(scale2.domain(), [0, 30], 'should set domain by zoom');
  t.deepEqual(scale3.domain(), [0, 50], 'should set domain by zoom');

  t.end();
});

test('#AggregationLayer -> updateLayerDomain', t => {
  const rows = [
    ['a', 3],
    ['b', 4],
    ['c', 1],
    ['d', null]
  ];

  const fields = [
    {
      name: 'f1'
    },
    {
      name: 'f2'
    }
  ];
  const dataset = new KeplerTable({
    info: {
      id: 'test'
    }
  });
  dataset.importData({
    data: {
      rows,
      fields
    }
  });

  const mockLayer = new AggregationLayer({dataId: 'test'});

  mockLayer.updateLayerConfig({
    colorField: dataset.fields[1],
    colorDomain: [0, 1],
    colorScale: 'quantile',
    sizeField: null,
    sizeDomain: [0, 1]
  });

  const updatedLayer = mockLayer.updateLayerDomain({test: dataset});
  t.deepEqual(
    updatedLayer.config.colorDomain,
    [0, 1],
    'should not calculate aggregation layer domain'
  );

  t.end();
});

test('#BaseLayer -> getAllPossibleColumnPairs', t => {
  const columnes1 = {
    a: [1, 2],
    b: [3, 4]
  };
  const columnes2 = {
    a: [1],
    b: [3, 4]
  };

  const columnes3 = {
    a: [1]
  };
  t.equal(Layer.getAllPossibleColumnPairs(columnes1).length, 4, 'should find 4 pairs');
  t.equal(Layer.getAllPossibleColumnPairs(columnes2).length, 2, 'should find 4 pairs');
  t.equal(Layer.getAllPossibleColumnPairs(columnes3).length, 1, 'should find 4 pairs');
  t.end();
});

test('#BaseLayer -> text offsets invalidate only for their inputs', t => {
  for (const LayerClass of [
    KeplerGlLayers.PointLayer,
    KeplerGlLayers.IconLayer,
    KeplerGlLayers.GeojsonLayer,
    KeplerGlLayers.TripLayer,
    KeplerGlLayers.H3Layer,
    AggregationLayer
  ]) {
    for (const arrow of [false, true]) {
      const layer = new LayerClass({id: 'text-offset', dataId: 'points'});
      layer.config.textLabel[0] = {
        ...layer.config.textLabel[0],
        field: {name: 'label'},
        anchor: 'start',
        alignment: 'bottom',
        size: 18,
        collisionEnabled: false
      };
      let camera = {latitude: 30, longitude: 0, zoom: 10, zoomOffset: 0};
      const data = {
        data: arrow ? tableFromArrays({label: ['x']}) : [{radius: 2}],
        textLabels: [{getText: () => 'x'}]
      };
      let triggers = {
        getRadius: {sizeField: 'radius'},
        getPointRadius: {radiusField: 'point-radius'}
      };
      const render = () =>
        layer.renderTextLabelLayer(
          {
            getPosition: () => [0, 0],
            getPixelOffset: getTextOffsetByRadius(
              layer.getRadiusScaleByZoom(camera),
              d => d.radius,
              camera
            ),
            updateTriggers: triggers,
            sharedProps: {}
          },
          {data, mapState: camera, visible: true}
        )[0];
      const first = render();
      const differs = next =>
        _compareProps({
          oldProps: first.props.updateTriggers.getPixelOffset,
          newProps: next.props.updateTriggers.getPixelOffset
        });
      let invalidations = 0;
      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        camera = {
          ...camera,
          longitude: i,
          bearing: i,
          pitch: i / 2,
          width: 800 + i,
          isDragging: Boolean(i % 2),
          layerParameters: {blend: true}
        };
        if (differs(render())) invalidations++;
      }
      t.comment(
        `${
          layer.type
        }, Arrow=${arrow}: ${invalidations}/100 unrelated renders invalidate offsets (${(
          performance.now() - start
        ).toFixed(2)} ms)`
      );
      t.equal(invalidations, 0, 'unrelated map state does not rebuild label offsets');
      t.deepEqual(
        render().props.getPixelOffset({radius: 2}),
        first.props.getPixelOffset({radius: 2}),
        'offset values stay unchanged'
      );
      for (const [key, value] of [
        ['latitude', 45],
        ['zoom', 11],
        ['scale', 2000],
        ['zoomOffset', 2]
      ]) {
        const previous = camera;
        camera = {...camera, [key]: value};
        t.ok(differs(render()), `${key} invalidates offsets`);
        camera = previous;
      }
      for (const [key, value] of [
        ['size', 30],
        ['anchor', 'end'],
        ['alignment', 'top'],
        ['offset', [4, 5]]
      ]) {
        const previous = layer.config.textLabel[0];
        layer.config.textLabel[0] = {...previous, [key]: value};
        t.ok(differs(render()), `label ${key} invalidates offsets`);
        layer.config.textLabel[0] = previous;
      }
      for (const key of ['getRadius', 'getPointRadius']) {
        const previous = triggers;
        triggers = {
          ...triggers,
          [key]: {[key === 'getRadius' ? 'sizeField' : 'radiusField']: 'replacement'}
        };
        t.ok(differs(render()), `${key} invalidates offsets`);
        triggers = previous;
      }
      layer.config.visConfig.radius = 42;
      t.ok(differs(render()), 'radius scale invalidates offsets');
    }
  }
  t.end();
});
