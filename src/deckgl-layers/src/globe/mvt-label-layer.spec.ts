// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {AccessorFunction, Color, Position, UpdateParameters} from '@deck.gl/core';
import {GeoJsonLayer, TextLayer} from '@deck.gl/layers';
import {DEFAULT_GLOBE_CONFIG} from '@kepler.gl/constants';
import type {Feature} from 'geojson';
import EnhancedMultiIconLayer from './enhanced-multi-icon-layer';
import {MVTLabelLayer} from './mvt-label-layer';

const feature = (
  properties: Feature['properties'],
  geometry: Feature['geometry'] | null = {
    type: 'Point',
    coordinates: [12, 34]
  }
): Feature => ({type: 'Feature', properties, geometry} as Feature);
const country = (properties = {}) => feature({layerName: 'place', class: 'country', ...properties});
const createLayer = (props = {}) =>
  new MVTLabelLayer({
    id: 'labels',
    data: [],
    config: {...DEFAULT_GLOBE_CONFIG, labels: true},
    ...props
  });
const update = (layer: MVTLabelLayer, dataChanged: boolean) => {
  layer.updateState({changeFlags: {dataChanged}} as UpdateParameters<MVTLabelLayer>);
};
// Exercise the real composite row/accessor mapping without initializing a GPU device.
const initializeState = (layer: MVTLabelLayer) => {
  layer.state = {};
  jest.spyOn(layer, 'setState').mockImplementation(state => Object.assign(layer.state, state));
  return layer;
};

describe('MVTLabelLayer', () => {
  test.each([
    [{layerName: 'place_label', name_en: 'Germany', name: 'Deutschland'}, 'Germany'],
    [{layerName: 'place_label', name_en: '', name: 'Deutschland'}, 'Deutschland'],
    [{'name:en': 'Germany', name_en: 'Other', name: 'Deutschland'}, 'Germany'],
    [{'name:en': '', name_en: 'Germany', name: 'Deutschland'}, 'Germany'],
    [{name: 'Deutschland'}, 'Deutschland'],
    [{}, ''],
    [{layerName: 'place_label'}, ''],
    [{class: 'city', name: 'Berlin'}, ''],
    [{layerName: 'place_label', class: 'city', name: 'Berlin'}, ''],
    [{layerName: 'water', name: 'Sea'}, '']
  ])('selects country labels with provider fallbacks: %j', (properties, expected) => {
    expect(createLayer().getLabel(country(properties))).toBe(expected);
  });

  test('missing properties and non-point geometries do not produce labels or anchors', () => {
    const layer = createLayer();
    expect(layer.getLabel(feature(null))).toBe('');
    expect(layer.getLabelAnchors(feature({}, null))).toEqual([]);
    expect(
      layer.getLabelAnchors(
        feature(
          {},
          {
            type: 'LineString',
            coordinates: [
              [0, 0],
              [1, 1]
            ]
          }
        )
      )
    ).toEqual([]);
    expect(
      layer.getLabelAnchors(
        feature(
          {},
          {
            type: 'Polygon',
            coordinates: [
              [
                [0, 0],
                [1, 0],
                [0, 0]
              ]
            ]
          }
        )
      )
    ).toEqual([]);
  });

  test.each([false, true])(
    'expands point anchors and preserves their source label (collection=%s)',
    collection => {
      const features = [
        country({name: 'Côte d’Ivoire'}),
        feature(
          {layerName: 'place_label', class: 'country', name: 'Türkiye'},
          {
            type: 'MultiPoint',
            coordinates: [
              [1, 2],
              [3, 4, 5]
            ]
          }
        ),
        feature({}, null)
      ];
      const data = collection ? {features} : features;
      const layer = initializeState(createLayer({data}));
      update(layer, true);
      const [geometry, text] = layer.renderLayers() as [GeoJsonLayer, TextLayer];
      expect(geometry.props.data).toBe(data);
      const rows = text.props.data as any[];
      expect(rows).toHaveLength(3);
      const getPosition = text.props.getPosition as AccessorFunction<any, Position>;
      const getText = text.props.getText as AccessorFunction<any, string>;
      expect(rows.map(row => getPosition(row, {index: 0, data: rows, target: []}))).toEqual([
        [12, 34],
        [1, 2],
        [3, 4, 5]
      ]);
      expect(rows.map((row, index) => getText(row, {index, data: rows, target: []}))).toEqual([
        'Côte d’Ivoire',
        'Türkiye',
        'Türkiye'
      ]);
      expect(
        (text.props.getSize as AccessorFunction<any, number>)(rows[0], {
          index: 0,
          data: rows,
          target: []
        })
      ).toBeGreaterThan(0);
      expect(text.props.characterSet).toBe('auto');
      expect(text.props._subLayerProps?.characters?.type).toBe(EnhancedMultiIconLayer);
      expect(text.props.parameters).toMatchObject({
        cullMode: 'none',
        depthCompare: 'always',
        depthWriteEnabled: false
      });
    }
  );

  test('does not regenerate label rows for viewport-only updates and clears rows for empty tiles', () => {
    const layer = initializeState(createLayer({data: [country({name: 'France'})]}));
    update(layer, true);
    const rows = layer.state.labelData;
    update(layer, false);
    expect(layer.state.labelData).toBe(rows);
    expect(layer.setState).toHaveBeenCalledTimes(1);
    const empty = initializeState(createLayer({data: []}));
    empty.state.labelData = rows;
    update(empty, true);
    expect(empty.state.labelData).toEqual([]);
  });

  test('label visibility leaves geometry rendered and forwards color invalidation triggers', () => {
    const config = {...DEFAULT_GLOBE_CONFIG, labels: false, water: false, adminLines: false};
    const layer = initializeState(createLayer({config}));
    const layers = layer.renderLayers();
    expect(layers).toHaveLength(1);
    expect(layers[0]).toBeInstanceOf(GeoJsonLayer);
    expect(layers[0].props.updateTriggers).toMatchObject({
      getFillColor: {water: false, waterColor: config.waterColor},
      getLineColor: {adminLines: false, adminLinesColor: config.adminLinesColor}
    });
    const labelsColor = [1, 2, 3];
    const enabled = initializeState(createLayer({config: {...config, labels: true, labelsColor}}));
    const text = enabled.renderLayers()[1] as TextLayer;
    expect((text.props.getColor as () => Color)()).toEqual(labelsColor);
    expect(text.props.updateTriggers?.getColor).toEqual(labelsColor);
  });

  test('forwards label orientation, units and optional background without requiring a background', () => {
    const defaultText = initializeState(createLayer()).renderLayers()[1] as TextLayer;
    expect(defaultText.props.background).toBe(false);
    expect((defaultText.props.getBackgroundColor as () => Color)()).toEqual([0, 0, 0, 0]);
    const background = [1, 2, 3, 255];
    const text = initializeState(
      createLayer({labelBackground: background, billboard: false, labelSizeUnits: 'meters'})
    ).renderLayers()[1] as TextLayer;
    expect(text.props.background).toBe(true);
    expect((text.props.getBackgroundColor as () => Color)()).toEqual(background);
    expect(text.props.billboard).toBe(false);
    expect(text.props.sizeUnits).toBe('meters');
  });
});
