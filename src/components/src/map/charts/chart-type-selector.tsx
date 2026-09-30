// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import styled, {withTheme} from 'styled-components';
import classNames from 'classnames';

import {DEFAULT_CHART_TYPE_OPTIONS, ChartType, LayerChartType} from '@kepler.gl/charts';
import {FormattedMessage} from '@kepler.gl/localization';

import {Add} from '../../common/icons';
import ItemSelector from '../../common/item-selector/item-selector';
import {classList} from '../../common/item-selector/dropdown-list';

export const CHART_TYPE_DUMMY_ID = 'dummy';

export type ChartTypeOption = {
  id: ChartType | LayerChartType | typeof CHART_TYPE_DUMMY_ID;
  label: string;
};

export type ChartTypeSelectorProps = {
  onSelect: (type: ChartType | LayerChartType) => void;
  theme?: any;
  onBlur?: () => void;
  onOpen?: () => void;
};

const DropdownWrapper = styled.div`
  border: 0;
  left: 0;
  z-index: ${props => props.theme.dropdownWrapperZ};
  width: 220px;
  margin-left: -140px;
  margin-top: 26px;

  .typeahead__input {
    border-color: ${props => props.theme.activeColor};
    border-radius: 4px 4px 0px 0px !important;
  }
  .typeahead__input_box {
    padding: 0px;
  }
  .typeahead__input_icon {
    top: 34px;
    right: 9px;
  }
`;

const StyledChartTypeSelector = styled.div`
  .item-selector .item-selector__dropdown {
    padding: 4px 10px 4px 10px;
    width: fit-content;
    background-color: ${props => props.theme.secondaryBtnBgd};
    border-radius: ${props => props.theme.primaryBtnRadius};
    font-size: ${props => props.theme.primaryBtnFontSizeDefault};
    border: none;

    &:hover {
      background-color: ${props => props.theme.secondaryBtnBgdHover};
    }

    .item-selector__dropdown__value {
      color: ${props => props.theme.secondaryBtnActColor};
    }
  }
`;

const StyledAddButton = styled(Add)`
  margin-right: 8px;
  height: 16px;
`;

const StyledPlaceholderButton = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-left: 3px;
  margin-right: 3px;
  letter-spacing: 0.3px;
  font-weight: 500;
`;

const DropdownListWrapper = styled.div`
  ${props => props.theme.dropdownList};
  background-color: ${props => props.theme.dropdownListBgd};
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  max-height: 320px;
  overflow-y: auto;
`;

const StyledDropdownListItem = styled.div`
  padding: 8px 16px;
  font-size: 12px;
  color: ${props => props.theme.textColor};
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.dropdownListHighlightBg};
    color: ${props => props.theme.textColorHl};
  }
`;

const getDisplayOption = (op: ChartTypeOption) => op.label;
const getOptionValue = (op: ChartTypeOption) => op.id;

function ChartTypeListItem({value}: {value: ChartTypeOption; isTile?: boolean}) {
  if (value?.id === CHART_TYPE_DUMMY_ID) {
    return (
      <StyledPlaceholderButton>
        <StyledAddButton />
        <FormattedMessage id="chartPanel.add" defaultMessage="Add" />
      </StyledPlaceholderButton>
    );
  }

  return <span>{value.label}</span>;
}

function ChartTypeDropdownList({
  onOptionSelected,
  options,
  selectionIndex
}: {
  onOptionSelected: (value: ChartTypeOption) => void;
  options: ChartTypeOption[];
  selectedItems?: ChartTypeOption[];
  selectionIndex: number;
  customListItemComponent?: React.FC<{value: ChartTypeOption; isTile?: boolean}>;
}) {
  return (
    <DropdownListWrapper className={classList.list}>
      {options.map((value, i) => (
        <StyledDropdownListItem
          key={`${value.id}_${i}`}
          className={classNames({hover: selectionIndex === i})}
          onMouseDown={e => {
            e.preventDefault();
            onOptionSelected(value);
          }}
        >
          {value.label}
        </StyledDropdownListItem>
      ))}
    </DropdownListWrapper>
  );
}

ChartTypeSelectorFactory.deps = [];

export default function ChartTypeSelectorFactory(): React.FC<
  Omit<ChartTypeSelectorProps, 'theme'>
> {
  const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({onSelect, onBlur, onOpen}) => {
    const selectedItems = useMemo(
      () => [{id: CHART_TYPE_DUMMY_ID, label: CHART_TYPE_DUMMY_ID} as ChartTypeOption],
      []
    );

    const options = useMemo(
      () =>
        DEFAULT_CHART_TYPE_OPTIONS.map(option => ({
          id: option.id,
          label: option.label
        })),
      []
    );

    return (
      <StyledChartTypeSelector className="chart-config__type">
        <ItemSelector
          selectedItems={selectedItems}
          options={options}
          multiSelect={false}
          searchable={false}
          placeholder="chartPanel.add"
          onChange={value => {
            const type =
              typeof value === 'string' ? value : (value as ChartTypeOption | null | undefined)?.id;
            if (type && type !== CHART_TYPE_DUMMY_ID) {
              onSelect(type as ChartType | LayerChartType);
            }
          }}
          onBlur={onBlur}
          onOpen={onOpen}
          getOptionValue={getOptionValue}
          displayOption={getDisplayOption}
          DropDownLineItemRenderComponent={ChartTypeListItem}
          DropDownRenderComponent={ChartTypeDropdownList}
          DropDownWrapperComponent={DropdownWrapper}
        />
      </StyledChartTypeSelector>
    );
  };

  return withTheme(ChartTypeSelector) as React.FC<Omit<ChartTypeSelectorProps, 'theme'>>;
}
