// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {injectIntl, IntlProvider} from 'react-intl';
import {ThemeProvider} from 'styled-components';
import {KeplerGlLayers} from '@kepler.gl/layers';
import {messages} from '@kepler.gl/localization';
import type {LayerHoverProp} from '@kepler.gl/reducers';
import {KeplerTable} from '@kepler.gl/table';
import {theme} from '@kepler.gl/styles';
import MapPopoverFactory from './map-popover';

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

function renderHexbinPopover(cellOutline: number[][] | undefined, frozen = true) {
  const layer = new KeplerGlLayers.HexagonLayer({id: 'hex'});
  const hover: LayerHoverProp = {
    layer,
    data: layer.getHoverData({points: [], cellOutline}, dataContainer, []),
    fields: [],
    fieldsToShow: []
  };
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

test('selects the rendered Hexbin outline as a polygon without removing existing geometry', () => {
  const {onSetFeatures, setSelectedFeature, onClose, existingFeature} = renderHexbinPopover(ring);
  fireEvent.click(screen.getByText('Select Geometry'));

  const feature = {
    id: expect.any(String),
    type: 'Feature',
    properties: {},
    geometry: {type: 'Polygon', coordinates: [ring]}
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
  ['collapsed cell', Array.from({length: 7}, () => ring[0]), true],
  ['unfrozen tooltip', ring, false]
] as const)('does not offer Hexbin selection for %s', (_, cellOutline, frozen) => {
  renderHexbinPopover(cellOutline, frozen);
  expect(screen.queryByText('Select Geometry')).not.toBeInTheDocument();
});
