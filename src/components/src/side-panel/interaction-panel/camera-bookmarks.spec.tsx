// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState} from 'react';
import {fireEvent, screen} from '@testing-library/react';
import {MapStateActions, VisStateActions, UIStateActions} from '@kepler.gl/actions';
import {INITIAL_MAP_STATE} from '@kepler.gl/reducers';
import {CameraBookmark} from '@kepler.gl/types';
import {renderWithTheme, IntlWrapper} from 'test/helpers/component-jest-utils';
import CameraBookmarks from './camera-bookmarks';
import {MapViewStateContext} from '../../map-view-state-context';

const camera = {longitude: 10, latitude: 20, zoom: 6, bearing: 30, pitch: 45};
const initial = [{id: 'first', name: 'Home', camera}];

function setup(
  bookmarks: CameraBookmark[] = [],
  mapState = {...INITIAL_MAP_STATE, ...camera},
  liveCamera?: typeof camera
) {
  const updateMap = jest.fn();
  const commit = jest.fn();
  const toggle = jest.fn();
  function Harness() {
    const [items, setItems] = useState(bookmarks);
    const [enabled, setEnabled] = useState(true);
    return (
      <CameraBookmarks
        bookmarks={items}
        enabled={enabled}
        uiStateActions={{
          ...UIStateActions,
          setMapControlVisibility: (id, show) => {
            toggle(id, show);
            setEnabled(show);
            return UIStateActions.setMapControlVisibility(id, show);
          }
        }}
        mapState={mapState}
        mapStateActions={{...MapStateActions, updateMap}}
        visStateActions={{
          ...VisStateActions,
          setCameraBookmarks: Object.assign((value: CameraBookmark[]) => {
            commit(value);
            setItems(value);
            return VisStateActions.setCameraBookmarks(value);
          }, VisStateActions.setCameraBookmarks)
        }}
      />
    );
  }
  renderWithTheme(
    <IntlWrapper>
      <MapViewStateContext.Provider
        value={{
          getInternalViewState: () => liveCamera || mapState,
          setInternalViewState: jest.fn()
        }}
      >
        <Harness />
      </MapViewStateContext.Provider>
    </IntlWrapper>
  );
  fireEvent.click(screen.getByRole('button', {name: 'Bookmarks'}));
  return {commit, updateMap, toggle};
}

test('captures, renames and deletes a bookmark without datasets', () => {
  const {commit} = setup();
  fireEvent.click(screen.getByRole('button', {name: 'Bookmark current view'}));
  expect(commit.mock.lastCall[0][0].camera).toEqual(camera);
  fireEvent.change(screen.getByRole('textbox', {name: 'Bookmark name 1'}), {
    target: {value: 'My view'}
  });
  expect(commit.mock.lastCall[0][0].name).toBe('My view');
  fireEvent.click(screen.getByRole('button', {name: 'Delete'}));
  expect(commit.mock.lastCall[0]).toEqual([]);
});

test('updates the saved view and navigates with bearing and pitch', () => {
  const current = {...INITIAL_MAP_STATE, ...camera, zoom: 9, bearing: 80, pitch: 60};
  const {commit, updateMap} = setup(initial, current);
  fireEvent.click(screen.getByRole('button', {name: 'Update view'}));
  expect(commit.mock.lastCall[0][0].camera).toEqual({...camera, zoom: 9, bearing: 80, pitch: 60});
  fireEvent.click(screen.getByRole('button', {name: 'Go to'}));
  expect(updateMap).toHaveBeenCalledWith(
    expect.objectContaining({
      zoom: 9,
      bearing: 80,
      pitch: 60,
      transitionDuration: 1000,
      transitionInterpolator: expect.any(Object)
    })
  );
});

test('reorders bookmarks and disables moves past the ends', () => {
  const {commit} = setup([...initial, {id: 'second', name: 'Work', camera}]);
  expect(screen.getAllByRole('button', {name: 'Up'})[0]).toBeDisabled();
  expect(screen.getAllByRole('button', {name: 'Down'})[1]).toBeDisabled();
  fireEvent.click(screen.getAllByRole('button', {name: 'Down'})[0]);
  expect(commit.mock.lastCall[0].map(item => item.id)).toEqual(['second', 'first']);
  fireEvent.click(screen.getAllByRole('button', {name: 'Up'})[1]);
  expect(commit.mock.lastCall[0].map(item => item.id)).toEqual(['first', 'second']);
});

test('keeps unsupported split-map editing unavailable', () => {
  setup(initial, {...INITIAL_MAP_STATE, isSplit: true});
  expect(screen.getByText('Use a single 2D or 3D map to edit camera views.')).toBeInTheDocument();
  expect(screen.queryByRole('button', {name: 'Bookmark current view'})).toBeNull();
});

test('captures and updates the live camera when Redux has not caught up', () => {
  const liveCamera = {...camera, longitude: 80, zoom: 12};
  const {commit} = setup(initial, {...INITIAL_MAP_STATE, ...camera}, liveCamera);
  // Change the live view after rendering: capture must read at click time.
  liveCamera.zoom = 13;
  fireEvent.click(screen.getByRole('button', {name: 'Update view'}));
  expect(commit.mock.lastCall[0][0].camera).toEqual(liveCamera);
  fireEvent.click(screen.getByRole('button', {name: 'Bookmark current view'}));
  expect(commit.mock.lastCall[0][1].camera).toEqual(liveCamera);
});

test('enabling is independent of collapse and preserves saved bookmarks', () => {
  const {commit, toggle, updateMap} = setup(initial);
  const header = screen.getByRole('button', {name: 'Bookmarks'});
  expect(header).toHaveAttribute('aria-expanded', 'true');
  fireEvent.click(screen.getByRole('checkbox', {name: 'Enable bookmarks'}));
  expect(toggle).toHaveBeenLastCalledWith('cameraBookmarks', false);
  expect(header).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('button', {name: 'Go to'})).toBeDisabled();
  fireEvent.click(screen.getByRole('button', {name: 'Go to'}));
  expect(updateMap).not.toHaveBeenCalled();
  expect(commit).not.toHaveBeenCalled();
  fireEvent.click(header);
  fireEvent.click(screen.getByRole('checkbox', {name: 'Enable bookmarks'}));
  expect(header).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByRole('checkbox', {name: 'Enable bookmarks'})).toBeChecked();
  fireEvent.click(header);
  expect(screen.getByRole('textbox', {name: 'Bookmark name 1'})).toHaveValue('Home');
});

test('icon actions retain accessible names, tooltips, focus and fixed row space', () => {
  setup(initial);
  for (const name of ['Go to', 'Update view', 'Up', 'Down', 'Delete']) {
    const button = screen.getByRole('button', {name});
    expect(button).toHaveAttribute('title', name);
    expect(button).toHaveTextContent('');
    expect(button.querySelector('svg')).not.toBeNull();
  }
  const goTo = screen.getByRole('button', {name: 'Go to'});
  goTo.focus();
  expect(goTo).toHaveFocus();
  expect(goTo.closest('.bookmark-actions')).toBeInTheDocument();
});

test('multiple maps have independent switch and content identifiers', () => {
  const toggles = [jest.fn(), jest.fn()];
  renderWithTheme(
    <IntlWrapper>
      {toggles.map((toggle, index) => (
        <CameraBookmarks
          key={index}
          bookmarks={initial}
          mapState={INITIAL_MAP_STATE}
          visStateActions={VisStateActions}
          uiStateActions={{...UIStateActions, setMapControlVisibility: toggle}}
        />
      ))}
    </IntlWrapper>
  );
  const switches = screen.getAllByRole('checkbox', {name: 'Enable bookmarks'});
  expect(switches[0].id).not.toBe(switches[1].id);
  fireEvent.click(switches[1].closest('label')!);
  expect(toggles[0]).not.toHaveBeenCalled();
  expect(toggles[1]).toHaveBeenCalledWith('cameraBookmarks', false);
  const headers = screen.getAllByRole('button', {name: 'Bookmarks'});
  headers.forEach(header => fireEvent.click(header));
  expect(headers[0].getAttribute('aria-controls')).not.toBe(
    headers[1].getAttribute('aria-controls')
  );
  headers.forEach(header =>
    expect(document.getElementById(header.getAttribute('aria-controls')!)).toBeInTheDocument()
  );
});
