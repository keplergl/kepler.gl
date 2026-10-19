// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {fireEvent} from '@testing-library/react';

import {AnnotationKind} from '@kepler.gl/constants';
import {VisStateActions} from '@kepler.gl/actions';
import {renderWithTheme} from 'test/helpers/component-jest-utils';

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
  ])('renders independent custom text and distance values (%s, %s)', (customText, distance) => {
    const store = mockStore(makeState(customText, distance));
    const {container} = renderWithTheme(
      <Provider store={store}>
        <AnnotationManager />
      </Provider>
    );

    expect(container.querySelector('#annotation-ruler-1-show-custom-text')).toHaveProperty(
      'checked',
      customText
    );
    expect(container.querySelector('#annotation-ruler-1-show-distance')).toHaveProperty(
      'checked',
      distance
    );
  });

  test('dispatches each ruler checkbox independently', () => {
    const store = mockStore(makeState(true, true));
    const {container} = renderWithTheme(
      <Provider store={store}>
        <AnnotationManager />
      </Provider>
    );

    fireEvent.click(container.querySelector('#annotation-ruler-1-show-custom-text')!);
    fireEvent.click(container.querySelector('#annotation-ruler-1-show-distance')!);

    expect(store.getActions()).toEqual([
      VisStateActions.updateAnnotation('ruler-1', {showCustomText: false}),
      VisStateActions.updateAnnotation('ruler-1', {showDistance: false})
    ]);
  });
});
