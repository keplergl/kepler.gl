// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Attribute, Layer, WebMercatorViewport} from '@deck.gl/core';
import {KeplerTable} from '@kepler.gl/table';
import {visStateSchemaV1} from '../../../schemas/src/vis-state-schema';
import HexagonLayer from './hexagon-layer';

function renderCells(layer: HexagonLayer, latitudes: number[]) {
  const table = new KeplerTable({info: {id: 'points'}, color: [0, 0, 0]}).updateSchema({
    fields: [
      {name: 'lat', type: 'real'},
      {name: 'lng', type: 'real'}
    ],
    rows: latitudes.map(lat => [lat, 0])
  });
  const data = layer.formatLayerData({points: table}, {}) as {
    data: {index: number}[];
    getPosition: (point: {index: number}) => number[];
  };
  const [deckLayer] = layer.renderLayer({
    data,
    gpuFilter: table.gpuFilter,
    layerCallbacks: {onSetLayerDomain: () => {}},
    mapState: {zoom: 4},
    idx: 0,
    visible: true
  });

  // Drive the real deck.gl CPU aggregator, passing positions directly to
  // avoid creating a GPU context and attribute manager in Jest.
  const deckHexagon = deckLayer as any;
  jest.spyOn(deckHexagon, 'getCurrentLayer').mockReturnValue(deckHexagon);
  jest.spyOn(deckHexagon, 'setState').mockImplementation(update => {
    Object.assign(deckHexagon.state, update);
  });
  const viewport = new WebMercatorViewport({longitude: 0, latitude: 0, zoom: 4});
  const radiusCommon = viewport.distanceScales.unitsPerMeter[0] * deckHexagon.props.radius;
  const hexOriginCommon = [0, 0];
  deckHexagon.state = {aggregatorViewport: viewport, radiusCommon, hexOriginCommon};
  const aggregator = deckHexagon.createAggregator('cpu');
  deckHexagon.state.aggregator = aggregator;
  const positions = Float64Array.from(data.data.flatMap(point => [...data.getPosition(point), 0]));
  const counts = (indices: number[]) => indices.length;
  const weights = new Float32Array(latitudes.length);
  const attribute = (value: Float32Array | Float64Array, size: number) =>
    ({value, getAccessor: () => ({size})} as Attribute);
  aggregator.setProps({
    attributes: {
      positions: attribute(positions, 3),
      colorWeights: attribute(weights, 1),
      elevationWeights: attribute(weights, 1)
    },
    binOptions: {radiusCommon, hexOriginCommon},
    pointCount: latitudes.length,
    operations: ['COUNT', 'COUNT'],
    customOperations: [
      counts,
      indices => deckHexagon.props.getElevationValue(indices.map(i => data.data[i]))
    ],
    onUpdate: args => deckHexagon._onAggregationUpdate(args)
  });
  aggregator.update();
  const rendered = deckHexagon.renderLayers();
  return (Array.isArray(rendered) ? rendered[0] : rendered) as Layer & {
    props: {
      elevationRange: [number, number];
      elevationDomain: [number, number];
      data: {attributes: {getElevationValue: {value: Float32Array}}};
    };
  };
}

function createLayer() {
  const layer = new HexagonLayer({
    dataId: 'points',
    columns: {lat: {value: 'lat', fieldIdx: 0}, lng: {value: 'lng', fieldIdx: 1}}
  });
  layer.config.visConfig.enable3d = true;
  return layer;
}

test('starts linear point-count heights at zero only when opted in', () => {
  const layer = createLayer();
  const latitudes = [0, 1, 1, 2, 2, 2];
  const legacy = renderCells(layer, latitudes);
  expect(legacy.props.elevationDomain).toEqual([1, 3]);

  layer.config.visConfig.zeroCountHeight = true;
  expect(layer.shouldCalculateLayerData(['zeroCountHeight'])).toBe(false);
  const fromZero = renderCells(layer, latitudes);
  expect(fromZero.props.elevationDomain).toEqual([0, 3]);
  expect(fromZero.props.elevationRange[0]).toBe(0);
  expect(Array.from(fromZero.props.data.attributes.getElevationValue.value)).toEqual([1, 2, 3]);
});

test('round-trips the opt-in without enabling it in older maps', () => {
  const layer = createLayer();
  layer.config.visConfig.zeroCountHeight = true;
  const {visState: saved} = visStateSchemaV1.savePropertiesOrApplySchema({
    layers: [layer],
    layerOrder: [layer.id]
  });
  const [loaded] = visStateSchemaV1.load(JSON.parse(JSON.stringify(saved))).visState!.layers!;
  expect(loaded.config.visConfig?.zeroCountHeight).toBe(true);

  delete saved.layers[0].config.visConfig?.zeroCountHeight;
  const [older] = visStateSchemaV1.load(JSON.parse(JSON.stringify(saved))).visState!.layers!;
  expect(older.config.visConfig?.zeroCountHeight).toBeUndefined();
  const oldLayer = createLayer();
  oldLayer.updateLayerConfig({
    visConfig: {...oldLayer.config.visConfig, ...older.config.visConfig}
  });
  expect(renderCells(oldLayer, [0, 1, 1]).props.elevationDomain).toEqual([1, 2]);
});

test('uses a nondegenerate domain when every occupied bin has one point', () => {
  const layer = createLayer();
  layer.config.visConfig.zeroCountHeight = true;
  expect(renderCells(layer, [0, 1]).props.elevationDomain).toEqual([0, 1]);
});

test.each([
  {sizeScale: 'sqrt', visConfig: {}},
  {sizeScale: 'linear', visConfig: {sizeRange: [50, 500] as [number, number]}},
  {sizeScale: 'linear', visConfig: {elevationPercentile: [10, 100] as [number, number]}}
] as const)('does not override other height settings (%o)', ({sizeScale, visConfig}) => {
  const layer = createLayer();
  layer.config.sizeScale = sizeScale;
  Object.assign(layer.config.visConfig, visConfig, {zeroCountHeight: true});
  expect(renderCells(layer, [0, 1, 1]).props.elevationDomain).toEqual([1, 2]);
});
