// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, screen, within, waitFor} from '@testing-library/react';
import copy from 'copy-to-clipboard';
import {ThemeProvider} from 'styled-components';
import {MapStateActions, UIStateActions, VisStateActions} from '@kepler.gl/actions';
import {INITIAL_MAP_STATE, INITIAL_UI_STATE, uiStateUpdaters} from '@kepler.gl/reducers';
import {theme} from '@kepler.gl/styles';
import {renderWithTheme, IntlWrapper} from 'test/helpers/component-jest-utils';
import CameraBookmarkControl from './camera-bookmark-control';
import {RootContext} from '../context';
import CameraBookmarks from '../side-panel/interaction-panel/camera-bookmarks';
import {DraggableLegend} from './map-legend-panel';
import MapControlPanelFactory from './map-control-panel';

jest.mock('copy-to-clipboard', () => jest.fn(() => true));
const camera = {longitude: 10.12345678, latitude: 20.98765432, zoom: 6, bearing: 30, pitch: 45};
const bookmarks = [{id: 'home', name: 'Home', camera}];
const enabledMapControls = {
  ...INITIAL_UI_STATE.mapControls,
  cameraBookmarks: {...INITIAL_UI_STATE.mapControls.cameraBookmarks, show: true, active: true}
};
const legacyMapControls = {...INITIAL_UI_STATE.mapControls};
delete legacyMapControls.cameraBookmarks;

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
        mapControls={enabledMapControls}
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
  const copyButton = screen.getByRole('button', {name: 'Copy coordinates: Home'});
  expect(copyButton.querySelector('svg')).toHaveAttribute('height', '14px');
  expect(copyButton).toHaveStyle({width: '28px', height: '28px'});
  fireEvent.click(copyButton);
  expect(copy).toHaveBeenCalledWith('20.987654, 10.123457');
  expect(
    within(screen.getByRole('navigation', {name: 'Bookmarks'})).getByRole('status')
  ).toBeEmptyDOMElement();
  expect(updateMap).not.toHaveBeenCalled();
});

test.each([1, 3])('fits one bookmark at minimum height and keeps %i rows scrollable', count => {
  const rows = Array.from({length: count}, (_, index) => ({
    ...bookmarks[0],
    id: `bookmark-${index}`,
    name: `Bookmark ${index + 1}`
  }));
  const {updateMap, visibility, settings} = setup({
    bookmarks: rows,
    mapControls: {
      ...INITIAL_UI_STATE.mapControls,
      cameraBookmarks: {show: true, active: true, settings: {contentHeight: 48}}
    }
  });
  const navigation = screen.getByRole('navigation', {name: 'Bookmarks'});
  const content = navigation.closest('.map-control__panel-content') as HTMLElement;
  const panel = navigation.closest('.draggable-legend') as HTMLElement;
  const header = panel.querySelector('.map-control__panel-header') as HTMLElement;
  const row = screen.getByRole('button', {name: rows[0].name}).parentElement as HTMLElement;
  const rowStyle = getComputedStyle(row);
  const padding = getComputedStyle(navigation);
  const requiredHeight =
    parseFloat(rowStyle.height) +
    parseFloat(rowStyle.marginBottom) +
    parseFloat(padding.paddingTop) +
    parseFloat(padding.paddingBottom);
  expect(requiredHeight).toBe(48);
  expect(content).toHaveStyle({
    height: `${requiredHeight}px`,
    minHeight: `${requiredHeight}px`,
    overflowY: 'auto'
  });
  expect(header).toHaveStyle({height: '32px'});
  expect(panel).toHaveStyle({borderWidth: '1px'});
  expect(screen.getByRole('button', {name: 'Move Bookmarks'})).toHaveStyle({cursor: 'move'});
  for (const handle of screen.getAllByRole('button', {name: 'Resize Bookmarks'})) {
    expect(handle).toHaveStyle({height: '12px'});
    expect(content).not.toContainElement(handle);
  }
  expect(within(navigation).getAllByRole('button')).toHaveLength(count * 2);
  const last = rows[count - 1];
  const copyButton = screen.getByRole('button', {name: `Copy coordinates: ${last.name}`});
  expect(copyButton).toHaveStyle({height: rowStyle.height, position: 'absolute'});
  copyButton.focus();
  expect(copyButton).toHaveFocus();
  fireEvent.click(copyButton);
  expect(copy).toHaveBeenCalledWith('20.987654, 10.123457');
  expect(updateMap).not.toHaveBeenCalled();
  expect(within(navigation).getByRole('status')).toBeEmptyDOMElement();
  fireEvent.click(screen.getByRole('button', {name: last.name}));
  expect(updateMap).toHaveBeenCalledTimes(1);
  const close = header.querySelector('.close-map-control-item') as HTMLElement;
  expect(content).not.toContainElement(close);
  fireEvent.click(close);
  expect(visibility).toHaveBeenCalledWith('cameraBookmarks', false);
  expect(settings).not.toHaveBeenCalled();
});

test('fills the row with a Layer-style bookmark and an independent overlaid copy control', () => {
  const name = 'A long bookmark name that needs to remain readable in a narrow floating panel';
  const {updateMap} = setup({bookmarks: [{...bookmarks[0], name}]});
  const navigate = screen.getByRole('button', {name});
  const copyButton = screen.getByRole('button', {name: `Copy coordinates: ${name}`});
  const row = navigate.parentElement as HTMLElement;
  const restoreStyles = emulatePointerStyles();
  try {
    expect(row).toHaveStyle({
      position: 'relative',
      width: '100%',
      backgroundColor: theme.panelBackground,
      borderRadius: theme.panelHeaderBorderRadius,
      color: theme.textColor
    });
    expect(navigate).toHaveStyle({
      boxSizing: 'border-box',
      width: '100%',
      height: '100%',
      paddingRight: '40px',
      background: 'transparent'
    });
    expect(navigate).toHaveAttribute('title', name);
    expect(navigate.querySelector('span')).toHaveStyle({
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    });
    expect(copyButton.parentElement).toBe(row);
    expect(navigate.querySelector('button')).toBeNull();
    expect(copyButton).toHaveStyle({
      position: 'absolute',
      right: '4px',
      color: theme.panelHeaderIcon
    });

    row.setAttribute('data-test-hover', '');
    expect(row).toHaveStyle({backgroundColor: theme.panelBackgroundHover});
    copyButton.setAttribute('data-test-hover', '');
    expect(copyButton).toHaveStyle({color: theme.panelHeaderIconHover});
    fireEvent.click(copyButton);
    expect(copy).toHaveBeenCalledWith('20.987654, 10.123457');
    expect(updateMap).not.toHaveBeenCalled();

    navigate.focus();
    navigate.setAttribute('data-test-focus-visible', '');
    expect(navigate).toHaveStyle({outline: `2px solid ${theme.activeColor}`});
    fireEvent.click(navigate);
    expect(updateMap).toHaveBeenCalledTimes(1);
    copyButton.focus();
    copyButton.setAttribute('data-test-focus-visible', '');
    expect(copyButton).toHaveStyle({outline: `2px solid ${theme.activeColor}`});
  } finally {
    restoreStyles();
  }
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
  // JSDOM can let later base rules override more-specific ancestor state rules.
  const stateStyles = document.createElement('style');
  stateStyles.textContent = stateRules.map(({rule}) => rule.cssText).join('\n');
  document.head.appendChild(stateStyles);
  return () => {
    stateRules.forEach(({rule, selector}) => {
      rule.selectorText = selector;
    });
    stateStyles.remove();
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
      position: 'absolute',
      right: '4px',
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

test.each([INITIAL_UI_STATE.mapControls, legacyMapControls, enabledMapControls])(
  'default/legacy controls can opt in, close and reopen without deleting bookmarks: %p',
  initialControls => {
    const commit = jest.fn();
    const visibility = jest.fn();
    function Harness() {
      const [uiState, setUiState] = React.useState({
        ...INITIAL_UI_STATE,
        mapControls: initialControls
      });
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
    if (initialControls.cameraBookmarks?.show !== true) {
      expect(toggle).not.toBeChecked();
      expect(screen.queryByRole('navigation', {name: 'Bookmarks'})).toBeNull();
      fireEvent.click(toggle);
      expect(visibility).toHaveBeenLastCalledWith('cameraBookmarks', true);
    }
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
  }
);

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
  expect(move).toHaveTextContent('Bookmarks');
  expect(move.closest('.map-control__panel-header')).not.toBeNull();
  expect(move.closest('.draggable-legend')?.querySelector('.legend-move-handle')).toBeNull();
  expect(screen.getAllByLabelText('Resize Bookmarks')).toHaveLength(2);
  expect(move.closest('.draggable-legend')).toHaveStyle({right: '80px', top: '40px'});
});

test.each([
  ['mapLegend', 'legend'],
  ['cameraBookmarks', 'Bookmarks']
])('matches the top resize surface at the bottom edge for %s', (controlId, label) => {
  const MapControlPanel = MapControlPanelFactory();
  const activeColor = '#345678';
  renderWithTheme(
    <ThemeProvider theme={{...theme, activeColor}}>
      <DraggableLegend
        controlId={controlId}
        label={label}
        isSidePanelShown={false}
        mapControls={enabledMapControls}
        setMapControlSettings={jest.fn()}
        mapState={INITIAL_MAP_STATE}
      >
        <MapControlPanel header="header.layerLegend">
          <div>Scrollable panel content</div>
        </MapControlPanel>
      </DraggableLegend>
    </ThemeProvider>
  );
  const [top, bottom] = screen.getAllByRole('button', {name: `Resize ${label}`});
  const panel = bottom.closest('.draggable-legend') as HTMLElement;
  const topSurface = top.parentElement;
  const content = panel.querySelector('.map-control__panel-content');
  const restoreStyles = emulatePointerStyles();
  try {
    for (const handle of [top, bottom]) {
      expect(handle).toHaveStyle({width: '32px', height: '12px', cursor: 'ns-resize'});
      expect(handle.querySelector('svg')).toHaveAttribute('height', '12px');
      expect(handle).toHaveAttribute('tabindex', '0');
    }
    expect(topSurface).toHaveStyle({
      backgroundColor: activeColor,
      borderRadius: '4px',
      height: '12px',
      top: '0px',
      transform: 'translate(-50%, -50%)'
    });
    expect(bottom).toHaveStyle({
      backgroundColor: activeColor,
      borderRadius: '4px',
      bottom: '0px',
      left: '50%',
      transform: 'translate(-50%, 50%)',
      opacity: '0',
      pointerEvents: 'none'
    });
    expect(bottom.closest('.map-control__panel-content')).toBeNull();
    expect(content).toHaveStyle({minHeight: '100px', overflowY: 'auto'});
    expect(screen.getByRole('button', {name: `Move ${label}`})).toHaveStyle({cursor: 'move'});

    panel.setAttribute('data-test-hover', '');
    expect(bottom).toHaveStyle({opacity: '1', pointerEvents: 'auto'});
    expect(topSurface).toHaveStyle({opacity: '1'});
    panel.removeAttribute('data-test-hover');
    expect(bottom).toHaveStyle({opacity: '0', pointerEvents: 'none'});
    bottom.focus();
    panel.setAttribute('data-test-focus-within', '');
    expect(bottom).toHaveFocus();
    expect(bottom).toHaveStyle({opacity: '1', pointerEvents: 'auto'});
  } finally {
    restoreStyles();
  }
});

function setupFloatingPanel(controlId: string, label: string) {
  const MapControlPanel = MapControlPanelFactory();
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
  const close = jest.fn();
  const pin = jest.fn();
  const contentAction = jest.fn();
  renderWithTheme(
    <DraggableLegend
      controlId={controlId}
      label={label}
      isSidePanelShown={false}
      mapControls={enabledMapControls}
      setMapControlSettings={settings}
      mapState={{...INITIAL_MAP_STATE, width: 1000, height: 800}}
    >
      <MapControlPanel
        header={controlId === 'mapLegend' ? 'header.layerLegend' : 'camera.bookmarks'}
        onClick={close}
        onPinClick={pin}
        pinnable
      >
        <button onClick={contentAction}>Content action</button>
      </MapControlPanel>
    </DraggableLegend>,
    {container: root}
  );
  const move = screen.getByRole('button', {name: `Move ${label}`});
  const panel = move.closest('.draggable-legend') as HTMLElement;
  panel.getBoundingClientRect = () => {
    const translation = /translate3d\(([-\d.]+)px, ([-\d.]+)px/.exec(panel.style.transform);
    const x = 600 + Number(translation?.[1] || 0);
    const y = 40 + Number(translation?.[2] || 0);
    return {
      ...rect,
      x,
      y,
      left: x,
      top: y,
      width: 300,
      height: 214,
      right: x + 300,
      bottom: y + 214
    };
  };
  Object.defineProperty(panel.querySelector('.map-control__panel-content'), 'offsetHeight', {
    value: 180
  });
  screen.getAllByRole('button', {name: `Resize ${label}`}).forEach((handle, index) => {
    const y = index === 0 ? 34 : 248;
    handle.getBoundingClientRect = () => ({
      ...rect,
      x: 734,
      y,
      left: 734,
      top: y,
      width: 32,
      height: 12,
      right: 766,
      bottom: y + 12
    });
  });
  return {move, panel, settings, close, pin, contentAction};
}

async function waitForPointerClickRelease() {
  // dnd-kit briefly suppresses document clicks after pointer drops; let it clean up
  // before the next test exercises unrelated click actions.
  const clickReleased = jest.fn();
  document.addEventListener('click', clickReleased, {once: true});
  await waitFor(() => {
    fireEvent.click(document);
    expect(clickReleased).toHaveBeenCalledTimes(1);
  });
}

test.each([
  ['mapLegend', 'legend'],
  ['cameraBookmarks', 'Bookmarks']
])('moves %s from its title with pointer and keyboard', async (controlId, label) => {
  const {move, panel, settings} = setupFloatingPanel(controlId, label);
  expect(move).toHaveStyle({flex: '1', height: '32px', cursor: 'move'});
  // JSDOM does not expose touch-action in computed styles; inspect its emitted rule.
  const titleRules = Array.from(document.styleSheets)
    .flatMap(sheet => Array.from(sheet.cssRules))
    .filter((rule): rule is CSSStyleRule => rule.type === CSSRule.STYLE_RULE)
    .filter(rule => move.matches(rule.selectorText));
  expect(titleRules.some(rule => rule.style.getPropertyValue('touch-action') === 'none')).toBe(
    true
  );
  expect(move).toHaveAttribute('tabindex', '0');
  expect(panel.querySelector('.legend-top-handles')?.children).toHaveLength(1);
  expect(move.querySelector('.close-map-control-item')).toBeNull();
  fireEvent.pointerDown(move, {button: 0, clientX: 650, clientY: 55});
  await waitFor(() => expect(move).toHaveAttribute('aria-pressed', 'true'));
  fireEvent.pointerMove(document, {clientX: 675, clientY: 80});
  await waitFor(() => expect(panel).toHaveStyle({transform: 'translate3d(25px, 25px, 0)'}));
  fireEvent.pointerUp(document);
  await waitFor(() => expect(move).not.toHaveAttribute('aria-pressed', 'true'));
  expect(settings).toHaveBeenLastCalledWith(controlId, {
    position: {x: 75, y: 65, anchorX: 'right', anchorY: 'top'}
  });

  settings.mockClear();
  move.focus();
  fireEvent.keyDown(move, {code: 'Space'});
  await waitFor(() => expect(move).toHaveAttribute('aria-pressed', 'true'));
  fireEvent.keyDown(document, {code: 'ArrowRight'});
  await waitFor(() => expect(panel).toHaveStyle({transform: 'translate3d(25px, 0px, 0)'}));
  fireEvent.keyDown(document, {code: 'Space'});
  await waitFor(() => expect(move).not.toHaveAttribute('aria-pressed', 'true'));
  expect(move).toHaveFocus();
  expect(settings).toHaveBeenLastCalledWith(controlId, {
    position: {x: 75, y: 40, anchorX: 'right', anchorY: 'top'}
  });
  expect(
    settings.mock.calls.every(([id, value]) => id === controlId && !('contentHeight' in value))
  ).toBe(true);
  await waitForPointerClickRelease();
});

test.each([
  ['mapLegend', 'legend'],
  ['cameraBookmarks', 'Bookmarks']
])('keeps %s controls and resizing separate from title dragging', async (controlId, label) => {
  const {move, panel, settings, close, pin, contentAction} = setupFloatingPanel(controlId, label);
  const header = move.closest('.map-control__panel-header') as HTMLElement;
  for (const target of [
    header.querySelector('.close-map-control-item'),
    header.querySelector('.pin-map-control-item'),
    screen.getByRole('button', {name: 'Content action'}),
    panel.querySelector('.map-control__panel-content')
  ]) {
    expect(target).not.toBeNull();
    fireEvent.pointerDown(target as Element, {button: 0, clientX: 650, clientY: 55});
    fireEvent.pointerMove(document, {clientX: 675, clientY: 80});
    fireEvent.pointerUp(document);
    fireEvent.click(target as Element);
    fireEvent.keyDown(target as Element, {code: 'Space'});
    expect(move).not.toHaveAttribute('aria-pressed', 'true');
  }
  expect(close).toHaveBeenCalledTimes(1);
  expect(pin).toHaveBeenCalledTimes(1);
  expect(contentAction).toHaveBeenCalledTimes(1);
  expect(settings).not.toHaveBeenCalled();

  const handles = screen.getAllByRole('button', {name: `Resize ${label}`});
  for (const [index, handle] of handles.entries()) {
    settings.mockClear();
    handle.focus();
    fireEvent.keyDown(handle, {code: 'Space'});
    await waitFor(() => expect(handle).toHaveAttribute('aria-pressed', 'true'));
    expect(move).not.toHaveAttribute('aria-pressed', 'true');
    fireEvent.keyDown(document, {code: index === 0 ? 'ArrowUp' : 'ArrowDown'});
    await waitFor(() =>
      expect(settings).toHaveBeenCalledWith(
        controlId,
        expect.objectContaining({contentHeight: 205})
      )
    );
    expect(panel.style.transform).toBe('');
    fireEvent.keyDown(document, {code: 'Space'});
    await waitFor(() => expect(handle).not.toHaveAttribute('aria-pressed', 'true'));

    settings.mockClear();
    const pointerY = handle.getBoundingClientRect().top + 6;
    fireEvent.pointerDown(handle, {button: 0, clientX: 750, clientY: pointerY});
    await waitFor(() => expect(handle).toHaveAttribute('aria-pressed', 'true'));
    fireEvent.pointerMove(document, {
      clientX: 750,
      clientY: pointerY + (index === 0 ? -20 : 20)
    });
    await waitFor(() =>
      expect(settings).toHaveBeenCalledWith(
        controlId,
        expect.objectContaining({contentHeight: 200})
      )
    );
    expect(move).not.toHaveAttribute('aria-pressed', 'true');
    expect(panel.style.transform).toBe('');
    fireEvent.pointerUp(document);
    await waitFor(() => expect(handle).not.toHaveAttribute('aria-pressed', 'true'));
  }
  await waitForPointerClickRelease();
});

test.each([false, true])('keeps ordinary and export headers static (export=%s)', isExport => {
  const MapControlPanel = MapControlPanelFactory();
  renderWithTheme(<MapControlPanel header="header.layerLegend" isExport={isExport} />);
  expect(screen.queryByRole('button', {name: /Move /})).toBeNull();
  expect(document.querySelector('.map-control__panel-drag-title')).toBeNull();
});

test('bookmark copy, navigation and close do not activate title dragging', () => {
  const {updateMap, visibility, settings} = setup();
  const move = screen.getByRole('button', {name: 'Move Bookmarks'});
  const copyButton = screen.getByRole('button', {name: 'Copy coordinates: Home'});
  const navigate = screen.getByRole('button', {name: 'Home'});
  const close = move.parentElement?.querySelector('.close-map-control-item') as Element;
  for (const target of [copyButton, navigate, close]) {
    fireEvent.pointerDown(target, {button: 0, clientX: 20, clientY: 20});
    fireEvent.pointerMove(document, {clientX: 40, clientY: 40});
    fireEvent.pointerUp(document);
    fireEvent.click(target);
    expect(move).not.toHaveAttribute('aria-pressed', 'true');
  }
  expect(copy).toHaveBeenCalledWith('20.987654, 10.123457');
  expect(updateMap).toHaveBeenCalledTimes(1);
  expect(visibility).toHaveBeenCalledWith('cameraBookmarks', false);
  expect(settings).not.toHaveBeenCalled();
});

test.each([
  {isExport: true},
  {mapState: {...INITIAL_MAP_STATE, isSplit: true}},
  {mapState: {...INITIAL_MAP_STATE, globe: {...INITIAL_MAP_STATE.globe!, enabled: true}}},
  {bookmarks: []},
  {mapControls: {cameraBookmarks: {show: false, active: true}}},
  {mapControls: INITIAL_UI_STATE.mapControls},
  {mapControls: undefined},
  {mapControls: legacyMapControls},
  {mapControls: {cameraBookmarks: {active: true}}}
])('hides the panel for unavailable or disabled views: %p', props => {
  setup(props);
  expect(screen.queryByRole('navigation')).toBeNull();
});

test.each(['top', 'bottom'])('keyboard %s resize stops at one bookmark height', async edge => {
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
          mapControls={enabledMapControls}
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
  expect(panel.querySelector('.map-control__panel-content')).toHaveStyle({minHeight: '48px'});
  const handle = screen.getAllByRole('button', {name: 'Resize Bookmarks'})[edge === 'top' ? 0 : 1];
  const handleY = edge === 'top' ? 34 : 248;
  handle.getBoundingClientRect = () => ({
    ...rect,
    x: 734,
    y: handleY,
    left: 734,
    top: handleY,
    width: 32,
    height: 12,
    right: 766,
    bottom: handleY + 12
  });
  handle.focus();
  fireEvent.keyDown(handle, {code: 'Space'});
  await waitFor(() => expect(handle).toHaveAttribute('aria-pressed', 'true'));
  fireEvent.keyDown(document, {code: edge === 'top' ? 'ArrowUp' : 'ArrowDown'});
  await waitFor(() =>
    expect(settings).toHaveBeenCalledWith(
      'cameraBookmarks',
      expect.objectContaining({contentHeight: 205})
    )
  );
  fireEvent.keyDown(document, {code: 'Space'});
  await waitFor(() => expect(handle).not.toHaveAttribute('aria-pressed', 'true'));
  fireEvent.keyDown(handle, {code: 'Space'});
  await waitFor(() => expect(handle).toHaveAttribute('aria-pressed', 'true'));
  for (let step = 0; step < 6; step++) {
    fireEvent.keyDown(document, {code: edge === 'top' ? 'ArrowDown' : 'ArrowUp'});
  }
  await waitFor(() =>
    expect(settings).toHaveBeenCalledWith(
      'cameraBookmarks',
      expect.objectContaining({contentHeight: 48})
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
            mapControls={enabledMapControls}
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
