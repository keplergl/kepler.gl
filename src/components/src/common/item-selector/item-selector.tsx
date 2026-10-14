// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component, createRef, ComponentType, MouseEventHandler, RefObject} from 'react';
import classnames from 'classnames';
import uniqBy from 'es-toolkit/compat/uniqBy';
import styled, {IStyledComponent, keyframes} from 'styled-components';

import Accessor from './accessor';
import ChickletedInput from './chickleted-input';
import Typeahead from './typeahead';
import DropdownList, {ListItem} from './dropdown-list';
import Portaled from '../../common/portaled';
import {observeDimensions, unobserveDimensions} from '@kepler.gl/utils';
import {toArray} from '@kepler.gl/common-utils';
import {injectIntl, IntlShape} from 'react-intl';
import {ListItemProps} from './dropdown-select';
import DropdownSelect from './dropdown-select';
import {shouldForwardProp} from '../styled-components';

export type DropdownWrapperProps = {
  placement?: string;
  width: number;
};

const DropdownWrapper: IStyledComponent<'web', DropdownWrapperProps> = styled.div.withConfig({
  shouldForwardProp
})<DropdownWrapperProps>`
  border: 0;
  width: 100%;
  left: 0;
  z-index: ${props => props.theme.dropdownWrapperZ};
  width: ${props => props.width}px;
`;

const DropdownFrame = styled.div<{$preparing?: boolean}>`
  position: relative;

  ${props =>
    props.$preparing
      ? `
    .typeahead {
      pointer-events: none;
    }
  `
      : ''}
`;

const PrepareOverlay = styled.div.attrs({
  className: 'item-selector__prepare'
})`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
`;

const prepareSpin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const PrepareSpinner = styled.span.attrs({
  className: 'item-selector__prepare-spinner',
  'aria-hidden': true
})`
  display: block;
  width: 24px;
  height: 24px;
  box-sizing: border-box;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.subtextColor};
  border-top-color: ${props => props.theme.activeColor};
  will-change: transform;
  animation: ${prepareSpin} 0.7s linear infinite;
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
  /**
   * Paint a spinner over the open list before `onChange`. Used when the
   * change parses a large dataset and would freeze the open selector.
   */
  deferOnChange?: boolean;
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

class ItemSelectorUnmemoized extends Component<
  ItemSelectorProps<any>,
  {showTypeahead: boolean; dimensions?: any; preparing: boolean}
> {
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
    preparing: false,
    dimensions: {
      width: 200
    }
  };

  _unmounted = false;
  _preparingSelection = false;
  _prepareFrames: number[] = [];

  componentDidMount() {
    if (this.props.showDropdownOnMount) {
      this.setState({showTypeahead: true});
    }

    if (this.root.current instanceof HTMLElement) {
      observeDimensions(this.root.current, this._handleResize);
    }
  }

  componentWillUnmount() {
    this._unmounted = true;
    this._prepareFrames.forEach(id => window.cancelAnimationFrame(id));
    if (this.root.current instanceof HTMLElement) {
      unobserveDimensions(this.root.current);
    }
  }

  root: RefObject<HTMLDivElement | null> = createRef();

  handleClickOutside = () => {
    if (this._preparingSelection) {
      return;
    }
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
    if (this._preparingSelection) {
      return;
    }
    const getValue = Accessor.generateOptionToStringFor(
      this.props.getOptionValue || this.props.displayOption
    );

    const previousSelected = toArray(this.props.selectedItems);
    const nextValue = this.props.multiSelect
      ? uniqBy(previousSelected.concat(toArray(item)), getValue)
      : getValue(item);

    const apply = () => {
      this.props.onChange(nextValue);
      if (this._unmounted) {
        return;
      }
      this._preparingSelection = false;
      if (this.props.closeOnSelect) {
        this.setState({showTypeahead: false, preparing: false});
        this._onBlur();
      } else {
        this.setState({preparing: false});
      }
    };

    if (this.props.deferOnChange) {
      // Keep the open list on screen, faded, until the dataset parse starts.
      this._preparingSelection = true;
      this.setState({preparing: true});
      const first = window.requestAnimationFrame(() => {
        const second = window.requestAnimationFrame(apply);
        this._prepareFrames.push(second);
      });
      this._prepareFrames.push(first);
      return;
    }

    apply();
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

    const {preparing} = this.state;

    return (
      <Portaled left={0} top={0} isOpened={this.state.showTypeahead} onClose={this._hideTypeahead}>
        <DropDownWrapperComponent placement={placement} width={dimensions?.width}>
          <DropdownFrame $preparing={preparing}>
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
            {preparing ? (
              <PrepareOverlay>
                <PrepareSpinner />
              </PrepareOverlay>
            ) : null}
          </DropdownFrame>
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
