// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component, createRef, ElementType, KeyboardEventHandler} from 'react';
import {polyfill} from 'react-lifecycles-compat';
import fuzzy from 'fuzzy';
import classNames from 'classnames';
import styled from 'styled-components';
import {console as Console} from 'global/window';

import Accessor from './accessor';
import DropdownList, {ListItem} from './dropdown-list';
import {Search} from '../icons';
import {KeyEvent} from '@kepler.gl/constants';

const DEFAULT_CLASS = 'typeahead';
/**
 * Copied mostly from 'react-typeahead', an auto-completing text input
 *
 * Renders an text input that shows options nearby that you can use the
 * keyboard or mouse to select.
 */

interface TypeaheadWrapperProps {
  light?: boolean;
}

const TypeaheadWrapper = styled.div<TypeaheadWrapperProps>`
  display: flex;
  flex-direction: column;
  background-color: ${props =>
    props.light ? props.theme.dropdownListBgdLT : props.theme.dropdownListBgd};
  box-shadow: ${props => props.theme.dropdownListShadow};

  :focus {
    outline: 0;
  }
`;

const InputBox = styled.div.attrs({
  className: 'typeahead__input_box'
})`
  padding: 8px;
`;

const TypeaheadInput = styled.input<TypeaheadWrapperProps>`
  ${props => (props.light ? props.theme.inputLT : props.theme.secondaryInput)} :hover {
    cursor: pointer;
    background-color: ${props =>
      props.light ? props.theme.selectBackgroundLT : props.theme.secondaryInputBgd};
  }
`;

const InputIcon = styled.div.attrs({
  className: 'typeahead__input_icon'
})`
  position: absolute;
  right: 15px;
  top: 14px;
  color: ${props => props.theme.inputPlaceholderColor};
`;

function generateSearchFunction(props: TypeaheadProps) {
  const {searchOptions, filterOption} = props;
  if (typeof searchOptions === 'function') {
    if (filterOption !== null) {
      Console.warn('searchOptions prop is being used, filterOption prop will be ignored');
    }
    return searchOptions;
  } else if (typeof filterOption === 'function') {
    // use custom filter option
    return (value, options) => options.filter(o => filterOption(value, o));
  }

  const mapper =
    typeof filterOption === 'string'
      ? Accessor.generateAccessor(filterOption)
      : Accessor.IDENTITY_FN;

  return (value, options) => {
    return fuzzy.filter(value, options, {extract: mapper}).map(res => options[res.index]);
  };
}

function searchOptionsOnInput(inputValue, props) {
  const searchOptions = generateSearchFunction(props);
  return searchOptions(inputValue, props.options);
}

function getOptionsForValue(value, props, state) {
  const {options, showOptionsWhenEmpty} = props;

  if (!props.searchable) {
    // directly pass through options if can not be searched
    return options;
  }
  if (shouldSkipSearch(value, state, showOptionsWhenEmpty)) {
    return options;
  }

  const searchOptions = generateSearchFunction(props);
  return searchOptions(value, options);
}

function shouldSkipSearch(input, state, showOptionsWhenEmpty) {
  const emptyValue = !input || input.trim().length === 0;

  // this.state must be checked because it may not be defined yet if this function
  // is called from within getInitialState
  const isFocused = state && state.isFocused;
  return !(showOptionsWhenEmpty && isFocused) && emptyValue;
}

type Option = string | number | boolean | object | undefined;
interface TypeaheadProps {
  name?: string;
  customClasses?: any;
  resultsTruncatedMessage?: string;
  options?: ReadonlyArray<Option>;
  fixedOptions?: ReadonlyArray<Option> | null;
  allowCustomValues?: number;
  initialValue?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  textarea?: boolean;
  inputProps?: object;
  onOptionSelected?: (option: any, event: any) => any;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  onKeyPress?: KeyboardEventHandler<HTMLDivElement>;
  onKeyUp?: KeyboardEventHandler<HTMLDivElement>;
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  filterOption?: string | ((o: Option, s: string) => boolean);
  searchOptions?: (o: Option, s: string) => boolean;
  displayOption?: string | ((o: Option) => string);
  inputDisplayOption?: string | ((o: Option) => string);
  formInputOption?: string | ((o: Option) => string);
  defaultClassNames?: boolean;
  customListComponent?: ElementType;
  customListItemComponent?: ElementType;
  customListHeaderComponent?: ElementType | null;
  showOptionsWhenEmpty?: boolean;
  searchable?: boolean;
  light?: boolean;
  inputIcon: ElementType;
  className?: string;
  selectedItems?: any[] | null;
  autoFocus: boolean;
  // deprecated
  maxVisible?: number;
}

interface TypeaheadState {
  searchResults: ReadonlyArray<string | number | boolean | object | undefined>;

  // This should be called something else, 'entryValue'
  entryValue?: string;

  // A valid typeahead value
  selection?: string;

  // Index of the selection
  selectionIndex: null;

  // Keep track of the focus state of the input element, to determine
  // whether to show options when empty (if showOptionsWhenEmpty is true)
  isFocused: boolean;
}

function noop() {
  return;
}
class Typeahead extends Component<TypeaheadProps, TypeaheadState> {
  static defaultProps = {
    options: [],
    customClasses: {
      results: 'list-selector',
      input: 'typeahead__input',
      listItem: 'list__item',
      listAnchor: 'list__item__anchor'
    },
    allowCustomValues: 0,
    initialValue: '',
    value: '',
    placeholder: '',
    disabled: false,
    textarea: false,
    inputProps: {},
    onOptionSelected: noop,
    onChange: noop,
    onKeyDown: noop,
    onKeyPress: noop,
    onKeyUp: noop,
    onFocus: noop,
    onBlur: noop,
    filterOption: null,
    searchOptions: null,
    inputDisplayOption: null,
    defaultClassNames: true,
    customListComponent: DropdownList,
    customListItemComponent: ListItem,
    inputIcon: Search,
    customListHeaderComponent: null,
    showOptionsWhenEmpty: true,
    searchable: true,
    resultsTruncatedMessage: null,
    autoFocus: true
  };

  static getDerivedStateFromProps(props, state) {
    if (props.options === state.prevOptions) {
      return {};
    }

    //  invoked after a component is instantiated as well as before it is re-rendered
    const searchResults = getOptionsForValue(state.entryValue, props, state);

    return {
      searchResults,
      prevOptions: props.options
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      // initiate searchResults with options
      searchResults: this.props.options || [],

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
    // call focus on entry or div to trigger key events listener
    if (this.props.autoFocus) {
      if (this.entry.current) {
        this.entry.current.focus();
      } else {
        this.root.current?.focus();
      }
    }
  }

  root = createRef<HTMLDivElement>();
  entry = createRef<HTMLInputElement>();

  focus = () => {
    if (this.entry.current) {
      this.entry.current.focus();
    }
  };

  _hasCustomValue = () => {
    return (
      Number(this.props.allowCustomValues) > 0 &&
      Number(this.state.entryValue?.length) >= Number(this.props.allowCustomValues) &&
      this.state.searchResults.indexOf(this.state.entryValue) < 0
    );
  };

  _getCustomValue = () => {
    return this._hasCustomValue() ? this.state.entryValue : null;
  };

  _renderIncrementalSearchResults() {
    const {customListComponent: CustomListComponent = DropdownList} = this.props;
    return (
      <CustomListComponent
        fixedOptions={this.props.fixedOptions}
        options={this.state.searchResults}
        areResultsTruncated={false}
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
        light={this.props.light}
      />
    );
  }

  getSelection() {
    let index: number | null = this.state.selectionIndex;
    if (index === null) {
      return null;
    }
    index = Number(index);

    if (this._hasCustomValue()) {
      if (index === 0) {
        return this.state.entryValue;
      }
      index--;
    }
    if (this._hasFixedOptions()) {
      return index < Number(this.props.fixedOptions?.length)
        ? this.props.fixedOptions?.[index]
        : this.state.searchResults[index - Number(this.props.fixedOptions?.length)];
    }
    return this.state.searchResults[index];
  }

  _onOptionSelected = (option, event) => {
    if (this.props.searchable) {
      // reset entry input
      this.setState({
        // reset search options when selection has been made
        searchResults: this.props.options || [],
        selection: '',
        entryValue: ''
      });
    }

    this.props.onOptionSelected?.(option, event);
  };

  // use () => {} to avoid binding 'this'
  _onTextEntryUpdated = () => {
    if (this.props.searchable) {
      const value = this.entry.current?.value;

      this.setState({
        searchResults: searchOptionsOnInput(value, this.props),
        selection: '',
        entryValue: value
      });
    }
  };

  _onEnter = event => {
    const selection = this.getSelection();
    if (!selection) {
      this.props.onKeyDown?.(event);
    }
    this._onOptionSelected(selection, event);
  };

  _onEscape = () => {
    this.setState({
      selectionIndex: null
    });
  };

  _onTab = event => {
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
  };

  eventMap = () => {
    const events = {};

    events[KeyEvent.DOM_VK_UP] = this.navUp;
    events[KeyEvent.DOM_VK_DOWN] = this.navDown;
    events[KeyEvent.DOM_VK_RETURN] = events[KeyEvent.DOM_VK_ENTER] = this._onEnter;
    events[KeyEvent.DOM_VK_ESCAPE] = this._onEscape;
    events[KeyEvent.DOM_VK_TAB] = this._onTab;

    return events;
  };

  _nav = delta => {
    if (!this._hasHint()) {
      return;
    }
    let newIndex =
      this.state.selectionIndex === null
        ? delta === 1
          ? 0
          : delta
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
  };

  navDown = () => {
    this._nav(1);
  };

  navUp = () => {
    this._nav(-1);
  };

  _onChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    if (this.props.onChange) {
      this.props.onChange(event);
    }

    this._onTextEntryUpdated();
  };

  _onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = event => {
    // If there are no visible elements, don't perform selector navigation.
    // Just pass this up to the upstream onKeydown handler.
    // Also skip if the user is pressing the shift key, since none of our handlers are looking for shift
    if (!this._hasHint() || event.shiftKey) {
      return this.props.onKeyDown?.(event);
    }

    const handler = this.eventMap()[event.keyCode];

    if (handler) {
      handler(event);
    } else {
      return this.props.onKeyDown?.(event);
    }
    // Don't propagate the keystroke back to the DOM/browser
    event.preventDefault();
  };

  _onFocus: React.FocusEventHandler<HTMLDivElement> = event => {
    this.setState({isFocused: true});
    if (this.props.onFocus) {
      return this.props.onFocus(event);
    }
  };

  _onBlur: React.FocusEventHandler<HTMLInputElement> = event => {
    this.setState({isFocused: false});
    if (this.props.onBlur) {
      return this.props.onBlur(event);
    }
  };

  _renderHiddenInput() {
    if (!this.props.name) {
      return null;
    }

    return <input type="hidden" name={this.props.name} value={this.state.selection} />;
  }

  _hasHint() {
    return this.state.searchResults.length > 0 || this._hasCustomValue();
  }

  _hasFixedOptions() {
    return Array.isArray(this.props.fixedOptions) && this.props.fixedOptions.length;
  }

  render() {
    const inputClasses = {};
    inputClasses[this.props.customClasses?.input] = Boolean(this.props.customClasses?.input);
    const inputClassList = classNames(inputClasses);

    const classes = {
      [DEFAULT_CLASS]: this.props.defaultClassNames
    };
    classes[this.props.className ? this.props.className : ''] = Boolean(this.props.className);
    const classList = classNames(classes);

    return (
      <TypeaheadWrapper
        className={classList}
        ref={this.root}
        tabIndex={0}
        onKeyDown={this._onKeyDown}
        onKeyPress={this.props.onKeyPress}
        onKeyUp={this.props.onKeyUp}
        onFocus={this._onFocus}
        light={this.props.light}
      >
        {this._renderHiddenInput()}
        {this.props.searchable ? (
          <InputBox>
            <TypeaheadInput
              ref={this.entry}
              type="text"
              disabled={this.props.disabled}
              {...this.props.inputProps}
              placeholder={this.props.placeholder}
              className={inputClassList}
              value={this.state.entryValue}
              onChange={this._onChange}
              onBlur={this._onBlur}
              light={this.props.light}
            />
            <InputIcon>
              <this.props.inputIcon height="18px" />
            </InputIcon>
          </InputBox>
        ) : null}
        {this._renderIncrementalSearchResults()}
      </TypeaheadWrapper>
    );
  }
}

polyfill(Typeahead);

export default Typeahead;
