"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _reactLifecyclesCompat = require("react-lifecycles-compat");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _fuzzy = _interopRequireDefault(require("fuzzy"));

var _classnames = _interopRequireDefault(require("classnames"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _window = require("global/window");

var _accessor = _interopRequireDefault(require("./accessor"));

var _dropdownList = _interopRequireWildcard(require("./dropdown-list"));

var _icons = require("../icons");

var _keyevent = _interopRequireDefault(require("../../../constants/keyevent"));

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var DEFAULT_CLASS = 'typeahead';
/**
 * Copied mostly from 'react-typeahead', an auto-completing text input
 *
 * Renders an text input that shows options nearby that you can use the
 * keyboard or mouse to select.
 */

var TypeaheadWrapper = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-direction: column;\n  background-color: ", ";\n  box-shadow: ", ";\n\n  :focus {\n    outline: 0;\n  }\n"])), function (props) {
  return props.light ? props.theme.dropdownListBgdLT : props.theme.dropdownListBgd;
}, function (props) {
  return props.theme.dropdownListShadow;
});

var InputBox = _styledComponents["default"].div.attrs({
  className: 'typeahead__input_box'
})(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  padding: 8px;\n"])));

var TypeaheadInput = _styledComponents["default"].input(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  ", " :hover {\n    cursor: pointer;\n    background-color: ", ";\n  }\n"])), function (props) {
  return props.light ? props.theme.inputLT : props.theme.secondaryInput;
}, function (props) {
  return props.light ? props.theme.selectBackgroundLT : props.theme.secondaryInputBgd;
});

var InputIcon = _styledComponents["default"].div.attrs({
  className: 'typeahead__input_icon'
})(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n  position: absolute;\n  right: 15px;\n  top: 14px;\n  color: ", ";\n"])), function (props) {
  return props.theme.inputPlaceholderColor;
});

function generateSearchFunction(props) {
  var searchOptions = props.searchOptions,
      filterOption = props.filterOption;

  if (typeof searchOptions === 'function') {
    if (filterOption !== null) {
      _window.console.warn('searchOptions prop is being used, filterOption prop will be ignored');
    }

    return searchOptions;
  } else if (typeof filterOption === 'function') {
    // use custom filter option
    return function (value, options) {
      return options.filter(function (o) {
        return filterOption(value, o);
      });
    };
  }

  var mapper = typeof filterOption === 'string' ? _accessor["default"].generateAccessor(filterOption) : _accessor["default"].IDENTITY_FN;
  return function (value, options) {
    return _fuzzy["default"].filter(value, options, {
      extract: mapper
    }).map(function (res) {
      return options[res.index];
    });
  };
}

function getOptionsForValue(value, props, state) {
  var options = props.options,
      showOptionsWhenEmpty = props.showOptionsWhenEmpty;

  if (!props.searchable) {
    // directly pass through options if can not be searched
    return options;
  }

  if (shouldSkipSearch(value, state, showOptionsWhenEmpty)) {
    return options;
  }

  var searchOptions = generateSearchFunction(props);
  return searchOptions(value, options);
}

function shouldSkipSearch(input, state, showOptionsWhenEmpty) {
  var emptyValue = !input || input.trim().length === 0; // this.state must be checked because it may not be defined yet if this function
  // is called from within getInitialState

  var isFocused = state && state.isFocused;
  return !(showOptionsWhenEmpty && isFocused) && emptyValue;
}

var Typeahead = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Typeahead, _Component);

  var _super = _createSuper(Typeahead);

  function Typeahead(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, Typeahead);
    _this = _super.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "root", /*#__PURE__*/(0, _react.createRef)());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "entry", /*#__PURE__*/(0, _react.createRef)());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "focus", function () {
      if (_this.entry.current) {
        _this.entry.current.focus();
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_hasCustomValue", function () {
      return _this.props.allowCustomValues > 0 && _this.state.entryValue.length >= _this.props.allowCustomValues && _this.state.searchResults.indexOf(_this.state.entryValue) < 0;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_getCustomValue", function () {
      return _this._hasCustomValue() ? _this.state.entryValue : null;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onOptionSelected", function (option, event) {
      if (_this.props.searchable) {
        // reset entry input
        _this.setState({
          searchResults: getOptionsForValue('', _this.props, _this.state),
          selection: '',
          entryValue: ''
        });
      }

      return _this.props.onOptionSelected(option, event);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onTextEntryUpdated", function () {
      if (_this.props.searchable) {
        var value = _this.entry.current.value;

        _this.setState({
          searchResults: getOptionsForValue(value, _this.props, _this.state),
          selection: '',
          entryValue: value
        });
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onEnter", function (event) {
      var selection = _this.getSelection();

      if (!selection) {
        return _this.props.onKeyDown(event);
      }

      return _this._onOptionSelected(selection, event);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onEscape", function () {
      _this.setState({
        selectionIndex: null
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onTab", function (event) {
      var selection = _this.getSelection();

      var option = selection ? selection : _this.state.searchResults.length > 0 ? _this.state.searchResults[0] : null;

      if (option === null && _this._hasCustomValue()) {
        option = _this._getCustomValue();
      }

      if (option !== null) {
        return _this._onOptionSelected(option, event);
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "eventMap", function (event) {
      var events = {};
      events[_keyevent["default"].DOM_VK_UP] = _this.navUp;
      events[_keyevent["default"].DOM_VK_DOWN] = _this.navDown;
      events[_keyevent["default"].DOM_VK_RETURN] = events[_keyevent["default"].DOM_VK_ENTER] = _this._onEnter;
      events[_keyevent["default"].DOM_VK_ESCAPE] = _this._onEscape;
      events[_keyevent["default"].DOM_VK_TAB] = _this._onTab;
      return events;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_nav", function (delta) {
      if (!_this._hasHint()) {
        return;
      }

      var newIndex = _this.state.selectionIndex === null ? delta === 1 ? 0 : delta : _this.state.selectionIndex + delta;
      var length = _this.props.maxVisible ? _this.state.searchResults.slice(0, _this.props.maxVisible).length : _this.state.searchResults.length;

      if (_this._hasCustomValue()) {
        length += 1;
      }

      if (newIndex < 0) {
        newIndex += length;
      } else if (newIndex >= length) {
        newIndex -= length;
      }

      _this.setState({
        selectionIndex: newIndex
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "navDown", function () {
      _this._nav(1);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "navUp", function () {
      _this._nav(-1);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onChange", function (event) {
      if (_this.props.onChange) {
        _this.props.onChange(event);
      }

      _this._onTextEntryUpdated();
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onKeyDown", function (event) {
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
      } // Don't propagate the keystroke back to the DOM/browser


      event.preventDefault();
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onFocus", function (event) {
      _this.setState({
        isFocused: true
      });

      if (_this.props.onFocus) {
        return _this.props.onFocus(event);
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onBlur", function (event) {
      _this.setState({
        isFocused: false
      });

      if (_this.props.onBlur) {
        return _this.props.onBlur(event);
      }
    });
    _this.state = {
      /** @type {ReadonlyArray<string>} */
      searchResults: [],
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

  (0, _createClass2["default"])(Typeahead, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // call focus on entry or div to trigger key events listener
      if (this.entry.current) {
        this.entry.current.focus();
      } else {
        this.root.current.focus();
      }
    }
  }, {
    key: "_renderIncrementalSearchResults",
    value: function _renderIncrementalSearchResults() {
      return /*#__PURE__*/_react["default"].createElement(this.props.customListComponent, {
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
        displayOption: this.props.displayOption,
        selectedItems: this.props.selectedItems,
        light: this.props.light
      });
    }
  }, {
    key: "getSelection",
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
  }, {
    key: "_renderHiddenInput",
    value: function _renderHiddenInput() {
      if (!this.props.name) {
        return null;
      }

      return /*#__PURE__*/_react["default"].createElement("input", {
        type: "hidden",
        name: this.props.name,
        value: this.state.selection
      });
    }
  }, {
    key: "_hasHint",
    value: function _hasHint() {
      return this.state.searchResults.length > 0 || this._hasCustomValue();
    }
  }, {
    key: "_hasFixedOptions",
    value: function _hasFixedOptions() {
      return Array.isArray(this.props.fixedOptions) && this.props.fixedOptions.length;
    }
  }, {
    key: "render",
    value: function render() {
      var inputClasses = {};
      inputClasses[this.props.customClasses.input] = Boolean(this.props.customClasses.input);
      var inputClassList = (0, _classnames["default"])(inputClasses);
      var classes = (0, _defineProperty2["default"])({}, DEFAULT_CLASS, this.props.defaultClassNames);
      classes[this.props.className] = Boolean(this.props.className);
      var classList = (0, _classnames["default"])(classes);
      return /*#__PURE__*/_react["default"].createElement(TypeaheadWrapper, {
        className: classList,
        ref: this.root,
        tabIndex: "0",
        onKeyDown: this._onKeyDown,
        onKeyPress: this.props.onKeyPress,
        onKeyUp: this.props.onKeyUp,
        onFocus: this._onFocus,
        light: this.props.light
      }, this._renderHiddenInput(), this.props.searchable ? /*#__PURE__*/_react["default"].createElement(InputBox, null, /*#__PURE__*/_react["default"].createElement(TypeaheadInput, (0, _extends2["default"])({
        ref: this.entry,
        type: "text",
        disabled: this.props.disabled
      }, this.props.inputProps, {
        placeholder: this.props.placeholder,
        className: inputClassList,
        value: this.state.entryValue,
        onChange: this._onChange,
        onBlur: this._onBlur,
        light: this.props.light
      })), /*#__PURE__*/_react["default"].createElement(InputIcon, null, /*#__PURE__*/_react["default"].createElement(this.props.inputIcon, {
        height: "18px"
      }))) : null, this._renderIncrementalSearchResults());
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      //  invoked after a component is instantiated as well as before it is re-rendered
      var searchResults = getOptionsForValue(state.entryValue, props, state);
      return {
        searchResults: searchResults
      };
    }
  }]);
  return Typeahead;
}(_react.Component);

(0, _defineProperty2["default"])(Typeahead, "propTypes", {
  name: _propTypes["default"].string,
  customClasses: _propTypes["default"].object,
  maxVisible: _propTypes["default"].number,
  resultsTruncatedMessage: _propTypes["default"].string,
  options: _propTypes["default"].arrayOf(_propTypes["default"].any),
  fixedOptions: _propTypes["default"].arrayOf(_propTypes["default"].any),
  allowCustomValues: _propTypes["default"].number,
  initialValue: _propTypes["default"].string,
  value: _propTypes["default"].string,
  placeholder: _propTypes["default"].string,
  disabled: _propTypes["default"].bool,
  textarea: _propTypes["default"].bool,
  inputProps: _propTypes["default"].object,
  onOptionSelected: _propTypes["default"].func,
  onChange: _propTypes["default"].func,
  onKeyDown: _propTypes["default"].func,
  onKeyPress: _propTypes["default"].func,
  onKeyUp: _propTypes["default"].func,
  onFocus: _propTypes["default"].func,
  onBlur: _propTypes["default"].func,
  filterOption: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].func]),
  searchOptions: _propTypes["default"].func,
  displayOption: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].func]),
  inputDisplayOption: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].func]),
  formInputOption: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].func]),
  defaultClassNames: _propTypes["default"].bool,
  customListComponent: _propTypes["default"].oneOfType([_propTypes["default"].element, _propTypes["default"].func]),
  customListItemComponent: _propTypes["default"].oneOfType([_propTypes["default"].element, _propTypes["default"].func]),
  customListHeaderComponent: _propTypes["default"].oneOfType([_propTypes["default"].element, _propTypes["default"].func]),
  showOptionsWhenEmpty: _propTypes["default"].bool,
  searchable: _propTypes["default"].bool
});
(0, _defineProperty2["default"])(Typeahead, "defaultProps", {
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
  customListComponent: _dropdownList["default"],
  customListItemComponent: _dropdownList.ListItem,
  inputIcon: _icons.Search,
  customListHeaderComponent: null,
  showOptionsWhenEmpty: true,
  searchable: true,
  resultsTruncatedMessage: null
});
(0, _reactLifecyclesCompat.polyfill)(Typeahead);
var _default = Typeahead;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL3R5cGVhaGVhZC5qcyJdLCJuYW1lcyI6WyJERUZBVUxUX0NMQVNTIiwiVHlwZWFoZWFkV3JhcHBlciIsInN0eWxlZCIsImRpdiIsInByb3BzIiwibGlnaHQiLCJ0aGVtZSIsImRyb3Bkb3duTGlzdEJnZExUIiwiZHJvcGRvd25MaXN0QmdkIiwiZHJvcGRvd25MaXN0U2hhZG93IiwiSW5wdXRCb3giLCJhdHRycyIsImNsYXNzTmFtZSIsIlR5cGVhaGVhZElucHV0IiwiaW5wdXQiLCJpbnB1dExUIiwic2Vjb25kYXJ5SW5wdXQiLCJzZWxlY3RCYWNrZ3JvdW5kTFQiLCJzZWNvbmRhcnlJbnB1dEJnZCIsIklucHV0SWNvbiIsImlucHV0UGxhY2Vob2xkZXJDb2xvciIsImdlbmVyYXRlU2VhcmNoRnVuY3Rpb24iLCJzZWFyY2hPcHRpb25zIiwiZmlsdGVyT3B0aW9uIiwiQ29uc29sZSIsIndhcm4iLCJ2YWx1ZSIsIm9wdGlvbnMiLCJmaWx0ZXIiLCJvIiwibWFwcGVyIiwiQWNjZXNzb3IiLCJnZW5lcmF0ZUFjY2Vzc29yIiwiSURFTlRJVFlfRk4iLCJmdXp6eSIsImV4dHJhY3QiLCJtYXAiLCJyZXMiLCJpbmRleCIsImdldE9wdGlvbnNGb3JWYWx1ZSIsInN0YXRlIiwic2hvd09wdGlvbnNXaGVuRW1wdHkiLCJzZWFyY2hhYmxlIiwic2hvdWxkU2tpcFNlYXJjaCIsImVtcHR5VmFsdWUiLCJ0cmltIiwibGVuZ3RoIiwiaXNGb2N1c2VkIiwiVHlwZWFoZWFkIiwiZW50cnkiLCJjdXJyZW50IiwiZm9jdXMiLCJhbGxvd0N1c3RvbVZhbHVlcyIsImVudHJ5VmFsdWUiLCJzZWFyY2hSZXN1bHRzIiwiaW5kZXhPZiIsIl9oYXNDdXN0b21WYWx1ZSIsIm9wdGlvbiIsImV2ZW50Iiwic2V0U3RhdGUiLCJzZWxlY3Rpb24iLCJvbk9wdGlvblNlbGVjdGVkIiwiZ2V0U2VsZWN0aW9uIiwib25LZXlEb3duIiwiX29uT3B0aW9uU2VsZWN0ZWQiLCJzZWxlY3Rpb25JbmRleCIsIl9nZXRDdXN0b21WYWx1ZSIsImV2ZW50cyIsIktleUV2ZW50IiwiRE9NX1ZLX1VQIiwibmF2VXAiLCJET01fVktfRE9XTiIsIm5hdkRvd24iLCJET01fVktfUkVUVVJOIiwiRE9NX1ZLX0VOVEVSIiwiX29uRW50ZXIiLCJET01fVktfRVNDQVBFIiwiX29uRXNjYXBlIiwiRE9NX1ZLX1RBQiIsIl9vblRhYiIsImRlbHRhIiwiX2hhc0hpbnQiLCJuZXdJbmRleCIsIm1heFZpc2libGUiLCJzbGljZSIsIl9uYXYiLCJvbkNoYW5nZSIsIl9vblRleHRFbnRyeVVwZGF0ZWQiLCJzaGlmdEtleSIsImhhbmRsZXIiLCJldmVudE1hcCIsImtleUNvZGUiLCJwcmV2ZW50RGVmYXVsdCIsIm9uRm9jdXMiLCJvbkJsdXIiLCJpbml0aWFsVmFsdWUiLCJyb290IiwiZml4ZWRPcHRpb25zIiwicmVzdWx0c1RydW5jYXRlZE1lc3NhZ2UiLCJjdXN0b21DbGFzc2VzIiwiY3VzdG9tTGlzdEl0ZW1Db21wb25lbnQiLCJjdXN0b21MaXN0SGVhZGVyQ29tcG9uZW50IiwiZGVmYXVsdENsYXNzTmFtZXMiLCJkaXNwbGF5T3B0aW9uIiwic2VsZWN0ZWRJdGVtcyIsIl9oYXNGaXhlZE9wdGlvbnMiLCJuYW1lIiwiQXJyYXkiLCJpc0FycmF5IiwiaW5wdXRDbGFzc2VzIiwiQm9vbGVhbiIsImlucHV0Q2xhc3NMaXN0IiwiY2xhc3NlcyIsImNsYXNzTGlzdCIsIl9vbktleURvd24iLCJvbktleVByZXNzIiwib25LZXlVcCIsIl9vbkZvY3VzIiwiX3JlbmRlckhpZGRlbklucHV0IiwiZGlzYWJsZWQiLCJpbnB1dFByb3BzIiwicGxhY2Vob2xkZXIiLCJfb25DaGFuZ2UiLCJfb25CbHVyIiwiX3JlbmRlckluY3JlbWVudGFsU2VhcmNoUmVzdWx0cyIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsInN0cmluZyIsIm9iamVjdCIsIm51bWJlciIsImFycmF5T2YiLCJhbnkiLCJib29sIiwidGV4dGFyZWEiLCJmdW5jIiwib25lT2ZUeXBlIiwiaW5wdXREaXNwbGF5T3B0aW9uIiwiZm9ybUlucHV0T3B0aW9uIiwiY3VzdG9tTGlzdENvbXBvbmVudCIsImVsZW1lbnQiLCJEcm9wZG93bkxpc3QiLCJMaXN0SXRlbSIsImlucHV0SWNvbiIsIlNlYXJjaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTUEsYUFBYSxHQUFHLFdBQXRCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQU1DLGdCQUFnQixHQUFHQyw2QkFBT0MsR0FBViwwTkFHQSxVQUFBQyxLQUFLO0FBQUEsU0FDdkJBLEtBQUssQ0FBQ0MsS0FBTixHQUFjRCxLQUFLLENBQUNFLEtBQU4sQ0FBWUMsaUJBQTFCLEdBQThDSCxLQUFLLENBQUNFLEtBQU4sQ0FBWUUsZUFEbkM7QUFBQSxDQUhMLEVBS04sVUFBQUosS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0UsS0FBTixDQUFZRyxrQkFBaEI7QUFBQSxDQUxDLENBQXRCOztBQVlBLElBQU1DLFFBQVEsR0FBR1IsNkJBQU9DLEdBQVAsQ0FBV1EsS0FBWCxDQUFpQjtBQUNoQ0MsRUFBQUEsU0FBUyxFQUFFO0FBRHFCLENBQWpCLENBQUgsMkdBQWQ7O0FBTUEsSUFBTUMsY0FBYyxHQUFHWCw2QkFBT1ksS0FBVixvS0FDaEIsVUFBQVYsS0FBSztBQUFBLFNBQUtBLEtBQUssQ0FBQ0MsS0FBTixHQUFjRCxLQUFLLENBQUNFLEtBQU4sQ0FBWVMsT0FBMUIsR0FBb0NYLEtBQUssQ0FBQ0UsS0FBTixDQUFZVSxjQUFyRDtBQUFBLENBRFcsRUFHSSxVQUFBWixLQUFLO0FBQUEsU0FDdkJBLEtBQUssQ0FBQ0MsS0FBTixHQUFjRCxLQUFLLENBQUNFLEtBQU4sQ0FB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bUJBY1oxRCxLQWRZLEVBY0wsQ0FBRSxDQWRHO0FBZXBCbUMsRUFBQUEsT0Fmb0IsbUJBZVpuQyxLQWZZLEVBZUwsQ0FBRSxDQWZHO0FBZ0JwQm9DLEVBQUFBLE1BaEJvQixrQkFnQmJwQyxLQWhCYSxFQWdCTixDQUFFLENBaEJJO0FBaUJwQm5DLEVBQUFBLFlBQVksRUFBRSxJQWpCTTtBQWtCcEJELEVBQUFBLGFBQWEsRUFBRSxJQWxCSztBQW1CcEJrSCxFQUFBQSxrQkFBa0IsRUFBRSxJQW5CQTtBQW9CcEJsQyxFQUFBQSxpQkFBaUIsRUFBRSxJQXBCQztBQXFCcEJvQyxFQUFBQSxtQkFBbUIsRUFBRUUsd0JBckJEO0FBc0JwQnhDLEVBQUFBLHVCQUF1QixFQUFFeUMsc0JBdEJMO0FBdUJwQkMsRUFBQUEsU0FBUyxFQUFFQyxhQXZCUztBQXdCcEIxQyxFQUFBQSx5QkFBeUIsRUFBRSxJQXhCUDtBQXlCcEI1RCxFQUFBQSxvQkFBb0IsRUFBRSxJQXpCRjtBQTBCcEJDLEVBQUFBLFVBQVUsRUFBRSxJQTFCUTtBQTJCcEJ3RCxFQUFBQSx1QkFBdUIsRUFBRTtBQTNCTCxDO0FBc1Z4QixxQ0FBU2xELFNBQVQ7ZUFFZUEsUyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudCwgY3JlYXRlUmVmfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge3BvbHlmaWxsfSBmcm9tICdyZWFjdC1saWZlY3ljbGVzLWNvbXBhdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGZ1enp5IGZyb20gJ2Z1enp5JztcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge2NvbnNvbGUgYXMgQ29uc29sZX0gZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5cbmltcG9ydCBBY2Nlc3NvciBmcm9tICcuL2FjY2Vzc29yJztcbmltcG9ydCBEcm9wZG93bkxpc3QsIHtMaXN0SXRlbX0gZnJvbSAnLi9kcm9wZG93bi1saXN0JztcbmltcG9ydCB7U2VhcmNofSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQgS2V5RXZlbnQgZnJvbSAnY29uc3RhbnRzL2tleWV2ZW50JztcblxuY29uc3QgREVGQVVMVF9DTEFTUyA9ICd0eXBlYWhlYWQnO1xuLyoqXG4gKiBDb3BpZWQgbW9zdGx5IGZyb20gJ3JlYWN0LXR5cGVhaGVhZCcsIGFuIGF1dG8tY29tcGxldGluZyB0ZXh0IGlucHV0XG4gKlxuICogUmVuZGVycyBhbiB0ZXh0IGlucHV0IHRoYXQgc2hvd3Mgb3B0aW9ucyBuZWFyYnkgdGhhdCB5b3UgY2FuIHVzZSB0aGVcbiAqIGtleWJvYXJkIG9yIG1vdXNlIHRvIHNlbGVjdC5cbiAqL1xuXG5jb25zdCBUeXBlYWhlYWRXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PlxuICAgIHByb3BzLmxpZ2h0ID8gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0QmdkTFQgOiBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RCZ2R9O1xuICBib3gtc2hhZG93OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdFNoYWRvd307XG5cbiAgOmZvY3VzIHtcbiAgICBvdXRsaW5lOiAwO1xuICB9XG5gO1xuXG5jb25zdCBJbnB1dEJveCA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICd0eXBlYWhlYWRfX2lucHV0X2JveCdcbn0pYFxuICBwYWRkaW5nOiA4cHg7XG5gO1xuXG5jb25zdCBUeXBlYWhlYWRJbnB1dCA9IHN0eWxlZC5pbnB1dGBcbiAgJHtwcm9wcyA9PiAocHJvcHMubGlnaHQgPyBwcm9wcy50aGVtZS5pbnB1dExUIDogcHJvcHMudGhlbWUuc2Vjb25kYXJ5SW5wdXQpfSA6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+XG4gICAgICBwcm9wcy5saWdodCA/IHByb3BzLnRoZW1lLnNlbGVjdEJhY2tncm91bmRMVCA6IHByb3BzLnRoZW1lLnNlY29uZGFyeUlucHV0QmdkfTtcbiAgfVxuYDtcblxuY29uc3QgSW5wdXRJY29uID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ3R5cGVhaGVhZF9faW5wdXRfaWNvbidcbn0pYFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHJpZ2h0OiAxNXB4O1xuICB0b3A6IDE0cHg7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmlucHV0UGxhY2Vob2xkZXJDb2xvcn07XG5gO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVNlYXJjaEZ1bmN0aW9uKHByb3BzKSB7XG4gIGNvbnN0IHtzZWFyY2hPcHRpb25zLCBmaWx0ZXJPcHRpb259ID0gcHJvcHM7XG4gIGlmICh0eXBlb2Ygc2VhcmNoT3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGlmIChmaWx0ZXJPcHRpb24gIT09IG51bGwpIHtcbiAgICAgIENvbnNvbGUud2Fybignc2VhcmNoT3B0aW9ucyBwcm9wIGlzIGJlaW5nIHVzZWQsIGZpbHRlck9wdGlvbiBwcm9wIHdpbGwgYmUgaWdub3JlZCcpO1xuICAgIH1cbiAgICByZXR1cm4gc2VhcmNoT3B0aW9ucztcbiAgfSBlbHNlIGlmICh0eXBlb2YgZmlsdGVyT3B0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gdXNlIGN1c3RvbSBmaWx0ZXIgb3B0aW9uXG4gICAgcmV0dXJuICh2YWx1ZSwgb3B0aW9ucykgPT4gb3B0aW9ucy5maWx0ZXIobyA9PiBmaWx0ZXJPcHRpb24odmFsdWUsIG8pKTtcbiAgfVxuXG4gIGNvbnN0IG1hcHBlciA9XG4gICAgdHlwZW9mIGZpbHRlck9wdGlvbiA9PT0gJ3N0cmluZydcbiAgICAgID8gQWNjZXNzb3IuZ2VuZXJhdGVBY2Nlc3NvcihmaWx0ZXJPcHRpb24pXG4gICAgICA6IEFjY2Vzc29yLklERU5USVRZX0ZOO1xuXG4gIHJldHVybiAodmFsdWUsIG9wdGlvbnMpID0+XG4gICAgZnV6enkuZmlsdGVyKHZhbHVlLCBvcHRpb25zLCB7ZXh0cmFjdDogbWFwcGVyfSkubWFwKHJlcyA9PiBvcHRpb25zW3Jlcy5pbmRleF0pO1xufVxuXG5mdW5jdGlvbiBnZXRPcHRpb25zRm9yVmFsdWUodmFsdWUsIHByb3BzLCBzdGF0ZSkge1xuICBjb25zdCB7b3B0aW9ucywgc2hvd09wdGlvbnNXaGVuRW1wdHl9ID0gcHJvcHM7XG5cbiAgaWYgKCFwcm9wcy5zZWFyY2hhYmxlKSB7XG4gICAgLy8gZGlyZWN0bHkgcGFzcyB0aHJvdWdoIG9wdGlvbnMgaWYgY2FuIG5vdCBiZSBzZWFyY2hlZFxuICAgIHJldHVybiBvcHRpb25zO1xuICB9XG4gIGlmIChzaG91bGRTa2lwU2VhcmNoKHZhbHVlLCBzdGF0ZSwgc2hvd09wdGlvbnNXaGVuRW1wdHkpKSB7XG4gICAgcmV0dXJuIG9wdGlvbnM7XG4gIH1cblxuICBjb25zdCBzZWFyY2hPcHRpb25zID0gZ2VuZXJhdGVTZWFyY2hGdW5jdGlvbihwcm9wcyk7XG4gIHJldHVybiBzZWFyY2hPcHRpb25zKHZhbHVlLCBvcHRpb25zKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkU2tpcFNlYXJjaChpbnB1dCwgc3RhdGUsIHNob3dPcHRpb25zV2hlbkVtcHR5KSB7XG4gIGNvbnN0IGVtcHR5VmFsdWUgPSAhaW5wdXQgfHwgaW5wdXQudHJpbSgpLmxlbmd0aCA9PT0gMDtcblxuICAvLyB0aGlzLnN0YXRlIG11c3QgYmUgY2hlY2tlZCBiZWNhdXNlIGl0IG1heSBub3QgYmUgZGVmaW5lZCB5ZXQgaWYgdGhpcyBmdW5jdGlvblxuICAvLyBpcyBjYWxsZWQgZnJvbSB3aXRoaW4gZ2V0SW5pdGlhbFN0YXRlXG4gIGNvbnN0IGlzRm9jdXNlZCA9IHN0YXRlICYmIHN0YXRlLmlzRm9jdXNlZDtcbiAgcmV0dXJuICEoc2hvd09wdGlvbnNXaGVuRW1wdHkgJiYgaXNGb2N1c2VkKSAmJiBlbXB0eVZhbHVlO1xufVxuXG5jbGFzcyBUeXBlYWhlYWQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgY3VzdG9tQ2xhc3NlczogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBtYXhWaXNpYmxlOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHJlc3VsdHNUcnVuY2F0ZWRNZXNzYWdlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIG9wdGlvbnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5hbnkpLFxuICAgIGZpeGVkT3B0aW9uczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmFueSksXG4gICAgYWxsb3dDdXN0b21WYWx1ZXM6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgaW5pdGlhbFZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHBsYWNlaG9sZGVyOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGRpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgICB0ZXh0YXJlYTogUHJvcFR5cGVzLmJvb2wsXG4gICAgaW5wdXRQcm9wczogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBvbk9wdGlvblNlbGVjdGVkOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25LZXlEb3duOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbktleVByZXNzOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbktleVVwOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbkZvY3VzOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbkJsdXI6IFByb3BUeXBlcy5mdW5jLFxuICAgIGZpbHRlck9wdGlvbjogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLmZ1bmNdKSxcbiAgICBzZWFyY2hPcHRpb25zOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBkaXNwbGF5T3B0aW9uOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuc3RyaW5nLCBQcm9wVHlwZXMuZnVuY10pLFxuICAgIGlucHV0RGlzcGxheU9wdGlvbjogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLmZ1bmNdKSxcbiAgICBmb3JtSW5wdXRPcHRpb246IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5mdW5jXSksXG4gICAgZGVmYXVsdENsYXNzTmFtZXM6IFByb3BUeXBlcy5ib29sLFxuICAgIGN1c3RvbUxpc3RDb21wb25lbnQ6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5lbGVtZW50LCBQcm9wVHlwZXMuZnVuY10pLFxuICAgIGN1c3RvbUxpc3RJdGVtQ29tcG9uZW50OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuZWxlbWVudCwgUHJvcFR5cGVzLmZ1bmNdKSxcbiAgICBjdXN0b21MaXN0SGVhZGVyQ29tcG9uZW50OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuZWxlbWVudCwgUHJvcFR5cGVzLmZ1bmNdKSxcbiAgICBzaG93T3B0aW9uc1doZW5FbXB0eTogUHJvcFR5cGVzLmJvb2wsXG4gICAgc2VhcmNoYWJsZTogUHJvcFR5cGVzLmJvb2xcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIG9wdGlvbnM6IFtdLFxuICAgIGN1c3RvbUNsYXNzZXM6IHt9LFxuICAgIGFsbG93Q3VzdG9tVmFsdWVzOiAwLFxuICAgIGluaXRpYWxWYWx1ZTogJycsXG4gICAgdmFsdWU6ICcnLFxuICAgIHBsYWNlaG9sZGVyOiAnJyxcbiAgICBkaXNhYmxlZDogZmFsc2UsXG4gICAgdGV4dGFyZWE6IGZhbHNlLFxuICAgIGlucHV0UHJvcHM6IHt9LFxuICAgIG9uT3B0aW9uU2VsZWN0ZWQob3B0aW9uKSB7fSxcbiAgICBvbkNoYW5nZShldmVudCkge30sXG4gICAgb25LZXlEb3duKGV2ZW50KSB7fSxcbiAgICBvbktleVByZXNzKGV2ZW50KSB7fSxcbiAgICBvbktleVVwKGV2ZW50KSB7fSxcbiAgICBvbkZvY3VzKGV2ZW50KSB7fSxcbiAgICBvbkJsdXIoZXZlbnQpIHt9LFxuICAgIGZpbHRlck9wdGlvbjogbnVsbCxcbiAgICBzZWFyY2hPcHRpb25zOiBudWxsLFxuICAgIGlucHV0RGlzcGxheU9wdGlvbjogbnVsbCxcbiAgICBkZWZhdWx0Q2xhc3NOYW1lczogdHJ1ZSxcbiAgICBjdXN0b21MaXN0Q29tcG9uZW50OiBEcm9wZG93bkxpc3QsXG4gICAgY3VzdG9tTGlzdEl0ZW1Db21wb25lbnQ6IExpc3RJdGVtLFxuICAgIGlucHV0SWNvbjogU2VhcmNoLFxuICAgIGN1c3RvbUxpc3RIZWFkZXJDb21wb25lbnQ6IG51bGwsXG4gICAgc2hvd09wdGlvbnNXaGVuRW1wdHk6IHRydWUsXG4gICAgc2VhcmNoYWJsZTogdHJ1ZSxcbiAgICByZXN1bHRzVHJ1bmNhdGVkTWVzc2FnZTogbnVsbFxuICB9O1xuXG4gIHN0YXRpYyBnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMocHJvcHMsIHN0YXRlKSB7XG4gICAgLy8gIGludm9rZWQgYWZ0ZXIgYSBjb21wb25lbnQgaXMgaW5zdGFudGlhdGVkIGFzIHdlbGwgYXMgYmVmb3JlIGl0IGlzIHJlLXJlbmRlcmVkXG4gICAgY29uc3Qgc2VhcmNoUmVzdWx0cyA9IGdldE9wdGlvbnNGb3JWYWx1ZShzdGF0ZS5lbnRyeVZhbHVlLCBwcm9wcywgc3RhdGUpO1xuXG4gICAgcmV0dXJuIHtzZWFyY2hSZXN1bHRzfTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIC8qKiBAdHlwZSB7UmVhZG9ubHlBcnJheTxzdHJpbmc+fSAqL1xuICAgICAgc2VhcmNoUmVzdWx0czogW10sXG5cbiAgICAgIC8vIFRoaXMgc2hvdWxkIGJlIGNhbGxlZCBzb21ldGhpbmcgZWxzZSwgJ2VudHJ5VmFsdWUnXG4gICAgICBlbnRyeVZhbHVlOiB0aGlzLnByb3BzLnZhbHVlIHx8IHRoaXMucHJvcHMuaW5pdGlhbFZhbHVlLFxuXG4gICAgICAvLyBBIHZhbGlkIHR5cGVhaGVhZCB2YWx1ZVxuICAgICAgc2VsZWN0aW9uOiB0aGlzLnByb3BzLnZhbHVlLFxuXG4gICAgICAvLyBJbmRleCBvZiB0aGUgc2VsZWN0aW9uXG4gICAgICBzZWxlY3Rpb25JbmRleDogbnVsbCxcblxuICAgICAgLy8gS2VlcCB0cmFjayBvZiB0aGUgZm9jdXMgc3RhdGUgb2YgdGhlIGlucHV0IGVsZW1lbnQsIHRvIGRldGVybWluZVxuICAgICAgLy8gd2hldGhlciB0byBzaG93IG9wdGlvbnMgd2hlbiBlbXB0eSAoaWYgc2hvd09wdGlvbnNXaGVuRW1wdHkgaXMgdHJ1ZSlcbiAgICAgIGlzRm9jdXNlZDogZmFsc2VcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgLy8gY2FsbCBmb2N1cyBvbiBlbnRyeSBvciBkaXYgdG8gdHJpZ2dlciBrZXkgZXZlbnRzIGxpc3RlbmVyXG4gICAgaWYgKHRoaXMuZW50cnkuY3VycmVudCkge1xuICAgICAgdGhpcy5lbnRyeS5jdXJyZW50LmZvY3VzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucm9vdC5jdXJyZW50LmZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgcm9vdCA9IGNyZWF0ZVJlZigpO1xuICBlbnRyeSA9IGNyZWF0ZVJlZigpO1xuXG4gIGZvY3VzID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLmVudHJ5LmN1cnJlbnQpIHtcbiAgICAgIHRoaXMuZW50cnkuY3VycmVudC5mb2N1cygpO1xuICAgIH1cbiAgfTtcblxuICBfaGFzQ3VzdG9tVmFsdWUgPSAoKSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMucHJvcHMuYWxsb3dDdXN0b21WYWx1ZXMgPiAwICYmXG4gICAgICB0aGlzLnN0YXRlLmVudHJ5VmFsdWUubGVuZ3RoID49IHRoaXMucHJvcHMuYWxsb3dDdXN0b21WYWx1ZXMgJiZcbiAgICAgIHRoaXMuc3RhdGUuc2VhcmNoUmVzdWx0cy5pbmRleE9mKHRoaXMuc3RhdGUuZW50cnlWYWx1ZSkgPCAwXG4gICAgKTtcbiAgfTtcblxuICBfZ2V0Q3VzdG9tVmFsdWUgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuX2hhc0N1c3RvbVZhbHVlKCkgPyB0aGlzLnN0YXRlLmVudHJ5VmFsdWUgOiBudWxsO1xuICB9O1xuXG4gIF9yZW5kZXJJbmNyZW1lbnRhbFNlYXJjaFJlc3VsdHMoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDx0aGlzLnByb3BzLmN1c3RvbUxpc3RDb21wb25lbnRcbiAgICAgICAgZml4ZWRPcHRpb25zPXt0aGlzLnByb3BzLmZpeGVkT3B0aW9uc31cbiAgICAgICAgb3B0aW9ucz17XG4gICAgICAgICAgdGhpcy5wcm9wcy5tYXhWaXNpYmxlXG4gICAgICAgICAgICA/IHRoaXMuc3RhdGUuc2VhcmNoUmVzdWx0cy5zbGljZSgwLCB0aGlzLnByb3BzLm1heFZpc2libGUpXG4gICAgICAgICAgICA6IHRoaXMuc3RhdGUuc2VhcmNoUmVzdWx0c1xuICAgICAgICB9XG4gICAgICAgIGFyZVJlc3VsdHNUcnVuY2F0ZWQ9e1xuICAgICAgICAgIHRoaXMucHJvcHMubWF4VmlzaWJsZSAmJiB0aGlzLnN0YXRlLnNlYXJjaFJlc3VsdHMubGVuZ3RoID4gdGhpcy5wcm9wcy5tYXhWaXNpYmxlXG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0c1RydW5jYXRlZE1lc3NhZ2U9e3RoaXMucHJvcHMucmVzdWx0c1RydW5jYXRlZE1lc3NhZ2V9XG4gICAgICAgIG9uT3B0aW9uU2VsZWN0ZWQ9e3RoaXMuX29uT3B0aW9uU2VsZWN0ZWR9XG4gICAgICAgIGFsbG93Q3VzdG9tVmFsdWVzPXt0aGlzLnByb3BzLmFsbG93Q3VzdG9tVmFsdWVzfVxuICAgICAgICBjdXN0b21WYWx1ZT17dGhpcy5fZ2V0Q3VzdG9tVmFsdWUoKX1cbiAgICAgICAgY3VzdG9tQ2xhc3Nlcz17dGhpcy5wcm9wcy5jdXN0b21DbGFzc2VzfVxuICAgICAgICBjdXN0b21MaXN0SXRlbUNvbXBvbmVudD17dGhpcy5wcm9wcy5jdXN0b21MaXN0SXRlbUNvbXBvbmVudH1cbiAgICAgICAgY3VzdG9tTGlzdEhlYWRlckNvbXBvbmVudD17dGhpcy5wcm9wcy5jdXN0b21MaXN0SGVhZGVyQ29tcG9uZW50fVxuICAgICAgICBzZWxlY3Rpb25JbmRleD17dGhpcy5zdGF0ZS5zZWxlY3Rpb25JbmRleH1cbiAgICAgICAgZGVmYXVsdENsYXNzTmFtZXM9e3RoaXMucHJvcHMuZGVmYXVsdENsYXNzTmFtZXN9XG4gICAgICAgIGRpc3BsYXlPcHRpb249e3RoaXMucHJvcHMuZGlzcGxheU9wdGlvbn1cbiAgICAgICAgc2VsZWN0ZWRJdGVtcz17dGhpcy5wcm9wcy5zZWxlY3RlZEl0ZW1zfVxuICAgICAgICBsaWdodD17dGhpcy5wcm9wcy5saWdodH1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIGdldFNlbGVjdGlvbigpIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLnN0YXRlLnNlbGVjdGlvbkluZGV4O1xuXG4gICAgaWYgKHRoaXMuX2hhc0N1c3RvbVZhbHVlKCkpIHtcbiAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS5lbnRyeVZhbHVlO1xuICAgICAgfVxuICAgICAgaW5kZXgtLTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2hhc0ZpeGVkT3B0aW9ucygpKSB7XG4gICAgICByZXR1cm4gaW5kZXggPCB0aGlzLnByb3BzLmZpeGVkT3B0aW9ucy5sZW5ndGhcbiAgICAgICAgPyB0aGlzLnByb3BzLmZpeGVkT3B0aW9uc1tpbmRleF1cbiAgICAgICAgOiB0aGlzLnN0YXRlLnNlYXJjaFJlc3VsdHNbaW5kZXggLSB0aGlzLnByb3BzLmZpeGVkT3B0aW9ucy5sZW5ndGhdO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5zZWFyY2hSZXN1bHRzW2luZGV4XTtcbiAgfVxuXG4gIF9vbk9wdGlvblNlbGVjdGVkID0gKG9wdGlvbiwgZXZlbnQpID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5zZWFyY2hhYmxlKSB7XG4gICAgICAvLyByZXNldCBlbnRyeSBpbnB1dFxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHNlYXJjaFJlc3VsdHM6IGdldE9wdGlvbnNGb3JWYWx1ZSgnJywgdGhpcy5wcm9wcywgdGhpcy5zdGF0ZSksXG4gICAgICAgIHNlbGVjdGlvbjogJycsXG4gICAgICAgIGVudHJ5VmFsdWU6ICcnXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5vbk9wdGlvblNlbGVjdGVkKG9wdGlvbiwgZXZlbnQpO1xuICB9O1xuXG4gIC8vIHVzZSAoKSA9PiB7fSB0byBhdm9pZCBiaW5kaW5nICd0aGlzJ1xuICBfb25UZXh0RW50cnlVcGRhdGVkID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLnNlYXJjaGFibGUpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5lbnRyeS5jdXJyZW50LnZhbHVlO1xuXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgc2VhcmNoUmVzdWx0czogZ2V0T3B0aW9uc0ZvclZhbHVlKHZhbHVlLCB0aGlzLnByb3BzLCB0aGlzLnN0YXRlKSxcbiAgICAgICAgc2VsZWN0aW9uOiAnJyxcbiAgICAgICAgZW50cnlWYWx1ZTogdmFsdWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBfb25FbnRlciA9IGV2ZW50ID0+IHtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSB0aGlzLmdldFNlbGVjdGlvbigpO1xuICAgIGlmICghc2VsZWN0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5vbktleURvd24oZXZlbnQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fb25PcHRpb25TZWxlY3RlZChzZWxlY3Rpb24sIGV2ZW50KTtcbiAgfTtcblxuICBfb25Fc2NhcGUgPSAoKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3Rpb25JbmRleDogbnVsbFxuICAgIH0pO1xuICB9O1xuXG4gIF9vblRhYiA9IGV2ZW50ID0+IHtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSB0aGlzLmdldFNlbGVjdGlvbigpO1xuICAgIGxldCBvcHRpb24gPSBzZWxlY3Rpb25cbiAgICAgID8gc2VsZWN0aW9uXG4gICAgICA6IHRoaXMuc3RhdGUuc2VhcmNoUmVzdWx0cy5sZW5ndGggPiAwXG4gICAgICA/IHRoaXMuc3RhdGUuc2VhcmNoUmVzdWx0c1swXVxuICAgICAgOiBudWxsO1xuXG4gICAgaWYgKG9wdGlvbiA9PT0gbnVsbCAmJiB0aGlzLl9oYXNDdXN0b21WYWx1ZSgpKSB7XG4gICAgICBvcHRpb24gPSB0aGlzLl9nZXRDdXN0b21WYWx1ZSgpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb24gIT09IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLl9vbk9wdGlvblNlbGVjdGVkKG9wdGlvbiwgZXZlbnQpO1xuICAgIH1cbiAgfTtcblxuICBldmVudE1hcCA9IGV2ZW50ID0+IHtcbiAgICBjb25zdCBldmVudHMgPSB7fTtcblxuICAgIGV2ZW50c1tLZXlFdmVudC5ET01fVktfVVBdID0gdGhpcy5uYXZVcDtcbiAgICBldmVudHNbS2V5RXZlbnQuRE9NX1ZLX0RPV05dID0gdGhpcy5uYXZEb3duO1xuICAgIGV2ZW50c1tLZXlFdmVudC5ET01fVktfUkVUVVJOXSA9IGV2ZW50c1tLZXlFdmVudC5ET01fVktfRU5URVJdID0gdGhpcy5fb25FbnRlcjtcbiAgICBldmVudHNbS2V5RXZlbnQuRE9NX1ZLX0VTQ0FQRV0gPSB0aGlzLl9vbkVzY2FwZTtcbiAgICBldmVudHNbS2V5RXZlbnQuRE9NX1ZLX1RBQl0gPSB0aGlzLl9vblRhYjtcblxuICAgIHJldHVybiBldmVudHM7XG4gIH07XG5cbiAgX25hdiA9IGRlbHRhID0+IHtcbiAgICBpZiAoIXRoaXMuX2hhc0hpbnQoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgbmV3SW5kZXggPVxuICAgICAgdGhpcy5zdGF0ZS5zZWxlY3Rpb25JbmRleCA9PT0gbnVsbFxuICAgICAgICA/IGRlbHRhID09PSAxXG4gICAgICAgICAgPyAwXG4gICAgICAgICAgOiBkZWx0YVxuICAgICAgICA6IHRoaXMuc3RhdGUuc2VsZWN0aW9uSW5kZXggKyBkZWx0YTtcbiAgICBsZXQgbGVuZ3RoID0gdGhpcy5wcm9wcy5tYXhWaXNpYmxlXG4gICAgICA/IHRoaXMuc3RhdGUuc2VhcmNoUmVzdWx0cy5zbGljZSgwLCB0aGlzLnByb3BzLm1heFZpc2libGUpLmxlbmd0aFxuICAgICAgOiB0aGlzLnN0YXRlLnNlYXJjaFJlc3VsdHMubGVuZ3RoO1xuICAgIGlmICh0aGlzLl9oYXNDdXN0b21WYWx1ZSgpKSB7XG4gICAgICBsZW5ndGggKz0gMTtcbiAgICB9XG5cbiAgICBpZiAobmV3SW5kZXggPCAwKSB7XG4gICAgICBuZXdJbmRleCArPSBsZW5ndGg7XG4gICAgfSBlbHNlIGlmIChuZXdJbmRleCA+PSBsZW5ndGgpIHtcbiAgICAgIG5ld0luZGV4IC09IGxlbmd0aDtcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtzZWxlY3Rpb25JbmRleDogbmV3SW5kZXh9KTtcbiAgfTtcblxuICBuYXZEb3duID0gKCkgPT4ge1xuICAgIHRoaXMuX25hdigxKTtcbiAgfTtcblxuICBuYXZVcCA9ICgpID0+IHtcbiAgICB0aGlzLl9uYXYoLTEpO1xuICB9O1xuXG4gIF9vbkNoYW5nZSA9IGV2ZW50ID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5vbkNoYW5nZSkge1xuICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZShldmVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5fb25UZXh0RW50cnlVcGRhdGVkKCk7XG4gIH07XG5cbiAgX29uS2V5RG93biA9IGV2ZW50ID0+IHtcbiAgICAvLyBJZiB0aGVyZSBhcmUgbm8gdmlzaWJsZSBlbGVtZW50cywgZG9uJ3QgcGVyZm9ybSBzZWxlY3RvciBuYXZpZ2F0aW9uLlxuICAgIC8vIEp1c3QgcGFzcyB0aGlzIHVwIHRvIHRoZSB1cHN0cmVhbSBvbktleWRvd24gaGFuZGxlci5cbiAgICAvLyBBbHNvIHNraXAgaWYgdGhlIHVzZXIgaXMgcHJlc3NpbmcgdGhlIHNoaWZ0IGtleSwgc2luY2Ugbm9uZSBvZiBvdXIgaGFuZGxlcnMgYXJlIGxvb2tpbmcgZm9yIHNoaWZ0XG4gICAgaWYgKCF0aGlzLl9oYXNIaW50KCkgfHwgZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLm9uS2V5RG93bihldmVudCk7XG4gICAgfVxuXG4gICAgY29uc3QgaGFuZGxlciA9IHRoaXMuZXZlbnRNYXAoKVtldmVudC5rZXlDb2RlXTtcblxuICAgIGlmIChoYW5kbGVyKSB7XG4gICAgICBoYW5kbGVyKGV2ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMub25LZXlEb3duKGV2ZW50KTtcbiAgICB9XG4gICAgLy8gRG9uJ3QgcHJvcGFnYXRlIHRoZSBrZXlzdHJva2UgYmFjayB0byB0aGUgRE9NL2Jyb3dzZXJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9O1xuXG4gIF9vbkZvY3VzID0gZXZlbnQgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe2lzRm9jdXNlZDogdHJ1ZX0pO1xuICAgIGlmICh0aGlzLnByb3BzLm9uRm9jdXMpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLm9uRm9jdXMoZXZlbnQpO1xuICAgIH1cbiAgfTtcblxuICBfb25CbHVyID0gZXZlbnQgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe2lzRm9jdXNlZDogZmFsc2V9KTtcbiAgICBpZiAodGhpcy5wcm9wcy5vbkJsdXIpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLm9uQmx1cihldmVudCk7XG4gICAgfVxuICB9O1xuXG4gIF9yZW5kZXJIaWRkZW5JbnB1dCgpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMubmFtZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT17dGhpcy5wcm9wcy5uYW1lfSB2YWx1ZT17dGhpcy5zdGF0ZS5zZWxlY3Rpb259IC8+O1xuICB9XG5cbiAgX2hhc0hpbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuc2VhcmNoUmVzdWx0cy5sZW5ndGggPiAwIHx8IHRoaXMuX2hhc0N1c3RvbVZhbHVlKCk7XG4gIH1cblxuICBfaGFzRml4ZWRPcHRpb25zKCkge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KHRoaXMucHJvcHMuZml4ZWRPcHRpb25zKSAmJiB0aGlzLnByb3BzLmZpeGVkT3B0aW9ucy5sZW5ndGg7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgaW5wdXRDbGFzc2VzID0ge307XG4gICAgaW5wdXRDbGFzc2VzW3RoaXMucHJvcHMuY3VzdG9tQ2xhc3Nlcy5pbnB1dF0gPSBCb29sZWFuKHRoaXMucHJvcHMuY3VzdG9tQ2xhc3Nlcy5pbnB1dCk7XG4gICAgY29uc3QgaW5wdXRDbGFzc0xpc3QgPSBjbGFzc05hbWVzKGlucHV0Q2xhc3Nlcyk7XG5cbiAgICBjb25zdCBjbGFzc2VzID0ge1xuICAgICAgW0RFRkFVTFRfQ0xBU1NdOiB0aGlzLnByb3BzLmRlZmF1bHRDbGFzc05hbWVzXG4gICAgfTtcbiAgICBjbGFzc2VzW3RoaXMucHJvcHMuY2xhc3NOYW1lXSA9IEJvb2xlYW4odGhpcy5wcm9wcy5jbGFzc05hbWUpO1xuICAgIGNvbnN0IGNsYXNzTGlzdCA9IGNsYXNzTmFtZXMoY2xhc3Nlcyk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFR5cGVhaGVhZFdyYXBwZXJcbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc0xpc3R9XG4gICAgICAgIHJlZj17dGhpcy5yb290fVxuICAgICAgICB0YWJJbmRleD1cIjBcIlxuICAgICAgICBvbktleURvd249e3RoaXMuX29uS2V5RG93bn1cbiAgICAgICAgb25LZXlQcmVzcz17dGhpcy5wcm9wcy5vbktleVByZXNzfVxuICAgICAgICBvbktleVVwPXt0aGlzLnByb3BzLm9uS2V5VXB9XG4gICAgICAgIG9uRm9jdXM9e3RoaXMuX29uRm9jdXN9XG4gICAgICAgIGxpZ2h0PXt0aGlzLnByb3BzLmxpZ2h0fVxuICAgICAgPlxuICAgICAgICB7dGhpcy5fcmVuZGVySGlkZGVuSW5wdXQoKX1cbiAgICAgICAge3RoaXMucHJvcHMuc2VhcmNoYWJsZSA/IChcbiAgICAgICAgICA8SW5wdXRCb3g+XG4gICAgICAgICAgICA8VHlwZWFoZWFkSW5wdXRcbiAgICAgICAgICAgICAgcmVmPXt0aGlzLmVudHJ5fVxuICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgIGRpc2FibGVkPXt0aGlzLnByb3BzLmRpc2FibGVkfVxuICAgICAgICAgICAgICB7Li4udGhpcy5wcm9wcy5pbnB1dFByb3BzfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17dGhpcy5wcm9wcy5wbGFjZWhvbGRlcn1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtpbnB1dENsYXNzTGlzdH1cbiAgICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuZW50cnlWYWx1ZX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuX29uQ2hhbmdlfVxuICAgICAgICAgICAgICBvbkJsdXI9e3RoaXMuX29uQmx1cn1cbiAgICAgICAgICAgICAgbGlnaHQ9e3RoaXMucHJvcHMubGlnaHR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPElucHV0SWNvbj5cbiAgICAgICAgICAgICAgPHRoaXMucHJvcHMuaW5wdXRJY29uIGhlaWdodD1cIjE4cHhcIiAvPlxuICAgICAgICAgICAgPC9JbnB1dEljb24+XG4gICAgICAgICAgPC9JbnB1dEJveD5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIHt0aGlzLl9yZW5kZXJJbmNyZW1lbnRhbFNlYXJjaFJlc3VsdHMoKX1cbiAgICAgIDwvVHlwZWFoZWFkV3JhcHBlcj5cbiAgICApO1xuICB9XG59XG5cbnBvbHlmaWxsKFR5cGVhaGVhZCk7XG5cbmV4cG9ydCBkZWZhdWx0IFR5cGVhaGVhZDtcbiJdfQ==