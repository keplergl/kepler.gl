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

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  flex-direction: column;\n  background-color: ', ';\n  box-shadow: ', ';\n\n  :focus {\n    outline: 0;\n  }\n'], ['\n  display: flex;\n  flex-direction: column;\n  background-color: ', ';\n  box-shadow: ', ';\n\n  :focus {\n    outline: 0;\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  padding: 8px;\n'], ['\n  padding: 8px;\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  ', '\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n  }\n'], ['\n  ', '\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n  }\n']),
    _templateObject4 = (0, _taggedTemplateLiteralLoose3.default)(['\n  position: absolute;\n  right: 15px;\n  top: 14px;\n  color: ', ';\n'], ['\n  position: absolute;\n  right: 15px;\n  top: 14px;\n  color: ', ';\n']);

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

var _icons = require('../icons');

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

var TypeaheadWrapper = _styledComponents2.default.div(_templateObject, function (props) {
  return props.theme.dropdownListBgd;
}, function (props) {
  return props.theme.dropdownListShadow;
});

var InputBox = _styledComponents2.default.div(_templateObject2);

var TypeaheadInput = _styledComponents2.default.input(_templateObject3, function (props) {
  return props.theme.secondaryInput;
}, function (props) {
  return props.theme.secondaryInputBgd;
});

var InputIcon = _styledComponents2.default.div(_templateObject4, function (props) {
  return props.theme.inputPlaceholderColor;
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

  Typeahead.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var searchResults = this.getOptionsForValue(this.state.entryValue, nextProps.options);

    this.setState({ searchResults: searchResults });
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
      this.props.searchable ? _react2.default.createElement(
        InputBox,
        null,
        _react2.default.createElement(TypeaheadInput, (0, _extends3.default)({
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
        })),
        _react2.default.createElement(
          InputIcon,
          null,
          _react2.default.createElement(_icons.Search, { height: '18px' })
        )
      ) : null,
      this._renderIncrementalSearchResults()
    );
  };

  return Typeahead;
}(_react.Component);

Typeahead.propTypes = propTypes;
Typeahead.defaultProps = defaultProps;

exports.default = Typeahead;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL3R5cGVhaGVhZC5qcyJdLCJuYW1lcyI6WyJERUZBVUxUX0NMQVNTIiwicHJvcFR5cGVzIiwibmFtZSIsInN0cmluZyIsImN1c3RvbUNsYXNzZXMiLCJvYmplY3QiLCJtYXhWaXNpYmxlIiwibnVtYmVyIiwicmVzdWx0c1RydW5jYXRlZE1lc3NhZ2UiLCJvcHRpb25zIiwiYXJyYXkiLCJmaXhlZE9wdGlvbnMiLCJhbGxvd0N1c3RvbVZhbHVlcyIsImluaXRpYWxWYWx1ZSIsInZhbHVlIiwicGxhY2Vob2xkZXIiLCJkaXNhYmxlZCIsImJvb2wiLCJ0ZXh0YXJlYSIsImlucHV0UHJvcHMiLCJvbk9wdGlvblNlbGVjdGVkIiwiZnVuYyIsIm9uQ2hhbmdlIiwib25LZXlEb3duIiwib25LZXlQcmVzcyIsIm9uS2V5VXAiLCJvbkZvY3VzIiwib25CbHVyIiwiZmlsdGVyT3B0aW9uIiwib25lT2ZUeXBlIiwic2VhcmNoT3B0aW9ucyIsImRpc3BsYXlPcHRpb24iLCJpbnB1dERpc3BsYXlPcHRpb24iLCJmb3JtSW5wdXRPcHRpb24iLCJkZWZhdWx0Q2xhc3NOYW1lcyIsImN1c3RvbUxpc3RDb21wb25lbnQiLCJlbGVtZW50IiwiY3VzdG9tTGlzdEl0ZW1Db21wb25lbnQiLCJjdXN0b21MaXN0SGVhZGVyQ29tcG9uZW50Iiwic2hvd09wdGlvbnNXaGVuRW1wdHkiLCJzZWFyY2hhYmxlIiwiZGVmYXVsdFByb3BzIiwib3B0aW9uIiwiZXZlbnQiLCJUeXBlYWhlYWRXcmFwcGVyIiwiZGl2IiwicHJvcHMiLCJ0aGVtZSIsImRyb3Bkb3duTGlzdEJnZCIsImRyb3Bkb3duTGlzdFNoYWRvdyIsIklucHV0Qm94IiwiVHlwZWFoZWFkSW5wdXQiLCJpbnB1dCIsInNlY29uZGFyeUlucHV0Iiwic2Vjb25kYXJ5SW5wdXRCZ2QiLCJJbnB1dEljb24iLCJpbnB1dFBsYWNlaG9sZGVyQ29sb3IiLCJUeXBlYWhlYWQiLCJfb25PcHRpb25TZWxlY3RlZCIsInNldFN0YXRlIiwic2VhcmNoUmVzdWx0cyIsImdldE9wdGlvbnNGb3JWYWx1ZSIsInNlbGVjdGlvbiIsImVudHJ5VmFsdWUiLCJfb25UZXh0RW50cnlVcGRhdGVkIiwiZW50cnkiLCJfb25FbnRlciIsImdldFNlbGVjdGlvbiIsIm5hdkRvd24iLCJfbmF2IiwibmF2VXAiLCJfb25DaGFuZ2UiLCJfb25LZXlEb3duIiwiX2hhc0hpbnQiLCJzaGlmdEtleSIsImhhbmRsZXIiLCJldmVudE1hcCIsImtleUNvZGUiLCJwcmV2ZW50RGVmYXVsdCIsIl9vbkZvY3VzIiwiaXNGb2N1c2VkIiwiX29uQmx1ciIsInN0YXRlIiwic2VsZWN0aW9uSW5kZXgiLCJjb21wb25lbnREaWRNb3VudCIsImZvY3VzIiwicm9vdCIsImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMiLCJuZXh0UHJvcHMiLCJfc2hvdWxkU2tpcFNlYXJjaCIsImVtcHR5VmFsdWUiLCJ0cmltIiwibGVuZ3RoIiwiX2dlbmVyYXRlU2VhcmNoRnVuY3Rpb24iLCJfaGFzQ3VzdG9tVmFsdWUiLCJpbmRleE9mIiwiX2dldEN1c3RvbVZhbHVlIiwiX3JlbmRlckluY3JlbWVudGFsU2VhcmNoUmVzdWx0cyIsInNsaWNlIiwiaW5kZXgiLCJfaGFzRml4ZWRPcHRpb25zIiwiX29uRXNjYXBlIiwiX29uVGFiIiwiZXZlbnRzIiwiRE9NX1ZLX1VQIiwiRE9NX1ZLX0RPV04iLCJET01fVktfUkVUVVJOIiwiRE9NX1ZLX0VOVEVSIiwiRE9NX1ZLX0VTQ0FQRSIsIkRPTV9WS19UQUIiLCJkZWx0YSIsIm5ld0luZGV4IiwiX3JlbmRlckhpZGRlbklucHV0Iiwic2VhcmNoT3B0aW9uc1Byb3AiLCJmaWx0ZXJPcHRpb25Qcm9wIiwid2FybiIsImZpbHRlciIsIm8iLCJtYXBwZXIiLCJnZW5lcmF0ZUFjY2Vzc29yIiwiSURFTlRJVFlfRk4iLCJleHRyYWN0IiwibWFwIiwicmVzIiwiQXJyYXkiLCJpc0FycmF5IiwicmVuZGVyIiwiaW5wdXRDbGFzc2VzIiwiQm9vbGVhbiIsImlucHV0Q2xhc3NMaXN0IiwiY2xhc3NlcyIsImNsYXNzTmFtZSIsImNsYXNzTGlzdCIsImNvbXAiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxnQkFBZ0IsV0FBdEI7QUFDQTs7Ozs7O0FBTUEsSUFBTUMsWUFBWTtBQUNoQkMsUUFBTSxvQkFBVUMsTUFEQTtBQUVoQkMsaUJBQWUsb0JBQVVDLE1BRlQ7QUFHaEJDLGNBQVksb0JBQVVDLE1BSE47QUFJaEJDLDJCQUF5QixvQkFBVUwsTUFKbkI7QUFLaEJNLFdBQVMsb0JBQVVDLEtBTEg7QUFNaEJDLGdCQUFjLG9CQUFVRCxLQU5SO0FBT2hCRSxxQkFBbUIsb0JBQVVMLE1BUGI7QUFRaEJNLGdCQUFjLG9CQUFVVixNQVJSO0FBU2hCVyxTQUFPLG9CQUFVWCxNQVREO0FBVWhCWSxlQUFhLG9CQUFVWixNQVZQO0FBV2hCYSxZQUFVLG9CQUFVQyxJQVhKO0FBWWhCQyxZQUFVLG9CQUFVRCxJQVpKO0FBYWhCRSxjQUFZLG9CQUFVZCxNQWJOO0FBY2hCZSxvQkFBa0Isb0JBQVVDLElBZFo7QUFlaEJDLFlBQVUsb0JBQVVELElBZko7QUFnQmhCRSxhQUFXLG9CQUFVRixJQWhCTDtBQWlCaEJHLGNBQVksb0JBQVVILElBakJOO0FBa0JoQkksV0FBUyxvQkFBVUosSUFsQkg7QUFtQmhCSyxXQUFTLG9CQUFVTCxJQW5CSDtBQW9CaEJNLFVBQVEsb0JBQVVOLElBcEJGO0FBcUJoQk8sZ0JBQWMsb0JBQVVDLFNBQVYsQ0FBb0IsQ0FBQyxvQkFBVTFCLE1BQVgsRUFBbUIsb0JBQVVrQixJQUE3QixDQUFwQixDQXJCRTtBQXNCaEJTLGlCQUFlLG9CQUFVVCxJQXRCVDtBQXVCaEJVLGlCQUFlLG9CQUFVRixTQUFWLENB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RDtBQUFBO0FBQ0UseURBQVEsUUFBTyxNQUFmO0FBREY7QUFkRixPQURDLEdBbUJHLElBL0JOO0FBZ0NHLFdBQUtnQiwrQkFBTDtBQWhDSCxLQURGO0FBb0NELEc7Ozs7O0FBR0h4QyxVQUFVeEQsU0FBVixHQUFzQkEsU0FBdEI7QUFDQXdELFVBQVVoQixZQUFWLEdBQXlCQSxZQUF6Qjs7a0JBRWVnQixTIiwiZmlsZSI6InR5cGVhaGVhZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBmdXp6eSBmcm9tICdmdXp6eSc7XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtjb25zb2xlIGFzIENvbnNvbGV9IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuXG5pbXBvcnQgQWNjZXNzb3IgZnJvbSAnLi9hY2Nlc3Nvcic7XG5pbXBvcnQgS2V5RXZlbnQgZnJvbSAnLi9rZXlldmVudCc7XG5pbXBvcnQgRHJvcGRvd25MaXN0LCB7TGlzdEl0ZW19IGZyb20gJy4vZHJvcGRvd24tbGlzdCc7XG5pbXBvcnQge1NlYXJjaH0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuXG5jb25zdCBERUZBVUxUX0NMQVNTID0gJ3R5cGVhaGVhZCc7XG4vKipcbiAqIENvcGllZCBtb3N0bHkgZnJvbSAncmVhY3QtdHlwZWFoZWFkJywgYW4gYXV0by1jb21wbGV0aW5nIHRleHQgaW5wdXRcbiAqXG4gKiBSZW5kZXJzIGFuIHRleHQgaW5wdXQgdGhhdCBzaG93cyBvcHRpb25zIG5lYXJieSB0aGF0IHlvdSBjYW4gdXNlIHRoZVxuICoga2V5Ym9hcmQgb3IgbW91c2UgdG8gc2VsZWN0LlxuICovXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGN1c3RvbUNsYXNzZXM6IFByb3BUeXBlcy5vYmplY3QsXG4gIG1heFZpc2libGU6IFByb3BUeXBlcy5udW1iZXIsXG4gIHJlc3VsdHNUcnVuY2F0ZWRNZXNzYWdlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBvcHRpb25zOiBQcm9wVHlwZXMuYXJyYXksXG4gIGZpeGVkT3B0aW9uczogUHJvcFR5cGVzLmFycmF5LFxuICBhbGxvd0N1c3RvbVZhbHVlczogUHJvcFR5cGVzLm51bWJlcixcbiAgaW5pdGlhbFZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB2YWx1ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgcGxhY2Vob2xkZXI6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGRpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgdGV4dGFyZWE6IFByb3BUeXBlcy5ib29sLFxuICBpbnB1dFByb3BzOiBQcm9wVHlwZXMub2JqZWN0LFxuICBvbk9wdGlvblNlbGVjdGVkOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBvbktleURvd246IFByb3BUeXBlcy5mdW5jLFxuICBvbktleVByZXNzOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25LZXlVcDogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uRm9jdXM6IFByb3BUeXBlcy5mdW5jLFxuICBvbkJsdXI6IFByb3BUeXBlcy5mdW5jLFxuICBmaWx0ZXJPcHRpb246IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5mdW5jXSksXG4gIHNlYXJjaE9wdGlvbnM6IFByb3BUeXBlcy5mdW5jLFxuICBkaXNwbGF5T3B0aW9uOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuc3RyaW5nLCBQcm9wVHlwZXMuZnVuY10pLFxuICBpbnB1dERpc3BsYXlPcHRpb246IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5mdW5jXSksXG4gIGZvcm1JbnB1dE9wdGlvbjogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLmZ1bmNdKSxcbiAgZGVmYXVsdENsYXNzTmFtZXM6IFByb3BUeXBlcy5ib29sLFxuICBjdXN0b21MaXN0Q29tcG9uZW50OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuZWxlbWVudCwgUHJvcFR5cGVzLmZ1bmNdKSxcbiAgY3VzdG9tTGlzdEl0ZW1Db21wb25lbnQ6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgIFByb3BUeXBlcy5lbGVtZW50LFxuICAgIFByb3BUeXBlcy5mdW5jXG4gIF0pLFxuICBjdXN0b21MaXN0SGVhZGVyQ29tcG9uZW50OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICBQcm9wVHlwZXMuZWxlbWVudCxcbiAgICBQcm9wVHlwZXMuZnVuY1xuICBdKSxcbiAgc2hvd09wdGlvbnNXaGVuRW1wdHk6IFByb3BUeXBlcy5ib29sLFxuICBzZWFyY2hhYmxlOiBQcm9wVHlwZXMuYm9vbFxufTtcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBvcHRpb25zOiBbXSxcbiAgY3VzdG9tQ2xhc3Nlczoge30sXG4gIGFsbG93Q3VzdG9tVmFsdWVzOiAwLFxuICBpbml0aWFsVmFsdWU6ICcnLFxuICB2YWx1ZTogJycsXG4gIHBsYWNlaG9sZGVyOiAnJyxcbiAgZGlzYWJsZWQ6IGZhbHNlLFxuICB0ZXh0YXJlYTogZmFsc2UsXG4gIGlucHV0UHJvcHM6IHt9LFxuICBvbk9wdGlvblNlbGVjdGVkKG9wdGlvbikge30sXG4gIG9uQ2hhbmdlKGV2ZW50KSB7fSxcbiAgb25LZXlEb3duKGV2ZW50KSB7fSxcbiAgb25LZXlQcmVzcyhldmVudCkge30sXG4gIG9uS2V5VXAoZXZlbnQpIHt9LFxuICBvbkZvY3VzKGV2ZW50KSB7fSxcbiAgb25CbHVyKGV2ZW50KSB7fSxcbiAgZmlsdGVyT3B0aW9uOiBudWxsLFxuICBzZWFyY2hPcHRpb25zOiBudWxsLFxuICBpbnB1dERpc3BsYXlPcHRpb246IG51bGwsXG4gIGRlZmF1bHRDbGFzc05hbWVzOiB0cnVlLFxuICBjdXN0b21MaXN0Q29tcG9uZW50OiBEcm9wZG93bkxpc3QsXG4gIGN1c3RvbUxpc3RJdGVtQ29tcG9uZW50OiBMaXN0SXRlbSxcbiAgY3VzdG9tTGlzdEhlYWRlckNvbXBvbmVudDogbnVsbCxcbiAgc2hvd09wdGlvbnNXaGVuRW1wdHk6IHRydWUsXG4gIHNlYXJjaGFibGU6IHRydWUsXG4gIHJlc3VsdHNUcnVuY2F0ZWRNZXNzYWdlOiBudWxsXG59O1xuXG5jb25zdCBUeXBlYWhlYWRXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RCZ2R9O1xuICBib3gtc2hhZG93OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdFNoYWRvd307XG5cbiAgOmZvY3VzIHtcbiAgICBvdXRsaW5lOiAwO1xuICB9XG5gO1xuXG5jb25zdCBJbnB1dEJveCA9IHN0eWxlZC5kaXZgXG4gIHBhZGRpbmc6IDhweDtcbmA7XG5cbmNvbnN0IFR5cGVhaGVhZElucHV0ID0gc3R5bGVkLmlucHV0YFxuICAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlY29uZGFyeUlucHV0fVxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlY29uZGFyeUlucHV0QmdkfTtcbiAgfVxuYDtcblxuY29uc3QgSW5wdXRJY29uID0gc3R5bGVkLmRpdmBcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICByaWdodDogMTVweDtcbiAgdG9wOiAxNHB4O1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dFBsYWNlaG9sZGVyQ29sb3J9O1xuYDtcblxuY2xhc3MgVHlwZWFoZWFkIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgc2VhcmNoUmVzdWx0czogdGhpcy5nZXRPcHRpb25zRm9yVmFsdWUoXG4gICAgICAgIHRoaXMucHJvcHMuaW5pdGlhbFZhbHVlLFxuICAgICAgICB0aGlzLnByb3BzLm9wdGlvbnNcbiAgICAgICksXG5cbiAgICAgIC8vIFRoaXMgc2hvdWxkIGJlIGNhbGxlZCBzb21ldGhpbmcgZWxzZSwgJ2VudHJ5VmFsdWUnXG4gICAgICBlbnRyeVZhbHVlOiB0aGlzLnByb3BzLnZhbHVlIHx8IHRoaXMucHJvcHMuaW5pdGlhbFZhbHVlLFxuXG4gICAgICAvLyBBIHZhbGlkIHR5cGVhaGVhZCB2YWx1ZVxuICAgICAgc2VsZWN0aW9uOiB0aGlzLnByb3BzLnZhbHVlLFxuXG4gICAgICAvLyBJbmRleCBvZiB0aGUgc2VsZWN0aW9uXG4gICAgICBzZWxlY3Rpb25JbmRleDogbnVsbCxcblxuICAgICAgLy8gS2VlcCB0cmFjayBvZiB0aGUgZm9jdXMgc3RhdGUgb2YgdGhlIGlucHV0IGVsZW1lbnQsIHRvIGRldGVybWluZVxuICAgICAgLy8gd2hldGhlciB0byBzaG93IG9wdGlvbnMgd2hlbiBlbXB0eSAoaWYgc2hvd09wdGlvbnNXaGVuRW1wdHkgaXMgdHJ1ZSlcbiAgICAgIGlzRm9jdXNlZDogZmFsc2VcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWFyY2hSZXN1bHRzOiB0aGlzLmdldE9wdGlvbnNGb3JWYWx1ZSgnJywgdGhpcy5wcm9wcy5vcHRpb25zKVxuICAgIH0pO1xuXG4gICAgLy8gY2FsbCBmb2N1cyBvbiBlbnRyeSBvciBkaXYgdG8gdHJpZ2dlciBrZXkgZXZlbnRzIGxpc3RlbmVyXG4gICAgaWYgKHRoaXMuZW50cnkpIHtcbiAgICAgIHRoaXMuZW50cnkuZm9jdXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yb290LmZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICBjb25zdCBzZWFyY2hSZXN1bHRzID0gdGhpcy5nZXRPcHRpb25zRm9yVmFsdWUoXG4gICAgICB0aGlzLnN0YXRlLmVudHJ5VmFsdWUsXG4gICAgICBuZXh0UHJvcHMub3B0aW9uc1xuICAgICk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtzZWFyY2hSZXN1bHRzfSk7XG4gIH1cblxuICBfc2hvdWxkU2tpcFNlYXJjaChpbnB1dCkge1xuICAgIGNvbnN0IGVtcHR5VmFsdWUgPSAhaW5wdXQgfHwgaW5wdXQudHJpbSgpLmxlbmd0aCA9PT0gMDtcblxuICAgIC8vIHRoaXMuc3RhdGUgbXVzdCBiZSBjaGVja2VkIGJlY2F1c2UgaXQgbWF5IG5vdCBiZSBkZWZpbmVkIHlldCBpZiB0aGlzIGZ1bmN0aW9uXG4gICAgLy8gaXMgY2FsbGVkIGZyb20gd2l0aGluIGdldEluaXRpYWxTdGF0ZVxuICAgIGNvbnN0IGlzRm9jdXNlZCA9IHRoaXMuc3RhdGUgJiYgdGhpcy5zdGF0ZS5pc0ZvY3VzZWQ7XG4gICAgcmV0dXJuICEodGhpcy5wcm9wcy5zaG93T3B0aW9uc1doZW5FbXB0eSAmJiBpc0ZvY3VzZWQpICYmIGVtcHR5VmFsdWU7XG4gIH1cblxuICBnZXRPcHRpb25zRm9yVmFsdWUodmFsdWUsIG9wdGlvbnMpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMuc2VhcmNoYWJsZSkge1xuICAgICAgLy8gZGlyZWN0bHkgcGFzcyB0aHJvdWdoIG9wdGlvbnMgaWYgY2FuIG5vdCBiZSBzZWFyY2hlZFxuICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgfVxuICAgIGlmICh0aGlzLl9zaG91bGRTa2lwU2VhcmNoKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VhcmNoT3B0aW9ucyA9IHRoaXMuX2dlbmVyYXRlU2VhcmNoRnVuY3Rpb24oKTtcbiAgICByZXR1cm4gc2VhcmNoT3B0aW9ucyh2YWx1ZSwgb3B0aW9ucyk7XG4gIH1cblxuICBmb2N1cygpIHtcbiAgICBpZiAodGhpcy5lbnRyeSkge1xuICAgICAgdGhpcy5lbnRyeS5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIF9oYXNDdXN0b21WYWx1ZSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5wcm9wcy5hbGxvd0N1c3RvbVZhbHVlcyA+IDAgJiZcbiAgICAgIHRoaXMuc3RhdGUuZW50cnlWYWx1ZS5sZW5ndGggPj0gdGhpcy5wcm9wcy5hbGxvd0N1c3RvbVZhbHVlcyAmJlxuICAgICAgdGhpcy5zdGF0ZS5zZWFyY2hSZXN1bHRzLmluZGV4T2YodGhpcy5zdGF0ZS5lbnRyeVZhbHVlKSA8IDBcbiAgICApO1xuICB9XG5cbiAgX2dldEN1c3RvbVZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl9oYXNDdXN0b21WYWx1ZSgpID8gdGhpcy5zdGF0ZS5lbnRyeVZhbHVlIDogbnVsbDtcbiAgfVxuXG4gIF9yZW5kZXJJbmNyZW1lbnRhbFNlYXJjaFJlc3VsdHMoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDx0aGlzLnByb3BzLmN1c3RvbUxpc3RDb21wb25lbnRcbiAgICAgICAgcmVmPVwic2VsXCJcbiAgICAgICAgZml4ZWRPcHRpb25zPXt0aGlzLnByb3BzLmZpeGVkT3B0aW9uc31cbiAgICAgICAgb3B0aW9ucz17XG4gICAgICAgICAgdGhpcy5wcm9wcy5tYXhWaXNpYmxlXG4gICAgICAgICAgICA/IHRoaXMuc3RhdGUuc2VhcmNoUmVzdWx0cy5zbGljZSgwLCB0aGlzLnByb3BzLm1heFZpc2libGUpXG4gICAgICAgICAgICA6IHRoaXMuc3RhdGUuc2VhcmNoUmVzdWx0c1xuICAgICAgICB9XG4gICAgICAgIGFyZVJlc3VsdHNUcnVuY2F0ZWQ9e1xuICAgICAgICAgIHRoaXMucHJvcHMubWF4VmlzaWJsZSAmJlxuICAgICAgICAgIHRoaXMuc3RhdGUuc2VhcmNoUmVzdWx0cy5sZW5ndGggPiB0aGlzLnByb3BzLm1heFZpc2libGVcbiAgICAgICAgfVxuICAgICAgICByZXN1bHRzVHJ1bmNhdGVkTWVzc2FnZT17dGhpcy5wcm9wcy5yZXN1bHRzVHJ1bmNhdGVkTWVzc2FnZX1cbiAgICAgICAgb25PcHRpb25TZWxlY3RlZD17dGhpcy5fb25PcHRpb25TZWxlY3RlZH1cbiAgICAgICAgYWxsb3dDdXN0b21WYWx1ZXM9e3RoaXMucHJvcHMuYWxsb3dDdXN0b21WYWx1ZXN9XG4gICAgICAgIGN1c3RvbVZhbHVlPXt0aGlzLl9nZXRDdXN0b21WYWx1ZSgpfVxuICAgICAgICBjdXN0b21DbGFzc2VzPXt0aGlzLnByb3BzLmN1c3RvbUNsYXNzZXN9XG4gICAgICAgIGN1c3RvbUxpc3RJdGVtQ29tcG9uZW50PXt0aGlzLnByb3BzLmN1c3RvbUxpc3RJdGVtQ29tcG9uZW50fVxuICAgICAgICBjdXN0b21MaXN0SGVhZGVyQ29tcG9uZW50PXt0aGlzLnByb3BzLmN1c3RvbUxpc3RIZWFkZXJDb21wb25lbnR9XG4gICAgICAgIHNlbGVjdGlvbkluZGV4PXt0aGlzLnN0YXRlLnNlbGVjdGlvbkluZGV4fVxuICAgICAgICBkZWZhdWx0Q2xhc3NOYW1lcz17dGhpcy5wcm9wcy5kZWZhdWx0Q2xhc3NOYW1lc31cbiAgICAgICAgZGlzcGxheU9wdGlvbj17dGhpcy5wcm9wcy5kaXNwbGF5T3B0aW9ufVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgZ2V0U2VsZWN0aW9uKCkge1xuICAgIGxldCBpbmRleCA9IHRoaXMuc3RhdGUuc2VsZWN0aW9uSW5kZXg7XG5cbiAgICBpZiAodGhpcy5faGFzQ3VzdG9tVmFsdWUoKSkge1xuICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlLmVudHJ5VmFsdWU7XG4gICAgICB9XG4gICAgICBpbmRleC0tO1xuICAgIH1cbiAgICBpZiAodGhpcy5faGFzRml4ZWRPcHRpb25zKCkpIHtcbiAgICAgIHJldHVybiBpbmRleCA8IHRoaXMucHJvcHMuZml4ZWRPcHRpb25zLmxlbmd0aFxuICAgICAgICA/IHRoaXMucHJvcHMuZml4ZWRPcHRpb25zW2luZGV4XVxuICAgICAgICA6IHRoaXMuc3RhdGUuc2VhcmNoUmVzdWx0c1tpbmRleCAtIHRoaXMucHJvcHMuZml4ZWRPcHRpb25zLmxlbmd0aF07XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN0YXRlLnNlYXJjaFJlc3VsdHNbaW5kZXhdO1xuICB9XG5cbiAgX29uT3B0aW9uU2VsZWN0ZWQgPSAob3B0aW9uLCBldmVudCkgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLnNlYXJjaGFibGUpIHtcbiAgICAgIC8vIHJlc2V0IGVudHJ5IGlucHV0XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgc2VhcmNoUmVzdWx0czogdGhpcy5nZXRPcHRpb25zRm9yVmFsdWUoJycsIHRoaXMucHJvcHMub3B0aW9ucyksXG4gICAgICAgIHNlbGVjdGlvbjogJycsXG4gICAgICAgIGVudHJ5VmFsdWU6ICcnXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5vbk9wdGlvblNlbGVjdGVkKG9wdGlvbiwgZXZlbnQpO1xuICB9O1xuXG4gIC8vIHVzZSAoKSA9PiB7fSB0byBhdm9pZCBiaW5kaW5nICd0aGlzJ1xuICBfb25UZXh0RW50cnlVcGRhdGVkID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLnNlYXJjaGFibGUpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5lbnRyeS52YWx1ZTtcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHNlYXJjaFJlc3VsdHM6IHRoaXMuZ2V0T3B0aW9uc0ZvclZhbHVlKHZhbHVlLCB0aGlzLnByb3BzLm9wdGlvbnMpLFxuICAgICAgICBzZWxlY3Rpb246ICcnLFxuICAgICAgICBlbnRyeVZhbHVlOiB2YWx1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIF9vbkVudGVyID0gZXZlbnQgPT4ge1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IHRoaXMuZ2V0U2VsZWN0aW9uKCk7XG4gICAgaWYgKCFzZWxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLm9uS2V5RG93bihldmVudCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9vbk9wdGlvblNlbGVjdGVkKHNlbGVjdGlvbiwgZXZlbnQpO1xuICB9O1xuXG4gIF9vbkVzY2FwZSgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGlvbkluZGV4OiBudWxsXG4gICAgfSk7XG4gIH1cblxuICBfb25UYWIoZXZlbnQpIHtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSB0aGlzLmdldFNlbGVjdGlvbigpO1xuICAgIGxldCBvcHRpb24gPSBzZWxlY3Rpb25cbiAgICAgID8gc2VsZWN0aW9uXG4gICAgICA6IHRoaXMuc3RhdGUuc2VhcmNoUmVzdWx0cy5sZW5ndGggPiAwXG4gICAgICAgID8gdGhpcy5zdGF0ZS5zZWFyY2hSZXN1bHRzWzBdXG4gICAgICAgIDogbnVsbDtcblxuICAgIGlmIChvcHRpb24gPT09IG51bGwgJiYgdGhpcy5faGFzQ3VzdG9tVmFsdWUoKSkge1xuICAgICAgb3B0aW9uID0gdGhpcy5fZ2V0Q3VzdG9tVmFsdWUoKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9uICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5fb25PcHRpb25TZWxlY3RlZChvcHRpb24sIGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICBldmVudE1hcChldmVudCkge1xuICAgIGNvbnN0IGV2ZW50cyA9IHt9O1xuXG4gICAgZXZlbnRzW0tleUV2ZW50LkRPTV9WS19VUF0gPSB0aGlzLm5hdlVwO1xuICAgIGV2ZW50c1tLZXlFdmVudC5ET01fVktfRE9XTl0gPSB0aGlzLm5hdkRvd247XG4gICAgZXZlbnRzW0tleUV2ZW50LkRPTV9WS19SRVRVUk5dID0gZXZlbnRzW1xuICAgICAgS2V5RXZlbnQuRE9NX1ZLX0VOVEVSXG4gICAgXSA9IHRoaXMuX29uRW50ZXI7XG4gICAgZXZlbnRzW0tleUV2ZW50LkRPTV9WS19FU0NBUEVdID0gdGhpcy5fb25Fc2NhcGU7XG4gICAgZXZlbnRzW0tleUV2ZW50LkRPTV9WS19UQUJdID0gdGhpcy5fb25UYWI7XG5cbiAgICByZXR1cm4gZXZlbnRzO1xuICB9XG5cbiAgX25hdihkZWx0YSkge1xuICAgIGlmICghdGhpcy5faGFzSGludCgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBuZXdJbmRleCA9XG4gICAgICB0aGlzLnN0YXRlLnNlbGVjdGlvbkluZGV4ID09PSBudWxsXG4gICAgICAgID8gZGVsdGEgPT09IDEgPyAwIDogZGVsdGFcbiAgICAgICAgOiB0aGlzLnN0YXRlLnNlbGVjdGlvbkluZGV4ICsgZGVsdGE7XG4gICAgbGV0IGxlbmd0aCA9IHRoaXMucHJvcHMubWF4VmlzaWJsZVxuICAgICAgPyB0aGlzLnN0YXRlLnNlYXJjaFJlc3VsdHMuc2xpY2UoMCwgdGhpcy5wcm9wcy5tYXhWaXNpYmxlKS5sZW5ndGhcbiAgICAgIDogdGhpcy5zdGF0ZS5zZWFyY2hSZXN1bHRzLmxlbmd0aDtcbiAgICBpZiAodGhpcy5faGFzQ3VzdG9tVmFsdWUoKSkge1xuICAgICAgbGVuZ3RoICs9IDE7XG4gICAgfVxuXG4gICAgaWYgKG5ld0luZGV4IDwgMCkge1xuICAgICAgbmV3SW5kZXggKz0gbGVuZ3RoO1xuICAgIH0gZWxzZSBpZiAobmV3SW5kZXggPj0gbGVuZ3RoKSB7XG4gICAgICBuZXdJbmRleCAtPSBsZW5ndGg7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7c2VsZWN0aW9uSW5kZXg6IG5ld0luZGV4fSk7XG4gIH1cblxuICBuYXZEb3duID0gKCkgPT4ge1xuICAgIHRoaXMuX25hdigxKTtcbiAgfTtcblxuICBuYXZVcCA9ICgpID0+IHtcbiAgICB0aGlzLl9uYXYoLTEpO1xuICB9O1xuXG4gIF9vbkNoYW5nZSA9IGV2ZW50ID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5vbkNoYW5nZSkge1xuICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZShldmVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5fb25UZXh0RW50cnlVcGRhdGVkKCk7XG4gIH07XG5cbiAgX29uS2V5RG93biA9IGV2ZW50ID0+IHtcbiAgICAvLyBJZiB0aGVyZSBhcmUgbm8gdmlzaWJsZSBlbGVtZW50cywgZG9uJ3QgcGVyZm9ybSBzZWxlY3RvciBuYXZpZ2F0aW9uLlxuICAgIC8vIEp1c3QgcGFzcyB0aGlzIHVwIHRvIHRoZSB1cHN0cmVhbSBvbktleWRvd24gaGFuZGxlci5cbiAgICAvLyBBbHNvIHNraXAgaWYgdGhlIHVzZXIgaXMgcHJlc3NpbmcgdGhlIHNoaWZ0IGtleSwgc2luY2Ugbm9uZSBvZiBvdXIgaGFuZGxlcnMgYXJlIGxvb2tpbmcgZm9yIHNoaWZ0XG4gICAgaWYgKCF0aGlzLl9oYXNIaW50KCkgfHwgZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLm9uS2V5RG93bihldmVudCk7XG4gICAgfVxuXG4gICAgY29uc3QgaGFuZGxlciA9IHRoaXMuZXZlbnRNYXAoKVtldmVudC5rZXlDb2RlXTtcblxuICAgIGlmIChoYW5kbGVyKSB7XG4gICAgICBoYW5kbGVyKGV2ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMub25LZXlEb3duKGV2ZW50KTtcbiAgICB9XG4gICAgLy8gRG9uJ3QgcHJvcGFnYXRlIHRoZSBrZXlzdHJva2UgYmFjayB0byB0aGUgRE9NL2Jyb3dzZXJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9O1xuXG4gIF9vbkZvY3VzID0gZXZlbnQgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe2lzRm9jdXNlZDogdHJ1ZX0pO1xuICAgIGlmICh0aGlzLnByb3BzLm9uRm9jdXMpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLm9uRm9jdXMoZXZlbnQpO1xuICAgIH1cbiAgfTtcblxuICBfb25CbHVyID0gZXZlbnQgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe2lzRm9jdXNlZDogZmFsc2V9KTtcbiAgICBpZiAodGhpcy5wcm9wcy5vbkJsdXIpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLm9uQmx1cihldmVudCk7XG4gICAgfVxuICB9O1xuXG4gIF9yZW5kZXJIaWRkZW5JbnB1dCgpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMubmFtZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxpbnB1dFxuICAgICAgICB0eXBlPVwiaGlkZGVuXCJcbiAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5zZWxlY3Rpb259XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBfZ2VuZXJhdGVTZWFyY2hGdW5jdGlvbigpIHtcbiAgICBjb25zdCBzZWFyY2hPcHRpb25zUHJvcCA9IHRoaXMucHJvcHMuc2VhcmNoT3B0aW9ucztcbiAgICBjb25zdCBmaWx0ZXJPcHRpb25Qcm9wID0gdGhpcy5wcm9wcy5maWx0ZXJPcHRpb247XG4gICAgaWYgKHR5cGVvZiBzZWFyY2hPcHRpb25zUHJvcCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaWYgKGZpbHRlck9wdGlvblByb3AgIT09IG51bGwpIHtcbiAgICAgICAgQ29uc29sZS53YXJuKFxuICAgICAgICAgICdzZWFyY2hPcHRpb25zIHByb3AgaXMgYmVpbmcgdXNlZCwgZmlsdGVyT3B0aW9uIHByb3Agd2lsbCBiZSBpZ25vcmVkJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlYXJjaE9wdGlvbnNQcm9wO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGZpbHRlck9wdGlvblByb3AgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIHVzZSBjdXN0b20gZmlsdGVyIG9wdGlvblxuICAgICAgcmV0dXJuICh2YWx1ZSwgb3B0aW9ucykgPT5cbiAgICAgICAgb3B0aW9ucy5maWx0ZXIobyA9PiBmaWx0ZXJPcHRpb25Qcm9wKHZhbHVlLCBvKSk7XG4gICAgfVxuXG4gICAgY29uc3QgbWFwcGVyID1cbiAgICAgIHR5cGVvZiBmaWx0ZXJPcHRpb25Qcm9wID09PSAnc3RyaW5nJ1xuICAgICAgICA/IEFjY2Vzc29yLmdlbmVyYXRlQWNjZXNzb3IoZmlsdGVyT3B0aW9uUHJvcClcbiAgICAgICAgOiBBY2Nlc3Nvci5JREVOVElUWV9GTjtcblxuICAgIHJldHVybiAodmFsdWUsIG9wdGlvbnMpID0+XG4gICAgICBmdXp6eVxuICAgICAgICAuZmlsdGVyKHZhbHVlLCBvcHRpb25zLCB7ZXh0cmFjdDogbWFwcGVyfSlcbiAgICAgICAgLm1hcChyZXMgPT4gb3B0aW9uc1tyZXMuaW5kZXhdKTtcbiAgfVxuXG4gIF9oYXNIaW50KCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLnNlYXJjaFJlc3VsdHMubGVuZ3RoID4gMCB8fCB0aGlzLl9oYXNDdXN0b21WYWx1ZSgpO1xuICB9XG5cbiAgX2hhc0ZpeGVkT3B0aW9ucygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgQXJyYXkuaXNBcnJheSh0aGlzLnByb3BzLmZpeGVkT3B0aW9ucykgJiYgdGhpcy5wcm9wcy5maXhlZE9wdGlvbnMubGVuZ3RoXG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBpbnB1dENsYXNzZXMgPSB7fTtcbiAgICBpbnB1dENsYXNzZXNbdGhpcy5wcm9wcy5jdXN0b21DbGFzc2VzLmlucHV0XSA9IEJvb2xlYW4oXG4gICAgICB0aGlzLnByb3BzLmN1c3RvbUNsYXNzZXMuaW5wdXRcbiAgICApO1xuICAgIGNvbnN0IGlucHV0Q2xhc3NMaXN0ID0gY2xhc3NOYW1lcyhpbnB1dENsYXNzZXMpO1xuXG4gICAgY29uc3QgY2xhc3NlcyA9IHtcbiAgICAgIFtERUZBVUxUX0NMQVNTXTogdGhpcy5wcm9wcy5kZWZhdWx0Q2xhc3NOYW1lc1xuICAgIH07XG4gICAgY2xhc3Nlc1t0aGlzLnByb3BzLmNsYXNzTmFtZV0gPSBCb29sZWFuKHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcbiAgICBjb25zdCBjbGFzc0xpc3QgPSBjbGFzc05hbWVzKGNsYXNzZXMpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxUeXBlYWhlYWRXcmFwcGVyXG4gICAgICAgIGNsYXNzTmFtZT17Y2xhc3NMaXN0fVxuICAgICAgICBpbm5lclJlZj17Y29tcCA9PiB7XG4gICAgICAgICAgdGhpcy5yb290ID0gY29tcDtcbiAgICAgICAgfX1cbiAgICAgICAgdGFiSW5kZXg9XCIwXCJcbiAgICAgICAgb25LZXlEb3duPXt0aGlzLl9vbktleURvd259XG4gICAgICAgIG9uS2V5UHJlc3M9e3RoaXMucHJvcHMub25LZXlQcmVzc31cbiAgICAgICAgb25LZXlVcD17dGhpcy5wcm9wcy5vbktleVVwfVxuICAgICAgICBvbkZvY3VzPXt0aGlzLl9vbkZvY3VzfVxuICAgICAgPlxuICAgICAgICB7dGhpcy5fcmVuZGVySGlkZGVuSW5wdXQoKX1cbiAgICAgICAge3RoaXMucHJvcHMuc2VhcmNoYWJsZSA/IChcbiAgICAgICAgPElucHV0Qm94PlxuICAgICAgICAgIDxUeXBlYWhlYWRJbnB1dFxuICAgICAgICAgICAgaW5uZXJSZWY9e2NvbXAgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmVudHJ5ID0gY29tcDtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICBkaXNhYmxlZD17dGhpcy5wcm9wcy5kaXNhYmxlZH1cbiAgICAgICAgICAgIHsuLi50aGlzLnByb3BzLmlucHV0UHJvcHN9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj17dGhpcy5wcm9wcy5wbGFjZWhvbGRlcn1cbiAgICAgICAgICAgIGNsYXNzTmFtZT17aW5wdXRDbGFzc0xpc3R9XG4gICAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5lbnRyeVZhbHVlfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuX29uQ2hhbmdlfVxuICAgICAgICAgICAgb25CbHVyPXt0aGlzLl9vbkJsdXJ9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8SW5wdXRJY29uPlxuICAgICAgICAgICAgPFNlYXJjaCBoZWlnaHQ9XCIxOHB4XCIvPlxuICAgICAgICAgIDwvSW5wdXRJY29uPlxuICAgICAgICA8L0lucHV0Qm94PlxuICAgICAgICApIDogbnVsbH1cbiAgICAgICAge3RoaXMuX3JlbmRlckluY3JlbWVudGFsU2VhcmNoUmVzdWx0cygpfVxuICAgICAgPC9UeXBlYWhlYWRXcmFwcGVyPlxuICAgICk7XG4gIH1cbn1cblxuVHlwZWFoZWFkLnByb3BUeXBlcyA9IHByb3BUeXBlcztcblR5cGVhaGVhZC5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG5cbmV4cG9ydCBkZWZhdWx0IFR5cGVhaGVhZDtcbiJdfQ==