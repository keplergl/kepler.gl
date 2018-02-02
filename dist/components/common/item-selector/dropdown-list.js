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

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  background-color: ', ';\n  border-top: 1px solid ', ';\n  ', ';\n'], ['\n  background-color: ', ';\n  border-top: 1px solid ', ';\n  ', ';\n']);

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
  return props.theme.dropdownListBgd;
}, function (props) {
  return props.theme.dropdownListBorderTop;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2Ryb3Bkb3duLWxpc3QuanMiXSwibmFtZXMiOlsiY2xhc3NMaXN0IiwibGlzdCIsImxpc3RIZWFkZXIiLCJsaXN0U2VjdGlvbiIsImxpc3RJdGVtIiwibGlzdEl0ZW1BbmNob3IiLCJkZWZhdWx0RGlzcGxheSIsImQiLCJMaXN0SXRlbSIsInZhbHVlIiwiZGlzcGxheU9wdGlvbiIsInByb3BUeXBlcyIsIm9wdGlvbnMiLCJhcnJheSIsImFsbG93Q3VzdG9tVmFsdWVzIiwibnVtYmVyIiwiY3VzdG9tQ2xhc3NlcyIsIm9iamVjdCIsImN1c3RvbVZhbHVlcyIsImN1c3RvbUxpc3RJdGVtQ29tcG9uZW50Iiwib25lT2ZUeXBlIiwiZWxlbWVudCIsImZ1bmMiLCJjdXN0b21MaXN0SGVhZGVyQ29tcG9uZW50Iiwic2VsZWN0aW9uSW5kZXgiLCJvbk9wdGlvblNlbGVjdGVkIiwiaXNSZXF1aXJlZCIsImRlZmF1bHRDbGFzc05hbWVzIiwiYm9vbCIsImFyZVJlc3VsdHNUcnVuY2F0ZWQiLCJyZXN1bHRzVHJ1bmNhdGVkTWVzc2FnZSIsInN0cmluZyIsImxpc3RJdGVtQ29tcG9uZW50IiwiZGVmYXVsdFByb3BzIiwiRHJvcGRvd25MaXN0V3JhcHBlciIsImRpdiIsInByb3BzIiwidGhlbWUiLCJkcm9wZG93bkxpc3RCZ2QiLCJkcm9wZG93bkxpc3RCb3JkZXJUb3AiLCJkcm9wZG93bkxpc3QiLCJEcm9wZG93bkxpc3QiLCJfb25DbGljayIsInJlc3VsdCIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJyZW5kZXIiLCJmaXhlZE9wdGlvbnMiLCJkaXNwbGF5IiwibGVuZ3RoIiwidmFsdWVPZmZzZXQiLCJBcnJheSIsImlzQXJyYXkiLCJtYXAiLCJpIiwiaG92ZXIiLCJmaXhlZCIsImUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7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RCxDQUFyQixDQUFMO0FBQUEsYUFMZjtBQU1FLHFCQUFTO0FBQUEscUJBQUssT0FBS2YsUUFBTCxDQUFjakMsS0FBZCxFQUFxQmdELENBQXJCLENBQUw7QUFBQTtBQU5YO0FBUUUsK0NBQU0sS0FBTixDQUFZLHVCQUFaO0FBQ0UsbUJBQU9oRCxLQURUO0FBRUUsMkJBQWV1QztBQUZqQjtBQVJGLFNBRHNCO0FBQUEsT0FBdkI7QUE1QkgsS0FERjtBQThDRCxHOzs7OztBQUdIUCxhQUFhOUIsU0FBYixHQUF5QkEsU0FBekI7QUFDQThCLGFBQWFSLFlBQWIsR0FBNEJBLFlBQTVCOztrQkFFZVEsWSIsImZpbGUiOiJkcm9wZG93bi1saXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50LCBQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmV4cG9ydCBjb25zdCBjbGFzc0xpc3QgPSB7XG4gIGxpc3Q6ICdsaXN0LXNlbGVjdG9yJyxcbiAgbGlzdEhlYWRlcjogJ2xpc3RfX2hlYWRlcicsXG4gIGxpc3RTZWN0aW9uOiAnbGlzdF9fc2VjdGlvbicsXG4gIGxpc3RJdGVtOiAnbGlzdF9faXRlbScsXG4gIGxpc3RJdGVtQW5jaG9yOiAnbGlzdF9faXRlbV9fYW5jaG9yJ1xufTtcblxuY29uc3QgZGVmYXVsdERpc3BsYXkgPSBkID0+IGQ7XG5leHBvcnQgY29uc3QgTGlzdEl0ZW0gPSAoe3ZhbHVlLCBkaXNwbGF5T3B0aW9uID0gZGVmYXVsdERpc3BsYXl9KSA9PiAoXG4gIDxzcGFuIGNsYXNzTmFtZT17Y2xhc3NMaXN0Lmxpc3RJdGVtQW5jaG9yfT57ZGlzcGxheU9wdGlvbih2YWx1ZSl9PC9zcGFuPlxuKTtcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBvcHRpb25zOiBQcm9wVHlwZXMuYXJyYXksXG4gIGFsbG93Q3VzdG9tVmFsdWVzOiBQcm9wVHlwZXMubnVtYmVyLFxuICBjdXN0b21DbGFzc2VzOiBQcm9wVHlwZXMub2JqZWN0LFxuICBjdXN0b21WYWx1ZXM6IFByb3BUeXBlcy5hcnJheSxcbiAgY3VzdG9tTGlzdEl0ZW1Db21wb25lbnQ6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgIFByb3BUeXBlcy5lbGVtZW50LFxuICAgIFByb3BUeXBlcy5mdW5jXG4gIF0pLFxuICBjdXN0b21MaXN0SGVhZGVyQ29tcG9uZW50OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICBQcm9wVHlwZXMuZWxlbWVudCxcbiAgICBQcm9wVHlwZXMuZnVuY1xuICBdKSxcbiAgc2VsZWN0aW9uSW5kZXg6IFByb3BUeXBlcy5udW1iZXIsXG4gIG9uT3B0aW9uU2VsZWN0ZWQ6IFByb3BUeXBlcy5mdW5jLFxuICBkaXNwbGF5T3B0aW9uOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBkZWZhdWx0Q2xhc3NOYW1lczogUHJvcFR5cGVzLmJvb2wsXG4gIGFyZVJlc3VsdHNUcnVuY2F0ZWQ6IFByb3BUeXBlcy5ib29sLFxuICByZXN1bHRzVHJ1bmNhdGVkTWVzc2FnZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgbGlzdEl0ZW1Db21wb25lbnQ6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIGN1c3RvbUNsYXNzZXM6IHt9LFxuICBjdXN0b21MaXN0SXRlbUNvbXBvbmVudDogTGlzdEl0ZW0sXG4gIGN1c3RvbUxpc3RIZWFkZXJDb21wb25lbnQ6IG51bGwsXG4gIGFsbG93Q3VzdG9tVmFsdWVzOiAwLFxuICBjdXN0b21WYWx1ZXM6IFtdLFxuICBkaXNwbGF5T3B0aW9uOiBkZWZhdWx0RGlzcGxheSxcbiAgb25PcHRpb25TZWxlY3RlZDogKCkgPT4ge30sXG4gIGRlZmF1bHRDbGFzc05hbWVzOiB0cnVlLFxuICBzZWxlY3Rpb25JbmRleDogbnVsbFxufTtcblxuY29uc3QgRHJvcGRvd25MaXN0V3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0QmdkfTtcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0Qm9yZGVyVG9wfTtcbiAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3R9O1xuYDtcblxuY2xhc3MgRHJvcGRvd25MaXN0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgX29uQ2xpY2socmVzdWx0LCBldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5wcm9wcy5vbk9wdGlvblNlbGVjdGVkKHJlc3VsdCwgZXZlbnQpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtmaXhlZE9wdGlvbnN9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBkaXNwbGF5ID0gdGhpcy5wcm9wcy5kaXNwbGF5T3B0aW9uO1xuXG4gICAgLy8gRG9uJ3QgcmVuZGVyIGlmIHRoZXJlIGFyZSBubyBvcHRpb25zIHRvIGRpc3BsYXlcbiAgICBpZiAoIXRoaXMucHJvcHMub3B0aW9ucy5sZW5ndGggJiYgdGhpcy5wcm9wcy5hbGxvd0N1c3RvbVZhbHVlcyA8PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgdmFsdWVPZmZzZXQgPSBBcnJheS5pc0FycmF5KGZpeGVkT3B0aW9ucykgPyBmaXhlZE9wdGlvbnMubGVuZ3RoIDogMDtcblxuICAgIC8vIEZvciBzb21lIHJlYXNvbiBvbkNsaWNrIGlzIG5vdCBmaXJlZCB3aGVuIGNsaWNrZWQgb24gYW4gb3B0aW9uXG4gICAgLy8gb25Nb3VzZURvd24gaXMgdXNlZCBoZXJlIGFzIGEgd29ya2Fyb3VuZCBvZiAjMjA1IGFuZCBvdGhlclxuICAgIHJldHVybiAoXG4gICAgICA8RHJvcGRvd25MaXN0V3JhcHBlciBjbGFzc05hbWU9e2NsYXNzTGlzdC5saXN0fT5cbiAgICAgICAge3RoaXMucHJvcHMuY3VzdG9tTGlzdEhlYWRlckNvbXBvbmVudCA/IChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NMaXN0Lmxpc3RIZWFkZXJ9PlxuICAgICAgICAgICAgPHRoaXMucHJvcHMuY3VzdG9tTGlzdEhlYWRlckNvbXBvbmVudCAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApIDogbnVsbH1cblxuICAgICAgICB7dmFsdWVPZmZzZXQgPiAwID8gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc0xpc3QubGlzdFNlY3Rpb259PlxuICAgICAgICAgICAge2ZpeGVkT3B0aW9ucy5tYXAoKHZhbHVlLCBpKSA9PiAoXG4gICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoY2xhc3NMaXN0Lmxpc3RJdGVtLCB7XG4gICAgICAgICAgICAgICAgICBob3ZlcjogdGhpcy5wcm9wcy5zZWxlY3Rpb25JbmRleCA9PT0gaSxcbiAgICAgICAgICAgICAgICAgIGZpeGVkOiB0cnVlXG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAga2V5PXtgJHtkaXNwbGF5KHZhbHVlKX1fJHtpfWB9XG4gICAgICAgICAgICAgICAgb25Nb3VzZURvd249e2UgPT4gdGhpcy5fb25DbGljayh2YWx1ZSwgZSl9XG4gICAgICAgICAgICAgICAgb25DbGljaz17ZSA9PiB0aGlzLl9vbkNsaWNrKHZhbHVlLCBlKX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDx0aGlzLnByb3BzLmN1c3RvbUxpc3RJdGVtQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgICAgICAgICAgICBkaXNwbGF5T3B0aW9uPXtkaXNwbGF5fVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgIHt0aGlzLnByb3BzLm9wdGlvbnMubWFwKCh2YWx1ZSwgaSkgPT4gKFxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhjbGFzc0xpc3QubGlzdEl0ZW0sIHtcbiAgICAgICAgICAgICAgaG92ZXI6IHRoaXMucHJvcHMuc2VsZWN0aW9uSW5kZXggPT09IGkgKyB2YWx1ZU9mZnNldFxuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICBrZXk9e2Ake2Rpc3BsYXkodmFsdWUpfV8ke2l9YH1cbiAgICAgICAgICAgIG9uTW91c2VEb3duPXtlID0+IHRoaXMuX29uQ2xpY2sodmFsdWUsIGUpfVxuICAgICAgICAgICAgb25DbGljaz17ZSA9PiB0aGlzLl9vbkNsaWNrKHZhbHVlLCBlKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8dGhpcy5wcm9wcy5jdXN0b21MaXN0SXRlbUNvbXBvbmVudFxuICAgICAgICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgICAgICAgIGRpc3BsYXlPcHRpb249e2Rpc3BsYXl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApKX1cbiAgICAgIDwvRHJvcGRvd25MaXN0V3JhcHBlcj5cbiAgICApO1xuICB9XG59XG5cbkRyb3Bkb3duTGlzdC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5Ecm9wZG93bkxpc3QuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuXG5leHBvcnQgZGVmYXVsdCBEcm9wZG93bkxpc3Q7XG4iXX0=