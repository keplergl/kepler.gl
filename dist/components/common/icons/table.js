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

var Table = _react2.default.createClass({
  displayName: 'Table',
  propTypes: {
    height: _propTypes2.default.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      height: '16px'
    };
  },
  render: function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement('path', { d: 'M56.0384598,50.5v-8.3076935H8.9615383V50.5H56.0384598z M8.9615383,22.8076916h13.8461533V14.5H8.9615383 V22.8076916z M25.5769234,22.8076916h13.8461533V14.5H25.5769234V22.8076916z M42.1923065,22.8076916h13.8461533V14.5H42.1923065 V22.8076916z M8.9615383,36.6538467h47.0769196v-8.3076935H8.9615383V36.6538467z' })
    );
  }
});

exports.default = Table;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy90YWJsZS5qcyJdLCJuYW1lcyI6WyJUYWJsZSIsImNyZWF0ZUNsYXNzIiwiZGlzcGxheU5hbWUiLCJwcm9wVHlwZXMiLCJoZWlnaHQiLCJzdHJpbmciLCJnZXREZWZhdWx0UHJvcHMiLCJyZW5kZXIiLCJwcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxRQUFRLGdCQUFNQyxXQUFOLENBQWtCO0FBQzlCQyxlQUFhLE9BRGlCO0FBRTlCQyxhQUFXO0FBQ1RDLFlBQVEsb0JBQVVDO0FBRFQsR0FGbUI7QUFLOUJDLGlCQUw4Qiw2QkFLWjtBQUNoQixXQUFPO0FBQ0xGLGNBQVE7QUFESCxLQUFQO0FBR0QsR0FUNkI7QUFVOUJHLFFBVjhCLG9CQVVyQjtBQUNQLFdBQ0U7QUFBQTtBQUFVLFdBQUtDLEtBQWY7QUFDRSw4Q0FBTSxHQUFFLG9UQUFSO0FBREYsS0FERjtBQU9EO0FBbEI2QixDQUFsQixDQUFkOztrQkFxQmVSLEsiLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBCYXNlIGZyb20gJy4vYmFzZSc7XG5cbmNvbnN0IFRhYmxlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1RhYmxlJyxcbiAgcHJvcFR5cGVzOiB7XG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiAnMTZweCdcbiAgICB9O1xuICB9LFxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlIHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAgPHBhdGggZD1cIk01Ni4wMzg0NTk4LDUwLjV2LTguMzA3NjkzNUg4Ljk2MTUzODNWNTAuNUg1Ni4wMzg0NTk4eiBNOC45NjE1MzgzLDIyLjgwNzY5MTZoMTMuODQ2MTUzM1YxNC41SDguOTYxNTM4M1xuXHRWMjIuODA3NjkxNnogTTI1LjU3NjkyMzQsMjIuODA3NjkxNmgxMy44NDYxNTMzVjE0LjVIMjUuNTc2OTIzNFYyMi44MDc2OTE2eiBNNDIuMTkyMzA2NSwyMi44MDc2OTE2aDEzLjg0NjE1MzNWMTQuNUg0Mi4xOTIzMDY1XG5cdFYyMi44MDc2OTE2eiBNOC45NjE1MzgzLDM2LjY1Mzg0NjdoNDcuMDc2OTE5NnYtOC4zMDc2OTM1SDguOTYxNTM4M1YzNi42NTM4NDY3elwiIC8+XG4gICAgICA8L0Jhc2U+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFRhYmxlO1xuIl19