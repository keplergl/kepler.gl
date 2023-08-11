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
import {LocationMarker, Calendar, Clock} from '../common/icons';

const DAY_SLIDER_RANGE = 1000 * 60 * 60 * 24;

export type EffectTimeConfiguratorProps = {
  timestamp: string;
  onDateTimeChange: (time: number) => void;
  timeMode: LightAndShadowEffectTimeMode;
  onTimeModeChange: (newMode: LightAndShadowEffectTimeMode) => void;
};

type StyledWrapperProps = {disabled?: boolean; marginBottom?: number};
const StyledWrapper = styled.div<StyledWrapperProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.marginBottom ?? 9}px;
  ${props => (props.hidden ? 'display: none;' : '')}
`;

type SliderWrapperProps = {disabled?: boolean};
const SliderWrapper = styled.div<SliderWrapperProps>`
  margin-top: 13px;
  margin-bottom: 17px;
  ${props => (props.hidden ? 'display: none;' : '')}

  .kg-range-slider__input {
    height: 32px;
    text-align: center;
    padding: 3px 6px;
  }
  .kg-slider {
    padding-left: 6px;
  }
  .kg-range-slider {
    padding: 0px !important;
  }
`;

const StyledButton = styled(Button)`
  color: ${props => props.theme.effectPanelTextSecondary2};
  background-color: ${props => props.theme.inputBgd};
  height: 32px;
  width: 32px;
  padding: 5px;
  border-radius: 4px;
  justify-content: center;
  :hover {
    color: ${props => props.theme.effectPanelTextMain};
    background-color: ${props => props.theme.inputBgdHover};
  }
`;

const StyledRadio = styled(Checkbox)`
  .kg-checkbox__label {
    font-family: ${props => props.theme.fontFamily};
    font-size: ${props => props.theme.inputFontSize};
  }
  .kg-checkbox__label:before {
    background: transparent;
    border-color: ${props => props.theme.effectPanelTextSecondary2};
  }
  input:checked + .kg-checkbox__label:before {
    border-color: ${props => props.theme.activeColor};
  }
  .kg-checkbox__label:after {
    background-color: ${props => props.theme.activeColor};
  }
`;

const StyledEffectTimeConfigurator = styled.div`
  margin-bottom: 8px;
  margin-top: 3px;
`;

const WithIconWrapper = styled.div`
  position: relative;
`;

const StyledExtraIcon = styled.div`
  position: absolute;
  top: 0px;
  left: 8px;
  width: 0px;
  height: 32px;
  color: ${props => props.theme.effectPanelTextSecondary2};
  pointer-events: none;
`;

type TextBlockProps = {
  width: string;
};
const TextBlock = styled.div<TextBlockProps>`
  color: ${props => props.theme.effectPanelTextSecondary2};
  width: ${props => props.width};
  font-size: ${props => props.theme.inputFontSize};
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
  }: EffectTimeConfiguratorProps & {intl: IntlShape}) => {
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

    const formatShortWeekday = useCallback((locale, date) => {
      return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()];
    }, []);

    const disableDateTimePick = timeMode !== LIGHT_AND_SHADOW_EFFECT_TIME_MODES.pick;

    return (
      <StyledEffectTimeConfigurator>
        <StyledWrapper marginBottom={16}>
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

        <SliderWrapper hidden={disableDateTimePick}>
          <RangeSlider {...timeSliderProps} />
        </SliderWrapper>

        <StyledWrapper hidden={disableDateTimePick} marginBottom={2}>
          <TextBlock width="32px"></TextBlock>
          <TextBlock width="110px">
            <FormattedMessage id={'effectManager.date'} />
          </TextBlock>
          <TextBlock width="110px">
            <FormattedMessage id={'effectManager.time'} />
          </TextBlock>
        </StyledWrapper>

        <StyledWrapper hidden={disableDateTimePick} marginBottom={24}>
          <StyledButton onClick={setCurrentDateTime} data-for="pick-time-button" data-tip>
            <LocationMarker height="16px" />
            <Tooltip id="pick-time-button" effect="solid" place="top" delayShow={500}>
              <FormattedMessage id={'effectManager.pickCurrrentTime'} />
            </Tooltip>
          </StyledButton>
          <WithIconWrapper>
            <StyledDatePicker
              value={dateOnly}
              onChange={setDate}
              minDetail={'month'}
              formatShortWeekday={formatShortWeekday}
            />
            <StyledExtraIcon>
              <Calendar width="16px" height="32px" />
            </StyledExtraIcon>
          </WithIconWrapper>
          <WithIconWrapper>
            <StyledTimePicker
              value={selectedTimeString}
              onChange={setTime}
              disableClock={true}
              format={'hh:mm a'}
            />
            <StyledExtraIcon>
              <Clock width="16px" height="32px" />
            </StyledExtraIcon>
          </WithIconWrapper>
        </StyledWrapper>

        <StyledWrapper marginBottom={16}>
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

        <StyledWrapper marginBottom={16}>
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
