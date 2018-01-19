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
      (0, _extends3.default)({
        viewBox: viewBox,
        width: svgWidth,
        height: svgHeight,
        style: style,
        className: predefinedClassName + ' ' + className
      }, props),
      children
    );
  }
});

exports.default = Base;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9iYXNlLmpzIl0sIm5hbWVzIjpbIkJhc2UiLCJjcmVhdGVDbGFzcyIsImRpc3BsYXlOYW1lIiwicHJvcFR5cGVzIiwiaGVpZ2h0Iiwic3RyaW5nIiwid2lkdGgiLCJ2aWV3Qm94IiwiY2hpbGRyZW4iLCJQcm9wVHlwZXMiLCJub2RlIiwicHJlZGVmaW5lZENsYXNzTmFtZSIsImNsYXNzTmFtZSIsImdldERlZmF1bHRQcm9wcyIsInJlbmRlciIsInByb3BzIiwic3R5bGUiLCJzdmdIZWlnaHQiLCJzdmdXaWR0aCIsImZpbGwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsT0FBTyxnQkFBTUMsV0FBTixDQUFrQjtBQUM3QkMsZUFBYSxXQURnQjtBQUU3QkMsYUFBVztBQUNUO0FBQ0FDLFlBQVEsb0JBQVVDLE1BRlQ7QUFHVDtBQUNBQyxXQUFPLG9CQUFVRCxNQUpSO0FBS1Q7QUFDQUUsYUFBUyxvQkFBVUYsTUFOVjtBQU9UO0FBQ0FHLGNBQVUsZ0JBQU1DLFNBQU4sQ0FBZ0JDLElBUmpCO0FBU1RDLHlCQUFxQixvQkFBVU4sTUFUdEI7QUFVVE8sZUFBVyxvQkFBVVA7QUFWWixHQUZrQjtBQWM3QlEsaUJBZDZCLDZCQWNYO0FBQ2hCLFdBQU87QUFDTFQsY0FBUSxJQURIO0FBRUxFLGFBQU8sSUFGRjtBQUdMQyxlQUFTLFdBSEo7QUFJTEksMkJBQXFCLEVBSmhCO0FBS0xDLGlCQUFXO0FBTE4sS0FBUDtBQU9ELEdBdEI0QjtBQXVCN0JFLFFBdkI2QixvQkF1QnBCO0FBQUEsaUJBVUgsS0FBS0MsS0FWRjtBQUFBLFFBRUxYLE1BRkssVUFFTEEsTUFGSztBQUFBLFFBR0xFLEtBSEssVUFHTEEsS0FISztBQUFBLFFBSUxDLE9BSkssVUFJTEEsT0FKSztBQUFBLDhCQUtMUyxLQUxLO0FBQUEsUUFLTEEsS0FMSyxnQ0FLRyxFQUxIO0FBQUEsUUFNTFIsUUFOSyxVQU1MQSxRQU5LO0FBQUEsUUFPTEcsbUJBUEssVUFPTEEsbUJBUEs7QUFBQSxRQVFMQyxTQVJLLFVBUUxBLFNBUks7QUFBQSxRQVNGRyxLQVRFOztBQVdQLFFBQU1FLFlBQVliLE1BQWxCO0FBQ0EsUUFBTWMsV0FBV1osU0FBU1csU0FBMUI7QUFDQTtBQUNBRCxVQUFNRyxJQUFOLEdBQWEsY0FBYjtBQUNBLFdBQ0U7QUFBQTtBQUFBO0FBQ0UsaUJBQVNaLE9BRFg7QUFFRSxlQUFPVyxRQUZUO0FBR0UsZ0JBQVFELFNBSFY7QUFJRSxlQUFPRCxLQUpUO0FBS0UsbUJBQWNMLG1CQUFkLFNBQXFDQztBQUx2QyxTQU1NRyxLQU5OO0FBUUdQO0FBUkgsS0FERjtBQVlEO0FBbEQ0QixDQUFsQixDQUFiOztrQkFxRGVSLEkiLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5jb25zdCBCYXNlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0Jhc2UgSWNvbicsXG4gIHByb3BUeXBlczoge1xuICAgIC8qKiBTZXQgdGhlIGhlaWdodCBvZiB0aGUgaWNvbiwgZXguICcxNnB4JyAqL1xuICAgIGhlaWdodDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAvKiogU2V0IHRoZSB3aWR0aCBvZiB0aGUgaWNvbiwgZXguICcxNnB4JyAqL1xuICAgIHdpZHRoOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIC8qKiBTZXQgdGhlIHZpZXdib3ggb2YgdGhlIHN2ZyAqL1xuICAgIHZpZXdCb3g6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgLyoqIFBhdGggZWxlbWVudCAqL1xuICAgIGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMubm9kZSxcbiAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZ1xuICB9LFxuICBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlaWdodDogbnVsbCxcbiAgICAgIHdpZHRoOiBudWxsLFxuICAgICAgdmlld0JveDogJzAgMCA2NCA2NCcsXG4gICAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiAnJyxcbiAgICAgIGNsYXNzTmFtZTogJydcbiAgICB9O1xuICB9LFxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgaGVpZ2h0LFxuICAgICAgd2lkdGgsXG4gICAgICB2aWV3Qm94LFxuICAgICAgc3R5bGUgPSB7fSxcbiAgICAgIGNoaWxkcmVuLFxuICAgICAgcHJlZGVmaW5lZENsYXNzTmFtZSxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIC4uLnByb3BzXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qgc3ZnSGVpZ2h0ID0gaGVpZ2h0O1xuICAgIGNvbnN0IHN2Z1dpZHRoID0gd2lkdGggfHwgc3ZnSGVpZ2h0O1xuICAgIC8qICdjdXJyZW50Q29sb3InIHdpbGwgaW5oZXJpdCB0aGUgY29sb3Igb2YgdGhlIHBhcmVudCBlbGVtZW50ICovXG4gICAgc3R5bGUuZmlsbCA9ICdjdXJyZW50Q29sb3InO1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnXG4gICAgICAgIHZpZXdCb3g9e3ZpZXdCb3h9XG4gICAgICAgIHdpZHRoPXtzdmdXaWR0aH1cbiAgICAgICAgaGVpZ2h0PXtzdmdIZWlnaHR9XG4gICAgICAgIHN0eWxlPXtzdHlsZX1cbiAgICAgICAgY2xhc3NOYW1lPXtgJHtwcmVkZWZpbmVkQ2xhc3NOYW1lfSAke2NsYXNzTmFtZX1gfVxuICAgICAgICB7Li4ucHJvcHN9XG4gICAgICA+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvc3ZnPlxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBCYXNlO1xuIl19