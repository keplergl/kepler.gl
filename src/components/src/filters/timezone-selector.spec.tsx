// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck
import React from 'react';
import {screen} from '@testing-library/react';

import {DEFAULT_TIMEZONE} from '@kepler.gl/constants';

import {renderWithTheme} from 'test/helpers/component-jest-utils';
import TimezoneSelector, {getTimezoneOptions, getTimezonesFromMoment} from './timezone-selector';

describe('TimezoneSelector', () => {
  test('lists IANA zones with UTC first', () => {
    const timezones = getTimezonesFromMoment();
    expect(timezones[DEFAULT_TIMEZONE]).toBe(0);
    expect(timezones['America/New_York']).toEqual(expect.any(Number));

    const options = getTimezoneOptions(timezones);
    expect(options[0]).toEqual({name: DEFAULT_TIMEZONE, label: 'UTC (Default)'});
    expect(options.find(option => option.name === 'America/Los_Angeles')?.label).toMatch(
      /America\/Los_Angeles \(UTC -?\d+(\.\d+)? hours\)/
    );
  });

  test('renders the current timezone label', () => {
    const onChange = jest.fn();
    renderWithTheme(<TimezoneSelector timezone="America/New_York" onChange={onChange} />);

    expect(screen.getByTestId('time-widget-timezone')).toBeInTheDocument();
    expect(screen.getByText(/America\/New_York/)).toBeInTheDocument();
  });
});
