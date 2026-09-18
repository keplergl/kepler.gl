// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';
import moment from 'moment-timezone';

import {DEFAULT_TIMEZONE} from '@kepler.gl/constants';

import ItemSelector from '../common/item-selector/item-selector';

export type TimezoneOption = {
  name: string;
  label: string;
};

const UTC_DEFAULT_LABEL = 'UTC (Default)';

/**
 * Unique IANA zones keyed by current UTC offset in minutes (from UTC).
 * `zonesForCountry` returns minutes *to* UTC, so the sign is inverted.
 */
export function getTimezonesFromMoment(): Record<string, number> {
  return moment.tz.countries().reduce<Record<string, number>>(
    (accu, country) => {
      moment.tz.zonesForCountry(country, true).forEach(zone => {
        accu[zone.name] = -zone.offset;
      });
      return accu;
    },
    {[DEFAULT_TIMEZONE]: 0}
  );
}

export function getTimezoneOptions(timezones: Record<string, number>): TimezoneOption[] {
  return Object.entries(timezones)
    .map(([name, offsetMinutes]) => {
      const hours = offsetMinutes / 60;
      const sign = hours > 0 ? '+' : '';
      const label =
        name === DEFAULT_TIMEZONE
          ? UTC_DEFAULT_LABEL
          : hours === 0
          ? name
          : `${name} (UTC ${sign}${hours} hours)`;
      return {name, label};
    })
    .sort((a, b) => {
      if (a.name === DEFAULT_TIMEZONE) return -1;
      if (b.name === DEFAULT_TIMEZONE) return 1;
      return a.label.localeCompare(b.label);
    });
}

const TIMEZONE_OFFSETS = getTimezonesFromMoment();
const TIMEZONE_OPTIONS = getTimezoneOptions(TIMEZONE_OFFSETS);

const StyledFieldSelector = styled.div`
  width: 220px;

  .item-selector__dropdown {
    background: ${props => props.theme.secondaryInputBgd};
    border-color: ${props => props.theme.secondaryInputBorderColor};
    height: 28px;
    padding: 2px 8px;
    font-size: 11px;
  }
`;

export type TimezoneSelectorProps = {
  timezone?: string | null;
  onChange: (timezone: string) => void;
};

const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({timezone, onChange}) => {
  const selectedName = timezone || DEFAULT_TIMEZONE;
  const selectedItems = useMemo(() => {
    const match = TIMEZONE_OPTIONS.find(option => option.name === selectedName);
    return match ? [match] : [{name: selectedName, label: selectedName}];
  }, [selectedName]);

  const displayOption = useCallback((option: TimezoneOption | string) => {
    if (typeof option === 'string') {
      return TIMEZONE_OPTIONS.find(item => item.name === option)?.label || option;
    }
    return option?.label || option?.name || '';
  }, []);

  const onSelect = useCallback(
    (value: string | TimezoneOption | null) => {
      if (!value) {
        return;
      }
      const name = typeof value === 'string' ? value : value.name;
      if (name) {
        onChange(name);
      }
    },
    [onChange]
  );

  return (
    <StyledFieldSelector className="timezone-field-selector" data-testid="time-widget-timezone">
      <ItemSelector
        size="small"
        selectedItems={selectedItems}
        options={TIMEZONE_OPTIONS}
        multiSelect={false}
        searchable={true}
        closeOnSelect={true}
        placeholder="filterManager.selectTimezone"
        placement="top"
        getOptionValue={(option: TimezoneOption) => option.name}
        displayOption={displayOption}
        filterOption="label"
        onChange={onSelect}
      />
    </StyledFieldSelector>
  );
};

export default TimezoneSelector;
