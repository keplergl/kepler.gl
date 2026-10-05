// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, fireEvent, render, screen} from '@testing-library/react';
import copy from 'copy-to-clipboard';
import {ThemeProvider} from 'styled-components';
import {IntlProvider} from 'react-intl';

import {theme} from '@kepler.gl/styles';
import {messages} from '@kepler.gl/localization';

import {formatMapCoordinate} from './coordinate-info';
import MapCoordinateMenu, {
  annotationContextMenuItems,
  contextMenuTargetIsFeatureUi,
  contextMenuTargetIsMapOverlay,
  coordinateMenuFromClick,
  coordinateMenuHiddenByTooltip,
  isFeatureActionPanelOpen,
  isRightDrag
} from './map-coordinate-menu';

jest.mock('copy-to-clipboard', () => jest.fn(() => true));

const copyMock = copy as jest.MockedFunction<typeof copy>;

function renderMenu(text = '37.774929, -122.419418') {
  const onClose = jest.fn();
  render(
    <ThemeProvider theme={theme}>
      <IntlProvider locale="en" messages={messages.en}>
        <MapCoordinateMenu x={20} y={30} text={text} onClose={onClose} />
      </IntlProvider>
    </ThemeProvider>
  );
  return {onClose};
}

describe('formatMapCoordinate', () => {
  test('writes latitude first at 6 decimal places', () => {
    expect(formatMapCoordinate([-122.4194183, 37.7749295])).toBe('37.774930, -122.419418');
  });

  test('rejects missing or non-finite values', () => {
    expect(formatMapCoordinate(null)).toBeNull();
    expect(formatMapCoordinate([1])).toBeNull();
    expect(formatMapCoordinate([Number.NaN, 1])).toBeNull();
  });
});

describe('coordinateMenuFromClick', () => {
  const bounds = {left: 10, top: 20, width: 100, height: 80};

  test('unprojects a click inside the map', () => {
    const menu = coordinateMenuFromClick(30, 40, bounds, point => {
      expect(point).toEqual([20, 20]);
      return [-122.4, 37.7];
    });
    expect(menu).toEqual({
      x: 20,
      y: 20,
      text: '37.700000, -122.400000',
      coordinate: [-122.4, 37.7]
    });
  });

  test('ignores clicks outside the container and failed projections', () => {
    expect(coordinateMenuFromClick(0, 40, bounds, () => [-122, 37])).toBeNull();
    expect(coordinateMenuFromClick(30, 40, bounds, () => null)).toBeNull();
    expect(
      coordinateMenuFromClick(30, 40, bounds, () => {
        throw new Error('not invertible');
      })
    ).toBeNull();
  });
});

describe('isRightDrag', () => {
  test('treats a stationary right-click as a click', () => {
    expect(isRightDrag(null, 10, 10)).toBe(false);
    expect(isRightDrag({x: 10, y: 10}, 12, 11)).toBe(false);
  });

  test('treats movement past the threshold as a drag', () => {
    expect(isRightDrag({x: 0, y: 0}, 8, 0)).toBe(true);
  });
});

describe('isFeatureActionPanelOpen', () => {
  const feature = {type: 'Feature'};

  test('is open when this map right-clicked a polygon or filter', () => {
    expect(
      isFeatureActionPanelOpen(
        {selectedFeature: feature, selectionContext: {rightClick: true, mapIndex: 0}},
        0
      )
    ).toBe(true);
  });

  test('stays closed for another map, a left click, or no selection', () => {
    expect(
      isFeatureActionPanelOpen(
        {selectedFeature: feature, selectionContext: {rightClick: true, mapIndex: 1}},
        0
      )
    ).toBe(false);
    expect(
      isFeatureActionPanelOpen(
        {selectedFeature: feature, selectionContext: {rightClick: false, mapIndex: 0}},
        0
      )
    ).toBe(false);
    expect(isFeatureActionPanelOpen({selectedFeature: null}, 0)).toBe(false);
  });
});

describe('coordinateMenuHiddenByTooltip', () => {
  test('hides the menu when a tooltip can describe the feature under the cursor', () => {
    expect(coordinateMenuHiddenByTooltip(true, 'point-layer')).toBe(true);
  });

  test('keeps the menu when tooltips are off or the cursor is on empty map', () => {
    expect(coordinateMenuHiddenByTooltip(false, 'point-layer')).toBe(false);
    expect(coordinateMenuHiddenByTooltip(true, null)).toBe(false);
  });
});

describe('annotationContextMenuItems', () => {
  test('offers add on an editable map and hide once annotations exist', () => {
    expect(
      annotationContextMenuItems({annotationsEnabled: true, readOnly: false, annotationCount: 0})
    ).toEqual({showAddAnnotation: true, showAnnotationToggle: false});
    expect(
      annotationContextMenuItems({annotationsEnabled: true, readOnly: false, annotationCount: 2})
    ).toEqual({showAddAnnotation: true, showAnnotationToggle: true});
  });

  test('hides add on a read-only map and both actions when annotations are off', () => {
    expect(
      annotationContextMenuItems({annotationsEnabled: true, readOnly: true, annotationCount: 1})
    ).toEqual({showAddAnnotation: false, showAnnotationToggle: true});
    expect(annotationContextMenuItems({annotationsEnabled: false, annotationCount: 3})).toEqual({
      showAddAnnotation: false,
      showAnnotationToggle: false
    });
  });

  test('keeps show available while annotations are hidden, even with none left', () => {
    expect(
      annotationContextMenuItems({
        annotationsEnabled: true,
        annotationCount: 0,
        annotationsVisible: false
      })
    ).toEqual({showAddAnnotation: true, showAnnotationToggle: true});
    expect(
      annotationContextMenuItems({
        annotationsEnabled: false,
        annotationCount: 0,
        annotationsVisible: false
      })
    ).toEqual({showAddAnnotation: false, showAnnotationToggle: false});
  });
});

describe('contextMenuTargetIsMapOverlay', () => {
  test('matches map controls, scale, and attribution but not the map surface', () => {
    document.body.innerHTML =
      '<div class="map-control"><button id="zoom">Zoom in</button></div>' +
      '<div class="map-scale" id="scale">1 km</div>' +
      '<div class="maplibre-attribution-container"><a id="attrib">© kepler.gl</a></div>' +
      '<div id="map"></div>';
    expect(contextMenuTargetIsMapOverlay(document.getElementById('zoom'))).toBe(true);
    expect(contextMenuTargetIsMapOverlay(document.getElementById('scale'))).toBe(true);
    expect(contextMenuTargetIsMapOverlay(document.getElementById('attrib'))).toBe(true);
    expect(contextMenuTargetIsMapOverlay(document.getElementById('map'))).toBe(false);
    expect(contextMenuTargetIsMapOverlay(null)).toBe(false);
  });
});

describe('contextMenuTargetIsFeatureUi', () => {
  test('matches the feature panel and polygon-filter badge', () => {
    document.body.innerHTML =
      '<div class="feature-action-panel"><button id="filter">Filter layers</button></div>' +
      '<div class="editor-filter-badges"><button id="badge"></button></div>' +
      '<div id="map"></div>';
    expect(contextMenuTargetIsFeatureUi(document.getElementById('filter'))).toBe(true);
    expect(contextMenuTargetIsFeatureUi(document.getElementById('badge'))).toBe(true);
    expect(contextMenuTargetIsFeatureUi(document.getElementById('map'))).toBe(false);
    expect(contextMenuTargetIsFeatureUi(null)).toBe(false);
  });
});

describe('MapCoordinateMenu', () => {
  beforeEach(() => {
    copyMock.mockClear();
    copyMock.mockReturnValue(true);
  });

  test('copies lat, lng and then closes', () => {
    jest.useFakeTimers();
    const {onClose} = renderMenu();

    fireEvent.click(screen.getByRole('menuitem', {name: 'Copy coordinates'}));

    expect(copyMock).toHaveBeenCalledWith('37.774929, -122.419418');
    expect(screen.getByRole('menuitem', {name: 'Copied'})).toBeTruthy();
    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(700);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  test('adds an annotation and hides annotations from the same menu', () => {
    const onClose = jest.fn();
    const onAddAnnotation = jest.fn();
    const onToggleAnnotations = jest.fn();
    render(
      <ThemeProvider theme={theme}>
        <IntlProvider locale="en" messages={messages.en}>
          <MapCoordinateMenu
            x={20}
            y={30}
            text="37.774929, -122.419418"
            onClose={onClose}
            showAddAnnotation={true}
            showAnnotationToggle={true}
            annotationsVisible={true}
            onAddAnnotation={onAddAnnotation}
            onToggleAnnotations={onToggleAnnotations}
          />
        </IntlProvider>
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('menuitem', {name: 'Add Annotation'}));
    expect(onAddAnnotation).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('menuitem', {name: 'Hide Annotations'}));
    expect(onToggleAnnotations).toHaveBeenCalledTimes(1);
  });

  test('disables add while annotations are hidden and offers show', () => {
    const onAddAnnotation = jest.fn();
    render(
      <ThemeProvider theme={theme}>
        <IntlProvider locale="en" messages={messages.en}>
          <MapCoordinateMenu
            x={20}
            y={30}
            text={null}
            showCopy={false}
            onClose={jest.fn()}
            showAddAnnotation={true}
            addAnnotationDisabled={true}
            showAnnotationToggle={true}
            annotationsVisible={false}
            onAddAnnotation={onAddAnnotation}
          />
        </IntlProvider>
      </ThemeProvider>
    );

    const add = screen.getByRole('menuitem', {name: 'Add Annotation'});
    expect(add).toHaveProperty('disabled', true);
    fireEvent.click(add);
    expect(onAddAnnotation).not.toHaveBeenCalled();
    expect(screen.getByRole('menuitem', {name: 'Show Annotations'})).toBeTruthy();
    expect(screen.queryByRole('menuitem', {name: 'Copy coordinates'})).toBeNull();
  });

  test('leaves the menu open when the clipboard write fails', () => {
    copyMock.mockReturnValue(false);
    const {onClose} = renderMenu();

    fireEvent.click(screen.getByRole('menuitem', {name: 'Copy coordinates'}));

    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('menuitem', {name: 'Copy coordinates'})).toBeTruthy();
  });
});
