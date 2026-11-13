// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {IntlProvider} from 'react-intl';
import {ThemeProvider} from 'styled-components';
import {WebMercatorViewport} from '@math.gl/web-mercator';
import geocoderService from '@mapbox/mapbox-sdk/services/geocoding';
import {theme} from '@kepler.gl/styles';
import Geocoder, {Result} from './geocoder';
import {INITIAL_MAP_STATE} from '../../../reducers/src/map-state-updaters';

jest.mock('@mapbox/mapbox-sdk/services/geocoding', () => jest.fn());
// Exercise the SDK boundary even though the component normally disables it in tests.
jest.mock('@kepler.gl/utils', () => ({
  ...jest.requireActual('@kepler.gl/utils'),
  isTest: () => false
}));

const viewport = {width: 800, height: 600, longitude: -122, latitude: 37, zoom: 8};
const places: Result[] = [
  {place_name: 'First place', center: [-122.4, 37.8]},
  {place_name: 'Second place', center: [-73.9, 40.7]}
];

const send = jest.fn();
const forwardGeocode = jest.fn((_params: {query: string; limit: number; bbox?: number[]}) => ({
  send
}));

function setup(props: Partial<React.ComponentProps<typeof Geocoder>> = {}) {
  const onSelected = jest.fn();
  const onDeleteMarker = jest.fn();
  const rendered = render(
    <ThemeProvider theme={theme}>
      <IntlProvider locale="en">
        <Geocoder
          mapboxApiAccessToken="test-token"
          viewport={viewport}
          timeout={300}
          pointZoom={12}
          transitionDuration={500}
          onSelected={onSelected}
          onDeleteMarker={onDeleteMarker}
          {...props}
        />
      </IntlProvider>
    </ThemeProvider>
  );
  return {...rendered, input: screen.getByRole('textbox'), onSelected, onDeleteMarker};
}

async function advance(ms = 300) {
  await act(async () => {
    jest.advanceTimersByTime(ms);
  });
}

function type(input: HTMLElement, value: string) {
  fireEvent.change(input, {target: {value}});
}

describe('Geocoder search and selection', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.mocked(geocoderService).mockReturnValue({forwardGeocode} as never);
    send.mockResolvedValue({body: {features: places}});
  });

  afterEach(() => {
    cleanup();
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test('debounces successive text edits and displays only the requested result list', async () => {
    const {input} = setup({limit: 2});
    type(input, 'San');
    await advance(200);
    type(input, 'San Francisco');
    await advance(299);
    expect(forwardGeocode).not.toHaveBeenCalled();
    await advance(1);
    expect(forwardGeocode).toHaveBeenCalledTimes(1);
    expect(forwardGeocode).toHaveBeenCalledWith({query: 'San Francisco', limit: 2});
    expect(screen.getByText('First place')).toBeInTheDocument();
    expect(screen.getByText('Second place')).toBeInTheDocument();
  });

  test('clearing the input cancels a pending text search', async () => {
    const {input} = setup();
    type(input, 'Pending address');
    type(input, '');
    await advance();
    expect(forwardGeocode).not.toHaveBeenCalled();
  });

  test('coordinates cancel a pending text search and select longitude/latitude in map order', async () => {
    const {input, onSelected} = setup();
    type(input, 'Pending address');
    type(input, '37.8, -122.4');
    await advance();
    expect(forwardGeocode).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('37.8, -122.4'));
    expect(onSelected).toHaveBeenCalledWith(
      {...viewport, longitude: -122.4, latitude: 37.8, zoom: 12, transitionDuration: 500},
      {center: [-122.4, 37.8], place_name: '37.8, -122.4'}
    );
  });

  test('does not request results with a zero limit', async () => {
    const {input} = setup({limit: 0});
    type(input, 'Address');
    await advance();
    expect(forwardGeocode).not.toHaveBeenCalled();
  });

  test('limits search to the visible viewport when enabled', async () => {
    const {input} = setup({limitSearch: true, mapState: {...INITIAL_MAP_STATE, ...viewport}});
    type(input, 'Address');
    await advance();
    const params = forwardGeocode.mock.calls[0][0];
    expect(params.bbox).toHaveLength(4);
    const [west, south, east, north] = params.bbox ?? [];
    expect(west).toBeLessThan(viewport.longitude);
    expect(east).toBeGreaterThan(viewport.longitude);
    expect(south).toBeLessThan(viewport.latitude);
    expect(north).toBeGreaterThan(viewport.latitude);
    expect(west).toBeGreaterThanOrEqual(-180);
    expect(east).toBeLessThanOrEqual(180);
  });

  test.each([
    ['disabled', false, {...INITIAL_MAP_STATE, ...viewport}],
    ['missing dimensions', true, {...INITIAL_MAP_STATE, ...viewport, width: 0}],
    ['world spanning', true, {...INITIAL_MAP_STATE, ...viewport, zoom: 0}],
    ['missing map state', true, undefined]
  ] as const)('omits viewport restriction when %s', async (_name, limitSearch, mapState) => {
    const {input} = setup({limitSearch, mapState});
    type(input, 'Address');
    await advance();
    expect(forwardGeocode.mock.calls[0][0]).not.toHaveProperty('bbox');
  });

  test('keyboard navigation stays within results and Enter selects the highlighted point', async () => {
    const {input, onSelected} = setup();
    fireEvent.keyDown(input, {keyCode: 13});
    expect(onSelected).not.toHaveBeenCalled();
    type(input, 'Address');
    await advance();
    fireEvent.keyDown(input, {keyCode: 38});
    expect(screen.getByText('First place')).toHaveClass('active');
    fireEvent.keyDown(input, {keyCode: 40});
    fireEvent.keyDown(input, {keyCode: 40});
    expect(screen.getByText('Second place')).toHaveClass('active');
    fireEvent.keyDown(input, {keyCode: 38});
    fireEvent.keyDown(input, {keyCode: 13});
    expect(onSelected).toHaveBeenCalledWith(
      {...viewport, longitude: -122.4, latitude: 37.8, zoom: 12, transitionDuration: 500},
      places[0]
    );
    expect(input).toHaveValue('First place');
    expect(screen.queryByText('First place')).not.toBeInTheDocument();
  });

  test('fits a result bounding box rather than using point zoom and clears the selected marker', async () => {
    const region: Result = {center: [0, 0], place_name: 'Region', bbox: [-123, 36, -121, 38]};
    send.mockResolvedValue({body: {features: [region]}});
    const {input, onSelected, onDeleteMarker, container} = setup({
      formatItem: item => item.place_name.toUpperCase()
    });
    type(input, 'Region');
    await advance();
    fireEvent.click(screen.getByText('REGION'));
    const expected = new WebMercatorViewport(viewport).fitBounds([
      [-123, 36],
      [-121, 38]
    ]);
    expect(onSelected).toHaveBeenCalledWith(
      {
        ...viewport,
        longitude: expected.longitude,
        latitude: expected.latitude,
        zoom: expected.zoom,
        transitionDuration: 500
      },
      region
    );
    expect(input).toHaveValue('REGION');
    const removeIcon = container.querySelector('.remove-result svg');
    expect(removeIcon).not.toBeNull();
    fireEvent.click(removeIcon as SVGElement);
    expect(onDeleteMarker).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('');
    expect(container.querySelector('.remove-result')).toBeNull();
  });

  test('keeps a result clickable during blur delay and reopens results on focus', async () => {
    const {input, onSelected} = setup();
    type(input, 'Address');
    await advance();
    fireEvent.blur(input);
    await advance(299);
    fireEvent.click(screen.getByText('Second place'));
    expect(onSelected).toHaveBeenCalledTimes(1);
    await advance(1);
    expect(screen.queryByText('Second place')).not.toBeInTheDocument();
    fireEvent.focus(input);
    expect(screen.getByText('Second place')).toBeInTheDocument();
  });
});
