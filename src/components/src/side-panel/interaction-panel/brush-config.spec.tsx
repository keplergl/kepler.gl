// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {IntlWrapper, renderWithTheme} from 'test/helpers/component-jest-utils';
import BrushConfigFactory from './brush-config';

import RangeSliderFactory from '../../common/range-slider';

const RangeSlider = RangeSliderFactory(
  () => <></>,
  () => <></>
);
const BrushConfig = BrushConfigFactory(RangeSlider);

const originalIntersectionObserver = window.IntersectionObserver;
beforeAll(() => {
  window.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: () => [],
    root: null,
    rootMargin: '',
    thresholds: []
  })) as unknown as typeof IntersectionObserver;
});

afterAll(() => {
  window.IntersectionObserver = originalIntersectionObserver;
});

test('defaults to Both and lets the user change endpoints without resetting the radius', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  renderWithTheme(
    <IntlWrapper>
      <BrushConfig config={{size: 4, showBrush: true}} onChange={onChange} />
    </IntlWrapper>
  );
  await user.click(screen.getByText('Both'));
  await user.click(screen.getByText('End'));
  expect(onChange).toHaveBeenCalledWith({size: 4, endpoint: 'target', showBrush: true});
});

describe('BrushConfig', () => {
  test.each([undefined, false, true])(
    'toggles visibility from %s and preserves the radius',
    showBrush => {
      const onChange = jest.fn();
      renderWithTheme(
        <IntlWrapper>
          <BrushConfig config={{size: 4, endpoint: 'target', showBrush}} onChange={onChange} />
        </IntlWrapper>
      );
      const toggle = screen.getByRole('checkbox', {name: 'Show brush'});
      expect(toggle).toHaveProperty('checked', Boolean(showBrush));
      fireEvent.click(toggle);
      expect(onChange).toHaveBeenLastCalledWith({
        size: 4,
        endpoint: 'target',
        showBrush: !showBrush
      });
    }
  );

  test('preserves the circle setting when changing the radius, including zero', () => {
    const onChange = jest.fn();
    renderWithTheme(
      <IntlWrapper>
        <BrushConfig config={{size: 0, endpoint: 'source', showBrush: true}} onChange={onChange} />
      </IntlWrapper>
    );
    const radius = screen.getByRole('spinbutton');
    expect(radius).toHaveValue(0);
    fireEvent.change(radius, {target: {value: '5'}});
    fireEvent.blur(radius);
    expect(onChange).toHaveBeenLastCalledWith({size: 5, endpoint: 'source', showBrush: true});
  });
});
