// Copyright (c) 2018 Uber Technologies, Inc.
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
import fuzzy from 'fuzzy';
import classNames from 'classnames';
import styled from 'styled-components';
import {console as Console} from 'global/window';

import Accessor from './accessor';
import KeyEvent from './keyevent';
import DropdownList, {ListItem} from './dropdown-list';
import {Search} from 'components/common/icons';

const DEFAULT_CLASS = 'typeahead';
/**
 * Copied mostly from 'react-typeahead', an auto-completing text input
 *
 * Renders an text input that shows options nearby that you can use the
 * keyboard or mouse to select.
 */

const TypeaheadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.dropdownListBgd};
  box-shadow: ${props => props.theme.dropdownListShadow};

  :focus {
    outline: 0;
  }
`;

const InputBox = styled.div`
  padding: 8px;
`;

const TypeaheadInput = styled.input`
  ${props => props.theme.secondaryInput}
  :hover {
    cursor: pointer;
    background-color: ${props => props.theme.secondaryInputBgd};
  }
`;

const InputIcon = styled.div`
  position: absolute;
  right: 15px;
  top: 14px;
  color: ${props => props.theme.inputPlaceholderColor};
`;

export default class Typeahead extends Component {
  static propTypes = {
    name: PropTypes.string,
    customClasses: PropTypes.object,
    maxVisible: PropTypes.number,
    resultsTruncatedMessage: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.any),
    fixedOptions: PropTypes.arrayOf(PropTypes.any),
    allowCustomValues: PropTypes.number,
    initialValue: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    textarea: PropTypes.bool,
    inputProps: PropTypes.object,
    onOptionSelected: PropTypes.func,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyPress: PropTypes.func,
    onKeyUp: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    filterOption: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    searchOptions: PropTypes.func,
    displayOption: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    inputDisplayOption: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    formInputOption: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    defaultClassNames: PropTypes.bool,
    customListComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    customListItemComponent: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func
    ]),
    customListHeaderComponent: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func
    ]),
    showOptionsWhenEmpty: PropTypes.bool,
    searchable: PropTypes.bool
  };

  static defaultProps = {
    options: [],
    customClasses: {},
    allowCustomValues: 0,
    initialValue: '',
    value: '',
    placeholder: '',
    disabled: false,
    textarea: false,
    inputProps: {},
    onOptionSelected(option) {},
    onChange(event) {},
    onKeyDown(event) {},
    onKeyPress(event) {},
    onKeyUp(event) {},
    onFocus(event) {},
    onBlur(event) {},
    filterOption: null,
    searchOptions: null,
    inputDisplayOption: null,
    defaultClassNames: true,
    customListComponent: DropdownList,
    customListItemComponent: ListItem,
    customListHeaderComponent: null,
    showOptionsWhenEmpty: true,
    searchable: true,
    resultsTruncatedMessage: null
  };

  constructor(props) {
    super(props);

    this.state = {
      searchResults: this.getOptionsForValue(
        this.props.initialValue,
        this.props.options
      ),

      // This should be called something else, 'entryValue'
      entryValue: this.props.value || this.props.initialValue,

      // A valid typeahead value
      selection: this.props.value,

      // Index of the selection
      selectionIndex: null,

      // Keep track of the focus state of the input element, to determine
      // whether to show options when empty (if showOptionsWhenEmpty is true)
      isFocused: false
    };
  }

  componentDidMount() {
    this.setState({
      searchResults: this.getOptionsForValue('', this.props.options)
    });

    // call focus on entry or div to trigger key events listener
    if (this.entry) {
      this.entry.focus();
    } else {
      this.root.focus();
    }
  }

  componentWillReceiveProps(nextProps) {
    const searchResults = this.getOptionsForValue(
      this.state.entryValue,
      nextProps.options
    );

    this.setState({searchResults});
  }

  _shouldSkipSearch(input) {
    const emptyValue = !input || input.trim().length === 0;

    // this.state must be checked because it may not be defined yet if this function
    // is called from within getInitialState
    const isFocused = this.state && this.state.isFocused;
    return !(this.props.showOptionsWhenEmpty && isFocused) && emptyValue;
  }

  getOptionsForValue(value, options) {
    if (!this.props.searchable) {
      // directly pass through options if can not be searched
      return options;
    }
    if (this._shouldSkipSearch(value)) {
      return options;
    }

    const searchOptions = this._generateSearchFunction();
    return searchOptions(value, options);
  }

  focus() {
    if (this.entry) {
      this.entry.focus();
    }
  }

  _hasCustomValue() {
    return (
      this.props.allowCustomValues > 0 &&
      this.state.entryValue.length >= this.props.allowCustomValues &&
      this.state.searchResults.indexOf(this.state.entryValue) < 0
    );
  }

  _getCustomValue() {
    return this._hasCustomValue() ? this.state.entryValue : null;
  }

  _renderIncrementalSearchResults() {
    return (
      <this.props.customListComponent
        fixedOptions={this.props.fixedOptions}
        options={
          this.props.maxVisible
            ? this.state.searchResults.slice(0, this.props.maxVisible)
            : this.state.searchResults
        }
        areResultsTruncated={
          this.props.maxVisible &&
          this.state.searchResults.length > this.props.maxVisible
        }
        resultsTruncatedMessage={this.props.resultsTruncatedMessage}
        onOptionSelected={this._onOptionSelected}
        allowCustomValues={this.props.allowCustomValues}
        customValue={this._getCustomValue()}
        customClasses={this.props.customClasses}
        customListItemComponent={this.props.customListItemComponent}
        customListHeaderComponent={this.props.customListHeaderComponent}
        selectionIndex={this.state.selectionIndex}
        defaultClassNames={this.props.defaultClassNames}
        displayOption={this.props.displayOption}
        selectedItems={this.props.selectedItems}
      />
    );
  }

  getSelection() {
    let index = this.state.selectionIndex;

    if (this._hasCustomValue()) {
      if (index === 0) {
        return this.state.entryValue;
      }
      index--;
    }
    if (this._hasFixedOptions()) {
      return index < this.props.fixedOptions.length
        ? this.props.fixedOptions[index]
        : this.state.searchResults[index - this.props.fixedOptions.length];
    }
    return this.state.searchResults[index];
  }

  _onOptionSelected = (option, event) => {
    if (this.props.searchable) {
      // reset entry input
      this.setState({
        searchResults: this.getOptionsForValue('', this.props.options),
        selection: '',
        entryValue: ''
      });
    }

    return this.props.onOptionSelected(option, event);
  };

  // use () => {} to avoid binding 'this'
  _onTextEntryUpdated = () => {
    if (this.props.searchable) {
      const value = this.entry.value;

      this.setState({
        searchResults: this.getOptionsForValue(value, this.props.options),
        selection: '',
        entryValue: value
      });
    }
  };

  _onEnter = event => {
    const selection = this.getSelection();
    if (!selection) {
      return this.props.onKeyDown(event);
    }
    return this._onOptionSelected(selection, event);
  };

  _onEscape() {
    this.setState({
      selectionIndex: null
    });
  }

  _onTab(event) {
    const selection = this.getSelection();
    let option = selection
      ? selection
      : this.state.searchResults.length > 0
        ? this.state.searchResults[0]
        : null;

    if (option === null && this._hasCustomValue()) {
      option = this._getCustomValue();
    }

    if (option !== null) {
      return this._onOptionSelected(option, event);
    }
  }

  eventMap(event) {
    const events = {};

    events[KeyEvent.DOM_VK_UP] = this.navUp;
    events[KeyEvent.DOM_VK_DOWN] = this.navDown;
    events[KeyEvent.DOM_VK_RETURN] = events[
      KeyEvent.DOM_VK_ENTER
    ] = this._onEnter;
    events[KeyEvent.DOM_VK_ESCAPE] = this._onEscape;
    events[KeyEvent.DOM_VK_TAB] = this._onTab;

    return events;
  }

  _nav(delta) {
    if (!this._hasHint()) {
      return;
    }
    let newIndex =
      this.state.selectionIndex === null
        ? delta === 1 ? 0 : delta
        : this.state.selectionIndex + delta;
    let length = this.props.maxVisible
      ? this.state.searchResults.slice(0, this.props.maxVisible).length
      : this.state.searchResults.length;
    if (this._hasCustomValue()) {
      length += 1;
    }

    if (newIndex < 0) {
      newIndex += length;
    } else if (newIndex >= length) {
      newIndex -= length;
    }

    this.setState({selectionIndex: newIndex});
  }

  navDown = () => {
    this._nav(1);
  };

  navUp = () => {
    this._nav(-1);
  };

  _onChange = event => {
    if (this.props.onChange) {
      this.props.onChange(event);
    }

    this._onTextEntryUpdated();
  };

  _onKeyDown = event => {
    // If there are no visible elements, don't perform selector navigation.
    // Just pass this up to the upstream onKeydown handler.
    // Also skip if the user is pressing the shift key, since none of our handlers are looking for shift
    if (!this._hasHint() || event.shiftKey) {
      return this.props.onKeyDown(event);
    }

    const handler = this.eventMap()[event.keyCode];

    if (handler) {
      handler(event);
    } else {
      return this.props.onKeyDown(event);
    }
    // Don't propagate the keystroke back to the DOM/browser
    event.preventDefault();
  };

  _onFocus = event => {
    this.setState({isFocused: true});
    if (this.props.onFocus) {
      return this.props.onFocus(event);
    }
  };

  _onBlur = event => {
    this.setState({isFocused: false});
    if (this.props.onBlur) {
      return this.props.onBlur(event);
    }
  };

  _renderHiddenInput() {
    if (!this.props.name) {
      return null;
    }

    return (
      <input
        type="hidden"
        name={this.props.name}
        value={this.state.selection}
      />
    );
  }

  _generateSearchFunction() {
    const searchOptionsProp = this.props.searchOptions;
    const filterOptionProp = this.props.filterOption;
    if (typeof searchOptionsProp === 'function') {
      if (filterOptionProp !== null) {
        Console.warn(
          'searchOptions prop is being used, filterOption prop will be ignored'
        );
      }
      return searchOptionsProp;
    } else if (typeof filterOptionProp === 'function') {
      // use custom filter option
      return (value, options) =>
        options.filter(o => filterOptionProp(value, o));
    }

    const mapper =
      typeof filterOptionProp === 'string'
        ? Accessor.generateAccessor(filterOptionProp)
        : Accessor.IDENTITY_FN;

    return (value, options) =>
      fuzzy
        .filter(value, options, {extract: mapper})
        .map(res => options[res.index]);
  }

  _hasHint() {
    return this.state.searchResults.length > 0 || this._hasCustomValue();
  }

  _hasFixedOptions() {
    return (
      Array.isArray(this.props.fixedOptions) && this.props.fixedOptions.length
    );
  }

  render() {
    const inputClasses = {};
    inputClasses[this.props.customClasses.input] = Boolean(
      this.props.customClasses.input
    );
    const inputClassList = classNames(inputClasses);

    const classes = {
      [DEFAULT_CLASS]: this.props.defaultClassNames
    };
    classes[this.props.className] = Boolean(this.props.className);
    const classList = classNames(classes);

    return (
      <TypeaheadWrapper
        className={classList}
        innerRef={comp => {
          this.root = comp;
        }}
        tabIndex="0"
        onKeyDown={this._onKeyDown}
        onKeyPress={this.props.onKeyPress}
        onKeyUp={this.props.onKeyUp}
        onFocus={this._onFocus}
      >
        {this._renderHiddenInput()}
        {this.props.searchable ? (
        <InputBox>
          <TypeaheadInput
            innerRef={comp => {
              this.entry = comp;
            }}
            type="text"
            disabled={this.props.disabled}
            {...this.props.inputProps}
            placeholder={this.props.placeholder}
            className={inputClassList}
            value={this.state.entryValue}
            onChange={this._onChange}
            onBlur={this._onBlur}
          />
          <InputIcon>
            <Search height="18px"/>
          </InputIcon>
        </InputBox>
        ) : null}
        {this._renderIncrementalSearchResults()}
      </TypeaheadWrapper>
    );
  }
};
