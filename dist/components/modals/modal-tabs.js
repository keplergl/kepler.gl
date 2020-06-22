"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

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

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n    margin-left: 16px;\n    font-size: 12px;\n  "]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  border-bottom: 3px solid transparent;\n  cursor: pointer;\n  margin-left: 32px;\n  padding: 16px 0;\n  font-size: 14px;\n  font-weight: 400;\n  color: ", ";\n\n  ", ";\n\n  :first-child {\n    margin-left: 0;\n    padding-left: 0;\n  }\n\n  :hover {\n    color: ", ";\n  }\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n    font-size: 12px;\n  "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  align-items: flex-end;\n  display: flex;\n  border-bottom: 1px solid #d8d8d8;\n  margin-bottom: 32px;\n  justify-content: space-between;\n\n  .load-data-modal__tab__inner {\n    display: flex;\n    width: 100%;\n  }\n\n  .load-data-modal__tab__item.active {\n    color: ", ";\n    border-bottom: 3px solid ", ";\n    font-weight: 500;\n  }\n\n  ", ";\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var ModalTab = _styledComponents["default"].div(_templateObject(), function (props) {
  return props.theme.textColorLT;
}, function (props) {
  return props.theme.textColorLT;
}, _styles.media.portable(_templateObject2()));

var StyledLoadDataModalTabItem = _styledComponents["default"].div(_templateObject3(), function (props) {
  return props.theme.subtextColorLT;
}, _styles.media.portable(_templateObject4()), function (props) {
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
  return method.tabElementType ? _react["default"].createElement(method.tabElementType, {
    onClick: onClick,
    intl: intl
  }) : _react["default"].createElement(StyledLoadDataModalTabItem, {
    className: (0, _classnames["default"])('load-data-modal__tab__item', {
      active: currentMethod && method.id === currentMethod
    }),
    onClick: onClick
  }, _react["default"].createElement("div", null, method.label ? _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: method.label
  }) : method.id));
};

exports.ModalTabItem = ModalTabItem;

function ModalTabsFactory() {
  var ModalTabs = function ModalTabs(_ref2) {
    var currentMethod = _ref2.currentMethod,
        toggleMethod = _ref2.toggleMethod,
        loadingMethods = _ref2.loadingMethods;
    return _react["default"].createElement(ModalTab, {
      className: "load-data-modal__tab"
    }, _react["default"].createElement("div", {
      className: "load-data-modal__tab__inner"
    }, loadingMethods.map(function (method) {
      return _react["default"].createElement(ModalTabItem, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9tb2RhbC10YWJzLmpzIl0sIm5hbWVzIjpbIk1vZGFsVGFiIiwic3R5bGVkIiwiZGl2IiwicHJvcHMiLCJ0aGVtZSIsInRleHRDb2xvckxUIiwibWVkaWEiLCJwb3J0YWJsZSIsIlN0eWxlZExvYWREYXRhTW9kYWxUYWJJdGVtIiwic3VidGV4dENvbG9yTFQiLCJub29wIiwiTW9kYWxUYWJJdGVtIiwiY3VycmVudE1ldGhvZCIsIm1ldGhvZCIsInRvZ2dsZU1ldGhvZCIsIm9uQ2xpY2siLCJpbnRsIiwidGFiRWxlbWVudFR5cGUiLCJhY3RpdmUiLCJpZCIsImxhYmVsIiwiTW9kYWxUYWJzRmFjdG9yeSIsIk1vZGFsVGFicyIsImxvYWRpbmdNZXRob2RzIiwibWFwIiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwiZnVuYyIsImlzUmVxdWlyZWQiLCJzdHJpbmciLCJhcnJheU9mIiwib2JqZWN0IiwiZGVmYXVsdFByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxRQUFRLEdBQUdDLDZCQUFPQyxHQUFWLG9CQWFELFVBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsV0FBaEI7QUFBQSxDQWJKLEVBY2lCLFVBQUFGLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsV0FBaEI7QUFBQSxDQWR0QixFQWtCVkMsY0FBTUMsUUFsQkkscUJBQWQ7O0FBdUJBLElBQU1DLDBCQUEwQixHQUFHUCw2QkFBT0MsR0FBVixxQkFPckIsVUFBQUMsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZSyxjQUFoQjtBQUFBLENBUGdCLEVBUzVCSCxjQUFNQyxRQVRzQixzQkFvQm5CLFVBQUFKLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsV0FBaEI7QUFBQSxDQXBCYyxDQUFoQzs7QUF3QkEsSUFBTUssSUFBSSxHQUFHLFNBQVBBLElBQU8sR0FBTSxDQUFFLENBQXJCOztBQUVPLElBQU1DLFlBQVksR0FBRyxTQUFmQSxZQUFlLE9BQTJDO0FBQUEsTUFBekNDLGFBQXlDLFFBQXpDQSxhQUF5QztBQUFBLE1BQTFCQyxNQUEwQixRQUExQkEsTUFBMEI7QUFBQSxNQUFsQkMsWUFBa0IsUUFBbEJBLFlBQWtCO0FBQ3JFLE1BQU1DLE9BQU8sR0FBRyx3QkFBWTtBQUFBLFdBQU1ELFlBQVksQ0FBQ0QsTUFBRCxDQUFsQjtBQUFBLEdBQVosRUFBd0MsQ0FBQ0EsTUFBRCxFQUFTQyxZQUFULENBQXhDLENBQWhCO0FBQ0EsTUFBTUUsSUFBSSxHQUFHLHlCQUFiO0FBRUEsU0FBT0gsTUFBTSxDQUFDSSxjQUFQLEdBQ0wsZ0NBQUMsTUFBRCxDQUFRLGNBQVI7QUFBdUIsSUFBQSxPQUFPLEVBQUVGLE9BQWhDO0FBQXlDLElBQUEsSUFBSSxFQUFFQztBQUEvQyxJQURLLEdBR0wsZ0NBQUMsMEJBQUQ7QUFDRSxJQUFBLFNBQVMsRUFBRSw0QkFBVyw0QkFBWCxFQUF5QztBQUNsREUsTUFBQUEsTUFBTSxFQUFFTixhQUFhLElBQUlDLE1BQU0sQ0FBQ00sRUFBUCxLQUFjUDtBQURXLEtBQXpDLENBRGI7QUFJRSxJQUFBLE9BQU8sRUFBRUc7QUFKWCxLQU1FLDZDQUFNRixNQUFNLENBQUNPLEtBQVAsR0FBZSxnQ0FBQywyQkFBRDtBQUFrQixJQUFBLEVBQUUsRUFBRVAsTUFBTSxDQUFDTztBQUE3QixJQUFmLEdBQXdEUCxNQUFNLENBQUNNLEVBQXJFLENBTkYsQ0FIRjtBQVlELENBaEJNOzs7O0FBa0JQLFNBQVNFLGdCQUFULEdBQTRCO0FBQzFCLE1BQU1DLFNBQVMsR0FBRyxTQUFaQSxTQUFZO0FBQUEsUUFBRVYsYUFBRixTQUFFQSxhQUFGO0FBQUEsUUFBaUJFLFlBQWpCLFNBQWlCQSxZQUFqQjtBQUFBLFFBQStCUyxjQUEvQixTQUErQkEsY0FBL0I7QUFBQSxXQUNoQixnQ0FBQyxRQUFEO0FBQVUsTUFBQSxTQUFTLEVBQUM7QUFBcEIsT0FDRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsT0FDR0EsY0FBYyxDQUFDQyxHQUFmLENBQW1CLFVBQUFYLE1BQU07QUFBQSxhQUN4QixnQ0FBQyxZQUFEO0FBQ0UsUUFBQSxHQUFHLEVBQUVBLE1BQU0sQ0FBQ00sRUFEZDtBQUVFLFFBQUEsTUFBTSxFQUFFTixNQUZWO0FBR0UsUUFBQSxhQUFhLEVBQUVELGFBSGpCO0FBSUUsUUFBQSxZQUFZLEVBQUVFO0FBSmhCLFFBRHdCO0FBQUEsS0FBekIsQ0FESCxDQURGLENBRGdCO0FBQUEsR0FBbEI7O0FBZUFRLEVBQUFBLFNBQVMsQ0FBQ0csU0FBVixHQUFzQjtBQUNwQlgsSUFBQUEsWUFBWSxFQUFFWSxzQkFBVUMsSUFBVixDQUFlQyxVQURUO0FBRXBCaEIsSUFBQUEsYUFBYSxFQUFFYyxzQkFBVUcsTUFGTDtBQUdwQk4sSUFBQUEsY0FBYyxFQUFFRyxzQkFBVUksT0FBVixDQUFrQkosc0JBQVVLLE1BQTVCO0FBSEksR0FBdEI7QUFNQVQsRUFBQUEsU0FBUyxDQUFDVSxZQUFWLEdBQXlCO0FBQ3ZCbEIsSUFBQUEsWUFBWSxFQUFFSixJQURTO0FBRXZCRSxJQUFBQSxhQUFhLEVBQUUsSUFGUTtBQUd2QlcsSUFBQUEsY0FBYyxFQUFFO0FBSE8sR0FBekI7QUFNQSxTQUFPRCxTQUFQO0FBQ0Q7O2VBRWNELGdCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7dXNlQ2FsbGJhY2t9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHttZWRpYX0gZnJvbSAnc3R5bGVzJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZSwgdXNlSW50bH0gZnJvbSAncmVhY3QtaW50bCc7XG5cbmNvbnN0IE1vZGFsVGFiID0gc3R5bGVkLmRpdmBcbiAgYWxpZ24taXRlbXM6IGZsZXgtZW5kO1xuICBkaXNwbGF5OiBmbGV4O1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2Q4ZDhkODtcbiAgbWFyZ2luLWJvdHRvbTogMzJweDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuXG4gIC5sb2FkLWRhdGEtbW9kYWxfX3RhYl9faW5uZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgd2lkdGg6IDEwMCU7XG4gIH1cblxuICAubG9hZC1kYXRhLW1vZGFsX190YWJfX2l0ZW0uYWN0aXZlIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JMVH07XG4gICAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yTFR9O1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIH1cblxuICAke21lZGlhLnBvcnRhYmxlYFxuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgYH07XG5gO1xuXG5jb25zdCBTdHlsZWRMb2FkRGF0YU1vZGFsVGFiSXRlbSA9IHN0eWxlZC5kaXZgXG4gIGJvcmRlci1ib3R0b206IDNweCBzb2xpZCB0cmFuc3BhcmVudDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBtYXJnaW4tbGVmdDogMzJweDtcbiAgcGFkZGluZzogMTZweCAwO1xuICBmb250LXNpemU6IDE0cHg7XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnN1YnRleHRDb2xvckxUfTtcblxuICAke21lZGlhLnBvcnRhYmxlYFxuICAgIG1hcmdpbi1sZWZ0OiAxNnB4O1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgYH07XG5cbiAgOmZpcnN0LWNoaWxkIHtcbiAgICBtYXJnaW4tbGVmdDogMDtcbiAgICBwYWRkaW5nLWxlZnQ6IDA7XG4gIH1cblxuICA6aG92ZXIge1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckxUfTtcbiAgfVxuYDtcblxuY29uc3Qgbm9vcCA9ICgpID0+IHt9O1xuXG5leHBvcnQgY29uc3QgTW9kYWxUYWJJdGVtID0gKHtjdXJyZW50TWV0aG9kLCBtZXRob2QsIHRvZ2dsZU1ldGhvZH0pID0+IHtcbiAgY29uc3Qgb25DbGljayA9IHVzZUNhbGxiYWNrKCgpID0+IHRvZ2dsZU1ldGhvZChtZXRob2QpLCBbbWV0aG9kLCB0b2dnbGVNZXRob2RdKTtcbiAgY29uc3QgaW50bCA9IHVzZUludGwoKTtcblxuICByZXR1cm4gbWV0aG9kLnRhYkVsZW1lbnRUeXBlID8gKFxuICAgIDxtZXRob2QudGFiRWxlbWVudFR5cGUgb25DbGljaz17b25DbGlja30gaW50bD17aW50bH0gLz5cbiAgKSA6IChcbiAgICA8U3R5bGVkTG9hZERhdGFNb2RhbFRhYkl0ZW1cbiAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnbG9hZC1kYXRhLW1vZGFsX190YWJfX2l0ZW0nLCB7XG4gICAgICAgIGFjdGl2ZTogY3VycmVudE1ldGhvZCAmJiBtZXRob2QuaWQgPT09IGN1cnJlbnRNZXRob2RcbiAgICAgIH0pfVxuICAgICAgb25DbGljaz17b25DbGlja31cbiAgICA+XG4gICAgICA8ZGl2PnttZXRob2QubGFiZWwgPyA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17bWV0aG9kLmxhYmVsfSAvPiA6IG1ldGhvZC5pZH08L2Rpdj5cbiAgICA8L1N0eWxlZExvYWREYXRhTW9kYWxUYWJJdGVtPlxuICApO1xufTtcblxuZnVuY3Rpb24gTW9kYWxUYWJzRmFjdG9yeSgpIHtcbiAgY29uc3QgTW9kYWxUYWJzID0gKHtjdXJyZW50TWV0aG9kLCB0b2dnbGVNZXRob2QsIGxvYWRpbmdNZXRob2RzfSkgPT4gKFxuICAgIDxNb2RhbFRhYiBjbGFzc05hbWU9XCJsb2FkLWRhdGEtbW9kYWxfX3RhYlwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJsb2FkLWRhdGEtbW9kYWxfX3RhYl9faW5uZXJcIj5cbiAgICAgICAge2xvYWRpbmdNZXRob2RzLm1hcChtZXRob2QgPT4gKFxuICAgICAgICAgIDxNb2RhbFRhYkl0ZW1cbiAgICAgICAgICAgIGtleT17bWV0aG9kLmlkfVxuICAgICAgICAgICAgbWV0aG9kPXttZXRob2R9XG4gICAgICAgICAgICBjdXJyZW50TWV0aG9kPXtjdXJyZW50TWV0aG9kfVxuICAgICAgICAgICAgdG9nZ2xlTWV0aG9kPXt0b2dnbGVNZXRob2R9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSl9XG4gICAgICA8L2Rpdj5cbiAgICA8L01vZGFsVGFiPlxuICApO1xuXG4gIE1vZGFsVGFicy5wcm9wVHlwZXMgPSB7XG4gICAgdG9nZ2xlTWV0aG9kOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGN1cnJlbnRNZXRob2Q6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgbG9hZGluZ01ldGhvZHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpXG4gIH07XG5cbiAgTW9kYWxUYWJzLmRlZmF1bHRQcm9wcyA9IHtcbiAgICB0b2dnbGVNZXRob2Q6IG5vb3AsXG4gICAgY3VycmVudE1ldGhvZDogbnVsbCxcbiAgICBsb2FkaW5nTWV0aG9kczogW11cbiAgfTtcblxuICByZXR1cm4gTW9kYWxUYWJzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBNb2RhbFRhYnNGYWN0b3J5O1xuIl19