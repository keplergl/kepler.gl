// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import classnames from 'classnames';
import React, {Component, ComponentType} from 'react';
import styled from 'styled-components';
import {createSelector} from 'reselect';

import {Field, TooltipField} from '@kepler.gl/types';
import {notNullorUndefined, toArray} from '@kepler.gl/utils';

import ItemSelector from './item-selector/item-selector';
import {classList} from './item-selector/dropdown-list';
import FieldTokenFactory from '../common/field-token';

const defaultDisplayOption = (d: Field) => d.displayName || d.name;
const defaultValueOption = (d: Field) => d.name;

const StyledToken = styled.div`
  display: inline-block;
  margin: 0 ${props => props.theme.fieldTokenRightMargin}px 0 0;
`;
const StyledFieldListItem = styled.div`
  line-height: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const StyledFieldSelector = styled.div`
  .item-selector__dropdown {
    // smaller padding on the side to accomodate field token
    padding: 0 6px;
  }
`;
export type FieldListItemFactoryProps = {
  value: Field;
  displayOption: (field: Field) => string;
};

FieldListItemFactoryFactory.deps = [FieldTokenFactory];
// custom list Item
export function FieldListItemFactoryFactory(FieldToken) {
  const FieldListItemFactory = (showToken = true) => {
    const FieldListItem = ({
      value,
      displayOption = defaultDisplayOption
    }: FieldListItemFactoryProps) => (
      <StyledFieldListItem className="field-selector_list-item">
        {showToken ? (
          <StyledToken>
            <FieldToken type={value.type} />
          </StyledToken>
        ) : null}
        <span className={classList.listItemAnchor}>{displayOption(value)}</span>
      </StyledFieldListItem>
    );
    return FieldListItem;
  };
  return FieldListItemFactory;
}

const SuggestedFieldHeader = () => <div>Suggested Field</div>;

export type MinimalField = {name: string; displayName: string; format: string; type?: string};
export type FieldType = string | TooltipField | Field;
export type FieldValue = string | {name: string} | string[] | {name: string}[];

export type FieldSelectorProps<Option extends MinimalField> = {
  fields: Option[];
  onSelect: (
    items:
      | ReadonlyArray<string | number | boolean | object>
      | string
      | number
      | boolean
      | object
      | null
  ) => void;
  value?: FieldValue | null;
  filterFieldTypes?: string | string[];
  inputTheme?: string;
  placement?: string;
  placeholder?: string;
  erasable?: boolean;
  disabled?: boolean;
  error?: boolean;
  multiSelect?: boolean;
  closeOnSelect?: boolean;
  showToken?: boolean;
  suggested?: Option[] | null;
  CustomChickletComponent?: ComponentType<any>;
  size?: string;
  reorderItems?: (newOrder: any) => void;
  className?: string;
};

function noop() {
  return;
}
function FieldSelectorFactory(
  FieldListItemFactory: ReturnType<typeof FieldListItemFactoryFactory>
): ComponentType<FieldSelectorProps<MinimalField>> {
  class FieldSelector extends Component<FieldSelectorProps<MinimalField>> {
    static defaultProps = {
      erasable: true,
      disabled: false,
      error: false,
      fields: [],
      onSelect: noop,
      reorderItems: noop,
      placement: 'bottom',
      value: null,
      multiSelect: false,
      closeOnSelect: true,
      showToken: true,
      placeholder: 'placeholder.selectField',
      className: ''
    };

    fieldsSelector = props => props.fields;
    valueSelector = props => props.value;
    filteredFieldsSelector = createSelector(
      this.fieldsSelector,
      this.valueSelector,
      (fields, value) => {
        return fields.filter(
          field => !toArray(value).find(d => (d.name ? d.name === field.name : d === field.name))
        );
      }
    );
    filterFieldTypesSelector = props => props.filterFieldTypes;
    showTokenSelector = props => props.showToken;

    selectedItemsSelector = createSelector(
      this.fieldsSelector,
      this.valueSelector,
      (fields, value) =>
        toArray(value)
          .map(d =>
            fields.find(f =>
              notNullorUndefined(d) && d.name
                ? d.name === defaultValueOption(f)
                : d === defaultValueOption(f)
            )
          )
          .filter(d => d)
    );

    fieldOptionsSelector = createSelector(
      this.filteredFieldsSelector,
      this.filterFieldTypesSelector,
      (fields, filterFieldTypes) => {
        if (!filterFieldTypes) {
          return fields;
        }
        const filters = Array.isArray(filterFieldTypes) ? filterFieldTypes : [filterFieldTypes];
        return fields.filter(f => filters.includes(f.type));
      }
    );

    // @ts-ignore Fix later
    fieldListItemSelector = createSelector(this.showTokenSelector, FieldListItemFactory);

    render() {
      return (
        <StyledFieldSelector className={classnames('field-selector', this.props.className)}>
          <ItemSelector
            getOptionValue={d => d}
            disabled={this.props.disabled}
            closeOnSelect={this.props.closeOnSelect}
            displayOption={defaultDisplayOption}
            filterOption="displayName"
            fixedOptions={this.props.suggested}
            inputTheme={this.props.inputTheme}
            size={this.props.size}
            isError={this.props.error}
            selectedItems={this.selectedItemsSelector(this.props)}
            erasable={this.props.erasable}
            // @ts-ignore - Argument of type 'Readonly<FieldSelectorFactoryProps>' is not assignable to parameter of type 'never'
            options={this.fieldOptionsSelector(this.props)}
            multiSelect={this.props.multiSelect}
            placeholder={this.props.placeholder}
            placement={this.props.placement}
            onChange={this.props.onSelect}
            reorderItems={this.props.reorderItems}
            DropDownLineItemRenderComponent={this.fieldListItemSelector(this.props)}
            DropdownHeaderComponent={this.props.suggested ? SuggestedFieldHeader : null}
            CustomChickletComponent={this.props.CustomChickletComponent}
          />
        </StyledFieldSelector>
      );
    }
  }

  // @ts-ignore: Fix me
  return FieldSelector;
}

FieldSelectorFactory.deps = [FieldListItemFactoryFactory];
export default FieldSelectorFactory;
