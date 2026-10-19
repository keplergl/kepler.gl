// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, screen} from '@testing-library/react';
import {MapStateActions} from '@kepler.gl/actions';
import {INITIAL_MAP_STATE} from '@kepler.gl/reducers';
import {renderWithTheme, IntlWrapper} from 'test/helpers/component-jest-utils';
import CameraBookmarkControl from './camera-bookmark-control';

const camera = {longitude: 10, latitude: 20, zoom: 6, bearing: 30, pitch: 45};
const bookmarks = [{id: 'home', name: 'Home', camera}];

test('provides numbered bookmark navigation without the sidebar', () => {
  const updateMap = jest.fn();
  renderWithTheme(
    <IntlWrapper>
      <CameraBookmarkControl
        bookmarks={bookmarks}
        mapState={INITIAL_MAP_STATE}
        mapStateActions={{...MapStateActions, updateMap}}
      />
    </IntlWrapper>
  );
  expect(screen.getByRole('button', {name: 'Home'})).toHaveTextContent('1');
  fireEvent.click(screen.getByRole('button', {name: 'Home'}));
  expect(updateMap).toHaveBeenCalledWith(expect.objectContaining(camera));
});

test.each([
  {isExport: true},
  {mapState: {...INITIAL_MAP_STATE, isSplit: true}},
  {mapState: {...INITIAL_MAP_STATE, globe: {...INITIAL_MAP_STATE.globe!, enabled: true}}},
  {bookmarks: []}
])('does not show navigation for unavailable views: %p', props => {
  renderWithTheme(
    <IntlWrapper>
      <CameraBookmarkControl
        bookmarks={bookmarks}
        mapState={INITIAL_MAP_STATE}
        mapStateActions={MapStateActions}
        {...props}
      />
    </IntlWrapper>
  );
  expect(screen.queryByRole('navigation')).toBeNull();
});
