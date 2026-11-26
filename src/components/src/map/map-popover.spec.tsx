// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {injectIntl, IntlProvider} from 'react-intl';
import {ThemeProvider} from 'styled-components';
import {KeplerGlLayers, Layer, LayerClasses} from '@kepler.gl/layers';
import {S2Layer} from '@deck.gl/geo-layers';
import {ScatterplotLayer} from '@deck.gl/layers';
import {cellToBoundary, hexToU64} from 'a5-js';
import {messages} from '@kepler.gl/localization';
import {
  getLayerHoverProp,
  getLayerHoverPropValue,
  INITIAL_VIS_STATE,
  LayerHoverProp
} from '@kepler.gl/reducers';
import {KeplerTable} from '@kepler.gl/table';
import {theme} from '@kepler.gl/styles';
import MapPopoverFactory, {getSelectedFeature} from './map-popover';

type PopoverContentProps = React.ComponentProps<
  Parameters<typeof MapPopoverFactory>[0]['WrappedComponent']
>;
const MapPopover = MapPopoverFactory(injectIntl((_props: PopoverContentProps) => null));
const {dataContainer} = new KeplerTable({info: {id: 'points'}, color: [0, 0, 0]});
const ring = [
  [-122.4, 37.7],
  [-122.39, 37.71],
  [-122.39, 37.72],
  [-122.4, 37.73],
  [-122.41, 37.72],
  [-122.41, 37.71],
  [-122.4, 37.7]
];

function renderCellPopover(
  LayerClass: typeof KeplerGlLayers.HexagonLayer | typeof KeplerGlLayers.GridLayer,
  cellOutline: readonly (readonly number[])[] | undefined,
  frozen = true
) {
  const layer = new LayerClass({id: 'cell'});
  const hover: LayerHoverProp = {
    layer,
    data: layer.getHoverData({points: [], cellOutline}, dataContainer, []),
    fields: [],
    fieldsToShow: []
  };
  return renderPopover(hover, frozen);
}

function renderPopover(hover: LayerHoverProp | null, frozen = true) {
  const setSelectedFeature = jest.fn();
  const onSetFeatures = jest.fn();
  const onClose = jest.fn();
  const existingFeature = {
    id: 'previous',
    properties: {},
    geometry: {type: 'Point', coordinates: [-122.4, 37.7]}
  };
  render(
    <ThemeProvider theme={theme}>
      <IntlProvider locale="en" messages={messages.en}>
        <MapPopover
          x={20}
          y={30}
          zoom={10}
          frozen={frozen}
          coordinate={false}
          layerHoverProp={hover}
          onClose={onClose}
          setSelectedFeature={setSelectedFeature}
          onSetFeatures={onSetFeatures}
          featureCollection={{type: 'FeatureCollection', features: [existingFeature]}}
        />
      </IntlProvider>
    </ThemeProvider>
  );

  return {existingFeature, onClose, onSetFeatures, setSelectedFeature};
}

describe.each([
  {name: 'Hexbin', LayerClass: KeplerGlLayers.HexagonLayer, outline: ring},
  {
    name: 'Grid',
    LayerClass: KeplerGlLayers.GridLayer,
    outline: [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0],
      [0, 0]
    ]
  }
])('$name selection', ({LayerClass, outline}) => {
  test('selects the rendered cell outline as a polygon without removing existing geometry', () => {
    const {onSetFeatures, setSelectedFeature, onClose, existingFeature} = renderCellPopover(
      LayerClass,
      outline
    );
    fireEvent.click(screen.getByText('Select Geometry'));

    const feature = {
      id: expect.any(String),
      type: 'Feature',
      properties: {},
      geometry: {type: 'Polygon', coordinates: [outline]}
    };
    expect(setSelectedFeature).toHaveBeenCalledWith(feature, {
      mapIndex: 0,
      rightClick: true,
      position: {x: 20, y: 30}
    });
    expect(onSetFeatures).toHaveBeenCalledWith([existingFeature, feature]);
    expect(onClose).toHaveBeenCalled();
  });

  test.each([
    ['missing outline', undefined, true],
    ['empty outline', [], true],
    ['open outline', ring.slice(0, -1), true],
    ['nonfinite outline', [...ring.slice(0, -1), [NaN, 0]], true],
    ['collapsed cell', Array.from({length: 7}, () => ring[0]), true],
    ['unfrozen tooltip', ring, false]
  ] as const)('does not offer cell selection for %s', (_, cellOutline, frozen) => {
    renderCellPopover(LayerClass, cellOutline, frozen);
    expect(screen.queryByText('Select Geometry')).not.toBeInTheDocument();
  });
});

async function pickedHover(type: keyof typeof LayerClasses, object: any) {
  const dataset = new KeplerTable({info: {id: 'picked'}, color: [0, 0, 0]});
  await dataset.importData({
    data: {
      fields: [{name: 'label', type: 'string'}],
      rows: [['source row']]
    }
  });
  const layer: Layer = new LayerClasses[type]({id: 'picked-layer', dataId: dataset.id});
  const deckLayer =
    type === 's2'
      ? new S2Layer({id: layer.id, ...{idx: 0}})
      : new ScatterplotLayer({id: layer.id, ...{idx: 0}});
  const hover = getLayerHoverProp({
    animationConfig: INITIAL_VIS_STATE.animationConfig,
    interactionConfig: {
      ...INITIAL_VIS_STATE.interactionConfig,
      tooltip: {
        ...INITIAL_VIS_STATE.interactionConfig.tooltip,
        enabled: true,
        config: {
          ...INITIAL_VIS_STATE.interactionConfig.tooltip.config,
          fieldsToShow: {[dataset.id]: [{name: 'label', format: null}]}
        }
      }
    },
    hoverInfo: {picked: true, index: 0, object, layer: deckLayer, x: 20, y: 30},
    layers: [layer],
    layersToRender: {[layer.id]: true},
    datasets: {[dataset.id]: dataset}
  });
  return {hover, layer, deckLayer};
}

const square = [
  [0, 0],
  [0, 1],
  [1, 1],
  [1, 0],
  [0, 0]
];
const a5Token = '9ca4cf8000000000';

test.each([
  ['voronoi', {index: 0, polygon: square}, square],
  [
    'a5',
    {index: 0, token: a5Token},
    cellToBoundary(hexToU64(a5Token), {closedRing: true, segments: 'auto'})
  ],
  [
    'geohash',
    {index: 0, token: 's'},
    [
      [45, 45],
      [45, 0],
      [0, 0],
      [0, 45],
      [45, 45]
    ]
  ]
] as const)(
  'selects the picked %s boundary and preserves source tooltip data',
  async (type, object, boundary) => {
    const {hover} = await pickedHover(type, object);
    expect(getLayerHoverPropValue(hover?.data, 0)).toBe('source row');
    const {onSetFeatures, setSelectedFeature, existingFeature} = renderPopover(hover);
    fireEvent.click(screen.getByText('Select Geometry'));
    const feature = setSelectedFeature.mock.calls[0][0];
    expect(feature.geometry).toEqual({type: 'Polygon', coordinates: [boundary]});
    expect(feature.id).toEqual(expect.any(String));
    expect(onSetFeatures).toHaveBeenCalledWith([existingFeature, feature]);
    expect(getSelectedFeature(hover)?.id).not.toBe(feature.id);
  }
);

test.each(['80858004', '04', '6c'])('selects the rendered S2 boundary for %s', async token => {
  const object = {index: 0, token};
  const {hover, deckLayer} = await pickedHover('s2', object);
  const {setSelectedFeature} = renderPopover(hover);
  fireEvent.click(screen.getByText('Select Geometry'));
  const geometry = setSelectedFeature.mock.calls[0][0].geometry;
  expect(geometry.type).toBe('Polygon');
  const boundary = geometry.coordinates[0];
  const getPolygon = (deckLayer as S2Layer).indexToBounds()?.getPolygon;
  if (typeof getPolygon !== 'function') throw new Error('Missing rendered S2 polygon');
  expect(boundary.flat()).toEqual(
    Array.from(getPolygon(object, {index: 0, data: [], target: []}) as Float64Array)
  );
  expect(boundary[0]).toEqual(boundary[boundary.length - 1]);
  expect(boundary.flat().every(Number.isFinite)).toBe(true);
});

test.each([
  {type: 'Point', coordinates: [12, 34]},
  {
    type: 'LineString',
    coordinates: [
      [12, 34],
      [13, 35]
    ]
  },
  {type: 'Polygon', coordinates: [square]},
  {type: 'MultiPolygon', coordinates: [[square]]}
])('selects the picked vector tile $type with its properties', async geometry => {
  const object = {id: 123, type: 'Feature', properties: {label: 'tile feature'}, geometry};
  const {hover} = await pickedHover('vectorTile', object);
  const {setSelectedFeature} = renderPopover(hover);
  fireEvent.click(screen.getByText('Select Geometry'));
  expect(setSelectedFeature.mock.calls[0][0]).toEqual({...object, id: expect.any(String)});
  expect(object.id).toBe(123);
  expect(hover?.data).toEqual(['tile feature']);
});

test.each([
  ['voronoi', {index: 0}],
  ['voronoi', {index: 0, polygon: []}],
  ['voronoi', {index: 0, polygon: square.slice(0, -1)}],
  [
    'voronoi',
    {
      index: 0,
      polygon: [
        [0, 0],
        [1, 0],
        [2, 0],
        [0, 0]
      ]
    }
  ],
  [
    'voronoi',
    {
      index: 0,
      polygon: [
        [0, 0],
        [1, Infinity],
        [1, 0],
        [0, 0]
      ]
    }
  ],
  ['a5', {index: 0}],
  ['a5', {index: 0, token: 'invalid'}],
  ['geohash', {index: 0}],
  ['geohash', {index: 0, token: 'invalid!'}],
  ['s2', {index: 0}],
  ['s2', {index: 0, token: 'invalid'}],
  ['vectorTile', {type: 'Feature', properties: {}, geometry: null}],
  ['vectorTile', {type: 'Feature', properties: {}, geometry: {type: 'Polygon', coordinates: []}}],
  ['point', {index: 0}]
] as const)('hides selection for unavailable %s geometry (%j)', async (type, object) => {
  const {hover} = await pickedHover(type, object);
  renderPopover(hover);
  expect(screen.queryByText('Select Geometry')).not.toBeInTheDocument();
  expect(getSelectedFeature(hover)).toBeNull();
});

test('keeps selection hidden for an unpinned tooltip with available geometry', async () => {
  const {hover} = await pickedHover('voronoi', {index: 0, polygon: square});
  renderPopover(hover, false);
  expect(screen.queryByText('Select Geometry')).not.toBeInTheDocument();
});

test.each(['hexagonId', 'geojson'] as const)('preserves existing %s selection', type => {
  const geometry = {type: 'Polygon', coordinates: [square]};
  const layer = new LayerClasses[type]({
    dataId: 'existing',
    columns: {[type === 'hexagonId' ? 'hex_id' : 'geojson']: {value: 'geometry', fieldIdx: 0}}
  });
  const hover: LayerHoverProp = {
    layer,
    data: [type === 'hexagonId' ? '8928308280fffff' : {type: 'Feature', properties: {}, geometry}],
    fields: [],
    fieldsToShow: []
  };
  const {setSelectedFeature} = renderPopover(hover);
  fireEvent.click(screen.getByText('Select Geometry'));
  const feature = setSelectedFeature.mock.calls[0][0];
  expect(feature.geometry.type).toBe('Polygon');
  expect(feature.geometry.coordinates[0].length).toBe(type === 'hexagonId' ? 7 : 5);
  const polygonMatcher = {type: 'Polygon', coordinates: expect.any(Array)};
  expect(feature.geometry).toEqual(type === 'geojson' ? geometry : polygonMatcher);
});
