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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9leHBhbmQuanMiXSwibmFtZXMiOlsiRXhwYW5kIiwiY3JlYXRlQ2xhc3MiLCJkaXNwbGF5TmFtZSIsInByb3BUeXBlcyIsImhlaWdodCIsInN0cmluZyIsImdldERlZmF1bHRQcm9wcyIsInNpemUiLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIiwicmVuZGVyIiwicHJvcHMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsU0FBUyxnQkFBTUMsV0FBTixDQUFrQjtBQUMvQkMsZUFBYSxRQURrQjtBQUUvQkMsYUFBVztBQUNUO0FBQ0FDLFlBQVEsb0JBQVVDO0FBRlQsR0FGb0I7QUFNL0JDLGlCQU4rQiw2QkFNYjtBQUNoQixXQUFPO0FBQ0xGLGNBQVEsSUFESDtBQUVMRyxZQUFNLE1BRkQ7QUFHTEMsMkJBQXFCO0FBSGhCLEtBQVA7QUFLRCxHQVo4QjtBQWEvQkMsUUFiK0Isb0JBYXRCO0FBQ1AsV0FDRTtBQUFBO0FBQVUsV0FBS0MsS0FBZjtBQUNFO0FBQUE7QUFBQSxVQUFHLFdBQVUsK0JBQWI7QUFDRSxnREFBTSxHQUFFLCtqQkFBUjtBQURGO0FBREYsS0FERjtBQU9EO0FBckI4QixDQUFsQixDQUFmOztrQkF3QmVWLE0iLCJmaWxlIjoiZXhwYW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgQmFzZSBmcm9tICcuL2Jhc2UnO1xuXG5jb25zdCBFeHBhbmQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnRXhwYW5kJyxcbiAgcHJvcFR5cGVzOiB7XG4gICAgLyoqIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiBudWxsLFxuICAgICAgc2l6ZTogJ3RpbnknLFxuICAgICAgcHJlZGVmaW5lZENsYXNzTmFtZTogJ2RhdGEtZXgtaWNvbnMtZXhwYW5kJ1xuICAgIH07XG4gIH0sXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJhc2Ugey4uLnRoaXMucHJvcHN9PlxuICAgICAgICA8ZyB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoNi4wMDAwMDAsIDYuMDAwMDAwKVwiPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNMzEuMjUsNi4yNSBMMzYuMDQxNjY2NywxMS4wNDE2NjY3IEwzMC4wMjA4MzMzLDE3LjAyMDgzMzMgTDMyLjk3OTE2NjcsMTkuOTc5MTY2NyBMMzguOTU4MzMzMywxMy45NTgzMzMzIEw0My43NSwxOC43NSBMNDMuNzUsNi4yNSBMMzEuMjUsNi4yNSBaIE02LjI1LDE4Ljc1IEwxMS4wNDE2NjY3LDEzLjk1ODMzMzMgTDE3LjAyMDgzMzMsMTkuOTc5MTY2NyBMMTkuOTc5MTY2NywxNy4wMjA4MzMzIEwxMy45NTgzMzMzLDExLjA0MTY2NjcgTDE4Ljc1LDYuMjUgTDYuMjUsNi4yNSBMNi4yNSwxOC43NSBaIE0xOC43NSw0My43NSBMMTMuOTU4MzMzMywzOC45NTgzMzMzIEwxOS45NzkxNjY3LDMyLjk3OTE2NjcgTDE3LjAyMDgzMzMsMzAuMDIwODMzMyBMMTEuMDQxNjY2NywzNi4wNDE2NjY3IEw2LjI1LDMxLjI1IEw2LjI1LDQzLjc1IEwxOC43NSw0My43NSBaIE00My43NSwzMS4yNSBMMzguOTU4MzMzMywzNi4wNDE2NjY3IEwzMi45NzkxNjY3LDMwLjAyMDgzMzMgTDMwLjAyMDgzMzMsMzIuOTc5MTY2NyBMMzYuMDQxNjY2NywzOC45NTgzMzMzIEwzMS4yNSw0My43NSBMNDMuNzUsNDMuNzUgTDQzLjc1LDMxLjI1IFpcIiAvPlxuICAgICAgICA8L2c+XG4gICAgICA8L0Jhc2U+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEV4cGFuZDtcbiJdfQ==