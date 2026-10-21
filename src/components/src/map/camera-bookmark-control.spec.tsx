// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, screen, within, waitFor} from '@testing-library/react';
import copy from 'copy-to-clipboard';
import {MapStateActions, UIStateActions, VisStateActions} from '@kepler.gl/actions';
import {INITIAL_MAP_STATE, INITIAL_UI_STATE, uiStateUpdaters} from '@kepler.gl/reducers';
import {renderWithTheme, IntlWrapper} from 'test/helpers/component-jest-utils';
import CameraBookmarkControl from './camera-bookmark-control';
import {RootContext} from '../context';
import CameraBookmarks from '../side-panel/interaction-panel/camera-bookmarks';

jest.mock('copy-to-clipboard', () => jest.fn(() => true));
const camera = {longitude: 10.12345678, latitude: 20.98765432, zoom: 6, bearing: 30, pitch: 45};
const bookmarks = [{id: 'home', name: 'Home', camera}];

function setup(props = {}) {
  const updateMap = jest.fn();
  const settings = jest.fn();
  const visibility = jest.fn();
  const result = renderWithTheme(
    <IntlWrapper>
      <CameraBookmarkControl
        bookmarks={bookmarks}
        mapState={INITIAL_MAP_STATE}
        mapStateActions={{...MapStateActions, updateMap}}
        mapControls={INITIAL_UI_STATE.mapControls}
        setMapControlSettings={settings}
        setMapControlVisibility={visibility}
        {...props}
      />
    </IntlWrapper>
  );
  return {...result, updateMap, settings, visibility};
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

test('copies the existing latitude/longitude format without a success message or navigation', () => {
  const {updateMap} = setup();
  fireEvent.click(screen.getByRole('button', {name: 'Copy coordinates: Home'}));
  expect(copy).toHaveBeenCalledWith('20.987654, 10.123457');
  expect(
    within(screen.getByRole('navigation', {name: 'Bookmarks'})).getByRole('status')
  ).toBeEmptyDOMElement();
  expect(updateMap).not.toHaveBeenCalled();
});

// JSDOM does not evaluate pointer media queries or pointer/focus pseudo-classes reliably.
// Enable the emitted fine-pointer CSS and model states with equal-specificity attributes.
function emulatePointerStyles() {
  const pointerStyles = document.createElement('style');
  pointerStyles.textContent = Array.from(document.styleSheets)
    .flatMap(sheet => Array.from(sheet.cssRules))
    .filter((rule): rule is CSSMediaRule => rule.type === CSSRule.MEDIA_RULE)
    .filter(
      rule =>
        /hover\s*:\s*hover/.test(rule.conditionText) &&
        /pointer\s*:\s*fine/.test(rule.conditionText)
    )
    .flatMap(rule => Array.from(rule.cssRules))
    .map(rule => rule.cssText)
    .join('\n');
  document.head.appendChild(pointerStyles);
  const stateRules = Array.from(document.styleSheets)
    .flatMap(sheet => Array.from(sheet.cssRules))
    .filter((rule): rule is CSSStyleRule => rule.type === CSSRule.STYLE_RULE)
    .filter(rule => /:hover|:focus-visible|:focus-within/.test(rule.selectorText))
    .map(rule => ({rule, selector: rule.selectorText}));
  stateRules.forEach(({rule, selector}) => {
    rule.selectorText = selector
      .replace(/:hover/g, '[data-test-hover]')
      .replace(/:focus-visible/g, '[data-test-focus-visible]')
      .replace(/:focus-within/g, '[data-test-focus-within]');
  });
  return () => {
    stateRules.forEach(({rule, selector}) => {
      rule.selectorText = selector;
    });
    pointerStyles.remove();
  };
}

test('reveals copying only for its hovered or keyboard-focused row without shifting layout', () => {
  setup({bookmarks: [...bookmarks, {...bookmarks[0], id: 'work', name: 'Work'}]});
  const homeCopy = screen.getByRole('button', {name: 'Copy coordinates: Home'});
  const workCopy = screen.getByRole('button', {name: 'Copy coordinates: Work'});
  const workNavigate = screen.getByRole('button', {name: 'Work'});
  const homeRow = homeCopy.parentElement as HTMLElement;
  const panel = homeCopy.closest('.camera-bookmark-panel') as HTMLElement;
  const restoreStyles = emulatePointerStyles();
  const expectCopyState = (button: HTMLElement, visible: boolean) =>
    expect(button).toHaveStyle({
      opacity: visible ? '1' : '0',
      pointerEvents: visible ? 'auto' : 'none',
      flex: '0 0 28px',
      width: '28px',
      height: '28px'
    });
  try {
    expectCopyState(homeCopy, false);
    expectCopyState(workCopy, false);
    fireEvent.mouseEnter(panel);
    panel.setAttribute('data-test-hover', '');
    expectCopyState(homeCopy, false);
    expectCopyState(workCopy, false);

    fireEvent.mouseEnter(homeRow);
    homeRow.setAttribute('data-test-hover', '');
    expectCopyState(homeCopy, true);
    expectCopyState(workCopy, false);
    homeCopy.focus(); // Model native pointer focus, which fireEvent.click does not provide.
    homeRow.setAttribute('data-test-focus-within', '');
    fireEvent.click(homeCopy);
    expect(copy).toHaveBeenLastCalledWith('20.987654, 10.123457');
    fireEvent.mouseLeave(homeRow);
    homeRow.removeAttribute('data-test-hover');
    expect(homeCopy).toHaveFocus();
    expectCopyState(homeCopy, false);
    expectCopyState(workCopy, false);

    homeCopy.setAttribute('data-test-focus-visible', '');
    expectCopyState(homeCopy, true);
    homeCopy.removeAttribute('data-test-focus-visible');
    workNavigate.focus();
    workNavigate.setAttribute('data-test-focus-visible', '');
    expectCopyState(homeCopy, false);
    expectCopyState(workCopy, true);
    workCopy.focus();
    workNavigate.removeAttribute('data-test-focus-visible');
    workCopy.setAttribute('data-test-focus-visible', '');
    expect(workCopy).toHaveFocus();
    expectCopyState(workCopy, true);
    fireEvent.click(workCopy);
    expect(copy).toHaveBeenLastCalledWith('20.987654, 10.123457');
    expect(
      within(screen.getByRole('navigation', {name: 'Bookmarks'})).getByRole('status')
    ).toBeEmptyDOMElement();
  } finally {
    restoreStyles();
  }
});

test('reports clipboard failure and clears it after a successful retry', () => {
  jest.mocked(copy).mockReturnValueOnce(false);
  setup();
  fireEvent.click(screen.getByRole('button', {name: 'Copy coordinates: Home'}));
  expect(
    within(screen.getByRole('navigation', {name: 'Bookmarks'})).getByRole('status')
  ).toHaveTextContent('Could not copy coordinates');
  fireEvent.click(screen.getByRole('button', {name: 'Copy coordinates: Home'}));
  expect(copy).toHaveBeenLastCalledWith('20.987654, 10.123457');
  expect(
    within(screen.getByRole('navigation', {name: 'Bookmarks'})).getByRole('status')
  ).toBeEmptyDOMElement();
});

test('closing the legend-style panel switches bookmarks off and reopening preserves them', () => {
  const commit = jest.fn();
  const visibility = jest.fn();
  function Harness() {
    const [uiState, setUiState] = React.useState(INITIAL_UI_STATE);
    const setMapControlVisibility: typeof UIStateActions.setMapControlVisibility = (id, show) => {
      visibility(id, show);
      const action = UIStateActions.setMapControlVisibility(id, show);
      setUiState(state => uiStateUpdaters.setMapControlVisibilityUpdater(state, action));
      return action;
    };
    return (
      <>
        <CameraBookmarks
          bookmarks={bookmarks}
          enabled={uiState.mapControls.cameraBookmarks?.show}
          mapState={INITIAL_MAP_STATE}
          mapStateActions={MapStateActions}
          uiStateActions={{...UIStateActions, setMapControlVisibility}}
          visStateActions={{
            ...VisStateActions,
            setCameraBookmarks: Object.assign(commit, VisStateActions.setCameraBookmarks)
          }}
        />
        <CameraBookmarkControl
          bookmarks={bookmarks}
          mapState={INITIAL_MAP_STATE}
          mapStateActions={MapStateActions}
          mapControls={uiState.mapControls}
          setMapControlSettings={UIStateActions.setMapControlSettings}
          setMapControlVisibility={setMapControlVisibility}
        />
      </>
    );
  }
  renderWithTheme(
    <IntlWrapper>
      <Harness />
    </IntlWrapper>
  );
  const toggle = screen.getByRole('checkbox', {name: 'Enable bookmarks'});
  const panel = screen.getByRole('navigation', {name: 'Bookmarks'}).closest('.map-control-panel');
  const close = panel?.querySelector('.map-control__panel-header .close-map-control-item');
  expect(close).toBeInTheDocument();
  expect(toggle).toBeChecked();
  fireEvent.click(close as HTMLElement);
  expect(visibility).toHaveBeenLastCalledWith('cameraBookmarks', false);
  expect(screen.queryByRole('navigation', {name: 'Bookmarks'})).toBeNull();
  expect(toggle).not.toBeChecked();

  fireEvent.click(toggle);
  expect(visibility).toHaveBeenLastCalledWith('cameraBookmarks', true);
  expect(toggle).toBeChecked();
  expect(screen.getByRole('navigation', {name: 'Bookmarks'})).toBeInTheDocument();
  expect(screen.getByRole('button', {name: 'Home'})).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', {name: 'Bookmarks'}));
  expect(screen.getByRole('textbox', {name: 'Bookmark name 1'})).toHaveValue('Home');
  expect(commit).not.toHaveBeenCalled();
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
