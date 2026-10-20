// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {fireEvent, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {AnnotationKind} from '@kepler.gl/constants';
import {VisStateActions} from '@kepler.gl/actions';
import {theme} from '@kepler.gl/styles';
import {IntlWrapper, renderWithTheme} from 'test/helpers/component-jest-utils';

import AnnotationManagerFactory from './annotation-panel';

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
        expect(button).toHaveAttribute('title', button.getAttribute('aria-label'));
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
          ? ['Line Width', 'Color', 'Custom Text', 'Distance']
          : ['Line Width', 'Color', 'Text Side', 'Placement'];
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
    'keeps %s unchanged when Enter is pressed without choosing an option', current => {
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
  ] as const)('changes $current to $next through a kepler.gl selector', ({current, next, changes}) => {
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
  });
});
