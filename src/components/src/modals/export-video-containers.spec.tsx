// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {screen} from '@testing-library/react';
import {renderWithTheme} from 'test/helpers/component-jest-utils';
import {GlobeExportVideoPanelContainer} from './globe-export-video-container';
import {SwipeExportVideoPanelContainer} from './swipe-export-video-container';

jest.mock('@hubble.gl/core', () => ({
  DeckAdapter: jest.fn(() => ({animationManager: {attachAnimation: jest.fn()}})),
  KeplerAnimation: jest.fn()
}));

const mockPreview = ({resolution}: {resolution: [number, number]}) => (
  <output aria-label="Export resolution">{resolution.join('x')}</output>
);

jest.mock('./globe-export-video-preview', () => ({
  GlobeExportVideoPreview: (props: Parameters<typeof mockPreview>[0]) => mockPreview(props)
}));

jest.mock('./swipe-export-video-preview', () => ({
  SwipeExportVideoPreview: (props: Parameters<typeof mockPreview>[0]) => mockPreview(props)
}));

jest.mock('./swipe-export-settings', () => () => null);

const props = {
  exportVideoWidth: 480,
  handleClose: jest.fn(),
  mapData: {
    mapState: {longitude: 0, latitude: 0, zoom: 2, pitch: 0, bearing: 0, width: 800, height: 600},
    visState: {filters: [], layers: [], animationConfig: {}}
  },
  header: false,
  mapProps: {},
  disableBaseMap: true,
  defaultFileName: 'export',
  animatableFilters: [],
  onTripFrameUpdate: jest.fn(),
  onFilterFrameUpdate: jest.fn(),
  getTimeRangeFilterKeyframes: jest.fn(),
  onSettingsChange: jest.fn(),
  swipeStartPct: 0,
  swipeEndPct: 100,
  swipeEasing: 'linear' as const
};

describe.each([
  {mode: 'globe', Exporter: GlobeExportVideoPanelContainer},
  {mode: 'swipe', Exporter: SwipeExportVideoPanelContainer}
])('$mode video export', ({Exporter}) => {
  test.each([
    {resolution: undefined, expected: '1280x720'},
    {resolution: '1920x1440', expected: '1920x1440'}
  ])('initializes at $expected when given $resolution', ({resolution, expected}) => {
    renderWithTheme(<Exporter {...props} initialState={{resolution}} />);

    expect(screen.getByLabelText('Export resolution')).toHaveTextContent(expected);
  });
});
