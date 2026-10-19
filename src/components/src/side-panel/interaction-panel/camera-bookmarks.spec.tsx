// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState} from 'react';
import {fireEvent, screen, waitFor} from '@testing-library/react';
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
    expect(button.querySelector('.panel--header__action__component')).not.toBeNull();
    expect(button.querySelector('.__react_component_tooltip')).toHaveTextContent(name);
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

const pointerEventDescriptor = Object.getOwnPropertyDescriptor(window, 'PointerEvent');
beforeAll(() => {
  class TestPointerEvent extends MouseEvent {
    pointerId = 1;
    isPrimary = true;
    pointerType = 'mouse';
  }
  Object.defineProperty(window, 'PointerEvent', {configurable: true, value: TestPointerEvent});
});
afterAll(() => {
  if (pointerEventDescriptor) Object.defineProperty(window, 'PointerEvent', pointerEventDescriptor);
  else Reflect.deleteProperty(window, 'PointerEvent');
});
afterEach(() => jest.restoreAllMocks());

function measureRows() {
  const original = HTMLElement.prototype.getBoundingClientRect;
  jest
    .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    .mockImplementation(function (this: HTMLElement) {
      if (!this.classList.contains('bookmark-row')) return original.call(this);
      const rows = Array.from(this.parentElement?.querySelectorAll('.bookmark-row') || []);
      const top = rows.indexOf(this) * 42;
      return {
        x: 0,
        y: top,
        top,
        left: 0,
        right: 280,
        bottom: top + 36,
        width: 280,
        height: 36,
        toJSON: () => ({})
      };
    });
}

const pair = [...initial, {id: 'second', name: 'Work', camera: {...camera, longitude: 40}}];

test('uses the existing Settings action and keeps header controls independent', () => {
  const {toggle} = setup(initial);
  const expand = screen.getByRole('button', {name: 'Bookmarks'});
  expect(expand.querySelector('.panel--header__action .data-ex-icons-settings')).not.toBeNull();
  expect(expand.querySelector('.data-ex-icons-arrow_up, .data-ex-icons-arrow_down')).toBeNull();
  expand.focus();
  expect(expand).toHaveFocus();
  fireEvent.click(expand);
  expect(expand).toHaveAttribute('aria-expanded', 'false');
  fireEvent.click(screen.getByText('Bookmarks', {selector: '.side-panel-panel__header__title'}));
  expect(expand).toHaveAttribute('aria-expanded', 'true');
  expect(toggle).not.toHaveBeenCalled();
  expect(
    screen.getByRole('textbox', {name: 'Bookmark name 1'}).closest('.bookmark-row')
  ).toHaveStyle({
    height: '36px'
  });
});

test('keyboard drag reorders stable bookmark IDs and Escape cancels without saving', async () => {
  measureRows();
  const {commit} = setup(pair);
  const handle = screen.getByRole('button', {name: 'Reorder bookmark: Home'});
  handle.focus();
  fireEvent.keyDown(handle, {key: ' ', code: 'Space'});
  await waitFor(() => expect(handle).toHaveAttribute('aria-pressed', 'true'));
  fireEvent.keyDown(document, {key: 'ArrowDown', code: 'ArrowDown'});
  fireEvent.keyDown(document, {key: ' ', code: 'Space'});
  await waitFor(() => expect(commit).toHaveBeenCalledWith([pair[1], pair[0]]));
  expect(screen.getByRole('textbox', {name: 'Bookmark name 1'})).toHaveValue('Work');
  expect(handle).toHaveFocus();
  commit.mockClear();
  fireEvent.keyDown(handle, {key: ' ', code: 'Space'});
  await waitFor(() => expect(handle).toHaveAttribute('aria-pressed', 'true'));
  fireEvent.keyDown(document, {key: 'ArrowUp', code: 'ArrowUp'});
  fireEvent.keyDown(document, {key: 'Escape', code: 'Escape'});
  expect(commit).not.toHaveBeenCalled();
  expect(screen.getByRole('textbox', {name: 'Bookmark name 1'})).toHaveValue('Work');
});

test('pointer dragging from the handle reorders and an outside drop leaves the order unchanged', async () => {
  measureRows();
  const {commit, updateMap} = setup(pair);
  const handle = screen.getByRole('button', {name: 'Reorder bookmark: Home'});
  fireEvent.pointerDown(handle, {button: 0, clientX: 10, clientY: 18});
  fireEvent.pointerMove(document, {clientX: 10, clientY: 24});
  await waitFor(() => expect(handle).toHaveAttribute('aria-pressed', 'true'));
  fireEvent.pointerMove(document, {clientX: 10, clientY: 60});
  fireEvent.pointerUp(document, {clientX: 10, clientY: 60});
  await waitFor(() => expect(commit).toHaveBeenCalledWith([pair[1], pair[0]]));
  commit.mockClear();
  fireEvent.pointerDown(handle, {button: 0, clientX: 10, clientY: 60});
  fireEvent.pointerMove(document, {clientX: 10, clientY: 66});
  await waitFor(() => expect(handle).toHaveAttribute('aria-pressed', 'true'));
  fireEvent.pointerMove(document, {clientX: 500, clientY: 500});
  fireEvent.pointerUp(document, {clientX: 500, clientY: 500});
  expect(commit).not.toHaveBeenCalled();
  expect(screen.getByRole('textbox', {name: 'Bookmark name 1'})).toHaveValue('Work');
  // Dnd-kit briefly suppresses the click after a drag; actions work once it releases capture.
  await waitFor(() => {
    fireEvent.click(screen.getAllByRole('button', {name: 'Go to'})[0]);
    expect(updateMap).toHaveBeenCalledTimes(1);
  });
});

test('editing names and using action icons never activates dragging', () => {
  measureRows();
  const {commit, updateMap} = setup(pair);
  const name = screen.getByRole('textbox', {name: 'Bookmark name 1'});
  fireEvent.pointerDown(name, {button: 0, clientX: 50, clientY: 18});
  fireEvent.pointerMove(document, {clientX: 50, clientY: 60});
  fireEvent.pointerUp(document);
  fireEvent.change(name, {target: {value: 'Renamed'}});
  expect(commit).toHaveBeenLastCalledWith([{...pair[0], name: 'Renamed'}, pair[1]]);
  commit.mockClear();
  const navigate = screen.getAllByRole('button', {name: 'Go to'})[0];
  fireEvent.pointerDown(navigate, {button: 0, clientX: 180, clientY: 18});
  fireEvent.pointerMove(document, {clientX: 180, clientY: 60});
  fireEvent.pointerUp(document);
  fireEvent.click(navigate);
  expect(updateMap).toHaveBeenCalledTimes(1);
  expect(commit).not.toHaveBeenCalled();
  expect(screen.getByRole('button', {name: 'Reorder bookmark: Renamed'})).not.toHaveAttribute(
    'aria-pressed'
  );
  expect(screen.getByRole('textbox', {name: 'Bookmark name 1'})).toHaveValue('Renamed');
});
