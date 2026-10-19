// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, screen, within, waitFor} from '@testing-library/react';
import copy from 'copy-to-clipboard';
import {MapStateActions} from '@kepler.gl/actions';
import {INITIAL_MAP_STATE, INITIAL_UI_STATE} from '@kepler.gl/reducers';
import {renderWithTheme, IntlWrapper} from 'test/helpers/component-jest-utils';
import CameraBookmarkControl from './camera-bookmark-control';
import {RootContext} from '../context';

jest.mock('copy-to-clipboard', () => jest.fn(() => true));
const camera = {longitude: 10.12345678, latitude: 20.98765432, zoom: 6, bearing: 30, pitch: 45};
const bookmarks = [{id: 'home', name: 'Home', camera}];

function setup(props = {}) {
  const updateMap = jest.fn();
  const settings = jest.fn();
  const result = renderWithTheme(
    <IntlWrapper>
      <CameraBookmarkControl
        bookmarks={bookmarks}
        mapState={INITIAL_MAP_STATE}
        mapStateActions={{...MapStateActions, updateMap}}
        mapControls={INITIAL_UI_STATE.mapControls}
        setMapControlSettings={settings}
        {...props}
      />
    </IntlWrapper>
  );
  return {...result, updateMap, settings};
}

test('shows named rows with location icons and preserves animated navigation', () => {
  const {updateMap} = setup();
  const row = screen.getByRole('button', {name: 'Home'});
  expect(row).toHaveTextContent('Home');
  expect(row.querySelector('svg')).not.toBeNull();
  expect(screen.queryByRole('button', {name: '1'})).toBeNull();
  fireEvent.click(row);
  expect(updateMap).toHaveBeenCalledWith(
    expect.objectContaining({...camera, transitionDuration: 1000})
  );
  expect(screen.getByRole('navigation', {name: 'Bookmarks'})).toBeInTheDocument();
});

test('copies the existing latitude/longitude format without navigating', () => {
  const {updateMap} = setup();
  fireEvent.click(screen.getByRole('button', {name: 'Copy coordinates: Home'}));
  expect(copy).toHaveBeenCalledWith('20.987654, 10.123457');
  expect(
    within(screen.getByRole('navigation', {name: 'Bookmarks'})).getByRole('status')
  ).toHaveTextContent('Coordinates copied');
  expect(updateMap).not.toHaveBeenCalled();
});

test('reports clipboard failure without claiming success', () => {
  jest.mocked(copy).mockReturnValueOnce(false);
  setup();
  fireEvent.click(screen.getByRole('button', {name: 'Copy coordinates: Home'}));
  expect(
    within(screen.getByRole('navigation', {name: 'Bookmarks'})).getByRole('status')
  ).toHaveTextContent('Could not copy coordinates');
});

test('uses the legend drag and resize surface with independent position settings', () => {
  setup({
    mapControls: {
      ...INITIAL_UI_STATE.mapControls,
      cameraBookmarks: {
        show: true,
        active: true,
        settings: {position: {x: 80, y: 40, anchorX: 'right', anchorY: 'top'}, contentHeight: 180}
      }
    }
  });
  const move = screen.getByLabelText('Move Bookmarks');
  expect(screen.getAllByLabelText('Resize Bookmarks')).toHaveLength(2);
  expect(move.closest('.draggable-legend')).toHaveStyle({right: '80px', top: '40px'});
});

test.each([
  {isExport: true},
  {mapState: {...INITIAL_MAP_STATE, isSplit: true}},
  {mapState: {...INITIAL_MAP_STATE, globe: {...INITIAL_MAP_STATE.globe!, enabled: true}}},
  {bookmarks: []},
  {mapControls: {cameraBookmarks: {show: false, active: true}}}
])('hides the panel for unavailable or disabled views: %p', props => {
  setup(props);
  expect(screen.queryByRole('navigation')).toBeNull();
});

test('keyboard resize updates only the bookmark panel settings', async () => {
  const root = document.createElement('div');
  root.className = 'kepler-gl';
  document.body.appendChild(root);
  const rect = {
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    width: 1000,
    height: 800,
    right: 1000,
    bottom: 800,
    toJSON: () => ({})
  };
  root.getBoundingClientRect = () => rect;
  const settings = jest.fn();
  const {unmount} = renderWithTheme(
    <IntlWrapper>
      <RootContext.Provider value={{current: root}}>
        <CameraBookmarkControl
          bookmarks={bookmarks}
          mapState={{...INITIAL_MAP_STATE, width: 1000, height: 800}}
          mapStateActions={MapStateActions}
          mapControls={INITIAL_UI_STATE.mapControls}
          setMapControlSettings={settings}
        />
      </RootContext.Provider>
    </IntlWrapper>
  );
  const panel = root.querySelector('.draggable-legend') as HTMLElement;
  panel.getBoundingClientRect = () => ({
    ...rect,
    x: 600,
    y: 40,
    left: 600,
    top: 40,
    width: 300,
    height: 214,
    right: 900,
    bottom: 254
  });
  Object.defineProperty(panel.querySelector('.map-control__panel-content'), 'offsetHeight', {
    value: 180
  });
  const handle = screen.getAllByRole('button', {name: 'Resize Bookmarks'})[1];
  handle.focus();
  fireEvent.keyDown(handle, {code: 'Space'});
  await waitFor(() => expect(handle).toHaveAttribute('aria-pressed', 'true'));
  fireEvent.keyDown(document, {code: 'ArrowDown'});
  await waitFor(() =>
    expect(settings).toHaveBeenCalledWith(
      'cameraBookmarks',
      expect.objectContaining({contentHeight: 205})
    )
  );
  fireEvent.keyDown(document, {code: 'Space'});
  expect(settings.mock.calls.every(([id]) => id === 'cameraBookmarks')).toBe(true);
  unmount();
  root.remove();
});

test('mounts the floating panel inside its map root after the initial ref attaches', () => {
  function Harness() {
    const root = React.useRef<HTMLDivElement>(null);
    return (
      <RootContext.Provider value={root}>
        <div ref={root} data-testid="map-root">
          <CameraBookmarkControl
            bookmarks={bookmarks}
            mapState={INITIAL_MAP_STATE}
            mapStateActions={MapStateActions}
            mapControls={INITIAL_UI_STATE.mapControls}
            setMapControlSettings={jest.fn()}
          />
        </div>
      </RootContext.Provider>
    );
  }
  renderWithTheme(
    <IntlWrapper>
      <Harness />
    </IntlWrapper>
  );
  expect(screen.getByTestId('map-root')).toContainElement(
    screen.getByRole('button', {name: 'Home'})
  );
});
