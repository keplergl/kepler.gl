// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState} from 'react';
import styled from 'styled-components';
import {SURFACE_FOG_TYPE} from '@kepler.gl/constants';
import {getAnimatableEffectParameters} from '@kepler.gl/effects';
import {Effect, EffectUpdateProps} from '@kepler.gl/types';

import {Add, ArrowDownSmall, Help, Trash} from '../common/icons';
import {Button, PanelLabel, Tooltip} from '../common/styled-components';
import Switch from '../common/switch';
import Portaled from '../common/portaled';
import RangeSliderFactory from '../common/range-slider';
import CompactColorPicker, {StyledPanelDropdown} from './compact-color-picker';

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

const Trigger = styled(IconButton)<{$active: boolean; $open: boolean}>`
  margin-left: 6px;
  color: ${props =>
    props.$active ? props.theme.panelHeaderIconActive : props.theme.panelHeaderIcon};
  opacity: ${props => (props.$open ? 1 : 0)};
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

const Content = styled(StyledPanelDropdown)`
  width: 288px;
  padding: 0;
  border: 1px solid ${props => props.theme.panelBorderColor};
  box-shadow: ${props => props.theme.panelBoxShadow};
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

  .kg-range-slider__input {
    flex: 0 0 96px;
    width: 96px;
    height: 32px;
    margin-left: 12px;
    padding: 3px 6px;
    border-color: ${props => props.theme.panelBorderColor};
    text-align: center;
    text-overflow: clip;
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
  RangeSlider: ReturnType<typeof RangeSliderFactory>;
  step?: number;
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
  RangeSlider,
  step = 0.001,
  updateEffectConfig
}: Props) {
  const [open, setOpen] = useState(false);
  const [startValue, setStartValue] = useState<Value>(0);
  const [endValue, setEndValue] = useState<Value>(0);
  const [linear, setLinear] = useState(false);
  const description = getAnimatableEffectParameters(effect).find(d => d.name === name);
  if (!description) return null;

  const label = typeof description.label === 'string' ? description.label : name;
  const legacyHeight =
    effect.type === SURFACE_FOG_TYPE && name === 'height' && effect.parameters.animateHeight;
  const saved =
    effect.animation?.[name] ??
    (legacyHeight
      ? {
          startValue: effect.parameters.height,
          endValue: effect.parameters.heightEnd,
          easing: effect.parameters.linearEasing ? 'linear' : 'easeInOut'
        }
      : undefined);
  const close = () => setOpen(false);
  const apply = (remove = false) => {
    const animation = {...effect.animation};
    if (remove) {
      delete animation[name];
    } else {
      animation[name] = {startValue, endValue, easing: linear ? 'linear' : 'easeInOut'};
    }
    const parameters = {
      ...(!remove ? {[name]: startValue} : {}),
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
      )
    );
  };
  const range = [description.min, description.max];
  const easingId = `effect-animation-linear-${effect.id}-${name}`;
  const helpId = `effect-transition-help-${effect.id}-${name}`;
  const editors = [
    {title: 'Start', value: startValue, setValue: setStartValue},
    {title: 'End', value: endValue, setValue: setEndValue}
  ];

  return (
    <Wrapper>
      <Trigger
        type="button"
        $active={Boolean(saved)}
        $open={open}
        aria-label={`${saved ? 'Edit animation for' : 'Animate'} ${label}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        title="Animate this effect setting"
        onClick={() => {
          const start = saved?.startValue ?? effect.parameters[name] ?? description.defaultValue;
          const end = saved?.endValue ?? start;
          setStartValue(Array.isArray(start) ? [...start] : (start as number));
          setEndValue(Array.isArray(end) ? [...end] : (end as number));
          setLinear(saved?.easing === 'linear');
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
        <Content>
          <Header>
            <div>
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
                  Animates this setting from Start to End with Run in the effects panel or during
                  video export. Turn on Linear easing for a constant rate; otherwise it eases in and
                  out.
                </div>
              </Tooltip>
              <ParameterName>{label.replace(/([a-z])([A-Z])/g, '$1 $2')}</ParameterName>
            </div>
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
          </Header>
          <Body>
            {description.type === 'color' ? (
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
                                ? previous.map((component, i) =>
                                    i === index ? next[1] : component
                                  )
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
                disabled={!isValid(startValue) || !isValid(endValue)}
                onClick={() => apply()}
              >
                Save
              </Button>
            </Actions>
          </Body>
        </Content>
      </Portaled>
    </Wrapper>
  );
}
