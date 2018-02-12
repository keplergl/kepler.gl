'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  display: flex;\n  flex-direction: column;\n  background-color: ', ';\n  box-shadow: ', ';\n\n  :focus {\n    outline: 0;\n  }\n'], ['\n  display: flex;\n  flex-direction: column;\n  background-color: ', ';\n  box-shadow: ', ';\n\n  :focus {\n    outline: 0;\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  padding: 8px;\n'], ['\n  padding: 8px;\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  ', '\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n  }\n'], ['\n  ', '\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n  }\n']),
    _templateObject4 = (0, _taggedTemplateLiteral3.default)(['\n  position: absolute;\n  right: 15px;\n  top: 14px;\n  color: ', ';\n'], ['\n  position: absolute;\n  right: 15px;\n  top: 14px;\n  color: ', ';\n']);

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

    var _this = (0, _possibleConstructorReturn3.default)(this, (Typeahead.__proto__ || Object.getPrototypeOf(Typeahead)).call(this, props));

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

  (0, _createClass3.default)(Typeahead, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
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
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var searchResults = this.getOptionsForValue(this.state.entryValue, nextProps.options);

      this.setState({ searchResults: searchResults });
    }
  }, {
    key: '_shouldSkipSearch',
    value: function _shouldSkipSearch(input) {
      var emptyValue = !input || input.trim().length === 0;

      // this.state must be checked because it may not be defined yet if this function
      // is called from within getInitialState
      var isFocused = this.state && this.state.isFocused;
      return !(this.props.showOptionsWhenEmpty && isFocused) && emptyValue;
    }
  }, {
    key: 'getOptionsForValue',
    value: function getOptionsForValue(value, options) {
      if (!this.props.searchable) {
        // directly pass through options if can not be searched
        return options;
      }
      if (this._shouldSkipSearch(value)) {
        return options;
      }

      var searchOptions = this._generateSearchFunction();
      return searchOptions(value, options);
    }
  }, {
    key: 'focus',
    value: function focus() {
      if (this.entry) {
        this.entry.focus();
      }
    }
  }, {
    key: '_hasCustomValue',
    value: function _hasCustomValue() {
      return this.props.allowCustomValues > 0 && this.state.entryValue.length >= this.props.allowCustomValues && this.state.searchResults.indexOf(this.state.entryValue) < 0;
    }
  }, {
    key: '_getCustomValue',
    value: function _getCustomValue() {
      return this._hasCustomValue() ? this.state.entryValue : null;
    }
  }, {
    key: '_renderIncrementalSearchResults',
    value: function _renderIncrementalSearchResults() {
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
    }
  }, {
    key: 'getSelection',
    value: function getSelection() {
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
    }

    // use () => {} to avoid binding 'this'

  }, {
    key: '_onEscape',
    value: function _onEscape() {
      this.setState({
        selectionIndex: null
      });
    }
  }, {
    key: '_onTab',
    value: function _onTab(event) {
      var selection = this.getSelection();
      var option = selection ? selection : this.state.searchResults.length > 0 ? this.state.searchResults[0] : null;

      if (option === null && this._hasCustomValue()) {
        option = this._getCustomValue();
      }

      if (option !== null) {
        return this._onOptionSelected(option, event);
      }
    }
  }, {
    key: 'eventMap',
    value: function eventMap(event) {
      var events = {};

      events[_keyevent2.default.DOM_VK_UP] = this.navUp;
      events[_keyevent2.default.DOM_VK_DOWN] = this.navDown;
      events[_keyevent2.default.DOM_VK_RETURN] = events[_keyevent2.default.DOM_VK_ENTER] = this._onEnter;
      events[_keyevent2.default.DOM_VK_ESCAPE] = this._onEscape;
      events[_keyevent2.default.DOM_VK_TAB] = this._onTab;

      return events;
    }
  }, {
    key: '_nav',
    value: function _nav(delta) {
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
    }
  }, {
    key: '_renderHiddenInput',
    value: function _renderHiddenInput() {
      if (!this.props.name) {
        return null;
      }

      return _react2.default.createElement('input', {
        type: 'hidden',
        name: this.props.name,
        value: this.state.selection
      });
    }
  }, {
    key: '_generateSearchFunction',
    value: function _generateSearchFunction() {
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
    }
  }, {
    key: '_hasHint',
    value: function _hasHint() {
      return this.state.searchResults.length > 0 || this._hasCustomValue();
    }
  }, {
    key: '_hasFixedOptions',
    value: function _hasFixedOptions() {
      return Array.isArray(this.props.fixedOptions) && this.props.fixedOptions.length;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var inputClasses = {};
      inputClasses[this.props.customClasses.input] = Boolean(this.props.customClasses.input);
      var inputClassList = (0, _classnames2.default)(inputClasses);

      var classes = (0, _defineProperty3.default)({}, DEFAULT_CLASS, this.props.defaultClassNames);
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
    }
  }]);
  return Typeahead;
}(_react.Component);

Typeahead.propTypes = propTypes;
Typeahead.defaultProps = defaultProps;

exports.default = Typeahead;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL3R5cGVhaGVhZC5qcyJdLCJuYW1lcyI6WyJERUZBVUxUX0NMQVNTIiwicHJvcFR5cGVzIiwibmFtZSIsInN0cmluZyIsImN1c3RvbUNsYXNzZXMiLCJvYmplY3QiLCJtYXhWaXNpYmxlIiwibnVtYmVyIiwicmVzdWx0c1RydW5jYXRlZE1lc3NhZ2UiLCJvcHRpb25zIiwiYXJyYXkiLCJmaXhlZE9wdGlvbnMiLCJhbGxvd0N1c3RvbVZhbHVlcyIsImluaXRpYWxWYWx1ZSIsInZhbHVlIiwicGxhY2Vob2xkZXIiLCJkaXNhYmxlZCIsImJvb2wiLCJ0ZXh0YXJlYSIsImlucHV0UHJvcHMiLCJvbk9wdGlvblNlbGVjdGVkIiwiZnVuYyIsIm9uQ2hhbmdlIiwib25LZXlEb3duIiwib25LZXlQcmVzcyIsIm9uS2V5VXAiLCJvbkZvY3VzIiwib25CbHVyIiwiZmlsdGVyT3B0aW9uIiwib25lT2ZUeXBlIiwic2VhcmNoT3B0aW9ucyIsImRpc3BsYXlPcHRpb24iLCJpbnB1dERpc3BsYXlPcHRpb24iLCJmb3JtSW5wdXRPcHRpb24iLCJkZWZhdWx0Q2xhc3NOYW1lcyIsImN1c3RvbUxpc3RDb21wb25lbnQiLCJlbGVtZW50IiwiY3VzdG9tTGlzdEl0ZW1Db21wb25lbnQiLCJjdXN0b21MaXN0SGVhZGVyQ29tcG9uZW50Iiwic2hvd09wdGlvbnNXaGVuRW1wdHkiLCJzZWFyY2hhYmxlIiwiZGVmYXVsdFByb3BzIiwib3B0aW9uIiwiZXZlbnQiLCJUeXBlYWhlYWRXcmFwcGVyIiwiZGl2IiwicHJvcHMiLCJ0aGVtZSIsImRyb3Bkb3duTGlzdEJnZCIsImRyb3Bkb3duTGlzdFNoYWRvdyIsIklucHV0Qm94IiwiVHlwZWFoZWFkSW5wdXQiLCJpbnB1dCIsInNlY29uZGFyeUlucHV0Iiwic2Vjb25kYXJ5SW5wdXRCZ2QiLCJJbnB1dEljb24iLCJpbnB1dFBsYWNlaG9sZGVyQ29sb3IiLCJUeXBlYWhlYWQiLCJfb25PcHRpb25TZWxlY3RlZCIsInNldFN0YXRlIiwic2VhcmNoUmVzdWx0cyIsImdldE9wdGlvbnNGb3JWYWx1ZSIsInNlbGVjdGlvbiIsImVudHJ5VmFsdWUiLCJfb25UZXh0RW50cnlVcGRhdGVkIiwiZW50cnkiLCJfb25FbnRlciIsImdldFNlbGVjdGlvbiIsIm5hdkRvd24iLCJfbmF2IiwibmF2VXAiLCJfb25DaGFuZ2UiLCJfb25LZXlEb3duIiwiX2hhc0hpbnQiLCJzaGlmdEtleSIsImhhbmRsZXIiLCJldmVudE1hcCIsImtleUNvZGUiLCJwcmV2ZW50RGVmYXVsdCIsIl9vbkZvY3VzIiwiaXNGb2N1c2VkIiwiX29uQmx1ciIsInN0YXRlIiwic2VsZWN0aW9uSW5kZXgiLCJmb2N1cyIsInJvb3QiLCJuZXh0UHJvcHMiLCJlbXB0eVZhbHVlIiwidHJpbSIsImxlbmd0aCIsIl9zaG91bGRTa2lwU2VhcmNoIiwiX2dlbmVyYXRlU2VhcmNoRnVuY3Rpb24iLCJpbmRleE9mIiwiX2hhc0N1c3RvbVZhbHVlIiwic2xpY2UiLCJfZ2V0Q3VzdG9tVmFsdWUiLCJpbmRleCIsIl9oYXNGaXhlZE9wdGlvbnMiLCJldmVudHMiLCJET01fVktfVVAiLCJET01fVktfRE9XTiIsIkRPTV9WS19SRVRVUk4iLCJET01fVktfRU5URVIiLCJET01fVktfRVNDQVBFIiwiX29uRXNjYXBlIiwiRE9NX1ZLX1RBQiIsIl9vblRhYiIsImRlbHRhIiwibmV3SW5kZXgiLCJzZWFyY2hPcHRpb25zUHJvcCIsImZpbHRlck9wdGlvblByb3AiLCJ3YXJuIiwiZmlsdGVyIiwibyIsIm1hcHBlciIsImdlbmVyYXRlQWNjZXNzb3IiLCJJREVOVElUWV9GTiIsImV4dHJhY3QiLCJtYXAiLCJyZXMiLCJBcnJheSIsImlzQXJyYXkiLCJpbnB1dENsYXNzZXMiLCJCb29sZWFuIiwiaW5wdXRDbGFzc0xpc3QiLCJjbGFzc2VzIiwiY2xhc3NOYW1lIiwiY2xhc3NMaXN0IiwiY29tcCIsIl9yZW5kZXJIaWRkZW5JbnB1dCIs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QkFBV0YsT0FBWCxDQUFsQjs7QUFFQSxhQUNFO0FBQUMsd0JBQUQ7QUFBQTtBQUNFLHFCQUFXRSxTQURiO0FBRUUsb0JBQVUsd0JBQVE7QUFDaEIsbUJBQUsxQyxJQUFMLEdBQVkyQyxJQUFaO0FBQ0QsV0FKSDtBQUtFLG9CQUFTLEdBTFg7QUFNRSxxQkFBVyxLQUFLeEQsVUFObEI7QUFPRSxzQkFBWSxLQUFLMUIsS0FBTCxDQUFXdEIsVUFQekI7QUFRRSxtQkFBUyxLQUFLc0IsS0FBTCxDQUFXckIsT0FSdEI7QUFTRSxtQkFBUyxLQUFLc0Q7QUFUaEI7QUFXRyxhQUFLa0Qsa0JBQUwsRUFYSDtBQVlHLGFBQUtuRixLQUFMLENBQVdOLFVBQVgsR0FDRDtBQUFDLGtCQUFEO0FBQUE7QUFDRSx3Q0FBQyxjQUFEO0FBQ0Usc0JBQVUsd0JBQVE7QUFDaEIscUJBQUt5QixLQUFMLEdBQWErRCxJQUFiO0FBQ0QsYUFISDtBQUlFLGtCQUFLLE1BSlA7QUFLRSxzQkFBVSxLQUFLbEYsS0FBTCxDQUFXOUI7QUFMdkIsYUFNTSxLQUFLOEIsS0FBTCxDQUFXM0IsVUFOakI7QUFPRSx5QkFBYSxLQUFLMkIsS0FBTCxDQUFXL0IsV0FQMUI7QUFRRSx1QkFBVzZHLGNBUmI7QUFTRSxtQkFBTyxLQUFLMUMsS0FBTCxDQUFXbkIsVUFUcEI7QUFVRSxzQkFBVSxLQUFLUSxTQVZqQjtBQVdFLG9CQUFRLEtBQUtVO0FBWGYsYUFERjtBQWNFO0FBQUMscUJBQUQ7QUFBQTtBQUNFLDJEQUFRLFFBQU8sTUFBZjtBQURGO0FBZEYsU0FEQyxHQW1CRyxJQS9CTjtBQWdDRyxhQUFLaUQsK0JBQUw7QUFoQ0gsT0FERjtBQW9DRDs7Ozs7QUFHSHpFLFVBQVV4RCxTQUFWLEdBQXNCQSxTQUF0QjtBQUNBd0QsVUFBVWhCLFlBQVYsR0FBeUJBLFlBQXpCOztrQkFFZWdCLFMiLCJmaWxlIjoidHlwZWFoZWFkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGZ1enp5IGZyb20gJ2Z1enp5JztcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge2NvbnNvbGUgYXMgQ29uc29sZX0gZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5cbmltcG9ydCBBY2Nlc3NvciBmcm9tICcuL2FjY2Vzc29yJztcbmltcG9ydCBLZXlFdmVudCBmcm9tICcuL2tleWV2ZW50JztcbmltcG9ydCBEcm9wZG93bkxpc3QsIHtMaXN0SXRlbX0gZnJvbSAnLi9kcm9wZG93bi1saXN0JztcbmltcG9ydCB7U2VhcmNofSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5cbmNvbnN0IERFRkFVTFRfQ0xBU1MgPSAndHlwZWFoZWFkJztcbi8qKlxuICogQ29waWVkIG1vc3RseSBmcm9tICdyZWFjdC10eXBlYWhlYWQnLCBhbiBhdXRvLWNvbXBsZXRpbmcgdGV4dCBpbnB1dFxuICpcbiAqIFJlbmRlcnMgYW4gdGV4dCBpbnB1dCB0aGF0IHNob3dzIG9wdGlvbnMgbmVhcmJ5IHRoYXQgeW91IGNhbiB1c2UgdGhlXG4gKiBrZXlib2FyZCBvciBtb3VzZSB0byBzZWxlY3QuXG4gKi9cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgbmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgY3VzdG9tQ2xhc3NlczogUHJvcFR5cGVzLm9iamVjdCxcbiAgbWF4VmlzaWJsZTogUHJvcFR5cGVzLm51bWJlcixcbiAgcmVzdWx0c1RydW5jYXRlZE1lc3NhZ2U6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG9wdGlvbnM6IFByb3BUeXBlcy5hcnJheSxcbiAgZml4ZWRPcHRpb25zOiBQcm9wVHlwZXMuYXJyYXksXG4gIGFsbG93Q3VzdG9tVmFsdWVzOiBQcm9wVHlwZXMubnVtYmVyLFxuICBpbml0aWFsVmFsdWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBwbGFjZWhvbGRlcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICB0ZXh0YXJlYTogUHJvcFR5cGVzLmJvb2wsXG4gIGlucHV0UHJvcHM6IFByb3BUeXBlcy5vYmplY3QsXG4gIG9uT3B0aW9uU2VsZWN0ZWQ6IFByb3BUeXBlcy5mdW5jLFxuICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uS2V5RG93bjogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uS2V5UHJlc3M6IFByb3BUeXBlcy5mdW5jLFxuICBvbktleVVwOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25Gb2N1czogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uQmx1cjogUHJvcFR5cGVzLmZ1bmMsXG4gIGZpbHRlck9wdGlvbjogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLmZ1bmNdKSxcbiAgc2VhcmNoT3B0aW9uczogUHJvcFR5cGVzLmZ1bmMsXG4gIGRpc3BsYXlPcHRpb246IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5mdW5jXSksXG4gIGlucHV0RGlzcGxheU9wdGlvbjogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLmZ1bmNdKSxcbiAgZm9ybUlucHV0T3B0aW9uOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuc3RyaW5nLCBQcm9wVHlwZXMuZnVuY10pLFxuICBkZWZhdWx0Q2xhc3NOYW1lczogUHJvcFR5cGVzLmJvb2wsXG4gIGN1c3RvbUxpc3RDb21wb25lbnQ6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5lbGVtZW50LCBQcm9wVHlwZXMuZnVuY10pLFxuICBjdXN0b21MaXN0SXRlbUNvbXBvbmVudDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgUHJvcFR5cGVzLmVsZW1lbnQsXG4gICAgUHJvcFR5cGVzLmZ1bmNcbiAgXSksXG4gIGN1c3RvbUxpc3RIZWFkZXJDb21wb25lbnQ6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgIFByb3BUeXBlcy5lbGVtZW50LFxuICAgIFByb3BUeXBlcy5mdW5jXG4gIF0pLFxuICBzaG93T3B0aW9uc1doZW5FbXB0eTogUHJvcFR5cGVzLmJvb2wsXG4gIHNlYXJjaGFibGU6IFByb3BUeXBlcy5ib29sXG59O1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIG9wdGlvbnM6IFtdLFxuICBjdXN0b21DbGFzc2VzOiB7fSxcbiAgYWxsb3dDdXN0b21WYWx1ZXM6IDAsXG4gIGluaXRpYWxWYWx1ZTogJycsXG4gIHZhbHVlOiAnJyxcbiAgcGxhY2Vob2xkZXI6ICcnLFxuICBkaXNhYmxlZDogZmFsc2UsXG4gIHRleHRhcmVhOiBmYWxzZSxcbiAgaW5wdXRQcm9wczoge30sXG4gIG9uT3B0aW9uU2VsZWN0ZWQob3B0aW9uKSB7fSxcbiAgb25DaGFuZ2UoZXZlbnQpIHt9LFxuICBvbktleURvd24oZXZlbnQpIHt9LFxuICBvbktleVByZXNzKGV2ZW50KSB7fSxcbiAgb25LZXlVcChldmVudCkge30sXG4gIG9uRm9jdXMoZXZlbnQpIHt9LFxuICBvbkJsdXIoZXZlbnQpIHt9LFxuICBmaWx0ZXJPcHRpb246IG51bGwsXG4gIHNlYXJjaE9wdGlvbnM6IG51bGwsXG4gIGlucHV0RGlzcGxheU9wdGlvbjogbnVsbCxcbiAgZGVmYXVsdENsYXNzTmFtZXM6IHRydWUsXG4gIGN1c3RvbUxpc3RDb21wb25lbnQ6IERyb3Bkb3duTGlzdCxcbiAgY3VzdG9tTGlzdEl0ZW1Db21wb25lbnQ6IExpc3RJdGVtLFxuICBjdXN0b21MaXN0SGVhZGVyQ29tcG9uZW50OiBudWxsLFxuICBzaG93T3B0aW9uc1doZW5FbXB0eTogdHJ1ZSxcbiAgc2VhcmNoYWJsZTogdHJ1ZSxcbiAgcmVzdWx0c1RydW5jYXRlZE1lc3NhZ2U6IG51bGxcbn07XG5cbmNvbnN0IFR5cGVhaGVhZFdyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdEJnZH07XG4gIGJveC1zaGFkb3c6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0U2hhZG93fTtcblxuICA6Zm9jdXMge1xuICAgIG91dGxpbmU6IDA7XG4gIH1cbmA7XG5cbmNvbnN0IElucHV0Qm94ID0gc3R5bGVkLmRpdmBcbiAgcGFkZGluZzogOHB4O1xuYDtcblxuY29uc3QgVHlwZWFoZWFkSW5wdXQgPSBzdHlsZWQuaW5wdXRgXG4gICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2Vjb25kYXJ5SW5wdXR9XG4gIDpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2Vjb25kYXJ5SW5wdXRCZ2R9O1xuICB9XG5gO1xuXG5jb25zdCBJbnB1dEljb24gPSBzdHlsZWQuZGl2YFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHJpZ2h0OiAxNXB4O1xuICB0b3A6IDE0cHg7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmlucHV0UGxhY2Vob2xkZXJDb2xvcn07XG5gO1xuXG5jbGFzcyBUeXBlYWhlYWQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBzZWFyY2hSZXN1bHRzOiB0aGlzLmdldE9wdGlvbnNGb3JWYWx1ZShcbiAgICAgICAgdGhpcy5wcm9wcy5pbml0aWFsVmFsdWUsXG4gICAgICAgIHRoaXMucHJvcHMub3B0aW9uc1xuICAgICAgKSxcblxuICAgICAgLy8gVGhpcyBzaG91bGQgYmUgY2FsbGVkIHNvbWV0aGluZyBlbHNlLCAnZW50cnlWYWx1ZSdcbiAgICAgIGVudHJ5VmFsdWU6IHRoaXMucHJvcHMudmFsdWUgfHwgdGhpcy5wcm9wcy5pbml0aWFsVmFsdWUsXG5cbiAgICAgIC8vIEEgdmFsaWQgdHlwZWFoZWFkIHZhbHVlXG4gICAgICBzZWxlY3Rpb246IHRoaXMucHJvcHMudmFsdWUsXG5cbiAgICAgIC8vIEluZGV4IG9mIHRoZSBzZWxlY3Rpb25cbiAgICAgIHNlbGVjdGlvbkluZGV4OiBudWxsLFxuXG4gICAgICAvLyBLZWVwIHRyYWNrIG9mIHRoZSBmb2N1cyBzdGF0ZSBvZiB0aGUgaW5wdXQgZWxlbWVudCwgdG8gZGV0ZXJtaW5lXG4gICAgICAvLyB3aGV0aGVyIHRvIHNob3cgb3B0aW9ucyB3aGVuIGVtcHR5IChpZiBzaG93T3B0aW9uc1doZW5FbXB0eSBpcyB0cnVlKVxuICAgICAgaXNGb2N1c2VkOiBmYWxzZVxuICAgIH07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlYXJjaFJlc3VsdHM6IHRoaXMuZ2V0T3B0aW9uc0ZvclZhbHVlKCcnLCB0aGlzLnByb3BzLm9wdGlvbnMpXG4gICAgfSk7XG5cbiAgICAvLyBjYWxsIGZvY3VzIG9uIGVudHJ5IG9yIGRpdiB0byB0cmlnZ2VyIGtleSBldmVudHMgbGlzdGVuZXJcbiAgICBpZiAodGhpcy5lbnRyeSkge1xuICAgICAgdGhpcy5lbnRyeS5mb2N1cygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJvb3QuZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIGNvbnN0IHNlYXJjaFJlc3VsdHMgPSB0aGlzLmdldE9wdGlvbnNGb3JWYWx1ZShcbiAgICAgIHRoaXMuc3RhdGUuZW50cnlWYWx1ZSxcbiAgICAgIG5leHRQcm9wcy5vcHRpb25zXG4gICAgKTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe3NlYXJjaFJlc3VsdHN9KTtcbiAgfVxuXG4gIF9zaG91bGRTa2lwU2VhcmNoKGlucHV0KSB7XG4gICAgY29uc3QgZW1wdHlWYWx1ZSA9ICFpbnB1dCB8fCBpbnB1dC50cmltKCkubGVuZ3RoID09PSAwO1xuXG4gICAgLy8gdGhpcy5zdGF0ZSBtdXN0IGJlIGNoZWNrZWQgYmVjYXVzZSBpdCBtYXkgbm90IGJlIGRlZmluZWQgeWV0IGlmIHRoaXMgZnVuY3Rpb25cbiAgICAvLyBpcyBjYWxsZWQgZnJvbSB3aXRoaW4gZ2V0SW5pdGlhbFN0YXRlXG4gICAgY29uc3QgaXNGb2N1c2VkID0gdGhpcy5zdGF0ZSAmJiB0aGlzLnN0YXRlLmlzRm9jdXNlZDtcbiAgICByZXR1cm4gISh0aGlzLnByb3BzLnNob3dPcHRpb25zV2hlbkVtcHR5ICYmIGlzRm9jdXNlZCkgJiYgZW1wdHlWYWx1ZTtcbiAgfVxuXG4gIGdldE9wdGlvbnNGb3JWYWx1ZSh2YWx1ZSwgb3B0aW9ucykge1xuICAgIGlmICghdGhpcy5wcm9wcy5zZWFyY2hhYmxlKSB7XG4gICAgICAvLyBkaXJlY3RseSBwYXNzIHRocm91Z2ggb3B0aW9ucyBpZiBjYW4gbm90IGJlIHNlYXJjaGVkXG4gICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9XG4gICAgaWYgKHRoaXMuX3Nob3VsZFNraXBTZWFyY2godmFsdWUpKSB7XG4gICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9XG5cbiAgICBjb25zdCBzZWFyY2hPcHRpb25zID0gdGhpcy5fZ2VuZXJhdGVTZWFyY2hGdW5jdGlvbigpO1xuICAgIHJldHVybiBzZWFyY2hPcHRpb25zKHZhbHVlLCBvcHRpb25zKTtcbiAgfVxuXG4gIGZvY3VzKCkge1xuICAgIGlmICh0aGlzLmVudHJ5KSB7XG4gICAgICB0aGlzLmVudHJ5LmZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgX2hhc0N1c3RvbVZhbHVlKCkge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLnByb3BzLmFsbG93Q3VzdG9tVmFsdWVzID4gMCAmJlxuICAgICAgdGhpcy5zdGF0ZS5lbnRyeVZhbHVlLmxlbmd0aCA+PSB0aGlzLnByb3BzLmFsbG93Q3VzdG9tVmFsdWVzICYmXG4gICAgICB0aGlzLnN0YXRlLnNlYXJjaFJlc3VsdHMuaW5kZXhPZih0aGlzLnN0YXRlLmVudHJ5VmFsdWUpIDwgMFxuICAgICk7XG4gIH1cblxuICBfZ2V0Q3VzdG9tVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hhc0N1c3RvbVZhbHVlKCkgPyB0aGlzLnN0YXRlLmVudHJ5VmFsdWUgOiBudWxsO1xuICB9XG5cbiAgX3JlbmRlckluY3JlbWVudGFsU2VhcmNoUmVzdWx0cygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHRoaXMucHJvcHMuY3VzdG9tTGlzdENvbXBvbmVudFxuICAgICAgICByZWY9XCJzZWxcIlxuICAgICAgICBmaXhlZE9wdGlvbnM9e3RoaXMucHJvcHMuZml4ZWRPcHRpb25zfVxuICAgICAgICBvcHRpb25zPXtcbiAgICAgICAgICB0aGlzLnByb3BzLm1heFZpc2libGVcbiAgICAgICAgICAgID8gdGhpcy5zdGF0ZS5zZWFyY2hSZXN1bHRzLnNsaWNlKDAsIHRoaXMucHJvcHMubWF4VmlzaWJsZSlcbiAgICAgICAgICAgIDogdGhpcy5zdGF0ZS5zZWFyY2hSZXN1bHRzXG4gICAgICAgIH1cbiAgICAgICAgYXJlUmVzdWx0c1RydW5jYXRlZD17XG4gICAgICAgICAgdGhpcy5wcm9wcy5tYXhWaXNpYmxlICYmXG4gICAgICAgICAgdGhpcy5zdGF0ZS5zZWFyY2hSZXN1bHRzLmxlbmd0aCA+IHRoaXMucHJvcHMubWF4VmlzaWJsZVxuICAgICAgICB9XG4gICAgICAgIHJlc3VsdHNUcnVuY2F0ZWRNZXNzYWdlPXt0aGlzLnByb3BzLnJlc3VsdHNUcnVuY2F0ZWRNZXNzYWdlfVxuICAgICAgICBvbk9wdGlvblNlbGVjdGVkPXt0aGlzLl9vbk9wdGlvblNlbGVjdGVkfVxuICAgICAgICBhbGxvd0N1c3RvbVZhbHVlcz17dGhpcy5wcm9wcy5hbGxvd0N1c3RvbVZhbHVlc31cbiAgICAgICAgY3VzdG9tVmFsdWU9e3RoaXMuX2dldEN1c3RvbVZhbHVlKCl9XG4gICAgICAgIGN1c3RvbUNsYXNzZXM9e3RoaXMucHJvcHMuY3VzdG9tQ2xhc3Nlc31cbiAgICAgICAgY3VzdG9tTGlzdEl0ZW1Db21wb25lbnQ9e3RoaXMucHJvcHMuY3VzdG9tTGlzdEl0ZW1Db21wb25lbnR9XG4gICAgICAgIGN1c3RvbUxpc3RIZWFkZXJDb21wb25lbnQ9e3RoaXMucHJvcHMuY3VzdG9tTGlzdEhlYWRlckNvbXBvbmVudH1cbiAgICAgICAgc2VsZWN0aW9uSW5kZXg9e3RoaXMuc3RhdGUuc2VsZWN0aW9uSW5kZXh9XG4gICAgICAgIGRlZmF1bHRDbGFzc05hbWVzPXt0aGlzLnByb3BzLmRlZmF1bHRDbGFzc05hbWVzfVxuICAgICAgICBkaXNwbGF5T3B0aW9uPXt0aGlzLnByb3BzLmRpc3BsYXlPcHRpb259XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBnZXRTZWxlY3Rpb24oKSB7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb25JbmRleDtcblxuICAgIGlmICh0aGlzLl9oYXNDdXN0b21WYWx1ZSgpKSB7XG4gICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuZW50cnlWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGluZGV4LS07XG4gICAgfVxuICAgIGlmICh0aGlzLl9oYXNGaXhlZE9wdGlvbnMoKSkge1xuICAgICAgcmV0dXJuIGluZGV4IDwgdGhpcy5wcm9wcy5maXhlZE9wdGlvbnMubGVuZ3RoXG4gICAgICAgID8gdGhpcy5wcm9wcy5maXhlZE9wdGlvbnNbaW5kZXhdXG4gICAgICAgIDogdGhpcy5zdGF0ZS5zZWFyY2hSZXN1bHRzW2luZGV4IC0gdGhpcy5wcm9wcy5maXhlZE9wdGlvbnMubGVuZ3RoXTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuc2VhcmNoUmVzdWx0c1tpbmRleF07XG4gIH1cblxuICBfb25PcHRpb25TZWxlY3RlZCA9IChvcHRpb24sIGV2ZW50KSA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMuc2VhcmNoYWJsZSkge1xuICAgICAgLy8gcmVzZXQgZW50cnkgaW5wdXRcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBzZWFyY2hSZXN1bHRzOiB0aGlzLmdldE9wdGlvbnNGb3JWYWx1ZSgnJywgdGhpcy5wcm9wcy5vcHRpb25zKSxcbiAgICAgICAgc2VsZWN0aW9uOiAnJyxcbiAgICAgICAgZW50cnlWYWx1ZTogJydcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnByb3BzLm9uT3B0aW9uU2VsZWN0ZWQob3B0aW9uLCBldmVudCk7XG4gIH07XG5cbiAgLy8gdXNlICgpID0+IHt9IHRvIGF2b2lkIGJpbmRpbmcgJ3RoaXMnXG4gIF9vblRleHRFbnRyeVVwZGF0ZWQgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMuc2VhcmNoYWJsZSkge1xuICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmVudHJ5LnZhbHVlO1xuXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgc2VhcmNoUmVzdWx0czogdGhpcy5nZXRPcHRpb25zRm9yVmFsdWUodmFsdWUsIHRoaXMucHJvcHMub3B0aW9ucyksXG4gICAgICAgIHNlbGVjdGlvbjogJycsXG4gICAgICAgIGVudHJ5VmFsdWU6IHZhbHVlXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgX29uRW50ZXIgPSBldmVudCA9PiB7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gdGhpcy5nZXRTZWxlY3Rpb24oKTtcbiAgICBpZiAoIXNlbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMub25LZXlEb3duKGV2ZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX29uT3B0aW9uU2VsZWN0ZWQoc2VsZWN0aW9uLCBldmVudCk7XG4gIH07XG5cbiAgX29uRXNjYXBlKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0aW9uSW5kZXg6IG51bGxcbiAgICB9KTtcbiAgfVxuXG4gIF9vblRhYihldmVudCkge1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IHRoaXMuZ2V0U2VsZWN0aW9uKCk7XG4gICAgbGV0IG9wdGlvbiA9IHNlbGVjdGlvblxuICAgICAgPyBzZWxlY3Rpb25cbiAgICAgIDogdGhpcy5zdGF0ZS5zZWFyY2hSZXN1bHRzLmxlbmd0aCA+IDBcbiAgICAgICAgPyB0aGlzLnN0YXRlLnNlYXJjaFJlc3VsdHNbMF1cbiAgICAgICAgOiBudWxsO1xuXG4gICAgaWYgKG9wdGlvbiA9PT0gbnVsbCAmJiB0aGlzLl9oYXNDdXN0b21WYWx1ZSgpKSB7XG4gICAgICBvcHRpb24gPSB0aGlzLl9nZXRDdXN0b21WYWx1ZSgpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb24gIT09IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLl9vbk9wdGlvblNlbGVjdGVkKG9wdGlvbiwgZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIGV2ZW50TWFwKGV2ZW50KSB7XG4gICAgY29uc3QgZXZlbnRzID0ge307XG5cbiAgICBldmVudHNbS2V5RXZlbnQuRE9NX1ZLX1VQXSA9IHRoaXMubmF2VXA7XG4gICAgZXZlbnRzW0tleUV2ZW50LkRPTV9WS19ET1dOXSA9IHRoaXMubmF2RG93bjtcbiAgICBldmVudHNbS2V5RXZlbnQuRE9NX1ZLX1JFVFVSTl0gPSBldmVudHNbXG4gICAgICBLZXlFdmVudC5ET01fVktfRU5URVJcbiAgICBdID0gdGhpcy5fb25FbnRlcjtcbiAgICBldmVudHNbS2V5RXZlbnQuRE9NX1ZLX0VTQ0FQRV0gPSB0aGlzLl9vbkVzY2FwZTtcbiAgICBldmVudHNbS2V5RXZlbnQuRE9NX1ZLX1RBQl0gPSB0aGlzLl9vblRhYjtcblxuICAgIHJldHVybiBldmVudHM7XG4gIH1cblxuICBfbmF2KGRlbHRhKSB7XG4gICAgaWYgKCF0aGlzLl9oYXNIaW50KCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IG5ld0luZGV4ID1cbiAgICAgIHRoaXMuc3RhdGUuc2VsZWN0aW9uSW5kZXggPT09IG51bGxcbiAgICAgICAgPyBkZWx0YSA9PT0gMSA/IDAgOiBkZWx0YVxuICAgICAgICA6IHRoaXMuc3RhdGUuc2VsZWN0aW9uSW5kZXggKyBkZWx0YTtcbiAgICBsZXQgbGVuZ3RoID0gdGhpcy5wcm9wcy5tYXhWaXNpYmxlXG4gICAgICA/IHRoaXMuc3RhdGUuc2VhcmNoUmVzdWx0cy5zbGljZSgwLCB0aGlzLnByb3BzLm1heFZpc2libGUpLmxlbmd0aFxuICAgICAgOiB0aGlzLnN0YXRlLnNlYXJjaFJlc3VsdHMubGVuZ3RoO1xuICAgIGlmICh0aGlzLl9oYXNDdXN0b21WYWx1ZSgpKSB7XG4gICAgICBsZW5ndGggKz0gMTtcbiAgICB9XG5cbiAgICBpZiAobmV3SW5kZXggPCAwKSB7XG4gICAgICBuZXdJbmRleCArPSBsZW5ndGg7XG4gICAgfSBlbHNlIGlmIChuZXdJbmRleCA+PSBsZW5ndGgpIHtcbiAgICAgIG5ld0luZGV4IC09IGxlbmd0aDtcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtzZWxlY3Rpb25JbmRleDogbmV3SW5kZXh9KTtcbiAgfVxuXG4gIG5hdkRvd24gPSAoKSA9PiB7XG4gICAgdGhpcy5fbmF2KDEpO1xuICB9O1xuXG4gIG5hdlVwID0gKCkgPT4ge1xuICAgIHRoaXMuX25hdigtMSk7XG4gIH07XG5cbiAgX29uQ2hhbmdlID0gZXZlbnQgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLm9uQ2hhbmdlKSB7XG4gICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKGV2ZW50KTtcbiAgICB9XG5cbiAgICB0aGlzLl9vblRleHRFbnRyeVVwZGF0ZWQoKTtcbiAgfTtcblxuICBfb25LZXlEb3duID0gZXZlbnQgPT4ge1xuICAgIC8vIElmIHRoZXJlIGFyZSBubyB2aXNpYmxlIGVsZW1lbnRzLCBkb24ndCBwZXJmb3JtIHNlbGVjdG9yIG5hdmlnYXRpb24uXG4gICAgLy8gSnVzdCBwYXNzIHRoaXMgdXAgdG8gdGhlIHVwc3RyZWFtIG9uS2V5ZG93biBoYW5kbGVyLlxuICAgIC8vIEFsc28gc2tpcCBpZiB0aGUgdXNlciBpcyBwcmVzc2luZyB0aGUgc2hpZnQga2V5LCBzaW5jZSBub25lIG9mIG91ciBoYW5kbGVycyBhcmUgbG9va2luZyBmb3Igc2hpZnRcbiAgICBpZiAoIXRoaXMuX2hhc0hpbnQoKSB8fCBldmVudC5zaGlmdEtleSkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMub25LZXlEb3duKGV2ZW50KTtcbiAgICB9XG5cbiAgICBjb25zdCBoYW5kbGVyID0gdGhpcy5ldmVudE1hcCgpW2V2ZW50LmtleUNvZGVdO1xuXG4gICAgaWYgKGhhbmRsZXIpIHtcbiAgICAgIGhhbmRsZXIoZXZlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5vbktleURvd24oZXZlbnQpO1xuICAgIH1cbiAgICAvLyBEb24ndCBwcm9wYWdhdGUgdGhlIGtleXN0cm9rZSBiYWNrIHRvIHRoZSBET00vYnJvd3NlclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH07XG5cbiAgX29uRm9jdXMgPSBldmVudCA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7aXNGb2N1c2VkOiB0cnVlfSk7XG4gICAgaWYgKHRoaXMucHJvcHMub25Gb2N1cykge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMub25Gb2N1cyhldmVudCk7XG4gICAgfVxuICB9O1xuXG4gIF9vbkJsdXIgPSBldmVudCA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7aXNGb2N1c2VkOiBmYWxzZX0pO1xuICAgIGlmICh0aGlzLnByb3BzLm9uQmx1cikge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMub25CbHVyKGV2ZW50KTtcbiAgICB9XG4gIH07XG5cbiAgX3JlbmRlckhpZGRlbklucHV0KCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5uYW1lKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGlucHV0XG4gICAgICAgIHR5cGU9XCJoaWRkZW5cIlxuICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnNlbGVjdGlvbn1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIF9nZW5lcmF0ZVNlYXJjaEZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHNlYXJjaE9wdGlvbnNQcm9wID0gdGhpcy5wcm9wcy5zZWFyY2hPcHRpb25zO1xuICAgIGNvbnN0IGZpbHRlck9wdGlvblByb3AgPSB0aGlzLnByb3BzLmZpbHRlck9wdGlvbjtcbiAgICBpZiAodHlwZW9mIHNlYXJjaE9wdGlvbnNQcm9wID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpZiAoZmlsdGVyT3B0aW9uUHJvcCAhPT0gbnVsbCkge1xuICAgICAgICBDb25zb2xlLndhcm4oXG4gICAgICAgICAgJ3NlYXJjaE9wdGlvbnMgcHJvcCBpcyBiZWluZyB1c2VkLCBmaWx0ZXJPcHRpb24gcHJvcCB3aWxsIGJlIGlnbm9yZWQnXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VhcmNoT3B0aW9uc1Byb3A7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZmlsdGVyT3B0aW9uUHJvcCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gdXNlIGN1c3RvbSBmaWx0ZXIgb3B0aW9uXG4gICAgICByZXR1cm4gKHZhbHVlLCBvcHRpb25zKSA9PlxuICAgICAgICBvcHRpb25zLmZpbHRlcihvID0+IGZpbHRlck9wdGlvblByb3AodmFsdWUsIG8pKTtcbiAgICB9XG5cbiAgICBjb25zdCBtYXBwZXIgPVxuICAgICAgdHlwZW9mIGZpbHRlck9wdGlvblByb3AgPT09ICdzdHJpbmcnXG4gICAgICAgID8gQWNjZXNzb3IuZ2VuZXJhdGVBY2Nlc3NvcihmaWx0ZXJPcHRpb25Qcm9wKVxuICAgICAgICA6IEFjY2Vzc29yLklERU5USVRZX0ZOO1xuXG4gICAgcmV0dXJuICh2YWx1ZSwgb3B0aW9ucykgPT5cbiAgICAgIGZ1enp5XG4gICAgICAgIC5maWx0ZXIodmFsdWUsIG9wdGlvbnMsIHtleHRyYWN0OiBtYXBwZXJ9KVxuICAgICAgICAubWFwKHJlcyA9PiBvcHRpb25zW3Jlcy5pbmRleF0pO1xuICB9XG5cbiAgX2hhc0hpbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuc2VhcmNoUmVzdWx0cy5sZW5ndGggPiAwIHx8IHRoaXMuX2hhc0N1c3RvbVZhbHVlKCk7XG4gIH1cblxuICBfaGFzRml4ZWRPcHRpb25zKCkge1xuICAgIHJldHVybiAoXG4gICAgICBBcnJheS5pc0FycmF5KHRoaXMucHJvcHMuZml4ZWRPcHRpb25zKSAmJiB0aGlzLnByb3BzLmZpeGVkT3B0aW9ucy5sZW5ndGhcbiAgICApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGlucHV0Q2xhc3NlcyA9IHt9O1xuICAgIGlucHV0Q2xhc3Nlc1t0aGlzLnByb3BzLmN1c3RvbUNsYXNzZXMuaW5wdXRdID0gQm9vbGVhbihcbiAgICAgIHRoaXMucHJvcHMuY3VzdG9tQ2xhc3Nlcy5pbnB1dFxuICAgICk7XG4gICAgY29uc3QgaW5wdXRDbGFzc0xpc3QgPSBjbGFzc05hbWVzKGlucHV0Q2xhc3Nlcyk7XG5cbiAgICBjb25zdCBjbGFzc2VzID0ge1xuICAgICAgW0RFRkFVTFRfQ0xBU1NdOiB0aGlzLnByb3BzLmRlZmF1bHRDbGFzc05hbWVzXG4gICAgfTtcbiAgICBjbGFzc2VzW3RoaXMucHJvcHMuY2xhc3NOYW1lXSA9IEJvb2xlYW4odGhpcy5wcm9wcy5jbGFzc05hbWUpO1xuICAgIGNvbnN0IGNsYXNzTGlzdCA9IGNsYXNzTmFtZXMoY2xhc3Nlcyk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFR5cGVhaGVhZFdyYXBwZXJcbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc0xpc3R9XG4gICAgICAgIGlubmVyUmVmPXtjb21wID0+IHtcbiAgICAgICAgICB0aGlzLnJvb3QgPSBjb21wO1xuICAgICAgICB9fVxuICAgICAgICB0YWJJbmRleD1cIjBcIlxuICAgICAgICBvbktleURvd249e3RoaXMuX29uS2V5RG93bn1cbiAgICAgICAgb25LZXlQcmVzcz17dGhpcy5wcm9wcy5vbktleVByZXNzfVxuICAgICAgICBvbktleVVwPXt0aGlzLnByb3BzLm9uS2V5VXB9XG4gICAgICAgIG9uRm9jdXM9e3RoaXMuX29uRm9jdXN9XG4gICAgICA+XG4gICAgICAgIHt0aGlzLl9yZW5kZXJIaWRkZW5JbnB1dCgpfVxuICAgICAgICB7dGhpcy5wcm9wcy5zZWFyY2hhYmxlID8gKFxuICAgICAgICA8SW5wdXRCb3g+XG4gICAgICAgICAgPFR5cGVhaGVhZElucHV0XG4gICAgICAgICAgICBpbm5lclJlZj17Y29tcCA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuZW50cnkgPSBjb21wO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgIGRpc2FibGVkPXt0aGlzLnByb3BzLmRpc2FibGVkfVxuICAgICAgICAgICAgey4uLnRoaXMucHJvcHMuaW5wdXRQcm9wc31cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0aGlzLnByb3BzLnBsYWNlaG9sZGVyfVxuICAgICAgICAgICAgY2xhc3NOYW1lPXtpbnB1dENsYXNzTGlzdH1cbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLmVudHJ5VmFsdWV9XG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5fb25DaGFuZ2V9XG4gICAgICAgICAgICBvbkJsdXI9e3RoaXMuX29uQmx1cn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxJbnB1dEljb24+XG4gICAgICAgICAgICA8U2VhcmNoIGhlaWdodD1cIjE4cHhcIi8+XG4gICAgICAgICAgPC9JbnB1dEljb24+XG4gICAgICAgIDwvSW5wdXRCb3g+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgICB7dGhpcy5fcmVuZGVySW5jcmVtZW50YWxTZWFyY2hSZXN1bHRzKCl9XG4gICAgICA8L1R5cGVhaGVhZFdyYXBwZXI+XG4gICAgKTtcbiAgfVxufVxuXG5UeXBlYWhlYWQucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuVHlwZWFoZWFkLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcblxuZXhwb3J0IGRlZmF1bHQgVHlwZWFoZWFkO1xuIl19