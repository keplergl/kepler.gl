'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  background: ', ';\n  border-radius: 1px;\n  color: ', ';\n  font-size: 11px;\n  line-height: 20px;\n  margin: 3px 10px 3px 3px;\n  padding: 4px 6px;\n  display: flex;\n  align-items: center;\n  max-width: calc(100% - 8px);\n\n  :hover {\n    color: ', ';\n  }\n'], ['\n  background: ', ';\n  border-radius: 1px;\n  color: ', ';\n  font-size: 11px;\n  line-height: 20px;\n  margin: 3px 10px 3px 3px;\n  padding: 4px 6px;\n  display: flex;\n  align-items: center;\n  max-width: calc(100% - 8px);\n\n  :hover {\n    color: ', ';\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  margin-right: 10px;\n  text-overflow: ellipsis;\n  width: 100%;\n  overflow: hidden;\n  \n  :hover {\n    overflow: visible;\n  }\n'], ['\n  margin-right: 10px;\n  text-overflow: ellipsis;\n  width: 100%;\n  overflow: hidden;\n  \n  :hover {\n    overflow: visible;\n  }\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  ', ' \n'], ['\n  ', ' \n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _delete = require('../icons/delete');

var _delete2 = _interopRequireDefault(_delete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  // required properties
  onClick: _react2.default.PropTypes.func.isRequired,
  removeItem: _react2.default.PropTypes.func.isRequired,

  // optional properties
  selectedItems: _react.PropTypes.array,
  disabled: _react2.default.PropTypes.bool,
  displayOption: _react2.default.PropTypes.func,
  focus: _react2.default.PropTypes.bool,
  error: _react2.default.PropTypes.bool,
  placeholder: _react2.default.PropTypes.string
};

var ChickletButton = _styledComponents2.default.div(_templateObject, function (props) {
  return props.theme.panelActiveBg;
}, function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.theme.textColorHl;
});

var ChickletTag = _styledComponents2.default.span(_templateObject2);

var Chicklet = function Chicklet(_ref) {
  var disabled = _ref.disabled,
      name = _ref.name,
      remove = _ref.remove;
  return _react2.default.createElement(
    ChickletButton,
    null,
    _react2.default.createElement(
      ChickletTag,
      null,
      name
    ),
    _react2.default.createElement(_delete2.default, { height: '10px', onClick: disabled ? null : remove })
  );
};

var ChickletedInputContainer = _styledComponents2.default.div(_templateObject3, function (props) {
  return props.theme.chickletedInput;
});

var ChickletedInput = function ChickletedInput(_ref2) {
  var focus = _ref2.focus,
      disabled = _ref2.disabled,
      error = _ref2.error,
      onClick = _ref2.onClick,
      className = _ref2.className,
      _ref2$selectedItems = _ref2.selectedItems,
      selectedItems = _ref2$selectedItems === undefined ? [] : _ref2$selectedItems,
      _ref2$placeholder = _ref2.placeholder,
      placeholder = _ref2$placeholder === undefined ? '' : _ref2$placeholder,
      removeItem = _ref2.removeItem,
      _ref2$displayOption = _ref2.displayOption,
      displayOption = _ref2$displayOption === undefined ? function (d) {
    return d;
  } : _ref2$displayOption;
  return _react2.default.createElement(
    ChickletedInputContainer,
    {
      className: className + ' chickleted-input',
      focus: focus,
      disabled: disabled,
      error: error,
      onClick: onClick
    },
    selectedItems.length > 0 ? selectedItems.map(function (item, i) {
      return _react2.default.createElement(Chicklet, {
        disabled: disabled,
        key: displayOption(item) + '_' + i,
        name: displayOption(item),
        remove: function remove(e) {
          return removeItem(item, e);
        }
      });
    }) : placeholder
  );
};

ChickletedInput.propTypes = propTypes;

exports.default = ChickletedInput;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2NoaWNrbGV0ZWQtaW5wdXQuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwib25DbGljayIsIlByb3BUeXBlcyIsImZ1bmMiLCJpc1JlcXVpcmVkIiwicmVtb3ZlSXRlbSIsInNlbGVjdGVkSXRlbXMiLCJhcnJheSIsImRpc2FibGVkIiwiYm9vbCIsImRpc3BsYXlPcHRpb24iLCJmb2N1cyIsImVycm9yIiwicGxhY2Vob2xkZXIiLCJzdHJpbmciLCJDaGlja2xldEJ1dHRvbiIsImRpdiIsInByb3BzIiwidGhlbWUiLCJwYW5lbEFjdGl2ZUJnIiwidGV4dENvbG9yIiwidGV4dENvbG9ySGwiLCJDaGlja2xldFRhZyIsInNwYW4iLCJDaGlja2xldCIsIm5hbWUiLCJyZW1vdmUiLCJDaGlja2xldGVkSW5wdXRDb250YWluZXIiLCJjaGlja2xldGVkSW5wdXQiLCJDaGlja2xldGVkSW5wdXQiLCJjbGFzc05hbWUiLCJkIiwibGVuZ3RoIiwibWFwIiwiaXRlbSIsImkiLCJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBRUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsWUFBWTtBQUNoQjtBQUNBQyxXQUFTLGdCQUFNQyxTQUFOLENBQWdCQyxJQUFoQixDQUFxQkMsVUFGZDtBQUdoQkMsY0FBWSxnQkFBTUgsU0FBTixDQUFnQkMsSUFBaEIsQ0FBcUJDLFVBSGpCOztBQUtoQjtBQUNBRSxpQkFBZSxpQkFBVUMsS0FOVDtBQU9oQkMsWUFBVSxnQkFBTU4sU0FBTixDQUFnQk8sSUFQVjtBQVFoQkMsaUJBQWUsZ0JBQU1SLFNBQU4sQ0FBZ0JDLElBUmY7QUFTaEJRLFNBQU8sZ0JBQU1ULFNBQU4sQ0FBZ0JPLElBVFA7QUFVaEJHLFNBQU8sZ0JBQU1WLFNBQU4sQ0FBZ0JPLElBVlA7QUFXaEJJLGVBQWEsZ0JBQU1YLFNBQU4sQ0FBZ0JZO0FBWGIsQ0FBbEI7O0FBY0EsSUFBTUMsaUJBQWlCLDJCQUFPQyxHQUF4QixrQkFDVTtBQUFBLFNBQVNDLE1BQU1DLEtBQU4sQ0FBWUMsYUFBckI7QUFBQSxDQURWLEVBR0s7QUFBQSxTQUFTRixNQUFNQyxLQUFOLENBQVlFLFNBQXJCO0FBQUEsQ0FITCxFQWFPO0FBQUEsU0FBU0gsTUFBTUMsS0FBTixDQUFZRyxXQUFyQjtBQUFBLENBYlAsQ0FBTjs7QUFpQkEsSUFBTUMsY0FBYywyQkFBT0MsSUFBckIsa0JBQU47O0FBV0EsSUFBTUMsV0FBVyxTQUFYQSxRQUFXO0FBQUEsTUFBRWhCLFFBQUYsUUFBRUEsUUFBRjtBQUFBLE1BQVlpQixJQUFaLFFBQVlBLElBQVo7QUFBQSxNQUFrQkMsTUFBbEIsUUFBa0JBLE1BQWxCO0FBQUEsU0FDZjtBQUFDLGtCQUFEO0FBQUE7QUFDRTtBQUFDLGlCQUFEO0FBQUE7QUFBY0Q7QUFBZCxLQURGO0FBRUUsc0RBQVEsUUFBTyxNQUFmLEVBQXNCLFNBQVNqQixXQUFXLElBQVgsR0FBa0JrQixNQUFqRDtBQUZGLEdBRGU7QUFBQSxDQUFqQjs7QUFPQSxJQUFNQywyQkFBMkIsMkJBQU9YLEdBQWxDLG1CQUNGO0FBQUEsU0FBU0MsTUFBTUMsS0FBTixDQUFZVSxlQUFyQjtBQUFBLENBREUsQ0FBTjs7QUFJQSxJQUFNQyxrQkFBa0IsU0FBbEJBLGVBQWtCO0FBQUEsTUFDdEJsQixLQURzQixTQUN0QkEsS0FEc0I7QUFBQSxNQUV0QkgsUUFGc0IsU0FFdEJBLFFBRnNCO0FBQUEsTUFHdEJJLEtBSHNCLFNBR3RCQSxLQUhzQjtBQUFBLE1BSXRCWCxPQUpzQixTQUl0QkEsT0FKc0I7QUFBQSxNQUt0QjZCLFNBTHNCLFNBS3RCQSxTQUxzQjtBQUFBLGtDQU10QnhCLGFBTnNCO0FBQUEsTUFNdEJBLGFBTnNCLHVDQU1OLEVBTk07QUFBQSxnQ0FPdEJPLFdBUHNCO0FBQUEsTUFPdEJBLFdBUHNCLHFDQU9SLEVBUFE7QUFBQSxNQVF0QlIsVUFSc0IsU0FRdEJBLFVBUnNCO0FBQUEsa0NBU3RCSyxhQVRzQjtBQUFBLE1BU3RCQSxhQVRzQix1Q0FTTjtBQUFBLFdBQUtxQixDQUFMO0FBQUEsR0FUTTtBQUFBLFNBV3RCO0FBQUMsNEJBQUQ7QUFBQTtBQUNFLGlCQUFjRCxTQUFkLHNCQURGO0FBRUUsYUFBT25CLEtBRlQ7QUFHRSxnQkFBVUgsUUFIWjtBQUlFLGFBQU9JLEtBSlQ7QUFLRSxlQUFTWDtBQUxYO0FBT0dLLGtCQUFjMEIsTUFBZCxHQUF1QixDQUF2QixHQUNHMUIsY0FBYzJCLEdBQWQsQ0FBa0IsVUFBQ0MsSUFBRCxFQUFPQyxDQUFQO0FBQUEsYUFDaEIsOEJBQUMsUUFBRDtBQUNFLGtCQUFVM0IsUUFEWjtBQUVFLGFBQVFFLGNBQWN3QixJQUFkLENBQVIsU0FBK0JDLENBRmpDO0FBR0UsY0FBTXpCLGNBQWN3QixJQUFkLENBSFI7QUFJRSxnQkFBUTtBQUFBLGlCQUFLN0IsV0FBVzZCLElBQVgsRUFBaUJFLENBQWpCLENBQUw7QUFBQTtBQUpWLFFBRGdCO0FBQUEsS0FBbEIsQ0FESCxHQVNHdkI7QUFoQk4sR0FYc0I7QUFBQSxDQUF4Qjs7QUErQkFnQixnQkFBZ0I3QixTQUFoQixHQUE0QkEsU0FBNUI7O2tCQUVlNkIsZSIsImZpbGUiOiJjaGlja2xldGVkLWlucHV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IERlbGV0ZSBmcm9tICcuLi9pY29ucy9kZWxldGUnO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIC8vIHJlcXVpcmVkIHByb3BlcnRpZXNcbiAgb25DbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgcmVtb3ZlSXRlbTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAvLyBvcHRpb25hbCBwcm9wZXJ0aWVzXG4gIHNlbGVjdGVkSXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbiAgZGlzYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICBkaXNwbGF5T3B0aW9uOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgZm9jdXM6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICBlcnJvcjogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gIHBsYWNlaG9sZGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG59O1xuXG5jb25zdCBDaGlja2xldEJ1dHRvbiA9IHN0eWxlZC5kaXZgXG4gIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxBY3RpdmVCZ307XG4gIGJvcmRlci1yYWRpdXM6IDFweDtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbiAgZm9udC1zaXplOiAxMXB4O1xuICBsaW5lLWhlaWdodDogMjBweDtcbiAgbWFyZ2luOiAzcHggMTBweCAzcHggM3B4O1xuICBwYWRkaW5nOiA0cHggNnB4O1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBtYXgtd2lkdGg6IGNhbGMoMTAwJSAtIDhweCk7XG5cbiAgOmhvdmVyIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gIH1cbmA7XG5cbmNvbnN0IENoaWNrbGV0VGFnID0gc3R5bGVkLnNwYW5gXG4gIG1hcmdpbi1yaWdodDogMTBweDtcbiAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gIHdpZHRoOiAxMDAlO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBcbiAgOmhvdmVyIHtcbiAgICBvdmVyZmxvdzogdmlzaWJsZTtcbiAgfVxuYDtcblxuY29uc3QgQ2hpY2tsZXQgPSAoe2Rpc2FibGVkLCBuYW1lLCByZW1vdmV9KSA9PiAoXG4gIDxDaGlja2xldEJ1dHRvbj5cbiAgICA8Q2hpY2tsZXRUYWc+e25hbWV9PC9DaGlja2xldFRhZz5cbiAgICA8RGVsZXRlIGhlaWdodD1cIjEwcHhcIiBvbkNsaWNrPXtkaXNhYmxlZCA/IG51bGwgOiByZW1vdmV9IC8+XG4gIDwvQ2hpY2tsZXRCdXR0b24+XG4pO1xuXG5jb25zdCBDaGlja2xldGVkSW5wdXRDb250YWluZXIgPSBzdHlsZWQuZGl2YFxuICAke3Byb3BzID0+IHByb3BzLnRoZW1lLmNoaWNrbGV0ZWRJbnB1dH0gXG5gO1xuXG5jb25zdCBDaGlja2xldGVkSW5wdXQgPSAoe1xuICBmb2N1cyxcbiAgZGlzYWJsZWQsXG4gIGVycm9yLFxuICBvbkNsaWNrLFxuICBjbGFzc05hbWUsXG4gIHNlbGVjdGVkSXRlbXMgPSBbXSxcbiAgcGxhY2Vob2xkZXIgPSAnJyxcbiAgcmVtb3ZlSXRlbSxcbiAgZGlzcGxheU9wdGlvbiA9IGQgPT4gZFxufSkgPT4gKFxuICA8Q2hpY2tsZXRlZElucHV0Q29udGFpbmVyXG4gICAgY2xhc3NOYW1lPXtgJHtjbGFzc05hbWV9IGNoaWNrbGV0ZWQtaW5wdXRgfVxuICAgIGZvY3VzPXtmb2N1c31cbiAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgZXJyb3I9e2Vycm9yfVxuICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gID5cbiAgICB7c2VsZWN0ZWRJdGVtcy5sZW5ndGggPiAwXG4gICAgICA/IHNlbGVjdGVkSXRlbXMubWFwKChpdGVtLCBpKSA9PiAoXG4gICAgICAgICAgPENoaWNrbGV0XG4gICAgICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICAgICAgICBrZXk9e2Ake2Rpc3BsYXlPcHRpb24oaXRlbSl9XyR7aX1gfVxuICAgICAgICAgICAgbmFtZT17ZGlzcGxheU9wdGlvbihpdGVtKX1cbiAgICAgICAgICAgIHJlbW92ZT17ZSA9PiByZW1vdmVJdGVtKGl0ZW0sIGUpfVxuICAgICAgICAgIC8+XG4gICAgICAgICkpXG4gICAgICA6IHBsYWNlaG9sZGVyfVxuICA8L0NoaWNrbGV0ZWRJbnB1dENvbnRhaW5lcj5cbik7XG5cbkNoaWNrbGV0ZWRJbnB1dC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5cbmV4cG9ydCBkZWZhdWx0IENoaWNrbGV0ZWRJbnB1dDtcbiJdfQ==