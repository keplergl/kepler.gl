// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {IntlProvider} from 'react-intl';

import {messages} from '@kepler.gl/localization';
import {renderWithTheme} from 'test/helpers/component-jest-utils';
import ItemSelector from './item-selector';

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
    takeRecords() {
      return [];
    }
    root = null;
    rootMargin = '';
    thresholds: number[] = [];
  } as unknown as typeof IntersectionObserver;
});

describe('ItemSelector', () => {
  test('ignores Enter when no object option is highlighted', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();

    renderWithTheme(
      <IntlProvider locale="en" messages={messages.en}>
        <ItemSelector
          options={[{id: 'alpha', label: 'Alpha'}]}
          selectedItems={[]}
          onChange={onChange}
          getOptionValue={option => option.id}
          displayOption={option => option.label}
        />
      </IntlProvider>
    );

    await user.click(screen.getByText('Enter a value'));
    await user.type(screen.getByPlaceholderText('Search'), '{Enter}');

    expect(onChange).not.toHaveBeenCalled();
  });
});
