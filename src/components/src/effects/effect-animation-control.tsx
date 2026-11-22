// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import moment from 'moment-timezone';
import {DEFAULT_TIMEZONE, LIGHT_AND_SHADOW_EFFECT, SURFACE_FOG_TYPE} from '@kepler.gl/constants';
import {getAnimatableEffectParameters, getEffectAnimationEntries} from '@kepler.gl/effects';
import {Effect, EffectParameterAnimation, EffectUpdateProps} from '@kepler.gl/types';
import {roundValToStep} from '@kepler.gl/utils';

import {Add, ArrowDownSmall, Close, Help, Trash} from '../common/icons';
import {Button, Input, PanelLabel, Tooltip} from '../common/styled-components';
import Switch from '../common/switch';
import Portaled from '../common/portaled';
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

const Trigger = styled(IconButton)<{$active: boolean; $open: boolean; $visible: boolean}>`
  margin-left: 6px;
  color: ${props =>
    props.$active ? props.theme.panelHeaderIconActive : props.theme.panelHeaderIcon};
  opacity: ${props => (props.$open || props.$visible ? 1 : 0)};
  transition: opacity 120ms ease;
  .effect-configurator__pp-section:hover &,
  .effect-configurator__pp-section:focus-within &,
  .effect-configurator__animation-row:hover &,
  .effect-configurator__animation-row:focus-within &,
  &:hover,
  &:focus-visible {
    opacity: 1;
  }
`;

const Wrapper = styled.span`
  display: inline-flex;
  vertical-align: middle;
`;

const Content = styled(StyledPanelDropdown)<{$embedded: boolean}>`
  width: ${props => (props.$embedded ? '100%' : '288px')};
  padding: 0;
  border: ${props => (props.$embedded ? 'none' : `1px solid ${props.theme.panelBorderColor}`)};
  box-shadow: ${props => (props.$embedded ? 'none' : props.theme.panelBoxShadow)};
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
  blockId?: string;
  RangeSlider: ReturnType<typeof RangeSliderFactory>;
  step?: number;
  alwaysVisible?: boolean;
  durationMs?: number;
  embedded?: boolean;
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
  alwaysVisible = false,
  durationMs = 10000,
  embedded = false,
  onClose,
  updateEffectConfig
}: Props) {
  const description = getAnimatableEffectParameters(effect).find(d => d.name === name);
  const legacyHeight =
    effect.type === SURFACE_FOG_TYPE && name === 'height' && effect.parameters.animateHeight;
  const sequence = Array.isArray(effect.animation?.[name]);
  const entries = getEffectAnimationEntries(effect.animation?.[name]);
  const selectedIndex = blockId ? entries.findIndex(entry => entry.id === blockId) : 0;
  const saved: EffectParameterAnimation | undefined =
    entries[selectedIndex] ??
    (legacyHeight
      ? {
          startValue: effect.parameters.height,
          endValue: effect.parameters.heightEnd,
          easing: effect.parameters.linearEasing ? 'linear' : 'easeInOut'
        }
      : undefined);
  const initialStart =
    saved?.startValue ?? effect.parameters[name] ?? description?.defaultValue ?? 0;
  const initialEnd = saved?.endValue ?? initialStart;
  const [open, setOpen] = useState(embedded);
  const [startValue, setStartValue] = useState<Value>(() =>
    Array.isArray(initialStart) ? [...initialStart] : (initialStart as number)
  );
  const [endValue, setEndValue] = useState<Value>(() =>
    Array.isArray(initialEnd) ? [...initialEnd] : (initialEnd as number)
  );
  const [linear, setLinear] = useState(saved?.easing === 'linear');
  const [timed, setTimed] = useState(!saved || saved.startTimeMs !== undefined);
  const [startSeconds, setStartSeconds] = useState(() => String((saved?.startTimeMs ?? 0) / 1000));
  const [endSeconds, setEndSeconds] = useState(() =>
    String((saved?.endTimeMs ?? (saved ? durationMs : 10000)) / 1000)
  );
  const hasSavedAnimation = Boolean(saved);
  const savedStartTimeMs = saved?.startTimeMs;
  const savedEndTimeMs = saved?.endTimeMs;
  const previousTiming = useRef({hasSavedAnimation, savedStartTimeMs, savedEndTimeMs});
  useEffect(() => {
    const previous = previousTiming.current;
    previousTiming.current = {hasSavedAnimation, savedStartTimeMs, savedEndTimeMs};
    if (
      !embedded ||
      (previous.hasSavedAnimation === hasSavedAnimation &&
        previous.savedStartTimeMs === savedStartTimeMs &&
        previous.savedEndTimeMs === savedEndTimeMs)
    ) {
      return;
    }
    // A timeline drag updates saved timing while endpoint drafts remain in this inspector.
    setTimed(!hasSavedAnimation || savedStartTimeMs !== undefined);
    setStartSeconds(String((savedStartTimeMs ?? 0) / 1000));
    setEndSeconds(String((savedEndTimeMs ?? (hasSavedAnimation ? durationMs : 10000)) / 1000));
  }, [embedded, hasSavedAnimation, savedStartTimeMs, savedEndTimeMs, durationMs]);
  if (!description) return null;

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
    setOpen(false);
    onClose?.();
  };
  const apply = (remove = false) => {
    const animation = {...effect.animation};
    if (remove) {
      const remaining = sequence ? entries.filter((_, index) => index !== selectedIndex) : [];
      if (remaining.length) animation[name] = remaining;
      else delete animation[name];
    } else {
      const updated: EffectParameterAnimation = {
        ...(saved?.id ? {id: saved.id} : {}),
        startValue,
        endValue,
        easing: linear ? 'linear' : 'easeInOut',
        ...(timed
          ? {startTimeMs: Number(startSeconds) * 1000, endTimeMs: Number(endSeconds) * 1000}
          : {})
      };
      animation[name] = sequence
        ? entries.map((entry, index) => (index === selectedIndex ? updated : entry))
        : updated;
    }
    const parameters = {
      ...(!remove && !sequence ? {[name]: startValue} : {}),
      ...(legacyHeight ? {animateHeight: false} : {})
    };
    updateEffectConfig(null, effect.id, {
      animation,
      ...(Object.keys(parameters).length ? {parameters} : {})
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
  const helpId = `effect-transition-help-${effect.id}-${name}`;
  const timingId = `effect-animation-timing-${effect.id}-${name}`;
  const validTiming =
    !timed ||
    (startSeconds.trim() !== '' &&
      endSeconds.trim() !== '' &&
      Number.isFinite(Number(startSeconds) * 1000) &&
      Number.isFinite(Number(endSeconds) * 1000) &&
      Number(startSeconds) >= 0 &&
      Number(endSeconds) >= Number(startSeconds) &&
      (!sequence ||
        (Number(startSeconds) * 1000 >= (entries[selectedIndex - 1]?.endTimeMs ?? 0) &&
          Number(endSeconds) * 1000 <= (entries[selectedIndex + 1]?.startTimeMs ?? Infinity))));
  const editors = [
    {title: 'Start', value: startValue, setValue: setStartValue},
    {title: 'End', value: endValue, setValue: setEndValue}
  ];

  const content = (
    <Content
      $embedded={embedded}
      role={embedded ? 'group' : undefined}
      aria-label={embedded ? `Effect Transition: ${label}` : undefined}
    >
      <Header>
        <div>
          {embedded ? (
            label
          ) : (
            <>
              Effect Transition{' '}
              <IconButton
                type="button"
                aria-label="About effect transitions"
                aria-describedby={helpId}
                data-tip
                data-for={helpId}
              >
                <Help height="14px" />
              </IconButton>
              <Tooltip id={helpId} role="tooltip" effect="solid" place="bottom" delayShow={200}>
                <div
                  style={{maxWidth: 220, whiteSpace: 'normal', textAlign: 'left', lineHeight: 1.4}}
                >
                  Animates this setting from Start to End during playback in the Animation panel or
                  video export. Turn on Linear easing for a constant rate; otherwise it eases in and
                  out. Start and end times use seconds from animation start. The end value is held
                  after the transition finishes.
                  {isTimestamp &&
                    ' This range overrides Current time and Animation time only during playback.'}
                </div>
              </Tooltip>
              <ParameterName>{label.replace(/([a-z])([A-Z])/g, '$1 $2')}</ParameterName>
            </>
          )}
        </div>
        <HeaderActions>
          {saved ? (
            <IconButton
              type="button"
              aria-label="Remove animation"
              title="Remove animation"
              onClick={() => apply(true)}
            >
              <Trash height="16px" />
            </IconButton>
          ) : null}
          {embedded && (
            <IconButton type="button" aria-label="Close effect settings" onClick={close}>
              <Close height="14px" />
            </IconButton>
          )}
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
          {!sequence && (
            <ToggleRow>
              <PanelLabel as="label" htmlFor={timingId}>
                Use full animation duration
              </PanelLabel>
              <Switch
                id={timingId}
                checked={!timed}
                onChange={event => setTimed(!event.target.checked)}
              />
            </ToggleRow>
          )}
          {timed && (
            <>
              <PanelLabel htmlFor={`${timingId}-start`}>Start time (seconds)</PanelLabel>
              <Input
                secondary
                id={`${timingId}-start`}
                type="number"
                min={0}
                step={0.01}
                // Keep saved precision until this time field is edited.
                value={formatTimeInput(startSeconds)}
                onChange={event => setStartSeconds(formatTimeInput(event.target.value))}
              />
              <PanelLabel htmlFor={`${timingId}-end`}>End time (seconds)</PanelLabel>
              <Input
                secondary
                id={`${timingId}-end`}
                type="number"
                min={0}
                step={0.01}
                value={formatTimeInput(endSeconds)}
                onChange={event => setEndSeconds(formatTimeInput(event.target.value))}
              />
              {!validTiming && (
                <ParameterName role="alert">
                  Enter non-negative times with End at or after Start.
                </ParameterName>
              )}
            </>
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

  if (embedded) return open ? content : null;

  return (
    <Wrapper>
      <Trigger
        type="button"
        $active={Boolean(saved)}
        $open={open}
        $visible={alwaysVisible}
        aria-label={`${saved ? 'Edit animation for' : 'Animate'} ${label}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        title="Animate this effect setting"
        onClick={() => {
          setStartValue(Array.isArray(initialStart) ? [...initialStart] : (initialStart as number));
          setEndValue(Array.isArray(initialEnd) ? [...initialEnd] : (initialEnd as number));
          setLinear(saved?.easing === 'linear');
          setTimed(!saved || saved.startTimeMs !== undefined);
          setStartSeconds(String((saved?.startTimeMs ?? 0) / 1000));
          setEndSeconds(String((saved?.endTimeMs ?? (saved ? durationMs : 10000)) / 1000));
          setOpen(true);
        }}
      >
        <Add height="14px" />
      </Trigger>
      <Portaled
        isOpened={open}
        onClose={close}
        top={24}
        left={24}
        modalProps={{contentLabel: `Effect Transition: ${label}`}}
      >
        {content}
      </Portaled>
    </Wrapper>
  );
}
