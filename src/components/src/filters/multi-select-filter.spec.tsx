// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState} from 'react';
import {fireEvent, screen} from '@testing-library/react';
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
  test('shows and clears a restored selection absent from the current domain', async () => {
    const setFilter = jest.fn();
    const user = userEvent.setup();
    renderWithTheme(
      <IntlProvider locale="en" messages={messages.en}>
        <MultiSelectFilter
          filter={{id: 'restored', domain: ['B'], value: ['A']} as any}
          setFilter={setFilter}
        />
      </IntlProvider>
    );
    const selected = screen.getByText('A');
    expect(selected).toBeInTheDocument();
    const remove = selected.parentElement?.querySelector('svg');
    expect(remove).not.toBeNull();
    await user.click(remove as SVGSVGElement);
    expect(setFilter).toHaveBeenCalledWith([]);
  });

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

test.each([
  ['click', ['known']],
  ['enter', []]
])('adds exact custom categories by %s and allows deselection', async (method, domain) => {
  const user = userEvent.setup();
  const setFilter = jest.fn();
  const StatefulFilter = () => {
    const [value, setValue] = useState<ReadonlyArray<string>>([]);
    return (
      <MultiSelectFilter
        allowCustomValues
        filter={{id: 'tile', domain, value} as any}
        setFilter={next => {
          setFilter(next);
          setValue(next as string[]);
        }}
      />
    );
  };
  renderWithTheme(
    <IntlProvider locale="en" messages={messages.en}>
      <StatefulFilter />
    </IntlProvider>
  );
  await user.click(screen.getByText('Enter a value'));
  await user.type(screen.getByPlaceholderText('Search'), '007 café');
  if (method === 'enter') {
    fireEvent.keyDown(screen.getByPlaceholderText('Search'), {key: 'Enter', keyCode: 13});
  } else {
    await user.click(screen.getByTitle('007 café'));
  }
  expect(setFilter).toHaveBeenLastCalledWith(['007 café']);
  const option = screen.getByTitle('007 café').closest('.list__item');
  expect(option).toHaveClass('selected');
  await user.click(option as HTMLElement);
  expect(setFilter).toHaveBeenLastCalledWith([]);
});

test('ordinary filters remain limited to domain suggestions', async () => {
  const user = userEvent.setup();
  const setFilter = jest.fn();
  renderWithTheme(
    <IntlProvider locale="en" messages={messages.en}>
      <MultiSelectFilter
        filter={{id: 'local', domain: ['known'], value: []} as any}
        setFilter={setFilter}
      />
    </IntlProvider>
  );
  await user.click(screen.getByText('Enter a value'));
  await user.type(screen.getByPlaceholderText('Search'), 'unknown');
  fireEvent.keyDown(screen.getByPlaceholderText('Search'), {key: 'Enter', keyCode: 13});
  expect(screen.queryByTitle('unknown')).not.toBeInTheDocument();
  expect(setFilter).not.toHaveBeenCalled();
});

test('keyboard navigation can choose a metadata suggestion below the custom value', async () => {
  const user = userEvent.setup();
  const setFilter = jest.fn();
  renderWithTheme(
    <IntlProvider locale="en" messages={messages.en}>
      <MultiSelectFilter
        allowCustomValues
        filter={{id: 'tile', domain: ['known'], value: []} as any}
        setFilter={setFilter}
      />
    </IntlProvider>
  );
  await user.click(screen.getByText('Enter a value'));
  const input = screen.getByPlaceholderText('Search');
  await user.type(input, 'kn');
  fireEvent.keyDown(input, {key: 'ArrowDown', keyCode: 40});
  fireEvent.keyDown(input, {key: 'ArrowDown', keyCode: 40});
  fireEvent.keyDown(input, {key: 'Enter', keyCode: 13});
  expect(setFilter).toHaveBeenLastCalledWith(['known']);
});
