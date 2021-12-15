"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.CloudStorageDropdownFactory = exports.SaveExportDropdownFactory = exports.PanelHeaderDropdownFactory = exports.PanelAction = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reselect = require("reselect");

var _styledComponents2 = require("../common/styled-components");

var _logo = _interopRequireDefault(require("../common/logo"));

var _icons = require("../common/icons");

var _panelDropdown = _interopRequireDefault(require("./panel-dropdown"));

var _toolbar = _interopRequireDefault(require("../common/toolbar"));

var _toolbarItem = _interopRequireDefault(require("../common/toolbar-item"));

var _localization = require("../../localization");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var StyledPanelHeader = _styledComponents["default"].div.attrs({
  className: 'side-side-panel__header'
})(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  background-color: ", ";\n  padding: 12px 16px 0 16px;\n"])), function (props) {
  return props.theme.sidePanelHeaderBg;
});

var StyledPanelHeaderTop = _styledComponents["default"].div.attrs({
  className: 'side-panel__header__top'
})(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 16px;\n  width: 100%;\n"])));

var StyledPanelTopActions = _styledComponents["default"].div.attrs({
  className: 'side-panel__top__actions'
})(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n"])));

var StyledPanelAction = _styledComponents["default"].div.attrs({
  className: 'side-panel__panel-header__action'
})(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n  align-items: center;\n  border-radius: 2px;\n  color: ", ";\n  display: flex;\n  height: 26px;\n  justify-content: space-between;\n  margin-left: 4px;\n  padding: 5px;\n  font-weight: bold;\n  p {\n    display: inline-block;\n    margin-right: 6px;\n  }\n  a {\n    height: 20px;\n  }\n\n  :hover {\n    cursor: pointer;\n    color: ", ";\n\n    a {\n      color: ", ";\n    }\n  }\n"])), function (props) {
  return props.active ? props.theme.textColorHl : props.theme.subtextColor;
}, function (props) {
  return props.theme.textColorHl;
}, function (props) {
  return props.theme.textColorHl;
});

var StyledToolbar = (0, _styledComponents["default"])(_toolbar["default"])(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2["default"])(["\n  position: absolute;\n"])));

var PanelAction = function PanelAction(_ref) {
  var item = _ref.item,
      onClick = _ref.onClick;
  return /*#__PURE__*/_react["default"].createElement(StyledPanelAction, {
    "data-tip": true,
    "data-for": "".concat(item.id, "-action"),
    onClick: onClick
  }, item.label ? /*#__PURE__*/_react["default"].createElement("p", null, item.label) : null, /*#__PURE__*/_react["default"].createElement("a", {
    target: item.blank ? '_blank' : '',
    href: item.href,
    rel: "noreferrer"
  }, /*#__PURE__*/_react["default"].createElement(item.iconComponent, (0, _extends2["default"])({
    height: "20px"
  }, item.iconComponentProps))), item.tooltip ? /*#__PURE__*/_react["default"].createElement(_styledComponents2.Tooltip, {
    id: "".concat(item.id, "-action"),
    place: "bottom",
    delayShow: 500,
    effect: "solid"
  }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
    id: item.tooltip
  })) : null);
};

exports.PanelAction = PanelAction;

var PanelHeaderDropdownFactory = function PanelHeaderDropdownFactory() {
  var PanelHeaderDropdown = function PanelHeaderDropdown(_ref2) {
    var items = _ref2.items,
        show = _ref2.show,
        onClose = _ref2.onClose,
        id = _ref2.id;
    return /*#__PURE__*/_react["default"].createElement(StyledToolbar, {
      show: show,
      className: "".concat(id, "-dropdown")
    }, /*#__PURE__*/_react["default"].createElement(_panelDropdown["default"], {
      className: "panel-header-dropdown__inner",
      show: show,
      onClose: onClose
    }, items.map(function (item) {
      return /*#__PURE__*/_react["default"].createElement(_toolbarItem["default"], {
        id: item.key,
        key: item.key,
        label: item.label,
        icon: item.icon,
        onClick: item.onClick,
        onClose: onClose
      });
    })));
  };

  return PanelHeaderDropdown;
};

exports.PanelHeaderDropdownFactory = PanelHeaderDropdownFactory;

var getDropdownItemsSelector = function getDropdownItemsSelector() {
  return (0, _reselect.createSelector)(function (props) {
    return props;
  }, function (props) {
    return props.items.map(function (t) {
      return _objectSpread(_objectSpread({}, t), {}, {
        onClick: t.onClick && t.onClick(props) ? t.onClick(props) : null
      });
    }).filter(function (l) {
      return l.onClick;
    });
  });
};

var SaveExportDropdownFactory = function SaveExportDropdownFactory(PanelHeaderDropdown) {
  var dropdownItemsSelector = getDropdownItemsSelector();

  var SaveExportDropdown = function SaveExportDropdown(props) {
    return /*#__PURE__*/_react["default"].createElement(PanelHeaderDropdown, {
      items: dropdownItemsSelector(props),
      show: props.show,
      onClose: props.onClose,
      id: "save-export"
    });
  };

  SaveExportDropdown.defaultProps = {
    items: [{
      label: 'toolbar.exportImage',
      icon: _icons.Picture,
      key: 'image',
      onClick: function onClick(props) {
        return props.onExportImage;
      }
    }, {
      label: 'toolbar.exportData',
      icon: _icons.DataTable,
      key: 'data',
      onClick: function onClick(props) {
        return props.onExportData;
      }
    }, {
      label: 'toolbar.exportMap',
      icon: _icons.Map,
      key: 'map',
      onClick: function onClick(props) {
        return props.onExportMap;
      }
    }, {
      label: 'toolbar.saveMap',
      icon: _icons.Save2,
      key: 'save',
      onClick: function onClick(props) {
        return props.onSaveMap;
      }
    }, {
      label: 'toolbar.shareMapURL',
      icon: _icons.Share,
      key: 'share',
      onClick: function onClick(props) {
        return props.onShareMap;
      }
    }]
  };
  return SaveExportDropdown;
};

exports.SaveExportDropdownFactory = SaveExportDropdownFactory;
SaveExportDropdownFactory.deps = [PanelHeaderDropdownFactory];

var CloudStorageDropdownFactory = function CloudStorageDropdownFactory(PanelHeaderDropdown) {
  var dropdownItemsSelector = getDropdownItemsSelector();

  var CloudStorageDropdown = function CloudStorageDropdown(props) {
    return /*#__PURE__*/_react["default"].createElement(PanelHeaderDropdown, {
      items: dropdownItemsSelector(props),
      show: props.show,
      onClose: props.onClose,
      id: "cloud-storage"
    });
  };

  CloudStorageDropdown.defaultProps = {
    items: [{
      label: 'Save',
      icon: _icons.Save2,
      key: 'save',
      onClick: function onClick(props) {
        return props.onSaveToStorage;
      }
    }, {
      label: 'Save As',
      icon: _icons.Save2,
      key: 'saveAs',
      onClick: function onClick(props) {
        return props.onSaveAsToStorage;
      }
    }]
  };
  return CloudStorageDropdown;
};

exports.CloudStorageDropdownFactory = CloudStorageDropdownFactory;
CloudStorageDropdownFactory.deps = [PanelHeaderDropdownFactory];
PanelHeaderFactory.deps = [SaveExportDropdownFactory, CloudStorageDropdownFactory];

function PanelHeaderFactory(SaveExportDropdown, CloudStorageDropdown) {
  var _class, _temp;

  return _temp = _class = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(PanelHeader, _Component);

    var _super = _createSuper(PanelHeader);

    function PanelHeader() {
      (0, _classCallCheck2["default"])(this, PanelHeader);
      return _super.apply(this, arguments);
    }

    (0, _createClass2["default"])(PanelHeader, [{
      key: "render",
      value: function render() {
        var _this = this;

        var _this$props = this.props,
            appName = _this$props.appName,
            appWebsite = _this$props.appWebsite,
            version = _this$props.version,
            actionItems = _this$props.actionItems,
            visibleDropdown = _this$props.visibleDropdown,
            showExportDropdown = _this$props.showExportDropdown,
            hideExportDropdown = _this$props.hideExportDropdown,
            dropdownCallbacks = (0, _objectWithoutProperties2["default"])(_this$props, ["appName", "appWebsite", "version", "actionItems", "visibleDropdown", "showExportDropdown", "hideExportDropdown"]);
        var items = actionItems || []; // don't render cloud storage icon if onSaveToStorage is not provided

        if (typeof this.props.onSaveToStorage !== 'function') {
          items = actionItems.filter(function (ai) {
            return ai.id !== 'storage';
          });
        }

        return /*#__PURE__*/_react["default"].createElement(StyledPanelHeader, {
          className: "side-panel__panel-header"
        }, /*#__PURE__*/_react["default"].createElement(StyledPanelHeaderTop, {
          className: "side-panel__panel-header__top"
        }, /*#__PURE__*/_react["default"].createElement(this.props.logoComponent, {
          appName: appName,
          version: version,
          appWebsite: appWebsite
        }), /*#__PURE__*/_react["default"].createElement(StyledPanelTopActions, null, items.map(function (item) {
          return /*#__PURE__*/_react["default"].createElement("div", {
            className: "side-panel__panel-header__right",
            key: item.id,
            style: {
              position: 'relative'
            }
          }, /*#__PURE__*/_react["default"].createElement(PanelAction, {
            item: item,
            onClick: function onClick() {
              if (item.dropdownComponent) {
                showExportDropdown(item.id);
              } else {
                item.onClick && item.onClick(_this.props);
              }
            }
          }), item.dropdownComponent ? /*#__PURE__*/_react["default"].createElement(item.dropdownComponent, (0, _extends2["default"])({
            onClose: hideExportDropdown,
            show: visibleDropdown === item.id
          }, dropdownCallbacks)) : null);
        }))));
      }
    }]);
    return PanelHeader;
  }(_react.Component), (0, _defineProperty2["default"])(_class, "propTypes", {
    appName: _propTypes["default"].string,
    appWebsite: _propTypes["default"].string,
    version: _propTypes["default"].string,
    visibleDropdown: _propTypes["default"].string,
    logoComponent: _propTypes["default"].oneOfType([_propTypes["default"].element, _propTypes["default"].func]),
    actionItems: _propTypes["default"].arrayOf(_propTypes["default"].any),
    onExportImage: _propTypes["default"].func,
    onExportData: _propTypes["default"].func,
    onExportConfig: _propTypes["default"].func,
    onExportMap: _propTypes["default"].func,
    onSaveToStorage: _propTypes["default"].func,
    onSaveAsToStorage: _propTypes["default"].func,
    onSaveMap: _propTypes["default"].func,
    onShareMap: _propTypes["default"].func
  }), (0, _defineProperty2["default"])(_class, "defaultProps", {
    logoComponent: _logo["default"],
    actionItems: [{
      id: 'storage',
      iconComponent: _icons.Db,
      tooltip: 'tooltip.cloudStorage',
      onClick: function onClick() {},
      dropdownComponent: CloudStorageDropdown
    }, {
      id: 'save',
      iconComponent: _icons.Save,
      onClick: function onClick() {},
      label: 'Share',
      dropdownComponent: SaveExportDropdown
    }]
  }), _temp;
}

var _default = PanelHeaderFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvcGFuZWwtaGVhZGVyLmpzIl0sIm5hbWVzIjpbIlN0eWxlZFBhbmVsSGVhZGVyIiwic3R5bGVkIiwiZGl2IiwiYXR0cnMiLCJjbGFzc05hbWUiLCJwcm9wcyIsInRoZW1lIiwic2lkZVBhbmVsSGVhZGVyQmciLCJTdHlsZWRQYW5lbEhlYWRlclRvcCIsIlN0eWxlZFBhbmVsVG9wQWN0aW9ucyIsIlN0eWxlZFBhbmVsQWN0aW9uIiwiYWN0aXZlIiwidGV4dENvbG9ySGwiLCJzdWJ0ZXh0Q29sb3IiLCJTdHlsZWRUb29sYmFyIiwiVG9vbGJhciIsIlBhbmVsQWN0aW9uIiwiaXRlbSIsIm9uQ2xpY2siLCJpZCIsImxhYmVsIiwiYmxhbmsiLCJocmVmIiwiaWNvbkNvbXBvbmVudFByb3BzIiwidG9vbHRpcCIsIlBhbmVsSGVhZGVyRHJvcGRvd25GYWN0b3J5IiwiUGFuZWxIZWFkZXJEcm9wZG93biIsIml0ZW1zIiwic2hvdyIsIm9uQ2xvc2UiLCJtYXAiLCJrZXkiLCJpY29uIiwiZ2V0RHJvcGRvd25JdGVtc1NlbGVjdG9yIiwidCIsImZpbHRlciIsImwiLCJTYXZlRXhwb3J0RHJvcGRvd25GYWN0b3J5IiwiZHJvcGRvd25JdGVtc1NlbGVjdG9yIiwiU2F2ZUV4cG9ydERyb3Bkb3duIiwiZGVmYXVsdFByb3BzIiwiUGljdHVyZSIsIm9uRXhwb3J0SW1hZ2UiLCJEYXRhVGFibGUiLCJvbkV4cG9ydERhdGEiLCJNYXBJY29uIiwib25FeHBvcnRNYXAiLCJTYXZlMiIsIm9uU2F2ZU1hcCIsIlNoYXJlIiwib25TaGFyZU1hcCIsImRlcHMiLCJDbG91ZFN0b3JhZ2VEcm9wZG93bkZhY3RvcnkiLCJDbG91ZFN0b3JhZ2VEcm9wZG93biIsIm9uU2F2ZVRvU3RvcmFnZSIsIm9uU2F2ZUFzVG9TdG9yYWdlIiwiUGFuZWxIZWFkZXJGYWN0b3J5IiwiYXBwTmFtZSIsImFwcFdlYnNpdGUiLCJ2ZXJzaW9uIiwiYWN0aW9uSXRlbXMiLCJ2aXNpYmxlRHJvcGRvd24iLCJzaG93RXhwb3J0RHJvcGRvd24iLCJoaWRlRXhwb3J0RHJvcGRvd24iLCJkcm9wZG93bkNhbGxiYWNrcyIsImFpIiwicG9zaXRpb24iLCJkcm9wZG93bkNvbXBvbmVudCIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsInN0cmluZyIsImxvZ29Db21wb25lbnQiLCJvbmVPZlR5cGUiLCJlbGVtZW50IiwiZnVuYyIsImFycmF5T2YiLCJhbnkiLCJvbkV4cG9ydENvbmZpZyIsIktlcGxlckdsTG9nbyIsImljb25Db21wb25lbnQiLCJEYiIsIlNhdmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxpQkFBaUIsR0FBR0MsNkJBQU9DLEdBQVAsQ0FBV0MsS0FBWCxDQUFpQjtBQUN6Q0MsRUFBQUEsU0FBUyxFQUFFO0FBRDhCLENBQWpCLENBQUgsa0pBR0QsVUFBQUMsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZQyxpQkFBaEI7QUFBQSxDQUhKLENBQXZCOztBQU9BLElBQU1DLG9CQUFvQixHQUFHUCw2QkFBT0MsR0FBUCxDQUFXQyxLQUFYLENBQWlCO0FBQzVDQyxFQUFBQSxTQUFTLEVBQUU7QUFEaUMsQ0FBakIsQ0FBSCx1TEFBMUI7O0FBU0EsSUFBTUsscUJBQXFCLEdBQUdSLDZCQUFPQyxHQUFQLENBQVdDLEtBQVgsQ0FBaUI7QUFDN0NDLEVBQUFBLFNBQVMsRUFBRTtBQURrQyxDQUFqQixDQUFILDRHQUEzQjs7QUFNQSxJQUFNTSxpQkFBaUIsR0FBR1QsNkJBQU9DLEdBQVAsQ0FBV0MsS0FBWCxDQUFpQjtBQUN6Q0MsRUFBQUEsU0FBUyxFQUFFO0FBRDhCLENBQWpCLENBQUgsNGRBS1osVUFBQUMsS0FBSztBQUFBLFNBQUtBLEtBQUssQ0FBQ00s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QjVCLElBQUFBLFdBQVcsRUFBRXVCLHNCQUFVSyxJQVZOO0FBV2pCcEIsSUFBQUEsZUFBZSxFQUFFZSxzQkFBVUssSUFYVjtBQVlqQm5CLElBQUFBLGlCQUFpQixFQUFFYyxzQkFBVUssSUFaWjtBQWFqQjFCLElBQUFBLFNBQVMsRUFBRXFCLHNCQUFVSyxJQWJKO0FBY2pCeEIsSUFBQUEsVUFBVSxFQUFFbUIsc0JBQVVLO0FBZEwsR0FEckIsNERBa0J3QjtBQUNwQkgsSUFBQUEsYUFBYSxFQUFFTyxnQkFESztBQUVwQmxCLElBQUFBLFdBQVcsRUFBRSxDQUNYO0FBQ0V6QyxNQUFBQSxFQUFFLEVBQUUsU0FETjtBQUVFNEQsTUFBQUEsYUFBYSxFQUFFQyxTQUZqQjtBQUdFeEQsTUFBQUEsT0FBTyxFQUFFLHNCQUhYO0FBSUVOLE1BQUFBLE9BQU8sRUFBRSxtQkFBTSxDQUFFLENBSm5CO0FBS0VpRCxNQUFBQSxpQkFBaUIsRUFBRWQ7QUFMckIsS0FEVyxFQVFYO0FBQ0VsQyxNQUFBQSxFQUFFLEVBQUUsTUFETjtBQUVFNEQsTUFBQUEsYUFBYSxFQUFFRSxXQUZqQjtBQUdFL0QsTUFBQUEsT0FBTyxFQUFFLG1CQUFNLENBQUUsQ0FIbkI7QUFJRUUsTUFBQUEsS0FBSyxFQUFFLE9BSlQ7QUFLRStDLE1BQUFBLGlCQUFpQixFQUFFNUI7QUFMckIsS0FSVztBQUZPLEdBbEJ4QjtBQTRGRDs7ZUFFY2lCLGtCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5pbXBvcnQge1Rvb2x0aXB9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBLZXBsZXJHbExvZ28gZnJvbSAnY29tcG9uZW50cy9jb21tb24vbG9nbyc7XG5pbXBvcnQge1NhdmUsIERhdGFUYWJsZSwgU2F2ZTIsIFBpY3R1cmUsIERiLCBNYXAgYXMgTWFwSWNvbiwgU2hhcmV9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCBDbGlja091dHNpZGVDbG9zZURyb3Bkb3duIGZyb20gJ2NvbXBvbmVudHMvc2lkZS1wYW5lbC9wYW5lbC1kcm9wZG93bic7XG5pbXBvcnQgVG9vbGJhciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi90b29sYmFyJztcbmltcG9ydCBUb29sYmFySXRlbSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi90b29sYmFyLWl0ZW0nO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdsb2NhbGl6YXRpb24nO1xuXG5jb25zdCBTdHlsZWRQYW5lbEhlYWRlciA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdzaWRlLXNpZGUtcGFuZWxfX2hlYWRlcidcbn0pYFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNpZGVQYW5lbEhlYWRlckJnfTtcbiAgcGFkZGluZzogMTJweCAxNnB4IDAgMTZweDtcbmA7XG5cbmNvbnN0IFN0eWxlZFBhbmVsSGVhZGVyVG9wID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ3NpZGUtcGFuZWxfX2hlYWRlcl9fdG9wJ1xufSlgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgbWFyZ2luLWJvdHRvbTogMTZweDtcbiAgd2lkdGg6IDEwMCU7XG5gO1xuXG5jb25zdCBTdHlsZWRQYW5lbFRvcEFjdGlvbnMgPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnc2lkZS1wYW5lbF9fdG9wX19hY3Rpb25zJ1xufSlgXG4gIGRpc3BsYXk6IGZsZXg7XG5gO1xuXG5jb25zdCBTdHlsZWRQYW5lbEFjdGlvbiA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdzaWRlLXBhbmVsX19wYW5lbC1oZWFkZXJfX2FjdGlvbidcbn0pYFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBib3JkZXItcmFkaXVzOiAycHg7XG4gIGNvbG9yOiAke3Byb3BzID0+IChwcm9wcy5hY3RpdmUgPyBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbCA6IHByb3BzLnRoZW1lLnN1YnRleHRDb2xvcil9O1xuICBkaXNwbGF5OiBmbGV4O1xuICBoZWlnaHQ6IDI2cHg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgbWFyZ2luLWxlZnQ6IDRweDtcbiAgcGFkZGluZzogNXB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgcCB7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIG1hcmdpbi1yaWdodDogNnB4O1xuICB9XG4gIGEge1xuICAgIGhlaWdodDogMjBweDtcbiAgfVxuXG4gIDpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckhsfTtcblxuICAgIGEge1xuICAgICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICAgIH1cbiAgfVxuYDtcblxuY29uc3QgU3R5bGVkVG9vbGJhciA9IHN0eWxlZChUb29sYmFyKWBcbiAgcG9zaXRpb246IGFic29sdXRlO1xuYDtcblxuZXhwb3J0IGNvbnN0IFBhbmVsQWN0aW9uID0gKHtpdGVtLCBvbkNsaWNrfSkgPT4gKFxuICA8U3R5bGVkUGFuZWxBY3Rpb24gZGF0YS10aXAgZGF0YS1mb3I9e2Ake2l0ZW0uaWR9LWFjdGlvbmB9IG9uQ2xpY2s9e29uQ2xpY2t9PlxuICAgIHtpdGVtLmxhYmVsID8gPHA+e2l0ZW0ubGFiZWx9PC9wPiA6IG51bGx9XG4gICAgPGEgdGFyZ2V0PXtpdGVtLmJsYW5rID8gJ19ibGFuaycgOiAnJ30gaHJlZj17aXRlbS5ocmVmfSByZWw9XCJub3JlZmVycmVyXCI+XG4gICAgICA8aXRlbS5pY29uQ29tcG9uZW50IGhlaWdodD1cIjIwcHhcIiB7Li4uaXRlbS5pY29uQ29tcG9uZW50UHJvcHN9IC8+XG4gICAgPC9hPlxuICAgIHtpdGVtLnRvb2x0aXAgPyAoXG4gICAgICA8VG9vbHRpcCBpZD17YCR7aXRlbS5pZH0tYWN0aW9uYH0gcGxhY2U9XCJib3R0b21cIiBkZWxheVNob3c9ezUwMH0gZWZmZWN0PVwic29saWRcIj5cbiAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9e2l0ZW0udG9vbHRpcH0gLz5cbiAgICAgIDwvVG9vbHRpcD5cbiAgICApIDogbnVsbH1cbiAgPC9TdHlsZWRQYW5lbEFjdGlvbj5cbik7XG5cbmV4cG9ydCBjb25zdCBQYW5lbEhlYWRlckRyb3Bkb3duRmFjdG9yeSA9ICgpID0+IHtcbiAgY29uc3QgUGFuZWxIZWFkZXJEcm9wZG93biA9ICh7aXRlbXMsIHNob3csIG9uQ2xvc2UsIGlkfSkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICA8U3R5bGVkVG9vbGJhciBzaG93PXtzaG93fSBjbGFzc05hbWU9e2Ake2lkfS1kcm9wZG93bmB9PlxuICAgICAgICA8Q2xpY2tPdXRzaWRlQ2xvc2VEcm9wZG93blxuICAgICAgICAgIGNsYXNzTmFtZT1cInBhbmVsLWhlYWRlci1kcm9wZG93bl9faW5uZXJcIlxuICAgICAgICAgIHNob3c9e3Nob3d9XG4gICAgICAgICAgb25DbG9zZT17b25DbG9zZX1cbiAgICAgICAgPlxuICAgICAgICAgIHtpdGVtcy5tYXAoaXRlbSA9PiAoXG4gICAgICAgICAgICA8VG9vbGJhckl0ZW1cbiAgICAgICAgICAgICAgaWQ9e2l0ZW0ua2V5fVxuICAgICAgICAgICAgICBrZXk9e2l0ZW0ua2V5fVxuICAgICAgICAgICAgICBsYWJlbD17aXRlbS5sYWJlbH1cbiAgICAgICAgICAgICAgaWNvbj17aXRlbS5pY29ufVxuICAgICAgICAgICAgICBvbkNsaWNrPXtpdGVtLm9uQ2xpY2t9XG4gICAgICAgICAgICAgIG9uQ2xvc2U9e29uQ2xvc2V9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L0NsaWNrT3V0c2lkZUNsb3NlRHJvcGRvd24+XG4gICAgICA8L1N0eWxlZFRvb2xiYXI+XG4gICAgKTtcbiAgfTtcblxuICByZXR1cm4gUGFuZWxIZWFkZXJEcm9wZG93bjtcbn07XG5cbmNvbnN0IGdldERyb3Bkb3duSXRlbXNTZWxlY3RvciA9ICgpID0+XG4gIGNyZWF0ZVNlbGVjdG9yKFxuICAgIHByb3BzID0+IHByb3BzLFxuICAgIHByb3BzID0+XG4gICAgICBwcm9wcy5pdGVtc1xuICAgICAgICAubWFwKHQgPT4gKHtcbiAgICAgICAgICAuLi50LFxuICAgICAgICAgIG9uQ2xpY2s6IHQub25DbGljayAmJiB0Lm9uQ2xpY2socHJvcHMpID8gdC5vbkNsaWNrKHByb3BzKSA6IG51bGxcbiAgICAgICAgfSkpXG4gICAgICAgIC5maWx0ZXIobCA9PiBsLm9uQ2xpY2spXG4gICk7XG5cbmV4cG9ydCBjb25zdCBTYXZlRXhwb3J0RHJvcGRvd25GYWN0b3J5ID0gUGFuZWxIZWFkZXJEcm9wZG93biA9PiB7XG4gIGNvbnN0IGRyb3Bkb3duSXRlbXNTZWxlY3RvciA9IGdldERyb3Bkb3duSXRlbXNTZWxlY3RvcigpO1xuXG4gIGNvbnN0IFNhdmVFeHBvcnREcm9wZG93biA9IHByb3BzID0+IChcbiAgICA8UGFuZWxIZWFkZXJEcm9wZG93blxuICAgICAgaXRlbXM9e2Ryb3Bkb3duSXRlbXNTZWxlY3Rvcihwcm9wcyl9XG4gICAgICBzaG93PXtwcm9wcy5zaG93fVxuICAgICAgb25DbG9zZT17cHJvcHMub25DbG9zZX1cbiAgICAgIGlkPVwic2F2ZS1leHBvcnRcIlxuICAgIC8+XG4gICk7XG5cbiAgU2F2ZUV4cG9ydERyb3Bkb3duLmRlZmF1bHRQcm9wcyA9IHtcbiAgICBpdGVtczogW1xuICAgICAge1xuICAgICAgICBsYWJlbDogJ3Rvb2xiYXIuZXhwb3J0SW1hZ2UnLFxuICAgICAgICBpY29uOiBQaWN0dXJlLFxuICAgICAgICBrZXk6ICdpbWFnZScsXG4gICAgICAgIG9uQ2xpY2s6IHByb3BzID0+IHByb3BzLm9uRXhwb3J0SW1hZ2VcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAndG9vbGJhci5leHBvcnREYXRhJyxcbiAgICAgICAgaWNvbjogRGF0YVRhYmxlLFxuICAgICAgICBrZXk6ICdkYXRhJyxcbiAgICAgICAgb25DbGljazogcHJvcHMgPT4gcHJvcHMub25FeHBvcnREYXRhXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ3Rvb2xiYXIuZXhwb3J0TWFwJyxcbiAgICAgICAgaWNvbjogTWFwSWNvbixcbiAgICAgICAga2V5OiAnbWFwJyxcbiAgICAgICAgb25DbGljazogcHJvcHMgPT4gcHJvcHMub25FeHBvcnRNYXBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAndG9vbGJhci5zYXZlTWFwJyxcbiAgICAgICAgaWNvbjogU2F2ZTIsXG4gICAgICAgIGtleTogJ3NhdmUnLFxuICAgICAgICBvbkNsaWNrOiBwcm9wcyA9PiBwcm9wcy5vblNhdmVNYXBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAndG9vbGJhci5zaGFyZU1hcFVSTCcsXG4gICAgICAgIGljb246IFNoYXJlLFxuICAgICAgICBrZXk6ICdzaGFyZScsXG4gICAgICAgIG9uQ2xpY2s6IHByb3BzID0+IHByb3BzLm9uU2hhcmVNYXBcbiAgICAgIH1cbiAgICBdXG4gIH07XG5cbiAgcmV0dXJuIFNhdmVFeHBvcnREcm9wZG93bjtcbn07XG5TYXZlRXhwb3J0RHJvcGRvd25GYWN0b3J5LmRlcHMgPSBbUGFuZWxIZWFkZXJEcm9wZG93bkZhY3RvcnldO1xuXG5leHBvcnQgY29uc3QgQ2xvdWRTdG9yYWdlRHJvcGRvd25GYWN0b3J5ID0gUGFuZWxIZWFkZXJEcm9wZG93biA9PiB7XG4gIGNvbnN0IGRyb3Bkb3duSXRlbXNTZWxlY3RvciA9IGdldERyb3Bkb3duSXRlbXNTZWxlY3RvcigpO1xuXG4gIGNvbnN0IENsb3VkU3RvcmFnZURyb3Bkb3duID0gcHJvcHMgPT4gKFxuICAgIDxQYW5lbEhlYWRlckRyb3Bkb3duXG4gICAgICBpdGVtcz17ZHJvcGRvd25JdGVtc1NlbGVjdG9yKHByb3BzKX1cbiAgICAgIHNob3c9e3Byb3BzLnNob3d9XG4gICAgICBvbkNsb3NlPXtwcm9wcy5vbkNsb3NlfVxuICAgICAgaWQ9XCJjbG91ZC1zdG9yYWdlXCJcbiAgICAvPlxuICApO1xuICBDbG91ZFN0b3JhZ2VEcm9wZG93bi5kZWZhdWx0UHJvcHMgPSB7XG4gICAgaXRlbXM6IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdTYXZlJyxcbiAgICAgICAgaWNvbjogU2F2ZTIsXG4gICAgICAgIGtleTogJ3NhdmUnLFxuICAgICAgICBvbkNsaWNrOiBwcm9wcyA9PiBwcm9wcy5vblNhdmVUb1N0b3JhZ2VcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnU2F2ZSBBcycsXG4gICAgICAgIGljb246IFNhdmUyLFxuICAgICAgICBrZXk6ICdzYXZlQXMnLFxuICAgICAgICBvbkNsaWNrOiBwcm9wcyA9PiBwcm9wcy5vblNhdmVBc1RvU3RvcmFnZVxuICAgICAgfVxuICAgIF1cbiAgfTtcbiAgcmV0dXJuIENsb3VkU3RvcmFnZURyb3Bkb3duO1xufTtcbkNsb3VkU3RvcmFnZURyb3Bkb3duRmFjdG9yeS5kZXBzID0gW1BhbmVsSGVhZGVyRHJvcGRvd25GYWN0b3J5XTtcblxuUGFuZWxIZWFkZXJGYWN0b3J5LmRlcHMgPSBbU2F2ZUV4cG9ydERyb3Bkb3duRmFjdG9yeSwgQ2xvdWRTdG9yYWdlRHJvcGRvd25GYWN0b3J5XTtcblxuZnVuY3Rpb24gUGFuZWxIZWFkZXJGYWN0b3J5KFNhdmVFeHBvcnREcm9wZG93biwgQ2xvdWRTdG9yYWdlRHJvcGRvd24pIHtcbiAgcmV0dXJuIGNsYXNzIFBhbmVsSGVhZGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgICAgYXBwTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIGFwcFdlYnNpdGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICB2ZXJzaW9uOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgdmlzaWJsZURyb3Bkb3duOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgbG9nb0NvbXBvbmVudDogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLmVsZW1lbnQsIFByb3BUeXBlcy5mdW5jXSksXG4gICAgICBhY3Rpb25JdGVtczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmFueSksXG4gICAgICBvbkV4cG9ydEltYWdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgIG9uRXhwb3J0RGF0YTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICBvbkV4cG9ydENvbmZpZzogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICBvbkV4cG9ydE1hcDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICBvblNhdmVUb1N0b3JhZ2U6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgb25TYXZlQXNUb1N0b3JhZ2U6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgb25TYXZlTWFwOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgIG9uU2hhcmVNYXA6IFByb3BUeXBlcy5mdW5jXG4gICAgfTtcblxuICAgIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICBsb2dvQ29tcG9uZW50OiBLZXBsZXJHbExvZ28sXG4gICAgICBhY3Rpb25JdGVtczogW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdzdG9yYWdlJyxcbiAgICAgICAgICBpY29uQ29tcG9uZW50OiBEYixcbiAgICAgICAgICB0b29sdGlwOiAndG9vbHRpcC5jbG91ZFN0b3JhZ2UnLFxuICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHt9LFxuICAgICAgICAgIGRyb3Bkb3duQ29tcG9uZW50OiBDbG91ZFN0b3JhZ2VEcm9wZG93blxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdzYXZlJyxcbiAgICAgICAgICBpY29uQ29tcG9uZW50OiBTYXZlLFxuICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHt9LFxuICAgICAgICAgIGxhYmVsOiAnU2hhcmUnLFxuICAgICAgICAgIGRyb3Bkb3duQ29tcG9uZW50OiBTYXZlRXhwb3J0RHJvcGRvd25cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH07XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGFwcE5hbWUsXG4gICAgICAgIGFwcFdlYnNpdGUsXG4gICAgICAgIHZlcnNpb24sXG4gICAgICAgIGFjdGlvbkl0ZW1zLFxuICAgICAgICB2aXNpYmxlRHJvcGRvd24sXG4gICAgICAgIHNob3dFeHBvcnREcm9wZG93bixcbiAgICAgICAgaGlkZUV4cG9ydERyb3Bkb3duLFxuICAgICAgICAuLi5kcm9wZG93bkNhbGxiYWNrc1xuICAgICAgfSA9IHRoaXMucHJvcHM7XG4gICAgICBsZXQgaXRlbXMgPSBhY3Rpb25JdGVtcyB8fCBbXTtcblxuICAgICAgLy8gZG9uJ3QgcmVuZGVyIGNsb3VkIHN0b3JhZ2UgaWNvbiBpZiBvblNhdmVUb1N0b3JhZ2UgaXMgbm90IHByb3ZpZGVkXG4gICAgICBpZiAodHlwZW9mIHRoaXMucHJvcHMub25TYXZlVG9TdG9yYWdlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGl0ZW1zID0gYWN0aW9uSXRlbXMuZmlsdGVyKGFpID0+IGFpLmlkICE9PSAnc3RvcmFnZScpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3R5bGVkUGFuZWxIZWFkZXIgY2xhc3NOYW1lPVwic2lkZS1wYW5lbF9fcGFuZWwtaGVhZGVyXCI+XG4gICAgICAgICAgPFN0eWxlZFBhbmVsSGVhZGVyVG9wIGNsYXNzTmFtZT1cInNpZGUtcGFuZWxfX3BhbmVsLWhlYWRlcl9fdG9wXCI+XG4gICAgICAgICAgICA8dGhpcy5wcm9wcy5sb2dvQ29tcG9uZW50IGFwcE5hbWU9e2FwcE5hbWV9IHZlcnNpb249e3ZlcnNpb259IGFwcFdlYnNpdGU9e2FwcFdlYnNpdGV9IC8+XG4gICAgICAgICAgICA8U3R5bGVkUGFuZWxUb3BBY3Rpb25zPlxuICAgICAgICAgICAgICB7aXRlbXMubWFwKGl0ZW0gPT4gKFxuICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInNpZGUtcGFuZWxfX3BhbmVsLWhlYWRlcl9fcmlnaHRcIlxuICAgICAgICAgICAgICAgICAga2V5PXtpdGVtLmlkfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3twb3NpdGlvbjogJ3JlbGF0aXZlJ319XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPFBhbmVsQWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIGl0ZW09e2l0ZW19XG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5kcm9wZG93bkNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0V4cG9ydERyb3Bkb3duKGl0ZW0uaWQpO1xuICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLm9uQ2xpY2sgJiYgaXRlbS5vbkNsaWNrKHRoaXMucHJvcHMpO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICB7aXRlbS5kcm9wZG93bkNvbXBvbmVudCA/IChcbiAgICAgICAgICAgICAgICAgICAgPGl0ZW0uZHJvcGRvd25Db21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAgICBvbkNsb3NlPXtoaWRlRXhwb3J0RHJvcGRvd259XG4gICAgICAgICAgICAgICAgICAgICAgc2hvdz17dmlzaWJsZURyb3Bkb3duID09PSBpdGVtLmlkfVxuICAgICAgICAgICAgICAgICAgICAgIHsuLi5kcm9wZG93bkNhbGxiYWNrc31cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvU3R5bGVkUGFuZWxUb3BBY3Rpb25zPlxuICAgICAgICAgIDwvU3R5bGVkUGFuZWxIZWFkZXJUb3A+XG4gICAgICAgIDwvU3R5bGVkUGFuZWxIZWFkZXI+XG4gICAgICApO1xuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgUGFuZWxIZWFkZXJGYWN0b3J5O1xuIl19