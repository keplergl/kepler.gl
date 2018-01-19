'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListItem = exports.classList = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  border-top: 1px solid ', ';\n  ', ';\n'], ['\n  border-top: 1px solid ', ';\n  ', ';\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var classList = exports.classList = {
  list: 'list-selector',
  listHeader: 'list__header',
  listSection: 'list__section',
  listItem: 'list__item',
  listItemAnchor: 'list__item__anchor'
};

var defaultDisplay = function defaultDisplay(d) {
  return d;
};
var ListItem = exports.ListItem = function ListItem(_ref) {
  var value = _ref.value,
      _ref$displayOption = _ref.displayOption,
      displayOption = _ref$displayOption === undefined ? defaultDisplay : _ref$displayOption;
  return _react2.default.createElement(
    'span',
    { className: classList.listItemAnchor },
    displayOption(value)
  );
};

var propTypes = {
  options: _react.PropTypes.array,
  allowCustomValues: _react.PropTypes.number,
  customClasses: _react.PropTypes.object,
  customValues: _react.PropTypes.array,
  customListItemComponent: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.func]),
  customListHeaderComponent: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.func]),
  selectionIndex: _react.PropTypes.number,
  onOptionSelected: _react.PropTypes.func,
  displayOption: _react.PropTypes.func.isRequired,
  defaultClassNames: _react.PropTypes.bool,
  areResultsTruncated: _react.PropTypes.bool,
  resultsTruncatedMessage: _react.PropTypes.string,
  listItemComponent: _react.PropTypes.func
};

var defaultProps = {
  customClasses: {},
  customListItemComponent: ListItem,
  customListHeaderComponent: null,
  allowCustomValues: 0,
  customValues: [],
  displayOption: defaultDisplay,
  onOptionSelected: function onOptionSelected() {},
  defaultClassNames: true,
  selectionIndex: null
};

var DropdownListWrapper = _styledComponents2.default.div(_templateObject, function (props) {
  return props.theme.panelActiveBg;
}, function (props) {
  return props.theme.dropdownList;
});

var DropdownList = function (_Component) {
  (0, _inherits3.default)(DropdownList, _Component);

  function DropdownList() {
    (0, _classCallCheck3.default)(this, DropdownList);
    return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
  }

  DropdownList.prototype._onClick = function _onClick(result, event) {
    event.preventDefault();
    this.props.onOptionSelected(result, event);
  };

  DropdownList.prototype.render = function render() {
    var _this2 = this;

    var fixedOptions = this.props.fixedOptions;

    var display = this.props.displayOption;

    // Don't render if there are no options to display
    if (!this.props.options.length && this.props.allowCustomValues <= 0) {
      return false;
    }

    var valueOffset = Array.isArray(fixedOptions) ? fixedOptions.length : 0;

    // For some reason onClick is not fired when clicked on an option
    // onMouseDown is used here as a workaround of #205 and other
    return _react2.default.createElement(
      DropdownListWrapper,
      { className: classList.list },
      this.props.customListHeaderComponent ? _react2.default.createElement(
        'div',
        { className: classList.listHeader },
        _react2.default.createElement(this.props.customListHeaderComponent, null)
      ) : null,
      valueOffset > 0 ? _react2.default.createElement(
        'div',
        { className: classList.listSection },
        fixedOptions.map(function (value, i) {
          return _react2.default.createElement(
            'div',
            {
              className: (0, _classnames2.default)(classList.listItem, {
                hover: _this2.props.selectionIndex === i,
                fixed: true
              }),
              key: display(value) + '_' + i,
              onMouseDown: function onMouseDown(e) {
                return _this2._onClick(value, e);
              },
              onClick: function onClick(e) {
                return _this2._onClick(value, e);
              }
            },
            _react2.default.createElement(_this2.props.customListItemComponent, {
              value: value,
              displayOption: display
            })
          );
        })
      ) : null,
      this.props.options.map(function (value, i) {
        return _react2.default.createElement(
          'div',
          {
            className: (0, _classnames2.default)(classList.listItem, {
              hover: _this2.props.selectionIndex === i + valueOffset
            }),
            key: display(value) + '_' + i,
            onMouseDown: function onMouseDown(e) {
              return _this2._onClick(value, e);
            },
            onClick: function onClick(e) {
              return _this2._onClick(value, e);
            }
          },
          _react2.default.createElement(_this2.props.customListItemComponent, {
            value: value,
            displayOption: display
          })
        );
      })
    );
  };

  return DropdownList;
}(_react.Component);

DropdownList.propTypes = propTypes;
DropdownList.defaultProps = defaultProps;

exports.default = DropdownList;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2Ryb3Bkb3duLWxpc3QuanMiXSwibmFtZXMiOlsiY2xhc3NMaXN0IiwibGlzdCIsImxpc3RIZWFkZXIiLCJsaXN0U2VjdGlvbiIsImxpc3RJdGVtIiwibGlzdEl0ZW1BbmNob3IiLCJkZWZhdWx0RGlzcGxheSIsImQiLCJMaXN0SXRlbSIsInZhbHVlIiwiZGlzcGxheU9wdGlvbiIsInByb3BUeXBlcyIsIm9wdGlvbnMiLCJhcnJheSIsImFsbG93Q3VzdG9tVmFsdWVzIiwibnVtYmVyIiwiY3VzdG9tQ2xhc3NlcyIsIm9iamVjdCIsImN1c3RvbVZhbHVlcyIsImN1c3RvbUxpc3RJdGVtQ29tcG9uZW50Iiwib25lT2ZUeXBlIiwiZWxlbWVudCIsImZ1bmMiLCJjdXN0b21MaXN0SGVhZGVyQ29tcG9uZW50Iiwic2VsZWN0aW9uSW5kZXgiLCJvbk9wdGlvblNlbGVjdGVkIiwiaXNSZXF1aXJlZCIsImRlZmF1bHRDbGFzc05hbWVzIiwiYm9vbCIsImFyZVJlc3VsdHNUcnVuY2F0ZWQiLCJyZXN1bHRzVHJ1bmNhdGVkTWVzc2FnZSIsInN0cmluZyIsImxpc3RJdGVtQ29tcG9uZW50IiwiZGVmYXVsdFByb3BzIiwiRHJvcGRvd25MaXN0V3JhcHBlciIsImRpdiIsInByb3BzIiwidGhlbWUiLCJwYW5lbEFjdGl2ZUJnIiwiZHJvcGRvd25MaXN0IiwiRHJvcGRvd25MaXN0IiwiX29uQ2xpY2siLCJyZXN1bHQiLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwicmVuZGVyIiwiZml4ZWRPcHRpb25zIiwiZGlzcGxheSIsImxlbmd0aCIsInZhbHVlT2Zmc2V0IiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwiaSIsImhvdmVyIiwiZml4ZWQiLCJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFTyxJQUFNQSxnQ0FB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QXJCLENBQUw7QUFBQTtBQU5YO0FBUUUsK0NBQU0sS0FBTixDQUFZLHVCQUFaO0FBQ0UsbUJBQU8vQyxLQURUO0FBRUUsMkJBQWVzQztBQUZqQjtBQVJGLFNBRHNCO0FBQUEsT0FBdkI7QUE1QkgsS0FERjtBQThDRCxHOzs7OztBQUdIUCxhQUFhN0IsU0FBYixHQUF5QkEsU0FBekI7QUFDQTZCLGFBQWFQLFlBQWIsR0FBNEJBLFlBQTVCOztrQkFFZU8sWSIsImZpbGUiOiJkcm9wZG93bi1saXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50LCBQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmV4cG9ydCBjb25zdCBjbGFzc0xpc3QgPSB7XG4gIGxpc3Q6ICdsaXN0LXNlbGVjdG9yJyxcbiAgbGlzdEhlYWRlcjogJ2xpc3RfX2hlYWRlcicsXG4gIGxpc3RTZWN0aW9uOiAnbGlzdF9fc2VjdGlvbicsXG4gIGxpc3RJdGVtOiAnbGlzdF9faXRlbScsXG4gIGxpc3RJdGVtQW5jaG9yOiAnbGlzdF9faXRlbV9fYW5jaG9yJ1xufTtcblxuY29uc3QgZGVmYXVsdERpc3BsYXkgPSBkID0+IGQ7XG5leHBvcnQgY29uc3QgTGlzdEl0ZW0gPSAoe3ZhbHVlLCBkaXNwbGF5T3B0aW9uID0gZGVmYXVsdERpc3BsYXl9KSA9PiAoXG4gIDxzcGFuIGNsYXNzTmFtZT17Y2xhc3NMaXN0Lmxpc3RJdGVtQW5jaG9yfT57ZGlzcGxheU9wdGlvbih2YWx1ZSl9PC9zcGFuPlxuKTtcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBvcHRpb25zOiBQcm9wVHlwZXMuYXJyYXksXG4gIGFsbG93Q3VzdG9tVmFsdWVzOiBQcm9wVHlwZXMubnVtYmVyLFxuICBjdXN0b21DbGFzc2VzOiBQcm9wVHlwZXMub2JqZWN0LFxuICBjdXN0b21WYWx1ZXM6IFByb3BUeXBlcy5hcnJheSxcbiAgY3VzdG9tTGlzdEl0ZW1Db21wb25lbnQ6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgIFByb3BUeXBlcy5lbGVtZW50LFxuICAgIFByb3BUeXBlcy5mdW5jXG4gIF0pLFxuICBjdXN0b21MaXN0SGVhZGVyQ29tcG9uZW50OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICBQcm9wVHlwZXMuZWxlbWVudCxcbiAgICBQcm9wVHlwZXMuZnVuY1xuICBdKSxcbiAgc2VsZWN0aW9uSW5kZXg6IFByb3BUeXBlcy5udW1iZXIsXG4gIG9uT3B0aW9uU2VsZWN0ZWQ6IFByb3BUeXBlcy5mdW5jLFxuICBkaXNwbGF5T3B0aW9uOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBkZWZhdWx0Q2xhc3NOYW1lczogUHJvcFR5cGVzLmJvb2wsXG4gIGFyZVJlc3VsdHNUcnVuY2F0ZWQ6IFByb3BUeXBlcy5ib29sLFxuICByZXN1bHRzVHJ1bmNhdGVkTWVzc2FnZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgbGlzdEl0ZW1Db21wb25lbnQ6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIGN1c3RvbUNsYXNzZXM6IHt9LFxuICBjdXN0b21MaXN0SXRlbUNvbXBvbmVudDogTGlzdEl0ZW0sXG4gIGN1c3RvbUxpc3RIZWFkZXJDb21wb25lbnQ6IG51bGwsXG4gIGFsbG93Q3VzdG9tVmFsdWVzOiAwLFxuICBjdXN0b21WYWx1ZXM6IFtdLFxuICBkaXNwbGF5T3B0aW9uOiBkZWZhdWx0RGlzcGxheSxcbiAgb25PcHRpb25TZWxlY3RlZDogKCkgPT4ge30sXG4gIGRlZmF1bHRDbGFzc05hbWVzOiB0cnVlLFxuICBzZWxlY3Rpb25JbmRleDogbnVsbFxufTtcblxuY29uc3QgRHJvcGRvd25MaXN0V3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGJvcmRlci10b3A6IDFweCBzb2xpZCAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQWN0aXZlQmd9O1xuICAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdH07XG5gO1xuXG5jbGFzcyBEcm9wZG93bkxpc3QgZXh0ZW5kcyBDb21wb25lbnQge1xuICBfb25DbGljayhyZXN1bHQsIGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnByb3BzLm9uT3B0aW9uU2VsZWN0ZWQocmVzdWx0LCBldmVudCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2ZpeGVkT3B0aW9uc30gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGRpc3BsYXkgPSB0aGlzLnByb3BzLmRpc3BsYXlPcHRpb247XG5cbiAgICAvLyBEb24ndCByZW5kZXIgaWYgdGhlcmUgYXJlIG5vIG9wdGlvbnMgdG8gZGlzcGxheVxuICAgIGlmICghdGhpcy5wcm9wcy5vcHRpb25zLmxlbmd0aCAmJiB0aGlzLnByb3BzLmFsbG93Q3VzdG9tVmFsdWVzIDw9IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZU9mZnNldCA9IEFycmF5LmlzQXJyYXkoZml4ZWRPcHRpb25zKSA/IGZpeGVkT3B0aW9ucy5sZW5ndGggOiAwO1xuXG4gICAgLy8gRm9yIHNvbWUgcmVhc29uIG9uQ2xpY2sgaXMgbm90IGZpcmVkIHdoZW4gY2xpY2tlZCBvbiBhbiBvcHRpb25cbiAgICAvLyBvbk1vdXNlRG93biBpcyB1c2VkIGhlcmUgYXMgYSB3b3JrYXJvdW5kIG9mICMyMDUgYW5kIG90aGVyXG4gICAgcmV0dXJuIChcbiAgICAgIDxEcm9wZG93bkxpc3RXcmFwcGVyIGNsYXNzTmFtZT17Y2xhc3NMaXN0Lmxpc3R9PlxuICAgICAgICB7dGhpcy5wcm9wcy5jdXN0b21MaXN0SGVhZGVyQ29tcG9uZW50ID8gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc0xpc3QubGlzdEhlYWRlcn0+XG4gICAgICAgICAgICA8dGhpcy5wcm9wcy5jdXN0b21MaXN0SGVhZGVyQ29tcG9uZW50IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgIHt2YWx1ZU9mZnNldCA+IDAgPyAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzTGlzdC5saXN0U2VjdGlvbn0+XG4gICAgICAgICAgICB7Zml4ZWRPcHRpb25zLm1hcCgodmFsdWUsIGkpID0+IChcbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhjbGFzc0xpc3QubGlzdEl0ZW0sIHtcbiAgICAgICAgICAgICAgICAgIGhvdmVyOiB0aGlzLnByb3BzLnNlbGVjdGlvbkluZGV4ID09PSBpLFxuICAgICAgICAgICAgICAgICAgZml4ZWQ6IHRydWVcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICBrZXk9e2Ake2Rpc3BsYXkodmFsdWUpfV8ke2l9YH1cbiAgICAgICAgICAgICAgICBvbk1vdXNlRG93bj17ZSA9PiB0aGlzLl9vbkNsaWNrKHZhbHVlLCBlKX1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXtlID0+IHRoaXMuX29uQ2xpY2sodmFsdWUsIGUpfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPHRoaXMucHJvcHMuY3VzdG9tTGlzdEl0ZW1Db21wb25lbnRcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgICAgICAgICAgICAgIGRpc3BsYXlPcHRpb249e2Rpc3BsYXl9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAge3RoaXMucHJvcHMub3B0aW9ucy5tYXAoKHZhbHVlLCBpKSA9PiAoXG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKGNsYXNzTGlzdC5saXN0SXRlbSwge1xuICAgICAgICAgICAgICBob3ZlcjogdGhpcy5wcm9wcy5zZWxlY3Rpb25JbmRleCA9PT0gaSArIHZhbHVlT2Zmc2V0XG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIGtleT17YCR7ZGlzcGxheSh2YWx1ZSl9XyR7aX1gfVxuICAgICAgICAgICAgb25Nb3VzZURvd249e2UgPT4gdGhpcy5fb25DbGljayh2YWx1ZSwgZSl9XG4gICAgICAgICAgICBvbkNsaWNrPXtlID0+IHRoaXMuX29uQ2xpY2sodmFsdWUsIGUpfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDx0aGlzLnByb3BzLmN1c3RvbUxpc3RJdGVtQ29tcG9uZW50XG4gICAgICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgICAgICAgICAgZGlzcGxheU9wdGlvbj17ZGlzcGxheX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkpfVxuICAgICAgPC9Ecm9wZG93bkxpc3RXcmFwcGVyPlxuICAgICk7XG4gIH1cbn1cblxuRHJvcGRvd25MaXN0LnByb3BUeXBlcyA9IHByb3BUeXBlcztcbkRyb3Bkb3duTGlzdC5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG5cbmV4cG9ydCBkZWZhdWx0IERyb3Bkb3duTGlzdDtcbiJdfQ==