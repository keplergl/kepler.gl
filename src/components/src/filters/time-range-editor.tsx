// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {PropsWithChildren, useId, useMemo, useRef, useState} from 'react';
import styled, {useTheme} from 'styled-components';
import moment from 'moment-timezone';
import {bisectRight} from 'd3-array';
import {intervalBinFromMarks} from '@kepler.gl/utils';
import {Button, Input, PanelLabel} from '../common/styled-components';
import Portaled from '../common/portaled';
import TippyTooltip from '../common/tippy-tooltip';

const INPUT_FORMATS = [
  'YYYY-MM-DD HH:mm:ss.SSS Z',
  'YYYY-MM-DD HH:mm:ss Z',
  'YYYY-MM-DD HH:mm:ss.SSS',
  'YYYY-MM-DD HH:mm:ss',
  'YYYY-MM-DD HH:mm',
  'YYYY-MM-DD'
];

const Anchor = styled.div`
  position: relative;
  min-width: 0;
`;

const Trigger = styled(Button)`
  display: block;
  min-width: 0;
  max-width: 100%;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  text-transform: none;
  letter-spacing: inherit;

  &:hover,
  &:focus,
  &:active {
    background: transparent;
    color: inherit;
    text-decoration: underline dotted;
    text-underline-offset: 3px;
  }

  &:focus-visible {
    outline: 2px solid ${props => props.theme.activeColor};
    outline-offset: 3px;
  }
`;

const Editor = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: min(320px, calc(100vw - 80px));
  box-sizing: border-box;
  padding: 12px;
  background: ${props => props.theme.panelBackground};
  color: ${props => props.theme.textColor};
  box-shadow: ${props => props.theme.panelBoxShadow};
  border: 1px solid ${props => props.theme.panelBorderColor};
  font-size: ${props => props.theme.selectFontSize};

  input {
    width: 100%;
    box-sizing: border-box;
  }
`;

const Hint = styled.div`
  color: ${props => props.theme.subtextColor};
  line-height: 1.4;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

type TimeRangeEditorProps = PropsWithChildren<{
  value: number[];
  domain: number[] | null;
  timezone?: string | null;
  interval?: boolean;
  marks?: number[] | null;
  onChange: (value: number[]) => void;
  onOpen?: () => void;
}>;

export default function TimeRangeEditor({
  value,
  domain,
  timezone,
  interval = false,
  marks,
  onChange,
  onOpen,
  children
}: TimeRangeEditorProps) {
  const zone = timezone || 'UTC';
  const theme = useTheme();
  const popoverTheme = useMemo(() => ({...theme, transitionFast: 'none'}), [theme]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(['', '']);
  const [error, setError] = useState('');
  const trigger = useRef<HTMLButtonElement>(null);
  const firstInput = useRef<HTMLInputElement>(null);
  const id = useId();
  const disabled = !domain || domain.length !== 2 || !domain.every(Number.isFinite);

  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };
  const startEditing = () => {
    // The first calendar bin can start before the first record. Use a timestamp
    // inside that bin and the data domain so confirming it preserves the selection.
    const initialValue = interval && domain ? [Math.max(domain[0], value[0])] : value;
    setDraft(
      initialValue.map(timestamp => moment.utc(timestamp).tz(zone).format(INPUT_FORMATS[0]))
    );
    setError('');
    setOpen(true);
    onOpen?.();
  };
  const parse = (text: string) => {
    // The round trip also rejects nonexistent local times during a daylight-saving jump.
    // Offsets in the initial values preserve the two occurrences of a repeated local time.
    for (const format of INPUT_FORMATS) {
      const date = moment.tz(text.trim(), format, true, zone);
      if (date.isValid() && date.format(format) === text.trim()) return date.valueOf();
    }
    return NaN;
  };
  const apply = (event: React.FormEvent) => {
    event.preventDefault();
    if (!domain) return;
    const start = parse(draft[0]);
    const end = interval ? start : parse(draft[1]);
    if (!Number.isFinite(start) || !Number.isFinite(end)) {
      setError('Enter a valid date and time for each field.');
      return;
    }
    if (start < domain[0] || end > domain[1] || start > domain[1] || end < domain[0]) {
      setError('Choose dates within the data range.');
      return;
    }
    if (!interval && start > end) {
      setError('The end must be on or after the start.');
      return;
    }
    if (interval && (!marks || marks.length < 2)) {
      setError('No intervals are available for this timeline.');
      return;
    }
    if (interval && marks) {
      // Scrubbing snaps to the nearest mark; exact entry selects the bin containing the time.
      const binIndex = Math.max(0, Math.min(marks.length - 2, bisectRight(marks, start) - 1));
      onChange(intervalBinFromMarks(marks, marks[binIndex], 1));
    } else {
      onChange([start, end]);
    }
    close();
  };

  return (
    <Anchor>
      <TippyTooltip placement="top" delay={[500, 0]} render={() => 'Edit time range'}>
        <Trigger
          ref={trigger}
          type="button"
          aria-label="Edit time range"
          aria-haspopup="dialog"
          aria-expanded={open}
          disabled={disabled}
          onClick={startEditing}
        >
          {children}
        </Trigger>
      </TippyTooltip>
      <Portaled
        theme={popoverTheme}
        isOpened={open}
        left={0}
        top={0}
        onClose={close}
        modalProps={{
          contentLabel: 'Edit time range',
          onAfterOpen: () => firstInput.current?.focus()
        }}
      >
        <Editor onSubmit={apply}>
          <Hint id={`${id}-hint`}>
            {zone}
            {interval ? ' · Select a time in the desired interval.' : ''}
          </Hint>
          {(interval ? ['Time'] : ['Start', 'End']).map((label, index) => (
            <div key={label}>
              <PanelLabel htmlFor={`${id}-${index}`}>{label}</PanelLabel>
              <Input
                secondary
                id={`${id}-${index}`}
                ref={index === 0 ? firstInput : undefined}
                value={draft[index]}
                placeholder="YYYY-MM-DD HH:mm:ss"
                aria-describedby={`${id}-hint${error ? ` ${id}-error` : ''}`}
                aria-invalid={Boolean(error)}
                autoComplete="off"
                onChange={event => {
                  setDraft(current =>
                    current.map((text, i) => (i === index ? event.target.value : text))
                  );
                  setError('');
                }}
              />
            </div>
          ))}
          {error ? (
            <div id={`${id}-error`} role="alert">
              {error}
            </div>
          ) : null}
          <Actions>
            <Button small secondary type="button" onClick={close}>
              Cancel
            </Button>
            <Button small type="submit">
              Apply
            </Button>
          </Actions>
        </Editor>
      </Portaled>
    </Anchor>
  );
}
