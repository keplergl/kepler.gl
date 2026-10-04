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
  contextMenuTargetIsFeatureUi,
  coordinateMenuFromClick,
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
    expect(menu).toEqual({x: 20, y: 20, text: '37.700000, -122.400000'});
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

  test('leaves the menu open when the clipboard write fails', () => {
    copyMock.mockReturnValue(false);
    const {onClose} = renderMenu();

    fireEvent.click(screen.getByRole('menuitem', {name: 'Copy coordinates'}));

    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('menuitem', {name: 'Copy coordinates'})).toBeTruthy();
  });
});
