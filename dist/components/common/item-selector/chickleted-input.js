'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  background: ', ';\n  border-radius: 1px;\n  color: ', ';\n  font-size: 11px;\n  line-height: 20px;\n  margin: 3px 10px 3px 3px;\n  padding: 4px 6px;\n  display: flex;\n  align-items: center;\n  \n  :hover {\n    color: ', ';\n  }\n'], ['\n  background: ', ';\n  border-radius: 1px;\n  color: ', ';\n  font-size: 11px;\n  line-height: 20px;\n  margin: 3px 10px 3px 3px;\n  padding: 4px 6px;\n  display: flex;\n  align-items: center;\n  \n  :hover {\n    color: ', ';\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  margin-right: 10px;\n'], ['\n  margin-right: 10px;\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  ', '\n  justify-content: start;\n  cursor: pointer;\n  flex-wrap: wrap;\n  height: auto;\n  margin-bottom: 2px;\n  padding: 4px 7px 4px 4px;\n'], ['\n  ', '\n  justify-content: start;\n  cursor: pointer;\n  flex-wrap: wrap;\n  height: auto;\n  margin-bottom: 2px;\n  padding: 4px 7px 4px 4px;\n']);

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
  isError: _react2.default.PropTypes.bool,
  placeholder: _react2.default.PropTypes.string
};

var ChickletButton = _styledComponents2.default.div(_templateObject, function (props) {
  return props.theme.panelActiveBg;
}, function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.theme.textColorHl;
});

var ChickletTag = _styledComponents2.default.div(_templateObject2);

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
    _react2.default.createElement(_delete2.default, {
      height: '10px',
      onClick: disabled ? null : remove
    })
  );
};

var ChickletedInputContainer = _styledComponents2.default.div(_templateObject3, function (props) {
  return props.theme.input;
});

var ChickletedInput = function ChickletedInput(_ref2) {
  var focus = _ref2.focus,
      disabled = _ref2.disabled,
      isError = _ref2.isError,
      onClick = _ref2.onClick,
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
      focus: focus,
      disabled: disabled,
      error: isError,
      onClick: onClick },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2NoaWNrbGV0ZWQtaW5wdXQuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwib25DbGljayIsIlByb3BUeXBlcyIsImZ1bmMiLCJpc1JlcXVpcmVkIiwicmVtb3ZlSXRlbSIsInNlbGVjdGVkSXRlbXMiLCJhcnJheSIsImRpc2FibGVkIiwiYm9vbCIsImRpc3BsYXlPcHRpb24iLCJmb2N1cyIsImlzRXJyb3IiLCJwbGFjZWhvbGRlciIsInN0cmluZyIsIkNoaWNrbGV0QnV0dG9uIiwiZGl2IiwicHJvcHMiLCJ0aGVtZSIsInBhbmVsQWN0aXZlQmciLCJ0ZXh0Q29sb3IiLCJ0ZXh0Q29sb3JIbCIsIkNoaWNrbGV0VGFnIiwiQ2hpY2tsZXQiLCJuYW1lIiwicmVtb3ZlIiwiQ2hpY2tsZXRlZElucHV0Q29udGFpbmVyIiwiaW5wdXQiLCJDaGlja2xldGVkSW5wdXQiLCJkIiwibGVuZ3RoIiwibWFwIiwiaXRlbSIsImkiLCJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBRUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsWUFBWTtBQUNoQjtBQUNBQyxXQUFTLGdCQUFNQyxTQUFOLENBQWdCQyxJQUFoQixDQUFxQkMsVUFGZDtBQUdoQkMsY0FBWSxnQkFBTUgsU0FBTixDQUFnQkMsSUFBaEIsQ0FBcUJDLFVBSGpCOztBQUtoQjtBQUNBRSxpQkFBZSxpQkFBVUMsS0FOVDtBQU9oQkMsWUFBVSxnQkFBTU4sU0FBTixDQUFnQk8sSUFQVjtBQVFoQkMsaUJBQWUsZ0JBQU1SLFNBQU4sQ0FBZ0JDLElBUmY7QUFTaEJRLFNBQU8sZ0JBQU1ULFNBQU4sQ0FBZ0JPLElBVFA7QUFVaEJHLFdBQVMsZ0JBQU1WLFNBQU4sQ0FBZ0JPLElBVlQ7QUFXaEJJLGVBQWEsZ0JBQU1YLFNBQU4sQ0FBZ0JZO0FBWGIsQ0FBbEI7O0FBY0EsSUFBTUMsaUJBQWlCLDJCQUFPQyxHQUF4QixrQkFDVTtBQUFBLFNBQVNDLE1BQU1DLEtBQU4sQ0FBWUMsYUFBckI7QUFBQSxDQURWLEVBR0s7QUFBQSxTQUFTRixNQUFNQyxLQUFOLENBQVlFLFNBQXJCO0FBQUEsQ0FITCxFQVlPO0FBQUEsU0FBU0gsTUFBTUMsS0FBTixDQUFZRyxXQUFyQjtBQUFBLENBWlAsQ0FBTjs7QUFnQkEsSUFBTUMsY0FBYywyQkFBT04sR0FBckIsa0JBQU47O0FBSUEsSUFBTU8sV0FBVyxTQUFYQSxRQUFXO0FBQUEsTUFBRWYsUUFBRixRQUFFQSxRQUFGO0FBQUEsTUFBWWdCLElBQVosUUFBWUEsSUFBWjtBQUFBLE1BQWtCQyxNQUFsQixRQUFrQkEsTUFBbEI7QUFBQSxTQUNmO0FBQUMsa0JBQUQ7QUFBQTtBQUNFO0FBQUMsaUJBQUQ7QUFBQTtBQUFjRDtBQUFkLEtBREY7QUFFRTtBQUNFLGNBQU8sTUFEVDtBQUVFLGVBQVNoQixXQUFXLElBQVgsR0FBa0JpQjtBQUY3QjtBQUZGLEdBRGU7QUFBQSxDQUFqQjs7QUFVQSxJQUFNQywyQkFBMkIsMkJBQU9WLEdBQWxDLG1CQUNGO0FBQUEsU0FBU0MsTUFBTUMsS0FBTixDQUFZUyxLQUFyQjtBQUFBLENBREUsQ0FBTjs7QUFVQSxJQUFNQyxrQkFBa0IsU0FBbEJBLGVBQWtCO0FBQUEsTUFDdEJqQixLQURzQixTQUN0QkEsS0FEc0I7QUFBQSxNQUV0QkgsUUFGc0IsU0FFdEJBLFFBRnNCO0FBQUEsTUFHdEJJLE9BSHNCLFNBR3RCQSxPQUhzQjtBQUFBLE1BSXRCWCxPQUpzQixTQUl0QkEsT0FKc0I7QUFBQSxrQ0FLdEJLLGFBTHNCO0FBQUEsTUFLdEJBLGFBTHNCLHVDQUtOLEVBTE07QUFBQSxnQ0FNdEJPLFdBTnNCO0FBQUEsTUFNdEJBLFdBTnNCLHFDQU1SLEVBTlE7QUFBQSxNQU90QlIsVUFQc0IsU0FPdEJBLFVBUHNCO0FBQUEsa0NBUXRCSyxhQVJzQjtBQUFBLE1BUXRCQSxhQVJzQix1Q0FRTjtBQUFBLFdBQUttQixDQUFMO0FBQUEsR0FSTTtBQUFBLFNBVXRCO0FBQUMsNEJBQUQ7QUFBQTtBQUNFLGFBQU9sQixLQURUO0FBRUUsZ0JBQVVILFFBRlo7QUFHRSxhQUFPSSxPQUhUO0FBSUUsZUFBU1gsT0FKWDtBQUtHSyxrQkFBY3dCLE1BQWQsR0FBdUIsQ0FBdkIsR0FBMkJ4QixjQUFjeUIsR0FBZCxDQUFrQixVQUFDQyxJQUFELEVBQU9DLENBQVA7QUFBQSxhQUM1Qyw4QkFBQyxRQUFEO0FBQ0Usa0JBQVV6QixRQURaO0FBRUUsYUFBUUUsY0FBY3NCLElBQWQsQ0FBUixTQUErQkMsQ0FGakM7QUFHRSxjQUFNdkIsY0FBY3NCLElBQWQsQ0FIUjtBQUlFLGdCQUFRO0FBQUEsaUJBQUszQixXQUFXMkIsSUFBWCxFQUFpQkUsQ0FBakIsQ0FBTDtBQUFBO0FBSlYsUUFENEM7QUFBQSxLQUFsQixDQUEzQixHQU9JckI7QUFaUCxHQVZzQjtBQUFBLENBQXhCOztBQTBCQWUsZ0JBQWdCNUIsU0FBaEIsR0FBNEJBLFNBQTVCOztrQkFFZTRCLGUiLCJmaWxlIjoiY2hpY2tsZXRlZC1pbnB1dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBEZWxldGUgZnJvbSAnLi4vaWNvbnMvZGVsZXRlJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICAvLyByZXF1aXJlZCBwcm9wZXJ0aWVzXG4gIG9uQ2xpY2s6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHJlbW92ZUl0ZW06IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgLy8gb3B0aW9uYWwgcHJvcGVydGllc1xuICBzZWxlY3RlZEl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gIGRpc2FibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgZGlzcGxheU9wdGlvbjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gIGZvY3VzOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgaXNFcnJvcjogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gIHBsYWNlaG9sZGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG59O1xuXG5jb25zdCBDaGlja2xldEJ1dHRvbiA9IHN0eWxlZC5kaXZgXG4gIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxBY3RpdmVCZ307XG4gIGJvcmRlci1yYWRpdXM6IDFweDtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbiAgZm9udC1zaXplOiAxMXB4O1xuICBsaW5lLWhlaWdodDogMjBweDtcbiAgbWFyZ2luOiAzcHggMTBweCAzcHggM3B4O1xuICBwYWRkaW5nOiA0cHggNnB4O1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBcbiAgOmhvdmVyIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gIH1cbmA7XG5cbmNvbnN0IENoaWNrbGV0VGFnID0gc3R5bGVkLmRpdmBcbiAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xuYDtcblxuY29uc3QgQ2hpY2tsZXQgPSAoe2Rpc2FibGVkLCBuYW1lLCByZW1vdmV9KSA9PiAoXG4gIDxDaGlja2xldEJ1dHRvbj5cbiAgICA8Q2hpY2tsZXRUYWc+e25hbWV9PC9DaGlja2xldFRhZz5cbiAgICA8RGVsZXRlXG4gICAgICBoZWlnaHQ9XCIxMHB4XCJcbiAgICAgIG9uQ2xpY2s9e2Rpc2FibGVkID8gbnVsbCA6IHJlbW92ZX1cbiAgICAvPlxuICA8L0NoaWNrbGV0QnV0dG9uPlxuKTtcblxuY29uc3QgQ2hpY2tsZXRlZElucHV0Q29udGFpbmVyID0gc3R5bGVkLmRpdmBcbiAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dH1cbiAganVzdGlmeS1jb250ZW50OiBzdGFydDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBmbGV4LXdyYXA6IHdyYXA7XG4gIGhlaWdodDogYXV0bztcbiAgbWFyZ2luLWJvdHRvbTogMnB4O1xuICBwYWRkaW5nOiA0cHggN3B4IDRweCA0cHg7XG5gO1xuXG5jb25zdCBDaGlja2xldGVkSW5wdXQgPSAoe1xuICBmb2N1cyxcbiAgZGlzYWJsZWQsXG4gIGlzRXJyb3IsXG4gIG9uQ2xpY2ssXG4gIHNlbGVjdGVkSXRlbXMgPSBbXSxcbiAgcGxhY2Vob2xkZXIgPSAnJyxcbiAgcmVtb3ZlSXRlbSxcbiAgZGlzcGxheU9wdGlvbiA9IGQgPT4gZFxufSkgPT4gKFxuICA8Q2hpY2tsZXRlZElucHV0Q29udGFpbmVyXG4gICAgZm9jdXM9e2ZvY3VzfVxuICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICBlcnJvcj17aXNFcnJvcn1cbiAgICBvbkNsaWNrPXtvbkNsaWNrfT5cbiAgICB7c2VsZWN0ZWRJdGVtcy5sZW5ndGggPiAwID8gc2VsZWN0ZWRJdGVtcy5tYXAoKGl0ZW0sIGkpID0+IChcbiAgICAgIDxDaGlja2xldFxuICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICAgIGtleT17YCR7ZGlzcGxheU9wdGlvbihpdGVtKX1fJHtpfWB9XG4gICAgICAgIG5hbWU9e2Rpc3BsYXlPcHRpb24oaXRlbSl9XG4gICAgICAgIHJlbW92ZT17ZSA9PiByZW1vdmVJdGVtKGl0ZW0sIGUpfVxuICAgICAgLz5cbiAgICApKSA6IHBsYWNlaG9sZGVyfVxuICA8L0NoaWNrbGV0ZWRJbnB1dENvbnRhaW5lcj5cbik7XG5cbkNoaWNrbGV0ZWRJbnB1dC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5cbmV4cG9ydCBkZWZhdWx0IENoaWNrbGV0ZWRJbnB1dDtcbiJdfQ==