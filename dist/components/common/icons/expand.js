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

var Expand = _react2.default.createClass({
  displayName: 'Expand',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: _propTypes2.default.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      height: null,
      size: 'tiny',
      predefinedClassName: 'data-ex-icons-expand'
    };
  },
  render: function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement(
        'g',
        { transform: 'translate(6.000000, 6.000000)' },
        _react2.default.createElement('path', { d: 'M31.25,6.25 L36.0416667,11.0416667 L30.0208333,17.0208333 L32.9791667,19.9791667 L38.9583333,13.9583333 L43.75,18.75 L43.75,6.25 L31.25,6.25 Z M6.25,18.75 L11.0416667,13.9583333 L17.0208333,19.9791667 L19.9791667,17.0208333 L13.9583333,11.0416667 L18.75,6.25 L6.25,6.25 L6.25,18.75 Z M18.75,43.75 L13.9583333,38.9583333 L19.9791667,32.9791667 L17.0208333,30.0208333 L11.0416667,36.0416667 L6.25,31.25 L6.25,43.75 L18.75,43.75 Z M43.75,31.25 L38.9583333,36.0416667 L32.9791667,30.0208333 L30.0208333,32.9791667 L36.0416667,38.9583333 L31.25,43.75 L43.75,43.75 L43.75,31.25 Z' })
      )
    );
  }
});

exports.default = Expand;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9leHBhbmQuanMiXSwibmFtZXMiOlsiRXhwYW5kIiwiY3JlYXRlQ2xhc3MiLCJkaXNwbGF5TmFtZSIsInByb3BUeXBlcyIsImhlaWdodCIsInN0cmluZyIsImdldERlZmF1bHRQcm9wcyIsInNpemUiLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIiwicmVuZGVyIiwicHJvcHMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsU0FBUyxnQkFBTUMsV0FBTixDQUFrQjtBQUMvQkMsZUFBYSxRQURrQjtBQUUvQkMsYUFBVztBQUNUO0FBQ0FDLFlBQVEsb0JBQVVDO0FBRlQsR0FGb0I7QUFNL0JDLGlCQU4rQiw2QkFNYjtBQUNoQixXQUFPO0FBQ0xGLGNBQVEsSUFESDtBQUVMRyxZQUFNLE1BRkQ7QUFHTEMsMkJBQXFCO0FBSGhCLEtBQVA7QUFLRCxHQVo4QjtBQWEvQkMsUUFiK0Isb0JBYXRCO0FBQ1AsV0FDRTtBQUFBO0FBQVUsV0FBS0MsS0FBZjtBQUNFO0FBQUE7QUFBQSxVQUFHLFdBQVUsK0JBQWI7QUFDRSxnREFBTSxHQUFFLCtqQkFBUjtBQURGO0FBREYsS0FERjtBQU9EO0FBckI4QixDQUFsQixDQUFmOztrQkF3QmVWLE0iLCJmaWxlIjoiZXhwYW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcydcbmltcG9ydCBCYXNlIGZyb20gJy4vYmFzZSc7XG5cbmNvbnN0IEV4cGFuZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdFeHBhbmQnLFxuICBwcm9wVHlwZXM6IHtcbiAgICAvKiogU2V0IHRoZSBoZWlnaHQgb2YgdGhlIGljb24sIGV4LiAnMTZweCcgKi9cbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmdcbiAgfSxcbiAgZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBoZWlnaHQ6IG51bGwsXG4gICAgICBzaXplOiAndGlueScsXG4gICAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiAnZGF0YS1leC1pY29ucy1leHBhbmQnXG4gICAgfTtcbiAgfSxcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFzZSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIDxnIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSg2LjAwMDAwMCwgNi4wMDAwMDApXCI+XG4gICAgICAgICAgPHBhdGggZD1cIk0zMS4yNSw2LjI1IEwzNi4wNDE2NjY3LDExLjA0MTY2NjcgTDMwLjAyMDgzMzMsMTcuMDIwODMzMyBMMzIuOTc5MTY2NywxOS45NzkxNjY3IEwzOC45NTgzMzMzLDEzLjk1ODMzMzMgTDQzLjc1LDE4Ljc1IEw0My43NSw2LjI1IEwzMS4yNSw2LjI1IFogTTYuMjUsMTguNzUgTDExLjA0MTY2NjcsMTMuOTU4MzMzMyBMMTcuMDIwODMzMywxOS45NzkxNjY3IEwxOS45NzkxNjY3LDE3LjAyMDgzMzMgTDEzLjk1ODMzMzMsMTEuMDQxNjY2NyBMMTguNzUsNi4yNSBMNi4yNSw2LjI1IEw2LjI1LDE4Ljc1IFogTTE4Ljc1LDQzLjc1IEwxMy45NTgzMzMzLDM4Ljk1ODMzMzMgTDE5Ljk3OTE2NjcsMzIuOTc5MTY2NyBMMTcuMDIwODMzMywzMC4wMjA4MzMzIEwxMS4wNDE2NjY3LDM2LjA0MTY2NjcgTDYuMjUsMzEuMjUgTDYuMjUsNDMuNzUgTDE4Ljc1LDQzLjc1IFogTTQzLjc1LDMxLjI1IEwzOC45NTgzMzMzLDM2LjA0MTY2NjcgTDMyLjk3OTE2NjcsMzAuMDIwODMzMyBMMzAuMDIwODMzMywzMi45NzkxNjY3IEwzNi4wNDE2NjY3LDM4Ljk1ODMzMzMgTDMxLjI1LDQzLjc1IEw0My43NSw0My43NSBMNDMuNzUsMzEuMjUgWlwiLz5cbiAgICAgICAgPC9nPlxuICAgICAgPC9CYXNlPlxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBFeHBhbmQ7XG4iXX0=