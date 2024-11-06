// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';

import {notNullorUndefined} from '@kepler.gl/utils';
import {ComponentType} from 'react';
import {ArrowDown, Delete} from '../icons';
import {ListItem} from './dropdown-list';
import {FormattedMessage} from '@kepler.gl/localization';

export type ListItemProps<Option> = {
  value: Option;
  displayOption: (opt: Option) => string;
  light: boolean;
  disabled: boolean;
};

export type DropdownSelectProps<Option> = {
  className?: string;
  displayOption?: string | ((opt: Option) => string);
  disabled?: boolean;
  onClick: (e: React.MouseEvent) => void;
  inputTheme?: string;
  error?: boolean;
  size?: string;
  value: Option;
  placeholder?: string;
  erasable?: boolean;
  showArrow?: boolean;
  onErase?: (e: React.MouseEvent) => void;
  showDropdown: (e: React.MouseEvent) => void;
  DropDownLineItemRenderComponent?: ComponentType<ListItemProps<Option>>;
};

export const StyledDropdownSelect = styled.div.attrs<{className?: string}>({
  className: 'item-selector__dropdown'
})<{
  size: DropdownSelectProps<any>['size'];
  inputTheme: DropdownSelectProps<any>['inputTheme'];
}>`
  ${props =>
    props.inputTheme === 'secondary'
      ? props.theme.secondaryInput
      : props.inputTheme === 'light'
      ? props.theme.inputLT
      : props.theme.input};

  height: ${props =>
    props.size === 'small' ? props.theme.inputBoxHeightSmall : props.theme.inputBoxHeight};

  .list__item__anchor {
    ${props => props.theme.dropdownListAnchor};
  }
`;

export const DropdownSelectValue = styled.span<{
  inputTheme: DropdownSelectProps<any>['inputTheme'];
  hasPlaceholder: boolean;
}>`
  color: ${props =>
    props.hasPlaceholder && props.inputTheme === 'light'
      ? props.theme.selectColorPlaceHolderLT
      : props.hasPlaceholder
      ? props.theme.selectColorPlaceHolder
      : props.inputTheme === 'light'
      ? props.theme.selectColorLT
      : props.theme.selectColor};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  .list__item {
    ${props =>
      props.inputTheme === 'light' ? props.theme.dropdownListItemLT : props.theme.dropdownListItem};
  }

  .list__item__anchor {
    ${props =>
      props.inputTheme === 'light'
        ? props.theme.dropdownListAnchorLT
        : props.theme.dropdownListAnchor};
  }
`;

const DropdownSelectActionRight = styled.div`
  margin-right: 2px;
  display: flex;
  color: ${props => props.theme.subtextColor};

  :hover {
    color: ${props => props.theme.textColor};
  }
`;

function DropdownSelect<Option>({
  // dropdownSelectProps,
  className,
  displayOption,
  disabled,
  onClick,
  error,
  inputTheme,
  size,
  value,
  placeholder,
  erasable,
  showArrow,
  onErase,
  showDropdown,
  DropDownLineItemRenderComponent = ListItem
}: DropdownSelectProps<Option>): JSX.Element {
  const hasValue = notNullorUndefined(value);

  return (
    <StyledDropdownSelect
      className={className}
      onClick={onClick}
      inputTheme={inputTheme}
      size={size}
    >
      <DropdownSelectValue
        hasPlaceholder={!hasValue}
        inputTheme={inputTheme}
        className="item-selector__dropdown__value"
      >
        {hasValue ? (
          <DropDownLineItemRenderComponent
            displayOption={displayOption as ListItemProps<any>['displayOption']}
            value={value}
            disabled={Boolean(disabled)}
            light={inputTheme === 'light'}
          />
        ) : (
          <FormattedMessage id={placeholder || 'placeholder.selectValue'} />
        )}
      </DropdownSelectValue>
      {erasable && hasValue ? (
        <DropdownSelectActionRight>
          <Delete height="12px" onClick={onErase} />
        </DropdownSelectActionRight>
      ) : showArrow ? (
        <DropdownSelectActionRight>
          <ArrowDown height="14px" onClick={showDropdown} />
        </DropdownSelectActionRight>
      ) : null}
    </StyledDropdownSelect>
  );
}

export default DropdownSelect;
