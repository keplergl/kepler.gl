// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {renderHook, act} from '@testing-library/react';
import {useLegendPosition} from '@kepler.gl/components';
import {getApplicationConfig, initApplicationConfig} from '@kepler.gl/utils';

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
        <div id="map-legend-content">
          <div class="map-control__panel-content"/>
        </div>
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

  test('should calculate maxContentHeight from mapWidth and mapHeight', () => {
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
        mapHeight: 600,
        mapWidth: 800
      })
    );
    // maxContentHeight = height - MARGIN.top - MARGIN.bottom - MAP_CONTROL_HEADER_FULL_HEIGHT
    // = 600 - 10 - 30 - 34 = 526
    expect(maxContentHeight).toBe(526);
  });

  test('should return undefined maxContentHeight when mapWidth and mapHeight not provided', () => {
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
        mapHeight: 600,
        mapWidth: 800
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

  describe.each(['top', 'bottom'])('%s-edge minimum', edge => {
    test.each([
      ['48px', 48],
      ['100px', 100],
      ['auto', 100],
      ['0px', 100]
    ])('uses the panel CSS minimum %s with a safe fallback', (minHeight, expected) => {
      const onChangeSettings = jest.fn();
      const legendContent = setupResizeFixture({
        contentHeight: 150,
        legendRect: {top: 100, left: 20, bottom: 284, right: 210},
        rootRect: {top: 0, left: 0, bottom: 600, right: 800}
      });
      const content = legendContent.querySelector('.map-control__panel-content');
      content.style.minHeight = minHeight;
      const {result} = renderHook(() =>
        useLegendPosition({
          legendContentRef: {current: legendContent},
          isSidePanelShown: false,
          settings: {
            position: {x: 20, y: 100, anchorX: 'left', anchorY: 'top'},
            contentHeight: 150
          },
          onChangeSettings,
          theme: THEME
        })
      );
      act(() => {
        result.current.startResize();
        result.current.resize(edge === 'top' ? 500 : -500, edge);
      });
      expect(onChangeSettings).toHaveBeenLastCalledWith({
        contentHeight: expected,
        ...(edge === 'top'
          ? {position: {x: 20, y: 250 - expected, anchorX: 'left', anchorY: 'top'}}
          : {})
      });
      // A subsequent gesture reads the panel's current layout again.
      content.style.minHeight = '64px';
      act(() => {
        result.current.startResize();
        result.current.resize(edge === 'top' ? 500 : -500, edge);
      });
      expect(onChangeSettings).toHaveBeenLastCalledWith(
        expect.objectContaining({contentHeight: 64})
      );
    });
  });

  test('top-edge resize grows a bottom-anchored legend without moving it', () => {
    const onChangeSettings = jest.fn();
    const legendContent = setupResizeFixture({
      contentHeight: 150,
      legendRect: {top: 386, left: 600, bottom: 570, right: 790},
      rootRect: {top: 0, left: 0, bottom: 600, right: 800}
    });

    const {result} = renderHook(() =>
      useLegendPosition({
        legendContentRef: {current: legendContent},
        isSidePanelShown: false,
        settings: {
          position: {x: 10, y: 30, anchorX: 'right', anchorY: 'bottom'},
          contentHeight: 150
        },
        onChangeSettings,
        theme: THEME
      })
    );

    act(() => {
      result.current.startResize();
      result.current.resize(-40, 'top');
    });

    expect(onChangeSettings).toHaveBeenCalledWith({contentHeight: 190});
  });

  test('bottom-edge resize cannot grow a legend already at the bottom', () => {
    const onChangeSettings = jest.fn();
    const legendContent = setupResizeFixture({
      contentHeight: 150,
      legendRect: {top: 386, left: 600, bottom: 570, right: 790},
      rootRect: {top: 0, left: 0, bottom: 600, right: 800}
    });

    const {result} = renderHook(() =>
      useLegendPosition({
        legendContentRef: {current: legendContent},
        isSidePanelShown: false,
        settings: {
          position: {x: 10, y: 30, anchorX: 'right', anchorY: 'bottom'},
          contentHeight: 150
        },
        onChangeSettings,
        theme: THEME
      })
    );

    act(() => {
      result.current.startResize();
      result.current.resize(40, 'bottom');
    });

    expect(onChangeSettings).toHaveBeenCalledWith({contentHeight: 150});
  });

  test('top-edge resize keeps the bottom fixed when top-anchored', () => {
    const onChangeSettings = jest.fn();
    const legendContent = setupResizeFixture({
      contentHeight: 150,
      legendRect: {top: 100, left: 20, bottom: 284, right: 210},
      rootRect: {top: 0, left: 0, bottom: 600, right: 800}
    });

    const {result} = renderHook(() =>
      useLegendPosition({
        legendContentRef: {current: legendContent},
        isSidePanelShown: false,
        settings: {
          position: {x: 20, y: 100, anchorX: 'left', anchorY: 'top'},
          contentHeight: 150
        },
        onChangeSettings,
        theme: THEME
      })
    );

    act(() => {
      result.current.startResize();
      result.current.resize(-40, 'top');
    });

    expect(onChangeSettings).toHaveBeenCalledWith({
      contentHeight: 190,
      position: {x: 20, y: 60, anchorX: 'left', anchorY: 'top'}
    });
  });
  describe('resize snapping', () => {
    const originalEnabled = getApplicationConfig().enableFloatingWidgetSnapping;
    beforeEach(() => initApplicationConfig({enableFloatingWidgetSnapping: true}));
    afterEach(() => initApplicationConfig({enableFloatingWidgetSnapping: originalEnabled}));

    describe.each(['top', 'bottom'])('%s edge', edge => {
      test.each([
        ['top', false],
        ['bottom', false],
        ['top', true],
        ['bottom', true]
      ])(
        'aligns with a neighbor, preserves the opposite edge and releases (%s anchor, auto=%s)',
        (anchorY, autoHeight) => {
          const fixture = setupSnappingResize({edge, anchorY, autoHeight});
          const {result, onChangeSettings, settings, applyChange} = fixture;
          const snapsHeight = edge === 'top' ? 172 : 178;
          const shiftsAnchor = edge === anchorY;
          act(() => {
            result.current.startResize();
            result.current.resize(edge === 'top' ? -25 : 25, edge);
          });
          expect(onChangeSettings).toHaveBeenLastCalledWith({
            contentHeight: snapsHeight,
            ...(shiftsAnchor
              ? {position: {...settings.position, y: settings.position.y - (snapsHeight - 150)}}
              : {})
          });

          // Rerender at the snapped geometry, then keep dragging from the original gesture.
          applyChange(onChangeSettings.mock.calls.at(-1)[0]);
          act(() => result.current.resize(edge === 'top' ? -50 : 50, edge));
          expect(onChangeSettings).toHaveBeenLastCalledWith({
            contentHeight: 200,
            ...(shiftsAnchor ? {position: {...settings.position, y: settings.position.y - 50}} : {})
          });
        }
      );

      test.each([
        ['minimum', 102, 98],
        ['maximum', 224, 230]
      ])('does not snap past the %s height', (_limit, proposedHeight, targetHeight) => {
        const {result, onChangeSettings, neighbor} = setupSnappingResize({
          edge,
          anchorY: edge === 'top' ? 'bottom' : 'top',
          mapHeight: 300
        });
        const level = edge === 'top' ? 386 - 36 - targetHeight : 200 + 36 + targetHeight;
        neighbor.getBoundingClientRect = () =>
          rect({
            left: 398,
            right: 498,
            top: edge === 'top' ? level : level - 250,
            bottom: edge === 'top' ? level + 250 : level
          });
        act(() => {
          result.current.startResize();
          result.current.resize((edge === 'top' ? -1 : 1) * (proposedHeight - 150), edge);
        });
        expect(onChangeSettings).toHaveBeenLastCalledWith({contentHeight: proposedHeight});
      });
    });
  });
});

function setupSnappingResize({edge, anchorY, autoHeight = false, mapHeight = 800}) {
  const legendContent = setupResizeFixture({
    contentHeight: 150,
    legendRect: {left: 200, top: 200, right: 390, bottom: 386},
    rootRect: {left: 100, top: 100, right: 1100, bottom: 900}
  });
  const neighbor = document.createElement('div');
  neighbor.className = 'draggable-legend';
  legendContent.closest('.kepler-gl').appendChild(neighbor);
  neighbor.getBoundingClientRect = () => rect({left: 398, top: 178, right: 498, bottom: 414});
  const settings = {
    ...(!autoHeight ? {contentHeight: 150} : {}),
    position: {x: 20, y: anchorY === 'top' ? 100 : 514, anchorX: 'right', anchorY}
  };
  const onChangeSettings = jest.fn();
  const hook = renderHook(
    ({settings: nextSettings}) =>
      useLegendPosition({
        legendContentRef: {current: legendContent},
        isSidePanelShown: false,
        settings: nextSettings,
        onChangeSettings,
        theme: THEME,
        mapHeight,
        mapWidth: 1000
      }),
    {initialProps: {settings}}
  );
  return {
    ...hook,
    settings,
    onChangeSettings,
    neighbor,
    applyChange(next) {
      const top = edge === 'top' ? 386 - 36 - next.contentHeight : 200;
      legendContent.getBoundingClientRect = () =>
        rect({
          left: 200,
          right: 390,
          top,
          bottom: top + 36 + next.contentHeight
        });
      Object.defineProperty(
        legendContent.querySelector('.map-control__panel-content'),
        'offsetHeight',
        {
          configurable: true,
          value: next.contentHeight
        }
      );
      hook.rerender({settings: {...settings, ...next}});
    }
  };
}

function rect(values) {
  return {
    width: values.right - values.left,
    height: values.bottom - values.top,
    x: values.left,
    y: values.top,
    ...values,
    toJSON() {
      return this;
    }
  };
}

function setupResizeFixture({contentHeight, legendRect, rootRect}) {
  const root = document.querySelector('.kepler-gl');
  const legendContent = document.querySelector('#map-legend-content');
  const content = legendContent.querySelector('.map-control__panel-content');
  root.getBoundingClientRect = jest.fn(() => rect(rootRect));
  legendContent.getBoundingClientRect = jest.fn(() => rect(legendRect));
  Object.defineProperty(content, 'offsetHeight', {configurable: true, value: contentHeight});
  return legendContent;
}
