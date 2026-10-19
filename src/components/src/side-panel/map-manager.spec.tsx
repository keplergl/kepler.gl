// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';

import {MapStateActions, MapStyleActions} from '@kepler.gl/actions';
import {appInjector} from '@kepler.gl/components';
import {NO_MAP_ID} from '@kepler.gl/constants';
import {INITIAL_MAP_STATE, INITIAL_MAP_STYLE} from '@kepler.gl/reducers';
import {renderWithTheme} from 'test/helpers/component-jest-utils';

import MapManagerFactory from './map-manager';

const MapManager = appInjector.get(MapManagerFactory);

const panelMetadata = {
  id: 'map',
  label: 'sidebar.panels.basemap',
  iconComponent: () => null,
  onClick: null
};

const defaultProps = {
  mapStyle: INITIAL_MAP_STYLE,
  mapState: INITIAL_MAP_STATE,
  mapStyleActions: MapStyleActions,
  mapStateActions: MapStateActions,
  showAddMapStyleModal: jest.fn(),
  panelMetadata
};

describe('MapManager', () => {
  test('shows one background color picker for a selected basemap style', () => {
    const {container} = renderWithTheme(<MapManager {...defaultProps} />);

    expect(
      container.querySelectorAll('[data-for="update-color-Background"]')
    ).toHaveLength(1);
  });

  test('preserves the existing No Basemap background color picker', () => {
    const mapStyle = {...INITIAL_MAP_STYLE, styleType: NO_MAP_ID};
    const {container} = renderWithTheme(
      <MapManager {...defaultProps} mapStyle={mapStyle} />
    );

    expect(
      container.querySelectorAll('[data-for="update-color-Background"]')
    ).toHaveLength(1);
  });

  test('preserves the separate globe background color picker', () => {
    const mapState = {
      ...INITIAL_MAP_STATE,
      globe: {...INITIAL_MAP_STATE.globe, enabled: true}
    };
    const {container} = renderWithTheme(
      <MapManager {...defaultProps} mapState={mapState} />
    );

    expect(container.querySelector('[data-for="update-color-Background"]')).toBeNull();
    expect(
      container.querySelectorAll('[data-for="update-color-globe-background"]')
    ).toHaveLength(1);
  });
});
