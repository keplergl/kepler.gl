// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {fireEvent, screen} from '@testing-library/react';

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
        paddingLeft: `${theme.switchWidth}px`
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

  test.each([
    {current: 'Point', next: 'Circle', changes: {kind: AnnotationKind.CIRCLE}},
    {current: '2px', next: '4px', changes: {lineWidth: 4}},
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
