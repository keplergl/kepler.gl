import React, {Component} from 'react';
import PropTypes from 'prop-types';
import uniq from 'lodash.uniq';
import listensToClickOutside from 'react-onclickoutside/decorator';
import styled from 'styled-components';

import Accessor from './accessor';
import ChickletedInput from './chickleted-input';
import Typeahead from './typeahead';
import {Delete} from 'components/common/icons';
import DropdownList, {ListItem} from './dropdown-list';

/**
 * Converts non-arrays to arrays.  Leaves arrays alone.  Converts
 * undefined values to empty arrays ([] instead of [undefined]).
 * Otherwise, just returns [item] for non-array items.
 *
 * @param {*} item
 * @returns {array} boom! much array. very indexed. so useful.
 */
function _toArray(item) {
  if (Array.isArray(item)) {
    return item;
  }

  if (typeof item === 'undefined' || item === null) {
    return [];
  }

  return [item];
}

const StyledDropdownSelect = styled.div`
  ${props => props.theme.input};

  .list__item__anchor {
    ${props => props.theme.dropdownListAnchor};
  }
`;

const DropdownSelectValue = styled.span`
  color: ${props =>
    props.placeholder
      ? props.theme.selectColorPlaceHolder
      : props.theme.selectColor};
`;

const DropdownWrapper = styled.div`
  background: ${props => props.theme.selectBackground};
  border: 0;
  width: 100%;
  left: 0;
  z-index: 100;
  position: absolute;
  bottom: ${props =>
    props.placement === 'top' ? props.theme.inputBoxHeight : 'auto'};
  margin-top: ${props => (props.placement === 'bottom' ? '4px' : 'auto')};
  margin-bottom: ${props => (props.placement === 'top' ? '4px' : 'auto')};
`;

const propTypes = {
  // required properties
  selectedItems: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
    PropTypes.object,
    PropTypes.bool
  ]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,

  // optional properties
  fixedOptions: PropTypes.array,
  displayOption: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  getOptionValue: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  filterOption: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  placement: PropTypes.string,
  disabled: PropTypes.bool,
  isError: PropTypes.bool,
  multiSelect: PropTypes.bool,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  closeOnSelect: PropTypes.bool,
  DropdownHeaderComponent: PropTypes.func,
  DropDownRenderComponent: PropTypes.func,
  DropDownLineItemRenderComponent: PropTypes.func
};

const defaultProps = {
  erasable: false,
  placement: 'bottom',
  selectedItems: [],
  displayOption: null,
  getOptionValue: null,
  filterOption: null,
  fixedOptions: null,
  multiSelect: true,
  placeholder: 'Enter a value',
  closeOnSelect: true,
  searchable: true,
  dropdownHeader: null,
  DropdownHeaderComponent: null,
  DropDownRenderComponent: DropdownList,
  DropDownLineItemRenderComponent: ListItem
};

class ItemSelector extends Component {
  state = {
    showTypeahead: false
  };

  handleClickOutside = () => {
    this._hideTypeahead();
  };

  _hideTypeahead() {
    this.setState({showTypeahead: false});
    this._onBlur();
  }

  _onBlur = () => {
    // note: chickleted input is not a real form element so we call onBlur()
    // when we feel the events are appropriate
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  };

  _removeItem = (item, e) => {
    // only used when multiSelect = true
    e.preventDefault();
    e.stopPropagation();
    const {selectedItems} = this.props;
    const index = selectedItems.findIndex(t => t === item);

    if (index < 0) {
      return;
    }

    const items = [
      ...selectedItems.slice(0, index),
      ...selectedItems.slice(index + 1, selectedItems.length)
    ];

    this.props.onChange(items);

    if (this.props.closeOnSelect) {
      this.setState({showTypeahead: false});
      this._onBlur();
    }
  };

  _selectItem = item => {
    const getValue = Accessor.generateOptionToStringFor(
      this.props.getOptionValue || this.props.displayOption
    );

    const previousSelected = _toArray(this.props.selectedItems);

    if (this.props.multiSelect) {
      const items = uniq(previousSelected.concat(_toArray(item).map(getValue)));
      this.props.onChange(items);
    } else {
      this.props.onChange(getValue(item));
    }

    if (this.props.closeOnSelect) {
      this.setState({showTypeahead: false});
      this._onBlur();
    }
  };

  _onErase = e => {
    e.stopPropagation();
    this.props.onChange(null);
  };

  _showTypeahead = () => {
    if (!this.props.disabled) {
      this.setState({
        showTypeahead: true
      });
    }
  };

  _renderDropdown() {
    return (
      <DropdownWrapper placement={this.props.placement}>
        <Typeahead
          customClasses={{
            results: 'list-selector',
            input: 'typeahead__input',
            listItem: 'list__item',
            listAnchor: 'list__item__anchor'
          }}
          options={this.props.options}
          filterOption={this.props.filterOption}
          fixedOptions={this.props.fixedOptions}
          placeholder="Search"
          onOptionSelected={this._selectItem}
          customListComponent={this.props.DropDownRenderComponent}
          customListHeaderComponent={this.props.DropdownHeaderComponent}
          customListItemComponent={this.props.DropDownLineItemRenderComponent}
          displayOption={Accessor.generateOptionToStringFor(
            this.props.displayOption
          )}
          searchable={this.props.searchable}
          showOptionsWhenEmpty
        />
      </DropdownWrapper>
    );
  }

  render() {
    const selected = _toArray(this.props.selectedItems);
    const hasValue = selected.length;
    const displayOption = Accessor.generateOptionToStringFor(
      this.props.displayOption
    );
    const eventProps = {
      onClick: this._showTypeahead,
      onFocus: this._showPopover
    };

    return (
      <div className="item-selector">
        <div style={{position: 'relative'}}>
          {/* this part is used to display the label */}
          {this.props.multiSelect ? (
            <ChickletedInput
              {...eventProps}
              disabled={this.props.disabled}
              isError={this.props.isError}
              selectedItems={_toArray(this.props.selectedItems)}
              placeholder={this.props.placeholder}
              displayOption={displayOption}
              removeItem={this._removeItem}
            />
          ) : (
            <StyledDropdownSelect
              {...eventProps}
              active={this.state.showTypeahead}
              error={this.props.isError}
              disabled={this.props.disabled}
            >
              <DropdownSelectValue placeholder={!hasValue}>
                {hasValue ? (
                  <this.props.DropDownLineItemRenderComponent
                    displayOption={displayOption}
                    value={selected[0]}
                  />
                ) : (
                  this.props.placeholder
                )}
              </DropdownSelectValue>
              {this.props.erasable && hasValue ? (
                <Delete height="12px" onClick={this._onErase} />
              ) : null}
            </StyledDropdownSelect>
          )}
          {/* this part is used to built the list */}
          {this.state.showTypeahead && this._renderDropdown()}
        </div>
      </div>
    );
  }
}

ItemSelector.propTypes = propTypes;
ItemSelector.defaultProps = defaultProps;

export default listensToClickOutside(ItemSelector);
