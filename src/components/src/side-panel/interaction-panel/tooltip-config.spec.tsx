// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, screen} from '@testing-library/react';

import {renderWithTheme} from 'test/helpers/component-jest-utils';
import TooltipConfigFactory from './tooltip-config';

jest.mock('../common/dataset-tag', () => ({
  __esModule: true,
  default: () => () => null
}));

jest.mock('../../filters/timezone-selector', () => ({
  __esModule: true,
  default: ({
    timezone,
    onChange
  }: {
    timezone?: string | null;
    onChange: (timezone: string) => void;
  }) => {
    const React = jest.requireActual('react');
    return React.createElement(
      'button',
      {
        'data-testid': 'tooltip-timezone',
        onClick: () => onChange('America/Los_Angeles')
      },
      timezone
    );
  }
}));

jest.mock('../../common/item-selector/item-selector', () => ({
  __esModule: true,
  default: () => null
}));

const TooltipConfig = TooltipConfigFactory(
  () => null,
  () => null
);

describe('TooltipConfig', () => {
  test('updates the tooltip timezone while preserving the rest of the config', () => {
    const onChange = jest.fn();
    const config = {
      fieldsToShow: {},
      compareMode: false,
      compareType: null,
      timezone: 'America/New_York'
    };

    renderWithTheme(
      <TooltipConfig
        config={config}
        datasets={{}}
        onChange={onChange}
        onDisplayFormatChange={jest.fn()}
      />
    );

    expect(screen.getByText('filterManager.timezone')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip-timezone')).toHaveTextContent('America/New_York');
    fireEvent.click(screen.getByTestId('tooltip-timezone'));

    expect(onChange).toHaveBeenCalledWith({
      ...config,
      timezone: 'America/Los_Angeles'
    });
  });
});
