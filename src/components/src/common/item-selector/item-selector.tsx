// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component, createRef, ComponentType, MouseEventHandler, RefObject} from 'react';
import classnames from 'classnames';
import uniqBy from 'lodash.uniqby';
import styled from 'styled-components';

import Accessor from './accessor';
import ChickletedInput from './chickleted-input';
import Typeahead from './typeahead';
import DropdownList, {ListItem} from './dropdown-list';
import Portaled from '../../common/portaled';
import {toArray, observeDimensions, unobserveDimensions} from '@kepler.gl/utils';
import {injectIntl, IntlShape} from 'react-intl';
import {ListItemProps} from './dropdown-select';
import DropdownSelect from './dropdown-select';

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

export type ItemSelectorProps<Option> = {
  selectedItems?: ReadonlyArray<Option> | string | number | boolean | object | null;
  options: ReadonlyArray<Option>;
  onChange: (items: ReadonlyArray<Option> | string | number | boolean | object | null) => void;
  fixedOptions?: ReadonlyArray<Option> | null;
  erasable?: boolean;
  showArrow?: boolean;
  searchOptions?: (value: any, opt: Option) => any;
  searchable?: boolean;
  displayOption?: string | ((opt: Option) => string);
  getOptionValue?: string | ((opt: Option) => any);
  filterOption?: string | ((opt: Option) => boolean);
  placement?: string;
  disabled?: boolean;
  isError?: boolean;
  multiSelect?: boolean;
  inputTheme?: string;
  onOpen?: () => void;
  size?: string;
  onBlur?: () => void;
  placeholder?: string;
  closeOnSelect?: boolean;
  typeaheadPlaceholder?: string;
  DropDownWrapperComponent?: ComponentType<any> | null;
  DropdownHeaderComponent?: ComponentType<any> | null;
  DropDownRenderComponent?: ComponentType<any>;
  DropDownLineItemRenderComponent?: ComponentType<ListItemProps<Option>>;
  CustomChickletComponent?: ComponentType<any>;
  intl: IntlShape;
  className?: string;
  reorderItems?: (newOrder: any) => void;
  showDropdownOnMount?: boolean;
};

class ItemSelectorUnmemoized extends Component<ItemSelectorProps<any>> {
  static defaultProps = {
    multiSelect: true,
    placeholder: 'placeholder.enterValue',
    closeOnSelect: true,
    searchable: true,
    DropDownRenderComponent: DropdownList,
    DropDownLineItemRenderComponent: ListItem,
    DropDownWrapperComponent: DropdownWrapper,
    reorderItems: undefined,
    className: ''
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
      if (this.props.onOpen) {
        this.props.onOpen();
      }
      this.setState({
        showTypeahead: true
      });
    }
  };

  _renderDropdown(intl: IntlShape) {
    const {placement = 'bottom'} = this.props;
    const {dimensions} = this.state;

    const DropDownWrapperComponent = this.props
      .DropDownWrapperComponent as React.ComponentType<any>;

    return (
      <Portaled left={0} top={0} isOpened={this.state.showTypeahead} onClose={this._hideTypeahead}>
        <DropDownWrapperComponent placement={placement} width={dimensions?.width}>
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
        </DropDownWrapperComponent>
      </Portaled>
    );
  }

  render() {
    const selected = toArray(this.props.selectedItems);
    const displayOption = Accessor.generateOptionToStringFor(this.props.displayOption);
    const {disabled, inputTheme = 'primary'} = this.props;

    const dropdownSelectProps = {
      className: classnames({
        active: this.state.showTypeahead
      }),
      displayOption,
      disabled,
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
              reorderItems={this.props.reorderItems}
              CustomChickletComponent={this.props.CustomChickletComponent}
              inputTheme={inputTheme}
            />
          ) : (
            <DropdownSelect
              {...dropdownSelectProps}
              value={selected[0]}
              placeholder={this.props.placeholder}
              erasable={this.props.erasable}
              showArrow={this.props.showArrow}
              onErase={this._onErase}
              showDropdown={this._showTypeahead}
              DropDownLineItemRenderComponent={this.props.DropDownLineItemRenderComponent}
            />
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

export default injectIntl(ItemSelector);
