// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {DEFAULT_ANNOTATION_ELEVATION, DEFAULT_MAP_HEIGHT_ELEVATION} from '@kepler.gl/utils';

import React, {useContext} from 'react';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {fireEvent, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {WebMercatorViewport} from '@math.gl/web-mercator';

import {AnnotationKind} from '@kepler.gl/constants';
import {DEFAULT_RULER_STYLE} from '@kepler.gl/utils';
import {Annotation, AnnotationElevation} from '@kepler.gl/types';
import {VisStateActions} from '@kepler.gl/actions';
import {INITIAL_MAP_STATE, INITIAL_VIS_STATE} from '@kepler.gl/reducers';
import {theme} from '@kepler.gl/styles';
import {IntlWrapper, renderWithTheme} from 'test/helpers/component-jest-utils';

import AnnotationManagerFactory from './annotation-panel';
import {MapViewStateContext, MapViewStateContextProvider} from '../map-view-state-context';

const mockStore = configureStore();
const AnnotationManager = AnnotationManagerFactory();

const makeState = (showCustomText: boolean, showDistance: boolean) => ({
  visState: {
    annotations: [
      {
        id: 'ruler-1',
        kind: AnnotationKind.RULER,
        isVisible: true,
        autoSize: true,
        autoSizeY: true,
        anchorPoint: [0, 0],
        endPoint: [1, 0],
        label: 'Measured span',
        lineColor: '#FFFFFF',
        lineWidth: 2,
        textWidth: 100,
        textHeight: 30,
        showCustomText,
        showDistance
      }
    ],
    selectedAnnotationId: 'ruler-1'
  },
  mapState: {longitude: 0, latitude: 0}
});

const originalIntersectionObserver = window.IntersectionObserver;

beforeAll(() => {
  window.IntersectionObserver = class {
    observe() {
      return undefined;
    }
    unobserve() {
      return undefined;
    }
    disconnect() {
      return undefined;
    }
  } as unknown as typeof IntersectionObserver;
});

afterAll(() => {
  window.IntersectionObserver = originalIntersectionObserver;
});

describe('AnnotationManager placement', () => {
  test.each([
    {longitude: -122.34679, latitude: 37.75043},
    {longitude: 0, latitude: 0}
  ])('adds at the live center before Redux catches up: %j', center => {
    const live = {...INITIAL_MAP_STATE, ...center, width: 1000, height: 600};
    const viewport = new WebMercatorViewport(live);
    // The previous camera center is now near the upper-left corner.
    const [longitude, latitude] = viewport.unproject([8, 8]);
    const stale = {...live, longitude, latitude};
    const store = mockStore({visState: INITIAL_VIS_STATE, mapState: stale});
    function PanMap() {
      const {setInternalViewState} = useContext(MapViewStateContext);
      return <button onClick={() => setInternalViewState(live)}>Pan map</button>;
    }
    renderWithTheme(
      <IntlWrapper>
        <Provider store={store}>
          <MapViewStateContextProvider mapState={stale}>
            <PanMap />
            <AnnotationManager />
          </MapViewStateContextProvider>
        </Provider>
      </IntlWrapper>
    );

    fireEvent.click(screen.getByRole('button', {name: 'Pan map'}));
    fireEvent.click(screen.getByText('Add'));

    expect(store.getActions()).toEqual([
      VisStateActions.addAnnotation({anchorPoint: [live.longitude, live.latitude]})
    ]);
    const [x, y] = viewport.project(store.getActions()[0].config.anchorPoint);
    expect(x).toBeCloseTo(500);
    expect(y).toBeCloseTo(300);
  });

  test('uses the first map center when independent split cameras differ', () => {
    const left = {...INITIAL_MAP_STATE, longitude: 10, latitude: 20};
    const right = {...INITIAL_MAP_STATE, longitude: 100, latitude: 30};
    const mapState = {
      ...right,
      isSplit: true,
      isViewportSynced: false,
      splitMapViewports: [left, right]
    };
    const store = mockStore({visState: INITIAL_VIS_STATE, mapState});
    renderWithTheme(
      <IntlWrapper>
        <Provider store={store}>
          <MapViewStateContextProvider mapState={mapState}>
            <AnnotationManager />
          </MapViewStateContextProvider>
        </Provider>
      </IntlWrapper>
    );

    fireEvent.click(screen.getByText('Add'));

    expect(store.getActions()).toEqual([
      VisStateActions.addAnnotation({anchorPoint: [left.longitude, left.latitude]})
    ]);
  });

  test.each(['missing', 'invalid'])('falls back to the Redux center for a %s live camera', kind => {
    const store = mockStore({visState: INITIAL_VIS_STATE, mapState: INITIAL_MAP_STATE});
    renderWithTheme(
      <IntlWrapper>
        <Provider store={store}>
          {kind === 'missing' ? (
            <AnnotationManager />
          ) : (
            <MapViewStateContext.Provider
              value={{
                getInternalViewState: () => ({...INITIAL_MAP_STATE, longitude: NaN}),
                setInternalViewState: jest.fn()
              }}
            >
              <AnnotationManager />
            </MapViewStateContext.Provider>
          )}
        </Provider>
      </IntlWrapper>
    );

    fireEvent.click(screen.getByText('Add'));

    expect(store.getActions()).toEqual([
      VisStateActions.addAnnotation({
        anchorPoint: [INITIAL_MAP_STATE.longitude, INITIAL_MAP_STATE.latitude]
      })
    ]);
  });
});

describe('AnnotationManager ruler settings', () => {
  test.each([
    [true, true],
    [true, false],
    [false, true],
    [false, false]
  ])('renders independent custom text and distance switches (%s, %s)', (customText, distance) => {
    const store = mockStore(makeState(customText, distance));
    renderWithTheme(
      <IntlWrapper>
        <Provider store={store}>
          <AnnotationManager />
        </Provider>
      </IntlWrapper>
    );

    const customTextSwitch = screen.getByRole('checkbox', {name: 'Custom Text'});
    const distanceSwitch = screen.getByRole('checkbox', {name: 'Distance'});

    expect(customTextSwitch).toHaveProperty('checked', customText);
    expect(distanceSwitch).toHaveProperty('checked', distance);
    for (const input of [customTextSwitch, distanceSwitch]) {
      expect(input.closest('label')).toHaveStyle({
        lineHeight: `${theme.switchHeight}px`,
        paddingLeft: `${theme.switchWidth - theme.switchLabelMargin}px`
      });
    }
  });

  test.each([true, false])('toggles each ruler switch independently from %s', checked => {
    const store = mockStore(makeState(checked, checked));
    renderWithTheme(
      <IntlWrapper>
        <Provider store={store}>
          <AnnotationManager />
        </Provider>
      </IntlWrapper>
    );

    fireEvent.click(screen.getByText('Custom Text'));
    fireEvent.click(screen.getByText('Distance'));

    expect(store.getActions()).toEqual([
      VisStateActions.updateAnnotation('ruler-1', {showCustomText: !checked}),
      VisStateActions.updateAnnotation('ruler-1', {showDistance: !checked})
    ]);
  });
});

describe('AnnotationManager type icons', () => {
  test.each([
    [AnnotationKind.TEXT, 'Text', AnnotationKind.POINT, 'Point'],
    [AnnotationKind.POINT, 'Point', AnnotationKind.ARROW, 'Arrow'],
    [AnnotationKind.ARROW, 'Arrow', AnnotationKind.CIRCLE, 'Circle'],
    [AnnotationKind.CIRCLE, 'Circle', AnnotationKind.RULER, 'Ruler'],
    [AnnotationKind.RULER, 'Ruler', AnnotationKind.TEXT, 'Text']
  ] as const)(
    '%s type icon is highlighted and supports switching',
    (kind, label, nextKind, nextLabel) => {
      const state = makeState(true, true);
      Object.assign(state.visState.annotations[0], {kind, armLength: 50, angle: -45});
      const store = mockStore(state);
      renderWithTheme(
        <IntlWrapper>
          <Provider store={store}>
            <AnnotationManager />
          </Provider>
        </IntlWrapper>
      );

      const group = screen.getByRole('group', {name: 'Type'});
      const buttons = within(group).getAllByRole('button');
      expect(buttons.map(button => button.getAttribute('aria-label'))).toEqual([
        'Text',
        'Point',
        'Arrow',
        'Circle',
        'Ruler'
      ]);
      expect(screen.queryByText('Type')).not.toBeInTheDocument();
      expect(group).toHaveStyle({width: '100%', height: theme.inputBoxHeight});
      expect(within(group).getAllByRole('button', {pressed: true})).toEqual([
        within(group).getByRole('button', {name: label})
      ]);
      expect(within(group).getByRole('button', {name: label})).toHaveStyle({
        color: theme.switchTrackBgdActive,
        borderColor: theme.switchTrackBgdActive
      });
      for (const button of buttons) {
        expect(button).toHaveStyle({flex: '1', height: '100%', padding: '0'});
        expect(button).toHaveAttribute('type', 'button');
        expect(button.querySelector('svg')).toBeInTheDocument();
      }

      fireEvent.click(within(group).getByRole('button', {name: nextLabel}));
      expect(store.getActions()).toEqual([
        VisStateActions.updateAnnotation('ruler-1', {kind: nextKind})
      ]);
    }
  );

  test('supports keyboard activation of type icons', async () => {
    const user = userEvent.setup();
    const store = mockStore(makeState(true, true));
    renderWithTheme(
      <IntlWrapper>
        <Provider store={store}>
          <AnnotationManager />
        </Provider>
      </IntlWrapper>
    );

    screen.getByRole('button', {name: 'Text'}).focus();
    await user.keyboard('{Enter}');
    await user.tab();
    expect(screen.getByRole('button', {name: 'Point'})).toHaveFocus();
    await user.keyboard(' ');

    expect(store.getActions()).toEqual([
      VisStateActions.updateAnnotation('ruler-1', {kind: AnnotationKind.TEXT}),
      VisStateActions.updateAnnotation('ruler-1', {kind: AnnotationKind.POINT})
    ]);
  });
});

test('text annotations do not offer unused line styling', () => {
  const state = makeState(true, true);
  Object.assign(state.visState.annotations[0], {kind: AnnotationKind.TEXT});
  const store = mockStore(state);
  renderWithTheme(
    <IntlWrapper>
      <Provider store={store}>
        <AnnotationManager />
      </Provider>
    </IntlWrapper>
  );

  expect(screen.queryByRole('slider', {name: 'Line Width'})).not.toBeInTheDocument();
  expect(screen.queryByText('Color', {exact: true})).not.toBeInTheDocument();
});

describe('AnnotationManager line width slider', () => {
  const renderSlider = (lineWidth = 2) => {
    const state = makeState(true, true);
    state.visState.annotations[0].lineWidth = lineWidth;
    const store = mockStore(state);
    renderWithTheme(
      <IntlWrapper>
        <Provider store={store}>
          <AnnotationManager />
        </Provider>
      </IntlWrapper>
    );
    return {store, slider: screen.getByRole('slider', {name: 'Line Width'})};
  };

  test.each([1, 2, 10])('displays the saved %spx width and slider bounds', width => {
    const {slider} = renderSlider(width);

    expect(slider).toHaveAttribute('aria-valuemin', '1');
    expect(slider).toHaveAttribute('aria-valuemax', '10');
    expect(slider).toHaveAttribute('aria-valuenow', String(width));
    expect(slider).toHaveAttribute('aria-valuetext', `${width}px`);
    expect(within(slider).getByText(`${width}px`)).toBeInTheDocument();
    expect(slider).toHaveStyle({
      flex: '1',
      minWidth: '0',
      marginLeft: '36px',
      height: theme.inputBoxHeightSmall
    });
  });

  test.each([
    {key: 'ArrowLeft', width: 2, next: 1},
    {key: 'ArrowDown', width: 2, next: 1},
    {key: 'ArrowRight', width: 2, next: 3},
    {key: 'ArrowUp', width: 2, next: 3},
    {key: 'Home', width: 6, next: 1},
    {key: 'End', width: 6, next: 10},
    {key: 'ArrowLeft', width: 1, next: 1},
    {key: 'ArrowRight', width: 10, next: 10}
  ])('handles $key at $width px without exceeding the bounds', ({key, width, next}) => {
    const {store, slider} = renderSlider(width);
    slider.focus();
    expect(slider).toHaveFocus();

    fireEvent.keyDown(slider, {key});

    expect(store.getActions()).toEqual(
      next === width ? [] : [VisStateActions.updateAnnotation('ruler-1', {lineWidth: next})]
    );
  });

  test('ignores keys unrelated to width adjustment', () => {
    const {store, slider} = renderSlider();
    fireEvent.keyDown(slider, {key: 'Enter'});
    expect(store.getActions()).toEqual([]);
  });

  test.each([
    [-10, 1],
    [30, 4],
    [45, 6],
    [120, 10]
  ])('drags to %s and applies the nearest valid width %s', (clientX, width) => {
    const {store, slider} = renderSlider();
    const track = slider.querySelector('.kg-slider')!;
    Object.defineProperty(track, 'offsetWidth', {configurable: true, value: 90});
    const handle = slider.querySelectorAll('.kg-range-slider__handle')[1];

    fireEvent.mouseDown(handle);
    fireEvent.mouseMove(document, {clientX});
    fireEvent.mouseUp(document);

    expect(store.getActions()).toEqual([
      VisStateActions.updateAnnotation('ruler-1', {lineWidth: width})
    ]);
  });
});

describe('AnnotationManager selectors', () => {
  const renderCaption = (changes: Partial<Annotation> = {}, withDatasets = true) => {
    const state = makeState(true, true);
    const store = mockStore({
      ...state,
      visState: {
        ...state.visState,
        annotations: [{...state.visState.annotations[0], kind: AnnotationKind.TEXT, ...changes}],
        datasets: withDatasets
          ? {first: {id: 'first', label: 'Monarchs'}, second: {id: 'second', label: 'Sightings'}}
          : {}
      }
    });
    renderWithTheme(
      <IntlWrapper>
        <Provider store={store}>
          <AnnotationManager />
        </Provider>
      </IntlWrapper>
    );
    return store;
  };

  const viewport = {anchor: 'top-left' as const, margin: [24, 24] as [number, number]};

  test('opts geographic text into a viewport caption without changing its text', () => {
    const store = renderCaption();
    expect(screen.queryByRole('spinbutton', {name: 'Horizontal margin'})).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Geographic'));
    fireEvent.click(screen.getByText('Viewport'));
    expect(store.getActions()).toEqual([VisStateActions.updateAnnotation('ruler-1', {viewport})]);
  });

  test('returns a caption to geographic placement without clearing its readout', () => {
    const store = renderCaption({viewport, readout: {type: 'time'}});
    fireEvent.click(screen.getByText('Viewport'));
    fireEvent.click(screen.getByText('Geographic'));
    expect(store.getActions()).toEqual([
      VisStateActions.updateAnnotation('ruler-1', {viewport: undefined})
    ]);
  });

  test('changes the viewport anchor and margins independently', () => {
    const store = renderCaption({viewport});
    expect(screen.queryByText('Text Side')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Top left'));
    fireEvent.click(screen.getByText('Bottom right'));
    const horizontal = screen.getByRole('spinbutton', {name: 'Horizontal margin'});
    const vertical = screen.getByRole('spinbutton', {name: 'Vertical margin'});
    fireEvent.change(horizontal, {target: {value: '0'}});
    fireEvent.blur(horizontal);
    fireEvent.change(vertical, {target: {value: '48'}});
    fireEvent.blur(vertical);
    expect(store.getActions()).toEqual([
      VisStateActions.updateAnnotation('ruler-1', {
        viewport: {...viewport, anchor: 'bottom-right'}
      }),
      VisStateActions.updateAnnotation('ruler-1', {viewport: {...viewport, margin: [0, 24]}}),
      VisStateActions.updateAnnotation('ruler-1', {viewport: {...viewport, margin: [24, 48]}})
    ]);
  });

  test.each(['', '-1'])('rejects an invalid caption margin %s', value => {
    const store = renderCaption({viewport});
    const input = screen.getByRole('spinbutton', {name: 'Horizontal margin'});
    fireEvent.change(input, {target: {value}});
    fireEvent.blur(input);
    expect(input).toHaveValue(24);
    expect(store.getActions()).toEqual([]);
  });

  test.each([
    ['Timeline date', {type: 'time', format: 'YYYY-MM-DD'}],
    ['Filtered count', {type: 'count', dataId: 'first'}]
  ])('selects %s content', (content, readout) => {
    const store = renderCaption({viewport});
    fireEvent.click(screen.getByText('Static text'));
    fireEvent.click(screen.getByText(content as string));
    expect(store.getActions()).toEqual([
      VisStateActions.updateAnnotation('ruler-1', {readout} as Partial<Annotation>)
    ]);
  });

  test.each([
    AnnotationKind.POINT,
    AnnotationKind.ARROW,
    AnnotationKind.CIRCLE,
    AnnotationKind.RULER
  ])('sets dynamic content on a geographic %s annotation', kind => {
    const store = renderCaption({kind});
    fireEvent.click(screen.getByText('Static text'));
    fireEvent.click(screen.getByText('Timeline date'));
    expect(store.getActions()).toEqual([
      VisStateActions.updateAnnotation('ruler-1', {readout: {type: 'time', format: 'YYYY-MM-DD'}})
    ]);
  });

  test('does not offer dynamic content while a ruler caption is hidden', () => {
    renderCaption({kind: AnnotationKind.RULER, showCustomText: false} as Partial<Annotation>);
    expect(screen.queryByText('Static text')).not.toBeInTheDocument();
  });

  test('changes the date format and returns to static text', () => {
    const store = renderCaption({viewport, readout: {type: 'time', format: 'YYYY-MM-DD'}});
    const input = screen.getByRole('textbox', {name: 'Date format (UTC)'});
    fireEvent.change(input, {target: {value: ''}});
    expect(store.getActions()).toEqual([]);
    fireEvent.change(input, {
      target: {value: 'MMM YYYY'}
    });
    expect(store.getActions()).toEqual([]);
    fireEvent.blur(input);
    fireEvent.click(screen.getByText('Timeline date'));
    fireEvent.click(screen.getByText('Static text'));
    expect(store.getActions()).toEqual([
      VisStateActions.updateAnnotation('ruler-1', {readout: {type: 'time', format: 'MMM YYYY'}}),
      VisStateActions.updateAnnotation('ruler-1', {readout: undefined})
    ]);
  });

  test('clearing the date format restores the default while preserving the time source', () => {
    const store = renderCaption({viewport, readout: {type: 'time', format: 'MMM YYYY'}});
    const input = screen.getByRole('textbox', {name: 'Date format (UTC)'});
    fireEvent.change(input, {target: {value: ''}});
    fireEvent.blur(input);
    expect(input).toHaveValue('YYYY-MM-DD');
    expect(store.getActions()).toEqual([
      VisStateActions.updateAnnotation('ruler-1', {readout: {type: 'time', format: undefined}})
    ]);
  });

  test('rejects an oversized date format without changing the time source', () => {
    const store = renderCaption({viewport, readout: {type: 'time', format: 'MMM YYYY'}});
    const input = screen.getByRole('textbox', {name: 'Date format (UTC)'});
    fireEvent.change(input, {target: {value: 'Y'.repeat(129)}});
    fireEvent.blur(input);
    expect(input).toHaveValue('MMM YYYY');
    expect(store.getActions()).toEqual([]);
  });

  test('changes the dataset used by a filtered count', () => {
    const store = renderCaption({viewport, readout: {type: 'count', dataId: 'first'}});
    fireEvent.click(screen.getByText('Monarchs'));
    fireEvent.click(screen.getByText('Sightings'));
    expect(store.getActions()).toEqual([
      VisStateActions.updateAnnotation('ruler-1', {readout: {type: 'count', dataId: 'second'}})
    ]);
  });

  test('does not offer a count without a dataset', () => {
    renderCaption({viewport}, false);
    fireEvent.click(screen.getByText('Static text'));
    expect(screen.queryByText('Filtered count')).not.toBeInTheDocument();
  });

  test.each([AnnotationKind.RULER, AnnotationKind.POINT])(
    'uses consistent row height and spacing for %s options',
    kind => {
      const state = makeState(true, true);
      Object.assign(state.visState.annotations[0], {kind, armLength: 50, angle: -45});
      const store = mockStore(state);
      renderWithTheme(
        <IntlWrapper>
          <Provider store={store}>
            <AnnotationManager />
          </Provider>
        </IntlWrapper>
      );

      const labels =
        kind === AnnotationKind.RULER
          ? ['Line Width', 'Color', 'Custom Text', 'Distance', 'Content']
          : ['Line Width', 'Color', 'Text Side', 'Placement', 'Content'];
      labels.forEach((label, index) => {
        expect(screen.getByText(label).parentElement).toHaveStyle({
          minHeight: theme.inputBoxHeightSmall,
          alignItems: 'center',
          marginBottom: kind === AnnotationKind.RULER && index === labels.length - 1 ? '0' : '8px'
        });
      });
    }
  );

  test('keeps color picker and selectors compact with matching widths', () => {
    const state = makeState(true, true);
    Object.assign(state.visState.annotations[0], {
      kind: AnnotationKind.POINT,
      armLength: 50,
      angle: -45
    });
    const store = mockStore(state);
    const {container} = renderWithTheme(
      <IntlWrapper>
        <Provider store={store}>
          <AnnotationManager />
        </Provider>
      </IntlWrapper>
    );
    const selector = container.querySelector('.item-selector');
    const colorButton = screen.getByRole('button', {name: ''});

    expect(selector).toHaveStyle({width: '100px'});
    for (const dropdown of container.querySelectorAll('.item-selector__dropdown')) {
      expect(dropdown).toHaveStyle({height: theme.inputBoxHeightSmall, boxSizing: 'border-box'});
    }
    expect(colorButton.parentElement).toHaveStyle({width: '100px'});
    expect(colorButton).toHaveStyle({
      width: '100%',
      height: theme.inputBoxHeightSmall,
      padding: '4px 5px 4px 10px',
      boxSizing: 'border-box'
    });
  });

  test.each(['Right', 'Above'])(
    'keeps %s unchanged when Enter is pressed without choosing an option',
    current => {
      const state = makeState(true, true);
      Object.assign(state.visState.annotations[0], {
        kind: AnnotationKind.POINT,
        armLength: 50,
        angle: -45
      });
      const store = mockStore(state);
      renderWithTheme(
        <IntlWrapper>
          <Provider store={store}>
            <AnnotationManager />
          </Provider>
        </IntlWrapper>
      );

      fireEvent.click(screen.getByText(current));
      fireEvent.keyDown(document.activeElement!, {key: 'Enter', keyCode: 13});

      expect(store.getActions()).toEqual([]);
      expect(screen.getByText(current)).toBeInTheDocument();
    }
  );

  test.each([
    {
      current: 'Right',
      next: 'Left',
      changes: {textSide: 'left', textVerticalPosition: 'above', angle: -135}
    },
    {
      current: 'Above',
      next: 'Below',
      changes: {textSide: 'right', textVerticalPosition: 'below', angle: 45}
    }
  ] as const)(
    'changes $current to $next through a kepler.gl selector',
    ({current, next, changes}) => {
      const state = makeState(true, true);
      const store = mockStore({
        ...state,
        visState: {
          ...state.visState,
          annotations: [
            {
              ...state.visState.annotations[0],
              kind: AnnotationKind.POINT,
              armLength: 50,
              angle: -45
            }
          ]
        }
      });
      const {container} = renderWithTheme(
        <IntlWrapper>
          <Provider store={store}>
            <AnnotationManager />
          </Provider>
        </IntlWrapper>
      );

      expect(container.querySelector('select')).not.toBeInTheDocument();
      fireEvent.click(screen.getByText(current));
      expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();
      fireEvent.click(screen.getByText(next));

      expect(store.getActions()).toEqual([VisStateActions.updateAnnotation('ruler-1', changes)]);
      expect(screen.queryByText(next)).not.toBeInTheDocument();
    }
  );

  test('opts a legacy ruler into styled distance without changing its text or endpoints', () => {
    const store = mockStore(makeState(false, true));
    renderWithTheme(
      <IntlWrapper>
        <Provider store={store}>
          <AnnotationManager />
        </Provider>
      </IntlWrapper>
    );
    expect(screen.queryByLabelText('Offset (px)')).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Styled distance'));
    expect(store.getActions()).toEqual([
      VisStateActions.updateAnnotation('ruler-1', {rulerStyle: {...DEFAULT_RULER_STYLE}})
    ]);
  });

  test('edits ruler formatting, dimension geometry, endpoint names and shared background with native controls', async () => {
    const state = makeState(false, true);
    const rulerStyle = {...DEFAULT_RULER_STYLE, offset: 24, prefix: 'Span '};
    const labelBackground = {color: '#000000', opacity: 0.7, padding: 8};
    Object.assign(state.visState.annotations[0], {rulerStyle, labelBackground});
    const store = mockStore(state);
    renderWithTheme(
      <IntlWrapper>
        <Provider store={store}>
          <AnnotationManager />
        </Provider>
      </IntlWrapper>
    );
    fireEvent.change(screen.getByLabelText('Offset (px)'), {target: {value: '40'}});
    fireEvent.blur(screen.getByLabelText('Offset (px)'));
    fireEvent.click(screen.getByLabelText('Dimension line'));
    fireEvent.change(screen.getByLabelText('Start name'), {target: {value: 'A'}});
    fireEvent.change(screen.getByLabelText('Background opacity'), {target: {value: '0.5'}});
    fireEvent.blur(screen.getByLabelText('Background opacity'));
    await userEvent.click(screen.getByText('Auto (metric)'));
    await userEvent.click(screen.getByText('Kilometres'));
    expect(store.getActions()).toEqual([
      VisStateActions.updateAnnotation('ruler-1', {rulerStyle: {...rulerStyle, offset: 40}}),
      VisStateActions.updateAnnotation('ruler-1', {
        rulerStyle: {...rulerStyle, dimensionLine: true}
      }),
      VisStateActions.updateAnnotation('ruler-1', {rulerStyle: {...rulerStyle, startLabel: 'A'}}),
      VisStateActions.updateAnnotation('ruler-1', {
        labelBackground: {...labelBackground, opacity: 0.5}
      }),
      VisStateActions.updateAnnotation('ruler-1', {rulerStyle: {...rulerStyle, unit: 'km'}})
    ]);
    store.clearActions();
    fireEvent.change(screen.getByLabelText('Offset (px)'), {target: {value: '-1'}});
    fireEvent.blur(screen.getByLabelText('Offset (px)'));
    fireEvent.change(screen.getByLabelText('Background opacity'), {target: {value: '2'}});
    fireEvent.blur(screen.getByLabelText('Background opacity'));
    expect(store.getActions()).toEqual([]);
  });
});

describe('Point elevation settings', () => {
  function renderPoint(elevation?: AnnotationElevation, overrides: Partial<Annotation> = {}) {
    const state = makeState(true, true);
    Object.assign(state.visState.annotations[0], {
      kind: AnnotationKind.POINT,
      anchorPoint: [1, 2, 7448.36],
      elevation,
      armLength: 40,
      angle: 0,
      ...overrides
    });
    Object.assign(state.visState, {
      datasets: {
        detections: {
          id: 'detections',
          label: 'Detections',
          fields: [
            {name: 'altitude', type: 'real'},
            {name: 'name', type: 'string'}
          ]
        }
      }
    });
    const store = mockStore(state);
    renderWithTheme(
      <IntlWrapper>
        <Provider store={store}>
          <AnnotationManager />
        </Provider>
      </IntlWrapper>
    );
    return store;
  }
  test('shows the background group before elevation and reveals elevation settings independently', async () => {
    const store = renderPoint({...DEFAULT_MAP_HEIGHT_ELEVATION});
    expect(
      screen.getByText('Content').compareDocumentPosition(screen.getByLabelText('Show elevation'))
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(
      screen
        .getByRole('button', {name: 'Background'})
        .compareDocumentPosition(screen.getByLabelText('Show elevation'))
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(screen.getByRole('button', {name: 'Background'})).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    expect(screen.queryByLabelText('Label background')).not.toBeInTheDocument();
    expect(screen.getByText('Map height')).toBeInTheDocument();
    expect(screen.getByRole('status', {name: 'Label preview'})).toHaveTextContent(
      '7448.36 m above map zero'
    );
    expect(screen.queryByLabelText('Measured elevation')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Compare with ground')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Marker height (m)')).not.toBeInTheDocument();
    expect(screen.queryByRole('group', {name: 'Decimals'})).not.toBeInTheDocument();
    const advanced = screen.getByRole('button', {name: 'Advanced'});
    advanced.focus();
    await userEvent.keyboard('{Enter}');
    expect(advanced).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByLabelText('Marker height (m)')).toHaveValue(7448.36);
    expect(screen.queryByLabelText('Measured from')).not.toBeInTheDocument();
    await userEvent.keyboard(' ');
    expect(advanced).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByLabelText('Marker height (m)')).not.toBeInTheDocument();
    const elevationAppearance = screen.getByRole('button', {name: 'Elevation appearance'});
    fireEvent.click(elevationAppearance);
    expect(
      within(screen.getByRole('group', {name: 'Decimals'})).getByRole('button', {name: '2'})
    ).toBeInTheDocument();
    expect(screen.getByRole('group', {name: 'Vertical guide'})).toBeInTheDocument();
    expect(screen.getByRole('group', {name: 'Marker style'})).toBeInTheDocument();
    expect(screen.queryByLabelText('Label background')).not.toBeInTheDocument();
    fireEvent.click(elevationAppearance);
    expect(screen.queryByLabelText('Label background')).not.toBeInTheDocument();
    expect(screen.queryByRole('group', {name: 'Decimals'})).not.toBeInTheDocument();
    expect(screen.queryByRole('group', {name: 'Vertical guide'})).not.toBeInTheDocument();
    expect(screen.queryByRole('group', {name: 'Marker style'})).not.toBeInTheDocument();
    expect(advanced).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(advanced);
    expect(screen.getByLabelText('Marker height (m)')).toHaveValue(7448.36);
    expect(store.getActions()).toEqual([]);
  });
  test.each<[string, number]>([
    ['12.34567', 12.346],
    ['-12.34567', -12.346],
    ['0', 0]
  ])('rounds an edited marker height of %s to %s metres', (draft, expected) => {
    const store = renderPoint({...DEFAULT_MAP_HEIGHT_ELEVATION}, {anchorPoint: [1, 2, 123.456789]});
    fireEvent.click(screen.getByRole('button', {name: 'Advanced'}));
    const height = screen.getByLabelText('Marker height (m)');
    expect(height).toHaveValue(123.457);
    fireEvent.blur(height);
    expect(store.getActions()).toEqual([]);
    fireEvent.change(height, {target: {value: ''}});
    fireEvent.blur(height);
    expect(height).toHaveValue(123.457);
    expect(store.getActions()).toEqual([]);
    fireEvent.change(height, {target: {value: draft}});
    fireEvent.blur(height);
    expect(height).toHaveValue(expected);
    expect(store.getActions()).toEqual([
      VisStateActions.updateAnnotation('ruler-1', {anchorPoint: [1, 2, expected]})
    ]);
  });
  test('offers only zero through three decimals without changing an existing saved precision', async () => {
    const elevation = {...DEFAULT_MAP_HEIGHT_ELEVATION, precision: 6};
    const store = renderPoint(elevation);
    fireEvent.click(screen.getByRole('button', {name: 'Elevation appearance'}));
    within(screen.getByRole('group', {name: 'Decimals'}))
      .getByRole('button', {name: '6'})
      .focus();
    await userEvent.keyboard('{Enter}');
    const menu = screen.getByTitle('0').closest('.list-selector') as HTMLElement;
    expect(
      within(menu)
        .getAllByText(/^\d$/)
        .map(option => option.textContent)
    ).toEqual(['0', '1', '2', '3']);
    expect(store.getActions()).toEqual([]);
    await userEvent.click(within(menu).getByText('3'));
    expect(store.getActions()).toEqual([
      VisStateActions.updateAnnotation('ruler-1', {elevation: {...elevation, precision: 3}})
    ]);
  });
  test.each([
    ['captured', 'Drag the anchor onto a feature'],
    ['compareGround', 'Enter a known ground elevation'],
    ['anchorHeight', 'Marker height controls drawing only'],
    ['datum', 'Use the same height reference for both values'],
    ['referenceDatum', 'Use the same height reference for both values']
  ])('shows %s guidance only in its shared help tooltip', async (id, text) => {
    // JSDOM matches :hover on every element in an unfocused document.
    const hasFocus = jest.spyOn(document, 'hasFocus').mockReturnValue(true);
    try {
      const user = userEvent.setup();
      const store = renderPoint({
        ...DEFAULT_ANNOTATION_ELEVATION,
        field: {dataId: 'detections', name: 'altitude'},
        reference: {value: 0, unit: 'm', datum: 'MSL'}
      });
      fireEvent.click(screen.getByRole('button', {name: 'Advanced'}));
      const tooltipId = `annotation-ruler-1-elevation-${id}-help`;
      const tooltip = document.getElementById(tooltipId);
      expect(tooltip).toHaveTextContent(text);
      expect(tooltip).not.toBeVisible();
      const help = document.querySelector(`[data-for="${tooltipId}"]`) as HTMLElement;
      await user.hover(help);
      await waitFor(() => expect(tooltip).toBeVisible());
      await user.unhover(help);
      await waitFor(() => expect(tooltip).not.toBeVisible());
      expect(store.getActions()).toEqual([]);
    } finally {
      hasFocus.mockRestore();
    }
  });
  test('switching from map height to manual input does not copy the drawing height into a measurement', async () => {
    const elevation = {...DEFAULT_MAP_HEIGHT_ELEVATION};
    const store = renderPoint(elevation);
    await userEvent.click(screen.getByText('Map height'));
    await userEvent.click(screen.getByText('Manual value'));
    expect(store.getActions()).toEqual([
      VisStateActions.updateAnnotation('ruler-1', {
        elevation: {...elevation, source: 'measurement', field: undefined}
      })
    ]);
  });
  test('ground settings are optional and removing comparison resets the displayed value to altitude', () => {
    const elevation: AnnotationElevation = {
      ...DEFAULT_ANNOTATION_ELEVATION,
      value: 10,
      datum: 'MSL',
      display: 'both',
      reference: {value: 2, unit: 'm', datum: 'MSL'}
    };
    const store = renderPoint(elevation);
    expect(screen.getByLabelText('Ground elevation')).toHaveValue(2);
    fireEvent.click(screen.getByLabelText('Compare with ground'));
    expect(store.getActions()).toEqual([
      VisStateActions.updateAnnotation('ruler-1', {
        elevation: {...elevation, reference: null, display: 'altitude'}
      })
    ]);
  });
  test.each<{anchorPoint: Annotation['anchorPoint']}>([
    {anchorPoint: [1, 2]},
    {anchorPoint: [1, 2, 9000]}
  ])(
    'enables map height without inventing a measured value for anchor $anchorPoint',
    ({anchorPoint}) => {
      const store = renderPoint(undefined, {anchorPoint});
      fireEvent.click(screen.getByLabelText('Show elevation'));
      expect(store.getActions()).toEqual([
        VisStateActions.updateAnnotation('ruler-1', {
          elevation: {...DEFAULT_MAP_HEIGHT_ELEVATION}
        })
      ]);
    }
  );
  test('groups all background controls and keeps them editable when elevation is disabled', async () => {
    const store = renderPoint(undefined, {
      labelBackground: {color: '#000000', opacity: 0.7, padding: 8}
    });
    expect(screen.getByLabelText('Show elevation')).not.toBeChecked();
    expect(screen.queryByRole('button', {name: 'Elevation appearance'})).not.toBeInTheDocument();
    const background = screen.getByRole('button', {name: 'Background'});
    const expectHiddenControls = () => {
      expect(background).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByLabelText('Label background')).not.toBeInTheDocument();
      expect(screen.queryByText('Background color')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Background opacity')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Padding (px)')).not.toBeInTheDocument();
    };
    expectHiddenControls();
    background.focus();
    await userEvent.keyboard('{Enter}');
    expect(background).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Background color')).toBeInTheDocument();
    expect(screen.getByLabelText('Background opacity')).toHaveValue(0.7);
    expect(screen.getByLabelText('Padding (px)')).toHaveValue(8);
    await userEvent.keyboard(' ');
    expectHiddenControls();
    fireEvent.click(background);
    expect(store.getActions()).toEqual([]);
    expect(screen.getByLabelText('Label background')).toBeChecked();
    fireEvent.click(screen.getByLabelText('Label background'));
    expect(store.getActions()).toEqual([
      VisStateActions.updateAnnotation('ruler-1', {labelBackground: undefined})
    ]);
  });
  test('keeps signed measurements independent from anchor and reference drawing heights', () => {
    const elevation: AnnotationElevation = {
      ...DEFAULT_ANNOTATION_ELEVATION,
      value: 7448.36,
      datum: 'MSL',
      reference: {value: 990, unit: 'm', datum: 'MSL'}
    };
    const store = renderPoint(elevation);
    fireEvent.click(screen.getByRole('button', {name: 'Advanced'}));
    for (const [name, value] of [
      ['Measured elevation', '-1000'],
      ['Marker height (m)', '4900'],
      ['Ground draw height (m)', '5900']
    ]) {
      fireEvent.change(screen.getByLabelText(name), {target: {value}});
      fireEvent.blur(screen.getByLabelText(name));
    }
    expect(store.getActions()).toEqual([
      VisStateActions.updateAnnotation('ruler-1', {elevation: {...elevation, value: -1000}}),
      VisStateActions.updateAnnotation('ruler-1', {anchorPoint: [1, 2, 4900]}),
      VisStateActions.updateAnnotation('ruler-1', {
        elevation: {...elevation, reference: {...elevation.reference!, displayZ: 5900}}
      })
    ]);
    store.clearActions();
    fireEvent.change(screen.getByLabelText('Measured elevation'), {target: {value: ''}});
    fireEvent.blur(screen.getByLabelText('Measured elevation'));
    expect(store.getActions()).toEqual([]);
    fireEvent.click(screen.getByLabelText('Show elevation'));
    expect(store.getActions()).toEqual([
      VisStateActions.updateAnnotation('ruler-1', {elevation: undefined})
    ]);
  });
  test('selecting a numeric source requires a fresh capture instead of retaining a stale value', async () => {
    const elevation: AnnotationElevation = {...DEFAULT_ANNOTATION_ELEVATION, value: 7448.36};
    const store = renderPoint(elevation);
    await userEvent.click(screen.getByText('Manual value'));
    await userEvent.click(screen.getByText('Data field'));
    expect(store.getActions()).toEqual([
      VisStateActions.updateAnnotation('ruler-1', {
        elevation: {
          ...elevation,
          source: 'measurement',
          value: null,
          field: {dataId: 'detections', name: 'altitude'}
        }
      })
    ]);
  });
  test('manual missing values stay empty until entered and datum names preserve internal spaces', () => {
    const elevation = {...DEFAULT_ANNOTATION_ELEVATION};
    const store = renderPoint(elevation);
    expect(screen.getByLabelText('Measured elevation')).toHaveValue(null);
    fireEvent.change(screen.getByLabelText('Measured elevation'), {target: {value: '0'}});
    fireEvent.blur(screen.getByLabelText('Measured elevation'));
    fireEvent.click(screen.getByRole('button', {name: 'Advanced'}));
    fireEvent.change(screen.getByLabelText('Measured from'), {target: {value: 'Local benchmark'}});
    expect(store.getActions()).toHaveLength(1);
    fireEvent.blur(screen.getByLabelText('Measured from'));
    expect(store.getActions()).toEqual([
      VisStateActions.updateAnnotation('ruler-1', {elevation: {...elevation, value: 0}}),
      VisStateActions.updateAnnotation('ruler-1', {
        elevation: {...elevation, datum: 'Local benchmark'}
      })
    ]);
  });
});
