// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {injectIntl, IntlShape} from 'react-intl';
import styled from 'styled-components';
import moment from 'moment-timezone';
import SunCalc from 'suncalc';

import {FormattedMessage} from '@kepler.gl/localization';
import {clamp} from '@kepler.gl/utils';
import {
  LIGHT_AND_SHADOW_EFFECT_TIME_MODES,
  LightAndShadowEffectTimeMode,
  DEFAULT_TIMEZONE
} from '@kepler.gl/constants';

import KeplerGlContext from '../context';
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

type StyledWrapperProps = {disabled?: boolean; $marginBottom?: number};
const StyledWrapper = styled.div<StyledWrapperProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.$marginBottom ?? 9}px;
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
  &:hover {
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
  // Bail out early on malformed inputs (e.g. partially edited date/time fields
  // that produce values like "NaN:NaN"). Otherwise moment falls back to
  // `new Date()` and logs a deprecation warning while still returning invalid.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr) || !/^\d{2}:\d{2}$/.test(timeStr)) {
    return null;
  }

  let timestamp: number | null = null;
  const curr = moment.tz(`${dateStr}T${timeStr}:00`, 'YYYY-MM-DDTHH:mm:ss', true, timezone);
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

/**
 * Normalize TimePicker output (HH:mm, h:mm a, or Date) to HH:mm.
 * react-time-picker with format "hh:mm a" can echo a 12-hour string when its
 * controlled value is rewritten, which would otherwise parse as a different UTC time.
 */
const normalizeTimeInput = (newTime: unknown): string | null => {
  if (newTime instanceof Date && Number.isFinite(newTime.getTime())) {
    return moment(newTime).format('HH:mm');
  }
  if (typeof newTime !== 'string' || !newTime) {
    return null;
  }
  const trimmed = newTime.trim();
  if (/^\d{2}:\d{2}/.test(trimmed)) {
    return trimmed.slice(0, 5);
  }
  const parsed = moment(trimmed, ['HH:mm', 'H:mm', 'hh:mm A', 'h:mm A', 'hh:mm a', 'h:mm a'], true);
  return parsed.isValid() ? parsed.format('HH:mm') : null;
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
    intl
  }: EffectTimeConfiguratorProps & {intl: IntlShape}) => {
    // Subscribe only to lat/lon. Connecting this panel to the full store (via
    // withState) re-rendered it on every effect timestamp tick while dragging
    // the day-time slider, and react-redux nested connect layout effects then
    // hit "Maximum update depth exceeded".
    const {selector} = useContext(KeplerGlContext);
    const latitude = useSelector(state => selector(state)?.mapState?.latitude ?? 0);
    const longitude = useSelector(state => selector(state)?.mapState?.longitude ?? 0);

    const timezone = useMemo(() => {
      return moment.tz.names().includes(_timezone) ? _timezone : DEFAULT_TIMEZONE;
    }, [_timezone]);

    const {fullDate, formattedTime, formattedDate, dayTimeProgress} = useMemo(() => {
      // Guard against an invalid stored timestamp so we never build an
      // "Invalid Date" for the date picker (react-date-picker throws on it).
      const safeTimestamp = Number.isFinite(timestamp) ? timestamp : Date.now();
      const currentMoment = moment.tz(safeTimestamp, timezone);

      return {
        fullDate: currentMoment.toDate(),
        formattedTime: currentMoment.format('HH:mm'),
        formattedDate: currentMoment.format('YYYY-MM-DD'),
        dayTimeProgress: getDayRatio(currentMoment)
      };
    }, [timestamp, timezone]);

    // Only allocate a new Date when the calendar day changes. A new object on
    // every timestamp tick makes react-date-picker fire onChange while dragging.
    const datePickerDate = useMemo(() => {
      const [year, month, day] = formattedDate.split('-').map(Number);
      return new Date(year, month - 1, day);
    }, [formattedDate]);

    // Keep the slider on the pointer while dragging so Redux minute-quantization
    // cannot snap it (and so date/time widgets cannot echo onChange mid-gesture).
    const [sliderDragProgress, setSliderDragProgress] = useState<number | null>(null);
    const isSliderDraggingRef = useRef(false);

    const endSliderDrag = useCallback(() => {
      isSliderDraggingRef.current = false;
      setSliderDragProgress(null);
    }, []);

    useEffect(() => {
      document.addEventListener('mouseup', endSliderDrag);
      document.addEventListener('touchend', endSliderDrag);
      return () => {
        document.removeEventListener('mouseup', endSliderDrag);
        document.removeEventListener('touchend', endSliderDrag);
      };
    }, [endSliderDrag]);

    const timeSliderConfig = useMemo(() => {
      const times = SunCalc.getTimes(fullDate, latitude, longitude);
      const {dawn, sunrise, sunset, dusk} = times;

      return {
        dawn: getDayRatio(moment.tz(dawn.valueOf(), timezone)),
        sunrise: getDayRatio(moment.tz(sunrise.valueOf(), timezone)),
        sunset: getDayRatio(moment.tz(sunset.valueOf(), timezone)),
        dusk: getDayRatio(moment.tz(dusk.valueOf(), timezone)),
        sunriseTime: moment.tz(sunrise.valueOf(), timezone).format('hh:mm A'),
        sunsetTime: moment.tz(sunset.valueOf(), timezone).format('hh:mm A')
      };
    }, [fullDate, timezone, latitude, longitude]);

    // Date/time widgets (and the slider itself) can echo onChange when their
    // controlled value is rewritten from the store. Skip no-op timestamp
    // updates so those echoes cannot dispatch in a loop.
    const timestampRef = useRef(timestamp);
    timestampRef.current = timestamp;

    const commitTimestamp = useCallback(
      (newTimestamp: number | null | undefined) => {
        if (newTimestamp == null || newTimestamp === timestampRef.current) return;
        onTimeParametersChanged({timestamp: newTimestamp});
      },
      [onTimeParametersChanged]
    );

    const onTimeSliderChange = useCallback(
      value => {
        isSliderDraggingRef.current = true;
        setSliderDragProgress(value[1]);
        const hours = clamp([0, 23], Math.floor(value[1] * 24));
        const minutes = clamp([0, 59], Math.floor((value[1] * 24 - hours) * 60));

        const newFormattedTime = `${hours < 10 ? `0${hours}` : hours}:${
          minutes < 10 ? `0${minutes}` : minutes
        }`;
        commitTimestamp(getTimestamp(formattedDate, newFormattedTime, timezone));
      },
      [formattedDate, timezone, commitTimestamp]
    );

    const setDate = useCallback(
      newDate => {
        if (isSliderDraggingRef.current || !newDate) return;

        const newFormattedDate = moment(newDate).format('YYYY-MM-DD');
        commitTimestamp(getTimestamp(newFormattedDate, formattedTime, timezone));
      },
      [formattedTime, timezone, commitTimestamp]
    );

    const setTime = useCallback(
      newTime => {
        if (isSliderDraggingRef.current || !newTime) return;

        const timeStr = normalizeTimeInput(newTime);
        if (!timeStr) return;
        commitTimestamp(getTimestamp(formattedDate, timeStr, timezone));
      },
      [formattedDate, timezone, commitTimestamp]
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
        <StyledWrapper $marginBottom={16}>
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
            value={sliderDragProgress ?? dayTimeProgress}
            onChange={onTimeSliderChange}
            config={timeSliderConfig}
          />
        </SliderWrapper>

        <StyledWrapper hidden={disableDateTimePick} $marginBottom={2}>
          <TextBlock width="32px" />
          <TextBlock width="110px">
            <FormattedMessage id={'effectManager.date'} />
          </TextBlock>
          <TextBlock width="110px">
            <FormattedMessage id={'effectManager.time'} />
          </TextBlock>
        </StyledWrapper>

        <StyledWrapper hidden={disableDateTimePick} $marginBottom={16}>
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
                maxDetail="month"
                {...({calendarProps: {minDetail: 'month', formatShortWeekday}} as any)}
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

        <StyledWrapper hidden={disableDateTimePick} $marginBottom={2}>
          <TextBlock>
            <FormattedMessage id={'effectManager.timezone'} />
          </TextBlock>
        </StyledWrapper>

        <StyledWrapper hidden={disableDateTimePick} $marginBottom={24}>
          <WithIconWrapper width={'100%'}>
            <TimezoneSelector selected={timezone} onSelect={setTimezone} />
            <StyledExtraIcon>
              <Globe width="16px" height="32px" />
            </StyledExtraIcon>
          </WithIconWrapper>
        </StyledWrapper>

        <StyledWrapper $marginBottom={16}>
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

        <StyledWrapper $marginBottom={16}>
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

  return injectIntl(EffectTimeConfigurator);
}
