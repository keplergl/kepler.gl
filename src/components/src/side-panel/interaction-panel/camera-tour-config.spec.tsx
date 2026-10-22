// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useRef, useState} from 'react';
import {act, fireEvent, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MapStateActions, UIStateActions, VisStateActions} from '@kepler.gl/actions';
import {INITIAL_MAP_STATE, INITIAL_UI_STATE} from '@kepler.gl/reducers';
import {CameraBookmark, CameraTour} from '@kepler.gl/types';
import {evaluateCameraTour} from '@kepler.gl/utils';
import {renderWithTheme, IntlWrapper} from 'test/helpers/component-jest-utils';
import {MapViewStateContext} from '../../map-view-state-context';
import {RootContext} from '../../context';
import CameraTourConfig from './camera-tour-config';
import CameraBookmarks from './camera-bookmarks';
import CameraBookmarkControl from '../../map/camera-bookmark-control';

const camera = {longitude: 10, latitude: 20, zoom: 6, bearing: 30, pitch: 45};
const tour: CameraTour = {
  stops: [
    {id: 'home', name: 'Home', camera, holdDurationMs: 1000, travelDurationMs: 2000},
    {
      id: 'work',
      name: 'Work',
      camera: {...camera, longitude: 50, zoom: 10},
      holdDurationMs: 1000,
      travelDurationMs: 9999
    }
  ]
};

function setup(
  initial: CameraTour | null = tour,
  options: {
    bookmarks?: CameraBookmark[];
    mapState?: typeof INITIAL_MAP_STATE;
    liveCamera?: typeof camera;
    floatingBookmarks?: boolean;
    bookmarksEnabled?: boolean;
  } = {}
) {
  const updateMap = jest.fn();
  const commit = jest.fn();
  const toggle = jest.fn();
  let updateBookmarks: React.Dispatch<React.SetStateAction<CameraBookmark[]>>;
  const mapState = options.mapState || {...INITIAL_MAP_STATE, ...camera};
  function Harness() {
    const root = useRef<HTMLDivElement>(null);
    const [value, setValue] = useState(initial);
    const [bookmarks, setBookmarks] = useState(options.bookmarks || []);
    updateBookmarks = setBookmarks;
    const [enabled, setEnabled] = useState(true);
    return (
      <RootContext.Provider value={root}>
        <div ref={root}>
          <div className="maps">
            <button type="button">Map surface</button>
          </div>
          <div className="geocoder-panel">
            <input aria-label="Search map" />
          </div>
          <CameraBookmarks
            bookmarks={[{id: 'saved', name: 'Saved view', camera}]}
            enabled={options.bookmarksEnabled === true}
            mapState={mapState}
            mapStateActions={{...MapStateActions, updateMap}}
            visStateActions={VisStateActions}
          />
          {options.floatingBookmarks && (
            <CameraBookmarkControl
              bookmarks={[{id: 'saved', name: 'Saved view', camera}]}
              mapState={mapState}
              mapStateActions={{...MapStateActions, updateMap}}
              mapControls={{
                ...INITIAL_UI_STATE.mapControls,
                cameraBookmarks: {
                  ...INITIAL_UI_STATE.mapControls.cameraBookmarks,
                  active: true,
                  show: options.bookmarksEnabled === true
                }
              }}
              setMapControlSettings={jest.fn()}
            />
          )}
          <CameraTourConfig
            tour={value}
            enabled={enabled}
            uiStateActions={{
              ...UIStateActions,
              setMapControlVisibility: Object.assign((control: string, show: boolean) => {
                toggle(control, show);
                setEnabled(show);
                return UIStateActions.setMapControlVisibility(control, show);
              }, UIStateActions.setMapControlVisibility)
            }}
            bookmarks={bookmarks}
            mapState={mapState}
            mapStateActions={{...MapStateActions, updateMap}}
            visStateActions={{
              ...VisStateActions,
              setCameraTour: Object.assign((next: CameraTour | null) => {
                commit(next);
                setValue(next);
                return VisStateActions.setCameraTour(next);
              }, VisStateActions.setCameraTour)
            }}
          />
        </div>
      </RootContext.Provider>
    );
  }
  const rendered = renderWithTheme(
    <IntlWrapper>
      <MapViewStateContext.Provider
        value={{
          getInternalViewState: () => options.liveCamera || mapState,
          setInternalViewState: jest.fn()
        }}
      >
        <Harness />
      </MapViewStateContext.Provider>
    </IntlWrapper>
  );
  fireEvent.click(screen.getByRole('button', {name: 'Camera animation'}));
  return {
    ...rendered,
    updateMap,
    commit,
    toggle,
    changeBookmarks: (bookmarks: CameraBookmark[]) => act(() => updateBookmarks(bookmarks))
  };
}

let callbacks: Map<number, FrameRequestCallback>;
let nextFrame: number;
beforeEach(() => {
  callbacks = new Map();
  nextFrame = 0;
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    callbacks.set(++nextFrame, callback);
    return nextFrame;
  });
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => {
    callbacks.delete(id);
  });
  jest.spyOn(performance, 'now').mockReturnValue(0);
});
afterEach(() => jest.restoreAllMocks());

function frame(time: number) {
  const pending = [...callbacks.values()];
  callbacks.clear();
  act(() => pending.forEach(callback => callback(time)));
}

test('captures the live view, renames it and removes the last stop without datasets', () => {
  const liveCamera = {...camera};
  const {commit} = setup(null, {liveCamera});
  expect(screen.queryByRole('menu')).toBeNull();
  liveCamera.zoom = 12;
  fireEvent.click(screen.getByRole('button', {name: 'Add stop'}));
  expect(commit.mock.lastCall[0].stops[0].camera).toEqual(liveCamera);
  expect(screen.getByLabelText('Tour duration')).toHaveTextContent('2 s');
  fireEvent.change(screen.getByRole('textbox', {name: 'Stop name'}), {
    target: {value: 'New view'}
  });
  expect(commit.mock.lastCall[0].stops[0].name).toBe('New view');
  fireEvent.click(screen.getByRole('button', {name: 'Delete'}));
  expect(commit.mock.lastCall[0]).toBeNull();
});

test('copies bookmarks and updates a stop from the current view without modifying the bookmark', () => {
  const bookmark = {
    id: 'bookmark',
    name: 'A long saved view over the eastern waterfront and harbour',
    camera: {...camera}
  };
  const liveCamera = {...camera, bearing: 80, pitch: 60};
  const {commit} = setup(null, {bookmarks: [bookmark], liveCamera});
  fireEvent.click(screen.getByRole('button', {name: 'Add stop'}));
  fireEvent.click(screen.getByTitle(bookmark.name));
  const saved = commit.mock.lastCall[0].stops[0];
  expect(saved.name).toBe(bookmark.name);
  expect(saved.camera).toEqual(bookmark.camera);
  expect(saved.camera).not.toBe(bookmark.camera);
  bookmark.camera.zoom = 20;
  expect(saved.camera.zoom).toBe(6);
  liveCamera.pitch = 70;
  fireEvent.click(screen.getByRole('button', {name: 'Pick current location'}));
  expect(commit.mock.lastCall[0].stops[0].camera).toEqual(liveCamera);
  expect(bookmark.camera.pitch).toBe(45);
});

test('Add stop menu selects bookmarks by ID with the keyboard and supports repeated choices', async () => {
  const user = userEvent.setup();
  const bookmarks = [
    {id: 'current', name: 'Same saved view', camera},
    {id: 'second', name: 'Same saved view', camera: {...camera, longitude: 50}}
  ];
  const {commit, updateMap} = setup(null, {bookmarks});
  const button = screen.getByRole('button', {name: 'Add stop'});
  const chooseSecond = async () => {
    button.focus();
    await user.keyboard('{Enter}{ArrowDown}{ArrowDown}{Enter}');
  };
  await chooseSecond();
  expect(commit.mock.lastCall[0].stops[0].camera).toEqual(bookmarks[1].camera);
  expect(button).toHaveFocus();
  expect(button).toHaveAttribute('aria-expanded', 'false');
  await chooseSecond();
  const stops = commit.mock.lastCall[0].stops;
  expect(stops).toHaveLength(2);
  expect(stops[1].camera).toEqual(bookmarks[1].camera);
  expect(stops[1].id).not.toBe(stops[0].id);
  expect(updateMap).not.toHaveBeenCalled();
});

test('menu dismissal never adds a stop and restores trigger focus', async () => {
  const user = userEvent.setup();
  const {commit} = setup(null, {bookmarks: [{id: 'saved', name: 'Saved', camera}]});
  const button = screen.getByRole('button', {name: 'Add stop'});
  button.focus();
  await user.keyboard(' ');
  expect(screen.getByRole('menu')).toBeInTheDocument();
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('menu')).toBeNull();
  expect(button).toHaveFocus();
  await user.keyboard('{ArrowDown}');
  await user.keyboard('{Tab}');
  expect(screen.queryByRole('menu')).toBeNull();
  expect(button).toHaveFocus();
  await user.click(button);
  await user.click(document.querySelector('.ReactModal__Overlay') as HTMLElement);
  expect(screen.queryByRole('menu')).toBeNull();
  expect(button).toHaveFocus();
  expect(commit).not.toHaveBeenCalled();
});

test('Current view captures the live camera at selection and interrupts playback', () => {
  const liveCamera = {...camera};
  const {commit, updateMap} = setup(tour, {
    liveCamera,
    bookmarks: [{id: 'saved', name: 'Saved', camera}]
  });
  fireEvent.click(screen.getByRole('button', {name: 'Play'}));
  updateMap.mockClear(); // Playback applies the initial frame when Play is pressed.
  fireEvent.click(screen.getByRole('button', {name: 'Add stop'}));
  expect(commit).not.toHaveBeenCalled();
  liveCamera.zoom = 15;
  fireEvent.click(screen.getByRole('menuitem', {name: 'Current view'}));
  expect(commit.mock.lastCall[0].stops[2].camera).toEqual(liveCamera);
  expect(screen.getByRole('button', {name: 'Play'})).toBeInTheDocument();
  frame(1000);
  expect(updateMap).not.toHaveBeenCalled();
});

test('menu keeps focused bookmark identity through changes and closes when bookmarks disappear', async () => {
  const user = userEvent.setup();
  const first = {id: 'first', name: 'First', camera};
  const second = {id: 'second', name: 'Second', camera: {...camera, zoom: 10}};
  const {commit, changeBookmarks} = setup(null, {bookmarks: [first, second]});
  const button = screen.getByRole('button', {name: 'Add stop'});
  await user.click(button);
  await user.keyboard('{End}');
  expect(screen.getByRole('menuitem', {name: 'Second'})).toHaveFocus();
  changeBookmarks([{...second, name: 'Renamed', camera: {...camera, zoom: 12}}, first]);
  expect(screen.getByRole('menuitem', {name: 'Renamed'})).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(commit.mock.lastCall[0].stops[0]).toMatchObject({name: 'Renamed', camera: {zoom: 12}});
  await user.click(button);
  await user.keyboard('{End}');
  changeBookmarks([second]);
  expect(screen.getByRole('menuitem', {name: 'Current view'})).toHaveFocus();
  changeBookmarks([]);
  expect(screen.queryByRole('menu')).toBeNull();
  expect(button).toHaveFocus();
  changeBookmarks([first]);
  expect(screen.queryByRole('menu')).toBeNull();
  changeBookmarks([]);
  await user.click(button);
  expect(commit.mock.lastCall[0].stops).toHaveLength(2);
});

test('long bookmark lists remain keyboard reachable and preserve their full names', async () => {
  const user = userEvent.setup();
  const bookmarks = Array.from({length: 45}, (_, index) => ({
    id: `saved-${index}`,
    name: `A long saved view of the waterfront and harbour number ${index}`,
    camera: {...camera, longitude: index}
  }));
  const {commit} = setup(null, {bookmarks});
  await user.click(screen.getByRole('button', {name: 'Add stop'}));
  await user.keyboard('{End}{Enter}');
  expect(commit.mock.lastCall[0].stops[0]).toMatchObject({
    name: bookmarks[44].name,
    camera: bookmarks[44].camera
  });
});

test('unavailable capture is disabled while saved sources and disabled-tour authoring remain usable', async () => {
  const user = userEvent.setup();
  const invalidCamera = {...camera, zoom: NaN};
  const {commit, changeBookmarks} = setup(null, {
    liveCamera: invalidCamera,
    mapState: {...INITIAL_MAP_STATE, ...invalidCamera},
    bookmarks: [{id: 'saved', name: 'Saved', camera}]
  });
  fireEvent.click(screen.getByRole('checkbox', {name: 'Enable camera animation'}));
  await user.click(screen.getByRole('button', {name: 'Add stop'}));
  expect(screen.getByRole('menuitem', {name: 'Current view'})).toBeDisabled();
  expect(screen.getByRole('menuitem', {name: 'Saved'})).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(commit.mock.lastCall[0].stops[0].camera).toEqual(camera);
  changeBookmarks([]);
  expect(screen.getByRole('button', {name: 'Add stop'})).toBeDisabled();
});

test('duplicates and deletes the addressed stop while preserving selection and total duration', () => {
  const {commit, updateMap} = setup();
  expect(screen.getByLabelText('Tour duration')).toHaveTextContent('4 s');
  fireEvent.click(screen.getByRole('button', {name: 'Duplicate'}));
  const duplicate = commit.mock.lastCall[0].stops[1];
  expect(duplicate.id).not.toBe('home');
  expect(duplicate.camera).toEqual(camera);
  expect(duplicate.camera).not.toBe(camera);
  expect(screen.getByLabelText('Tour duration')).toHaveTextContent('7 s');
  expect(screen.getByRole('button', {name: 'Stop 2: Home'})).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  expect(screen.getByRole('button', {name: 'Stop 2: Home'})).toHaveFocus();
  fireEvent.click(screen.getByRole('button', {name: 'Delete'}));
  expect(screen.getByRole('button', {name: 'Stop 2: Work'})).toHaveFocus();
  expect(screen.getByRole('button', {name: 'Stop 2: Work'})).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  expect(commit.mock.lastCall[0]).toEqual(tour);
  expect(screen.getByLabelText('Tour duration')).toHaveTextContent('4 s');
  expect(updateMap).not.toHaveBeenCalled();
});

test('edits hold and travel in seconds and rejects invalid or unsafe total durations', () => {
  const {commit} = setup();
  fireEvent.change(screen.getByRole('spinbutton', {name: 'Hold (s)'}), {
    target: {value: '1.5'}
  });
  fireEvent.change(screen.getByRole('spinbutton', {name: 'Travel to next (s)'}), {
    target: {value: '3.5'}
  });
  expect(commit.mock.lastCall[0].stops[0]).toMatchObject({
    holdDurationMs: 1500,
    travelDurationMs: 3500
  });
  expect(screen.getByLabelText('Tour duration')).toHaveTextContent('6 s');
  commit.mockClear();
  for (const value of ['-1', '', '9007199254740']) {
    fireEvent.change(screen.getByRole('spinbutton', {name: 'Hold (s)'}), {target: {value}});
  }
  expect(commit).not.toHaveBeenCalled();
  expect(screen.getByLabelText('Tour duration')).toHaveTextContent('6 s');
  fireEvent.click(screen.getByRole('button', {name: 'Stop 2: Work'}));
  expect(screen.queryByRole('spinbutton', {name: 'Travel to next (s)'})).toBeNull();
  expect(screen.getByRole('spinbutton', {name: 'Hold (s)'})).toHaveValue(1);
  expect(commit).not.toHaveBeenCalled();
});

test('scrubbing and playback evaluate the same camera at the same timestamp', () => {
  const {updateMap} = setup();
  fireEvent.change(screen.getByRole('slider', {name: 'Camera tour time'}), {
    target: {value: '1500'}
  });
  const expected = {...evaluateCameraTour(tour, 1500), transitionDuration: 0};
  expect(updateMap).toHaveBeenLastCalledWith(expected);
  fireEvent.click(screen.getByRole('button', {name: 'Restart'}));
  expect(updateMap).toHaveBeenLastCalledWith({...camera, transitionDuration: 0});
  fireEvent.click(screen.getByRole('button', {name: 'Play'}));
  frame(1500);
  expect(updateMap).toHaveBeenLastCalledWith(expected);
  expect(screen.getByLabelText('Elapsed time')).toHaveTextContent('1.5 s');
  fireEvent.click(screen.getByRole('button', {name: 'Pause'}));
  updateMap.mockClear();
  frame(2000);
  expect(updateMap).not.toHaveBeenCalled();
  expect(callbacks.size).toBe(0);
});

test('resumes elapsed time, finishes exactly at the end, and replays from the beginning', () => {
  const {updateMap} = setup();
  fireEvent.change(screen.getByRole('slider'), {target: {value: '1500'}});
  fireEvent.click(screen.getByRole('button', {name: 'Play'}));
  frame(500);
  expect(updateMap).toHaveBeenLastCalledWith({
    ...evaluateCameraTour(tour, 2000),
    transitionDuration: 0
  });
  frame(5000);
  expect(updateMap).toHaveBeenLastCalledWith({...tour.stops[1].camera, transitionDuration: 0});
  expect(screen.getByLabelText('Elapsed time')).toHaveTextContent('4 s');
  expect(screen.getByRole('button', {name: 'Play'})).toBeInTheDocument();
  expect(callbacks.size).toBe(0);
  fireEvent.click(screen.getByRole('button', {name: 'Play'}));
  expect(updateMap).toHaveBeenLastCalledWith({...camera, transitionDuration: 0});
});

test('marker selection is separate from Go to and the playback position', () => {
  const {updateMap, commit} = setup();
  fireEvent.click(screen.getByRole('button', {name: 'Stop 2: Work'}));
  expect(screen.getByRole('button', {name: 'Stop 2: Work'})).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  expect(screen.getByRole('textbox', {name: 'Stop name'})).toHaveValue('Work');
  expect(screen.getByRole('button', {name: 'Stop 1: Home'})).toHaveAttribute(
    'aria-current',
    'step'
  );
  expect(screen.getByRole('slider')).toHaveValue('0');
  expect(updateMap).not.toHaveBeenCalled();
  expect(commit).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', {name: 'Go to'}));
  expect(screen.getByRole('button', {name: 'Stop 2: Work'})).toHaveAttribute(
    'aria-current',
    'step'
  );
  expect(screen.getByRole('slider')).toHaveValue('3000');
  expect(updateMap).toHaveBeenLastCalledWith({...tour.stops[1].camera, transitionDuration: 0});
});

test.each([0, 1000])(
  'Go to uses the selected camera at coincident arrivals with a final hold of %i ms',
  holdDurationMs => {
    const coincident = {
      stops: [
        {...tour.stops[0], holdDurationMs: 0, travelDurationMs: 0},
        {...tour.stops[1], holdDurationMs}
      ]
    };
    const {updateMap} = setup(coincident);
    if (holdDurationMs) fireEvent.click(screen.getByRole('button', {name: 'Play'}));
    const staleCallback = [...callbacks.values()][0];
    updateMap.mockClear();
    fireEvent.click(screen.getByRole('button', {name: 'Go to'}));
    expect(updateMap).toHaveBeenCalledTimes(1);
    expect(updateMap).toHaveBeenLastCalledWith({...camera, transitionDuration: 0});
    expect(screen.getByRole('slider')).toHaveValue('0');
    expect(screen.getByRole('button', {name: 'Play'})).toBeInTheDocument();
    expect(callbacks.size).toBe(0);
    if (staleCallback) act(() => staleCallback(500));
    expect(updateMap).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', {name: 'Stop 2: Work'}));
    fireEvent.click(screen.getByRole('button', {name: 'Go to'}));
    expect(updateMap).toHaveBeenLastCalledWith({...tour.stops[1].camera, transitionDuration: 0});
    fireEvent.click(screen.getByRole('button', {name: 'Stop 1: Home'}));
    fireEvent.click(screen.getByRole('button', {name: 'Go to'}));
    fireEvent.click(screen.getByRole('button', {name: 'Restart'}));
    expect(updateMap).toHaveBeenLastCalledWith({...tour.stops[1].camera, transitionDuration: 0});
  }
);

test.each(['pointerDown', 'wheel', 'keyDown'] as const)(
  'manual map %s pauses playback before more frames',
  event => {
    const {updateMap} = setup();
    fireEvent.click(screen.getByRole('button', {name: 'Play'}));
    const staleCallback = [...callbacks.values()][0];
    fireEvent[event](screen.getByRole('button', {name: 'Map surface'}));
    expect(screen.getByRole('button', {name: 'Play'})).toBeInTheDocument();
    updateMap.mockClear();
    act(() => staleCallback(1000));
    expect(updateMap).not.toHaveBeenCalled();
    expect(callbacks.size).toBe(0);
  }
);

test('search navigation pauses playback while unrelated sidebar pointer events do not', () => {
  setup();
  fireEvent.click(screen.getByRole('button', {name: 'Play'}));
  fireEvent.pointerDown(screen.getByRole('textbox', {name: 'Stop name'}));
  expect(screen.getByRole('button', {name: 'Pause'})).toBeInTheDocument();
  fireEvent.keyDown(screen.getByRole('textbox', {name: 'Search map'}), {key: 'Enter'});
  expect(screen.getByRole('button', {name: 'Play'})).toBeInTheDocument();
});

test('editing and unmounting cancel playback while collapsing only hides the editor', () => {
  const {unmount, updateMap} = setup();
  fireEvent.click(screen.getByRole('button', {name: 'Play'}));
  fireEvent.change(screen.getByRole('textbox', {name: 'Stop name'}), {
    target: {value: 'Changed'}
  });
  expect(callbacks.size).toBe(0);
  expect(screen.getByLabelText('Elapsed time')).toHaveTextContent('0 s');
  fireEvent.click(screen.getByRole('button', {name: 'Play'}));
  fireEvent.click(screen.getByRole('button', {name: 'Camera animation'}));
  expect(screen.queryByRole('button', {name: 'Pause'})).toBeNull();
  expect(callbacks.size).toBe(1);
  frame(1500);
  expect(updateMap).toHaveBeenLastCalledWith({
    ...evaluateCameraTour(tour, 1500),
    transitionDuration: 0
  });
  fireEvent.click(screen.getByRole('button', {name: 'Camera animation'}));
  expect(screen.getByRole('button', {name: 'Pause'})).toBeInTheDocument();
  unmount();
  expect(callbacks.size).toBe(0);
});

test('zero-duration tours disable playback but can jump to their evaluated camera', () => {
  const instant = {
    stops: tour.stops.map(stop => ({...stop, holdDurationMs: 0, travelDurationMs: 0}))
  };
  const {updateMap} = setup(instant);
  expect(screen.getByRole('button', {name: 'Play'})).toBeDisabled();
  expect(screen.getByRole('slider')).toBeDisabled();
  fireEvent.click(screen.getByRole('button', {name: 'Restart'}));
  expect(updateMap).toHaveBeenLastCalledWith({...tour.stops[1].camera, transitionDuration: 0});
});

test.each([
  {...INITIAL_MAP_STATE, isSplit: true},
  {...INITIAL_MAP_STATE, globe: {...INITIAL_MAP_STATE.globe!, enabled: true}}
])('unsupported map modes do not expose tour editing or playback', mapState => {
  setup(tour, {mapState, bookmarks: [{id: 'saved', name: 'Saved view', camera}]});
  expect(screen.getByText('Use a single 2D or 3D map to edit camera views.')).toBeInTheDocument();
  expect(screen.queryByRole('button', {name: 'Play'})).toBeNull();
  expect(screen.queryByRole('button', {name: 'Add stop'})).toBeNull();
  expect(screen.queryByRole('menu')).toBeNull();
});

test('navigating to a saved bookmark pauses the tour before the next frame', () => {
  const {updateMap} = setup(tour, {bookmarksEnabled: true});
  fireEvent.click(screen.getByRole('button', {name: 'Bookmarks'}));
  fireEvent.click(screen.getByRole('button', {name: 'Play'}));
  fireEvent.click(
    within(document.querySelector('.interaction-camera-bookmarks') as HTMLElement).getByRole(
      'button',
      {name: 'Go to'}
    )
  );
  expect(screen.getByRole('button', {name: 'Play'})).toBeInTheDocument();
  expect(updateMap).toHaveBeenLastCalledWith(expect.objectContaining({transitionDuration: 1000}));
  updateMap.mockClear();
  frame(1500);
  expect(updateMap).not.toHaveBeenCalled();
});

test('disabling pauses immediately, preserves stops and elapsed time, and re-enables paused', () => {
  const {updateMap, commit, toggle} = setup();
  const enable = screen.getByRole('checkbox', {name: 'Enable camera animation'});
  const expand = screen.getByRole('button', {name: 'Camera animation'});
  expect(enable).toBeChecked();
  expect(document.getElementById(expand.getAttribute('aria-controls') || '')).not.toBeNull();
  fireEvent.click(screen.getByRole('button', {name: 'Play'}));
  frame(1500);
  const staleCallback = [...callbacks.values()][0];
  fireEvent.click(enable);
  expect(toggle).toHaveBeenLastCalledWith('cameraTour', false);
  expect(enable).not.toBeChecked();
  expect(expand).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('button', {name: 'Play'})).toBeDisabled();
  expect(screen.getByRole('button', {name: 'Restart'})).toBeDisabled();
  expect(screen.getByRole('button', {name: 'Go to'})).toBeDisabled();
  expect(screen.getByRole('slider')).toBeDisabled();
  updateMap.mockClear();
  act(() => staleCallback(2000));
  fireEvent.click(screen.getByRole('button', {name: 'Stop 2: Work'}));
  expect(updateMap).not.toHaveBeenCalled();
  expect(callbacks.size).toBe(0);
  expect(commit).not.toHaveBeenCalled();
  expect(screen.getByLabelText('Elapsed time')).toHaveTextContent('1.5 s');
  expect(screen.getByRole('textbox', {name: 'Stop name'})).toHaveValue('Work');
  fireEvent.click(expand);
  fireEvent.click(enable);
  expect(expand).toHaveAttribute('aria-expanded', 'false');
  expect(callbacks.size).toBe(0);
  fireEvent.click(expand);
  expect(screen.getByRole('button', {name: 'Play'})).toBeEnabled();
  expect(screen.getByLabelText('Elapsed time')).toHaveTextContent('1.5 s');
  expect(commit).not.toHaveBeenCalled();
});

test('floating bookmark navigation outside the map pauses playback before any stale frame', () => {
  const {updateMap} = setup(tour, {floatingBookmarks: true, bookmarksEnabled: true});
  const navigate = screen.getByRole('button', {name: 'Saved view'});
  expect(navigate.closest('.maps')).toBeNull();
  expect(navigate.closest('.camera-bookmark-panel')).not.toBeNull();
  fireEvent.click(screen.getByRole('button', {name: 'Play'}));
  const staleCallback = [...callbacks.values()][0];
  fireEvent.click(navigate);
  expect(screen.getByRole('button', {name: 'Play'})).toBeInTheDocument();
  expect(updateMap).toHaveBeenLastCalledWith(expect.objectContaining({transitionDuration: 1000}));
  updateMap.mockClear();
  act(() => staleCallback(1500));
  expect(updateMap).not.toHaveBeenCalled();
  expect(callbacks.size).toBe(0);
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

function measureStops(coincident = false) {
  const original = HTMLElement.prototype.getBoundingClientRect;
  jest
    .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    .mockImplementation(function (this: HTMLElement) {
      if (!this.classList.contains('camera-tour-marker-slot')) return original.call(this);
      const markers = Array.from(
        this.parentElement?.querySelectorAll('.camera-tour-marker-slot') || []
      );
      const left = coincident ? 0 : markers.indexOf(this) * 100;
      return {
        x: left,
        y: 0,
        top: 0,
        left,
        right: left + 100,
        bottom: 40,
        width: 100,
        height: 40,
        toJSON: () => ({})
      };
    });
}

test('keyboard selection stays available but Space and arrows never reorder stops', async () => {
  measureStops();
  const {commit, updateMap} = setup();
  const home = screen.getByRole('button', {name: 'Stop 1: Home'});
  const work = screen.getByRole('button', {name: 'Stop 2: Work'});
  home.focus();
  fireEvent.keyDown(home, {key: ' ', code: 'Space'});
  fireEvent.keyUp(home, {key: ' ', code: 'Space'});
  fireEvent.click(home); // The native Space keyup click, which fireEvent does not synthesize.
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });
  expect(home).not.toHaveAttribute('data-dragging');
  fireEvent.keyDown(home, {key: 'ArrowRight', code: 'ArrowRight'});
  expect(work).toHaveFocus();
  expect(work).toHaveAttribute('aria-pressed', 'true');
  expect(screen.queryByRole('spinbutton', {name: 'Travel to next (s)'})).toBeNull();
  fireEvent.keyDown(work, {key: ' ', code: 'Space'});
  fireEvent.keyUp(work, {key: ' ', code: 'Space'});
  fireEvent.click(work);
  fireEvent.keyDown(work, {key: 'Escape', code: 'Escape'});
  expect(work).not.toHaveAttribute('data-dragging');
  expect(work).toHaveAccessibleName('Stop 2: Work');
  fireEvent.keyDown(work, {key: 'ArrowLeft', code: 'ArrowLeft'});
  expect(home).toHaveFocus();
  expect(home).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('spinbutton', {name: 'Travel to next (s)'})).toHaveValue(2);
  fireEvent.keyDown(home, {key: 'Enter', code: 'Enter'});
  expect(home).toHaveAttribute('aria-pressed', 'true');
  expect(home).toHaveAccessibleName('Stop 1: Home');
  expect(commit).not.toHaveBeenCalled();
  expect(updateMap).not.toHaveBeenCalled();
});

test('selected-stop actions and timing edit only that stop without dragging or navigation', () => {
  measureStops();
  const liveCamera = {...camera, pitch: 60};
  const {commit, updateMap} = setup(tour, {liveCamera});
  const work = screen.getByRole('button', {name: 'Stop 2: Work'});
  fireEvent.click(work);
  const capture = screen.getByRole('button', {name: 'Pick current location'});
  fireEvent.pointerDown(capture, {button: 0, clientX: 180, clientY: 120});
  fireEvent.pointerMove(document, {clientX: 20, clientY: 120});
  fireEvent.pointerUp(document);
  fireEvent.click(capture);
  expect(commit).toHaveBeenLastCalledWith({
    stops: [tour.stops[0], {...tour.stops[1], camera: liveCamera}]
  });
  expect(work).not.toHaveAttribute('data-dragging');
  fireEvent.click(screen.getByRole('button', {name: 'Play'}));
  updateMap.mockClear();
  fireEvent.change(screen.getByRole('spinbutton', {name: 'Hold (s)'}), {
    target: {value: '2'}
  });
  expect(commit.mock.lastCall[0].stops[1]).toMatchObject({
    id: 'work',
    holdDurationMs: 2000,
    travelDurationMs: 9999
  });
  expect(callbacks.size).toBe(0);
  expect(screen.getByRole('button', {name: 'Play'})).toBeInTheDocument();
  expect(updateMap).not.toHaveBeenCalled();
});

test('pointer reorder preserves the selected stop and its durations without navigating', async () => {
  measureStops();
  const {commit, updateMap} = setup();
  const home = screen.getByRole('button', {name: 'Stop 1: Home'});
  const work = screen.getByRole('button', {name: 'Stop 2: Work'});
  fireEvent.click(screen.getByRole('button', {name: 'Play'}));
  const staleCallback = [...callbacks.values()][0];
  updateMap.mockClear();
  fireEvent.pointerDown(work, {button: 0, clientX: 150, clientY: 20});
  work.focus(); // Simulate the pointer-focus default omitted by fireEvent.
  fireEvent.pointerMove(document, {clientX: 144, clientY: 20});
  await waitFor(() => expect(work).toHaveAttribute('data-dragging', 'true'));
  expect(callbacks.size).toBe(0);
  const positions = [home.parentElement!.style.left, work.parentElement!.style.left];
  fireEvent.pointerMove(document, {clientX: 50, clientY: 20});
  expect([home.parentElement!.style.left, work.parentElement!.style.left]).toEqual(positions);
  fireEvent.pointerUp(document, {clientX: 50, clientY: 20});
  fireEvent.click(work); // The post-drag click must not select or navigate.
  await waitFor(() => expect(commit).toHaveBeenCalledWith({stops: [tour.stops[1], tour.stops[0]]}));
  expect(home).toHaveAttribute('aria-pressed', 'true');
  expect(home).toHaveAccessibleName('Stop 2: Home');
  expect(work).toHaveAttribute('aria-pressed', 'false');
  expect(work).not.toHaveAttribute('data-dragging');
  expect(work).toHaveFocus();
  act(() => staleCallback(1500));
  expect(updateMap).not.toHaveBeenCalled();
  await waitFor(() => {
    fireEvent.click(work);
    expect(work).toHaveAttribute('aria-pressed', 'true');
  });
  expect(screen.getByRole('spinbutton', {name: 'Travel to next (s)'})).toHaveValue(9.999);
  expect(updateMap).not.toHaveBeenCalled();
});

test.each(['pointercancel', 'escape', 'outside'] as const)(
  'pointer %s cancels reorder without saving or navigation',
  async cancel => {
    measureStops();
    const {commit, updateMap} = setup();
    const home = screen.getByRole('button', {name: 'Stop 1: Home'});
    fireEvent.pointerDown(home, {button: 0, clientX: 50, clientY: 20});
    fireEvent.pointerMove(document, {clientX: 56, clientY: 20});
    await waitFor(() => expect(home).toHaveAttribute('data-dragging', 'true'));
    fireEvent.pointerMove(document, {clientX: 150, clientY: 20});
    if (cancel === 'pointercancel') fireEvent.pointerCancel(document);
    else if (cancel === 'escape') fireEvent.keyDown(document, {key: 'Escape', code: 'Escape'});
    else {
      fireEvent.pointerMove(document, {clientX: 500, clientY: 500});
      fireEvent.pointerUp(document, {clientX: 500, clientY: 500});
    }
    expect(home).not.toHaveAttribute('data-dragging');
    expect(home).toHaveAttribute('aria-pressed', 'true');
    expect(home).toHaveAccessibleName('Stop 1: Home');
    expect(commit).not.toHaveBeenCalled();
    expect(updateMap).not.toHaveBeenCalled();
    // dnd-kit suppresses the click immediately following cancellation; let it release
    // before the next test tries to open its freshly mounted panel.
    await waitFor(() => {
      const work = screen.getByRole('button', {name: 'Stop 2: Work'});
      fireEvent.click(work);
      expect(work).toHaveAttribute('aria-pressed', 'true');
    });
  }
);

test('one-stop deletion restores capture focus and empty controls; many stops stay keyboard-accessible', () => {
  const {unmount, commit} = setup({stops: [tour.stops[0]]});
  expect(screen.getByRole('button', {name: 'Stop 1: Home'})).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  expect(screen.queryByRole('spinbutton', {name: 'Travel to next (s)'})).toBeNull();
  fireEvent.click(screen.getByRole('button', {name: 'Delete'}));
  expect(commit).toHaveBeenLastCalledWith(null);
  expect(screen.getByRole('button', {name: 'Add stop'})).toHaveFocus();
  expect(screen.queryByRole('spinbutton')).toBeNull();
  expect(screen.queryByRole('group', {name: 'Animation stops'})).toBeNull();
  unmount();
  const many = {
    stops: Array.from({length: 30}, (_, index) => ({
      ...tour.stops[0],
      id: `stop-${index}`,
      name: `View ${index}`
    }))
  };
  setup(many);
  const first = screen.getByRole('button', {name: 'Stop 1: View 0'});
  const last = screen.getByRole('button', {name: 'Stop 30: View 29'});
  first.focus();
  fireEvent.keyDown(first, {key: 'End', code: 'End'});
  expect(last).toHaveFocus();
  expect(last).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('textbox', {name: 'Stop name'})).toHaveValue('View 29');
  fireEvent.keyDown(last, {key: 'Home', code: 'Home'});
  expect(first).toHaveFocus();
  fireEvent.keyDown(first, {key: 'Enter', code: 'Enter'});
  expect(first).toHaveAttribute('aria-pressed', 'true');
});

test('normalizes Hold and Travel blocks to authored duration, including the final Hold only', () => {
  setup();
  const hold = screen.getByRole('button', {name: 'Stop 1: Home — Hold: 1 s'});
  const travel = screen.getByRole('button', {name: 'Stop 1: Home — Travel: 2 s'});
  const finalHold = screen.getByRole('button', {name: 'Stop 2: Work — Hold: 1 s'});
  // These proportions encode authored time, rather than incidental visual dimensions.
  expect(hold).toHaveStyle({left: '0%', width: '25%'});
  expect(travel).toHaveStyle({left: '25%', width: '50%'});
  expect(finalHold).toHaveStyle({left: '75%', width: '25%'});
  expect(screen.getByRole('button', {name: 'Stop 1: Home'}).parentElement).toHaveStyle({
    left: 'clamp(16px, 0%, calc(100% - 16px))'
  });
  expect(screen.getByRole('button', {name: 'Stop 2: Work'}).parentElement).toHaveStyle({
    left: 'clamp(16px, 75%, calc(100% - 16px))'
  });
  expect(screen.queryByRole('button', {name: /Stop 2: Work — Travel:/})).toBeNull();
  fireEvent.change(screen.getByRole('spinbutton', {name: 'Travel to next (s)'}), {
    target: {value: '6'}
  });
  expect(hold).toHaveStyle({left: '0%', width: '12.5%'});
  expect(travel).toHaveStyle({left: '12.5%', width: '75%'});
  expect(finalHold).toHaveStyle({left: '87.5%', width: '12.5%'});
  expect(screen.getByLabelText('Tour duration')).toHaveTextContent('8 s');
});

test('segment activation selects its owner and focuses the corresponding input without navigation or reorder', () => {
  const {commit, updateMap} = setup();
  fireEvent.click(screen.getByRole('button', {name: 'Play'}));
  const staleFrame = [...callbacks.values()][0];
  updateMap.mockClear();
  fireEvent.click(screen.getByRole('button', {name: 'Stop 2: Work — Hold: 1 s'}));
  expect(screen.getByRole('button', {name: 'Stop 2: Work'})).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  expect(screen.getByRole('spinbutton', {name: 'Hold (s)'})).toHaveFocus();
  expect(callbacks.size).toBe(0);
  act(() => staleFrame(1500));
  fireEvent.click(screen.getByRole('button', {name: 'Stop 1: Home — Travel: 2 s'}));
  expect(screen.getByRole('button', {name: 'Stop 1: Home'})).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  expect(screen.getByRole('spinbutton', {name: 'Travel to next (s)'})).toHaveFocus();
  fireEvent.click(screen.getByRole('button', {name: 'Stop 1: Home — Hold: 1 s'}));
  expect(screen.getByRole('spinbutton', {name: 'Hold (s)'})).toHaveFocus();
  expect(commit).not.toHaveBeenCalled();
  expect(updateMap).not.toHaveBeenCalled();
});

test('coincident zero-time stops remain selectable without inventing timeline duration', () => {
  const zeroTour = {
    stops: tour.stops.map(stop => ({...stop, holdDurationMs: 0, travelDurationMs: 0}))
  };
  const {commit, updateMap} = setup(zeroTour);
  for (const stop of zeroTour.stops) {
    const hold = screen.getByRole('button', {name: new RegExp(`${stop.name} — Hold:`)});
    expect(hold).toHaveStyle({left: '0%', width: '0%'});
    expect(hold).toHaveAttribute('tabindex', '-1');
  }
  const first = screen.getByRole('button', {name: 'Stop 1: Home'});
  first.focus();
  fireEvent.keyDown(first, {key: 'ArrowRight', code: 'ArrowRight'});
  expect(screen.getByRole('button', {name: 'Stop 2: Work'})).toHaveFocus();
  expect(screen.getByRole('button', {name: 'Stop 2: Work'})).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  expect(screen.getByRole('textbox', {name: 'Stop name'})).toHaveValue('Work');
  expect(screen.getByRole('spinbutton', {name: 'Hold (s)'})).toHaveValue(0);
  expect(screen.getByRole('button', {name: 'Play'})).toBeDisabled();
  expect(commit).not.toHaveBeenCalled();
  expect(updateMap).not.toHaveBeenCalled();
  fireEvent.change(screen.getByRole('spinbutton', {name: 'Hold (s)'}), {target: {value: '2'}});
  expect(screen.getByRole('button', {name: 'Stop 2: Work — Hold: 2 s'})).toHaveStyle({
    left: '0%',
    width: '100%'
  });
  expect(screen.getByLabelText('Tour duration')).toHaveTextContent('2 s');
});

test('tiny segments keep their duration proportions and are editable through their stop', () => {
  const {commit, updateMap} = setup({
    stops: [
      {...tour.stops[0], holdDurationMs: 1, travelDurationMs: 9998},
      {...tour.stops[1], holdDurationMs: 1}
    ]
  });
  expect(screen.getByRole('button', {name: 'Stop 1: Home — Hold: 0 s'})).toHaveStyle({
    width: '0.01%'
  });
  const marker = screen.getByRole('button', {name: 'Stop 2: Work'});
  marker.focus();
  fireEvent.keyDown(marker, {key: 'Enter', code: 'Enter'});
  expect(screen.getByRole('spinbutton', {name: 'Hold (s)'})).toHaveValue(0.001);
  expect(screen.getByRole('button', {name: 'Stop 2: Work'})).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  fireEvent.change(screen.getByRole('spinbutton', {name: 'Hold (s)'}), {target: {value: '1'}});
  expect(commit.mock.lastCall[0].stops[1]).toMatchObject({id: 'work', holdDurationMs: 1000});
  expect(updateMap).not.toHaveBeenCalled();
});

test.each([
  ['first', 1, ['second', 'first', 'third']],
  ['third', -1, ['first', 'third', 'second']]
] as const)(
  'coincident arrivals move %s one position in the drag direction',
  async (id, direction, order) => {
    measureStops(true);
    const stops = ['first', 'second', 'third'].map((stopId, index) => ({
      ...tour.stops[0],
      id: stopId,
      name: stopId,
      holdDurationMs: index === 2 ? 1000 : 0,
      travelDurationMs: 0
    }));
    const {commit, updateMap} = setup({stops});
    const marker = screen.getByRole('button', {
      name: `Stop ${stops.findIndex(stop => stop.id === id) + 1}: ${id}`
    });
    marker.focus();
    fireEvent.keyDown(marker, {key: 'Enter', code: 'Enter'});
    fireEvent.pointerDown(marker, {button: 0, clientX: 50, clientY: 20});
    fireEvent.pointerMove(document, {clientX: 50 + direction * 6, clientY: 20});
    await waitFor(() => expect(marker).toHaveAttribute('data-dragging', 'true'));
    fireEvent.pointerMove(document, {clientX: 50 + direction * 10, clientY: 20});
    fireEvent.pointerUp(document, {clientX: 50 + direction * 10, clientY: 20});
    await waitFor(() => expect(commit).toHaveBeenCalledTimes(1));
    expect(commit.mock.lastCall[0].stops.map((stop: {id: string}) => stop.id)).toEqual(order);
    expect(marker).toHaveAttribute('aria-pressed', 'true');
    expect(updateMap).not.toHaveBeenCalled();
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Go to'}));
      expect(updateMap).toHaveBeenCalledTimes(1);
    });
  }
);
