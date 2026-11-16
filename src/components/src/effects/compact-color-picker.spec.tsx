// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {IntlProvider} from 'react-intl';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';

import {ArrowDownSmall} from '../common/icons';
import CompactColorPicker from './compact-color-picker';

test('color endpoint buttons have distinct names and open their dialog from the keyboard', async () => {
  const user = userEvent.setup();
  const onSetColor = jest.fn();
  render(
    <IntlProvider locale="en">
      <ThemeProvider theme={theme}>
        {['Start color', 'End color'].map(label => (
          <CompactColorPicker
            key={label}
            label={label}
            color={[10, 20, 30]}
            onSetColor={onSetColor}
            Icon={ArrowDownSmall}
          />
        ))}
      </ThemeProvider>
    </IntlProvider>
  );

  for (const label of ['Start color', 'End color']) {
    const button = screen.getByRole('button', {name: label});
    expect(button).toHaveAttribute('aria-haspopup', 'dialog');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    button.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('dialog', {name: label})).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveFocus();
  }
  expect(onSetColor).not.toHaveBeenCalled();
});
