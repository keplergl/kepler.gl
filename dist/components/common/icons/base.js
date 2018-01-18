'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Base = _react2.default.createClass({
  displayName: 'Base Icon',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: _propTypes2.default.string,
    /** Set the width of the icon, ex. '16px' */
    width: _propTypes2.default.string,
    /** Set the viewbox of the svg */
    viewBox: _propTypes2.default.string,
    /** Path element */
    children: _react2.default.PropTypes.node,
    predefinedClassName: _propTypes2.default.string,
    className: _propTypes2.default.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      height: null,
      width: null,
      viewBox: '0 0 64 64',
      predefinedClassName: '',
      className: ''
    };
  },
  render: function render() {
    var _props = this.props,
        height = _props.height,
        width = _props.width,
        viewBox = _props.viewBox,
        _props$style = _props.style,
        style = _props$style === undefined ? {} : _props$style,
        children = _props.children,
        predefinedClassName = _props.predefinedClassName,
        className = _props.className,
        props = (0, _objectWithoutProperties3.default)(_props, ['height', 'width', 'viewBox', 'style', 'children', 'predefinedClassName', 'className']);

    var svgHeight = height;
    var svgWidth = width || svgHeight;
    /* 'currentColor' will inherit the color of the parent element */
    style.fill = 'currentColor';
    return _react2.default.createElement(
      'svg',
      (0, _extends3.default)({ viewBox: viewBox, width: svgWidth, height: svgHeight, style: style,
        className: predefinedClassName + ' ' + className
      }, props),
      children
    );
  }
});

exports.default = Base;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9iYXNlLmpzIl0sIm5hbWVzIjpbIkJhc2UiLCJjcmVhdGVDbGFzcyIsImRpc3BsYXlOYW1lIiwicHJvcFR5cGVzIiwiaGVpZ2h0Iiwic3RyaW5nIiwid2lkdGgiLCJ2aWV3Qm94IiwiY2hpbGRyZW4iLCJQcm9wVHlwZXMiLCJub2RlIiwicHJlZGVmaW5lZENsYXNzTmFtZSIsImNsYXNzTmFtZSIsImdldERlZmF1bHRQcm9wcyIsInJlbmRlciIsInByb3BzIiwic3R5bGUiLCJzdmdIZWlnaHQiLCJzdmdXaWR0aCIsImZpbGwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsT0FBTyxnQkFBTUMsV0FBTixDQUFrQjtBQUM3QkMsZUFBYSxXQURnQjtBQUU3QkMsYUFBVztBQUNUO0FBQ0FDLFlBQVEsb0JBQVVDLE1BRlQ7QUFHVDtBQUNBQyxXQUFPLG9CQUFVRCxNQUpSO0FBS1Q7QUFDQUUsYUFBUyxvQkFBVUYsTUFOVjtBQU9UO0FBQ0FHLGNBQVUsZ0JBQU1DLFNBQU4sQ0FBZ0JDLElBUmpCO0FBU1RDLHlCQUFxQixvQkFBVU4sTUFUdEI7QUFVVE8sZUFBVyxvQkFBVVA7QUFWWixHQUZrQjtBQWM3QlEsaUJBZDZCLDZCQWNYO0FBQ2hCLFdBQU87QUFDTFQsY0FBUSxJQURIO0FBRUxFLGFBQU8sSUFGRjtBQUdMQyxlQUFTLFdBSEo7QUFJTEksMkJBQXFCLEVBSmhCO0FBS0xDLGlCQUFXO0FBTE4sS0FBUDtBQU9ELEdBdEI0QjtBQXVCN0JFLFFBdkI2QixvQkF1QnBCO0FBQUEsaUJBU08sS0FBS0MsS0FUWjtBQUFBLFFBRUxYLE1BRkssVUFFTEEsTUFGSztBQUFBLFFBR0xFLEtBSEssVUFHTEEsS0FISztBQUFBLFFBSUxDLE9BSkssVUFJTEEsT0FKSztBQUFBLDhCQUtMUyxLQUxLO0FBQUEsUUFLTEEsS0FMSyxnQ0FLRyxFQUxIO0FBQUEsUUFNTFIsUUFOSyxVQU1MQSxRQU5LO0FBQUEsUUFPTEcsbUJBUEssVUFPTEEsbUJBUEs7QUFBQSxRQVFMQyxTQVJLLFVBUUxBLFNBUks7QUFBQSxRQVNGRyxLQVRFOztBQVVQLFFBQU1FLFlBQVliLE1BQWxCO0FBQ0EsUUFBTWMsV0FBV1osU0FBU1csU0FBMUI7QUFDQTtBQUNBRCxVQUFNRyxJQUFOLEdBQWEsY0FBYjtBQUNBLFdBQ0U7QUFBQTtBQUFBLCtCQUFLLFNBQVNaLE9BQWQsRUFBdUIsT0FBT1csUUFBOUIsRUFBd0MsUUFBUUQsU0FBaEQsRUFBMkQsT0FBT0QsS0FBbEU7QUFDSyxtQkFBY0wsbUJBQWQsU0FBcUNDO0FBRDFDLFNBRVNHLEtBRlQ7QUFHR1A7QUFISCxLQURGO0FBT0Q7QUE1QzRCLENBQWxCLENBQWI7O2tCQStDZVIsSSIsImZpbGUiOiJiYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcydcblxuY29uc3QgQmFzZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdCYXNlIEljb24nLFxuICBwcm9wVHlwZXM6IHtcbiAgICAvKiogU2V0IHRoZSBoZWlnaHQgb2YgdGhlIGljb24sIGV4LiAnMTZweCcgKi9cbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgLyoqIFNldCB0aGUgd2lkdGggb2YgdGhlIGljb24sIGV4LiAnMTZweCcgKi9cbiAgICB3aWR0aDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAvKiogU2V0IHRoZSB2aWV3Ym94IG9mIHRoZSBzdmcgKi9cbiAgICB2aWV3Qm94OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIC8qKiBQYXRoIGVsZW1lbnQgKi9cbiAgICBjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm5vZGUsXG4gICAgcHJlZGVmaW5lZENsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmdcbiAgfSxcbiAgZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBoZWlnaHQ6IG51bGwsXG4gICAgICB3aWR0aDogbnVsbCxcbiAgICAgIHZpZXdCb3g6ICcwIDAgNjQgNjQnLFxuICAgICAgcHJlZGVmaW5lZENsYXNzTmFtZTogJycsXG4gICAgICBjbGFzc05hbWU6ICcnXG4gICAgfTtcbiAgfSxcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGhlaWdodCxcbiAgICAgIHdpZHRoLFxuICAgICAgdmlld0JveCxcbiAgICAgIHN0eWxlID0ge30sXG4gICAgICBjaGlsZHJlbixcbiAgICAgIHByZWRlZmluZWRDbGFzc05hbWUsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICAuLi5wcm9wc30gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHN2Z0hlaWdodCA9IGhlaWdodDtcbiAgICBjb25zdCBzdmdXaWR0aCA9IHdpZHRoIHx8IHN2Z0hlaWdodDtcbiAgICAvKiAnY3VycmVudENvbG9yJyB3aWxsIGluaGVyaXQgdGhlIGNvbG9yIG9mIHRoZSBwYXJlbnQgZWxlbWVudCAqL1xuICAgIHN0eWxlLmZpbGwgPSAnY3VycmVudENvbG9yJztcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyB2aWV3Qm94PXt2aWV3Qm94fSB3aWR0aD17c3ZnV2lkdGh9IGhlaWdodD17c3ZnSGVpZ2h0fSBzdHlsZT17c3R5bGV9XG4gICAgICAgICAgIGNsYXNzTmFtZT17YCR7cHJlZGVmaW5lZENsYXNzTmFtZX0gJHtjbGFzc05hbWV9YH1cbiAgICAgICAgICAgey4uLnByb3BzfT5cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgPC9zdmc+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEJhc2U7XG4iXX0=