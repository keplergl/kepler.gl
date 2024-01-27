// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo, useCallback} from 'react';
import styled, {withTheme} from 'styled-components';
import classNames from 'classnames';
import moment from 'moment-timezone';

import ItemSelector from '../common/item-selector/item-selector';
import {StyledTimePicker} from '../common/styled-components';
import {classList} from '../common/item-selector/dropdown-list';

const HEADER_ITEM_ID = 'HEADER_ITEM_ID';

export type EffectTimeSelectorProps = {
  value: string;
  onChange: (string) => void;
  theme?: any;
};

const StyledEffectTimeSelector = styled.div`
  .item-selector {
    background-color: transparent;
  }
  .item-selector .item-selector__dropdown {
    padding: 0px;
    width: 110px;
    height: 30px;
  }
  border: 1px solid ${props => props.theme.inputBgd};
  border-radius: 4px;
  :hover {
    border: 1px solid ${props => props.theme.inputBgdHover};
  }
  .active {
    border: 1px solid ${props => props.theme.activeColor};
    border-radius: 4px 4px 0px 0px;
  }
`;

const StyledLabel = styled.div`
  color: ${props => props.theme.effectPanelTextMain};
  font-size: ${props => props.theme.inputFontSize};
  height: 13px;
  display: flex;
  align-items: center;
`;

const DropdownListWrapper = styled.div`
  ${props => props.theme.dropdownList};
  background-color: ${props => props.theme.inputBgdHover};
  display: flex;
  flex-wrap: wrap;
  padding: 0px;
  max-height: 160px;
  border-radius: 0px 0px 4px 4px;
`;

const StyledDropdownListItem = styled.div`
  padding: 10px 5px 9px 10px;
  width: 100%;
  :hover {
    background-color: ${props => props.theme.effectPanelElementColorSelected};
    cursor: pointer;
  }
`;

// Generate time options for the dropdown with 30 min intervals.
const timeOptions = (() => {
  const m = moment().utcOffset(0);
  m.set({hour: 12, minute: 0, second: 0, millisecond: 0});

  const out: {name: string; id: string}[] = [];
  for (let i = 0; i < 48; i++) {
    out.push({name: m.format('hh:mm A'), id: m.format('HH:mm')});
    m.add(30, 'minutes');
  }
  return out;
})();

const getDisplayOption = op => op.name;
const getOptionValue = op => op.id;

/**
 * A component to render TimePicker as the header for the dropdown component.
 */
const EffectTimeListItem = ({value}) => {
  if (value?.id === HEADER_ITEM_ID) {
    return (
      <StyledTimePicker
        value={value.value}
        onChange={value.onChange}
        onClick={value.onClick}
        disableClock={true}
        format={'hh:mm a'}
      />
    );
  }

  return <StyledLabel>{value.name}</StyledLabel>;
};

const EffectTimeDropdownList = ({
  onOptionSelected,
  options,
  selectionIndex,
  customListItemComponent
}) => {
  const onSelectOption = useCallback(
    (e, value) => {
      e.preventDefault();
      onOptionSelected(value);
    },
    [onOptionSelected]
  );

  const ListItemComponent = customListItemComponent;

  return (
    <DropdownListWrapper className={classList.list}>
      {options.map((value, i) => (
        <StyledDropdownListItem
          className={classNames('effect-type-selector__item', {
            hover: selectionIndex === i
          })}
          key={`${value.id}_${i}`}
          onMouseDown={e => onSelectOption(e, value)}
          onClick={e => onSelectOption(e, value)}
        >
          <ListItemComponent value={value} />
        </StyledDropdownListItem>
      ))}
    </DropdownListWrapper>
  );
};

EffectTimeSelectorFactory.deps = [];

function EffectTimeSelectorFactory() {
  const EffectTimeSelector: React.FC<EffectTimeSelectorProps> = ({
    value,
    onChange
  }: EffectTimeSelectorProps) => {
    // Selected item is rendered as TimePicker in EffectTimeListItem
    const selectedItems = useMemo(() => {
      return [
        {
          id: HEADER_ITEM_ID,
          value,
          onChange,
          onClick: e => {
            // DatePicker is used as custom header.
            // Don't open the dropdown when the user is editing time values directly.
            const name = e?.target?.name;
            if (name === 'hour12' || name === 'minute' || name === 'amPm') {
              e.stopPropagation();
            }
          }
        }
      ];
    }, [value, onChange]);

    return (
      <StyledEffectTimeSelector>
        <ItemSelector
          selectedItems={selectedItems}
          options={timeOptions}
          multiSelect={false}
          searchable={false}
          placeholder=""
          filterOption="name"
          onChange={onChange}
          getOptionValue={getOptionValue}
          displayOption={getDisplayOption}
          DropDownLineItemRenderComponent={EffectTimeListItem}
          DropDownRenderComponent={EffectTimeDropdownList}
        />
      </StyledEffectTimeSelector>
    );
  };

  return withTheme(EffectTimeSelector);
}

export default EffectTimeSelectorFactory;
