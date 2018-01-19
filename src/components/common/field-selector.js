import React, {Component} from 'react';
import {createSelector} from 'reselect';

import ItemSelector from './item-selector/item-selector';
import FieldToken from '../common/field-token';
import {classList} from './item-selector/dropdown-list';

const defaultDisplayOption = d => d.name;
// custom list Item
const FieldListItem = ({value, displayOption = defaultDisplayOption}) => (
  <div>
    <div style={{display: 'inline-block', margin: '0 4px 0 0'}}>
      <FieldToken type={value.type} />
    </div>
    <span className={classList.listItemAnchor}>{displayOption(value)}</span>
  </div>
);

const propTypes = {
  fields: React.PropTypes.array.isRequired,
  onSelect: React.PropTypes.func.isRequired,
  placement: React.PropTypes.string,
  value: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.string
  ]),
  filterFieldTypes: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.string
  ]),
  erasable: React.PropTypes.bool,
  error: React.PropTypes.bool,
  multiSelect: React.PropTypes.bool,
  closeOnSelect: React.PropTypes.bool,
  suggested: React.PropTypes.array
};

const defaultProps = {
  erasable: true,
  error: false,
  fields: [],
  onSelect: () => {},
  placement: 'bottom',
  value: null,
  multiSelect: false,
  closeOnSelect: true
};

const SuggestedFieldHeader = () => <div>Suggested Field</div>;

export default class FieldSelector extends Component {
  fieldsSelector = props => props.fields;
  valueSelector = props => props.value;
  filterFieldTypesSelector = props => props.filterFieldTypes;

  selectedItemsSelector = createSelector(
    this.fieldsSelector,
    this.valueSelector,
    (fields, value) =>
      fields.filter(f =>
        (Array.isArray(value) ? value : [value]).includes(
          defaultDisplayOption(f)
        )
      )
  );

  fieldOptionsSelector = createSelector(
    this.fieldsSelector,
    this.filterFieldTypesSelector,
    (fields, filterFieldTypes) => {
      if (!filterFieldTypes) {
        return fields;
      }
      const filters = Array.isArray(filterFieldTypes)
        ? filterFieldTypes
        : [filterFieldTypes];
      return fields.filter(f => filters.includes(f.type));
    }
  );

  render() {
    return (
      <div>
        <ItemSelector
          getOptionValue={d => d}
          closeOnSelect={this.props.closeOnSelect}
          displayOption={defaultDisplayOption}
          filterOption={'id'}
          fixedOptions={this.props.suggested}
          isError={this.props.error}
          selectedItems={this.selectedItemsSelector(this.props)}
          erasable={this.props.erasable}
          options={this.fieldOptionsSelector(this.props)}
          multiSelect={this.props.multiSelect}
          placeholder={'Select a field'}
          placement={this.props.placement}
          onChange={this.props.onSelect}
          DropDownLineItemRenderComponent={FieldListItem}
          DropdownHeaderComponent={
            this.props.suggested ? SuggestedFieldHeader : null
          }
        />
      </div>
    );
  }
}

FieldSelector.propTypes = propTypes;
FieldSelector.defaultProps = defaultProps;
