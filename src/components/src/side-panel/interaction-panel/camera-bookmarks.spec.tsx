// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState} from 'react';
import {fireEvent, screen, waitFor, within} from '@testing-library/react';
import copy from 'copy-to-clipboard';
import {IntlProvider} from 'react-intl';
import {MapStateActions, VisStateActions, UIStateActions} from '@kepler.gl/actions';
import {INITIAL_MAP_STATE} from '@kepler.gl/reducers';
import {CameraBookmark} from '@kepler.gl/types';
import {theme} from '@kepler.gl/styles';
import {renderWithTheme, IntlWrapper} from 'test/helpers/component-jest-utils';
import CameraBookmarks from './camera-bookmarks';
import {MapViewStateContext} from '../../map-view-state-context';
import ZoomOpacityConfigFactory from './zoom-opacity-config';
import PanelHeaderActionFactory from '../panel-header-action';

jest.mock('copy-to-clipboard', () => jest.fn(() => true));
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
  fireEvent.click(screen.getByRole('button', {name: 'Add Bookmark'}));
  expect(commit.mock.lastCall[0][0]).toEqual({id: expect.any(String), name: 'Bookmark 1', camera});
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

test('uses a short hint and matches Add controller sizing without forcing a single row', () => {
  setup();
  const ZoomOpacityConfig = ZoomOpacityConfigFactory(PanelHeaderActionFactory());
  const {container} = renderWithTheme(
    <IntlWrapper>
      <ZoomOpacityConfig layers={[]} visStateActions={VisStateActions} />
    </IntlWrapper>
  );
  fireEvent.click(container.querySelector('.interaction-zoom-opacity__header') as Element);
  const hint = screen.getByText('Save views to revisit later.');
  const add = screen.getByRole('button', {name: 'Add Bookmark'});
  const addController = screen.getByRole('button', {name: 'Add controller'});
  expect(hint.nextElementSibling).toBe(add);
  expect(hint).toHaveStyle({fontSize: '11px', lineHeight: '1.4', marginBottom: '12px'});
  expect(getComputedStyle(hint).whiteSpace).not.toBe('nowrap');
  for (const property of [
    'background-color',
    'color',
    'font-size',
    'font-family',
    'font-weight',
    'line-height',
    'padding',
    'border-radius'
  ]) {
    expect(getComputedStyle(add).getPropertyValue(property)).toBe(
      getComputedStyle(addController).getPropertyValue(property)
    );
  }
  expect(add).toHaveStyle({
    display: 'inline-flex',
    padding: '6px 9px',
    fontSize: '10px',
    lineHeight: '14px',
    maxWidth: '100%',
    boxSizing: 'border-box',
    whiteSpace: 'normal'
  });
  const plus = add.querySelector('.data-ex-icons-add');
  expect(plus).toHaveAttribute('height', '12px');
  expect(plus).toHaveAttribute('aria-hidden', 'true');
  expect(plus).toHaveStyle({marginRight: '6px', flexShrink: '0'});
  expect(add.querySelector('span')).toHaveStyle({minWidth: '0', overflowWrap: 'anywhere'});
  add.focus();
  expect(add).toHaveFocus();
  expect(add).toHaveAttribute('type', 'button');
});

test('keeps the hint and add action localized with wrapping for longer labels', () => {
  const commit = jest.fn();
  const label = 'Ajouter un signet pour cette vue';
  const hint = 'Enregistrez des vues pour les retrouver plus tard.';
  renderWithTheme(
    <IntlProvider
      locale="fr"
      messages={{'camera.captureBookmark': label, 'camera.bookmarksHint': hint}}
    >
      <CameraBookmarks
        mapState={{...INITIAL_MAP_STATE, ...camera}}
        visStateActions={{
          ...VisStateActions,
          setCameraBookmarks: Object.assign(commit, VisStateActions.setCameraBookmarks)
        }}
      />
    </IntlProvider>
  );
  fireEvent.click(screen.getByRole('button', {name: 'Bookmarks'}));
  expect(screen.getByText(hint)).toBeInTheDocument();
  const add = screen.getByRole('button', {name: label});
  expect(add).toHaveStyle({whiteSpace: 'normal', maxWidth: '100%'});
  fireEvent.click(add);
  expect(commit).toHaveBeenCalledWith([expect.objectContaining({camera})]);
});

test('keeps unsupported split-map editing unavailable', () => {
  setup(initial, {...INITIAL_MAP_STATE, isSplit: true});
  expect(screen.getByText('Use a single 2D or 3D map to edit camera views.')).toBeInTheDocument();
  expect(screen.queryByRole('button', {name: 'Add Bookmark'})).toBeNull();
});

test('captures and updates the live camera when Redux has not caught up', () => {
  const liveCamera = {...camera, longitude: 80, zoom: 12};
  const {commit} = setup(initial, {...INITIAL_MAP_STATE, ...camera}, liveCamera);
  // Change the live view after rendering: capture must read at click time.
  liveCamera.zoom = 13;
  fireEvent.click(screen.getByRole('button', {name: 'Update view'}));
  expect(commit.mock.lastCall[0][0].camera).toEqual(liveCamera);
  fireEvent.click(screen.getByRole('button', {name: 'Add Bookmark'}));
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
  expect(screen.queryByRole('button', {name: 'Up'})).toBeNull();
  expect(screen.queryByRole('button', {name: 'Down'})).toBeNull();
  for (const name of ['Go to', 'Copy coordinates', 'Update view', 'Delete']) {
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

test('copies each saved view with pointer or keyboard focus without navigating or dragging', () => {
  measureRows();
  const saved = [
    {...initial[0], camera: {...camera, longitude: 10.12345678, latitude: 20.98765432}},
    pair[1]
  ];
  const {commit, updateMap} = setup(saved);
  const [homeCopy, workCopy] = screen.getAllByRole('button', {name: 'Copy coordinates'});
  fireEvent.pointerDown(homeCopy, {button: 0, clientX: 180, clientY: 18});
  fireEvent.pointerMove(document, {clientX: 180, clientY: 60});
  fireEvent.pointerUp(document);
  fireEvent.click(homeCopy);
  expect(copy).toHaveBeenLastCalledWith('20.987654, 10.123457');
  workCopy.focus();
  fireEvent.keyDown(workCopy, {key: ' ', code: 'Space'});
  fireEvent.keyUp(workCopy, {key: ' ', code: 'Space'});
  fireEvent.click(workCopy); // Native buttons activate on keyboard release in the browser.
  expect(copy).toHaveBeenLastCalledWith('20.000000, 40.000000');
  expect(workCopy).toHaveFocus();
  expect(screen.getByRole('status', {name: 'Copy coordinates'})).toBeEmptyDOMElement();
  expect(commit).not.toHaveBeenCalled();
  expect(updateMap).not.toHaveBeenCalled();
  for (const name of ['Home', 'Work']) {
    expect(screen.getByRole('button', {name: `Reorder bookmark: ${name}`})).not.toHaveAttribute(
      'aria-pressed'
    );
  }
});

test('reports copy failure and silently clears it after a successful retry', () => {
  jest.mocked(copy).mockReturnValueOnce(false);
  setup(initial);
  fireEvent.click(screen.getByRole('button', {name: 'Copy coordinates'}));
  expect(screen.getByRole('status', {name: 'Copy coordinates'})).toHaveTextContent(
    'Could not copy coordinates'
  );
  fireEvent.click(screen.getByRole('button', {name: 'Copy coordinates'}));
  expect(copy).toHaveBeenLastCalledWith('20.000000, 10.000000');
  expect(screen.getByRole('status', {name: 'Copy coordinates'})).toBeEmptyDOMElement();
});

test('does not offer copying invalid saved coordinates', () => {
  jest.mocked(copy).mockClear();
  setup([{...initial[0], camera: {...camera, longitude: NaN}}]);
  const button = screen.getByRole('button', {name: 'Copy coordinates'});
  expect(button).toBeDisabled();
  fireEvent.click(button);
  expect(copy).not.toHaveBeenCalled();
});

test('copy actions follow their own row hover and keyboard focus without sticky pointer focus', () => {
  const {commit, updateMap} = setup(pair);
  const [homeCopy, workCopy] = screen.getAllByRole('button', {name: 'Copy coordinates'});
  const homeRow = homeCopy.closest('.bookmark-row') as HTMLElement;
  const homeActions = homeCopy.closest('.bookmark-actions');
  const workActions = workCopy.closest('.bookmark-actions');
  const restoreStyles = emulatePointerStyles();
  try {
    expect(homeActions).toHaveStyle({opacity: '0', pointerEvents: 'none'});
    expect(workActions).toHaveStyle({opacity: '0', pointerEvents: 'none'});
    fireEvent.mouseEnter(homeRow);
    homeRow.setAttribute('data-test-hover', '');
    expect(homeActions).toHaveStyle({opacity: '1', pointerEvents: 'auto'});
    expect(workActions).toHaveStyle({opacity: '0', pointerEvents: 'none'});
    homeCopy.focus();
    homeRow.setAttribute('data-test-focus-within', '');
    fireEvent.click(homeCopy);
    fireEvent.mouseLeave(homeRow);
    homeRow.removeAttribute('data-test-hover');
    expect(homeCopy).toHaveFocus();
    expect(homeActions).toHaveStyle({opacity: '0', pointerEvents: 'none'});

    workCopy.focus();
    workCopy.setAttribute('data-test-focus-visible', '');
    expect(workCopy).toHaveStyle({outline: `2px solid ${theme.activeColor}`});
    expect(workActions).toHaveStyle({opacity: '1', pointerEvents: 'auto'});
    expect(homeActions).toHaveStyle({opacity: '0', pointerEvents: 'none'});
    fireEvent.click(workCopy);
    expect(copy).toHaveBeenLastCalledWith('20.000000, 40.000000');
    expect(commit).not.toHaveBeenCalled();
    expect(updateMap).not.toHaveBeenCalled();
  } finally {
    restoreStyles();
  }
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

// JSDOM does not evaluate pointer media queries or pointer/focus pseudo-classes reliably.
// Enable the emitted fine-pointer rules and model states with equal-specificity attributes.
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

test('shows the toggle outline only for keyboard focus in either enabled state', () => {
  const {toggle} = setup(initial);
  const checkbox = screen.getByRole('checkbox', {name: 'Enable bookmarks'}) as HTMLInputElement;
  const wrapper = checkbox.closest('.kg-checkbox') as HTMLElement;
  const header = screen.getByRole('button', {name: 'Bookmarks'});
  for (const enabled of [false, true]) {
    fireEvent.click(checkbox);
    checkbox.focus();
    const restoreStyles = emulatePointerStyles();
    try {
      wrapper.setAttribute('data-test-focus-within', '');
      expect(checkbox.checked).toBe(enabled);
      expect(toggle).toHaveBeenLastCalledWith('cameraBookmarks', enabled);
      expect(checkbox).toHaveFocus();
      expect(wrapper).not.toHaveStyle({outline: `2px solid ${theme.activeColor}`});
      expect(wrapper).toHaveStyle({marginLeft: '0', marginRight: `-${theme.switchLabelMargin}px`});
      expect(wrapper.parentElement).toHaveStyle({gap: '24px', marginRight: '-10px'});
      expect(header).toHaveAttribute('aria-expanded', 'true');

      checkbox.setAttribute('data-test-focus-visible', '');
      expect(wrapper).toHaveStyle({outline: `2px solid ${theme.activeColor}`});
      checkbox.removeAttribute('data-test-focus-visible');
    } finally {
      restoreStyles();
    }
  }
  fireEvent.click(header);
  expect(header).toHaveAttribute('aria-expanded', 'false');
  expect(checkbox).toBeChecked();
});

test('reveals the light layer-style handle only on header hover or keyboard focus', () => {
  setup(initial);
  const handle = screen.getByRole('button', {name: 'Reorder bookmark: Home'});
  const row = handle.closest('.bookmark-row') as HTMLElement;
  const restoreStyles = emulatePointerStyles();
  row.setAttribute('data-test-hover', '');
  row.removeAttribute('data-test-hover');
  try {
    expect(handle).toHaveStyle({opacity: '0'});
    // Like Layer headers, the normal handle color is inherited from its text container.
    expect(row).toHaveStyle({color: theme.textColor});
    row.setAttribute('data-test-hover', '');
    expect(handle).toHaveStyle({opacity: '1'});
    expect(row).toHaveStyle({color: theme.textColor});
    handle.setAttribute('data-test-hover', '');
    expect(handle).toHaveStyle({color: theme.textColorHl, cursor: 'move'});
    handle.removeAttribute('data-test-hover');
    row.removeAttribute('data-test-hover');
    expect(handle).toHaveStyle({opacity: '0'});
    handle.focus();
    handle.setAttribute('data-test-focus-visible', '');
    expect(handle).toHaveFocus();
    expect(handle).toHaveStyle({opacity: '1'});
  } finally {
    restoreStyles();
  }
});

test('keyboard drag reorders stable bookmark IDs and Escape cancels without saving', async () => {
  measureRows();
  const {commit} = setup(pair);
  const colors = pair.map(item => bookmarkRowColor(item.name));
  expect(colors[0]).not.toBe(colors[1]);
  const handle = screen.getByRole('button', {name: 'Reorder bookmark: Home'});
  handle.focus();
  fireEvent.keyDown(handle, {key: ' ', code: 'Space'});
  await waitFor(() => expect(handle).toHaveAttribute('aria-pressed', 'true'));
  fireEvent.keyDown(document, {key: 'ArrowDown', code: 'ArrowDown'});
  fireEvent.keyDown(document, {key: ' ', code: 'Space'});
  await waitFor(() => expect(commit).toHaveBeenCalledWith([pair[1], pair[0]]));
  expect(screen.getByRole('textbox', {name: 'Bookmark name 1'})).toHaveValue('Work');
  expect(handle).toHaveFocus();
  expect(pair.map(item => bookmarkRowColor(item.name))).toEqual(colors);
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

test('hides actions after a pointer reorder and mouse leave while retaining keyboard access', async () => {
  measureRows();
  const {commit, updateMap} = setup(pair);
  const handle = screen.getByRole('button', {name: 'Reorder bookmark: Work'});
  const row = handle.closest('.bookmark-row') as HTMLElement;
  const actions = row.querySelector('.bookmark-actions');
  const restoreStyles = emulatePointerStyles();
  try {
    fireEvent.mouseEnter(row);
    row.setAttribute('data-test-hover', '');
    fireEvent.pointerDown(handle, {button: 0, clientX: 10, clientY: 60});
    // fireEvent does not perform the browser's native pointer-focus default action.
    handle.focus();
    row.setAttribute('data-test-focus-within', '');
    fireEvent.pointerMove(document, {clientX: 10, clientY: 54});
    await waitFor(() => expect(handle).toHaveAttribute('aria-pressed', 'true'));
    fireEvent.pointerMove(document, {clientX: 10, clientY: 18});
    fireEvent.pointerUp(document, {clientX: 10, clientY: 18});
    await waitFor(() => expect(commit).toHaveBeenCalledWith([pair[1], pair[0]]));
    expect(actions).toHaveStyle({opacity: '1', pointerEvents: 'auto'});
    fireEvent.mouseLeave(row);
    row.removeAttribute('data-test-hover');
    expect(handle).toHaveFocus();
    expect(handle).toHaveStyle({opacity: '0'});
    expect(actions).toHaveStyle({opacity: '0', pointerEvents: 'none'});

    handle.setAttribute('data-test-focus-visible', '');
    expect(handle).toHaveStyle({opacity: '1'});
    expect(actions).toHaveStyle({opacity: '1', pointerEvents: 'auto'});
    const goTo = within(row).getByRole('button', {name: 'Go to'});
    goTo.focus();
    handle.removeAttribute('data-test-focus-visible');
    goTo.setAttribute('data-test-focus-visible', '');
    expect(goTo).toHaveFocus();
    expect(actions).toHaveStyle({opacity: '1', pointerEvents: 'auto'});
    // Wait for dnd-kit's post-drag click suppression to release before the next test.
    await waitFor(() => {
      fireEvent.click(goTo);
      expect(updateMap).toHaveBeenCalledTimes(1);
    });
  } finally {
    restoreStyles();
  }
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

function bookmarkRowColor(name: string) {
  const row = screen
    .getByRole('button', {name: `Reorder bookmark: ${name}`})
    .closest('.bookmark-row');
  // JSDOM cannot compute the existing layer header's multiline rgb() border shorthand.
  // Inspect the emitted CSS rule to verify the same visible 3px color marker instead.
  const border = Array.from(document.styleSheets)
    .flatMap(sheet => Array.from(sheet.cssRules))
    .filter((rule): rule is CSSStyleRule => rule.type === CSSRule.STYLE_RULE)
    .filter(rule => row?.matches(rule.selectorText))
    .map(rule => rule.style.getPropertyValue('border-left'))
    .find(Boolean);
  expect(border).toMatch(/^3px solid rgb\(\s*\d+,\s*\d+,\s*\d+\s*\)$/);
  return border?.replace(/\s+/g, ' ');
}

test('bookmark colors survive edits and panel reopening without entering saved data', () => {
  const {commit} = setup(pair);
  const colors = pair.map(item => bookmarkRowColor(item.name));
  fireEvent.change(screen.getByRole('textbox', {name: 'Bookmark name 1'}), {
    target: {value: 'Renamed'}
  });
  expect(commit).toHaveBeenLastCalledWith([{...pair[0], name: 'Renamed'}, pair[1]]);
  expect(bookmarkRowColor('Renamed')).toBe(colors[0]);
  fireEvent.click(screen.getAllByRole('button', {name: 'Delete'})[1]);
  expect(commit).toHaveBeenLastCalledWith([{...pair[0], name: 'Renamed'}]);
  expect(bookmarkRowColor('Renamed')).toBe(colors[0]);
  const header = screen.getByRole('button', {name: 'Bookmarks'});
  fireEvent.click(header);
  fireEvent.click(header);
  expect(bookmarkRowColor('Renamed')).toBe(colors[0]);
});
