// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {IntlWrapper, renderWithTheme} from 'test/helpers/component-jest-utils';
import BrushConfigFactory from './brush-config';

const BrushConfig = BrushConfigFactory(() => null);

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
      <BrushConfig config={{size: 4}} onChange={onChange} />
    </IntlWrapper>
  );
  await user.click(screen.getByText('Both'));
  await user.click(screen.getByText('End'));
  expect(onChange).toHaveBeenCalledWith({size: 4, endpoint: 'target'});
});
