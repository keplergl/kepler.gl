// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component, ComponentType} from 'react';
import styled from 'styled-components';
import {createSelector} from 'reselect';

import {Field} from '@kepler.gl/types';
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
type FieldType =
  | string
  | string[]
  | {
      name: string;
      format: string | null;
    }[]
  | {
      format?: string;
      id?: string;
      name?: string;
      fieldIdx?: number;
      type?: number;
    }
  | Field;

interface FieldSelectorFactoryProps {
  fields?: FieldType[];
  onSelect: (
    items:
      | ReadonlyArray<string | number | boolean | object>
      | string
      | number
      | boolean
      | object
      | null
  ) => void;
  placement?: string;
  value?: FieldType | null;
  filterFieldTypes?: FieldType | FieldType[];
  inputTheme?: string;
  placeholder?: string;
  erasable?: boolean;
  error?: boolean;
  multiSelect?: boolean;
  closeOnSelect?: boolean;
  showToken?: boolean;
  suggested?: ReadonlyArray<string | number | boolean | object> | null;
  CustomChickletComponent?: ComponentType<any>;
  size?: string;
  reorderItems?: (newOrder: any) => void;
}

function FieldSelectorFactory(
  FieldListItemFactory: ReturnType<typeof FieldListItemFactoryFactory>
): ComponentType<FieldSelectorFactoryProps> {
  class FieldSelector extends Component<FieldSelectorFactoryProps> {
    static defaultProps = {
      erasable: true,
      error: false,
      fields: [],
      onSelect: () => {},
      reorderItems: () => {},
      placement: 'bottom',
      value: null,
      multiSelect: false,
      closeOnSelect: true,
      showToken: true,
      placeholder: 'placeholder.selectField'
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

    fieldListItemSelector = createSelector(this.showTokenSelector, FieldListItemFactory);

    render() {
      return (
        <div className="field-selector">
          <ItemSelector
            getOptionValue={d => d}
            closeOnSelect={this.props.closeOnSelect}
            displayOption={defaultDisplayOption}
            filterOption="displayName"
            fixedOptions={this.props.suggested}
            inputTheme={this.props.inputTheme}
            size={this.props.size}
            isError={this.props.error}
            selectedItems={this.selectedItemsSelector(this.props)}
            erasable={this.props.erasable}
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
        </div>
      );
    }
  }
  return FieldSelector;
}

FieldSelectorFactory.deps = [FieldListItemFactoryFactory];
export default FieldSelectorFactory;
