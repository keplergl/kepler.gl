// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {IntlProvider} from 'react-intl';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';

import {messages} from '@kepler.gl/localization';
import {renderWithTheme} from 'test/helpers/component-jest-utils';
import ItemSelector from './item-selector';
import FieldSelectorFactory from '../field-selector';

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
  test('field dropdowns skip callback-only renders but select and clear through the latest callback', async () => {
    const FieldItem = jest.fn(({value, displayOption}) => <span>{displayOption(value)}</span>);
    const FieldSelector = FieldSelectorFactory(() => FieldItem);
    let fields = [
      {name: 'alpha', displayName: 'Alpha', type: 'integer', format: ''},
      {name: 'beta', displayName: 'Beta', type: 'integer', format: ''}
    ];
    let value: string | null = 'alpha';
    let disabled = false;
    const originalCallback = jest.fn();
    let onSelect = originalCallback;
    const node = () => (
      <IntlProvider locale="en" messages={messages.en}>
        <FieldSelector fields={fields} value={value} onSelect={onSelect} disabled={disabled} />
      </IntlProvider>
    );
    const view = render(node(), {
      wrapper: ({children}) => <ThemeProvider theme={theme}>{children}</ThemeProvider>
    });
    const user = userEvent.setup();

    FieldItem.mockClear();
    onSelect = jest.fn();
    view.rerender(node());
    expect(FieldItem).not.toHaveBeenCalled();

    await user.click(screen.getByText('Alpha'));
    await user.click(screen.getByText('Beta'));
    expect(onSelect).toHaveBeenCalledWith(fields[1]);
    expect(originalCallback).not.toHaveBeenCalled();

    value = 'beta';
    fields = fields.map(field => ({...field, displayName: `${field.displayName} updated`}));
    view.rerender(node());
    expect(screen.getByText('Beta updated')).toBeInTheDocument();
    fireEvent.click(view.container.querySelector('.item-selector__dropdown svg')!);
    expect(onSelect).toHaveBeenLastCalledWith(null);

    value = null;
    fields = [];
    disabled = true;
    view.rerender(node());
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText(messages.en['placeholder.selectField'])).toBeInTheDocument();
  });

  test('keeps disabled single selectors out of the tab order and blocks keyboard opening', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <IntlProvider locale="en" messages={messages.en}>
        <ItemSelector
          options={['Alpha', 'Beta']}
          selectedItems="Alpha"
          onChange={jest.fn()}
          multiSelect={false}
          searchable={false}
          disabled={true}
        />
      </IntlProvider>
    );
    const selector = screen.getByRole('button', {name: 'Alpha'});

    await user.tab();
    expect(selector).not.toHaveFocus();
    fireEvent.keyDown(selector, {key: 'Enter', keyCode: 13});
    expect(screen.queryByText('Beta')).not.toBeInTheDocument();
  });

  test('opens a single selector with the keyboard and restores focus after selection or Escape', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    renderWithTheme(
      <IntlProvider locale="en" messages={messages.en}>
        <ItemSelector
          options={['Alpha', 'Beta']}
          selectedItems="Alpha"
          onChange={onChange}
          multiSelect={false}
          searchable={false}
        />
      </IntlProvider>
    );
    const selector = screen.getByText('Alpha').closest('.item-selector')!;

    await user.tab();
    expect(selector).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByText('Beta')).toBeInTheDocument();
    fireEvent.keyDown(document.activeElement!, {key: 'ArrowDown', keyCode: 40});
    fireEvent.keyDown(document.activeElement!, {key: 'ArrowDown', keyCode: 40});
    fireEvent.keyDown(document.activeElement!, {key: 'Enter', keyCode: 13});

    expect(onChange).toHaveBeenCalledWith('Beta');
    expect(selector).toHaveFocus();
    expect(screen.queryByText('Beta')).not.toBeInTheDocument();

    await user.keyboard(' ');
    expect(screen.getByText('Beta')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByText('Beta')).not.toBeInTheDocument();
    expect(selector).toHaveFocus();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test('preserves object selections when Enter has no highlighted option', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    const selectedItem = {id: 'beta', label: 'Beta'};

    renderWithTheme(
      <IntlProvider locale="en" messages={messages.en}>
        <ItemSelector
          options={[{id: 'alpha', label: 'Alpha'}, selectedItem]}
          selectedItems={[selectedItem]}
          onChange={onChange}
          getOptionValue={option => option.id}
          displayOption={option => option.label}
        />
      </IntlProvider>
    );

    await user.click(screen.getByText('Beta'));
    fireEvent.keyDown(screen.getByPlaceholderText('Search'), {key: 'Enter', keyCode: 13});

    expect(onChange).toHaveBeenCalledWith([selectedItem]);
    expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();
  });
});
