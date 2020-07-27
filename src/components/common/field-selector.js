// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {createSelector} from 'reselect';

import ItemSelector from './item-selector/item-selector';
import FieldToken from '../common/field-token';
import {classList} from './item-selector/dropdown-list';
import {toArray} from 'utils/utils';
import {notNullorUndefined} from 'utils/data-utils';

const defaultDisplayOption = d => d.name;

const StyledToken = styled.div`
  display: inline-block;
  margin: 0 4px 0 0;
`;

// custom list Item
export const FieldListItemFactory = (showToken = true) => {
  const FieldListItem = ({value, displayOption = defaultDisplayOption}) => (
    <div>
      {showToken ? (
        <StyledToken>
          <FieldToken type={value.type} />
        </StyledToken>
      ) : null}
      <span className={classList.listItemAnchor}>{displayOption(value)}</span>
    </div>
  );

  return FieldListItem;
};

const SuggestedFieldHeader = () => <div>Suggested Field</div>;

const FieldType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.arrayOf(PropTypes.string),
  PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      format: PropTypes.string
    })
  ),
  PropTypes.shape({
    format: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    tableFieldIndex: PropTypes.number,
    type: PropTypes.number
  })
]);

class FieldSelector extends Component {
  static propTypes = {
    fields: PropTypes.oneOfType([PropTypes.array, PropTypes.arrayOf(FieldType)]),
    onSelect: PropTypes.func.isRequired,
    placement: PropTypes.string,
    value: FieldType,
    filterFieldTypes: PropTypes.oneOfType([FieldType, PropTypes.arrayOf(FieldType)]),
    inputTheme: PropTypes.string,
    placeholder: PropTypes.string,
    erasable: PropTypes.bool,
    error: PropTypes.bool,
    multiSelect: PropTypes.bool,
    closeOnSelect: PropTypes.bool,
    showToken: PropTypes.bool,
    suggested: PropTypes.arrayOf(PropTypes.any),
    CustomChickletComponent: PropTypes.func
  };

  static defaultProps = {
    erasable: true,
    error: false,
    fields: [],
    onSelect: () => {},
    placement: 'bottom',
    value: null,
    multiSelect: false,
    closeOnSelect: true,
    showToken: true,
    placeholder: 'placeholder.selectField'
  };

  fieldsSelector = props => props.fields;
  filteredFieldsSelector = props =>
    props.fields.filter(
      field => !toArray(props.value).find(d => (d.name ? d.name === field.name : d === field.name))
    );
  valueSelector = props => props.value;
  filterFieldTypesSelector = props => props.filterFieldTypes;
  showTokenSelector = props => props.showToken;

  selectedItemsSelector = createSelector(this.fieldsSelector, this.valueSelector, (fields, value) =>
    fields.filter(f =>
      Boolean(
        toArray(value).find(d => {
          if (!notNullorUndefined(d)) {
            return false;
          }
          return d.name ? d.name === defaultDisplayOption(f) : d === defaultDisplayOption(f);
        })
      )
    )
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
          filterOption={'id'}
          fixedOptions={this.props.suggested}
          inputTheme={this.props.inputTheme}
          isError={this.props.error}
          selectedItems={this.selectedItemsSelector(this.props)}
          erasable={this.props.erasable}
          options={this.fieldOptionsSelector(this.props)}
          multiSelect={this.props.multiSelect}
          placeholder={this.props.placeholder}
          placement={this.props.placement}
          onChange={this.props.onSelect}
          DropDownLineItemRenderComponent={this.fieldListItemSelector(this.props)}
          DropdownHeaderComponent={this.props.suggested ? SuggestedFieldHeader : null}
          CustomChickletComponent={this.props.CustomChickletComponent}
        />
      </div>
    );
  }
}

export default FieldSelector;
