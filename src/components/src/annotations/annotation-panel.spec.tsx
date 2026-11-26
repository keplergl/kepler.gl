// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useContext} from 'react';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {fireEvent, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {WebMercatorViewport} from '@math.gl/web-mercator';

import {AnnotationKind} from '@kepler.gl/constants';
import {Annotation} from '@kepler.gl/types';
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
          marginBottom: index === labels.length - 1 ? '0' : '8px'
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
});
