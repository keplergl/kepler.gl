// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState} from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {IntlProvider} from 'react-intl';

import {messages} from '@kepler.gl/localization';
import {parseVectorMetadata} from '@kepler.gl/table';
import {renderWithTheme} from 'test/helpers/component-jest-utils';
import MultiSelectFilterFactory from './multi-select-filter';

const MultiSelectFilter = MultiSelectFilterFactory();

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

describe('MultiSelectFilter', () => {
  test('searches string categories when other tile layers have same-named numeric fields', async () => {
    const metadata = parseVectorMetadata({
      tilejson: {
        layers: [
          {id: 'strings', fields: [{name: 'class', type: 'utf8', values: ['clinic']}]},
          {id: 'numbers', fields: [{name: 'class', type: 'int', values: [7]}]},
          {id: 'later', fields: [{name: 'class', type: 'utf8', values: ['pharmacy']}]}
        ]
      }
    } as any);
    const setFilter = jest.fn();
    const user = userEvent.setup();
    renderWithTheme(
      <IntlProvider locale="en" messages={messages.en}>
        <MultiSelectFilter
          filter={{id: 'category', ...metadata?.fields[0].filterProps} as any}
          setFilter={setFilter}
        />
      </IntlProvider>
    );
    await user.click(screen.getByText('Enter a value'));
    await user.type(screen.getByPlaceholderText('Search'), 'cli');
    expect(screen.queryByText('pharmacy')).not.toBeInTheDocument();
    await user.click(screen.getByText('clinic'));
    expect(setFilter).toHaveBeenCalledWith(['clinic']);
  });

  test('keeps the search open while selections toggle', async () => {
    const setFilter = jest.fn();
    const user = userEvent.setup();
    const StatefulMultiSelectFilter = () => {
      const [value, setValue] = useState<ReadonlyArray<string>>([]);

      return (
        <MultiSelectFilter
          filter={{id: 'filter-1', domain: ['Alpha', 'Beta'], value} as any}
          setFilter={nextValue => {
            setFilter(nextValue);
            setValue(nextValue as ReadonlyArray<string>);
          }}
        />
      );
    };

    renderWithTheme(
      <IntlProvider locale="en" messages={messages.en}>
        <StatefulMultiSelectFilter />
      </IntlProvider>
    );

    await user.click(screen.getByText('Enter a value'));
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();

    await user.click(screen.getByText('Alpha'));
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    expect(setFilter).toHaveBeenCalledTimes(1);
    expect(setFilter).toHaveBeenNthCalledWith(1, ['Alpha']);

    await user.click(screen.getByText('Beta'));
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    expect(setFilter).toHaveBeenCalledTimes(2);
    expect(setFilter).toHaveBeenNthCalledWith(2, ['Alpha', 'Beta']);

    const alphaOption = screen.getByTitle('Alpha').closest('.list__item');
    expect(alphaOption).toHaveClass('selected');
    await user.click(alphaOption as HTMLElement);

    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    expect(setFilter).toHaveBeenCalledTimes(3);
    expect(setFilter).toHaveBeenNthCalledWith(3, ['Beta']);
    expect(screen.getByTitle('Alpha').closest('.list__item')).not.toHaveClass('selected');
    expect(screen.getByTitle('Beta').closest('.list__item')).toHaveClass('selected');
  });
});
