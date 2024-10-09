// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import {injectIntl, IntlShape} from 'react-intl';
import styled from 'styled-components';
import moment from 'moment-timezone';
import SunCalc from 'suncalc';

import {MapState} from '@kepler.gl/types';
import {FormattedMessage} from '@kepler.gl/localization';
import {clamp} from '@kepler.gl/utils';
import {
  LIGHT_AND_SHADOW_EFFECT_TIME_MODES,
  LightAndShadowEffectTimeMode,
  DEFAULT_TIMEZONE
} from '@kepler.gl/constants';
import {mapStateLens} from '@kepler.gl/reducers';

import {withState} from '../injector';
import {StyledDatePicker as DatePicker, Tooltip} from '../common/styled-components';
import Checkbox from '../common/checkbox';
import Button from '../common/data-table/button';
import {LocationMarker, Calendar, Clock, Globe} from '../common/icons';
import TimezoneSelectorFactory from './timezone-selector';
import EffectTimeSliderFactory from './effect-time-slider';
import EffectTimeSelectorFactory from './effect-time-selector';

const DAY_MILISECONDS = 1000 * 60 * 60 * 24;

export type EffectTimeConfiguratorProps = {
  timestamp: number;
  timezone: string;
  timeMode: LightAndShadowEffectTimeMode;
  onChange: (parameters: {
    timestamp?: number | null;
    timezone?: string;
    timeMode?: LightAndShadowEffectTimeMode;
  }) => void;
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
  margin-bottom: 12px;
  ${props => (props.hidden ? 'display: none;' : '')}
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

const StyledDatePicker = styled.div`
  .react-date-picker--open .react-date-picker__wrapper .react-date-picker__inputGroup {
    border: 1px solid ${props => props.theme.activeColor};
    border-radius: 4px 4px 0px 0px !important;
  }
  .react-calendar__navigation__prev2-button,
  .react-calendar__navigation__next2-button {
    display: none;
  }
  .react-calendar__navigation__label {
    position: absolute;
    top: 20px;
  }
  .react-calendar__navigation__arrow {
    position: absolute;
    top: 18px;
    font-size: 16px;
  }
  .react-calendar__navigation__prev-button {
    right: 36px;
  }
  .react-calendar__navigation__next-button {
    right: 12px;
  }
`;

type WithIconWrapperProps = {width?: string};
const WithIconWrapper = styled.div<WithIconWrapperProps>`
  position: relative;
  ${props => (props.width ? `width: ${props.width}` : '')}
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
  width?: string;
};
const TextBlock = styled.div<TextBlockProps>`
  color: ${props => props.theme.effectPanelTextSecondary2};
  width: ${props => props.width};
  font-size: ${props => props.theme.inputFontSize};
`;

/**
 * Converts date, time and timezone into a UTC timestamp.
 * @param dateStr Date string in YYYY-MM-DD format.
 * @param timeStr Time string in HH:MM format.
 * @param timezone Timezone name.
 * @returns Timestamp or null if case of bad inputs.
 */
const getTimestamp = (dateStr: string, timeStr: string, timezone: string): number | null => {
  let timestamp: number | null = null;
  const curr = moment.tz(`${dateStr}T${timeStr}:00`, timezone);
  if (curr.isValid()) {
    timestamp = curr.utc().valueOf();
  }
  return timestamp;
};

/**
 * Converts time of the day into [0, 1] range
 * @param date
 * @returns
 */
const getDayRatio = (date: moment.Moment) => {
  return ((date.hours() * 60 + date.minutes()) * 60 * 1000) / DAY_MILISECONDS;
};

EffectTimeConfiguratorFactory.deps = [
  TimezoneSelectorFactory,
  EffectTimeSliderFactory,
  EffectTimeSelectorFactory
];

export default function EffectTimeConfiguratorFactory(
  TimezoneSelector: ReturnType<typeof TimezoneSelectorFactory>,
  EffectTimeSlider: ReturnType<typeof EffectTimeSliderFactory>,
  EffectTimeSelector: ReturnType<typeof EffectTimeSelectorFactory>
): React.FC<EffectTimeConfiguratorProps> {
  const EffectTimeConfigurator = ({
    timestamp,
    timezone: _timezone,
    timeMode,
    onChange: onTimeParametersChanged,
    mapState,
    intl
  }: EffectTimeConfiguratorProps & {intl: IntlShape; mapState: MapState}) => {
    const timezone = useMemo(() => {
      return moment.tz.names().includes(_timezone) ? _timezone : DEFAULT_TIMEZONE;
    }, [_timezone]);

    const [datePickerDate, fullDate, formattedTime, formattedDate, dayTimeProgress] =
      useMemo(() => {
        const currentMoment = moment.tz(timestamp, timezone);

        // Slider value from 0 to 1
        const dayProgress = getDayRatio(currentMoment);

        // Date picker always renders Date in local timezone
        const date = new Date();
        date.setFullYear(currentMoment.year(), currentMoment.month(), currentMoment.date());
        date.setHours(0, 0, 0, 0);

        return [
          date,
          currentMoment.toDate(),
          currentMoment.format('HH:mm'),
          currentMoment.format('YYYY-MM-DD'),
          dayProgress
        ];
      }, [timestamp, timezone]);

    const timeSliderConfig = useMemo(() => {
      const times = SunCalc.getTimes(fullDate, mapState.latitude, mapState.longitude);
      const {dawn, sunrise, sunset, dusk} = times;

      return {
        dawn: getDayRatio(moment.tz(dawn.valueOf(), timezone)),
        sunrise: getDayRatio(moment.tz(sunrise.valueOf(), timezone)),
        sunset: getDayRatio(moment.tz(sunset.valueOf(), timezone)),
        dusk: getDayRatio(moment.tz(dusk.valueOf(), timezone)),
        sunriseTime: moment.tz(sunrise.valueOf(), timezone).format('hh:mm A'),
        sunsetTime: moment.tz(sunset.valueOf(), timezone).format('hh:mm A')
      };
    }, [fullDate, timezone, mapState.latitude, mapState.longitude]);

    const onTimeSliderChange = useCallback(
      value => {
        const hours = clamp([0, 23], Math.floor(value[1] * 24));
        const minutes = clamp([0, 59], Math.floor((value[1] * 24 - hours) * 60));

        const newFormattedTime = `${hours < 10 ? `0${hours}` : hours}:${
          minutes < 10 ? `0${minutes}` : minutes
        }`;
        const newTimestamp = getTimestamp(formattedDate, newFormattedTime, timezone);
        onTimeParametersChanged({timestamp: newTimestamp});
      },
      [formattedDate, timezone, onTimeParametersChanged]
    );

    const setDate = useCallback(
      newDate => {
        if (!newDate) return;

        const newFormattedDate = moment(newDate).format('YYYY-MM-DD');
        const newTimestamp = getTimestamp(newFormattedDate, formattedTime, timezone);
        onTimeParametersChanged({timestamp: newTimestamp});
      },
      [formattedTime, timezone, onTimeParametersChanged]
    );

    const setTime = useCallback(
      newTime => {
        if (!newTime) return;

        const newTimestamp = getTimestamp(formattedDate, newTime, timezone);
        onTimeParametersChanged({timestamp: newTimestamp});
      },
      [formattedDate, timezone, onTimeParametersChanged]
    );

    const setTimezone = useCallback(
      newTimezone => {
        if (!newTimezone) return;

        const newTimestamp = getTimestamp(formattedDate, formattedTime, newTimezone);
        // date and time are adjusted to have the same value but in the new timezone
        onTimeParametersChanged({timestamp: newTimestamp, timezone: newTimezone});
      },
      [formattedDate, formattedTime, onTimeParametersChanged]
    );

    const setCurrentDateTime = useCallback(() => {
      onTimeParametersChanged({timestamp: new Date().valueOf()});
    }, [onTimeParametersChanged]);

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
              onTimeParametersChanged({timeMode: LIGHT_AND_SHADOW_EFFECT_TIME_MODES.pick});
            }}
          />
        </StyledWrapper>

        <SliderWrapper hidden={disableDateTimePick}>
          <EffectTimeSlider
            value={dayTimeProgress}
            onChange={onTimeSliderChange}
            config={timeSliderConfig}
          />
        </SliderWrapper>

        <StyledWrapper hidden={disableDateTimePick} marginBottom={2}>
          <TextBlock width="32px" />
          <TextBlock width="110px">
            <FormattedMessage id={'effectManager.date'} />
          </TextBlock>
          <TextBlock width="110px">
            <FormattedMessage id={'effectManager.time'} />
          </TextBlock>
        </StyledWrapper>

        <StyledWrapper hidden={disableDateTimePick} marginBottom={16}>
          <StyledButton onClick={setCurrentDateTime} data-for="pick-time-button" data-tip>
            <LocationMarker height="16px" />
            <Tooltip id="pick-time-button" effect="solid" place="top" delayShow={500}>
              <FormattedMessage id={'effectManager.pickCurrrentTime'} />
            </Tooltip>
          </StyledButton>
          <WithIconWrapper>
            <StyledDatePicker>
              <DatePicker
                value={datePickerDate}
                onChange={setDate}
                minDetail={'month'}
                formatShortWeekday={formatShortWeekday}
              />
            </StyledDatePicker>
            <StyledExtraIcon>
              <Calendar width="16px" height="32px" />
            </StyledExtraIcon>
          </WithIconWrapper>
          <WithIconWrapper>
            <EffectTimeSelector value={formattedTime} onChange={setTime} />
            <StyledExtraIcon>
              <Clock width="16px" height="32px" />
            </StyledExtraIcon>
          </WithIconWrapper>
        </StyledWrapper>

        <StyledWrapper hidden={disableDateTimePick} marginBottom={2}>
          <TextBlock>
            <FormattedMessage id={'effectManager.timezone'} />
          </TextBlock>
        </StyledWrapper>

        <StyledWrapper hidden={disableDateTimePick} marginBottom={24}>
          <WithIconWrapper width={'100%'}>
            <TimezoneSelector selected={timezone} onSelect={setTimezone} />
            <StyledExtraIcon>
              <Globe width="16px" height="32px" />
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
              onTimeParametersChanged({timeMode: LIGHT_AND_SHADOW_EFFECT_TIME_MODES.current});
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
              onTimeParametersChanged({timeMode: LIGHT_AND_SHADOW_EFFECT_TIME_MODES.animation});
            }}
          />
        </StyledWrapper>
      </StyledEffectTimeConfigurator>
    );
  };

  // @ts-expect-error how to properly type?
  return withState([mapStateLens])(injectIntl(EffectTimeConfigurator));
}
