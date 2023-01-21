// Copyright (c) 2023 Uber Technologies, Inc.
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

import React, {Component, createRef, ComponentType, MouseEventHandler, RefObject} from 'react';
import classnames from 'classnames';
import uniqBy from 'lodash.uniqby';
import styled from 'styled-components';

import Accessor from './accessor';
import ChickletedInput from './chickleted-input';
import Typeahead from './typeahead';
import {Delete, ArrowDown} from '../icons';
import DropdownList, {ListItem} from './dropdown-list';
import Portaled from '../../common/portaled';
import {toArray, observeDimensions, unobserveDimensions} from '@kepler.gl/utils';
import {injectIntl, IntlShape} from 'react-intl';
import {FormattedMessage} from '@kepler.gl/localization';

interface StyledDropdownSelectProps {
  inputTheme?: string;
  size?: string;
  className?: string;
}

export const StyledDropdownSelect = styled.div.attrs(props => ({
  className: classnames('item-selector__dropdown', props.className)
}))<StyledDropdownSelectProps>`
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

interface DropdownSelectValueProps {
  hasPlaceholder?: boolean;
  inputTheme?: string;
  disabled?: boolean;
}

const DropdownSelectValue = styled.span<DropdownSelectValueProps>`
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
  margin-right: 6px;
  display: flex;
  color: ${props => props.theme.subtextColor};

  :hover {
    color: ${props => props.theme.textColor};
  }
`;

interface DropdownWrapperProps {
  placement?: string;
  width: number;
}

const DropdownWrapper = styled.div<DropdownWrapperProps>`
  border: 0;
  width: 100%;
  left: 0;
  z-index: ${props => props.theme.dropdownWrapperZ};
  width: ${props => props.width}px;
`;

export type ItemSelectorProps = {
  selectedItems?:
    | ReadonlyArray<string | number | boolean | object>
    | string
    | number
    | boolean
    | object
    | null;
  options: ReadonlyArray<string | number | boolean | object>;
  onChange: (
    items:
      | ReadonlyArray<string | number | boolean | object>
      | string
      | number
      | boolean
      | object
      | null
  ) => void;
  fixedOptions?: ReadonlyArray<string | number | boolean | object> | null;
  erasable?: boolean;
  showArrow?: boolean;
  searchOptions?: (value: any, opt: any) => any;
  searchable?: boolean;
  displayOption?: string | ((opt: any) => any);
  getOptionValue?: string | ((opt: any) => any);
  filterOption?: string | ((opt: any) => any);
  placement?: string;
  disabled?: boolean;
  isError?: boolean;
  multiSelect?: boolean;
  inputTheme?: string;
  size?: string;
  onBlur?: () => void;
  placeholder?: string;
  closeOnSelect?: boolean;
  typeaheadPlaceholder?: string;
  DropdownHeaderComponent?: ComponentType<any> | null;
  DropDownRenderComponent?: ComponentType<any>;
  DropDownLineItemRenderComponent?: ComponentType<any>;
  CustomChickletComponent?: ComponentType<any>;
  intl: IntlShape;
  className?: string;
  showDropdownOnMount?: boolean;
};

class ItemSelectorUnmemoized extends Component<ItemSelectorProps> {
  static defaultProps = {
    multiSelect: true,
    placeholder: 'placeholder.enterValue',
    closeOnSelect: true,
    searchable: true,
    DropDownRenderComponent: DropdownList,
    DropDownLineItemRenderComponent: ListItem
  };

  state = {
    showTypeahead: false,
    dimensions: {
      width: 200
    }
  };

  componentDidMount() {
    if (this.props.showDropdownOnMount) {
      this.setState({showTypeahead: true});
    }

    if (this.root.current instanceof HTMLElement) {
      observeDimensions(this.root.current, this._handleResize);
    }
  }

  componentWillUnmount() {
    if (this.root.current instanceof HTMLElement) {
      unobserveDimensions(this.root.current);
    }
  }

  root: RefObject<HTMLDivElement> = createRef();

  handleClickOutside = () => {
    this._hideTypeahead();
  };

  _handleResize = dimensions => {
    this.setState({dimensions});
  };

  _hideTypeahead = () => {
    this.setState({showTypeahead: false});
    this._onBlur();
  };

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
    const multiSelectedItems = toArray(this.props.selectedItems);
    const index = multiSelectedItems.findIndex(t => t === item);

    if (index < 0) {
      return;
    }

    const items = [
      ...multiSelectedItems.slice(0, index),
      ...multiSelectedItems.slice(index + 1, multiSelectedItems.length)
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

    const previousSelected = toArray(this.props.selectedItems);

    if (this.props.multiSelect) {
      const items = uniqBy(previousSelected.concat(toArray(item)), getValue);
      this.props.onChange(items);
    } else {
      this.props.onChange(getValue(item));
    }

    if (this.props.closeOnSelect) {
      this.setState({showTypeahead: false});
      this._onBlur();
    }
  };

  _onErase: MouseEventHandler = e => {
    e.stopPropagation();
    this.props.onChange(null);
  };

  _showTypeahead: MouseEventHandler = e => {
    e.stopPropagation();
    if (!this.props.disabled) {
      this.setState({
        showTypeahead: true
      });
    }
  };

  _renderDropdown(intl: IntlShape) {
    const {placement = 'bottom'} = this.props;
    const {dimensions} = this.state;

    return (
      <Portaled left={0} top={0} isOpened={this.state.showTypeahead} onClose={this._hideTypeahead}>
        <DropdownWrapper placement={placement} width={dimensions?.width}>
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
            placeholder={
              this.props.typeaheadPlaceholder || intl
                ? intl.formatMessage({id: 'placeholder.search'})
                : 'Search'
            }
            onOptionSelected={this._selectItem}
            customListComponent={this.props.DropDownRenderComponent}
            customListHeaderComponent={this.props.DropdownHeaderComponent}
            customListItemComponent={this.props.DropDownLineItemRenderComponent}
            displayOption={Accessor.generateOptionToStringFor(this.props.displayOption)}
            searchable={this.props.searchable}
            searchOptions={this.props.searchOptions}
            showOptionsWhenEmpty
            selectedItems={toArray(this.props.selectedItems)}
            light={this.props.inputTheme === 'light'}
          />
        </DropdownWrapper>
      </Portaled>
    );
  }

  render() {
    const selected = toArray(this.props.selectedItems);
    const hasValue = selected.length;
    const displayOption = Accessor.generateOptionToStringFor(this.props.displayOption);
    const {
      disabled,
      inputTheme = 'primary',
      DropDownLineItemRenderComponent = ListItem
    } = this.props;

    const dropdownSelectProps = {
      className: classnames({
        active: this.state.showTypeahead
      }),
      displayOption,
      disabled: disabled,
      onClick: this._showTypeahead,
      error: this.props.isError,
      inputTheme,
      size: this.props.size
    };
    const intl = this.props.intl;

    return (
      <div className={classnames('item-selector', this.props.className)} ref={this.root}>
        <div style={{position: 'relative'}}>
          {/* this part is used to display the label */}
          {this.props.multiSelect ? (
            <ChickletedInput
              {...dropdownSelectProps}
              selectedItems={toArray(this.props.selectedItems)}
              placeholder={this.props.placeholder}
              removeItem={this._removeItem}
              CustomChickletComponent={this.props.CustomChickletComponent}
              inputTheme={inputTheme}
            />
          ) : (
            <StyledDropdownSelect {...dropdownSelectProps}>
              <DropdownSelectValue
                hasPlaceholder={!hasValue}
                disabled={disabled}
                inputTheme={inputTheme}
                className="item-selector__dropdown__value"
              >
                {hasValue ? (
                  <DropDownLineItemRenderComponent
                    displayOption={displayOption}
                    value={selected[0]}
                    disabled={disabled}
                    light={inputTheme === 'light'}
                  />
                ) : (
                  <FormattedMessage id={this.props.placeholder || 'placeholder.selectValue'} />
                )}
              </DropdownSelectValue>
              {this.props.erasable && hasValue ? (
                <DropdownSelectActionRight>
                  <Delete height="12px" onClick={this._onErase} />
                </DropdownSelectActionRight>
              ) : this.props.showArrow ? (
                <DropdownSelectActionRight>
                  <ArrowDown height="14px" onClick={this._showTypeahead} />
                </DropdownSelectActionRight>
              ) : null}
            </StyledDropdownSelect>
          )}
          {/* this part is used to built the list */}
          {this._renderDropdown(intl)}
        </div>
      </div>
    );
  }
}

const ItemSelector = React.memo(ItemSelectorUnmemoized);
ItemSelector.displayName = 'ItemSelector';

export default injectIntl(ItemSelectorUnmemoized);
