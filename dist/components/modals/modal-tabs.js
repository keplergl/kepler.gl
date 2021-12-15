"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ModalTabItem = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styles = require("../../styles");

var _reactIntl = require("react-intl");

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

var ModalTab = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  align-items: flex-end;\n  display: flex;\n  border-bottom: 1px solid #d8d8d8;\n  margin-bottom: 32px;\n  justify-content: space-between;\n\n  .load-data-modal__tab__inner {\n    display: flex;\n    width: 100%;\n  }\n\n  .load-data-modal__tab__item.active {\n    color: ", ";\n    border-bottom: 3px solid ", ";\n    font-weight: 500;\n  }\n\n  ", ";\n"])), function (props) {
  return props.theme.textColorLT;
}, function (props) {
  return props.theme.textColorLT;
}, _styles.media.portable(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n    font-size: 12px;\n  "]))));

var StyledLoadDataModalTabItem = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  border-bottom: 3px solid transparent;\n  cursor: pointer;\n  margin-left: 32px;\n  padding: 16px 0;\n  font-size: 14px;\n  font-weight: 400;\n  color: ", ";\n\n  ", ";\n\n  :first-child {\n    margin-left: 0;\n    padding-left: 0;\n  }\n\n  :hover {\n    color: ", ";\n  }\n"])), function (props) {
  return props.theme.subtextColorLT;
}, _styles.media.portable(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n    margin-left: 16px;\n    font-size: 12px;\n  "]))), function (props) {
  return props.theme.textColorLT;
});

var noop = function noop() {};

var ModalTabItem = function ModalTabItem(_ref) {
  var currentMethod = _ref.currentMethod,
      method = _ref.method,
      toggleMethod = _ref.toggleMethod;
  var onClick = (0, _react.useCallback)(function () {
    return toggleMethod(method);
  }, [method, toggleMethod]);
  var intl = (0, _reactIntl.useIntl)();
  return method.tabElementType ? /*#__PURE__*/_react["default"].createElement(method.tabElementType, {
    onClick: onClick,
    intl: intl
  }) : /*#__PURE__*/_react["default"].createElement(StyledLoadDataModalTabItem, {
    className: (0, _classnames["default"])('load-data-modal__tab__item', {
      active: currentMethod && method.id === currentMethod
    }),
    onClick: onClick
  }, /*#__PURE__*/_react["default"].createElement("div", null, method.label ? /*#__PURE__*/_react["default"].createElement(_reactIntl.FormattedMessage, {
    id: method.label
  }) : method.id));
};

exports.ModalTabItem = ModalTabItem;

function ModalTabsFactory() {
  var ModalTabs = function ModalTabs(_ref2) {
    var currentMethod = _ref2.currentMethod,
        toggleMethod = _ref2.toggleMethod,
        loadingMethods = _ref2.loadingMethods;
    return /*#__PURE__*/_react["default"].createElement(ModalTab, {
      className: "load-data-modal__tab"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "load-data-modal__tab__inner"
    }, loadingMethods.map(function (method) {
      return /*#__PURE__*/_react["default"].createElement(ModalTabItem, {
        key: method.id,
        method: method,
        currentMethod: currentMethod,
        toggleMethod: toggleMethod
      });
    })));
  };

  ModalTabs.propTypes = {
    toggleMethod: _propTypes["default"].func.isRequired,
    currentMethod: _propTypes["default"].string,
    loadingMethods: _propTypes["default"].arrayOf(_propTypes["default"].object)
  };
  ModalTabs.defaultProps = {
    toggleMethod: noop,
    currentMethod: null,
    loadingMethods: []
  };
  return ModalTabs;
}

var _default = ModalTabsFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9tb2RhbC10YWJzLmpzIl0sIm5hbWVzIjpbIk1vZGFsVGFiIiwic3R5bGVkIiwiZGl2IiwicHJvcHMiLCJ0aGVtZSIsInRleHRDb2xvckxUIiwibWVkaWEiLCJwb3J0YWJsZSIsIlN0eWxlZExvYWREYXRhTW9kYWxUYWJJdGVtIiwic3VidGV4dENvbG9yTFQiLCJub29wIiwiTW9kYWxUYWJJdGVtIiwiY3VycmVudE1ldGhvZCIsIm1ldGhvZCIsInRvZ2dsZU1ldGhvZCIsIm9uQ2xpY2siLCJpbnRsIiwidGFiRWxlbWVudFR5cGUiLCJhY3RpdmUiLCJpZCIsImxhYmVsIiwiTW9kYWxUYWJzRmFjdG9yeSIsIk1vZGFsVGFicyIsImxvYWRpbmdNZXRob2RzIiwibWFwIiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwiZnVuYyIsImlzUmVxdWlyZWQiLCJzdHJpbmciLCJhcnJheU9mIiwib2JqZWN0IiwiZGVmYXVsdFByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUEsSUFBTUEsUUFBUSxHQUFHQyw2QkFBT0MsR0FBViwyYkFhRCxVQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLFdBQWhCO0FBQUEsQ0FiSixFQWNpQixVQUFBRixLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLFdBQWhCO0FBQUEsQ0FkdEIsRUFrQlZDLGNBQU1DLFFBbEJJLG1IQUFkOztBQXVCQSxJQUFNQywwQkFBMEIsR0FBR1AsNkJBQU9DLEdBQVYsK1dBT3JCLFVBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUssY0FBaEI7QUFBQSxDQVBnQixFQVM1QkgsY0FBTUMsUUFUc0IsNElBb0JuQixVQUFBSixLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLFdBQWhCO0FBQUEsQ0FwQmMsQ0FBaEM7O0FBd0JBLElBQU1LLElBQUksR0FBRyxTQUFQQSxJQUFPLEdBQU0sQ0FBRSxDQUFyQjs7QUFFTyxJQUFNQyxZQUFZLEdBQUcsU0FBZkEsWUFBZSxPQUEyQztBQUFBLE1BQXpDQyxhQUF5QyxRQUF6Q0EsYUFBeUM7QUFBQSxNQUExQkMsTUFBMEIsUUFBMUJBLE1BQTBCO0FBQUEsTUFBbEJDLFlBQWtCLFFBQWxCQSxZQUFrQjtBQUNyRSxNQUFNQyxPQUFPLEdBQUcsd0JBQVk7QUFBQSxXQUFNRCxZQUFZLENBQUNELE1BQUQsQ0FBbEI7QUFBQSxHQUFaLEVBQXdDLENBQUNBLE1BQUQsRUFBU0MsWUFBVCxDQUF4QyxDQUFoQjtBQUNBLE1BQU1FLElBQUksR0FBRyx5QkFBYjtBQUVBLFNBQU9ILE1BQU0sQ0FBQ0ksY0FBUCxnQkFDTCxnQ0FBQyxNQUFELENBQVEsY0FBUjtBQUF1QixJQUFBLE9BQU8sRUFBRUYsT0FBaEM7QUFBeUMsSUFBQSxJQUFJLEVBQUVDO0FBQS9DLElBREssZ0JBR0wsZ0NBQUMsMEJBQUQ7QUFDRSxJQUFBLFNBQVMsRUFBRSw0QkFBVyw0QkFBWCxFQUF5QztBQUNsREUsTUFBQUEsTUFBTSxFQUFFTixhQUFhLElBQUlDLE1BQU0sQ0FBQ00sRUFBUCxLQUFjUDtBQURXLEtBQXpDLENBRGI7QUFJRSxJQUFBLE9BQU8sRUFBRUc7QUFKWCxrQkFNRSw2Q0FBTUYsTUFBTSxDQUFDTyxLQUFQLGdCQUFlLGdDQUFDLDJCQUFEO0FBQWtCLElBQUEsRUFBRSxFQUFFUCxNQUFNLENBQUNPO0FBQTdCLElBQWYsR0FBd0RQLE1BQU0sQ0FBQ00sRUFBckUsQ0FORixDQUhGO0FBWUQsQ0FoQk07Ozs7QUFrQlAsU0FBU0UsZ0JBQVQsR0FBNEI7QUFDMUIsTUFBTUMsU0FBUyxHQUFHLFNBQVpBLFNBQVk7QUFBQSxRQUFFVixhQUFGLFNBQUVBLGFBQUY7QUFBQSxRQUFpQkUsWUFBakIsU0FBaUJBLFlBQWpCO0FBQUEsUUFBK0JTLGNBQS9CLFNBQStCQSxjQUEvQjtBQUFBLHdCQUNoQixnQ0FBQyxRQUFEO0FBQVUsTUFBQSxTQUFTLEVBQUM7QUFBcEIsb0JBQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLE9BQ0dBLGNBQWMsQ0FBQ0MsR0FBZixDQUFtQixVQUFBWCxNQUFNO0FBQUEsMEJBQ3hCLGdDQUFDLFlBQUQ7QUFDRSxRQUFBLEdBQUcsRUFBRUEsTUFBTSxDQUFDTSxFQURkO0FBRUUsUUFBQSxNQUFNLEVBQUVOLE1BRlY7QUFHRSxRQUFBLGFBQWEsRUFBRUQsYUFIakI7QUFJRSxRQUFBLFlBQVksRUFBRUU7QUFKaEIsUUFEd0I7QUFBQSxLQUF6QixDQURILENBREYsQ0FEZ0I7QUFBQSxHQUFsQjs7QUFlQVEsRUFBQUEsU0FBUyxDQUFDRyxTQUFWLEdBQXNCO0FBQ3BCWCxJQUFBQSxZQUFZLEVBQUVZLHNCQUFVQyxJQUFWLENBQWVDLFVBRFQ7QUFFcEJoQixJQUFBQSxhQUFhLEVBQUVjLHNCQUFVRyxNQUZMO0FBR3BCTixJQUFBQSxjQUFjLEVBQUVHLHNCQUFVSSxPQUFWLENBQWtCSixzQkFBVUssTUFBNUI7QUFISSxHQUF0QjtBQU1BVCxFQUFBQSxTQUFTLENBQUNVLFlBQVYsR0FBeUI7QUFDdkJsQixJQUFBQSxZQUFZLEVBQUVKLElBRFM7QUFFdkJFLElBQUFBLGFBQWEsRUFBRSxJQUZRO0FBR3ZCVyxJQUFBQSxjQUFjLEVBQUU7QUFITyxHQUF6QjtBQU1BLFNBQU9ELFNBQVA7QUFDRDs7ZUFFY0QsZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHt1c2VDYWxsYmFja30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge21lZGlhfSBmcm9tICdzdHlsZXMnO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlLCB1c2VJbnRsfSBmcm9tICdyZWFjdC1pbnRsJztcblxuY29uc3QgTW9kYWxUYWIgPSBzdHlsZWQuZGl2YFxuICBhbGlnbi1pdGVtczogZmxleC1lbmQ7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZDhkOGQ4O1xuICBtYXJnaW4tYm90dG9tOiAzMnB4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG5cbiAgLmxvYWQtZGF0YS1tb2RhbF9fdGFiX19pbm5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICB3aWR0aDogMTAwJTtcbiAgfVxuXG4gIC5sb2FkLWRhdGEtbW9kYWxfX3RhYl9faXRlbS5hY3RpdmUge1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckxUfTtcbiAgICBib3JkZXItYm90dG9tOiAzcHggc29saWQgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JMVH07XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgfVxuXG4gICR7bWVkaWEucG9ydGFibGVgXG4gICAgZm9udC1zaXplOiAxMnB4O1xuICBgfTtcbmA7XG5cbmNvbnN0IFN0eWxlZExvYWREYXRhTW9kYWxUYWJJdGVtID0gc3R5bGVkLmRpdmBcbiAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkIHRyYW5zcGFyZW50O1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIG1hcmdpbi1sZWZ0OiAzMnB4O1xuICBwYWRkaW5nOiAxNnB4IDA7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc3VidGV4dENvbG9yTFR9O1xuXG4gICR7bWVkaWEucG9ydGFibGVgXG4gICAgbWFyZ2luLWxlZnQ6IDE2cHg7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICBgfTtcblxuICA6Zmlyc3QtY2hpbGQge1xuICAgIG1hcmdpbi1sZWZ0OiAwO1xuICAgIHBhZGRpbmctbGVmdDogMDtcbiAgfVxuXG4gIDpob3ZlciB7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yTFR9O1xuICB9XG5gO1xuXG5jb25zdCBub29wID0gKCkgPT4ge307XG5cbmV4cG9ydCBjb25zdCBNb2RhbFRhYkl0ZW0gPSAoe2N1cnJlbnRNZXRob2QsIG1ldGhvZCwgdG9nZ2xlTWV0aG9kfSkgPT4ge1xuICBjb25zdCBvbkNsaWNrID0gdXNlQ2FsbGJhY2soKCkgPT4gdG9nZ2xlTWV0aG9kKG1ldGhvZCksIFttZXRob2QsIHRvZ2dsZU1ldGhvZF0pO1xuICBjb25zdCBpbnRsID0gdXNlSW50bCgpO1xuXG4gIHJldHVybiBtZXRob2QudGFiRWxlbWVudFR5cGUgPyAoXG4gICAgPG1ldGhvZC50YWJFbGVtZW50VHlwZSBvbkNsaWNrPXtvbkNsaWNrfSBpbnRsPXtpbnRsfSAvPlxuICApIDogKFxuICAgIDxTdHlsZWRMb2FkRGF0YU1vZGFsVGFiSXRlbVxuICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdsb2FkLWRhdGEtbW9kYWxfX3RhYl9faXRlbScsIHtcbiAgICAgICAgYWN0aXZlOiBjdXJyZW50TWV0aG9kICYmIG1ldGhvZC5pZCA9PT0gY3VycmVudE1ldGhvZFxuICAgICAgfSl9XG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgID5cbiAgICAgIDxkaXY+e21ldGhvZC5sYWJlbCA/IDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXttZXRob2QubGFiZWx9IC8+IDogbWV0aG9kLmlkfTwvZGl2PlxuICAgIDwvU3R5bGVkTG9hZERhdGFNb2RhbFRhYkl0ZW0+XG4gICk7XG59O1xuXG5mdW5jdGlvbiBNb2RhbFRhYnNGYWN0b3J5KCkge1xuICBjb25zdCBNb2RhbFRhYnMgPSAoe2N1cnJlbnRNZXRob2QsIHRvZ2dsZU1ldGhvZCwgbG9hZGluZ01ldGhvZHN9KSA9PiAoXG4gICAgPE1vZGFsVGFiIGNsYXNzTmFtZT1cImxvYWQtZGF0YS1tb2RhbF9fdGFiXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImxvYWQtZGF0YS1tb2RhbF9fdGFiX19pbm5lclwiPlxuICAgICAgICB7bG9hZGluZ01ldGhvZHMubWFwKG1ldGhvZCA9PiAoXG4gICAgICAgICAgPE1vZGFsVGFiSXRlbVxuICAgICAgICAgICAga2V5PXttZXRob2QuaWR9XG4gICAgICAgICAgICBtZXRob2Q9e21ldGhvZH1cbiAgICAgICAgICAgIGN1cnJlbnRNZXRob2Q9e2N1cnJlbnRNZXRob2R9XG4gICAgICAgICAgICB0b2dnbGVNZXRob2Q9e3RvZ2dsZU1ldGhvZH1cbiAgICAgICAgICAvPlxuICAgICAgICApKX1cbiAgICAgIDwvZGl2PlxuICAgIDwvTW9kYWxUYWI+XG4gICk7XG5cbiAgTW9kYWxUYWJzLnByb3BUeXBlcyA9IHtcbiAgICB0b2dnbGVNZXRob2Q6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgY3VycmVudE1ldGhvZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBsb2FkaW5nTWV0aG9kczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdClcbiAgfTtcblxuICBNb2RhbFRhYnMuZGVmYXVsdFByb3BzID0ge1xuICAgIHRvZ2dsZU1ldGhvZDogbm9vcCxcbiAgICBjdXJyZW50TWV0aG9kOiBudWxsLFxuICAgIGxvYWRpbmdNZXRob2RzOiBbXVxuICB9O1xuXG4gIHJldHVybiBNb2RhbFRhYnM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1vZGFsVGFic0ZhY3Rvcnk7XG4iXX0=