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

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  flex-direction: column;\n\n  :focus {\n    outline: 0;\n  }\n'], ['\n  display: flex;\n  flex-direction: column;\n\n  :focus {\n    outline: 0;\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  ', ' flex-grow: 1;\n  background-color: ', ';\n  margin: 8px;\n  width: auto;\n'], ['\n  ', ' flex-grow: 1;\n  background-color: ', ';\n  margin: 8px;\n  width: auto;\n']);

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

  return Typeahead;
}(_react.Component);

Typeahead.propTypes = propTypes;
Typeahead.defaultProps = defaultProps;

exports.default = Typeahead;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL3R5cGVhaGVhZC5qcyJdLCJuYW1lcyI6WyJERUZBVUxUX0NMQVNTIiwicHJvcFR5cGVzIiwibmFtZSIsInN0cmluZyIsImN1c3RvbUNsYXNzZXMiLCJvYmplY3QiLCJtYXhWaXNpYmxlIiwibnVtYmVyIiwicmVzdWx0c1RydW5jYXRlZE1lc3NhZ2UiLCJvcHRpb25zIiwiYXJyYXkiLCJmaXhlZE9wdGlvbnMiLCJhbGxvd0N1c3RvbVZhbHVlcyIsImluaXRpYWxWYWx1ZSIsInZhbHVlIiwicGxhY2Vob2xkZXIiLCJkaXNhYmxlZCIsImJvb2wiLCJ0ZXh0YXJlYSIsImlucHV0UHJvcHMiLCJvbk9wdGlvblNlbGVjdGVkIiwiZnVuYyIsIm9uQ2hhbmdlIiwib25LZXlEb3duIiwib25LZXlQcmVzcyIsIm9uS2V5VXAiLCJvbkZvY3VzIiwib25CbHVyIiwiZmlsdGVyT3B0aW9uIiwib25lT2ZUeXBlIiwic2VhcmNoT3B0aW9ucyIsImRpc3BsYXlPcHRpb24iLCJpbnB1dERpc3BsYXlPcHRpb24iLCJmb3JtSW5wdXRPcHRpb24iLCJkZWZhdWx0Q2xhc3NOYW1lcyIsImN1c3RvbUxpc3RDb21wb25lbnQiLCJlbGVtZW50IiwiY3VzdG9tTGlzdEl0ZW1Db21wb25lbnQiLCJjdXN0b21MaXN0SGVhZGVyQ29tcG9uZW50Iiwic2hvd09wdGlvbnNXaGVuRW1wdHkiLCJzZWFyY2hhYmxlIiwiZGVmYXVsdFByb3BzIiwib3B0aW9uIiwiZXZlbnQiLCJUeXBlYWhlYWRXcmFwcGVyIiwiZGl2IiwiVHlwZWFoZWFkSW5wdXQiLCJpbnB1dCIsInByb3BzIiwidGhlbWUiLCJzZWxlY3RCYWNrZ3JvdW5kSG92ZXIiLCJUeXBlYWhlYWQiLCJfb25PcHRpb25TZWxlY3RlZCIsInNldFN0YXRlIiwic2VhcmNoUmVzdWx0cyIsImdldE9wdGlvbnNGb3JWYWx1ZSIsInNlbGVjdGlvbiIsImVudHJ5VmFsdWUiLCJfb25UZXh0RW50cnlVcGRhdGVkIiwiZW50cnkiLCJfb25FbnRlciIsImdldFNlbGVjdGlvbiIsIm5hdkRvd24iLCJfbmF2IiwibmF2VXAiLCJfb25DaGFuZ2UiLCJfb25LZXlEb3duIiwiX2hhc0hpbnQiLCJzaGlmdEtleSIsImhhbmRsZXIiLCJldmVudE1hcCIsImtleUNvZGUiLCJwcmV2ZW50RGVmYXVsdCIsIl9vbkZvY3VzIiwiaXNGb2N1c2VkIiwiX29uQmx1ciIsInN0YXRlIiwic2VsZWN0aW9uSW5kZXgiLCJjb21wb25lbnREaWRNb3VudCIsImZvY3VzIiwicm9vdCIsImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMiLCJuZXh0UHJvcHMiLCJfc2hvdWxkU2tpcFNlYXJjaCIsImVtcHR5VmFsdWUiLCJ0cmltIiwibGVuZ3RoIiwiX2dlbmVyYXRlU2VhcmNoRnVuY3Rpb24iLCJfaGFzQ3VzdG9tVmFsdWUiLCJpbmRleE9mIiwiX2dldEN1c3RvbVZhbHVlIiwiX3JlbmRlckluY3JlbWVudGFsU2VhcmNoUmVzdWx0cyIsInNsaWNlIiwiaW5kZXgiLCJfaGFzRml4ZWRPcHRpb25zIiwiX29uRXNjYXBlIiwiX29uVGFiIiwiZXZlbnRzIiwiRE9NX1ZLX1VQIiwiRE9NX1ZLX0RPV04iLCJET01fVktfUkVUVVJOIiwiRE9NX1ZLX0VOVEVSIiwiRE9NX1ZLX0VTQ0FQRSIsIkRPTV9WS19UQUIiLCJkZWx0YSIsIm5ld0luZGV4IiwiX3JlbmRlckhpZGRlbklucHV0Iiwic2VhcmNoT3B0aW9uc1Byb3AiLCJmaWx0ZXJPcHRpb25Qcm9wIiwid2FybiIsImZpbHRlciIsIm8iLCJtYXBwZXIiLCJnZW5lcmF0ZUFjY2Vzc29yIiwiSURFTlRJVFlfRk4iLCJleHRyYWN0IiwibWFwIiwicmVzIiwiQXJyYXkiLCJpc0FycmF5IiwicmVuZGVyIiwiaW5wdXRDbGFzc2VzIiwiQm9vbGVhbiIsImlucHV0Q2xhc3NMaXN0IiwiY2xhc3NlcyIsImNsYXNzTmFtZSIsImNsYXNzTGlzdCIsImNvbXAiXSwibWFwcGlu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aEIsaUJBQUs5QyxJQUFMLEdBQVkrQyxJQUFaO0FBQ0QsU0FKSDtBQUtFLGtCQUFTLEdBTFg7QUFNRSxtQkFBVyxLQUFLN0QsVUFObEI7QUFPRSxvQkFBWSxLQUFLbEIsS0FBTCxDQUFXeEIsVUFQekI7QUFRRSxpQkFBUyxLQUFLd0IsS0FBTCxDQUFXdkIsT0FSdEI7QUFTRSxpQkFBUyxLQUFLZ0Q7QUFUaEI7QUFXRyxXQUFLaUMsa0JBQUwsRUFYSDtBQVlHLFdBQUsxRCxLQUFMLENBQVdSLFVBQVgsR0FDQyw4QkFBQyxjQUFEO0FBQ0Usa0JBQVUsd0JBQVE7QUFDaEIsaUJBQUttQixLQUFMLEdBQWFvRSxJQUFiO0FBQ0QsU0FISDtBQUlFLGNBQUssTUFKUDtBQUtFLGtCQUFVLEtBQUsvRSxLQUFMLENBQVdoQztBQUx2QixTQU1NLEtBQUtnQyxLQUFMLENBQVc3QixVQU5qQjtBQU9FLHFCQUFhLEtBQUs2QixLQUFMLENBQVdqQyxXQVAxQjtBQVFFLG1CQUFXNEcsY0FSYjtBQVNFLGVBQU8sS0FBSy9DLEtBQUwsQ0FBV25CLFVBVHBCO0FBVUUsa0JBQVUsS0FBS1EsU0FWakI7QUFXRSxnQkFBUSxLQUFLVTtBQVhmLFNBREQsR0FjRyxJQTFCTjtBQTJCRyxXQUFLZ0IsK0JBQUw7QUEzQkgsS0FERjtBQStCRCxHOzs7OztBQUdIeEMsVUFBVWxELFNBQVYsR0FBc0JBLFNBQXRCO0FBQ0FrRCxVQUFVVixZQUFWLEdBQXlCQSxZQUF6Qjs7a0JBRWVVLFMiLCJmaWxlIjoidHlwZWFoZWFkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGZ1enp5IGZyb20gJ2Z1enp5JztcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge2NvbnNvbGUgYXMgQ29uc29sZX0gZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5cbmltcG9ydCBBY2Nlc3NvciBmcm9tICcuL2FjY2Vzc29yJztcbmltcG9ydCBLZXlFdmVudCBmcm9tICcuL2tleWV2ZW50JztcbmltcG9ydCBEcm9wZG93bkxpc3QsIHtMaXN0SXRlbX0gZnJvbSAnLi9kcm9wZG93bi1saXN0JztcblxuY29uc3QgREVGQVVMVF9DTEFTUyA9ICd0eXBlYWhlYWQnO1xuLyoqXG4gKiBDb3BpZWQgbW9zdGx5IGZyb20gJ3JlYWN0LXR5cGVhaGVhZCcsIGFuIGF1dG8tY29tcGxldGluZyB0ZXh0IGlucHV0XG4gKlxuICogUmVuZGVycyBhbiB0ZXh0IGlucHV0IHRoYXQgc2hvd3Mgb3B0aW9ucyBuZWFyYnkgdGhhdCB5b3UgY2FuIHVzZSB0aGVcbiAqIGtleWJvYXJkIG9yIG1vdXNlIHRvIHNlbGVjdC5cbiAqL1xuY29uc3QgcHJvcFR5cGVzID0ge1xuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjdXN0b21DbGFzc2VzOiBQcm9wVHlwZXMub2JqZWN0LFxuICBtYXhWaXNpYmxlOiBQcm9wVHlwZXMubnVtYmVyLFxuICByZXN1bHRzVHJ1bmNhdGVkTWVzc2FnZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgb3B0aW9uczogUHJvcFR5cGVzLmFycmF5LFxuICBmaXhlZE9wdGlvbnM6IFByb3BUeXBlcy5hcnJheSxcbiAgYWxsb3dDdXN0b21WYWx1ZXM6IFByb3BUeXBlcy5udW1iZXIsXG4gIGluaXRpYWxWYWx1ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgdmFsdWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHBsYWNlaG9sZGVyOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gIHRleHRhcmVhOiBQcm9wVHlwZXMuYm9vbCxcbiAgaW5wdXRQcm9wczogUHJvcFR5cGVzLm9iamVjdCxcbiAgb25PcHRpb25TZWxlY3RlZDogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25LZXlEb3duOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25LZXlQcmVzczogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uS2V5VXA6IFByb3BUeXBlcy5mdW5jLFxuICBvbkZvY3VzOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25CbHVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgZmlsdGVyT3B0aW9uOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuc3RyaW5nLCBQcm9wVHlwZXMuZnVuY10pLFxuICBzZWFyY2hPcHRpb25zOiBQcm9wVHlwZXMuZnVuYyxcbiAgZGlzcGxheU9wdGlvbjogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLmZ1bmNdKSxcbiAgaW5wdXREaXNwbGF5T3B0aW9uOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuc3RyaW5nLCBQcm9wVHlwZXMuZnVuY10pLFxuICBmb3JtSW5wdXRPcHRpb246IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5mdW5jXSksXG4gIGRlZmF1bHRDbGFzc05hbWVzOiBQcm9wVHlwZXMuYm9vbCxcbiAgY3VzdG9tTGlzdENvbXBvbmVudDogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLmVsZW1lbnQsIFByb3BUeXBlcy5mdW5jXSksXG4gIGN1c3RvbUxpc3RJdGVtQ29tcG9uZW50OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICBQcm9wVHlwZXMuZWxlbWVudCxcbiAgICBQcm9wVHlwZXMuZnVuY1xuICBdKSxcbiAgY3VzdG9tTGlzdEhlYWRlckNvbXBvbmVudDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgUHJvcFR5cGVzLmVsZW1lbnQsXG4gICAgUHJvcFR5cGVzLmZ1bmNcbiAgXSksXG4gIHNob3dPcHRpb25zV2hlbkVtcHR5OiBQcm9wVHlwZXMuYm9vbCxcbiAgc2VhcmNoYWJsZTogUHJvcFR5cGVzLmJvb2xcbn07XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgb3B0aW9uczogW10sXG4gIGN1c3RvbUNsYXNzZXM6IHt9LFxuICBhbGxvd0N1c3RvbVZhbHVlczogMCxcbiAgaW5pdGlhbFZhbHVlOiAnJyxcbiAgdmFsdWU6ICcnLFxuICBwbGFjZWhvbGRlcjogJycsXG4gIGRpc2FibGVkOiBmYWxzZSxcbiAgdGV4dGFyZWE6IGZhbHNlLFxuICBpbnB1dFByb3BzOiB7fSxcbiAgb25PcHRpb25TZWxlY3RlZChvcHRpb24pIHt9LFxuICBvbkNoYW5nZShldmVudCkge30sXG4gIG9uS2V5RG93bihldmVudCkge30sXG4gIG9uS2V5UHJlc3MoZXZlbnQpIHt9LFxuICBvbktleVVwKGV2ZW50KSB7fSxcbiAgb25Gb2N1cyhldmVudCkge30sXG4gIG9uQmx1cihldmVudCkge30sXG4gIGZpbHRlck9wdGlvbjogbnVsbCxcbiAgc2VhcmNoT3B0aW9uczogbnVsbCxcbiAgaW5wdXREaXNwbGF5T3B0aW9uOiBudWxsLFxuICBkZWZhdWx0Q2xhc3NOYW1lczogdHJ1ZSxcbiAgY3VzdG9tTGlzdENvbXBvbmVudDogRHJvcGRvd25MaXN0LFxuICBjdXN0b21MaXN0SXRlbUNvbXBvbmVudDogTGlzdEl0ZW0sXG4gIGN1c3RvbUxpc3RIZWFkZXJDb21wb25lbnQ6IG51bGwsXG4gIHNob3dPcHRpb25zV2hlbkVtcHR5OiB0cnVlLFxuICBzZWFyY2hhYmxlOiB0cnVlLFxuICByZXN1bHRzVHJ1bmNhdGVkTWVzc2FnZTogbnVsbFxufTtcblxuY29uc3QgVHlwZWFoZWFkV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG5cbiAgOmZvY3VzIHtcbiAgICBvdXRsaW5lOiAwO1xuICB9XG5gO1xuXG5jb25zdCBUeXBlYWhlYWRJbnB1dCA9IHN0eWxlZC5pbnB1dGBcbiAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dH0gZmxleC1ncm93OiAxO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlbGVjdEJhY2tncm91bmRIb3Zlcn07XG4gIG1hcmdpbjogOHB4O1xuICB3aWR0aDogYXV0bztcbmA7XG5cbmNsYXNzIFR5cGVhaGVhZCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHNlYXJjaFJlc3VsdHM6IHRoaXMuZ2V0T3B0aW9uc0ZvclZhbHVlKFxuICAgICAgICB0aGlzLnByb3BzLmluaXRpYWxWYWx1ZSxcbiAgICAgICAgdGhpcy5wcm9wcy5vcHRpb25zXG4gICAgICApLFxuXG4gICAgICAvLyBUaGlzIHNob3VsZCBiZSBjYWxsZWQgc29tZXRoaW5nIGVsc2UsICdlbnRyeVZhbHVlJ1xuICAgICAgZW50cnlWYWx1ZTogdGhpcy5wcm9wcy52YWx1ZSB8fCB0aGlzLnByb3BzLmluaXRpYWxWYWx1ZSxcblxuICAgICAgLy8gQSB2YWxpZCB0eXBlYWhlYWQgdmFsdWVcbiAgICAgIHNlbGVjdGlvbjogdGhpcy5wcm9wcy52YWx1ZSxcblxuICAgICAgLy8gSW5kZXggb2YgdGhlIHNlbGVjdGlvblxuICAgICAgc2VsZWN0aW9uSW5kZXg6IG51bGwsXG5cbiAgICAgIC8vIEtlZXAgdHJhY2sgb2YgdGhlIGZvY3VzIHN0YXRlIG9mIHRoZSBpbnB1dCBlbGVtZW50LCB0byBkZXRlcm1pbmVcbiAgICAgIC8vIHdoZXRoZXIgdG8gc2hvdyBvcHRpb25zIHdoZW4gZW1wdHkgKGlmIHNob3dPcHRpb25zV2hlbkVtcHR5IGlzIHRydWUpXG4gICAgICBpc0ZvY3VzZWQ6IGZhbHNlXG4gICAgfTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VhcmNoUmVzdWx0czogdGhpcy5nZXRPcHRpb25zRm9yVmFsdWUoJycsIHRoaXMucHJvcHMub3B0aW9ucylcbiAgICB9KTtcblxuICAgIC8vIGNhbGwgZm9jdXMgb24gZW50cnkgb3IgZGl2IHRvIHRyaWdnZXIga2V5IGV2ZW50cyBsaXN0ZW5lclxuICAgIGlmICh0aGlzLmVudHJ5KSB7XG4gICAgICB0aGlzLmVudHJ5LmZvY3VzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucm9vdC5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgY29uc3Qgc2VhcmNoUmVzdWx0cyA9IHRoaXMuZ2V0T3B0aW9uc0ZvclZhbHVlKFxuICAgICAgdGhpcy5zdGF0ZS5lbnRyeVZhbHVlLFxuICAgICAgbmV4dFByb3BzLm9wdGlvbnNcbiAgICApO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7c2VhcmNoUmVzdWx0c30pO1xuICB9XG5cbiAgX3Nob3VsZFNraXBTZWFyY2goaW5wdXQpIHtcbiAgICBjb25zdCBlbXB0eVZhbHVlID0gIWlucHV0IHx8IGlucHV0LnRyaW0oKS5sZW5ndGggPT09IDA7XG5cbiAgICAvLyB0aGlzLnN0YXRlIG11c3QgYmUgY2hlY2tlZCBiZWNhdXNlIGl0IG1heSBub3QgYmUgZGVmaW5lZCB5ZXQgaWYgdGhpcyBmdW5jdGlvblxuICAgIC8vIGlzIGNhbGxlZCBmcm9tIHdpdGhpbiBnZXRJbml0aWFsU3RhdGVcbiAgICBjb25zdCBpc0ZvY3VzZWQgPSB0aGlzLnN0YXRlICYmIHRoaXMuc3RhdGUuaXNGb2N1c2VkO1xuICAgIHJldHVybiAhKHRoaXMucHJvcHMuc2hvd09wdGlvbnNXaGVuRW1wdHkgJiYgaXNGb2N1c2VkKSAmJiBlbXB0eVZhbHVlO1xuICB9XG5cbiAgZ2V0T3B0aW9uc0ZvclZhbHVlKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLnNlYXJjaGFibGUpIHtcbiAgICAgIC8vIGRpcmVjdGx5IHBhc3MgdGhyb3VnaCBvcHRpb25zIGlmIGNhbiBub3QgYmUgc2VhcmNoZWRcbiAgICAgIHJldHVybiBvcHRpb25zO1xuICAgIH1cbiAgICBpZiAodGhpcy5fc2hvdWxkU2tpcFNlYXJjaCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBvcHRpb25zO1xuICAgIH1cblxuICAgIGNvbnN0IHNlYXJjaE9wdGlvbnMgPSB0aGlzLl9nZW5lcmF0ZVNlYXJjaEZ1bmN0aW9uKCk7XG4gICAgcmV0dXJuIHNlYXJjaE9wdGlvbnModmFsdWUsIG9wdGlvbnMpO1xuICB9XG5cbiAgZm9jdXMoKSB7XG4gICAgaWYgKHRoaXMuZW50cnkpIHtcbiAgICAgIHRoaXMuZW50cnkuZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICBfaGFzQ3VzdG9tVmFsdWUoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMucHJvcHMuYWxsb3dDdXN0b21WYWx1ZXMgPiAwICYmXG4gICAgICB0aGlzLnN0YXRlLmVudHJ5VmFsdWUubGVuZ3RoID49IHRoaXMucHJvcHMuYWxsb3dDdXN0b21WYWx1ZXMgJiZcbiAgICAgIHRoaXMuc3RhdGUuc2VhcmNoUmVzdWx0cy5pbmRleE9mKHRoaXMuc3RhdGUuZW50cnlWYWx1ZSkgPCAwXG4gICAgKTtcbiAgfVxuXG4gIF9nZXRDdXN0b21WYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5faGFzQ3VzdG9tVmFsdWUoKSA/IHRoaXMuc3RhdGUuZW50cnlWYWx1ZSA6IG51bGw7XG4gIH1cblxuICBfcmVuZGVySW5jcmVtZW50YWxTZWFyY2hSZXN1bHRzKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8dGhpcy5wcm9wcy5jdXN0b21MaXN0Q29tcG9uZW50XG4gICAgICAgIHJlZj1cInNlbFwiXG4gICAgICAgIGZpeGVkT3B0aW9ucz17dGhpcy5wcm9wcy5maXhlZE9wdGlvbnN9XG4gICAgICAgIG9wdGlvbnM9e1xuICAgICAgICAgIHRoaXMucHJvcHMubWF4VmlzaWJsZVxuICAgICAgICAgICAgPyB0aGlzLnN0YXRlLnNlYXJjaFJlc3VsdHMuc2xpY2UoMCwgdGhpcy5wcm9wcy5tYXhWaXNpYmxlKVxuICAgICAgICAgICAgOiB0aGlzLnN0YXRlLnNlYXJjaFJlc3VsdHNcbiAgICAgICAgfVxuICAgICAgICBhcmVSZXN1bHRzVHJ1bmNhdGVkPXtcbiAgICAgICAgICB0aGlzLnByb3BzLm1heFZpc2libGUgJiZcbiAgICAgICAgICB0aGlzLnN0YXRlLnNlYXJjaFJlc3VsdHMubGVuZ3RoID4gdGhpcy5wcm9wcy5tYXhWaXNpYmxlXG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0c1RydW5jYXRlZE1lc3NhZ2U9e3RoaXMucHJvcHMucmVzdWx0c1RydW5jYXRlZE1lc3NhZ2V9XG4gICAgICAgIG9uT3B0aW9uU2VsZWN0ZWQ9e3RoaXMuX29uT3B0aW9uU2VsZWN0ZWR9XG4gICAgICAgIGFsbG93Q3VzdG9tVmFsdWVzPXt0aGlzLnByb3BzLmFsbG93Q3VzdG9tVmFsdWVzfVxuICAgICAgICBjdXN0b21WYWx1ZT17dGhpcy5fZ2V0Q3VzdG9tVmFsdWUoKX1cbiAgICAgICAgY3VzdG9tQ2xhc3Nlcz17dGhpcy5wcm9wcy5jdXN0b21DbGFzc2VzfVxuICAgICAgICBjdXN0b21MaXN0SXRlbUNvbXBvbmVudD17dGhpcy5wcm9wcy5jdXN0b21MaXN0SXRlbUNvbXBvbmVudH1cbiAgICAgICAgY3VzdG9tTGlzdEhlYWRlckNvbXBvbmVudD17dGhpcy5wcm9wcy5jdXN0b21MaXN0SGVhZGVyQ29tcG9uZW50fVxuICAgICAgICBzZWxlY3Rpb25JbmRleD17dGhpcy5zdGF0ZS5zZWxlY3Rpb25JbmRleH1cbiAgICAgICAgZGVmYXVsdENsYXNzTmFtZXM9e3RoaXMucHJvcHMuZGVmYXVsdENsYXNzTmFtZXN9XG4gICAgICAgIGRpc3BsYXlPcHRpb249e3RoaXMucHJvcHMuZGlzcGxheU9wdGlvbn1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIGdldFNlbGVjdGlvbigpIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLnN0YXRlLnNlbGVjdGlvbkluZGV4O1xuXG4gICAgaWYgKHRoaXMuX2hhc0N1c3RvbVZhbHVlKCkpIHtcbiAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS5lbnRyeVZhbHVlO1xuICAgICAgfVxuICAgICAgaW5kZXgtLTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2hhc0ZpeGVkT3B0aW9ucygpKSB7XG4gICAgICByZXR1cm4gaW5kZXggPCB0aGlzLnByb3BzLmZpeGVkT3B0aW9ucy5sZW5ndGhcbiAgICAgICAgPyB0aGlzLnByb3BzLmZpeGVkT3B0aW9uc1tpbmRleF1cbiAgICAgICAgOiB0aGlzLnN0YXRlLnNlYXJjaFJlc3VsdHNbaW5kZXggLSB0aGlzLnByb3BzLmZpeGVkT3B0aW9ucy5sZW5ndGhdO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5zZWFyY2hSZXN1bHRzW2luZGV4XTtcbiAgfVxuXG4gIF9vbk9wdGlvblNlbGVjdGVkID0gKG9wdGlvbiwgZXZlbnQpID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5zZWFyY2hhYmxlKSB7XG4gICAgICAvLyByZXNldCBlbnRyeSBpbnB1dFxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHNlYXJjaFJlc3VsdHM6IHRoaXMuZ2V0T3B0aW9uc0ZvclZhbHVlKCcnLCB0aGlzLnByb3BzLm9wdGlvbnMpLFxuICAgICAgICBzZWxlY3Rpb246ICcnLFxuICAgICAgICBlbnRyeVZhbHVlOiAnJ1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucHJvcHMub25PcHRpb25TZWxlY3RlZChvcHRpb24sIGV2ZW50KTtcbiAgfTtcblxuICAvLyB1c2UgKCkgPT4ge30gdG8gYXZvaWQgYmluZGluZyAndGhpcydcbiAgX29uVGV4dEVudHJ5VXBkYXRlZCA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5zZWFyY2hhYmxlKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZW50cnkudmFsdWU7XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBzZWFyY2hSZXN1bHRzOiB0aGlzLmdldE9wdGlvbnNGb3JWYWx1ZSh2YWx1ZSwgdGhpcy5wcm9wcy5vcHRpb25zKSxcbiAgICAgICAgc2VsZWN0aW9uOiAnJyxcbiAgICAgICAgZW50cnlWYWx1ZTogdmFsdWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBfb25FbnRlciA9IGV2ZW50ID0+IHtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSB0aGlzLmdldFNlbGVjdGlvbigpO1xuICAgIGlmICghc2VsZWN0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5vbktleURvd24oZXZlbnQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fb25PcHRpb25TZWxlY3RlZChzZWxlY3Rpb24sIGV2ZW50KTtcbiAgfTtcblxuICBfb25Fc2NhcGUoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3Rpb25JbmRleDogbnVsbFxuICAgIH0pO1xuICB9XG5cbiAgX29uVGFiKGV2ZW50KSB7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gdGhpcy5nZXRTZWxlY3Rpb24oKTtcbiAgICBsZXQgb3B0aW9uID0gc2VsZWN0aW9uXG4gICAgICA/IHNlbGVjdGlvblxuICAgICAgOiB0aGlzLnN0YXRlLnNlYXJjaFJlc3VsdHMubGVuZ3RoID4gMFxuICAgICAgICA/IHRoaXMuc3RhdGUuc2VhcmNoUmVzdWx0c1swXVxuICAgICAgICA6IG51bGw7XG5cbiAgICBpZiAob3B0aW9uID09PSBudWxsICYmIHRoaXMuX2hhc0N1c3RvbVZhbHVlKCkpIHtcbiAgICAgIG9wdGlvbiA9IHRoaXMuX2dldEN1c3RvbVZhbHVlKCk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbiAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuX29uT3B0aW9uU2VsZWN0ZWQob3B0aW9uLCBldmVudCk7XG4gICAgfVxuICB9XG5cbiAgZXZlbnRNYXAoZXZlbnQpIHtcbiAgICBjb25zdCBldmVudHMgPSB7fTtcblxuICAgIGV2ZW50c1tLZXlFdmVudC5ET01fVktfVVBdID0gdGhpcy5uYXZVcDtcbiAgICBldmVudHNbS2V5RXZlbnQuRE9NX1ZLX0RPV05dID0gdGhpcy5uYXZEb3duO1xuICAgIGV2ZW50c1tLZXlFdmVudC5ET01fVktfUkVUVVJOXSA9IGV2ZW50c1tcbiAgICAgIEtleUV2ZW50LkRPTV9WS19FTlRFUlxuICAgIF0gPSB0aGlzLl9vbkVudGVyO1xuICAgIGV2ZW50c1tLZXlFdmVudC5ET01fVktfRVNDQVBFXSA9IHRoaXMuX29uRXNjYXBlO1xuICAgIGV2ZW50c1tLZXlFdmVudC5ET01fVktfVEFCXSA9IHRoaXMuX29uVGFiO1xuXG4gICAgcmV0dXJuIGV2ZW50cztcbiAgfVxuXG4gIF9uYXYoZGVsdGEpIHtcbiAgICBpZiAoIXRoaXMuX2hhc0hpbnQoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgbmV3SW5kZXggPVxuICAgICAgdGhpcy5zdGF0ZS5zZWxlY3Rpb25JbmRleCA9PT0gbnVsbFxuICAgICAgICA/IGRlbHRhID09PSAxID8gMCA6IGRlbHRhXG4gICAgICAgIDogdGhpcy5zdGF0ZS5zZWxlY3Rpb25JbmRleCArIGRlbHRhO1xuICAgIGxldCBsZW5ndGggPSB0aGlzLnByb3BzLm1heFZpc2libGVcbiAgICAgID8gdGhpcy5zdGF0ZS5zZWFyY2hSZXN1bHRzLnNsaWNlKDAsIHRoaXMucHJvcHMubWF4VmlzaWJsZSkubGVuZ3RoXG4gICAgICA6IHRoaXMuc3RhdGUuc2VhcmNoUmVzdWx0cy5sZW5ndGg7XG4gICAgaWYgKHRoaXMuX2hhc0N1c3RvbVZhbHVlKCkpIHtcbiAgICAgIGxlbmd0aCArPSAxO1xuICAgIH1cblxuICAgIGlmIChuZXdJbmRleCA8IDApIHtcbiAgICAgIG5ld0luZGV4ICs9IGxlbmd0aDtcbiAgICB9IGVsc2UgaWYgKG5ld0luZGV4ID49IGxlbmd0aCkge1xuICAgICAgbmV3SW5kZXggLT0gbGVuZ3RoO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe3NlbGVjdGlvbkluZGV4OiBuZXdJbmRleH0pO1xuICB9XG5cbiAgbmF2RG93biA9ICgpID0+IHtcbiAgICB0aGlzLl9uYXYoMSk7XG4gIH07XG5cbiAgbmF2VXAgPSAoKSA9PiB7XG4gICAgdGhpcy5fbmF2KC0xKTtcbiAgfTtcblxuICBfb25DaGFuZ2UgPSBldmVudCA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMub25DaGFuZ2UpIHtcbiAgICAgIHRoaXMucHJvcHMub25DaGFuZ2UoZXZlbnQpO1xuICAgIH1cblxuICAgIHRoaXMuX29uVGV4dEVudHJ5VXBkYXRlZCgpO1xuICB9O1xuXG4gIF9vbktleURvd24gPSBldmVudCA9PiB7XG4gICAgLy8gSWYgdGhlcmUgYXJlIG5vIHZpc2libGUgZWxlbWVudHMsIGRvbid0IHBlcmZvcm0gc2VsZWN0b3IgbmF2aWdhdGlvbi5cbiAgICAvLyBKdXN0IHBhc3MgdGhpcyB1cCB0byB0aGUgdXBzdHJlYW0gb25LZXlkb3duIGhhbmRsZXIuXG4gICAgLy8gQWxzbyBza2lwIGlmIHRoZSB1c2VyIGlzIHByZXNzaW5nIHRoZSBzaGlmdCBrZXksIHNpbmNlIG5vbmUgb2Ygb3VyIGhhbmRsZXJzIGFyZSBsb29raW5nIGZvciBzaGlmdFxuICAgIGlmICghdGhpcy5faGFzSGludCgpIHx8IGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5vbktleURvd24oZXZlbnQpO1xuICAgIH1cblxuICAgIGNvbnN0IGhhbmRsZXIgPSB0aGlzLmV2ZW50TWFwKClbZXZlbnQua2V5Q29kZV07XG5cbiAgICBpZiAoaGFuZGxlcikge1xuICAgICAgaGFuZGxlcihldmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLm9uS2V5RG93bihldmVudCk7XG4gICAgfVxuICAgIC8vIERvbid0IHByb3BhZ2F0ZSB0aGUga2V5c3Ryb2tlIGJhY2sgdG8gdGhlIERPTS9icm93c2VyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfTtcblxuICBfb25Gb2N1cyA9IGV2ZW50ID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtpc0ZvY3VzZWQ6IHRydWV9KTtcbiAgICBpZiAodGhpcy5wcm9wcy5vbkZvY3VzKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5vbkZvY3VzKGV2ZW50KTtcbiAgICB9XG4gIH07XG5cbiAgX29uQmx1ciA9IGV2ZW50ID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtpc0ZvY3VzZWQ6IGZhbHNlfSk7XG4gICAgaWYgKHRoaXMucHJvcHMub25CbHVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5vbkJsdXIoZXZlbnQpO1xuICAgIH1cbiAgfTtcblxuICBfcmVuZGVySGlkZGVuSW5wdXQoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLm5hbWUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8aW5wdXRcbiAgICAgICAgdHlwZT1cImhpZGRlblwiXG4gICAgICAgIG5hbWU9e3RoaXMucHJvcHMubmFtZX1cbiAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuc2VsZWN0aW9ufVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgX2dlbmVyYXRlU2VhcmNoRnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgc2VhcmNoT3B0aW9uc1Byb3AgPSB0aGlzLnByb3BzLnNlYXJjaE9wdGlvbnM7XG4gICAgY29uc3QgZmlsdGVyT3B0aW9uUHJvcCA9IHRoaXMucHJvcHMuZmlsdGVyT3B0aW9uO1xuICAgIGlmICh0eXBlb2Ygc2VhcmNoT3B0aW9uc1Byb3AgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlmIChmaWx0ZXJPcHRpb25Qcm9wICE9PSBudWxsKSB7XG4gICAgICAgIENvbnNvbGUud2FybihcbiAgICAgICAgICAnc2VhcmNoT3B0aW9ucyBwcm9wIGlzIGJlaW5nIHVzZWQsIGZpbHRlck9wdGlvbiBwcm9wIHdpbGwgYmUgaWdub3JlZCdcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWFyY2hPcHRpb25zUHJvcDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBmaWx0ZXJPcHRpb25Qcm9wID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyB1c2UgY3VzdG9tIGZpbHRlciBvcHRpb25cbiAgICAgIHJldHVybiAodmFsdWUsIG9wdGlvbnMpID0+XG4gICAgICAgIG9wdGlvbnMuZmlsdGVyKG8gPT4gZmlsdGVyT3B0aW9uUHJvcCh2YWx1ZSwgbykpO1xuICAgIH1cblxuICAgIGNvbnN0IG1hcHBlciA9XG4gICAgICB0eXBlb2YgZmlsdGVyT3B0aW9uUHJvcCA9PT0gJ3N0cmluZydcbiAgICAgICAgPyBBY2Nlc3Nvci5nZW5lcmF0ZUFjY2Vzc29yKGZpbHRlck9wdGlvblByb3ApXG4gICAgICAgIDogQWNjZXNzb3IuSURFTlRJVFlfRk47XG5cbiAgICByZXR1cm4gKHZhbHVlLCBvcHRpb25zKSA9PlxuICAgICAgZnV6enlcbiAgICAgICAgLmZpbHRlcih2YWx1ZSwgb3B0aW9ucywge2V4dHJhY3Q6IG1hcHBlcn0pXG4gICAgICAgIC5tYXAocmVzID0+IG9wdGlvbnNbcmVzLmluZGV4XSk7XG4gIH1cblxuICBfaGFzSGludCgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5zZWFyY2hSZXN1bHRzLmxlbmd0aCA+IDAgfHwgdGhpcy5faGFzQ3VzdG9tVmFsdWUoKTtcbiAgfVxuXG4gIF9oYXNGaXhlZE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIEFycmF5LmlzQXJyYXkodGhpcy5wcm9wcy5maXhlZE9wdGlvbnMpICYmIHRoaXMucHJvcHMuZml4ZWRPcHRpb25zLmxlbmd0aFxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgaW5wdXRDbGFzc2VzID0ge307XG4gICAgaW5wdXRDbGFzc2VzW3RoaXMucHJvcHMuY3VzdG9tQ2xhc3Nlcy5pbnB1dF0gPSBCb29sZWFuKFxuICAgICAgdGhpcy5wcm9wcy5jdXN0b21DbGFzc2VzLmlucHV0XG4gICAgKTtcbiAgICBjb25zdCBpbnB1dENsYXNzTGlzdCA9IGNsYXNzTmFtZXMoaW5wdXRDbGFzc2VzKTtcblxuICAgIGNvbnN0IGNsYXNzZXMgPSB7XG4gICAgICBbREVGQVVMVF9DTEFTU106IHRoaXMucHJvcHMuZGVmYXVsdENsYXNzTmFtZXNcbiAgICB9O1xuICAgIGNsYXNzZXNbdGhpcy5wcm9wcy5jbGFzc05hbWVdID0gQm9vbGVhbih0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG4gICAgY29uc3QgY2xhc3NMaXN0ID0gY2xhc3NOYW1lcyhjbGFzc2VzKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8VHlwZWFoZWFkV3JhcHBlclxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzTGlzdH1cbiAgICAgICAgaW5uZXJSZWY9e2NvbXAgPT4ge1xuICAgICAgICAgIHRoaXMucm9vdCA9IGNvbXA7XG4gICAgICAgIH19XG4gICAgICAgIHRhYkluZGV4PVwiMFwiXG4gICAgICAgIG9uS2V5RG93bj17dGhpcy5fb25LZXlEb3dufVxuICAgICAgICBvbktleVByZXNzPXt0aGlzLnByb3BzLm9uS2V5UHJlc3N9XG4gICAgICAgIG9uS2V5VXA9e3RoaXMucHJvcHMub25LZXlVcH1cbiAgICAgICAgb25Gb2N1cz17dGhpcy5fb25Gb2N1c31cbiAgICAgID5cbiAgICAgICAge3RoaXMuX3JlbmRlckhpZGRlbklucHV0KCl9XG4gICAgICAgIHt0aGlzLnByb3BzLnNlYXJjaGFibGUgPyAoXG4gICAgICAgICAgPFR5cGVhaGVhZElucHV0XG4gICAgICAgICAgICBpbm5lclJlZj17Y29tcCA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuZW50cnkgPSBjb21wO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgIGRpc2FibGVkPXt0aGlzLnByb3BzLmRpc2FibGVkfVxuICAgICAgICAgICAgey4uLnRoaXMucHJvcHMuaW5wdXRQcm9wc31cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0aGlzLnByb3BzLnBsYWNlaG9sZGVyfVxuICAgICAgICAgICAgY2xhc3NOYW1lPXtpbnB1dENsYXNzTGlzdH1cbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLmVudHJ5VmFsdWV9XG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5fb25DaGFuZ2V9XG4gICAgICAgICAgICBvbkJsdXI9e3RoaXMuX29uQmx1cn1cbiAgICAgICAgICAvPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgICAge3RoaXMuX3JlbmRlckluY3JlbWVudGFsU2VhcmNoUmVzdWx0cygpfVxuICAgICAgPC9UeXBlYWhlYWRXcmFwcGVyPlxuICAgICk7XG4gIH1cbn1cblxuVHlwZWFoZWFkLnByb3BUeXBlcyA9IHByb3BUeXBlcztcblR5cGVhaGVhZC5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG5cbmV4cG9ydCBkZWZhdWx0IFR5cGVhaGVhZDtcbiJdfQ==