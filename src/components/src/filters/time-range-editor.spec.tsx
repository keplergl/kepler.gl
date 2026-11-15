// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithTheme} from 'test/helpers/component-jest-utils';
import TimeRangeEditor from './time-range-editor';

const start = Date.parse('2025-01-15T12:00:00Z');
const end = Date.parse('2025-01-15T18:00:00Z');
const domain = [Date.parse('2025-01-01T00:00:00Z'), Date.parse('2025-02-01T00:00:00Z')];

function setup(overrides: Partial<React.ComponentProps<typeof TimeRangeEditor>> = {}) {
  const props = {value: [start, end], domain, onChange: jest.fn(), onOpen: jest.fn(), ...overrides};
  const result = renderWithTheme(<TimeRangeEditor {...props}>Selected dates</TimeRangeEditor>);
  return {...result, props};
}

function open() {
  fireEvent.click(screen.getByRole('button', {name: 'Edit time range'}));
}
function change(label: string, value: string) {
  fireEvent.change(screen.getByRole('textbox', {name: label}), {target: {value}});
}
function apply() {
  fireEvent.click(screen.getByRole('button', {name: 'Apply'}));
}

test('keeps inputs hidden until requested, edits in the selected timezone and applies atomically', async () => {
  const {props} = setup({timezone: 'America/New_York'});
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  open();
  expect(props.onOpen).toHaveBeenCalledTimes(1);
  await waitFor(() => expect(screen.getByRole('textbox', {name: 'Start'})).toHaveFocus());
  expect(screen.getByRole('textbox', {name: 'Start'})).toHaveValue(
    '2025-01-15 07:00:00.000 -05:00'
  );
  change('Start', '2025-01-15 08:30:00');
  change('End', '2025-01-15 10:00:00');
  expect(props.onChange).not.toHaveBeenCalled();
  apply();
  expect(props.onChange).toHaveBeenCalledWith([
    Date.parse('2025-01-15T13:30:00Z'),
    Date.parse('2025-01-15T15:00:00Z')
  ]);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByRole('button', {name: 'Edit time range'})).toHaveFocus();
});

test.each([
  ['', '2025-01-15 18:00:00', /valid date/],
  ['2025-02-30', '2025-01-15 18:00:00', /valid date/],
  ['not a date', '2025-01-15 18:00:00', /valid date/],
  ['2024-12-31', '2025-01-15 18:00:00', /data range/],
  ['2025-01-15', '2025-02-02', /data range/],
  ['2025-01-16', '2025-01-15', /on or after/]
])('rejects invalid selection %s to %s without applying', (from, to, message) => {
  const {props} = setup();
  open();
  change('Start', from);
  change('End', to);
  apply();
  expect(screen.getByRole('alert')).toHaveTextContent(message);
  expect(props.onChange).not.toHaveBeenCalled();
  expect(screen.getByRole('textbox', {name: 'Start'})).toHaveAttribute('aria-invalid', 'true');
});

test.each(['Cancel', 'Escape'])('discards drafts and restores focus on %s', async action => {
  const user = userEvent.setup();
  const {props} = setup();
  const trigger = screen.getByRole('button', {name: 'Edit time range'});
  trigger.focus();
  await user.keyboard('{Enter}');
  await waitFor(() => expect(screen.getByRole('textbox', {name: 'Start'})).toHaveFocus());
  change('Start', '2025-01-20');
  if (action === 'Escape') await user.keyboard('{Escape}');
  else fireEvent.click(screen.getByRole('button', {name: 'Cancel'}));
  expect(props.onChange).not.toHaveBeenCalled();
  expect(trigger).toHaveFocus();
  open();
  expect(screen.getByRole('textbox', {name: 'Start'})).toHaveValue(
    '2025-01-15 12:00:00.000 +00:00'
  );
});

test('selects the containing bin in interval mode without editing its width', () => {
  const day = 86400000;
  const {props} = setup({interval: true, marks: [start, start + day, start + day * 2]});
  open();
  expect(screen.queryByRole('textbox', {name: 'End'})).not.toBeInTheDocument();
  change('Time', '2025-01-16 16:00:00');
  apply();
  expect(props.onChange).toHaveBeenCalledWith([start + day, start + day * 2 - 1]);
});

test.each(['2025-01-15 18:00:00', '2025-01-15 23:59:59.999'])(
  'keeps a second-half-bin timestamp %s in its containing interval',
  time => {
    const day = 86400000;
    const midnight = Date.parse('2025-01-15T00:00:00Z');
    const {props} = setup({interval: true, marks: [midnight, midnight + day, midnight + day * 2]});
    open();
    change('Time', time);
    apply();
    expect(props.onChange).toHaveBeenCalledWith([midnight, midnight + day - 1]);
  }
);

test('retains milliseconds and the offset of a repeated daylight-saving time', () => {
  const repeated = Date.parse('2025-11-02T01:30:00.123-05:00');
  const {props} = setup({
    timezone: 'America/New_York',
    value: [repeated, repeated + 1000],
    domain: [repeated - 86400000, repeated + 86400000]
  });
  open();
  apply();
  expect(props.onChange).toHaveBeenCalledWith([repeated, repeated + 1000]);
});

test('rejects a nonexistent local time at the daylight-saving transition', () => {
  const before = Date.parse('2025-03-09T00:00:00-05:00');
  const after = Date.parse('2025-03-10T00:00:00-04:00');
  const {props} = setup({
    timezone: 'America/New_York',
    value: [before, after],
    domain: [before, after]
  });
  open();
  change('Start', '2025-03-09 02:30:00');
  apply();
  expect(screen.getByRole('alert')).toHaveTextContent(/valid date/);
  expect(props.onChange).not.toHaveBeenCalled();
});

test('disables editing when there is no finite data domain', () => {
  setup({domain: null});
  expect(screen.getByRole('button', {name: 'Edit time range'})).toBeDisabled();
});
