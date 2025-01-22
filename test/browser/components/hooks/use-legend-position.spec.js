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
});
