"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.CloudStorageDropdownFactory = exports.SaveExportDropdownFactory = exports.PanelHeaderDropdownFactory = exports.PanelAction = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

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

var _reactIntl = require("react-intl");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _templateObject5() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  position: absolute;\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  align-items: center;\n  border-radius: 2px;\n  color: ", ";\n  display: flex;\n  height: 26px;\n  justify-content: space-between;\n  margin-left: 4px;\n  padding: 5px;\n  font-weight: bold;\n  p {\n    display: inline-block;\n    margin-right: 6px;\n  }\n  a {\n    height: 20px;\n  }\n\n  :hover {\n    cursor: pointer;\n    color: ", ";\n\n    a {\n      color: ", ";\n    }\n  }\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 16px;\n  width: 100%;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  background-color: ", ";\n  padding: 12px 16px 0 16px;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledPanelHeader = _styledComponents["default"].div.attrs({
  className: 'side-side-panel__header'
})(_templateObject(), function (props) {
  return props.theme.sidePanelHeaderBg;
});

var StyledPanelHeaderTop = _styledComponents["default"].div.attrs({
  className: 'side-panel__header__top'
})(_templateObject2());

var StyledPanelTopActions = _styledComponents["default"].div.attrs({
  className: 'side-panel__top__actions'
})(_templateObject3());

var StyledPanelAction = _styledComponents["default"].div.attrs({
  className: 'side-panel__panel-header__action'
})(_templateObject4(), function (props) {
  return props.active ? props.theme.textColorHl : props.theme.subtextColor;
}, function (props) {
  return props.theme.textColorHl;
}, function (props) {
  return props.theme.textColorHl;
});

var StyledToolbar = (0, _styledComponents["default"])(_toolbar["default"])(_templateObject5());

var PanelAction = function PanelAction(_ref) {
  var item = _ref.item,
      onClick = _ref.onClick;
  return _react["default"].createElement(StyledPanelAction, {
    "data-tip": true,
    "data-for": "".concat(item.id, "-action"),
    onClick: onClick
  }, item.label ? _react["default"].createElement("p", null, item.label) : null, _react["default"].createElement("a", {
    target: item.blank ? '_blank' : '',
    href: item.href
  }, _react["default"].createElement(item.iconComponent, {
    height: "20px"
  })), item.tooltip ? _react["default"].createElement(_styledComponents2.Tooltip, {
    id: "".concat(item.id, "-action"),
    place: "bottom",
    delayShow: 500,
    effect: "solid"
  }, _react["default"].createElement(_reactIntl.FormattedMessage, {
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
    return _react["default"].createElement(StyledToolbar, {
      show: show,
      className: "".concat(id, "-dropdown")
    }, _react["default"].createElement(_panelDropdown["default"], {
      className: "panel-header-dropdown__inner",
      show: show,
      onClose: onClose
    }, items.map(function (item) {
      return _react["default"].createElement(_toolbarItem["default"], {
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
      return _objectSpread({}, t, {
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
    return _react["default"].createElement(PanelHeaderDropdown, {
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
    return _react["default"].createElement(PanelHeaderDropdown, {
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

  return _temp = _class =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(PanelHeader, _Component);

    function PanelHeader() {
      (0, _classCallCheck2["default"])(this, PanelHeader);
      return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(PanelHeader).apply(this, arguments));
    }

    (0, _createClass2["default"])(PanelHeader, [{
      key: "render",
      value: function render() {
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

        return _react["default"].createElement(StyledPanelHeader, {
          className: "side-panel__panel-header"
        }, _react["default"].createElement(StyledPanelHeaderTop, {
          className: "side-panel__panel-header__top"
        }, _react["default"].createElement(this.props.logoComponent, {
          appName: appName,
          version: version,
          appWebsite: appWebsite
        }), _react["default"].createElement(StyledPanelTopActions, null, items.map(function (item) {
          return _react["default"].createElement("div", {
            className: "side-panel__panel-header__right",
            key: item.id,
            style: {
              position: 'relative'
            }
          }, _react["default"].createElement(PanelAction, {
            item: item,
            onClick: function onClick() {
              if (item.dropdownComponent) {
                showExportDropdown(item.id);
              }

              item.onClick();
            }
          }), item.dropdownComponent ? _react["default"].createElement(item.dropdownComponent, (0, _extends2["default"])({
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvcGFuZWwtaGVhZGVyLmpzIl0sIm5hbWVzIjpbIlN0eWxlZFBhbmVsSGVhZGVyIiwic3R5bGVkIiwiZGl2IiwiYXR0cnMiLCJjbGFzc05hbWUiLCJwcm9wcyIsInRoZW1lIiwic2lkZVBhbmVsSGVhZGVyQmciLCJTdHlsZWRQYW5lbEhlYWRlclRvcCIsIlN0eWxlZFBhbmVsVG9wQWN0aW9ucyIsIlN0eWxlZFBhbmVsQWN0aW9uIiwiYWN0aXZlIiwidGV4dENvbG9ySGwiLCJzdWJ0ZXh0Q29sb3IiLCJTdHlsZWRUb29sYmFyIiwiVG9vbGJhciIsIlBhbmVsQWN0aW9uIiwiaXRlbSIsIm9uQ2xpY2siLCJpZCIsImxhYmVsIiwiYmxhbmsiLCJocmVmIiwidG9vbHRpcCIsIlBhbmVsSGVhZGVyRHJvcGRvd25GYWN0b3J5IiwiUGFuZWxIZWFkZXJEcm9wZG93biIsIml0ZW1zIiwic2hvdyIsIm9uQ2xvc2UiLCJtYXAiLCJrZXkiLCJpY29uIiwiZ2V0RHJvcGRvd25JdGVtc1NlbGVjdG9yIiwidCIsImZpbHRlciIsImwiLCJTYXZlRXhwb3J0RHJvcGRvd25GYWN0b3J5IiwiZHJvcGRvd25JdGVtc1NlbGVjdG9yIiwiU2F2ZUV4cG9ydERyb3Bkb3duIiwiZGVmYXVsdFByb3BzIiwiUGljdHVyZSIsIm9uRXhwb3J0SW1hZ2UiLCJEYXRhVGFibGUiLCJvbkV4cG9ydERhdGEiLCJNYXBJY29uIiwib25FeHBvcnRNYXAiLCJTYXZlMiIsIm9uU2F2ZU1hcCIsIlNoYXJlIiwib25TaGFyZU1hcCIsImRlcHMiLCJDbG91ZFN0b3JhZ2VEcm9wZG93bkZhY3RvcnkiLCJDbG91ZFN0b3JhZ2VEcm9wZG93biIsIm9uU2F2ZVRvU3RvcmFnZSIsIm9uU2F2ZUFzVG9TdG9yYWdlIiwiUGFuZWxIZWFkZXJGYWN0b3J5IiwiYXBwTmFtZSIsImFwcFdlYnNpdGUiLCJ2ZXJzaW9uIiwiYWN0aW9uSXRlbXMiLCJ2aXNpYmxlRHJvcGRvd24iLCJzaG93RXhwb3J0RHJvcGRvd24iLCJoaWRlRXhwb3J0RHJvcGRvd24iLCJkcm9wZG93bkNhbGxiYWNrcyIsImFpIiwicG9zaXRpb24iLCJkcm9wZG93bkNvbXBvbmVudCIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsInN0cmluZyIsImxvZ29Db21wb25lbnQiLCJvbmVPZlR5cGUiLCJlbGVtZW50IiwiZnVuYyIsImFycmF5T2YiLCJhbnkiLCJvbkV4cG9ydENvbmZpZyIsIktlcGxlckdsTG9nbyIsImljb25Db21wb25lbnQiLCJEYiIsIlNhdmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLGlCQUFpQixHQUFHQyw2QkFBT0MsR0FBUCxDQUFXQyxLQUFYLENBQWlCO0FBQ3pDQyxFQUFBQSxTQUFTLEVBQUU7QUFEOEIsQ0FBakIsQ0FBSCxvQkFHRCxVQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLGlCQUFoQjtBQUFBLENBSEosQ0FBdkI7O0FBT0EsSUFBTUMsb0JBQW9CLEdBQUdQLDZCQUFPQyxHQUFQLENBQVdDLEtBQVgsQ0FBaUI7QUFDNUNDLEVBQUFBLFNBQVMsRUFBRTtBQURpQyxDQUFqQixDQUFILG9CQUExQjs7QUFTQSxJQUFNSyxxQkFBcUIsR0FBR1IsNkJBQU9DLEdBQVAsQ0FBV0MsS0FBWCxDQUFpQjtBQUM3Q0MsRUFBQUEsU0FBUyxFQUFFO0FBRGtDLENBQWpCLENBQUgsb0JBQTNCOztBQU1BLElBQU1NLGlCQUFpQixHQUFHVCw2QkFBT0MsR0FBUCxDQUFXQyxLQUFYLENBQWlCO0FBQ3pDQyxFQUFBQSxTQUFTLEVBQUU7QUFEOEIsQ0FBakIsQ0FBSCxxQkFLWixVQUFBQyxLQUFLO0FBQUEsU0FBS0EsS0FBSyxDQUFDTSxNQUFOLEdBQWVOLEtBQUssQ0FBQ0MsS0FBTixDQUFZTSxXQUEzQixHQUF5Q1AsS0FBSyxDQUFDQyxLQUFOLENBQVlPLFlBQTFEO0FBQUEsQ0FMTyxFQXNCVixVQUFBUixLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlNLFdBQWhCO0FBQUEsQ0F0QkssRUF5QlIsVUFBQVAsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZTSxXQUFoQjtBQUFBLENBekJHLENBQXZCOztBQThCQSxJQUFNRSxhQUFhLEdBQUcsa0NBQU9DLG1CQUFQLENBQUgsb0JBQW5COztBQUlPLElBQU1DLFdBQVcsR0FBRyxTQUFkQSxXQUFjO0FBQUEsTUFBRUMsSUFBRixRQUFFQSxJQUFGO0FBQUEsTUFBUUMsT0FBUixRQUFRQSxPQUFSO0FBQUEsU0FDekIsZ0NBQUMsaUJBQUQ7QUFBbUIsb0JBQW5CO0FBQTRCLDBCQUFhRCxJQUFJLENBQUNFLEVBQWxCLFlBQTVCO0FBQTJELElBQUEsT0FBTyxFQUFFRDtBQUFwRSxLQUNHRCxJQUFJLENBQUNHLEtBQUwsR0FBYSwyQ0FBSUgsSUFBSSxDQUFDRyxLQUFULENBQWIsR0FBbUMsSUFEdEMsRUFFRTtBQUFHLElBQUEsTUFBTSxFQUFFSCxJQUFJLENBQUNJLEtBQUwsR0FBYSxRQUFiLEdBQXdCLEVBQW5DO0FBQXVDLElBQUEsSUFBSSxFQUFFSixJQUFJLENBQUNLO0FBQWxELEtBQ0UsZ0NBQUMsSUFBRCxDQUFNLGFBQU47QUFBb0IsSUFBQSxNQUFNLEVBQUM7QUFBM0IsSUFERixDQUZGLEVBS0dMLElBQUksQ0FBQ00sT0FBTCxHQUNDLGdDQUFDLDBCQUFEO0FBQVMsSUFBQSxFQUFFLFlBQUtOLElBQUksQ0FBQ0UsRUFBVixZQUFYO0FBQWtDLElBQUEsS0FBSyxFQUFDLFFBQXhDO0FBQWlELElBQUEsU0FBUyxFQUFFLEdBQTVEO0FBQWlFLElBQUEsTUFBTSxFQUFDO0FBQXhFLEtBQ0UsZ0NBQUMsMkJBQUQ7QUFBa0IsSUFBQSxFQUFFLEVBQUVGLElBQUksQ0FBQ007QUFBM0IsSUFERixDQURELEdBSUcsSUFUTixDQUR5QjtBQUFBLENBQXBCOzs7O0FBY0EsSUFBTUMsMEJBQTBCLEdBQUcsU0FBN0JBLDBCQUE2QixHQUFNO0FBQzlDLE1BQU1DLG1CQUFtQixHQUFHLFNBQXRCQSxtQkFBc0IsUUFBZ0M7QUFBQSxRQUE5QkMsS0FBOEIsU0FBOUJBLEtBQThCO0FBQUEsUUFBdkJDLElBQXVCLFNBQXZCQSxJQUF1QjtBQUFBLFFBQWpCQyxPQUFpQixTQUFqQkEsT0FBaUI7QUFBQSxRQUFSVCxFQUFRLFNBQVJBLEVBQVE7QUFDMUQsV0FDRSxnQ0FBQyxhQUFEO0FBQWUsTUFBQSxJQUFJLEVBQUVRLElBQXJCO0FBQTJCLE1BQUEsU0FBUyxZQUFLUixFQUFMO0FBQXBDLE9BQ0UsZ0NBQUMseUJBQUQ7QUFDRSxNQUFBLFNBQVMsRUFBQyw4QkFEWjtBQUVFLE1BQUEsSUFBSSxFQUFFUSxJQUZSO0FBR0UsTUFBQSxPQUFPLEVBQUVDO0FBSFgsT0FLR0YsS0FBSyxDQUFDRyxHQUFOLENBQVUsVUFBQVosSUFBSTtBQUFBLGFBQ2IsZ0NBQUMsdUJBQUQ7QUFDRSxRQUFBLEVBQUUsRUFBRUEsSUFBSSxDQUFDYSxHQURYO0FBRUUsUUFBQSxHQUFHLEVBQUViLElBQUksQ0FBQ2EsR0FGWjtBQUdFLFFBQUEsS0FBSyxFQUFFYixJQUFJLENBQUNHLEtBSGQ7QUFJRSxRQUFBLElBQUksRUFBRUgsSUFBSSxDQUFDYyxJQUpiO0FBS0UsUUFBQSxPQUFPLEVBQUVkLElBQUksQ0FBQ0MsT0FMaEI7QUFNRSxRQUFBLE9BQU8sRUFBRVU7QUFOWCxRQURhO0FBQUEsS0FBZCxDQUxILENBREYsQ0FERjtBQW9CRCxHQXJCRDs7QUF1QkEsU0FBT0gsbUJBQVA7QUFDRCxDQXpCTTs7OztBQTJCUCxJQUFNTyx3QkFBd0IsR0FBRyxTQUEzQkEsd0JBQTJCO0FBQUEsU0FDL0IsOEJBQ0UsVUFBQTNCLEtBQUs7QUFBQSxXQUFJQSxLQUFKO0FBQUEsR0FEUCxFQUVFLFVBQUFBLEtBQUs7QUFBQSxXQUNIQSxLQUFLLENBQUNxQixLQUFOLENBQ0dHLEdBREgsQ0FDTyxVQUFBSSxDQUFDO0FBQUEsK0JBQ0RBLENBREM7QUFFSmYsUUFBQUEsT0FBTyxFQUFFZSxDQUFDLENBQUNmLE9BQUYsSUFBYWUsQ0FBQyxDQUFDZixPQUFGLENBQVViLEtBQVYsQ0FBYixHQUFnQzRCLENBQUMsQ0FBQ2YsT0FBRixDQUFVYixLQUFWLENBQWhDLEdBQW1EO0FBRnhEO0FBQUEsS0FEUixFQUtHNkIsTUFMSCxDQUtVLFVBQUFDLENBQUM7QUFBQSxhQUFJQSxDQUFDLENBQUNqQixPQUFOO0FBQUEsS0FMWCxDQURHO0FBQUEsR0FGUCxDQUQrQjtBQUFBLENBQWpDOztBQVlPLElBQU1rQix5QkFBeUIsR0FBRyxTQUE1QkEseUJBQTRCLENBQUFYLG1CQUFtQixFQUFJO0FBQzlELE1BQU1ZLHFCQUFxQixHQUFHTCx3QkFBd0IsRUFBdEQ7O0FBRUEsTUFBTU0sa0JBQWtCLEdBQUcsU0FBckJBLGtCQUFxQixDQUFBakMsS0FBSztBQUFBLFdBQzlCLGdDQUFDLG1CQUFEO0FBQ0UsTUFBQSxLQUFLLEVBQUVnQyxxQkFBcUIsQ0FBQ2hDLEtBQUQsQ0FEOUI7QUFFRSxNQUFBLElBQUksRUFBRUEsS0FBSyxDQUFDc0IsSUFGZDtBQUdFLE1BQUEsT0FBTyxFQUFFdEIsS0FBSyxDQUFDdUIsT0FIakI7QUFJRSxNQUFBLEVBQUUsRUFBQztBQUpMLE1BRDhCO0FBQUEsR0FBaEM7O0FBU0FVLEVBQUFBLGtCQUFrQixDQUFDQyxZQUFuQixHQUFrQztBQUNoQ2IsSUFBQUEsS0FBSyxFQUFFLENBQ0w7QUFDRU4sTUFBQUEsS0FBSyxFQUFFLHFCQURUO0FBRUVXLE1BQUFBLElBQUksRUFBRVMsY0FGUjtBQUdFVixNQUFBQSxHQUFHLEVBQUUsT0FIUDtBQUlFWixNQUFBQSxPQUFPLEVBQUUsaUJBQUFiLEtBQUs7QUFBQSxlQUFJQSxLQUFLLENBQUNvQyxhQUFWO0FBQUE7QUFKaEIsS0FESyxFQU9MO0FBQ0VyQixNQUFBQSxLQUFLLEVBQUUsb0JBRFQ7QUFFRVcsTUFBQUEsSUFBSSxFQUFFVyxnQkFGUjtBQUdFWixNQUFBQSxHQUFHLEVBQUUsTUFIUDtBQUlFWixNQUFBQSxPQUFPLEVBQUUsaUJBQUFiLEtBQUs7QUFBQSxlQUFJQSxLQUFLLENBQUNzQyxZQUFWO0FBQUE7QUFKaEIsS0FQSyxFQWFMO0FBQ0V2QixNQUFBQSxLQUFLLEVBQUUsbUJBRFQ7QUFFRVcsTUFBQUEsSUFBSSxFQUFFYSxVQUZSO0FBR0VkLE1BQUFBLEdBQUcsRUFBRSxLQUhQO0FBSUVaLE1BQUFBLE9BQU8sRUFBRSxpQkFBQWIsS0FBSztBQUFBLGVBQUlBLEtBQUssQ0FBQ3dDLFdBQVY7QUFBQTtBQUpoQixLQWJLLEVBbUJMO0FBQ0V6QixNQUFBQSxLQUFLLEVBQUUsaUJBRFQ7QUFFRVcsTUFBQUEsSUFBSSxFQUFFZSxZQUZSO0FBR0VoQixNQUFBQSxHQUFHLEVBQUUsTUFIUDtBQUlFWixNQUFBQSxPQUFPLEVBQUUsaUJBQUFiLEtBQUs7QUFBQSxlQUFJQSxLQUFLLENBQUMwQyxTQUFWO0FBQUE7QUFKaEIsS0FuQkssRUF5Qkw7QUFDRTNCLE1BQUFBLEtBQUssRUFBRSxxQkFEVDtBQUVFVyxNQUFBQSxJQUFJLEVBQUVpQixZQUZSO0FBR0VsQixNQUFBQSxHQUFHLEVBQUUsT0FIUDtBQUlFWixNQUFBQSxPQUFPLEVBQUUsaUJBQUFiLEtBQUs7QUFBQSxlQUFJQSxLQUFLLENBQUM0QyxVQUFWO0FBQUE7QUFKaEIsS0F6Qks7QUFEeUIsR0FBbEM7QUFtQ0EsU0FBT1gsa0JBQVA7QUFDRCxDQWhETTs7O0FBaURQRix5QkFBeUIsQ0FBQ2MsSUFBMUIsR0FBaUMsQ0FBQzFCLDBCQUFELENBQWpDOztBQUVPLElBQU0yQiwyQkFBMkIsR0FBRyxTQUE5QkEsMkJBQThCLENBQUExQixtQkFBbUIsRUFBSTtBQUNoRSxNQUFNWSxxQkFBcUIsR0FBR0wsd0JBQXdCLEVBQXREOztBQUVBLE1BQU1vQixvQkFBb0IsR0FBRyxTQUF2QkEsb0JBQXVCLENBQUEvQyxLQUFLO0FBQUEsV0FDaEMsZ0NBQUMsbUJBQUQ7QUFDRSxNQUFBLEtBQUssRUFBRWdDLHFCQUFxQixDQUFDaEMsS0FBRCxDQUQ5QjtBQUVFLE1BQUEsSUFBSSxFQUFFQSxLQUFLLENBQUNzQixJQUZkO0FBR0UsTUFBQSxPQUFPLEVBQUV0QixLQUFLLENBQUN1QixPQUhqQjtBQUlFLE1BQUEsRUFBRSxFQUFDO0FBSkwsTUFEZ0M7QUFBQSxHQUFsQzs7QUFRQXdCLEVBQUFBLG9CQUFvQixDQUFDYixZQUFyQixHQUFvQztBQUNsQ2IsSUFBQUEsS0FBSyxFQUFFLENBQ0w7QUFDRU4sTUFBQUEsS0FBSyxFQUFFLE1BRFQ7QUFFRVcsTUFBQUEsSUFBSSxFQUFFZSxZQUZSO0FBR0VoQixNQUFBQSxHQUFHLEVBQUUsTUFIUDtBQUlFWixNQUFBQSxPQUFPLEVBQUUsaUJBQUFiLEtBQUs7QUFBQSxlQUFJQSxLQUFLLENBQUNnRCxlQUFWO0FBQUE7QUFKaEIsS0FESyxFQU9MO0FBQ0VqQyxNQUFBQSxLQUFLLEVBQUUsU0FEVDtBQUVFVyxNQUFBQSxJQUFJLEVBQUVlLFlBRlI7QUFHRWhCLE1BQUFBLEdBQUcsRUFBRSxRQUhQO0FBSUVaLE1BQUFBLE9BQU8sRUFBRSxpQkFBQWIsS0FBSztBQUFBLGVBQUlBLEtBQUssQ0FBQ2lELGlCQUFWO0FBQUE7QUFKaEIsS0FQSztBQUQyQixHQUFwQztBQWdCQSxTQUFPRixvQkFBUDtBQUNELENBNUJNOzs7QUE2QlBELDJCQUEyQixDQUFDRCxJQUE1QixHQUFtQyxDQUFDMUIsMEJBQUQsQ0FBbkM7QUFFQStCLGtCQUFrQixDQUFDTCxJQUFuQixHQUEwQixDQUFDZCx5QkFBRCxFQUE0QmUsMkJBQTVCLENBQTFCOztBQUVBLFNBQVNJLGtCQUFULENBQTRCakIsa0JBQTVCLEVBQWdEYyxvQkFBaEQsRUFBc0U7QUFBQTs7QUFDcEU7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLCtCQXNDVztBQUFBLDBCQVVILEtBQUsvQyxLQVZGO0FBQUEsWUFFTG1ELE9BRkssZUFFTEEsT0FGSztBQUFBLFlBR0xDLFVBSEssZUFHTEEsVUFISztBQUFBLFlBSUxDLE9BSkssZUFJTEEsT0FKSztBQUFBLFlBS0xDLFdBTEssZUFLTEEsV0FMSztBQUFBLFlBTUxDLGVBTkssZUFNTEEsZUFOSztBQUFBLFlBT0xDLGtCQVBLLGVBT0xBLGtCQVBLO0FBQUEsWUFRTEMsa0JBUkssZUFRTEEsa0JBUks7QUFBQSxZQVNGQyxpQkFURTtBQVdQLFlBQUlyQyxLQUFLLEdBQUdpQyxXQUFXLElBQUksRUFBM0IsQ0FYTyxDQWFQOztBQUNBLFlBQUksT0FBTyxLQUFLdEQsS0FBTCxDQUFXZ0QsZUFBbEIsS0FBc0MsVUFBMUMsRUFBc0Q7QUFDcEQzQixVQUFBQSxLQUFLLEdBQUdpQyxXQUFXLENBQUN6QixNQUFaLENBQW1CLFVBQUE4QixFQUFFO0FBQUEsbUJBQUlBLEVBQUUsQ0FBQzdDLEVBQUgsS0FBVSxTQUFkO0FBQUEsV0FBckIsQ0FBUjtBQUNEOztBQUVELGVBQ0UsZ0NBQUMsaUJBQUQ7QUFBbUIsVUFBQSxTQUFTLEVBQUM7QUFBN0IsV0FDRSxnQ0FBQyxvQkFBRDtBQUFzQixVQUFBLFNBQVMsRUFBQztBQUFoQyxXQUNFLHFDQUFNLEtBQU4sQ0FBWSxhQUFaO0FBQTBCLFVBQUEsT0FBTyxFQUFFcUMsT0FBbkM7QUFBNEMsVUFBQSxPQUFPLEVBQUVFLE9BQXJEO0FBQThELFVBQUEsVUFBVSxFQUFFRDtBQUExRSxVQURGLEVBRUUsZ0NBQUMscUJBQUQsUUFDRy9CLEtBQUssQ0FBQ0csR0FBTixDQUFVLFVBQUFaLElBQUk7QUFBQSxpQkFDYjtBQUNFLFlBQUEsU0FBUyxFQUFDLGlDQURaO0FBRUUsWUFBQSxHQUFHLEVBQUVBLElBQUksQ0FBQ0UsRUFGWjtBQUdFLFlBQUEsS0FBSyxFQUFFO0FBQUM4QyxjQUFBQSxRQUFRLEVBQUU7QUFBWDtBQUhULGFBS0UsZ0NBQUMsV0FBRDtBQUNFLFlBQUEsSUFBSSxFQUFFaEQsSUFEUjtBQUVFLFlBQUEsT0FBTyxFQUFFLG1CQUFNO0FBQ2Isa0JBQUlBLElBQUksQ0FBQ2lELGlCQUFULEVBQTRCO0FBQzFCTCxnQkFBQUEsa0JBQWtCLENBQUM1QyxJQUFJLENBQUNFLEVBQU4sQ0FBbEI7QUFDRDs7QUFDREYsY0FBQUEsSUFBSSxDQUFDQyxPQUFMO0FBQ0Q7QUFQSCxZQUxGLEVBY0dELElBQUksQ0FBQ2lELGlCQUFMLEdBQ0MsZ0NBQUMsSUFBRCxDQUFNLGlCQUFOO0FBQ0UsWUFBQSxPQUFPLEVBQUVKLGtCQURYO0FBRUUsWUFBQSxJQUFJLEVBQUVGLGVBQWUsS0FBSzNDLElBQUksQ0FBQ0U7QUFGakMsYUFHTTRDLGlCQUhOLEVBREQsR0FNRyxJQXBCTixDQURhO0FBQUEsU0FBZCxDQURILENBRkYsQ0FERixDQURGO0FBaUNEO0FBekZIO0FBQUE7QUFBQSxJQUFpQ0ksZ0JBQWpDLHlEQUNxQjtBQUNqQlgsSUFBQUEsT0FBTyxFQUFFWSxzQkFBVUMsTUFERjtBQUVqQlosSUFBQUEsVUFBVSxFQUFFVyxzQkFBVUMsTUFGTDtBQUdqQlgsSUFBQUEsT0FBTyxFQUFFVSxzQkFBVUMsTUFIRjtBQUlqQlQsSUFBQUEsZUFBZSxFQUFFUSxzQkFBVUMsTUFKVjtBQUtqQkMsSUFBQUEsYUFBYSxFQUFFRixzQkFBVUcsU0FBVixDQUFvQixDQUFDSCxzQkFBVUksT0FBWCxFQUFvQkosc0JBQVVLLElBQTlCLENBQXBCLENBTEU7QUFNakJkLElBQUFBLFdBQVcsRUFBRVMsc0JBQVVNLE9BQVYsQ0FBa0JOLHNCQUFVTyxHQUE1QixDQU5JO0FBT2pCbEMsSUFBQUEsYUFBYSxFQUFFMkIsc0JBQVVLLElBUFI7QUFRakI5QixJQUFBQSxZQUFZLEVBQUV5QixzQkFBVUssSUFSUDtBQVNqQkcsSUFBQUEsY0FBYyxFQUFFUixzQkFBVUssSUFUVDtBQVVqQjVCLElBQUFBLFdBQVcsRUFBRXVCLHNCQUFVSyxJQVZOO0FBV2pCcEIsSUFBQUEsZUFBZSxFQUFFZSxzQkFBVUssSUFYVjtBQVlqQm5CLElBQUFBLGlCQUFpQixFQUFFYyxzQkFBVUssSUFaWjtBQWFqQjFCLElBQUFBLFNBQVMsRUFBRXFCLHNCQUFVSyxJQWJKO0FBY2pCeEIsSUFBQUEsVUFBVSxFQUFFbUIsc0JBQVVLO0FBZEwsR0FEckIsNERBa0J3QjtBQUNwQkgsSUFBQUEsYUFBYSxFQUFFTyxnQkFESztBQUVwQmxCLElBQUFBLFdBQVcsRUFBRSxDQUNYO0FBQ0V4QyxNQUFBQSxFQUFFLEVBQUUsU0FETjtBQUVFMkQsTUFBQUEsYUFBYSxFQUFFQyxTQUZqQjtBQUdFeEQsTUFBQUEsT0FBTyxFQUFFLHNCQUhYO0FBSUVMLE1BQUFBLE9BQU8sRUFBRSxtQkFBTSxDQUFFLENBSm5CO0FBS0VnRCxNQUFBQSxpQkFBaUIsRUFBRWQ7QUFMckIsS0FEVyxFQVFYO0FBQ0VqQyxNQUFBQSxFQUFFLEVBQUUsTUFETjtBQUVFMkQsTUFBQUEsYUFBYSxFQUFFRSxXQUZqQjtBQUdFOUQsTUFBQUEsT0FBTyxFQUFFLG1CQUFNLENBQUUsQ0FIbkI7QUFJRUUsTUFBQUEsS0FBSyxFQUFFLE9BSlQ7QUFLRThDLE1BQUFBLGlCQUFpQixFQUFFNUI7QUFMckIsS0FSVztBQUZPLEdBbEJ4QjtBQTJGRDs7ZUFFY2lCLGtCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5pbXBvcnQge1Rvb2x0aXB9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBLZXBsZXJHbExvZ28gZnJvbSAnY29tcG9uZW50cy9jb21tb24vbG9nbyc7XG5pbXBvcnQge1NhdmUsIERhdGFUYWJsZSwgU2F2ZTIsIFBpY3R1cmUsIERiLCBNYXAgYXMgTWFwSWNvbiwgU2hhcmV9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCBDbGlja091dHNpZGVDbG9zZURyb3Bkb3duIGZyb20gJ2NvbXBvbmVudHMvc2lkZS1wYW5lbC9wYW5lbC1kcm9wZG93bic7XG5pbXBvcnQgVG9vbGJhciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi90b29sYmFyJztcbmltcG9ydCBUb29sYmFySXRlbSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi90b29sYmFyLWl0ZW0nO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdyZWFjdC1pbnRsJztcblxuY29uc3QgU3R5bGVkUGFuZWxIZWFkZXIgPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnc2lkZS1zaWRlLXBhbmVsX19oZWFkZXInXG59KWBcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zaWRlUGFuZWxIZWFkZXJCZ307XG4gIHBhZGRpbmc6IDEycHggMTZweCAwIDE2cHg7XG5gO1xuXG5jb25zdCBTdHlsZWRQYW5lbEhlYWRlclRvcCA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdzaWRlLXBhbmVsX19oZWFkZXJfX3RvcCdcbn0pYFxuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIG1hcmdpbi1ib3R0b206IDE2cHg7XG4gIHdpZHRoOiAxMDAlO1xuYDtcblxuY29uc3QgU3R5bGVkUGFuZWxUb3BBY3Rpb25zID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ3NpZGUtcGFuZWxfX3RvcF9fYWN0aW9ucydcbn0pYFxuICBkaXNwbGF5OiBmbGV4O1xuYDtcblxuY29uc3QgU3R5bGVkUGFuZWxBY3Rpb24gPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnc2lkZS1wYW5lbF9fcGFuZWwtaGVhZGVyX19hY3Rpb24nXG59KWBcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgYm9yZGVyLXJhZGl1czogMnB4O1xuICBjb2xvcjogJHtwcm9wcyA9PiAocHJvcHMuYWN0aXZlID8gcHJvcHMudGhlbWUudGV4dENvbG9ySGwgOiBwcm9wcy50aGVtZS5zdWJ0ZXh0Q29sb3IpfTtcbiAgZGlzcGxheTogZmxleDtcbiAgaGVpZ2h0OiAyNnB4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIG1hcmdpbi1sZWZ0OiA0cHg7XG4gIHBhZGRpbmc6IDVweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIHAge1xuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICBtYXJnaW4tcmlnaHQ6IDZweDtcbiAgfVxuICBhIHtcbiAgICBoZWlnaHQ6IDIwcHg7XG4gIH1cblxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG5cbiAgICBhIHtcbiAgICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckhsfTtcbiAgICB9XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZFRvb2xiYXIgPSBzdHlsZWQoVG9vbGJhcilgXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbmA7XG5cbmV4cG9ydCBjb25zdCBQYW5lbEFjdGlvbiA9ICh7aXRlbSwgb25DbGlja30pID0+IChcbiAgPFN0eWxlZFBhbmVsQWN0aW9uIGRhdGEtdGlwIGRhdGEtZm9yPXtgJHtpdGVtLmlkfS1hY3Rpb25gfSBvbkNsaWNrPXtvbkNsaWNrfT5cbiAgICB7aXRlbS5sYWJlbCA/IDxwPntpdGVtLmxhYmVsfTwvcD4gOiBudWxsfVxuICAgIDxhIHRhcmdldD17aXRlbS5ibGFuayA/ICdfYmxhbmsnIDogJyd9IGhyZWY9e2l0ZW0uaHJlZn0+XG4gICAgICA8aXRlbS5pY29uQ29tcG9uZW50IGhlaWdodD1cIjIwcHhcIiAvPlxuICAgIDwvYT5cbiAgICB7aXRlbS50b29sdGlwID8gKFxuICAgICAgPFRvb2x0aXAgaWQ9e2Ake2l0ZW0uaWR9LWFjdGlvbmB9IHBsYWNlPVwiYm90dG9tXCIgZGVsYXlTaG93PXs1MDB9IGVmZmVjdD1cInNvbGlkXCI+XG4gICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXtpdGVtLnRvb2x0aXB9IC8+XG4gICAgICA8L1Rvb2x0aXA+XG4gICAgKSA6IG51bGx9XG4gIDwvU3R5bGVkUGFuZWxBY3Rpb24+XG4pO1xuXG5leHBvcnQgY29uc3QgUGFuZWxIZWFkZXJEcm9wZG93bkZhY3RvcnkgPSAoKSA9PiB7XG4gIGNvbnN0IFBhbmVsSGVhZGVyRHJvcGRvd24gPSAoe2l0ZW1zLCBzaG93LCBvbkNsb3NlLCBpZH0pID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZFRvb2xiYXIgc2hvdz17c2hvd30gY2xhc3NOYW1lPXtgJHtpZH0tZHJvcGRvd25gfT5cbiAgICAgICAgPENsaWNrT3V0c2lkZUNsb3NlRHJvcGRvd25cbiAgICAgICAgICBjbGFzc05hbWU9XCJwYW5lbC1oZWFkZXItZHJvcGRvd25fX2lubmVyXCJcbiAgICAgICAgICBzaG93PXtzaG93fVxuICAgICAgICAgIG9uQ2xvc2U9e29uQ2xvc2V9XG4gICAgICAgID5cbiAgICAgICAgICB7aXRlbXMubWFwKGl0ZW0gPT4gKFxuICAgICAgICAgICAgPFRvb2xiYXJJdGVtXG4gICAgICAgICAgICAgIGlkPXtpdGVtLmtleX1cbiAgICAgICAgICAgICAga2V5PXtpdGVtLmtleX1cbiAgICAgICAgICAgICAgbGFiZWw9e2l0ZW0ubGFiZWx9XG4gICAgICAgICAgICAgIGljb249e2l0ZW0uaWNvbn1cbiAgICAgICAgICAgICAgb25DbGljaz17aXRlbS5vbkNsaWNrfVxuICAgICAgICAgICAgICBvbkNsb3NlPXtvbkNsb3NlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9DbGlja091dHNpZGVDbG9zZURyb3Bkb3duPlxuICAgICAgPC9TdHlsZWRUb29sYmFyPlxuICAgICk7XG4gIH07XG5cbiAgcmV0dXJuIFBhbmVsSGVhZGVyRHJvcGRvd247XG59O1xuXG5jb25zdCBnZXREcm9wZG93bkl0ZW1zU2VsZWN0b3IgPSAoKSA9PlxuICBjcmVhdGVTZWxlY3RvcihcbiAgICBwcm9wcyA9PiBwcm9wcyxcbiAgICBwcm9wcyA9PlxuICAgICAgcHJvcHMuaXRlbXNcbiAgICAgICAgLm1hcCh0ID0+ICh7XG4gICAgICAgICAgLi4udCxcbiAgICAgICAgICBvbkNsaWNrOiB0Lm9uQ2xpY2sgJiYgdC5vbkNsaWNrKHByb3BzKSA/IHQub25DbGljayhwcm9wcykgOiBudWxsXG4gICAgICAgIH0pKVxuICAgICAgICAuZmlsdGVyKGwgPT4gbC5vbkNsaWNrKVxuICApO1xuXG5leHBvcnQgY29uc3QgU2F2ZUV4cG9ydERyb3Bkb3duRmFjdG9yeSA9IFBhbmVsSGVhZGVyRHJvcGRvd24gPT4ge1xuICBjb25zdCBkcm9wZG93bkl0ZW1zU2VsZWN0b3IgPSBnZXREcm9wZG93bkl0ZW1zU2VsZWN0b3IoKTtcblxuICBjb25zdCBTYXZlRXhwb3J0RHJvcGRvd24gPSBwcm9wcyA9PiAoXG4gICAgPFBhbmVsSGVhZGVyRHJvcGRvd25cbiAgICAgIGl0ZW1zPXtkcm9wZG93bkl0ZW1zU2VsZWN0b3IocHJvcHMpfVxuICAgICAgc2hvdz17cHJvcHMuc2hvd31cbiAgICAgIG9uQ2xvc2U9e3Byb3BzLm9uQ2xvc2V9XG4gICAgICBpZD1cInNhdmUtZXhwb3J0XCJcbiAgICAvPlxuICApO1xuXG4gIFNhdmVFeHBvcnREcm9wZG93bi5kZWZhdWx0UHJvcHMgPSB7XG4gICAgaXRlbXM6IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICd0b29sYmFyLmV4cG9ydEltYWdlJyxcbiAgICAgICAgaWNvbjogUGljdHVyZSxcbiAgICAgICAga2V5OiAnaW1hZ2UnLFxuICAgICAgICBvbkNsaWNrOiBwcm9wcyA9PiBwcm9wcy5vbkV4cG9ydEltYWdlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ3Rvb2xiYXIuZXhwb3J0RGF0YScsXG4gICAgICAgIGljb246IERhdGFUYWJsZSxcbiAgICAgICAga2V5OiAnZGF0YScsXG4gICAgICAgIG9uQ2xpY2s6IHByb3BzID0+IHByb3BzLm9uRXhwb3J0RGF0YVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICd0b29sYmFyLmV4cG9ydE1hcCcsXG4gICAgICAgIGljb246IE1hcEljb24sXG4gICAgICAgIGtleTogJ21hcCcsXG4gICAgICAgIG9uQ2xpY2s6IHByb3BzID0+IHByb3BzLm9uRXhwb3J0TWFwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ3Rvb2xiYXIuc2F2ZU1hcCcsXG4gICAgICAgIGljb246IFNhdmUyLFxuICAgICAgICBrZXk6ICdzYXZlJyxcbiAgICAgICAgb25DbGljazogcHJvcHMgPT4gcHJvcHMub25TYXZlTWFwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ3Rvb2xiYXIuc2hhcmVNYXBVUkwnLFxuICAgICAgICBpY29uOiBTaGFyZSxcbiAgICAgICAga2V5OiAnc2hhcmUnLFxuICAgICAgICBvbkNsaWNrOiBwcm9wcyA9PiBwcm9wcy5vblNoYXJlTWFwXG4gICAgICB9XG4gICAgXVxuICB9O1xuXG4gIHJldHVybiBTYXZlRXhwb3J0RHJvcGRvd247XG59O1xuU2F2ZUV4cG9ydERyb3Bkb3duRmFjdG9yeS5kZXBzID0gW1BhbmVsSGVhZGVyRHJvcGRvd25GYWN0b3J5XTtcblxuZXhwb3J0IGNvbnN0IENsb3VkU3RvcmFnZURyb3Bkb3duRmFjdG9yeSA9IFBhbmVsSGVhZGVyRHJvcGRvd24gPT4ge1xuICBjb25zdCBkcm9wZG93bkl0ZW1zU2VsZWN0b3IgPSBnZXREcm9wZG93bkl0ZW1zU2VsZWN0b3IoKTtcblxuICBjb25zdCBDbG91ZFN0b3JhZ2VEcm9wZG93biA9IHByb3BzID0+IChcbiAgICA8UGFuZWxIZWFkZXJEcm9wZG93blxuICAgICAgaXRlbXM9e2Ryb3Bkb3duSXRlbXNTZWxlY3Rvcihwcm9wcyl9XG4gICAgICBzaG93PXtwcm9wcy5zaG93fVxuICAgICAgb25DbG9zZT17cHJvcHMub25DbG9zZX1cbiAgICAgIGlkPVwiY2xvdWQtc3RvcmFnZVwiXG4gICAgLz5cbiAgKTtcbiAgQ2xvdWRTdG9yYWdlRHJvcGRvd24uZGVmYXVsdFByb3BzID0ge1xuICAgIGl0ZW1zOiBbXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnU2F2ZScsXG4gICAgICAgIGljb246IFNhdmUyLFxuICAgICAgICBrZXk6ICdzYXZlJyxcbiAgICAgICAgb25DbGljazogcHJvcHMgPT4gcHJvcHMub25TYXZlVG9TdG9yYWdlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ1NhdmUgQXMnLFxuICAgICAgICBpY29uOiBTYXZlMixcbiAgICAgICAga2V5OiAnc2F2ZUFzJyxcbiAgICAgICAgb25DbGljazogcHJvcHMgPT4gcHJvcHMub25TYXZlQXNUb1N0b3JhZ2VcbiAgICAgIH1cbiAgICBdXG4gIH07XG4gIHJldHVybiBDbG91ZFN0b3JhZ2VEcm9wZG93bjtcbn07XG5DbG91ZFN0b3JhZ2VEcm9wZG93bkZhY3RvcnkuZGVwcyA9IFtQYW5lbEhlYWRlckRyb3Bkb3duRmFjdG9yeV07XG5cblBhbmVsSGVhZGVyRmFjdG9yeS5kZXBzID0gW1NhdmVFeHBvcnREcm9wZG93bkZhY3RvcnksIENsb3VkU3RvcmFnZURyb3Bkb3duRmFjdG9yeV07XG5cbmZ1bmN0aW9uIFBhbmVsSGVhZGVyRmFjdG9yeShTYXZlRXhwb3J0RHJvcGRvd24sIENsb3VkU3RvcmFnZURyb3Bkb3duKSB7XG4gIHJldHVybiBjbGFzcyBQYW5lbEhlYWRlciBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAgIGFwcE5hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBhcHBXZWJzaXRlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgdmVyc2lvbjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIHZpc2libGVEcm9wZG93bjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIGxvZ29Db21wb25lbnQ6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5lbGVtZW50LCBQcm9wVHlwZXMuZnVuY10pLFxuICAgICAgYWN0aW9uSXRlbXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5hbnkpLFxuICAgICAgb25FeHBvcnRJbWFnZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICBvbkV4cG9ydERhdGE6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgb25FeHBvcnRDb25maWc6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgb25FeHBvcnRNYXA6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgb25TYXZlVG9TdG9yYWdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgIG9uU2F2ZUFzVG9TdG9yYWdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgIG9uU2F2ZU1hcDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICBvblNoYXJlTWFwOiBQcm9wVHlwZXMuZnVuY1xuICAgIH07XG5cbiAgICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgICAgbG9nb0NvbXBvbmVudDogS2VwbGVyR2xMb2dvLFxuICAgICAgYWN0aW9uSXRlbXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnc3RvcmFnZScsXG4gICAgICAgICAgaWNvbkNvbXBvbmVudDogRGIsXG4gICAgICAgICAgdG9vbHRpcDogJ3Rvb2x0aXAuY2xvdWRTdG9yYWdlJyxcbiAgICAgICAgICBvbkNsaWNrOiAoKSA9PiB7fSxcbiAgICAgICAgICBkcm9wZG93bkNvbXBvbmVudDogQ2xvdWRTdG9yYWdlRHJvcGRvd25cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnc2F2ZScsXG4gICAgICAgICAgaWNvbkNvbXBvbmVudDogU2F2ZSxcbiAgICAgICAgICBvbkNsaWNrOiAoKSA9PiB7fSxcbiAgICAgICAgICBsYWJlbDogJ1NoYXJlJyxcbiAgICAgICAgICBkcm9wZG93bkNvbXBvbmVudDogU2F2ZUV4cG9ydERyb3Bkb3duXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9O1xuXG4gICAgcmVuZGVyKCkge1xuICAgICAgY29uc3Qge1xuICAgICAgICBhcHBOYW1lLFxuICAgICAgICBhcHBXZWJzaXRlLFxuICAgICAgICB2ZXJzaW9uLFxuICAgICAgICBhY3Rpb25JdGVtcyxcbiAgICAgICAgdmlzaWJsZURyb3Bkb3duLFxuICAgICAgICBzaG93RXhwb3J0RHJvcGRvd24sXG4gICAgICAgIGhpZGVFeHBvcnREcm9wZG93bixcbiAgICAgICAgLi4uZHJvcGRvd25DYWxsYmFja3NcbiAgICAgIH0gPSB0aGlzLnByb3BzO1xuICAgICAgbGV0IGl0ZW1zID0gYWN0aW9uSXRlbXMgfHwgW107XG5cbiAgICAgIC8vIGRvbid0IHJlbmRlciBjbG91ZCBzdG9yYWdlIGljb24gaWYgb25TYXZlVG9TdG9yYWdlIGlzIG5vdCBwcm92aWRlZFxuICAgICAgaWYgKHR5cGVvZiB0aGlzLnByb3BzLm9uU2F2ZVRvU3RvcmFnZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBpdGVtcyA9IGFjdGlvbkl0ZW1zLmZpbHRlcihhaSA9PiBhaS5pZCAhPT0gJ3N0b3JhZ2UnKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFN0eWxlZFBhbmVsSGVhZGVyIGNsYXNzTmFtZT1cInNpZGUtcGFuZWxfX3BhbmVsLWhlYWRlclwiPlxuICAgICAgICAgIDxTdHlsZWRQYW5lbEhlYWRlclRvcCBjbGFzc05hbWU9XCJzaWRlLXBhbmVsX19wYW5lbC1oZWFkZXJfX3RvcFwiPlxuICAgICAgICAgICAgPHRoaXMucHJvcHMubG9nb0NvbXBvbmVudCBhcHBOYW1lPXthcHBOYW1lfSB2ZXJzaW9uPXt2ZXJzaW9ufSBhcHBXZWJzaXRlPXthcHBXZWJzaXRlfSAvPlxuICAgICAgICAgICAgPFN0eWxlZFBhbmVsVG9wQWN0aW9ucz5cbiAgICAgICAgICAgICAge2l0ZW1zLm1hcChpdGVtID0+IChcbiAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJzaWRlLXBhbmVsX19wYW5lbC1oZWFkZXJfX3JpZ2h0XCJcbiAgICAgICAgICAgICAgICAgIGtleT17aXRlbS5pZH1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7cG9zaXRpb246ICdyZWxhdGl2ZSd9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxQYW5lbEFjdGlvblxuICAgICAgICAgICAgICAgICAgICBpdGVtPXtpdGVtfVxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uZHJvcGRvd25Db21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dFeHBvcnREcm9wZG93bihpdGVtLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgaXRlbS5vbkNsaWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAge2l0ZW0uZHJvcGRvd25Db21wb25lbnQgPyAoXG4gICAgICAgICAgICAgICAgICAgIDxpdGVtLmRyb3Bkb3duQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgICAgICAgb25DbG9zZT17aGlkZUV4cG9ydERyb3Bkb3dufVxuICAgICAgICAgICAgICAgICAgICAgIHNob3c9e3Zpc2libGVEcm9wZG93biA9PT0gaXRlbS5pZH1cbiAgICAgICAgICAgICAgICAgICAgICB7Li4uZHJvcGRvd25DYWxsYmFja3N9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L1N0eWxlZFBhbmVsVG9wQWN0aW9ucz5cbiAgICAgICAgICA8L1N0eWxlZFBhbmVsSGVhZGVyVG9wPlxuICAgICAgICA8L1N0eWxlZFBhbmVsSGVhZGVyPlxuICAgICAgKTtcbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBhbmVsSGVhZGVyRmFjdG9yeTtcbiJdfQ==