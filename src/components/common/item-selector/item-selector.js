// Copyright (c) 2019 Uber Technologies, Inc.
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
import PropTypes from 'prop-types';
import classnames from 'classnames';
import uniq from 'lodash.uniq';
import listensToClickOutside from 'react-onclickoutside';
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
  ${props =>
    props.inputTheme === 'secondary'
      ? props.theme.secondaryInput
      : props.theme.input};

  .list__item__anchor {
    ${props => props.theme.dropdownListAnchor};
  }
`;

const DropdownSelectValue = styled.span`
  color: ${props =>
    props.hasPlaceholder
      ? props.theme.selectColorPlaceHolder
      : props.theme.selectColor};
  overflow: hidden;
`;

const DropdownSelectErase = styled.div`
  margin-left: 6px;
  display: flex;
`;

const DropdownWrapper = styled.div`
  background: ${props => props.theme.dropdownBgd};
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

class ItemSelector extends Component {
  static propTypes = {
    // required properties
    selectedItems: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
      PropTypes.object
    ]),
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.any).isRequired,

    // optional properties
    fixedOptions: PropTypes.arrayOf(PropTypes.any),
    erasable: PropTypes.bool,
    displayOption: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    getOptionValue: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    filterOption: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    placement: PropTypes.string,
    disabled: PropTypes.bool,
    isError: PropTypes.bool,
    multiSelect: PropTypes.bool,
    inputTheme: PropTypes.string,
    onBlur: PropTypes.func,
    placeholder: PropTypes.string,
    closeOnSelect: PropTypes.bool,
    DropdownHeaderComponent: PropTypes.func,
    DropDownRenderComponent: PropTypes.func,
    DropDownLineItemRenderComponent: PropTypes.func
  };

  static defaultProps = {
    erasable: false,
    placement: 'bottom',
    selectedItems: [],
    displayOption: null,
    getOptionValue: null,
    filterOption: null,
    fixedOptions: null,
    inputTheme: 'primary',
    multiSelect: true,
    placeholder: 'Enter a value',
    closeOnSelect: true,
    searchable: true,
    dropdownHeader: null,
    DropdownHeaderComponent: null,
    DropDownRenderComponent: DropdownList,
    DropDownLineItemRenderComponent: ListItem
  };

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
          selectedItems={_toArray(this.props.selectedItems)}
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

    const dropdownSelectProps = {
      className: classnames(`item-selector__dropdown`, {
        active: this.state.showTypeahead
      }),
      disabled: this.props.disabled,
      onClick: this._showTypeahead,
      onFocus: this._showPopover,
      error: this.props.isError,
      inputTheme: this.props.inputTheme
    };

    return (
      <div className="item-selector">
        <div style={{position: 'relative'}}>
          {/* this part is used to display the label */}
          {this.props.multiSelect ? (
            <ChickletedInput
              {...dropdownSelectProps}
              selectedItems={_toArray(this.props.selectedItems)}
              placeholder={this.props.placeholder}
              displayOption={displayOption}
              removeItem={this._removeItem}
            />
          ) : (
            <StyledDropdownSelect {...dropdownSelectProps}>
              <DropdownSelectValue hasPlaceholder={!hasValue}>
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
                <DropdownSelectErase>
                  <Delete height="12px" onClick={this._onErase} />
                </DropdownSelectErase>
              ) : null}
            </StyledDropdownSelect>
          )}
          {/* this part is used to built the list */}
          {this.state.showTypeahead && this._renderDropdown()}
        </div>
      </div>
    );
  }
};

export default listensToClickOutside(ItemSelector);
