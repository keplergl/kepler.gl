// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {screen} from '@testing-library/react';
import {renderWithTheme} from 'test/helpers/component-jest-utils';
import TimeSliderMarkerFactory from './time-slider-marker';

const TimeSliderMarker = TimeSliderMarkerFactory();

test('labels noon and afternoon ticks in 12-hour time in the selected timezone', () => {
  renderWithTheme(
    <TimeSliderMarker
      domain={[Date.UTC(2026, 1, 10, 16), Date.UTC(2026, 1, 10, 18)]}
      width={240}
      timezone="America/New_York"
    />
  );

  expect(screen.getByText('11 AM')).toBeInTheDocument();
  expect(screen.getByText('12 PM')).toBeInTheDocument();
  expect(screen.getByText('01 PM')).toBeInTheDocument();
});
