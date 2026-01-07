// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {renderHook} from '@testing-library/react';
import {useLegendPosition} from '@kepler.gl/components';

const THEME = {
  sidePanel: {width: 100}
};

describe('useLegendPosition', () => {
  beforeEach(() => {
    document.body.innerHTML = `
    <div
      class="kepler-gl"
      style="position: absolute; width: 800px; height: 600px"
    >
      <div id="map-legend">
        <div id="map-legend-content"/>
      </div>
    </div>`;
  });

  test('should return default position', () => {
    const {
      result: {
        current: {positionStyles}
      }
    } = renderHook(() =>
      useLegendPosition({
        legendContentRef: {current: document.querySelector('#map-legend-content')},
        isSidePanelShown: false,
        settings: {},
        onChangeSettings: jest.fn(),
        theme: THEME
      })
    );
    expect(positionStyles).toEqual({right: 10, bottom: 30});
  });

  test('should respect position from settings', () => {
    const {
      result: {
        current: {positionStyles}
      }
    } = renderHook(() =>
      useLegendPosition({
        legendContentRef: {current: document.querySelector('#map-legend-content')},
        isSidePanelShown: false,
        settings: {
          position: {x: 100, y: 200, anchorX: 'left', anchorY: 'top'}
        },
        onChangeSettings: jest.fn(),
        theme: THEME
      })
    );
    expect(positionStyles).toEqual({left: 100, top: 200});
  });

  test('should calculate maxContentHeight from mapRootDimensions', () => {
    const {
      result: {
        current: {maxContentHeight}
      }
    } = renderHook(() =>
      useLegendPosition({
        legendContentRef: {current: document.querySelector('#map-legend-content')},
        isSidePanelShown: false,
        settings: {},
        onChangeSettings: jest.fn(),
        theme: THEME,
        mapRootDimensions: {width: 800, height: 600}
      })
    );
    // maxContentHeight = height - MARGIN.top - MARGIN.bottom - MAP_CONTROL_HEADER_FULL_HEIGHT
    // = 600 - 10 - 30 - 34 = 526
    expect(maxContentHeight).toBe(526);
  });

  test('should return undefined maxContentHeight when mapRootDimensions not provided', () => {
    const {
      result: {
        current: {maxContentHeight}
      }
    } = renderHook(() =>
      useLegendPosition({
        legendContentRef: {current: document.querySelector('#map-legend-content')},
        isSidePanelShown: false,
        settings: {},
        onChangeSettings: jest.fn(),
        theme: THEME
      })
    );
    expect(maxContentHeight).toBeUndefined();
  });

  test('should clamp position when legend exceeds map bounds', () => {
    const onChangeSettings = jest.fn();
    const legendContent = document.querySelector('#map-legend-content');
    // Mock getBoundingClientRect to simulate legend dimensions
    legendContent.getBoundingClientRect = jest.fn(() => ({
      width: 200,
      height: 300,
      top: 0,
      left: 0,
      bottom: 300,
      right: 200
    }));

    renderHook(() =>
      useLegendPosition({
        legendContentRef: {current: legendContent},
        isSidePanelShown: false,
        settings: {
          position: {x: 1000, y: 1000, anchorX: 'left', anchorY: 'top'},
          contentHeight: 300
        },
        onChangeSettings,
        theme: THEME,
        mapRootDimensions: {width: 800, height: 600}
      })
    );

    // Should clamp position to stay within bounds
    expect(onChangeSettings).toHaveBeenCalled();
    const lastCall = onChangeSettings.mock.calls[onChangeSettings.mock.calls.length - 1][0];
    expect(lastCall.position).toBeDefined();
    // Position should be clamped within map bounds
    if (lastCall.position) {
      expect(lastCall.position.x).toBeLessThanOrEqual(800 - 200 - 10); // width - legendWidth - margin
      expect(lastCall.position.y).toBeLessThanOrEqual(600 - 300 - 30); // height - legendHeight - margin
    }
  });

  test('should clamp contentHeight when it exceeds maxContentHeight', () => {
    const onChangeSettings = jest.fn();
    const legendContent = document.querySelector('#map-legend-content');
    legendContent.getBoundingClientRect = jest.fn(() => ({
      width: 200,
      height: 300,
      top: 0,
      left: 0,
      bottom: 300,
      right: 200
    }));

    renderHook(() =>
      useLegendPosition({
        legendContentRef: {current: legendContent},
        isSidePanelShown: false,
        settings: {
          position: {x: 100, y: 100, anchorX: 'left', anchorY: 'top'},
          contentHeight: 1000 // Exceeds maxContentHeight
        },
        onChangeSettings,
        theme: THEME,
        mapRootDimensions: {width: 800, height: 600}
      })
    );

    // Should clamp contentHeight to maxContentHeight (526)
    expect(onChangeSettings).toHaveBeenCalled();
    const callsWithContentHeight = onChangeSettings.mock.calls.filter(
      call => call[0].contentHeight !== undefined
    );
    if (callsWithContentHeight.length > 0) {
      expect(
        callsWithContentHeight[callsWithContentHeight.length - 1][0].contentHeight
      ).toBeLessThanOrEqual(526);
    }
  });
});
