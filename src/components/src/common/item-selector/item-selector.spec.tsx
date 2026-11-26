// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
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

  test.each(['keyboard', 'pointer'])(
    'reorders default field chips with the %s only when opted in',
    async input => {
      const onChange = jest.fn();
      const reorderItems = jest.fn();
      const user = userEvent.setup();
      const selector = (reorder?: typeof reorderItems, selected = ['Alpha', 'Beta']) => (
        <IntlProvider locale="en" messages={messages.en}>
          <ItemSelector
            options={['Alpha', 'Beta']}
            selectedItems={selected}
            onChange={onChange}
            reorderItems={reorder}
          />
        </IntlProvider>
      );
      const view = renderWithTheme(selector());
      expect(screen.queryByRole('button', {name: 'Reorder Alpha'})).not.toBeInTheDocument();

      view.rerender(selector(reorderItems));
      const first = screen.getByRole('button', {name: 'Reorder Alpha'});
      const second = screen.getByRole('button', {name: 'Reorder Beta'});
      // JSDOM has no layout. Give dnd-kit distinct positions to measure.
      for (const [i, handle] of [first, second].entries()) {
        const box = {
          x: i * 100,
          y: 0,
          top: 0,
          bottom: 24,
          left: i * 100,
          right: i * 100 + 100,
          width: 100,
          height: 24
        } as DOMRect;
        handle.parentElement!.getBoundingClientRect = () => box;
      }
      first.closest('.chickleted-input')!.getBoundingClientRect = () =>
        ({x: 0, y: 0, left: 0, top: 0, right: 200, bottom: 24, width: 200, height: 24} as DOMRect);
      if (input === 'keyboard') {
        await user.tab();
        expect(first).toHaveFocus();
        await user.keyboard(' ');
        await waitFor(() => expect(first).toHaveAttribute('aria-pressed', 'true'));
        await user.keyboard('{ArrowRight} ');
      } else {
        await user.pointer([
          {keys: '[MouseLeft>]', target: first, coords: {x: 10, y: 10, clientX: 10, clientY: 10}},
          {target: second, coords: {x: 110, y: 10, clientX: 110, clientY: 10}},
          {keys: '[/MouseLeft]', target: second}
        ]);
      }

      expect(reorderItems).toHaveBeenCalledWith(['Beta', 'Alpha']);
      view.rerender(selector(reorderItems, ['Beta', 'Alpha']));
      if (input === 'keyboard') expect(first).toHaveFocus();
      expect(onChange).not.toHaveBeenCalled();
    }
  );

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
