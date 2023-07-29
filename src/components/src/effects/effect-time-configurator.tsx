import React, {useCallback, useMemo} from 'react';
import {injectIntl, IntlShape} from 'react-intl';
import styled from 'styled-components';

import {FormattedMessage} from '@kepler.gl/localization';
import {clamp} from '@kepler.gl/utils';
import {
  LIGHT_AND_SHADOW_EFFECT_TIME_MODES,
  LightAndShadowEffectTimeMode
} from '@kepler.gl/constants';

import {StyledTimePicker, StyledDatePicker, Tooltip} from '../common/styled-components';
import RangeSliderFactory from '../common/range-slider';
import Checkbox from '../common/checkbox';
import Button from '../common/data-table/button';
import {Pin} from '../common/icons';

const DAY_SLIDER_RANGE = 1000 * 60 * 60 * 24;

export type EffectTimeConfiguratorProps = {
  timestamp: string;
  onDateTimeChange: (time: number) => void;
  timeMode: LightAndShadowEffectTimeMode;
  onTimeModeChange: (newMode: LightAndShadowEffectTimeMode) => void;
  intl: IntlShape;
};

type StyledWrapperProps = {disabled?: boolean};
const StyledWrapper = styled.div<StyledWrapperProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;
  margin-bottom: 9px;
  opacity: ${props => (props.disabled ? 0.3 : 1)};
  ${props => (props.disabled ? 'pointer-events: none;' : '')}
`;

type SliderWrapperProps = {disabled?: boolean};
const SliderWrapper = styled.div<SliderWrapperProps>`
  margin-top: 13px;
  margin-right: 8px;
  margin-bottom: 17px;

  opacity: ${props => (props.disabled ? 0.3 : 1)};
  ${props => (props.disabled ? 'pointer-events: none;' : '')}
`;

const StyledButton = styled(Button)`
  color: ${props => props.theme.textColor};
  background-color: ${props => props.theme.inputBgd};
  height: 31px;
  padding: 5px;
  border-radius: 2px;
  :hover {
    background-color: ${props => props.theme.inputBgdHover};
  }
`;

const StyledRadio = styled(Checkbox)`
  .kg-checkbox__label {
    font-family: ${props => props.theme.fontFamily};
    font-size: ${props => props.theme.inputFontSize};
  }
  .kg-checkbox__label:before {
    background-color: ${props => props.theme.inputBgdHover};
  }
`;

const StyledLabelWrapper = styled.div`
  color: ${props => props.theme.textColor};
  margin-right: 10px;
`;

const StyledEffectTimeConfigurator = styled.div`
  border-left: 3px solid ${props => props.theme.panelBorderColor};
  margin-bottom: 8px;
  margin-top: 3px;
  margin-left: 3px;
`;

EffectTimeConfiguratorFactory.deps = [RangeSliderFactory];

export default function EffectTimeConfiguratorFactory(
  RangeSlider: ReturnType<typeof RangeSliderFactory>
): React.FC<EffectTimeConfiguratorProps> {
  const EffectTimeConfigurator = ({
    timestamp,
    onDateTimeChange,
    timeMode,
    onTimeModeChange,
    intl
  }: EffectTimeConfiguratorProps) => {
    const [dateOnly, selectedTimeString] = useMemo(() => {
      const date = new Date(timestamp);

      const h = date.getUTCHours();
      const m = date.getUTCMinutes();
      const timeString = `${h < 10 ? `0${h}` : `${h}`}:${m < 10 ? `0${m}` : `${m}`}`;

      date.setUTCHours(0, 0, 0);
      return [date, timeString];
    }, [timestamp]);

    const timeSliderValue = useMemo(() => {
      const base = dateOnly.valueOf();
      return clamp([0, 1], (parseInt(timestamp) - base) / DAY_SLIDER_RANGE);
    }, [timestamp, dateOnly]);

    const timeSliderProps = useMemo(() => {
      return {
        label: 'value',
        value1: timeSliderValue,
        step: 0.001,
        range: [0, 1],
        value0: 0,
        onChange: value => {
          const start = new Date(timestamp).setUTCHours(0, 0, 0).valueOf();
          onDateTimeChange(Math.floor(start + DAY_SLIDER_RANGE * clamp([0, 0.9999], value[1])));
        },
        showInput: false,
        isRanged: false
      };
    }, [timeSliderValue, timestamp, onDateTimeChange]);

    const setDate = useCallback(
      newDate => {
        const adjustedTime = newDate.valueOf() - newDate.getTimezoneOffset() * 1000 * 60;
        const newTimestamp = Math.floor(adjustedTime + DAY_SLIDER_RANGE * timeSliderValue);
        onDateTimeChange(newTimestamp);
      },
      [timeSliderValue, onDateTimeChange]
    );

    const setTime = useCallback(
      time => {
        const conf = time.split(':');
        const start = new Date(timestamp).setUTCHours(conf[0], conf[1]).valueOf();
        onDateTimeChange(start);
      },
      [timestamp, onDateTimeChange]
    );

    const setCurrentDateTime = useCallback(() => {
      onDateTimeChange(new Date().valueOf());
    }, [onDateTimeChange]);

    const disableDateTimePick = timeMode !== LIGHT_AND_SHADOW_EFFECT_TIME_MODES.pick;

    return (
      <StyledEffectTimeConfigurator>
        <StyledWrapper>
          <StyledRadio
            type="radio"
            checked={timeMode === LIGHT_AND_SHADOW_EFFECT_TIME_MODES.pick}
            id={`effect-time-toggle-use-pick-time`}
            label={intl.formatMessage({
              id: 'effectManager.pickDateTime'
            })}
            onChange={() => {
              onTimeModeChange(LIGHT_AND_SHADOW_EFFECT_TIME_MODES.pick);
            }}
          />
        </StyledWrapper>
        <StyledWrapper disabled={disableDateTimePick}>
          <StyledButton onClick={setCurrentDateTime} data-for="pick-time-button" data-tip>
            <Pin height="15px" />
            <Tooltip id="pick-time-button" effect="solid" place="top" delayShow={500}>
              <FormattedMessage id={'effectManager.pickCurrrentTime'} />
            </Tooltip>
          </StyledButton>
          <StyledDatePicker value={dateOnly} onChange={setDate} />
          <StyledTimePicker
            value={selectedTimeString}
            onChange={setTime}
            disableClock={true}
            format={'hh:mm a'}
          />
          <StyledLabelWrapper>
            <FormattedMessage id={'UTC'} />
          </StyledLabelWrapper>
        </StyledWrapper>

        <SliderWrapper disabled={disableDateTimePick}>
          <RangeSlider {...timeSliderProps} />
        </SliderWrapper>

        <StyledWrapper>
          <StyledRadio
            type="radio"
            checked={timeMode === LIGHT_AND_SHADOW_EFFECT_TIME_MODES.current}
            id={`effect-time-toggle-use-current-time`}
            label={intl.formatMessage({
              id: 'effectManager.currentTime'
            })}
            onChange={() => {
              onTimeModeChange(LIGHT_AND_SHADOW_EFFECT_TIME_MODES.current);
            }}
          />
        </StyledWrapper>

        <StyledWrapper>
          <StyledRadio
            type="radio"
            checked={timeMode === LIGHT_AND_SHADOW_EFFECT_TIME_MODES.animation}
            id={`effect-time-toggle-use-animation-time`}
            label={'Animation time'}
            onChange={() => {
              onTimeModeChange(LIGHT_AND_SHADOW_EFFECT_TIME_MODES.animation);
            }}
          />
        </StyledWrapper>
      </StyledEffectTimeConfigurator>
    );
  };

  return injectIntl(EffectTimeConfigurator);
}
