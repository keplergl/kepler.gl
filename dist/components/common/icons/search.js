'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Search = _react2.default.createClass({
  displayName: 'Search',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: _propTypes2.default.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      height: '16px',
      predefinedClassName: 'data-ex-icons-search'
    };
  },
  render: function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement('path', { d: 'M56.74,53.21l-3.53,3.53a1.67,1.67,0,0,1-2.35,0L40.21,46.09A24.32,24.32,0,0,0,46.1,40.2L56.74,50.85A1.66,1.66,0,0,1,56.74,53.21Z' }),
      _react2.default.createElement('path', { d: 'M26.22,6.78A19.46,19.46,0,1,0,42.6,36.7a19.18,19.18,0,0,0,3.08-10.47A19.45,19.45,0,0,0,26.22,6.78ZM11.64,26.22A14.58,14.58,0,1,1,26.22,40.81,14.6,14.6,0,0,1,11.64,26.22Z' })
    );
  }
});

exports.default = Search;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9zZWFyY2guanMiXSwibmFtZXMiOlsiU2VhcmNoIiwiY3JlYXRlQ2xhc3MiLCJkaXNwbGF5TmFtZSIsInByb3BUeXBlcyIsImhlaWdodCIsInN0cmluZyIsImdldERlZmF1bHRQcm9wcyIsInByZWRlZmluZWRDbGFzc05hbWUiLCJyZW5kZXIiLCJwcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxTQUFTLGdCQUFNQyxXQUFOLENBQWtCO0FBQy9CQyxlQUFhLFFBRGtCO0FBRS9CQyxhQUFXO0FBQ1Q7QUFDQUMsWUFBUSxvQkFBVUM7QUFGVCxHQUZvQjtBQU0vQkMsaUJBTitCLDZCQU1iO0FBQ2hCLFdBQU87QUFDTEYsY0FBUSxNQURIO0FBRUxHLDJCQUFxQjtBQUZoQixLQUFQO0FBSUQsR0FYOEI7QUFZL0JDLFFBWitCLG9CQVl0QjtBQUNQLFdBQ0U7QUFBQTtBQUFVLFdBQUtDLEtBQWY7QUFDRSw4Q0FBTSxHQUFFLGlJQUFSLEdBREY7QUFFRSw4Q0FBTSxHQUFFLDJLQUFSO0FBRkYsS0FERjtBQU1EO0FBbkI4QixDQUFsQixDQUFmOztrQkFzQmVULE0iLCJmaWxlIjoic2VhcmNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgQmFzZSBmcm9tICcuL2Jhc2UnO1xuXG5jb25zdCBTZWFyY2ggPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnU2VhcmNoJyxcbiAgcHJvcFR5cGVzOiB7XG4gICAgLyoqIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiAnMTZweCcsXG4gICAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiAnZGF0YS1leC1pY29ucy1zZWFyY2gnXG4gICAgfTtcbiAgfSxcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFzZSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIDxwYXRoIGQ9XCJNNTYuNzQsNTMuMjFsLTMuNTMsMy41M2ExLjY3LDEuNjcsMCwwLDEtMi4zNSwwTDQwLjIxLDQ2LjA5QTI0LjMyLDI0LjMyLDAsMCwwLDQ2LjEsNDAuMkw1Ni43NCw1MC44NUExLjY2LDEuNjYsMCwwLDEsNTYuNzQsNTMuMjFaXCIvPlxuICAgICAgICA8cGF0aCBkPVwiTTI2LjIyLDYuNzhBMTkuNDYsMTkuNDYsMCwxLDAsNDIuNiwzNi43YTE5LjE4LDE5LjE4LDAsMCwwLDMuMDgtMTAuNDdBMTkuNDUsMTkuNDUsMCwwLDAsMjYuMjIsNi43OFpNMTEuNjQsMjYuMjJBMTQuNTgsMTQuNTgsMCwxLDEsMjYuMjIsNDAuODEsMTQuNiwxNC42LDAsMCwxLDExLjY0LDI2LjIyWlwiLz5cbiAgICAgIDwvQmFzZT5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgU2VhcmNoO1xuIl19