'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  flex-direction: column;\n  \n  :focus {\n    outline: 0;\n  }\n'], ['\n  display: flex;\n  flex-direction: column;\n  \n  :focus {\n    outline: 0;\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  ', ' \n  flex-grow: 1;\n  background-color: ', ';\n  margin: 8px;\n  width: auto;\n'], ['\n  ', ' \n  flex-grow: 1;\n  background-color: ', ';\n  margin: 8px;\n  width: auto;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _fuzzy = require('fuzzy');

var _fuzzy2 = _interopRequireDefault(_fuzzy);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _window = require('global/window');

var _accessor = require('./accessor');

var _accessor2 = _interopRequireDefault(_accessor);

var _keyevent = require('./keyevent');

var _keyevent2 = _interopRequireDefault(_keyevent);

var _dropdownList = require('./dropdown-list');

var _dropdownList2 = _interopRequireDefault(_dropdownList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_CLASS = 'typeahead';
/**
 * Copied mostly from 'react-typeahead', an auto-completing text input
 *
 * Renders an text input that shows options nearby that you can use the
 * keyboard or mouse to select.
 */
var propTypes = {
  name: _propTypes2.default.string,
  customClasses: _propTypes2.default.object,
  maxVisible: _propTypes2.default.number,
  resultsTruncatedMessage: _propTypes2.default.string,
  options: _propTypes2.default.array,
  fixedOptions: _propTypes2.default.array,
  allowCustomValues: _propTypes2.default.number,
  initialValue: _propTypes2.default.string,
  value: _propTypes2.default.string,
  placeholder: _propTypes2.default.string,
  disabled: _propTypes2.default.bool,
  textarea: _propTypes2.default.bool,
  inputProps: _propTypes2.default.object,
  onOptionSelected: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  onKeyDown: _propTypes2.default.func,
  onKeyPress: _propTypes2.default.func,
  onKeyUp: _propTypes2.default.func,
  onFocus: _propTypes2.default.func,
  onBlur: _propTypes2.default.func,
  filterOption: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
  searchOptions: _propTypes2.default.func,
  displayOption: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
  inputDisplayOption: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
  formInputOption: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
  defaultClassNames: _propTypes2.default.bool,
  customListComponent: _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.func]),
  customListItemComponent: _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.func]),
  customListHeaderComponent: _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.func]),
  showOptionsWhenEmpty: _propTypes2.default.bool,
  searchable: _propTypes2.default.bool
};

var defaultProps = {
  options: [],
  customClasses: {},
  allowCustomValues: 0,
  initialValue: '',
  value: '',
  placeholder: '',
  disabled: false,
  textarea: false,
  inputProps: {},
  onOptionSelected: function onOptionSelected(option) {},
  onChange: function onChange(event) {},
  onKeyDown: function onKeyDown(event) {},
  onKeyPress: function onKeyPress(event) {},
  onKeyUp: function onKeyUp(event) {},
  onFocus: function onFocus(event) {},
  onBlur: function onBlur(event) {},

  filterOption: null,
  searchOptions: null,
  inputDisplayOption: null,
  defaultClassNames: true,
  customListComponent: _dropdownList2.default,
  customListItemComponent: _dropdownList.ListItem,
  customListHeaderComponent: null,
  showOptionsWhenEmpty: true,
  searchable: true,
  resultsTruncatedMessage: null
};

var TypeaheadWrapper = _styledComponents2.default.div(_templateObject);

var TypeaheadInput = _styledComponents2.default.input(_templateObject2, function (props) {
  return props.theme.input;
}, function (props) {
  return props.theme.selectBackgroundHover;
});

var Typeahead = function (_Component) {
  (0, _inherits3.default)(Typeahead, _Component);

  function Typeahead(props) {
    (0, _classCallCheck3.default)(this, Typeahead);

    var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props));

    _this._onOptionSelected = function (option, event) {
      if (_this.props.searchable) {
        // reset entry input
        _this.setState({
          searchResults: _this.getOptionsForValue('', _this.props.options),
          selection: '',
          entryValue: ''
        });
      }

      return _this.props.onOptionSelected(option, event);
    };

    _this._onTextEntryUpdated = function () {
      if (_this.props.searchable) {
        var value = _this.entry.value;

        _this.setState({
          searchResults: _this.getOptionsForValue(value, _this.props.options),
          selection: '',
          entryValue: value
        });
      }
    };

    _this._onEnter = function (event) {
      var selection = _this.getSelection();
      if (!selection) {
        return _this.props.onKeyDown(event);
      }
      return _this._onOptionSelected(selection, event);
    };

    _this.navDown = function () {
      _this._nav(1);
    };

    _this.navUp = function () {
      _this._nav(-1);
    };

    _this._onChange = function (event) {
      if (_this.props.onChange) {
        _this.props.onChange(event);
      }

      _this._onTextEntryUpdated();
    };

    _this._onKeyDown = function (event) {
      // If there are no visible elements, don't perform selector navigation.
      // Just pass this up to the upstream onKeydown handler.
      // Also skip if the user is pressing the shift key, since none of our handlers are looking for shift
      if (!_this._hasHint() || event.shiftKey) {
        return _this.props.onKeyDown(event);
      }

      var handler = _this.eventMap()[event.keyCode];

      if (handler) {
        handler(event);
      } else {
        return _this.props.onKeyDown(event);
      }
      // Don't propagate the keystroke back to the DOM/browser
      event.preventDefault();
    };

    _this._onFocus = function (event) {
      _this.setState({ isFocused: true });
      if (_this.props.onFocus) {
        return _this.props.onFocus(event);
      }
    };

    _this._onBlur = function (event) {
      _this.setState({ isFocused: false });
      if (_this.props.onBlur) {
        return _this.props.onBlur(event);
      }
    };

    _this.state = {
      searchResults: _this.getOptionsForValue(_this.props.initialValue, _this.props.options),

      // This should be called something else, 'entryValue'
      entryValue: _this.props.value || _this.props.initialValue,

      // A valid typeahead value
      selection: _this.props.value,

      // Index of the selection
      selectionIndex: null,

      // Keep track of the focus state of the input element, to determine
      // whether to show options when empty (if showOptionsWhenEmpty is true)
      isFocused: false
    };
    return _this;
  }

  Typeahead.prototype.componentDidMount = function componentDidMount() {
    this.setState({
      searchResults: this.getOptionsForValue('', this.props.options)
    });

    // call focus on entry or div to trigger key events listener
    if (this.entry) {
      this.entry.focus();
    } else {
      this.root.focus();
    }
  };

  Typeahead.prototype._shouldSkipSearch = function _shouldSkipSearch(input) {
    var emptyValue = !input || input.trim().length === 0;

    // this.state must be checked because it may not be defined yet if this function
    // is called from within getInitialState
    var isFocused = this.state && this.state.isFocused;
    return !(this.props.showOptionsWhenEmpty && isFocused) && emptyValue;
  };

  Typeahead.prototype.getOptionsForValue = function getOptionsForValue(value, options) {
    if (!this.props.searchable) {
      // directly pass through options if can not be searched
      return options;
    }
    if (this._shouldSkipSearch(value)) {
      return options;
    }

    var searchOptions = this._generateSearchFunction();
    return searchOptions(value, options);
  };

  Typeahead.prototype.focus = function focus() {
    if (this.entry) {
      this.entry.focus();
    }
  };

  Typeahead.prototype._hasCustomValue = function _hasCustomValue() {
    return this.props.allowCustomValues > 0 && this.state.entryValue.length >= this.props.allowCustomValues && this.state.searchResults.indexOf(this.state.entryValue) < 0;
  };

  Typeahead.prototype._getCustomValue = function _getCustomValue() {
    return this._hasCustomValue() ? this.state.entryValue : null;
  };

  Typeahead.prototype._renderIncrementalSearchResults = function _renderIncrementalSearchResults() {

    return _react2.default.createElement(this.props.customListComponent, {
      ref: 'sel',
      fixedOptions: this.props.fixedOptions,
      options: this.props.maxVisible ? this.state.searchResults.slice(0, this.props.maxVisible) : this.state.searchResults,
      areResultsTruncated: this.props.maxVisible && this.state.searchResults.length > this.props.maxVisible,
      resultsTruncatedMessage: this.props.resultsTruncatedMessage,
      onOptionSelected: this._onOptionSelected,
      allowCustomValues: this.props.allowCustomValues,
      customValue: this._getCustomValue(),
      customClasses: this.props.customClasses,
      customListItemComponent: this.props.customListItemComponent,
      customListHeaderComponent: this.props.customListHeaderComponent,
      selectionIndex: this.state.selectionIndex,
      defaultClassNames: this.props.defaultClassNames,
      displayOption: this.props.displayOption
    });
  };

  Typeahead.prototype.getSelection = function getSelection() {
    var index = this.state.selectionIndex;

    if (this._hasCustomValue()) {
      if (index === 0) {
        return this.state.entryValue;
      }
      index--;
    }
    if (this._hasFixedOptions()) {
      return index < this.props.fixedOptions.length ? this.props.fixedOptions[index] : this.state.searchResults[index - this.props.fixedOptions.length];
    }
    return this.state.searchResults[index];
  };

  // use () => {} to avoid binding 'this'


  Typeahead.prototype._onEscape = function _onEscape() {
    this.setState({
      selectionIndex: null
    });
  };

  Typeahead.prototype._onTab = function _onTab(event) {
    var selection = this.getSelection();
    var option = selection ? selection : this.state.searchResults.length > 0 ? this.state.searchResults[0] : null;

    if (option === null && this._hasCustomValue()) {
      option = this._getCustomValue();
    }

    if (option !== null) {
      return this._onOptionSelected(option, event);
    }
  };

  Typeahead.prototype.eventMap = function eventMap(event) {
    var events = {};

    events[_keyevent2.default.DOM_VK_UP] = this.navUp;
    events[_keyevent2.default.DOM_VK_DOWN] = this.navDown;
    events[_keyevent2.default.DOM_VK_RETURN] = events[_keyevent2.default.DOM_VK_ENTER] = this._onEnter;
    events[_keyevent2.default.DOM_VK_ESCAPE] = this._onEscape;
    events[_keyevent2.default.DOM_VK_TAB] = this._onTab;

    return events;
  };

  Typeahead.prototype._nav = function _nav(delta) {
    if (!this._hasHint()) {
      return;
    }
    var newIndex = this.state.selectionIndex === null ? delta === 1 ? 0 : delta : this.state.selectionIndex + delta;
    var length = this.props.maxVisible ? this.state.searchResults.slice(0, this.props.maxVisible).length : this.state.searchResults.length;
    if (this._hasCustomValue()) {
      length += 1;
    }

    if (newIndex < 0) {
      newIndex += length;
    } else if (newIndex >= length) {
      newIndex -= length;
    }

    this.setState({ selectionIndex: newIndex });
  };

  Typeahead.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var searchResults = this.getOptionsForValue(this.state.entryValue, nextProps.options);

    this.setState({ searchResults: searchResults });
  };

  Typeahead.prototype.render = function render() {
    var _classes,
        _this2 = this;

    var inputClasses = {};
    inputClasses[this.props.customClasses.input] = Boolean(this.props.customClasses.input);
    var inputClassList = (0, _classnames2.default)(inputClasses);

    var classes = (_classes = {}, _classes[DEFAULT_CLASS] = this.props.defaultClassNames, _classes);
    classes[this.props.className] = Boolean(this.props.className);
    var classList = (0, _classnames2.default)(classes);

    return _react2.default.createElement(
      TypeaheadWrapper,
      {
        className: classList,
        innerRef: function innerRef(comp) {
          _this2.root = comp;
        },
        tabIndex: '0',
        onKeyDown: this._onKeyDown,
        onKeyPress: this.props.onKeyPress,
        onKeyUp: this.props.onKeyUp,
        onFocus: this._onFocus
      },
      this._renderHiddenInput(),
      this.props.searchable ? _react2.default.createElement(TypeaheadInput, (0, _extends3.default)({
        innerRef: function innerRef(comp) {
          _this2.entry = comp;
        },
        type: 'text',
        disabled: this.props.disabled
      }, this.props.inputProps, {
        placeholder: this.props.placeholder,
        className: inputClassList,
        value: this.state.entryValue,
        onChange: this._onChange,
        onBlur: this._onBlur
      })) : null,
      this._renderIncrementalSearchResults()
    );
  };

  Typeahead.prototype._renderHiddenInput = function _renderHiddenInput() {
    if (!this.props.name) {
      return null;
    }

    return _react2.default.createElement('input', {
      type: 'hidden',
      name: this.props.name,
      value: this.state.selection
    });
  };

  Typeahead.prototype._generateSearchFunction = function _generateSearchFunction() {
    var searchOptionsProp = this.props.searchOptions;
    var filterOptionProp = this.props.filterOption;
    if (typeof searchOptionsProp === 'function') {
      if (filterOptionProp !== null) {
        _window.console.warn('searchOptions prop is being used, filterOption prop will be ignored');
      }
      return searchOptionsProp;
    } else if (typeof filterOptionProp === 'function') {

      // use custom filter option
      return function (value, options) {
        return options.filter(function (o) {
          return filterOptionProp(value, o);
        });
      };
    }

    var mapper = typeof filterOptionProp === 'string' ? _accessor2.default.generateAccessor(filterOptionProp) : _accessor2.default.IDENTITY_FN;

    return function (value, options) {
      return _fuzzy2.default.filter(value, options, { extract: mapper }).map(function (res) {
        return options[res.index];
      });
    };
  };

  Typeahead.prototype._hasHint = function _hasHint() {
    return this.state.searchResults.length > 0 || this._hasCustomValue();
  };

  Typeahead.prototype._hasFixedOptions = function _hasFixedOptions() {
    return Array.isArray(this.props.fixedOptions) && this.props.fixedOptions.length;
  };

  return Typeahead;
}(_react.Component);

Typeahead.propTypes = propTypes;
Typeahead.defaultProps = defaultProps;

exports.default = Typeahead;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL3R5cGVhaGVhZC5qcyJdLCJuYW1lcyI6WyJERUZBVUxUX0NMQVNTIiwicHJvcFR5cGVzIiwibmFtZSIsInN0cmluZyIsImN1c3RvbUNsYXNzZXMiLCJvYmplY3QiLCJtYXhWaXNpYmxlIiwibnVtYmVyIiwicmVzdWx0c1RydW5jYXRlZE1lc3NhZ2UiLCJvcHRpb25zIiwiYXJyYXkiLCJmaXhlZE9wdGlvbnMiLCJhbGxvd0N1c3RvbVZhbHVlcyIsImluaXRpYWxWYWx1ZSIsInZhbHVlIiwicGxhY2Vob2xkZXIiLCJkaXNhYmxlZCIsImJvb2wiLCJ0ZXh0YXJlYSIsImlucHV0UHJvcHMiLCJvbk9wdGlvblNlbGVjdGVkIiwiZnVuYyIsIm9uQ2hhbmdlIiwib25LZXlEb3duIiwib25LZXlQcmVzcyIsIm9uS2V5VXAiLCJvbkZvY3VzIiwib25CbHVyIiwiZmlsdGVyT3B0aW9uIiwib25lT2ZUeXBlIiwic2VhcmNoT3B0aW9ucyIsImRpc3BsYXlPcHRpb24iLCJpbnB1dERpc3BsYXlPcHRpb24iLCJmb3JtSW5wdXRPcHRpb24iLCJkZWZhdWx0Q2xhc3NOYW1lcyIsImN1c3RvbUxpc3RDb21wb25lbnQiLCJlbGVtZW50IiwiY3VzdG9tTGlzdEl0ZW1Db21wb25lbnQiLCJjdXN0b21MaXN0SGVhZGVyQ29tcG9uZW50Iiwic2hvd09wdGlvbnNXaGVuRW1wdHkiLCJzZWFyY2hhYmxlIiwiZGVmYXVsdFByb3BzIiwib3B0aW9uIiwiZXZlbnQiLCJUeXBlYWhlYWRXcmFwcGVyIiwiZGl2IiwiVHlwZWFoZWFkSW5wdXQiLCJpbnB1dCIsInByb3BzIiwidGhlbWUiLCJzZWxlY3RCYWNrZ3JvdW5kSG92ZXIiLCJUeXBlYWhlYWQiLCJfb25PcHRpb25TZWxlY3RlZCIsInNldFN0YXRlIiwic2VhcmNoUmVzdWx0cyIsImdldE9wdGlvbnNGb3JWYWx1ZSIsInNlbGVjdGlvbiIsImVudHJ5VmFsdWUiLCJfb25UZXh0RW50cnlVcGRhdGVkIiwiZW50cnkiLCJfb25FbnRlciIsImdldFNlbGVjdGlvbiIsIm5hdkRvd24iLCJfbmF2IiwibmF2VXAiLCJfb25DaGFuZ2UiLCJfb25LZXlEb3duIiwiX2hhc0hpbnQiLCJzaGlmdEtleSIsImhhbmRsZXIiLCJldmVudE1hcCIsImtleUNvZGUiLCJwcmV2ZW50RGVmYXVsdCIsIl9vbkZvY3VzIiwiaXNGb2N1c2VkIiwiX29uQmx1ciIsInN0YXRlIiwic2VsZWN0aW9uSW5kZXgiLCJjb21wb25lbnREaWRNb3VudCIsImZvY3VzIiwicm9vdCIsIl9zaG91bGRTa2lwU2VhcmNoIiwiZW1wdHlWYWx1ZSIsInRyaW0iLCJsZW5ndGgiLCJfZ2VuZXJhdGVTZWFyY2hGdW5jdGlvbiIsIl9oYXNDdXN0b21WYWx1ZSIsImluZGV4T2YiLCJfZ2V0Q3VzdG9tVmFsdWUiLCJfcmVuZGVySW5jcmVtZW50YWxTZWFyY2hSZXN1bHRzIiwic2xpY2UiLCJpbmRleCIsIl9oYXNGaXhlZE9wdGlvbnMiLCJfb25Fc2NhcGUiLCJfb25UYWIiLCJldmVudHMiLCJET01fVktfVVAiLCJET01fVktfRE9XTiIsIkRPTV9WS19SRVRVUk4iLCJET01fVktfRU5URVIiLCJET01fVktfRVNDQVBFIiwiRE9NX1ZLX1RBQiIsImRlbHRhIiwibmV3SW5kZXgiLCJjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzIiwibmV4dFByb3BzIiwicmVuZGVyIiwiaW5wdXRDbGFzc2VzIiwiQm9vbGVhbiIsImlucHV0Q2xhc3NMaXN0IiwiY2xhc3NlcyIsImNsYXNzTmFtZSIsImNsYXNzTGlzdCIsImNvbXAiLCJfcmVuZGVySGlkZGVuSW5wdXQiLCJzZWFyY2hPcHRpb25zUHJvcCIsImZpbHRlck9wdGlvblByb3AiLCJ3YXJuIiwiZmlsdGVyIiwibyIsIm1hcHBlciIsImdlbmVyYXRlQWNjZXNzb3IiLCJJREVOVElUWV9GTiIsImV4dHJhY3QiLCJtYXAiLCJyZXMiLCJBcnJheSIsImlzQXJyYXkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsZ0JBQWdCLFdBQXRCO0FBQ0E7Ozs7OztBQU1BLElBQU1DLFlBQVk7QUFDaEJDLFFBQU0sb0JBQVVDLE1BREE7QUFFaEJDLGlCQUFlLG9CQUFVQyxNQUZUO0FBR2hCQyxjQUFZLG9CQUFVQyxNQUhOO0FBSWhCQywyQkFBeUIsb0JBQVVMLE1BSm5CO0FBS2hCTSxXQUFTLG9CQUFVQyxLQUxIO0FBTWhCQyxnQkFBYyxvQkFBVUQsS0FOUjtBQU9oQkUscUJBQW1CLG9CQUFVTCxNQVBiO0FBUWhCTSxnQkFBYyxvQkFBVVYsTUFSUjtBQVNoQlcsU0FBTyxvQkFBVVgsTUFURDtBQVVoQlksZUFBYSxvQkFBVVosTUFWUDtBQVdoQmEsWUFBVSxvQkFBVUMsSUFYSjtBQVloQkMsWUFBVSxvQkFBVUQsSUFaSjtBQWFoQkUsY0FBWSxvQkFBVWQsTUFiTjtBQWNoQmUsb0JBQWtCLG9CQUFVQyxJQWRaO0FBZWhCQyxZQUFVLG9CQUFVRCxJQWZKO0FBZ0JoQkUsYUFBVyxvQkFBVUYsSUFoQkw7QUFpQmhCRyxjQUFZLG9CQUFVSCxJQWpCTjtBQWtCaEJJLFdBQVMsb0JBQVVKLElBbEJIO0FBbUJoQkssV0FBUyxvQkFBVUwsSUFuQkg7QUFvQmhCTSxVQUFRLG9CQUFVTixJQXBCRjtBQXFCaEJPLGdCQUFjLG9CQUFVQyxTQUFWLENBQW9CLENBQUMsb0JBQVUxQixNQUFYLEVBQW1CLG9CQUFVa0IsSUFBN0IsQ0FBcEIsQ0FyQkU7QUFzQmhCUyxpQkFBZSxvQkFBVVQsSUF0QlQ7QUF1QmhCVSxpQkFBZSxvQkFBVUYsU0FBVixDQUFvQixDQUFDLG9CQUFVMUIsTUFBWCxFQUFtQixvQkFBVWtCLElBQTdCLENBQXBCLENBdkJDO0FBd0JoQlcsc0JBQW9CLG9CQUFVSCxTQUFWLENBQW9CLENBQUMsb0JBQVUxQixNQUFYLEVBQW1CLG9CQUFVa0IsSUFBN0IsQ0FBcEIsQ0F4Qko7QUF5QmhCWSxtQkFBaUIsb0JBQVVKLFNBQVYsQ0FBb0IsQ0FBQyxvQkFBVTFCLE1BQVgsRUFBbUIsb0JBQVVrQixJQUE3QixDQUFwQixDQXpCRDtBQTBCaEJhLHFCQUFtQixvQkFBVWpCLElBMUJiO0FBMkJoQmtCLHVCQUFxQixvQkFBVU4sU0FBVixDQUFvQixDQUFDLG9CQUFVTyxPQUFYLEVBQW9CLG9CQUFVZixJQUE5QixDQUFwQixDQTNCTDtBQTRCaEJnQiwyQkFBeUIsb0JBQVVSLFNBQVYsQ0FBb0IsQ0FBQyxvQkFBVU8sT0FBWCxFQUFvQixvQkFBVWYsSUFBOUIsQ0FBcEIsQ0E1QlQ7QUE2QmhCaUIsNkJBQTJCLG9CQUFVVCxTQUFWLENBQW9CLENBQUMsb0JBQVVPLE9BQVgsRUFBb0Isb0JBQVVmLElBQTlCLENBQXBCLENBN0JYO0FBOEJoQmtCLHdCQUFzQixvQkFBVXRCLElBOUJoQjtBQStCaEJ1QixjQUFZLG9CQUFVdkI7QUEvQk4sQ0FBbEI7O0FBa0NBLElBQU13QixlQUFlO0FBQ25CaEMsV0FBUyxFQURVO0FBRW5CTCxpQkFBZSxFQUZJO0FBR25CUSxxQkFBbUIsQ0FIQTtBQUluQkMsZ0JBQWMsRUFKSztBQUtuQkMsU0FBTyxFQUxZO0FBTW5CQyxlQUFhLEVBTk07QUFPbkJDLFlBQVUsS0FQUztBQVFuQkUsWUFBVSxLQVJTO0FBU25CQyxjQUFZLEVBVE87QUFVbkJDLGtCQVZtQiw0QkFVRnNCLE1BVkUsRUFVTSxDQUFFLENBVlI7QUFXbkJwQixVQVhtQixvQkFXVnFCLEtBWFUsRUFXSCxDQUFFLENBWEM7QUFZbkJwQixXQVptQixxQkFZVG9CLEtBWlMsRUFZRixDQUFFLENBWkE7QUFhbkJuQixZQWJtQixzQkFhUm1CLEtBYlEsRUFhRCxDQUFFLENBYkQ7QUFjbkJsQixTQWRtQixtQkFjWGtCLEtBZFcsRUFjSixDQUFFLENBZEU7QUFlbkJqQixTQWZtQixtQkFlWGlCLEtBZlcsRUFlSixDQUFFLENBZkU7QUFnQm5CaEIsUUFoQm1CLGtCQWdCWmdCLEtBaEJZLEVBZ0JMLENBQUUsQ0FoQkc7O0FBaUJuQmYsZ0JBQWMsSUFqQks7QUFrQm5CRSxpQkFBZSxJQWxCSTtBQW1CbkJFLHNCQUFvQixJQW5CRDtBQW9CbkJFLHFCQUFtQixJQXBCQTtBQXFCbkJDLDZDQXJCbUI7QUFzQm5CRSxpREF0Qm1CO0FBdUJuQkMsNkJBQTJCLElBdkJSO0FBd0JuQkMsd0JBQXNCLElBeEJIO0FBeUJuQkMsY0FBWSxJQXpCTztBQTBCbkJoQywyQkFBeUI7QUExQk4sQ0FBckI7O0FBNkJBLElBQU1vQyxtQkFBbUIsMkJBQU9DLEdBQTFCLGlCQUFOOztBQVNBLElBQU1DLGlCQUFpQiwyQkFBT0MsS0FBeEIsbUJBQ0Y7QUFBQSxTQUFTQyxNQUFNQyxLQUFOLENBQVlGLEtBQXJCO0FBQUEsQ0FERSxFQUdnQjtBQUFBLFNBQVNDLE1BQU1DLEtBQU4sQ0FBWUMscUJBQXJCO0FBQUEsQ0FIaEIsQ0FBTjs7SUFRTUMsUzs7O0FBQ0oscUJBQVlILEtBQVosRUFBbUI7QUFBQTs7QUFBQSwrREFDakIsc0JBQU1BLEtBQU4sQ0FEaUI7O0FBQUEsVUF3SG5CSSxpQkF4SG1CLEdBd0hDLFVBQUNWLE1BQUQsRUFBU0MsS0FBVCxFQUFtQjtBQUNyQyxVQUFJLE1BQUtLLEtBQUwsQ0FBV1IsVUFBZixFQUEyQjtBQUN6QjtBQUNBLGNBQUthLFFBQUwsQ0FBYztBQUNaQyx5QkFBZSxNQUFLQyxrQkFBTCxDQUF3QixFQUF4QixFQUE0QixNQUFLUCxLQUFMLENBQVd2QyxPQUF2QyxDQURIO0FBRVorQyxxQkFBVyxFQUZDO0FBR1pDLHNCQUFZO0FBSEEsU0FBZDtBQUtEOztBQUVELGFBQU8sTUFBS1QsS0FBTCxDQUFXNUIsZ0JBQVgsQ0FBNEJzQixNQUE1QixFQUFvQ0MsS0FBcEMsQ0FBUDtBQUNELEtBbklrQjs7QUFBQSxVQXNJbkJlLG1CQXRJbUIsR0FzSUcsWUFBTTtBQUMxQixVQUFJLE1BQUtWLEtBQUwsQ0FBV1IsVUFBZixFQUEyQjtBQUN6QixZQUFNMUIsUUFBUSxNQUFLNkMsS0FBTCxDQUFXN0MsS0FBekI7O0FBRUEsY0FBS3VDLFFBQUwsQ0FBYztBQUNaQyx5QkFBZSxNQUFLQyxrQkFBTCxDQUF3QnpDLEtBQXhCLEVBQStCLE1BQUtrQyxLQUFMLENBQVd2QyxPQUExQyxDQURIO0FBRVorQyxxQkFBVyxFQUZDO0FBR1pDLHNCQUFZM0M7QUFIQSxTQUFkO0FBS0Q7QUFDRixLQWhKa0I7O0FBQUEsVUFrSm5COEMsUUFsSm1CLEdBa0pSLFVBQUNqQixLQUFELEVBQVc7QUFDcEIsVUFBTWEsWUFBWSxNQUFLSyxZQUFMLEVBQWxCO0FBQ0EsVUFBSSxDQUFDTCxTQUFMLEVBQWdCO0FBQ2QsZUFBTyxNQUFLUixLQUFMLENBQVd6QixTQUFYLENBQXFCb0IsS0FBckIsQ0FBUDtBQUNEO0FBQ0QsYUFBTyxNQUFLUyxpQkFBTCxDQUF1QkksU0FBdkIsRUFBa0NiLEtBQWxDLENBQVA7QUFDRCxLQXhKa0I7O0FBQUEsVUF1Tm5CbUIsT0F2Tm1CLEdBdU5ULFlBQU07QUFDZCxZQUFLQyxJQUFMLENBQVUsQ0FBVjtBQUNELEtBek5rQjs7QUFBQSxVQTJObkJDLEtBM05tQixHQTJOWCxZQUFNO0FBQ1osWUFBS0QsSUFBTCxDQUFVLENBQUMsQ0FBWDtBQUNELEtBN05rQjs7QUFBQSxVQStObkJFLFNBL05tQixHQStOUCxVQUFDdEIsS0FBRCxFQUFXO0FBQ3JCLFVBQUksTUFBS0ssS0FBTCxDQUFXMUIsUUFBZixFQUF5QjtBQUN2QixjQUFLMEIsS0FBTCxDQUFXMUIsUUFBWCxDQUFvQnFCLEtBQXBCO0FBQ0Q7O0FBRUQsWUFBS2UsbUJBQUw7QUFDRCxLQXJPa0I7O0FBQUEsVUF1T25CUSxVQXZPbUIsR0F1T04sVUFBQ3ZCLEtBQUQsRUFBVztBQUN0QjtBQUNBO0FBQ0E7QUFDQSxVQUFJLENBQUMsTUFBS3dCLFFBQUwsRUFBRCxJQUFvQnhCLE1BQU15QixRQUE5QixFQUF3QztBQUN0QyxlQUFPLE1BQUtwQixLQUFMLENBQVd6QixTQUFYLENBQXFCb0IsS0FBckIsQ0FBUDtBQUNEOztBQUVELFVBQU0wQixVQUFVLE1BQUtDLFFBQUwsR0FBZ0IzQixNQUFNNEIsT0FBdEIsQ0FBaEI7O0FBRUEsVUFBSUYsT0FBSixFQUFhO0FBQ1hBLGdCQUFRMUIsS0FBUjtBQUNELE9BRkQsTUFFTztBQUNMLGVBQU8sTUFBS0ssS0FBTCxDQUFXekIsU0FBWCxDQUFxQm9CLEtBQXJCLENBQVA7QUFDRDtBQUNEO0FBQ0FBLFlBQU02QixjQUFOO0FBQ0QsS0F4UGtCOztBQUFBLFVBMlNuQkMsUUEzU21CLEdBMlNSLFVBQUM5QixLQUFELEVBQVc7QUFDcEIsWUFBS1UsUUFBTCxDQUNFLEVBQUNxQixXQUFXLElBQVosRUFERjtBQUdBLFVBQUksTUFBSzFCLEtBQUwsQ0FBV3RCLE9BQWYsRUFBd0I7QUFDdEIsZUFBTyxNQUFLc0IsS0FBTCxDQUFXdEIsT0FBWCxDQUFtQmlCLEtBQW5CLENBQVA7QUFDRDtBQUNGLEtBbFRrQjs7QUFBQSxVQW9UbkJnQyxPQXBUbUIsR0FvVFQsVUFBQ2hDLEtBQUQsRUFBVztBQUNuQixZQUFLVSxRQUFMLENBQ0UsRUFBQ3FCLFdBQVcsS0FBWixFQURGO0FBR0EsVUFBSSxNQUFLMUIsS0FBTCxDQUFXckIsTUFBZixFQUF1QjtBQUNyQixlQUFPLE1BQUtxQixLQUFMLENBQVdyQixNQUFYLENBQWtCZ0IsS0FBbEIsQ0FBUDtBQUNEO0FBQ0YsS0EzVGtCOztBQUdqQixVQUFLaUMsS0FBTCxHQUFhO0FBQ1h0QixxQkFBZSxNQUFLQyxrQkFBTCxDQUNiLE1BQUtQLEtBQUwsQ0FBV25DLFlBREUsRUFFYixNQUFLbUMsS0FBTCxDQUFXdkMsT0FGRSxDQURKOztBQU1YO0FBQ0FnRCxrQkFBWSxNQUFLVCxLQUFMLENBQVdsQyxLQUFYLElBQW9CLE1BQUtrQyxLQUFMLENBQVduQyxZQVBoQzs7QUFTWDtBQUNBMkMsaUJBQVcsTUFBS1IsS0FBTCxDQUFXbEMsS0FWWDs7QUFZWDtBQUNBK0Qsc0JBQWdCLElBYkw7O0FBZVg7QUFDQTtBQUNBSCxpQkFBVztBQWpCQSxLQUFiO0FBSGlCO0FBc0JsQjs7c0JBRURJLGlCLGdDQUFvQjtBQUNsQixTQUFLekIsUUFBTCxDQUFjO0FBQ1pDLHFCQUFlLEtBQUtDLGtCQUFMLENBQXdCLEVBQXhCLEVBQTRCLEtBQUtQLEtBQUwsQ0FBV3ZDLE9BQXZDO0FBREgsS0FBZDs7QUFJQTtBQUNBLFFBQUksS0FBS2tELEtBQVQsRUFBZ0I7QUFDZCxXQUFLQSxLQUFMLENBQVdvQixLQUFYO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsV0FBS0MsSUFBTCxDQUFVRCxLQUFWO0FBQ0Q7QUFDRixHOztzQkFFREUsaUIsOEJBQWtCbEMsSyxFQUFPO0FBQ3ZCLFFBQU1tQyxhQUFhLENBQUNuQyxLQUFELElBQVVBLE1BQU1vQyxJQUFOLEdBQWFDLE1BQWIsS0FBd0IsQ0FBckQ7O0FBRUE7QUFDQTtBQUNBLFFBQU1WLFlBQVksS0FBS0UsS0FBTCxJQUFjLEtBQUtBLEtBQUwsQ0FBV0YsU0FBM0M7QUFDQSxXQUFPLEVBQUUsS0FBSzFCLEtBQUwsQ0FBV1Qsb0JBQVgsSUFBbUNtQyxTQUFyQyxLQUFtRFEsVUFBMUQ7QUFDRCxHOztzQkFFRDNCLGtCLCtCQUFtQnpDLEssRUFBT0wsTyxFQUFTO0FBQ2pDLFFBQUksQ0FBQyxLQUFLdUMsS0FBTCxDQUFXUixVQUFoQixFQUE0QjtBQUMxQjtBQUNBLGFBQU8vQixPQUFQO0FBQ0Q7QUFDRCxRQUFJLEtBQUt3RSxpQkFBTCxDQUF1Qm5FLEtBQXZCLENBQUosRUFBbUM7QUFDakMsYUFBT0wsT0FBUDtBQUNEOztBQUVELFFBQU1xQixnQkFBZ0IsS0FBS3VELHVCQUFMLEVBQXRCO0FBQ0EsV0FBT3ZELGNBQWNoQixLQUFkLEVBQXFCTCxPQUFyQixDQUFQO0FBQ0QsRzs7c0JBRURzRSxLLG9CQUFRO0FBQ04sUUFBSSxLQUFLcEIsS0FBVCxFQUFnQjtBQUNkLFdBQUtBLEtBQUwsQ0FBV29CLEtBQVg7QUFDRDtBQUNGLEc7O3NCQUVETyxlLDhCQUFrQjtBQUNoQixXQUFPLEtBQUt0QyxLQUFMLENBQVdwQyxpQkFBWCxHQUErQixDQUEvQixJQUNMLEtBQUtnRSxLQUFMLENBQVduQixVQUFYLENBQXNCMkIsTUFBdEIsSUFBZ0MsS0FBS3BDLEtBQUwsQ0FBV3BDLGlCQUR0QyxJQUVMLEtBQUtnRSxLQUFMLENBQVd0QixhQUFYLENBQXlCaUMsT0FBekIsQ0FBaUMsS0FBS1gsS0FBTCxDQUFXbkIsVUFBNUMsSUFBMEQsQ0FGNUQ7QUFHRCxHOztzQkFFRCtCLGUsOEJBQWtCO0FBQ2hCLFdBQU8sS0FBS0YsZUFBTCxLQUF5QixLQUFLVixLQUFMLENBQVduQixVQUFwQyxHQUFpRCxJQUF4RDtBQUNELEc7O3NCQUVEZ0MsK0IsOENBQWtDOztBQUVoQyxXQUNFLG1DQUFNLEtBQU4sQ0FBWSxtQkFBWjtBQUNFLFdBQUksS0FETjtBQUVFLG9CQUFjLEtBQUt6QyxLQUFMLENBQVdyQyxZQUYzQjtBQUdFLGVBQ0UsS0FBS3FDLEtBQUwsQ0FBVzFDLFVBQVgsR0FDSSxLQUFLc0UsS0FBTCxDQUFXdEIsYUFBWCxDQUF5Qm9DLEtBQXpCLENBQStCLENBQS9CLEVBQWtDLEtBQUsxQyxLQUFMLENBQVcxQyxVQUE3QyxDQURKLEdBRUksS0FBS3NFLEtBQUwsQ0FBV3RCLGFBTm5CO0FBUUUsMkJBQ0UsS0FBS04sS0FBTCxDQUFXMUMsVUFBWCxJQUNBLEtBQUtzRSxLQUFMLENBQVd0QixhQUFYLENBQXlCOEIsTUFBekIsR0FBa0MsS0FBS3BDLEtBQUwsQ0FBVzFDLFVBVmpEO0FBWUUsK0JBQXlCLEtBQUswQyxLQUFMLENBQVd4Qyx1QkFadEM7QUFhRSx3QkFBa0IsS0FBSzRDLGlCQWJ6QjtBQWNFLHlCQUFtQixLQUFLSixLQUFMLENBQVdwQyxpQkFkaEM7QUFlRSxtQkFBYSxLQUFLNEUsZUFBTCxFQWZmO0FBZ0JFLHFCQUFlLEtBQUt4QyxLQUFMLENBQVc1QyxhQWhCNUI7QUFpQkUsK0JBQXlCLEtBQUs0QyxLQUFMLENBQVdYLHVCQWpCdEM7QUFrQkUsaUNBQTJCLEtBQUtXLEtBQUwsQ0FBV1YseUJBbEJ4QztBQW1CRSxzQkFBZ0IsS0FBS3NDLEtBQUwsQ0FBV0MsY0FuQjdCO0FBb0JFLHlCQUFtQixLQUFLN0IsS0FBTCxDQUFXZCxpQkFwQmhDO0FBcUJFLHFCQUFlLEtBQUtjLEtBQUwsQ0FBV2pCO0FBckI1QixNQURGO0FBeUJELEc7O3NCQUVEOEIsWSwyQkFBZTtBQUNiLFFBQUk4QixRQUFRLEtBQUtmLEtBQUwsQ0FBV0MsY0FBdkI7O0FBRUEsUUFBSSxLQUFLUyxlQUFMLEVBQUosRUFBNEI7QUFDMUIsVUFBSUssVUFBVSxDQUFkLEVBQWlCO0FBQ2YsZUFBTyxLQUFLZixLQUFMLENBQVduQixVQUFsQjtBQUNEO0FBQ0RrQztBQUNEO0FBQ0QsUUFBSSxLQUFLQyxnQkFBTCxFQUFKLEVBQTZCO0FBQzNCLGFBQU9ELFFBQVEsS0FBSzNDLEtBQUwsQ0FBV3JDLFlBQVgsQ0FBd0J5RSxNQUFoQyxHQUF5QyxLQUFLcEMsS0FBTCxDQUFXckMsWUFBWCxDQUF3QmdGLEtBQXhCLENBQXpDLEdBQ0wsS0FBS2YsS0FBTCxDQUFXdEIsYUFBWCxDQUF5QnFDLFFBQVEsS0FBSzNDLEtBQUwsQ0FBV3JDLFlBQVgsQ0FBd0J5RSxNQUF6RCxDQURGO0FBRUQ7QUFDRCxXQUFPLEtBQUtSLEtBQUwsQ0FBV3RCLGFBQVgsQ0FBeUJxQyxLQUF6QixDQUFQO0FBQ0QsRzs7QUFlRDs7O3NCQXFCQUUsUyx3QkFBWTtBQUNWLFNBQUt4QyxRQUFMLENBQWM7QUFDWndCLHNCQUFnQjtBQURKLEtBQWQ7QUFHRCxHOztzQkFFRGlCLE0sbUJBQU9uRCxLLEVBQU87QUFDWixRQUFNYSxZQUFZLEtBQUtLLFlBQUwsRUFBbEI7QUFDQSxRQUFJbkIsU0FBU2MsWUFDVEEsU0FEUyxHQUVULEtBQUtvQixLQUFMLENBQVd0QixhQUFYLENBQXlCOEIsTUFBekIsR0FBa0MsQ0FBbEMsR0FDRSxLQUFLUixLQUFMLENBQVd0QixhQUFYLENBQXlCLENBQXpCLENBREYsR0FFRSxJQUpOOztBQU1BLFFBQUlaLFdBQVcsSUFBWCxJQUFtQixLQUFLNEMsZUFBTCxFQUF2QixFQUErQztBQUM3QzVDLGVBQVMsS0FBSzhDLGVBQUwsRUFBVDtBQUNEOztBQUVELFFBQUk5QyxXQUFXLElBQWYsRUFBcUI7QUFDbkIsYUFBTyxLQUFLVSxpQkFBTCxDQUF1QlYsTUFBdkIsRUFBK0JDLEtBQS9CLENBQVA7QUFDRDtBQUNGLEc7O3NCQUVEMkIsUSxxQkFBUzNCLEssRUFBTztBQUNkLFFBQU1vRCxTQUFTLEVBQWY7O0FBRUFBLFdBQU8sbUJBQVNDLFNBQWhCLElBQTZCLEtBQUtoQyxLQUFsQztBQUNBK0IsV0FBTyxtQkFBU0UsV0FBaEIsSUFBK0IsS0FBS25DLE9BQXBDO0FBQ0FpQyxXQUFPLG1CQUFTRyxhQUFoQixJQUFpQ0gsT0FDL0IsbUJBQVNJLFlBRHNCLElBRTdCLEtBQUt2QyxRQUZUO0FBR0FtQyxXQUFPLG1CQUFTSyxhQUFoQixJQUFpQyxLQUFLUCxTQUF0QztBQUNBRSxXQUFPLG1CQUFTTSxVQUFoQixJQUE4QixLQUFLUCxNQUFuQzs7QUFFQSxXQUFPQyxNQUFQO0FBQ0QsRzs7c0JBRURoQyxJLGlCQUFLdUMsSyxFQUFPO0FBQ1YsUUFBSSxDQUFDLEtBQUtuQyxRQUFMLEVBQUwsRUFBc0I7QUFDcEI7QUFDRDtBQUNELFFBQUlvQyxXQUNGLEtBQUszQixLQUFMLENBQVdDLGNBQVgsS0FBOEIsSUFBOUIsR0FDSXlCLFVBQVUsQ0FBVixHQUFjLENBQWQsR0FBa0JBLEtBRHRCLEdBRUksS0FBSzFCLEtBQUwsQ0FBV0MsY0FBWCxHQUE0QnlCLEtBSGxDO0FBSUEsUUFBSWxCLFNBQVMsS0FBS3BDLEtBQUwsQ0FBVzFDLFVBQVgsR0FDVCxLQUFLc0UsS0FBTCxDQUFXdEIsYUFBWCxDQUF5Qm9DLEtBQXpCLENBQStCLENBQS9CLEVBQWtDLEtBQUsxQyxLQUFMLENBQVcxQyxVQUE3QyxFQUF5RDhFLE1BRGhELEdBRVQsS0FBS1IsS0FBTCxDQUFXdEIsYUFBWCxDQUF5QjhCLE1BRjdCO0FBR0EsUUFBSSxLQUFLRSxlQUFMLEVBQUosRUFBNEI7QUFDMUJGLGdCQUFVLENBQVY7QUFDRDs7QUFFRCxRQUFJbUIsV0FBVyxDQUFmLEVBQWtCO0FBQ2hCQSxrQkFBWW5CLE1BQVo7QUFDRCxLQUZELE1BRU8sSUFBSW1CLFlBQVluQixNQUFoQixFQUF3QjtBQUM3Qm1CLGtCQUFZbkIsTUFBWjtBQUNEOztBQUVELFNBQUsvQixRQUFMLENBQWMsRUFBQ3dCLGdCQUFnQjBCLFFBQWpCLEVBQWQ7QUFDRCxHOztzQkFxQ0RDLHlCLHNDQUEwQkMsUyxFQUFXO0FBQ25DLFFBQU1uRCxnQkFBZ0IsS0FBS0Msa0JBQUwsQ0FDcEIsS0FBS3FCLEtBQUwsQ0FBV25CLFVBRFMsRUFFcEJnRCxVQUFVaEcsT0FGVSxDQUF0Qjs7QUFLQSxTQUFLNEMsUUFBTCxDQUFjLEVBQUNDLDRCQUFELEVBQWQ7QUFDRCxHOztzQkFFRG9ELE0scUJBQVM7QUFBQTtBQUFBOztBQUNQLFFBQU1DLGVBQWUsRUFBckI7QUFDQUEsaUJBQWEsS0FBSzNELEtBQUwsQ0FBVzVDLGFBQVgsQ0FBeUIyQyxLQUF0QyxJQUErQzZELFFBQVEsS0FBSzVELEtBQUwsQ0FBVzVDLGFBQVgsQ0FBeUIyQyxLQUFqQyxDQUEvQztBQUNBLFFBQU04RCxpQkFBaUIsMEJBQVdGLFlBQVgsQ0FBdkI7O0FBRUEsUUFBTUcsbUNBQ0g5RyxhQURHLElBQ2EsS0FBS2dELEtBQUwsQ0FBV2QsaUJBRHhCLFdBQU47QUFHQTRFLFlBQVEsS0FBSzlELEtBQUwsQ0FBVytELFNBQW5CLElBQWdDSCxRQUFRLEtBQUs1RCxLQUFMLENBQVcrRCxTQUFuQixDQUFoQztBQUNBLFFBQU1DLFlBQVksMEJBQVdGLE9BQVgsQ0FBbEI7O0FBRUEsV0FDRTtBQUFDLHNCQUFEO0FBQUE7QUFDRSxtQkFBV0UsU0FEYjtBQUVFLGtCQUFVLHdCQUFRO0FBQ2hCLGlCQUFLaEMsSUFBTCxHQUFZaUMsSUFBWjtBQUNELFNBSkg7QUFLRSxrQkFBUyxHQUxYO0FBTUUsbUJBQVcsS0FBSy9DLFVBTmxCO0FBT0Usb0JBQVksS0FBS2xCLEtBQUwsQ0FBV3hCLFVBUHpCO0FBUUUsaUJBQVMsS0FBS3dCLEtBQUwsQ0FBV3ZCLE9BUnRCO0FBU0UsaUJBQVMsS0FBS2dEO0FBVGhCO0FBV0csV0FBS3lDLGtCQUFMLEVBWEg7QUFZRyxXQUFLbEUsS0FBTCxDQUFXUixVQUFYLEdBQXdCLDhCQUFDLGNBQUQ7QUFDdkIsa0JBQVUsd0JBQVE7QUFBQyxpQkFBS21CLEtBQUwsR0FBYXNELElBQWI7QUFBa0IsU0FEZDtBQUV2QixjQUFLLE1BRmtCO0FBR3ZCLGtCQUFVLEtBQUtqRSxLQUFMLENBQVdoQztBQUhFLFNBSW5CLEtBQUtnQyxLQUFMLENBQVc3QixVQUpRO0FBS3ZCLHFCQUFhLEtBQUs2QixLQUFMLENBQVdqQyxXQUxEO0FBTXZCLG1CQUFXOEYsY0FOWTtBQU92QixlQUFPLEtBQUtqQyxLQUFMLENBQVduQixVQVBLO0FBUXZCLGtCQUFVLEtBQUtRLFNBUlE7QUFTdkIsZ0JBQVEsS0FBS1U7QUFUVSxTQUF4QixHQVVJLElBdEJQO0FBdUJHLFdBQUtjLCtCQUFMO0FBdkJILEtBREY7QUEyQkQsRzs7c0JBb0JEeUIsa0IsaUNBQXFCO0FBQ25CLFFBQUksQ0FBQyxLQUFLbEUsS0FBTCxDQUFXOUMsSUFBaEIsRUFBc0I7QUFDcEIsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQsV0FDRTtBQUNFLFlBQUssUUFEUDtBQUVFLFlBQU0sS0FBSzhDLEtBQUwsQ0FBVzlDLElBRm5CO0FBR0UsYUFBTyxLQUFLMEUsS0FBTCxDQUFXcEI7QUFIcEIsTUFERjtBQU9ELEc7O3NCQUVENkIsdUIsc0NBQTBCO0FBQ3hCLFFBQU04QixvQkFBb0IsS0FBS25FLEtBQUwsQ0FBV2xCLGFBQXJDO0FBQ0EsUUFBTXNGLG1CQUFtQixLQUFLcEUsS0FBTCxDQUFXcEIsWUFBcEM7QUFDQSxRQUFJLE9BQU91RixpQkFBUCxLQUE2QixVQUFqQyxFQUE2QztBQUMzQyxVQUFJQyxxQkFBcUIsSUFBekIsRUFBK0I7QUFDN0Isd0JBQVFDLElBQVIsQ0FDRSxxRUFERjtBQUdEO0FBQ0QsYUFBT0YsaUJBQVA7QUFDRCxLQVBELE1BT08sSUFBSSxPQUFPQyxnQkFBUCxLQUE0QixVQUFoQyxFQUE0Qzs7QUFFakQ7QUFDQSxhQUFPLFVBQUN0RyxLQUFELEVBQVFMLE9BQVI7QUFBQSxlQUFvQkEsUUFBUTZHLE1BQVIsQ0FBZTtBQUFBLGlCQUFLRixpQkFBaUJ0RyxLQUFqQixFQUF3QnlHLENBQXhCLENBQUw7QUFBQSxTQUFmLENBQXBCO0FBQUEsT0FBUDtBQUNEOztBQUVELFFBQU1DLFNBQVMsT0FBT0osZ0JBQVAsS0FBNEIsUUFBNUIsR0FDYixtQkFBU0ssZ0JBQVQsQ0FBMEJMLGdCQUExQixDQURhLEdBRWIsbUJBQVNNLFdBRlg7O0FBSUEsV0FBTyxVQUFDNUcsS0FBRCxFQUFRTCxPQUFSO0FBQUEsYUFBb0IsZ0JBQ3hCNkcsTUFEd0IsQ0FDakJ4RyxLQURpQixFQUNWTCxPQURVLEVBQ0QsRUFBQ2tILFNBQVNILE1BQVYsRUFEQyxFQUV4QkksR0FGd0IsQ0FFcEI7QUFBQSxlQUFPbkgsUUFBUW9ILElBQUlsQyxLQUFaLENBQVA7QUFBQSxPQUZvQixDQUFwQjtBQUFBLEtBQVA7QUFHRCxHOztzQkFFRHhCLFEsdUJBQVc7QUFDVCxXQUFPLEtBQUtTLEtBQUwsQ0FBV3RCLGFBQVgsQ0FBeUI4QixNQUF6QixHQUFrQyxDQUFsQyxJQUF1QyxLQUFLRSxlQUFMLEVBQTlDO0FBQ0QsRzs7c0JBRURNLGdCLCtCQUFtQjtBQUNqQixXQUFPa0MsTUFBTUMsT0FBTixDQUFjLEtBQUsvRSxLQUFMLENBQVdyQyxZQUF6QixLQUEwQyxLQUFLcUMsS0FBTCxDQUFXckMsWUFBWCxDQUF3QnlFLE1BQXpFO0FBQ0QsRzs7Ozs7QUFHSGpDLFVBQVVsRCxTQUFWLEdBQXNCQSxTQUF0QjtBQUNBa0QsVUFBVVYsWUFBVixHQUF5QkEsWUFBekI7O2tCQUVlVSxTIiwiZmlsZSI6InR5cGVhaGVhZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBmdXp6eSBmcm9tICdmdXp6eSc7XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtjb25zb2xlIGFzIENvbnNvbGV9IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuXG5pbXBvcnQgQWNjZXNzb3IgZnJvbSAnLi9hY2Nlc3Nvcic7XG5pbXBvcnQgS2V5RXZlbnQgZnJvbSAnLi9rZXlldmVudCc7XG5pbXBvcnQgRHJvcGRvd25MaXN0LCB7TGlzdEl0ZW19IGZyb20gJy4vZHJvcGRvd24tbGlzdCc7XG5cbmNvbnN0IERFRkFVTFRfQ0xBU1MgPSAndHlwZWFoZWFkJztcbi8qKlxuICogQ29waWVkIG1vc3RseSBmcm9tICdyZWFjdC10eXBlYWhlYWQnLCBhbiBhdXRvLWNvbXBsZXRpbmcgdGV4dCBpbnB1dFxuICpcbiAqIFJlbmRlcnMgYW4gdGV4dCBpbnB1dCB0aGF0IHNob3dzIG9wdGlvbnMgbmVhcmJ5IHRoYXQgeW91IGNhbiB1c2UgdGhlXG4gKiBrZXlib2FyZCBvciBtb3VzZSB0byBzZWxlY3QuXG4gKi9cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgbmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgY3VzdG9tQ2xhc3NlczogUHJvcFR5cGVzLm9iamVjdCxcbiAgbWF4VmlzaWJsZTogUHJvcFR5cGVzLm51bWJlcixcbiAgcmVzdWx0c1RydW5jYXRlZE1lc3NhZ2U6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG9wdGlvbnM6IFByb3BUeXBlcy5hcnJheSxcbiAgZml4ZWRPcHRpb25zOiBQcm9wVHlwZXMuYXJyYXksXG4gIGFsbG93Q3VzdG9tVmFsdWVzOiBQcm9wVHlwZXMubnVtYmVyLFxuICBpbml0aWFsVmFsdWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBwbGFjZWhvbGRlcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICB0ZXh0YXJlYTogUHJvcFR5cGVzLmJvb2wsXG4gIGlucHV0UHJvcHM6IFByb3BUeXBlcy5vYmplY3QsXG4gIG9uT3B0aW9uU2VsZWN0ZWQ6IFByb3BUeXBlcy5mdW5jLFxuICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uS2V5RG93bjogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uS2V5UHJlc3M6IFByb3BUeXBlcy5mdW5jLFxuICBvbktleVVwOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25Gb2N1czogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uQmx1cjogUHJvcFR5cGVzLmZ1bmMsXG4gIGZpbHRlck9wdGlvbjogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLmZ1bmNdKSxcbiAgc2VhcmNoT3B0aW9uczogUHJvcFR5cGVzLmZ1bmMsXG4gIGRpc3BsYXlPcHRpb246IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5mdW5jXSksXG4gIGlucHV0RGlzcGxheU9wdGlvbjogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLmZ1bmNdKSxcbiAgZm9ybUlucHV0T3B0aW9uOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuc3RyaW5nLCBQcm9wVHlwZXMuZnVuY10pLFxuICBkZWZhdWx0Q2xhc3NOYW1lczogUHJvcFR5cGVzLmJvb2wsXG4gIGN1c3RvbUxpc3RDb21wb25lbnQ6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5lbGVtZW50LCBQcm9wVHlwZXMuZnVuY10pLFxuICBjdXN0b21MaXN0SXRlbUNvbXBvbmVudDogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLmVsZW1lbnQsIFByb3BUeXBlcy5mdW5jXSksXG4gIGN1c3RvbUxpc3RIZWFkZXJDb21wb25lbnQ6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5lbGVtZW50LCBQcm9wVHlwZXMuZnVuY10pLFxuICBzaG93T3B0aW9uc1doZW5FbXB0eTogUHJvcFR5cGVzLmJvb2wsXG4gIHNlYXJjaGFibGU6IFByb3BUeXBlcy5ib29sXG59O1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIG9wdGlvbnM6IFtdLFxuICBjdXN0b21DbGFzc2VzOiB7fSxcbiAgYWxsb3dDdXN0b21WYWx1ZXM6IDAsXG4gIGluaXRpYWxWYWx1ZTogJycsXG4gIHZhbHVlOiAnJyxcbiAgcGxhY2Vob2xkZXI6ICcnLFxuICBkaXNhYmxlZDogZmFsc2UsXG4gIHRleHRhcmVhOiBmYWxzZSxcbiAgaW5wdXRQcm9wczoge30sXG4gIG9uT3B0aW9uU2VsZWN0ZWQob3B0aW9uKSB7fSxcbiAgb25DaGFuZ2UoZXZlbnQpIHt9LFxuICBvbktleURvd24oZXZlbnQpIHt9LFxuICBvbktleVByZXNzKGV2ZW50KSB7fSxcbiAgb25LZXlVcChldmVudCkge30sXG4gIG9uRm9jdXMoZXZlbnQpIHt9LFxuICBvbkJsdXIoZXZlbnQpIHt9LFxuICBmaWx0ZXJPcHRpb246IG51bGwsXG4gIHNlYXJjaE9wdGlvbnM6IG51bGwsXG4gIGlucHV0RGlzcGxheU9wdGlvbjogbnVsbCxcbiAgZGVmYXVsdENsYXNzTmFtZXM6IHRydWUsXG4gIGN1c3RvbUxpc3RDb21wb25lbnQ6IERyb3Bkb3duTGlzdCxcbiAgY3VzdG9tTGlzdEl0ZW1Db21wb25lbnQ6IExpc3RJdGVtLFxuICBjdXN0b21MaXN0SGVhZGVyQ29tcG9uZW50OiBudWxsLFxuICBzaG93T3B0aW9uc1doZW5FbXB0eTogdHJ1ZSxcbiAgc2VhcmNoYWJsZTogdHJ1ZSxcbiAgcmVzdWx0c1RydW5jYXRlZE1lc3NhZ2U6IG51bGxcbn07XG5cbmNvbnN0IFR5cGVhaGVhZFdyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBcbiAgOmZvY3VzIHtcbiAgICBvdXRsaW5lOiAwO1xuICB9XG5gO1xuXG5jb25zdCBUeXBlYWhlYWRJbnB1dCA9IHN0eWxlZC5pbnB1dGBcbiAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dH0gXG4gIGZsZXgtZ3JvdzogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWxlY3RCYWNrZ3JvdW5kSG92ZXJ9O1xuICBtYXJnaW46IDhweDtcbiAgd2lkdGg6IGF1dG87XG5gO1xuXG5jbGFzcyBUeXBlYWhlYWQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBzZWFyY2hSZXN1bHRzOiB0aGlzLmdldE9wdGlvbnNGb3JWYWx1ZShcbiAgICAgICAgdGhpcy5wcm9wcy5pbml0aWFsVmFsdWUsXG4gICAgICAgIHRoaXMucHJvcHMub3B0aW9uc1xuICAgICAgKSxcblxuICAgICAgLy8gVGhpcyBzaG91bGQgYmUgY2FsbGVkIHNvbWV0aGluZyBlbHNlLCAnZW50cnlWYWx1ZSdcbiAgICAgIGVudHJ5VmFsdWU6IHRoaXMucHJvcHMudmFsdWUgfHwgdGhpcy5wcm9wcy5pbml0aWFsVmFsdWUsXG5cbiAgICAgIC8vIEEgdmFsaWQgdHlwZWFoZWFkIHZhbHVlXG4gICAgICBzZWxlY3Rpb246IHRoaXMucHJvcHMudmFsdWUsXG5cbiAgICAgIC8vIEluZGV4IG9mIHRoZSBzZWxlY3Rpb25cbiAgICAgIHNlbGVjdGlvbkluZGV4OiBudWxsLFxuXG4gICAgICAvLyBLZWVwIHRyYWNrIG9mIHRoZSBmb2N1cyBzdGF0ZSBvZiB0aGUgaW5wdXQgZWxlbWVudCwgdG8gZGV0ZXJtaW5lXG4gICAgICAvLyB3aGV0aGVyIHRvIHNob3cgb3B0aW9ucyB3aGVuIGVtcHR5IChpZiBzaG93T3B0aW9uc1doZW5FbXB0eSBpcyB0cnVlKVxuICAgICAgaXNGb2N1c2VkOiBmYWxzZVxuICAgIH07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlYXJjaFJlc3VsdHM6IHRoaXMuZ2V0T3B0aW9uc0ZvclZhbHVlKCcnLCB0aGlzLnByb3BzLm9wdGlvbnMpXG4gICAgfSk7XG5cbiAgICAvLyBjYWxsIGZvY3VzIG9uIGVudHJ5IG9yIGRpdiB0byB0cmlnZ2VyIGtleSBldmVudHMgbGlzdGVuZXJcbiAgICBpZiAodGhpcy5lbnRyeSkge1xuICAgICAgdGhpcy5lbnRyeS5mb2N1cygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJvb3QuZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICBfc2hvdWxkU2tpcFNlYXJjaChpbnB1dCkge1xuICAgIGNvbnN0IGVtcHR5VmFsdWUgPSAhaW5wdXQgfHwgaW5wdXQudHJpbSgpLmxlbmd0aCA9PT0gMDtcblxuICAgIC8vIHRoaXMuc3RhdGUgbXVzdCBiZSBjaGVja2VkIGJlY2F1c2UgaXQgbWF5IG5vdCBiZSBkZWZpbmVkIHlldCBpZiB0aGlzIGZ1bmN0aW9uXG4gICAgLy8gaXMgY2FsbGVkIGZyb20gd2l0aGluIGdldEluaXRpYWxTdGF0ZVxuICAgIGNvbnN0IGlzRm9jdXNlZCA9IHRoaXMuc3RhdGUgJiYgdGhpcy5zdGF0ZS5pc0ZvY3VzZWQ7XG4gICAgcmV0dXJuICEodGhpcy5wcm9wcy5zaG93T3B0aW9uc1doZW5FbXB0eSAmJiBpc0ZvY3VzZWQpICYmIGVtcHR5VmFsdWU7XG4gIH1cblxuICBnZXRPcHRpb25zRm9yVmFsdWUodmFsdWUsIG9wdGlvbnMpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMuc2VhcmNoYWJsZSkge1xuICAgICAgLy8gZGlyZWN0bHkgcGFzcyB0aHJvdWdoIG9wdGlvbnMgaWYgY2FuIG5vdCBiZSBzZWFyY2hlZFxuICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgfVxuICAgIGlmICh0aGlzLl9zaG91bGRTa2lwU2VhcmNoKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VhcmNoT3B0aW9ucyA9IHRoaXMuX2dlbmVyYXRlU2VhcmNoRnVuY3Rpb24oKTtcbiAgICByZXR1cm4gc2VhcmNoT3B0aW9ucyh2YWx1ZSwgb3B0aW9ucyk7XG4gIH1cblxuICBmb2N1cygpIHtcbiAgICBpZiAodGhpcy5lbnRyeSkge1xuICAgICAgdGhpcy5lbnRyeS5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIF9oYXNDdXN0b21WYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5hbGxvd0N1c3RvbVZhbHVlcyA+IDAgJiZcbiAgICAgIHRoaXMuc3RhdGUuZW50cnlWYWx1ZS5sZW5ndGggPj0gdGhpcy5wcm9wcy5hbGxvd0N1c3RvbVZhbHVlcyAmJlxuICAgICAgdGhpcy5zdGF0ZS5zZWFyY2hSZXN1bHRzLmluZGV4T2YodGhpcy5zdGF0ZS5lbnRyeVZhbHVlKSA8IDA7XG4gIH1cblxuICBfZ2V0Q3VzdG9tVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hhc0N1c3RvbVZhbHVlKCkgPyB0aGlzLnN0YXRlLmVudHJ5VmFsdWUgOiBudWxsO1xuICB9XG5cbiAgX3JlbmRlckluY3JlbWVudGFsU2VhcmNoUmVzdWx0cygpIHtcblxuICAgIHJldHVybiAoXG4gICAgICA8dGhpcy5wcm9wcy5jdXN0b21MaXN0Q29tcG9uZW50XG4gICAgICAgIHJlZj0nc2VsJ1xuICAgICAgICBmaXhlZE9wdGlvbnM9e3RoaXMucHJvcHMuZml4ZWRPcHRpb25zfVxuICAgICAgICBvcHRpb25zPXtcbiAgICAgICAgICB0aGlzLnByb3BzLm1heFZpc2libGVcbiAgICAgICAgICAgID8gdGhpcy5zdGF0ZS5zZWFyY2hSZXN1bHRzLnNsaWNlKDAsIHRoaXMucHJvcHMubWF4VmlzaWJsZSlcbiAgICAgICAgICAgIDogdGhpcy5zdGF0ZS5zZWFyY2hSZXN1bHRzXG4gICAgICAgIH1cbiAgICAgICAgYXJlUmVzdWx0c1RydW5jYXRlZD17XG4gICAgICAgICAgdGhpcy5wcm9wcy5tYXhWaXNpYmxlICYmXG4gICAgICAgICAgdGhpcy5zdGF0ZS5zZWFyY2hSZXN1bHRzLmxlbmd0aCA+IHRoaXMucHJvcHMubWF4VmlzaWJsZVxuICAgICAgICB9XG4gICAgICAgIHJlc3VsdHNUcnVuY2F0ZWRNZXNzYWdlPXt0aGlzLnByb3BzLnJlc3VsdHNUcnVuY2F0ZWRNZXNzYWdlfVxuICAgICAgICBvbk9wdGlvblNlbGVjdGVkPXt0aGlzLl9vbk9wdGlvblNlbGVjdGVkfVxuICAgICAgICBhbGxvd0N1c3RvbVZhbHVlcz17dGhpcy5wcm9wcy5hbGxvd0N1c3RvbVZhbHVlc31cbiAgICAgICAgY3VzdG9tVmFsdWU9e3RoaXMuX2dldEN1c3RvbVZhbHVlKCl9XG4gICAgICAgIGN1c3RvbUNsYXNzZXM9e3RoaXMucHJvcHMuY3VzdG9tQ2xhc3Nlc31cbiAgICAgICAgY3VzdG9tTGlzdEl0ZW1Db21wb25lbnQ9e3RoaXMucHJvcHMuY3VzdG9tTGlzdEl0ZW1Db21wb25lbnR9XG4gICAgICAgIGN1c3RvbUxpc3RIZWFkZXJDb21wb25lbnQ9e3RoaXMucHJvcHMuY3VzdG9tTGlzdEhlYWRlckNvbXBvbmVudH1cbiAgICAgICAgc2VsZWN0aW9uSW5kZXg9e3RoaXMuc3RhdGUuc2VsZWN0aW9uSW5kZXh9XG4gICAgICAgIGRlZmF1bHRDbGFzc05hbWVzPXt0aGlzLnByb3BzLmRlZmF1bHRDbGFzc05hbWVzfVxuICAgICAgICBkaXNwbGF5T3B0aW9uPXt0aGlzLnByb3BzLmRpc3BsYXlPcHRpb259XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBnZXRTZWxlY3Rpb24oKSB7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb25JbmRleDtcblxuICAgIGlmICh0aGlzLl9oYXNDdXN0b21WYWx1ZSgpKSB7XG4gICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuZW50cnlWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGluZGV4LS07XG4gICAgfVxuICAgIGlmICh0aGlzLl9oYXNGaXhlZE9wdGlvbnMoKSkge1xuICAgICAgcmV0dXJuIGluZGV4IDwgdGhpcy5wcm9wcy5maXhlZE9wdGlvbnMubGVuZ3RoID8gdGhpcy5wcm9wcy5maXhlZE9wdGlvbnNbaW5kZXhdIDpcbiAgICAgICAgdGhpcy5zdGF0ZS5zZWFyY2hSZXN1bHRzW2luZGV4IC0gdGhpcy5wcm9wcy5maXhlZE9wdGlvbnMubGVuZ3RoXTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuc2VhcmNoUmVzdWx0c1tpbmRleF07XG4gIH1cblxuICBfb25PcHRpb25TZWxlY3RlZCA9IChvcHRpb24sIGV2ZW50KSA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMuc2VhcmNoYWJsZSkge1xuICAgICAgLy8gcmVzZXQgZW50cnkgaW5wdXRcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBzZWFyY2hSZXN1bHRzOiB0aGlzLmdldE9wdGlvbnNGb3JWYWx1ZSgnJywgdGhpcy5wcm9wcy5vcHRpb25zKSxcbiAgICAgICAgc2VsZWN0aW9uOiAnJyxcbiAgICAgICAgZW50cnlWYWx1ZTogJydcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnByb3BzLm9uT3B0aW9uU2VsZWN0ZWQob3B0aW9uLCBldmVudCk7XG4gIH07XG5cbiAgLy8gdXNlICgpID0+IHt9IHRvIGF2b2lkIGJpbmRpbmcgJ3RoaXMnXG4gIF9vblRleHRFbnRyeVVwZGF0ZWQgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMuc2VhcmNoYWJsZSkge1xuICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmVudHJ5LnZhbHVlO1xuXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgc2VhcmNoUmVzdWx0czogdGhpcy5nZXRPcHRpb25zRm9yVmFsdWUodmFsdWUsIHRoaXMucHJvcHMub3B0aW9ucyksXG4gICAgICAgIHNlbGVjdGlvbjogJycsXG4gICAgICAgIGVudHJ5VmFsdWU6IHZhbHVlXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgX29uRW50ZXIgPSAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSB0aGlzLmdldFNlbGVjdGlvbigpO1xuICAgIGlmICghc2VsZWN0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5vbktleURvd24oZXZlbnQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fb25PcHRpb25TZWxlY3RlZChzZWxlY3Rpb24sIGV2ZW50KTtcbiAgfTtcblxuICBfb25Fc2NhcGUoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3Rpb25JbmRleDogbnVsbFxuICAgIH0pO1xuICB9XG5cbiAgX29uVGFiKGV2ZW50KSB7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gdGhpcy5nZXRTZWxlY3Rpb24oKTtcbiAgICBsZXQgb3B0aW9uID0gc2VsZWN0aW9uXG4gICAgICA/IHNlbGVjdGlvblxuICAgICAgOiB0aGlzLnN0YXRlLnNlYXJjaFJlc3VsdHMubGVuZ3RoID4gMFxuICAgICAgICA/IHRoaXMuc3RhdGUuc2VhcmNoUmVzdWx0c1swXVxuICAgICAgICA6IG51bGw7XG5cbiAgICBpZiAob3B0aW9uID09PSBudWxsICYmIHRoaXMuX2hhc0N1c3RvbVZhbHVlKCkpIHtcbiAgICAgIG9wdGlvbiA9IHRoaXMuX2dldEN1c3RvbVZhbHVlKCk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbiAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuX29uT3B0aW9uU2VsZWN0ZWQob3B0aW9uLCBldmVudCk7XG4gICAgfVxuICB9XG5cbiAgZXZlbnRNYXAoZXZlbnQpIHtcbiAgICBjb25zdCBldmVudHMgPSB7fTtcblxuICAgIGV2ZW50c1tLZXlFdmVudC5ET01fVktfVVBdID0gdGhpcy5uYXZVcDtcbiAgICBldmVudHNbS2V5RXZlbnQuRE9NX1ZLX0RPV05dID0gdGhpcy5uYXZEb3duO1xuICAgIGV2ZW50c1tLZXlFdmVudC5ET01fVktfUkVUVVJOXSA9IGV2ZW50c1tcbiAgICAgIEtleUV2ZW50LkRPTV9WS19FTlRFUlxuICAgIF0gPSB0aGlzLl9vbkVudGVyO1xuICAgIGV2ZW50c1tLZXlFdmVudC5ET01fVktfRVNDQVBFXSA9IHRoaXMuX29uRXNjYXBlO1xuICAgIGV2ZW50c1tLZXlFdmVudC5ET01fVktfVEFCXSA9IHRoaXMuX29uVGFiO1xuXG4gICAgcmV0dXJuIGV2ZW50cztcbiAgfVxuXG4gIF9uYXYoZGVsdGEpIHtcbiAgICBpZiAoIXRoaXMuX2hhc0hpbnQoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgbmV3SW5kZXggPVxuICAgICAgdGhpcy5zdGF0ZS5zZWxlY3Rpb25JbmRleCA9PT0gbnVsbFxuICAgICAgICA/IGRlbHRhID09PSAxID8gMCA6IGRlbHRhXG4gICAgICAgIDogdGhpcy5zdGF0ZS5zZWxlY3Rpb25JbmRleCArIGRlbHRhO1xuICAgIGxldCBsZW5ndGggPSB0aGlzLnByb3BzLm1heFZpc2libGVcbiAgICAgID8gdGhpcy5zdGF0ZS5zZWFyY2hSZXN1bHRzLnNsaWNlKDAsIHRoaXMucHJvcHMubWF4VmlzaWJsZSkubGVuZ3RoXG4gICAgICA6IHRoaXMuc3RhdGUuc2VhcmNoUmVzdWx0cy5sZW5ndGg7XG4gICAgaWYgKHRoaXMuX2hhc0N1c3RvbVZhbHVlKCkpIHtcbiAgICAgIGxlbmd0aCArPSAxO1xuICAgIH1cblxuICAgIGlmIChuZXdJbmRleCA8IDApIHtcbiAgICAgIG5ld0luZGV4ICs9IGxlbmd0aDtcbiAgICB9IGVsc2UgaWYgKG5ld0luZGV4ID49IGxlbmd0aCkge1xuICAgICAgbmV3SW5kZXggLT0gbGVuZ3RoO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe3NlbGVjdGlvbkluZGV4OiBuZXdJbmRleH0pO1xuICB9XG5cbiAgbmF2RG93biA9ICgpID0+IHtcbiAgICB0aGlzLl9uYXYoMSk7XG4gIH07XG5cbiAgbmF2VXAgPSAoKSA9PiB7XG4gICAgdGhpcy5fbmF2KC0xKTtcbiAgfTtcblxuICBfb25DaGFuZ2UgPSAoZXZlbnQpID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5vbkNoYW5nZSkge1xuICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZShldmVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5fb25UZXh0RW50cnlVcGRhdGVkKCk7XG4gIH07XG5cbiAgX29uS2V5RG93biA9IChldmVudCkgPT4ge1xuICAgIC8vIElmIHRoZXJlIGFyZSBubyB2aXNpYmxlIGVsZW1lbnRzLCBkb24ndCBwZXJmb3JtIHNlbGVjdG9yIG5hdmlnYXRpb24uXG4gICAgLy8gSnVzdCBwYXNzIHRoaXMgdXAgdG8gdGhlIHVwc3RyZWFtIG9uS2V5ZG93biBoYW5kbGVyLlxuICAgIC8vIEFsc28gc2tpcCBpZiB0aGUgdXNlciBpcyBwcmVzc2luZyB0aGUgc2hpZnQga2V5LCBzaW5jZSBub25lIG9mIG91ciBoYW5kbGVycyBhcmUgbG9va2luZyBmb3Igc2hpZnRcbiAgICBpZiAoIXRoaXMuX2hhc0hpbnQoKSB8fCBldmVudC5zaGlmdEtleSkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMub25LZXlEb3duKGV2ZW50KTtcbiAgICB9XG5cbiAgICBjb25zdCBoYW5kbGVyID0gdGhpcy5ldmVudE1hcCgpW2V2ZW50LmtleUNvZGVdO1xuXG4gICAgaWYgKGhhbmRsZXIpIHtcbiAgICAgIGhhbmRsZXIoZXZlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5vbktleURvd24oZXZlbnQpO1xuICAgIH1cbiAgICAvLyBEb24ndCBwcm9wYWdhdGUgdGhlIGtleXN0cm9rZSBiYWNrIHRvIHRoZSBET00vYnJvd3NlclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH07XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICBjb25zdCBzZWFyY2hSZXN1bHRzID0gdGhpcy5nZXRPcHRpb25zRm9yVmFsdWUoXG4gICAgICB0aGlzLnN0YXRlLmVudHJ5VmFsdWUsXG4gICAgICBuZXh0UHJvcHMub3B0aW9uc1xuICAgICk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtzZWFyY2hSZXN1bHRzfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgaW5wdXRDbGFzc2VzID0ge307XG4gICAgaW5wdXRDbGFzc2VzW3RoaXMucHJvcHMuY3VzdG9tQ2xhc3Nlcy5pbnB1dF0gPSBCb29sZWFuKHRoaXMucHJvcHMuY3VzdG9tQ2xhc3Nlcy5pbnB1dCk7XG4gICAgY29uc3QgaW5wdXRDbGFzc0xpc3QgPSBjbGFzc05hbWVzKGlucHV0Q2xhc3Nlcyk7XG5cbiAgICBjb25zdCBjbGFzc2VzID0ge1xuICAgICAgW0RFRkFVTFRfQ0xBU1NdOiB0aGlzLnByb3BzLmRlZmF1bHRDbGFzc05hbWVzXG4gICAgfTtcbiAgICBjbGFzc2VzW3RoaXMucHJvcHMuY2xhc3NOYW1lXSA9IEJvb2xlYW4odGhpcy5wcm9wcy5jbGFzc05hbWUpO1xuICAgIGNvbnN0IGNsYXNzTGlzdCA9IGNsYXNzTmFtZXMoY2xhc3Nlcyk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFR5cGVhaGVhZFdyYXBwZXJcbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc0xpc3R9XG4gICAgICAgIGlubmVyUmVmPXtjb21wID0+IHtcbiAgICAgICAgICB0aGlzLnJvb3QgPSBjb21wO1xuICAgICAgICB9fVxuICAgICAgICB0YWJJbmRleD1cIjBcIlxuICAgICAgICBvbktleURvd249e3RoaXMuX29uS2V5RG93bn1cbiAgICAgICAgb25LZXlQcmVzcz17dGhpcy5wcm9wcy5vbktleVByZXNzfVxuICAgICAgICBvbktleVVwPXt0aGlzLnByb3BzLm9uS2V5VXB9XG4gICAgICAgIG9uRm9jdXM9e3RoaXMuX29uRm9jdXN9XG4gICAgICA+XG4gICAgICAgIHt0aGlzLl9yZW5kZXJIaWRkZW5JbnB1dCgpfVxuICAgICAgICB7dGhpcy5wcm9wcy5zZWFyY2hhYmxlID8gPFR5cGVhaGVhZElucHV0XG4gICAgICAgICAgaW5uZXJSZWY9e2NvbXAgPT4ge3RoaXMuZW50cnkgPSBjb21wfX1cbiAgICAgICAgICB0eXBlPSd0ZXh0J1xuICAgICAgICAgIGRpc2FibGVkPXt0aGlzLnByb3BzLmRpc2FibGVkfVxuICAgICAgICAgIHsuLi50aGlzLnByb3BzLmlucHV0UHJvcHN9XG4gICAgICAgICAgcGxhY2Vob2xkZXI9e3RoaXMucHJvcHMucGxhY2Vob2xkZXJ9XG4gICAgICAgICAgY2xhc3NOYW1lPXtpbnB1dENsYXNzTGlzdH1cbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5lbnRyeVZhbHVlfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLl9vbkNoYW5nZX1cbiAgICAgICAgICBvbkJsdXI9e3RoaXMuX29uQmx1cn1cbiAgICAgICAgLz4gOiBudWxsfVxuICAgICAgICB7dGhpcy5fcmVuZGVySW5jcmVtZW50YWxTZWFyY2hSZXN1bHRzKCl9XG4gICAgICA8L1R5cGVhaGVhZFdyYXBwZXI+XG4gICAgKTtcbiAgfVxuXG4gIF9vbkZvY3VzID0gKGV2ZW50KSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZShcbiAgICAgIHtpc0ZvY3VzZWQ6IHRydWV9XG4gICAgKTtcbiAgICBpZiAodGhpcy5wcm9wcy5vbkZvY3VzKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5vbkZvY3VzKGV2ZW50KTtcbiAgICB9XG4gIH07XG5cbiAgX29uQmx1ciA9IChldmVudCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICB7aXNGb2N1c2VkOiBmYWxzZX1cbiAgICApO1xuICAgIGlmICh0aGlzLnByb3BzLm9uQmx1cikge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMub25CbHVyKGV2ZW50KTtcbiAgICB9XG4gIH07XG5cbiAgX3JlbmRlckhpZGRlbklucHV0KCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5uYW1lKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGlucHV0XG4gICAgICAgIHR5cGU9J2hpZGRlbidcbiAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5zZWxlY3Rpb259XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBfZ2VuZXJhdGVTZWFyY2hGdW5jdGlvbigpIHtcbiAgICBjb25zdCBzZWFyY2hPcHRpb25zUHJvcCA9IHRoaXMucHJvcHMuc2VhcmNoT3B0aW9ucztcbiAgICBjb25zdCBmaWx0ZXJPcHRpb25Qcm9wID0gdGhpcy5wcm9wcy5maWx0ZXJPcHRpb247XG4gICAgaWYgKHR5cGVvZiBzZWFyY2hPcHRpb25zUHJvcCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaWYgKGZpbHRlck9wdGlvblByb3AgIT09IG51bGwpIHtcbiAgICAgICAgQ29uc29sZS53YXJuKFxuICAgICAgICAgICdzZWFyY2hPcHRpb25zIHByb3AgaXMgYmVpbmcgdXNlZCwgZmlsdGVyT3B0aW9uIHByb3Agd2lsbCBiZSBpZ25vcmVkJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlYXJjaE9wdGlvbnNQcm9wO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGZpbHRlck9wdGlvblByb3AgPT09ICdmdW5jdGlvbicpIHtcblxuICAgICAgLy8gdXNlIGN1c3RvbSBmaWx0ZXIgb3B0aW9uXG4gICAgICByZXR1cm4gKHZhbHVlLCBvcHRpb25zKSA9PiBvcHRpb25zLmZpbHRlcihvID0+IGZpbHRlck9wdGlvblByb3AodmFsdWUsIG8pKTtcbiAgICB9XG5cbiAgICBjb25zdCBtYXBwZXIgPSB0eXBlb2YgZmlsdGVyT3B0aW9uUHJvcCA9PT0gJ3N0cmluZycgP1xuICAgICAgQWNjZXNzb3IuZ2VuZXJhdGVBY2Nlc3NvcihmaWx0ZXJPcHRpb25Qcm9wKSA6XG4gICAgICBBY2Nlc3Nvci5JREVOVElUWV9GTjtcblxuICAgIHJldHVybiAodmFsdWUsIG9wdGlvbnMpID0+IGZ1enp5XG4gICAgICAuZmlsdGVyKHZhbHVlLCBvcHRpb25zLCB7ZXh0cmFjdDogbWFwcGVyfSlcbiAgICAgIC5tYXAocmVzID0+IG9wdGlvbnNbcmVzLmluZGV4XSk7XG4gIH1cblxuICBfaGFzSGludCgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5zZWFyY2hSZXN1bHRzLmxlbmd0aCA+IDAgfHwgdGhpcy5faGFzQ3VzdG9tVmFsdWUoKTtcbiAgfVxuXG4gIF9oYXNGaXhlZE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodGhpcy5wcm9wcy5maXhlZE9wdGlvbnMpICYmIHRoaXMucHJvcHMuZml4ZWRPcHRpb25zLmxlbmd0aDtcbiAgfVxufVxuXG5UeXBlYWhlYWQucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuVHlwZWFoZWFkLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcblxuZXhwb3J0IGRlZmF1bHQgVHlwZWFoZWFkO1xuIl19