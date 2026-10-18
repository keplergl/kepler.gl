// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';

import {NO_MAP_ID} from '@kepler.gl/constants';
import {INITIAL_MAP_STATE, INITIAL_MAP_STYLE} from '@kepler.gl/reducers';
import {IntlWrapper, renderWithTheme} from 'test/helpers/rtl-utils';

import {useKeplerStateActions} from '../hooks/useKeplerStateActions';
import {CustomMapManager} from './CustomMapManager';

jest.mock('../hooks/useKeplerStateActions', () => ({
  useKeplerStateActions: jest.fn()
}));
jest.mock('./KeplerInjector', () => {
  const {appInjector} = jest.requireActual('@kepler.gl/components');
  return {getKeplerFactory: factory => appInjector.get(factory)};
});

const mockUseKeplerStateActions = jest.mocked(useKeplerStateActions);

const keplerActions = {
  uiStateActions: {toggleModal: jest.fn()},
  mapStyleActions: {
    mapStyleChange: jest.fn(),
    removeCustomMapStyle: jest.fn(),
    mapConfigChange: jest.fn(),
    set3dBuildingColor: jest.fn(),
    setBackgroundColor: jest.fn()
  }
};

describe('CustomMapManager', () => {
  beforeEach(() => {
    mockUseKeplerStateActions.mockReturnValue({
      keplerActions: keplerActions as any,
      keplerState: {
        mapStyle: INITIAL_MAP_STYLE,
        mapState: INITIAL_MAP_STATE
      } as any
    });
  });

  test('shows an independent background picker for each flat-map instance', () => {
    const {container} = renderWithTheme(
      <IntlWrapper>
        <>
          <CustomMapManager mapId="first-map" />
          <CustomMapManager mapId="second-map" />
        </>
      </IntlWrapper>
    );

    expect(container.querySelectorAll('[data-for="update-color-Background"]')).toHaveLength(2);
    expect(mockUseKeplerStateActions).toHaveBeenCalledWith({mapId: 'first-map'});
    expect(mockUseKeplerStateActions).toHaveBeenCalledWith({mapId: 'second-map'});
  });

  test('does not add the flat-map background picker in globe mode', () => {
    mockUseKeplerStateActions.mockReturnValue({
      keplerActions: keplerActions as any,
      keplerState: {
        mapStyle: {...INITIAL_MAP_STYLE, styleType: NO_MAP_ID},
        mapState: {
          ...INITIAL_MAP_STATE,
          globe: {...INITIAL_MAP_STATE.globe, enabled: true}
        }
      } as any
    });

    const {container} = renderWithTheme(
      <IntlWrapper>
        <CustomMapManager mapId="globe-map" />
      </IntlWrapper>
    );

    expect(container.querySelector('[data-for="update-color-Background"]')).toBeNull();
  });
});
