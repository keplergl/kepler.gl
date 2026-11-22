// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import moment from 'moment-timezone';
import {DEFAULT_TIMEZONE, LIGHT_AND_SHADOW_EFFECT} from '@kepler.gl/constants';
import {getAnimatableEffectParameters} from '@kepler.gl/effects';
import {Effect, EffectParameterAnimation, EffectUpdateProps} from '@kepler.gl/types';
import {roundValToStep} from '@kepler.gl/utils';

import {ArrowDownSmall, Close, Trash} from '../common/icons';
import {Button, Input, PanelLabel} from '../common/styled-components';
import Switch from '../common/switch';
import RangeSliderFactory from '../common/range-slider';
import CompactColorPicker, {StyledPanelDropdown} from './compact-color-picker';
import {EffectDateTimeInput} from './effect-time-configurator';

const formatTimeInput = (value: string) =>
  value.trim() ? String(roundValToStep(0, 0.01, Number(value))) : value;

const IconButton = styled(Button).attrs({link: true})`
  padding: 0;
  width: 20px;
  height: 20px;
  background: transparent;
  color: ${props => props.theme.panelHeaderIcon};
  border: none;
  &:hover,
  &:focus-visible {
    color: ${props => props.theme.panelHeaderIconHover};
  }
  & > svg {
    margin: 0;
  }
`;

const Content = styled(StyledPanelDropdown)`
  width: 100%;
  padding: 0;
  border: none;
  box-shadow: none;
  color: ${props => props.theme.textColor};
  font-size: ${props => props.theme.inputFontSize};
  text-transform: none;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: ${props => props.theme.panelBackgroundHover};
  border-bottom: 1px solid ${props => props.theme.panelBorderColor};
  font-weight: 500;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 4px;
`;

const ParameterName = styled.div`
  color: ${props => props.theme.subtextColor};
  font-size: 11px;
  font-weight: 400;
  text-transform: capitalize;
  margin-top: 3px;
`;

const Body = styled.div`
  padding: 14px;
`;

const Field = styled.div`
  margin-bottom: 12px;

  ${Input} {
    width: 100%;
    height: 32px;
    padding: 3px 6px;
    font-size: ${props => props.theme.sliderInputFontSize};
    border-color: ${props => props.theme.panelBorderColor};
    text-align: center;
    text-overflow: clip;
  }

  .kg-range-slider__input {
    flex: 0 0 96px;
    width: 96px;
    margin-left: 12px;
  }
`;

const TimeFields = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 8px;
`;

const ColorRow = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  ${PanelLabel} {
    margin: 0;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
`;

type Props = {
  effect: Effect;
  name: string;
  blockId: string;
  RangeSlider: ReturnType<typeof RangeSliderFactory>;
  step?: number;
  onClose?: () => void;
  updateEffectConfig: (
    event: Event | null | undefined,
    id: string,
    props: Partial<EffectUpdateProps>
  ) => void;
};

type Value = number | number[];

/** Edit animation endpoints together without applying draft values to the map. */
export default function EffectAnimationControl({
  effect,
  name,
  blockId,
  RangeSlider,
  step = 0.001,
  onClose,
  updateEffectConfig
}: Props) {
  const description = getAnimatableEffectParameters(effect).find(d => d.name === name);
  const entries = effect.animation?.[name] ?? [];
  const selectedIndex = entries.findIndex(entry => entry.id === blockId);
  const saved: EffectParameterAnimation | undefined = entries[selectedIndex];
  const initialStart = saved?.startValue ?? 0;
  const initialEnd = saved?.endValue ?? 0;
  const [startValue, setStartValue] = useState<Value>(() =>
    Array.isArray(initialStart) ? [...initialStart] : (initialStart as number)
  );
  const [endValue, setEndValue] = useState<Value>(() =>
    Array.isArray(initialEnd) ? [...initialEnd] : (initialEnd as number)
  );
  const [linear, setLinear] = useState(saved?.easing === 'linear');
  const [startSeconds, setStartSeconds] = useState(() => String((saved?.startTimeMs ?? 0) / 1000));
  const [endSeconds, setEndSeconds] = useState(() => String((saved?.endTimeMs ?? 0) / 1000));
  const savedStartTimeMs = saved?.startTimeMs;
  const savedEndTimeMs = saved?.endTimeMs;
  useEffect(() => {
    // Follow timeline drags without replacing endpoint drafts.
    setStartSeconds(String((savedStartTimeMs ?? 0) / 1000));
    setEndSeconds(String((savedEndTimeMs ?? 0) / 1000));
  }, [savedStartTimeMs, savedEndTimeMs]);
  if (!description || !saved) return null;

  const isTimestamp = effect.type === LIGHT_AND_SHADOW_EFFECT.type && name === 'timestamp';
  const timezone = moment.tz.zone(effect.parameters.timezone || '')
    ? effect.parameters.timezone
    : DEFAULT_TIMEZONE;
  const label = isTimestamp
    ? 'Date & Time'
    : typeof description.label === 'string'
    ? description.label
    : name;
  const close = () => {
    onClose?.();
  };
  const apply = (remove = false) => {
    const animation = {...effect.animation};
    if (remove) {
      const remaining = entries.filter((_, index) => index !== selectedIndex);
      if (remaining.length) animation[name] = remaining;
      else delete animation[name];
    } else {
      const updated: EffectParameterAnimation = {
        id: saved.id,
        startValue,
        endValue,
        easing: linear ? 'linear' : 'easeInOut',
        startTimeMs: Number(startSeconds) * 1000,
        endTimeMs: Number(endSeconds) * 1000
      };
      animation[name] = entries.map((entry, index) => (index === selectedIndex ? updated : entry));
    }
    updateEffectConfig(null, effect.id, {
      animation
    });
    close();
  };
  const vectorSize =
    description.type === 'color'
      ? 3
      : Array.isArray(description.defaultValue)
      ? description.defaultValue.length
      : 0;
  const isValid = (value: Value) => {
    const values = Array.isArray(value) ? Array.from(value) : [value];
    return (
      (vectorSize ? Array.isArray(value) && values.length === vectorSize : !Array.isArray(value)) &&
      values.every(
        part => Number.isFinite(part) && part >= description.min && part <= description.max
      ) &&
      (!isTimestamp || Number.isFinite(new Date(value as number).getTime()))
    );
  };
  const range = [description.min, description.max];
  const easingId = `effect-animation-linear-${effect.id}-${name}`;
  const timingId = `effect-animation-timing-${effect.id}-${name}`;
  const validTiming =
    startSeconds.trim() !== '' &&
    endSeconds.trim() !== '' &&
    Number.isFinite(Number(startSeconds) * 1000) &&
    Number.isFinite(Number(endSeconds) * 1000) &&
    Number(startSeconds) >= 0 &&
    Number(endSeconds) >= Number(startSeconds) &&
    Number(startSeconds) * 1000 >= (entries[selectedIndex - 1]?.endTimeMs ?? 0) &&
    Number(endSeconds) * 1000 <= (entries[selectedIndex + 1]?.startTimeMs ?? Infinity);
  const editors = [
    {title: 'Start', value: startValue, setValue: setStartValue},
    {title: 'End', value: endValue, setValue: setEndValue}
  ];

  return (
    <Content role="group" aria-label={`Effect Transition: ${label}`}>
      <Header>
        <div>{label}</div>
        <HeaderActions>
          <IconButton
            type="button"
            aria-label="Remove animation"
            title="Remove animation"
            onClick={() => apply(true)}
          >
            <Trash height="16px" />
          </IconButton>
          <IconButton type="button" aria-label="Close effect settings" onClick={close}>
            <Close height="14px" />
          </IconButton>
        </HeaderActions>
      </Header>
      <Body>
        {isTimestamp ? (
          <>
            {editors.map(({title, value, setValue}) => (
              <Field key={title} role="group" aria-label={`${title} date and time`}>
                <PanelLabel>{title} date and time</PanelLabel>
                <EffectDateTimeInput
                  timestamp={value as number}
                  timezone={timezone}
                  label={title}
                  onChange={setValue}
                />
              </Field>
            ))}
            <ParameterName>Time zone: {timezone}</ParameterName>
          </>
        ) : description.type === 'color' ? (
          <ColorRow>
            {editors.map(({title, value, setValue}) => (
              <CompactColorPicker
                key={title}
                label={`${title} color`}
                color={value as [number, number, number]}
                onSetColor={setValue}
                Icon={ArrowDownSmall}
              />
            ))}
          </ColorRow>
        ) : (
          editors.map(({title, value, setValue}) => (
            <Field key={title} role="group" aria-label={`${title} value`}>
              {(Array.isArray(value) ? value : [value]).map((part, index) => {
                const inputIdPrefix = `effect-animation-${effect.id}-${name}-${title}-${index}`;
                return (
                  <div key={index}>
                    <PanelLabel htmlFor={`${inputIdPrefix}-value1`}>
                      {title} value
                      {Array.isArray(value)
                        ? ` (${
                            (Array.isArray(description.label) && description.label[index]) ||
                            index + 1
                          })`
                        : ''}
                    </PanelLabel>
                    <RangeSlider
                      showInput
                      inputIdPrefix={inputIdPrefix}
                      inputTheme="secondary"
                      isRanged={false}
                      value0={range[0]}
                      value1={part}
                      range={range}
                      step={step}
                      onChange={next =>
                        setValue(previous =>
                          Array.isArray(previous)
                            ? previous.map((component, i) => (i === index ? next[1] : component))
                            : next[1]
                        )
                      }
                    />
                  </div>
                );
              })}
            </Field>
          ))
        )}
        <Field>
          <TimeFields>
            <div>
              <PanelLabel htmlFor={`${timingId}-start`}>Start time (seconds)</PanelLabel>
              <Input
                secondary
                id={`${timingId}-start`}
                type="number"
                min={0}
                step={0.01}
                // Keep saved precision until this time field is edited.
                value={formatTimeInput(startSeconds)}
                onChange={event => {
                  setStartSeconds(formatTimeInput(event.target.value));
                }}
              />
            </div>
            <div>
              <PanelLabel htmlFor={`${timingId}-end`}>End time (seconds)</PanelLabel>
              <Input
                secondary
                id={`${timingId}-end`}
                type="number"
                min={0}
                step={0.01}
                value={formatTimeInput(endSeconds)}
                onChange={event => {
                  setEndSeconds(formatTimeInput(event.target.value));
                }}
              />
            </div>
          </TimeFields>
          {!validTiming && (
            <ParameterName role="alert">
              Enter non-negative times with End at or after Start.
            </ParameterName>
          )}
        </Field>
        <ToggleRow>
          <PanelLabel as="label" htmlFor={easingId}>
            Linear easing
          </PanelLabel>
          <Switch
            id={easingId}
            checked={linear}
            onChange={event => setLinear(event.target.checked)}
          />
        </ToggleRow>
        <Actions>
          <Button type="button" link onClick={close}>
            Cancel
          </Button>
          <Button
            type="button"
            secondary
            disabled={!isValid(startValue) || !isValid(endValue) || !validTiming}
            onClick={() => apply()}
          >
            Save
          </Button>
        </Actions>
      </Body>
    </Content>
  );
}
