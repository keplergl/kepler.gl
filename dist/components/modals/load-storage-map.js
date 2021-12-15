"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ProviderSelect = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _moment = _interopRequireDefault(require("moment"));

var _loadingDialog = _interopRequireDefault(require("./loading-dialog"));

var _styledComponents2 = require("../common/styled-components");

var _cloudTile = _interopRequireDefault(require("./cloud-tile"));

var _icons = require("../common/icons");

var _providerModalContainer = _interopRequireDefault(require("./provider-modal-container"));

var _localization = require("../../localization");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var StyledProviderSection = _styledComponents["default"].div.attrs({
  className: 'provider-selection'
})(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n"])));

var StyledSpinner = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  text-align: center;\n  span {\n    margin: 0 auto;\n  }\n"])));

var StyledVisualizationSection = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-direction: column;\n  align-items: stretch;\n"])));

var StyledStorageHeader = _styledComponents["default"].div(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 16px;\n  font-size: 12px;\n  line-height: 14px;\n"])));

var StyledBackBtn = _styledComponents["default"].a(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2["default"])(["\n  margin-bottom: 16px;\n  color: #3a414c;\n  cursor: pointer;\n\n  &:hover {\n    font-weight: 500;\n  }\n"])));

var StyledProviderVisSection = _styledComponents["default"].div(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2["default"])(["\n  flex: 1 1 auto;\n  background-color: #f8f8f9;\n  padding: 20px 24px;\n  min-height: 280px;\n\n  .title {\n    font-size: 14px;\n    line-height: 16px;\n    font-weight: 500;\n    margin-bottom: 16px;\n\n    span {\n      text-transform: capitalize;\n    }\n  }\n"])));

var StyledSeparator = _styledComponents["default"].hr(_templateObject7 || (_templateObject7 = (0, _taggedTemplateLiteral2["default"])(["\n  border: solid #bfbfbf;\n  border-width: 0 0 1px 0;\n  margin-bottom: 16px;\n"])));

var StyledVisualizationList = _styledComponents["default"].div(_templateObject8 || (_templateObject8 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-flow: row wrap;\n  align-items: stretch;\n  justify-content: space-between;\n"])));

var StyledVisualizationItem = _styledComponents["default"].div(_templateObject9 || (_templateObject9 = (0, _taggedTemplateLiteral2["default"])(["\n  flex: 0 0 auto;\n  width: 208px;\n  display: flex;\n  flex-direction: column;\n  padding: 16px 8px;\n  color: #3a414c;\n  cursor: pointer;\n  font-size: 12px;\n  line-height: 18px;\n\n  &:hover {\n    .vis_item-icon,\n    .vis_item-thumb,\n    .vis_item-description,\n    .vis_item-modification-date {\n      opacity: 1;\n    }\n  }\n\n  .vis_item-icon,\n  .vis_item-thumb,\n  .vis_item-description,\n  .vis_item-modification-date {\n    opacity: 0.9;\n    transition: opacity 0.4s ease;\n  }\n\n  .vis_item-icon {\n    position: relative;\n    flex: 0 0 108px;\n    background-color: #6a7484;\n    border-radius: 4px;\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    justify-content: center;\n  }\n\n  .vis_item-thumb {\n    position: relative;\n    flex: 0 0 108px;\n    background-size: cover;\n    background-position: center;\n    border-radius: 4px;\n  }\n\n  .vis_item-privacy {\n    position: absolute;\n    top: 0;\n    left: 0;\n    padding: 3px 6px;\n    border-radius: 4px 0;\n    background-color: rgba(58, 65, 76, 0.7);\n    color: #fff;\n    font-size: 11px;\n    line-height: 18px;\n  }\n\n  .vis_item-title {\n    margin-top: 16px;\n    font-weight: 500;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n  }\n\n  .vis_item-description {\n    flex: 1 1 auto;\n    margin-top: 8px;\n  }\n\n  .vis_item-modification-date {\n    margin-top: 16px;\n    flex: 1 0 auto;\n    color: #6a7484;\n    line-height: 15px;\n  }\n"])));

var MapIcon = function MapIcon(props) {
  return /*#__PURE__*/_react["default"].createElement("div", props, props.children, /*#__PURE__*/_react["default"].createElement(_icons.Base, {
    height: "32px",
    viewBox: '0 0 16 16'
  }, /*#__PURE__*/_react["default"].createElement("path", {
    fill: "#d3d8d6",
    d: "m13.6 11.572-3.2 2.1336v-9.2776l3.2-2.1336zm-12-7.144 3.2-2.1336v9.2776l-3.2 2.1336zm13.244 8.2376c0.2224-0.148 0.356-0.3984 0.356-0.6656v-11.2c0-0.2952-0.1624-0.5664-0.4224-0.7048-0.26-0.14-0.576-0.1248-0.8216 0.0392l-4.3128 2.876-3.5432-2.8352c-0.1208-0.0936-0.2952-0.1624-0.472-0.1688-0.1648-0.0064-0.348 0.0464-0.472 0.128l-4.8 3.2c-0.2224 0.1488-0.356 0.3984-0.356 0.6656v11.2c0 0.2952 0.1624 0.5664 0.4224 0.7056 0.1184 0.0632 0.248 0.0944 0.3776 0.0944 0.1552 0 0.3096-0.0448 0.444-0.1344l4.3128-2.876 3.5432 2.8352c0.1448 0.116 0.3216 0.1752 0.5 0.1752 0.1184 0 0.236-0.0248 0.3464-0.0784z"
  })));
};

var PrivacyBadge = function PrivacyBadge(_ref) {
  var privateMap = _ref.privateMap;
  return /*#__PURE__*/_react["default"].createElement("span", {
    className: "vis_item-privacy"
  }, privateMap ? 'Private' : 'Public');
};

var VisualizationItem = function VisualizationItem(_ref2) {
  var vis = _ref2.vis,
      onClick = _ref2.onClick;
  return /*#__PURE__*/_react["default"].createElement(StyledVisualizationItem, {
    onClick: onClick
  }, vis.thumbnail ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "vis_item-thumb",
    style: {
      backgroundImage: "url(".concat(vis.thumbnail, ")")
    }
  }, vis.hasOwnProperty('privateMap') ? /*#__PURE__*/_react["default"].createElement(PrivacyBadge, {
    privateMap: vis.privateMap
  }) : null) : /*#__PURE__*/_react["default"].createElement(MapIcon, {
    className: "vis_item-icon"
  }, vis.hasOwnProperty('privateMap') ? /*#__PURE__*/_react["default"].createElement(PrivacyBadge, {
    privateMap: vis.privateMap
  }) : null), /*#__PURE__*/_react["default"].createElement("span", {
    className: "vis_item-title"
  }, vis.title), vis.description && vis.description.length && /*#__PURE__*/_react["default"].createElement("span", {
    className: "vis_item-description"
  }, vis.description), /*#__PURE__*/_react["default"].createElement("span", {
    className: "vis_item-modification-date"
  }, "Last modified ", _moment["default"].utc(vis.lastModification).fromNow()));
};

var ProviderSelect = function ProviderSelect(_ref3) {
  var _ref3$cloudProviders = _ref3.cloudProviders,
      cloudProviders = _ref3$cloudProviders === void 0 ? [] : _ref3$cloudProviders,
      _onSelect = _ref3.onSelect,
      onSetCloudProvider = _ref3.onSetCloudProvider,
      currentProvider = _ref3.currentProvider;
  return cloudProviders.length ? /*#__PURE__*/_react["default"].createElement(StyledProviderSection, null, cloudProviders.map(function (provider) {
    return /*#__PURE__*/_react["default"].createElement(_cloudTile["default"], {
      key: provider.name,
      onSelect: function onSelect() {
        return _onSelect(provider.name);
      },
      onSetCloudProvider: onSetCloudProvider,
      cloudProvider: provider,
      isSelected: provider.name === currentProvider,
      isConnected: Boolean(provider.getAccessToken && provider.getAccessToken())
    });
  })) : /*#__PURE__*/_react["default"].createElement("p", null, "No storage provider available");
};

exports.ProviderSelect = ProviderSelect;

function LoadStorageMapFactory() {
  var LoadStorageMap = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(LoadStorageMap, _Component);

    var _super = _createSuper(LoadStorageMap);

    function LoadStorageMap() {
      var _this;

      (0, _classCallCheck2["default"])(this, LoadStorageMap);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
        showProviderSelect: true
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_getProvider", function () {
        var _this$props = _this.props,
            currentProvider = _this$props.currentProvider,
            cloudProviders = _this$props.cloudProviders;
        return (cloudProviders || []).find(function (p) {
          return p.name === currentProvider;
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_clickBack", function () {
        _this.setState({
          showProviderSelect: true
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_selectProvider", function (providerName) {
        _this.props.onSetCloudProvider(providerName);

        var provider = (_this.props.cloudProviders || []).find(function (p) {
          return p.name === providerName;
        });

        _this.props.getSavedMaps(provider);

        _this.setState({
          showProviderSelect: false
        });
      });
      return _this;
    }

    (0, _createClass2["default"])(LoadStorageMap, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this._getSavedMaps();
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        if (prevProps.currentProvider !== this.props.currentProvider) {
          this._getSavedMaps();
        }
      }
    }, {
      key: "_getSavedMaps",
      value: function _getSavedMaps() {
        var provider = this._getProvider();

        if (provider) {
          this.props.getSavedMaps(provider);
          this.setState({
            showProviderSelect: false
          });
        }
      }
    }, {
      key: "_onLoadCloudMap",
      value: function _onLoadCloudMap(provider, vis) {
        this.props.onLoadCloudMap({
          loadParams: vis.loadParams,
          provider: provider
        });
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        var _this$props2 = this.props,
            visualizations = _this$props2.visualizations,
            cloudProviders = _this$props2.cloudProviders,
            currentProvider = _this$props2.currentProvider,
            isProviderLoading = _this$props2.isProviderLoading,
            onSetCloudProvider = _this$props2.onSetCloudProvider;

        var provider = this._getProvider();

        return /*#__PURE__*/_react["default"].createElement(_providerModalContainer["default"], {
          onSetCloudProvider: onSetCloudProvider,
          cloudProviders: cloudProviders,
          currentProvider: currentProvider
        }, this.state.showProviderSelect ? /*#__PURE__*/_react["default"].createElement(ProviderSelect, {
          onSelect: this._selectProvider,
          cloudProviders: cloudProviders,
          onSetCloudProvider: onSetCloudProvider,
          currentProvider: currentProvider
        }) : /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, isProviderLoading && /*#__PURE__*/_react["default"].createElement(StyledSpinner, null, /*#__PURE__*/_react["default"].createElement(_loadingDialog["default"], {
          size: 64
        })), !isProviderLoading && visualizations && /*#__PURE__*/_react["default"].createElement(StyledVisualizationSection, null, /*#__PURE__*/_react["default"].createElement(StyledStorageHeader, null, /*#__PURE__*/_react["default"].createElement(StyledBackBtn, null, /*#__PURE__*/_react["default"].createElement(_styledComponents2.Button, {
          link: true,
          onClick: this._clickBack
        }, /*#__PURE__*/_react["default"].createElement(_icons.ArrowLeft, {
          height: "14px"
        }), /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
          id: 'modal.loadStorageMap.back'
        }))), provider.getManagementUrl && /*#__PURE__*/_react["default"].createElement("a", {
          key: 1,
          href: provider.getManagementUrl(),
          target: "_blank",
          rel: "noopener noreferrer",
          style: {
            textDecoration: 'underline'
          }
        }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
          id: 'modal.loadStorageMap.back',
          values: {
            displayName: provider.displayName
          }
        }))), /*#__PURE__*/_react["default"].createElement(StyledProviderVisSection, null, /*#__PURE__*/_react["default"].createElement("span", {
          className: "title"
        }, /*#__PURE__*/_react["default"].createElement("span", null, currentProvider), /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
          id: 'modal.loadStorageMap.storageMaps'
        })), /*#__PURE__*/_react["default"].createElement(StyledSeparator, null), /*#__PURE__*/_react["default"].createElement(StyledVisualizationList, null, visualizations.length ? visualizations.map(function (vis) {
          return /*#__PURE__*/_react["default"].createElement(VisualizationItem, {
            key: vis.id,
            onClick: function onClick() {
              return _this2._onLoadCloudMap(provider, vis);
            },
            vis: vis
          });
        }) : /*#__PURE__*/_react["default"].createElement("div", {
          className: "visualization-list__message"
        }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
          id: 'modal.loadStorageMap.noSavedMaps'
        })))))));
      }
    }]);
    return LoadStorageMap;
  }(_react.Component);

  return LoadStorageMap;
}

var _default = LoadStorageMapFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9sb2FkLXN0b3JhZ2UtbWFwLmpzIl0sIm5hbWVzIjpbIlN0eWxlZFByb3ZpZGVyU2VjdGlvbiIsInN0eWxlZCIsImRpdiIsImF0dHJzIiwiY2xhc3NOYW1lIiwiU3R5bGVkU3Bpbm5lciIsIlN0eWxlZFZpc3VhbGl6YXRpb25TZWN0aW9uIiwiU3R5bGVkU3RvcmFnZUhlYWRlciIsIlN0eWxlZEJhY2tCdG4iLCJhIiwiU3R5bGVkUHJvdmlkZXJWaXNTZWN0aW9uIiwiU3R5bGVkU2VwYXJhdG9yIiwiaHIiLCJTdHlsZWRWaXN1YWxpemF0aW9uTGlzdCIsIlN0eWxlZFZpc3VhbGl6YXRpb25JdGVtIiwiTWFwSWNvbiIsInByb3BzIiwiY2hpbGRyZW4iLCJQcml2YWN5QmFkZ2UiLCJwcml2YXRlTWFwIiwiVmlzdWFsaXphdGlvbkl0ZW0iLCJ2aXMiLCJvbkNsaWNrIiwidGh1bWJuYWlsIiwiYmFja2dyb3VuZEltYWdlIiwiaGFzT3duUHJvcGVydHkiLCJ0aXRsZSIsImRlc2NyaXB0aW9uIiwibGVuZ3RoIiwibW9tZW50IiwidXRjIiwibGFzdE1vZGlmaWNhdGlvbiIsImZyb21Ob3ciLCJQcm92aWRlclNlbGVjdCIsImNsb3VkUHJvdmlkZXJzIiwib25TZWxlY3QiLCJvblNldENsb3VkUHJvdmlkZXIiLCJjdXJyZW50UHJvdmlkZXIiLCJtYXAiLCJwcm92aWRlciIsIm5hbWUiLCJCb29sZWFuIiwiZ2V0QWNjZXNzVG9rZW4iLCJMb2FkU3RvcmFnZU1hcEZhY3RvcnkiLCJMb2FkU3RvcmFnZU1hcCIsInNob3dQcm92aWRlclNlbGVjdCIsImZpbmQiLCJwIiwic2V0U3RhdGUiLCJwcm92aWRlck5hbWUiLCJnZXRTYXZlZE1hcHMiLCJfZ2V0U2F2ZWRNYXBzIiwicHJldlByb3BzIiwiX2dldFByb3ZpZGVyIiwib25Mb2FkQ2xvdWRNYXAiLCJsb2FkUGFyYW1zIiwidmlzdWFsaXphdGlvbnMiLCJpc1Byb3ZpZGVyTG9hZGluZyIsInN0YXRlIiwiX3NlbGVjdFByb3ZpZGVyIiwiX2NsaWNrQmFjayIsImdldE1hbmFnZW1lbnRVcmwiLCJ0ZXh0RGVjb3JhdGlvbiIsImRpc3BsYXlOYW1lIiwiaWQiLCJfb25Mb2FkQ2xvdWRNYXAiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFNQSxxQkFBcUIsR0FBR0MsNkJBQU9DLEdBQVAsQ0FBV0MsS0FBWCxDQUFpQjtBQUM3Q0MsRUFBQUEsU0FBUyxFQUFFO0FBRGtDLENBQWpCLENBQUgsMEdBQTNCOztBQU1BLElBQU1DLGFBQWEsR0FBR0osNkJBQU9DLEdBQVYscUpBQW5COztBQU9BLElBQU1JLDBCQUEwQixHQUFHTCw2QkFBT0MsR0FBVixnS0FBaEM7O0FBTUEsSUFBTUssbUJBQW1CLEdBQUdOLDZCQUFPQyxHQUFWLGlRQUF6Qjs7QUFVQSxJQUFNTSxhQUFhLEdBQUdQLDZCQUFPUSxDQUFWLG9NQUFuQjs7QUFVQSxJQUFNQyx3QkFBd0IsR0FBR1QsNkJBQU9DLEdBQVYsa1dBQTlCOztBQWtCQSxJQUFNUyxlQUFlLEdBQUdWLDZCQUFPVyxFQUFWLHdLQUFyQjs7QUFNQSxJQUFNQyx1QkFBdUIsR0FBR1osNkJBQU9DLEdBQVYsZ01BQTdCOztBQU9BLElBQU1ZLHVCQUF1QixHQUFHYiw2QkFBT0MsR0FBViwraURBQTdCOztBQWdGQSxJQUFNYSxPQUFPLEdBQUcsU0FBVkEsT0FBVSxDQUFBQyxLQUFLLEVBQUk7QUFDdkIsc0JBQ0UsdUNBQVNBLEtBQVQsRUFDR0EsS0FBSyxDQUFDQyxRQURULGVBRUUsZ0NBQUMsV0FBRDtBQUFNLElBQUEsTUFBTSxFQUFDLE1BQWI7QUFBb0IsSUFBQSxPQUFPLEVBQUU7QUFBN0Isa0JBQ0U7QUFDRSxJQUFBLElBQUksRUFBQyxTQURQO0FBRUUsSUFBQSxDQUFDLEVBQUM7QUFG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QUVBLEdBQUcsQ0FBQzJDLEVBRFg7QUFFRSxZQUFBLE9BQU8sRUFBRTtBQUFBLHFCQUFNLE1BQUksQ0FBQ0MsZUFBTCxDQUFxQjFCLFFBQXJCLEVBQStCbEIsR0FBL0IsQ0FBTjtBQUFBLGFBRlg7QUFHRSxZQUFBLEdBQUcsRUFBRUE7QUFIUCxZQURvQjtBQUFBLFNBQXRCLENBREQsZ0JBU0M7QUFBSyxVQUFBLFNBQVMsRUFBQztBQUFmLHdCQUNFLGdDQUFDLDhCQUFEO0FBQWtCLFVBQUEsRUFBRSxFQUFFO0FBQXRCLFVBREYsQ0FWSixDQU5GLENBdkJGLENBUEosQ0FiSixDQURGO0FBd0VEO0FBbEk0QjtBQUFBO0FBQUEsSUFDRjZDLGdCQURFOztBQW9JL0IsU0FBT3RCLGNBQVA7QUFDRDs7ZUFFY0QscUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuXG5pbXBvcnQgTG9hZGluZ0RpYWxvZyBmcm9tICcuL2xvYWRpbmctZGlhbG9nJztcbmltcG9ydCB7QnV0dG9ufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgQ2xvdWRUaWxlIGZyb20gJy4vY2xvdWQtdGlsZSc7XG5pbXBvcnQge0Jhc2UsIEFycm93TGVmdH0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IFByb3ZpZGVyTW9kYWxDb250YWluZXIgZnJvbSAnLi9wcm92aWRlci1tb2RhbC1jb250YWluZXInO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdsb2NhbGl6YXRpb24nO1xuXG5jb25zdCBTdHlsZWRQcm92aWRlclNlY3Rpb24gPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAncHJvdmlkZXItc2VsZWN0aW9uJ1xufSlgXG4gIGRpc3BsYXk6IGZsZXg7XG5gO1xuXG5jb25zdCBTdHlsZWRTcGlubmVyID0gc3R5bGVkLmRpdmBcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBzcGFuIHtcbiAgICBtYXJnaW46IDAgYXV0bztcbiAgfVxuYDtcblxuY29uc3QgU3R5bGVkVmlzdWFsaXphdGlvblNlY3Rpb24gPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBhbGlnbi1pdGVtczogc3RyZXRjaDtcbmA7XG5cbmNvbnN0IFN0eWxlZFN0b3JhZ2VIZWFkZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIG1hcmdpbi1ib3R0b206IDE2cHg7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgbGluZS1oZWlnaHQ6IDE0cHg7XG5gO1xuXG5jb25zdCBTdHlsZWRCYWNrQnRuID0gc3R5bGVkLmFgXG4gIG1hcmdpbi1ib3R0b206IDE2cHg7XG4gIGNvbG9yOiAjM2E0MTRjO1xuICBjdXJzb3I6IHBvaW50ZXI7XG5cbiAgJjpob3ZlciB7XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgfVxuYDtcblxuY29uc3QgU3R5bGVkUHJvdmlkZXJWaXNTZWN0aW9uID0gc3R5bGVkLmRpdmBcbiAgZmxleDogMSAxIGF1dG87XG4gIGJhY2tncm91bmQtY29sb3I6ICNmOGY4Zjk7XG4gIHBhZGRpbmc6IDIwcHggMjRweDtcbiAgbWluLWhlaWdodDogMjgwcHg7XG5cbiAgLnRpdGxlIHtcbiAgICBmb250LXNpemU6IDE0cHg7XG4gICAgbGluZS1oZWlnaHQ6IDE2cHg7XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICBtYXJnaW4tYm90dG9tOiAxNnB4O1xuXG4gICAgc3BhbiB7XG4gICAgICB0ZXh0LXRyYW5zZm9ybTogY2FwaXRhbGl6ZTtcbiAgICB9XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZFNlcGFyYXRvciA9IHN0eWxlZC5ocmBcbiAgYm9yZGVyOiBzb2xpZCAjYmZiZmJmO1xuICBib3JkZXItd2lkdGg6IDAgMCAxcHggMDtcbiAgbWFyZ2luLWJvdHRvbTogMTZweDtcbmA7XG5cbmNvbnN0IFN0eWxlZFZpc3VhbGl6YXRpb25MaXN0ID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1mbG93OiByb3cgd3JhcDtcbiAgYWxpZ24taXRlbXM6IHN0cmV0Y2g7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbmA7XG5cbmNvbnN0IFN0eWxlZFZpc3VhbGl6YXRpb25JdGVtID0gc3R5bGVkLmRpdmBcbiAgZmxleDogMCAwIGF1dG87XG4gIHdpZHRoOiAyMDhweDtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgcGFkZGluZzogMTZweCA4cHg7XG4gIGNvbG9yOiAjM2E0MTRjO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgbGluZS1oZWlnaHQ6IDE4cHg7XG5cbiAgJjpob3ZlciB7XG4gICAgLnZpc19pdGVtLWljb24sXG4gICAgLnZpc19pdGVtLXRodW1iLFxuICAgIC52aXNfaXRlbS1kZXNjcmlwdGlvbixcbiAgICAudmlzX2l0ZW0tbW9kaWZpY2F0aW9uLWRhdGUge1xuICAgICAgb3BhY2l0eTogMTtcbiAgICB9XG4gIH1cblxuICAudmlzX2l0ZW0taWNvbixcbiAgLnZpc19pdGVtLXRodW1iLFxuICAudmlzX2l0ZW0tZGVzY3JpcHRpb24sXG4gIC52aXNfaXRlbS1tb2RpZmljYXRpb24tZGF0ZSB7XG4gICAgb3BhY2l0eTogMC45O1xuICAgIHRyYW5zaXRpb246IG9wYWNpdHkgMC40cyBlYXNlO1xuICB9XG5cbiAgLnZpc19pdGVtLWljb24ge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBmbGV4OiAwIDAgMTA4cHg7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzZhNzQ4NDtcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIH1cblxuICAudmlzX2l0ZW0tdGh1bWIge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBmbGV4OiAwIDAgMTA4cHg7XG4gICAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7XG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICB9XG5cbiAgLnZpc19pdGVtLXByaXZhY3kge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDA7XG4gICAgbGVmdDogMDtcbiAgICBwYWRkaW5nOiAzcHggNnB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDRweCAwO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoNTgsIDY1LCA3NiwgMC43KTtcbiAgICBjb2xvcjogI2ZmZjtcbiAgICBmb250LXNpemU6IDExcHg7XG4gICAgbGluZS1oZWlnaHQ6IDE4cHg7XG4gIH1cblxuICAudmlzX2l0ZW0tdGl0bGUge1xuICAgIG1hcmdpbi10b3A6IDE2cHg7XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gIH1cblxuICAudmlzX2l0ZW0tZGVzY3JpcHRpb24ge1xuICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgIG1hcmdpbi10b3A6IDhweDtcbiAgfVxuXG4gIC52aXNfaXRlbS1tb2RpZmljYXRpb24tZGF0ZSB7XG4gICAgbWFyZ2luLXRvcDogMTZweDtcbiAgICBmbGV4OiAxIDAgYXV0bztcbiAgICBjb2xvcjogIzZhNzQ4NDtcbiAgICBsaW5lLWhlaWdodDogMTVweDtcbiAgfVxuYDtcblxuY29uc3QgTWFwSWNvbiA9IHByb3BzID0+IHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHsuLi5wcm9wc30+XG4gICAgICB7cHJvcHMuY2hpbGRyZW59XG4gICAgICA8QmFzZSBoZWlnaHQ9XCIzMnB4XCIgdmlld0JveD17JzAgMCAxNiAxNid9PlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIGZpbGw9XCIjZDNkOGQ2XCJcbiAgICAgICAgICBkPVwibTEzLjYgMTEuNTcyLTMuMiAyLjEzMzZ2LTkuMjc3NmwzLjItMi4xMzM2em0tMTItNy4xNDQgMy4yLTIuMTMzNnY5LjI3NzZsLTMuMiAyLjEzMzZ6bTEzLjI0NCA4LjIzNzZjMC4yMjI0LTAuMTQ4IDAuMzU2LTAuMzk4NCAwLjM1Ni0wLjY2NTZ2LTExLjJjMC0wLjI5NTItMC4xNjI0LTAuNTY2NC0wLjQyMjQtMC43MDQ4LTAuMjYtMC4xNC0wLjU3Ni0wLjEyNDgtMC44MjE2IDAuMDM5MmwtNC4zMTI4IDIuODc2LTMuNTQzMi0yLjgzNTJjLTAuMTIwOC0wLjA5MzYtMC4yOTUyLTAuMTYyNC0wLjQ3Mi0wLjE2ODgtMC4xNjQ4LTAuMDA2NC0wLjM0OCAwLjA0NjQtMC40NzIgMC4xMjhsLTQuOCAzLjJjLTAuMjIyNCAwLjE0ODgtMC4zNTYgMC4zOTg0LTAuMzU2IDAuNjY1NnYxMS4yYzAgMC4yOTUyIDAuMTYyNCAwLjU2NjQgMC40MjI0IDAuNzA1NiAwLjExODQgMC4wNjMyIDAuMjQ4IDAuMDk0NCAwLjM3NzYgMC4wOTQ0IDAuMTU1MiAwIDAuMzA5Ni0wLjA0NDggMC40NDQtMC4xMzQ0bDQuMzEyOC0yLjg3NiAzLjU0MzIgMi44MzUyYzAuMTQ0OCAwLjExNiAwLjMyMTYgMC4xNzUyIDAuNSAwLjE3NTIgMC4xMTg0IDAgMC4yMzYtMC4wMjQ4IDAuMzQ2NC0wLjA3ODR6XCJcbiAgICAgICAgLz5cbiAgICAgIDwvQmFzZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmNvbnN0IFByaXZhY3lCYWRnZSA9ICh7cHJpdmF0ZU1hcH0pID0+IChcbiAgPHNwYW4gY2xhc3NOYW1lPVwidmlzX2l0ZW0tcHJpdmFjeVwiPntwcml2YXRlTWFwID8gJ1ByaXZhdGUnIDogJ1B1YmxpYyd9PC9zcGFuPlxuKTtcblxuY29uc3QgVmlzdWFsaXphdGlvbkl0ZW0gPSAoe3Zpcywgb25DbGlja30pID0+IHtcbiAgcmV0dXJuIChcbiAgICA8U3R5bGVkVmlzdWFsaXphdGlvbkl0ZW0gb25DbGljaz17b25DbGlja30+XG4gICAgICB7dmlzLnRodW1ibmFpbCA/IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ2aXNfaXRlbS10aHVtYlwiIHN0eWxlPXt7YmFja2dyb3VuZEltYWdlOiBgdXJsKCR7dmlzLnRodW1ibmFpbH0pYH19PlxuICAgICAgICAgIHt2aXMuaGFzT3duUHJvcGVydHkoJ3ByaXZhdGVNYXAnKSA/IDxQcml2YWN5QmFkZ2UgcHJpdmF0ZU1hcD17dmlzLnByaXZhdGVNYXB9IC8+IDogbnVsbH1cbiAgICAgICAgPC9kaXY+XG4gICAgICApIDogKFxuICAgICAgICA8TWFwSWNvbiBjbGFzc05hbWU9XCJ2aXNfaXRlbS1pY29uXCI+XG4gICAgICAgICAge3Zpcy5oYXNPd25Qcm9wZXJ0eSgncHJpdmF0ZU1hcCcpID8gPFByaXZhY3lCYWRnZSBwcml2YXRlTWFwPXt2aXMucHJpdmF0ZU1hcH0gLz4gOiBudWxsfVxuICAgICAgICA8L01hcEljb24+XG4gICAgICApfVxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidmlzX2l0ZW0tdGl0bGVcIj57dmlzLnRpdGxlfTwvc3Bhbj5cbiAgICAgIHt2aXMuZGVzY3JpcHRpb24gJiYgdmlzLmRlc2NyaXB0aW9uLmxlbmd0aCAmJiAoXG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInZpc19pdGVtLWRlc2NyaXB0aW9uXCI+e3Zpcy5kZXNjcmlwdGlvbn08L3NwYW4+XG4gICAgICApfVxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidmlzX2l0ZW0tbW9kaWZpY2F0aW9uLWRhdGVcIj5cbiAgICAgICAgTGFzdCBtb2RpZmllZCB7bW9tZW50LnV0Yyh2aXMubGFzdE1vZGlmaWNhdGlvbikuZnJvbU5vdygpfVxuICAgICAgPC9zcGFuPlxuICAgIDwvU3R5bGVkVmlzdWFsaXphdGlvbkl0ZW0+XG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgUHJvdmlkZXJTZWxlY3QgPSAoe1xuICBjbG91ZFByb3ZpZGVycyA9IFtdLFxuICBvblNlbGVjdCxcbiAgb25TZXRDbG91ZFByb3ZpZGVyLFxuICBjdXJyZW50UHJvdmlkZXJcbn0pID0+XG4gIGNsb3VkUHJvdmlkZXJzLmxlbmd0aCA/IChcbiAgICA8U3R5bGVkUHJvdmlkZXJTZWN0aW9uPlxuICAgICAge2Nsb3VkUHJvdmlkZXJzLm1hcChwcm92aWRlciA9PiAoXG4gICAgICAgIDxDbG91ZFRpbGVcbiAgICAgICAgICBrZXk9e3Byb3ZpZGVyLm5hbWV9XG4gICAgICAgICAgb25TZWxlY3Q9eygpID0+IG9uU2VsZWN0KHByb3ZpZGVyLm5hbWUpfVxuICAgICAgICAgIG9uU2V0Q2xvdWRQcm92aWRlcj17b25TZXRDbG91ZFByb3ZpZGVyfVxuICAgICAgICAgIGNsb3VkUHJvdmlkZXI9e3Byb3ZpZGVyfVxuICAgICAgICAgIGlzU2VsZWN0ZWQ9e3Byb3ZpZGVyLm5hbWUgPT09IGN1cnJlbnRQcm92aWRlcn1cbiAgICAgICAgICBpc0Nvbm5lY3RlZD17Qm9vbGVhbihwcm92aWRlci5nZXRBY2Nlc3NUb2tlbiAmJiBwcm92aWRlci5nZXRBY2Nlc3NUb2tlbigpKX1cbiAgICAgICAgLz5cbiAgICAgICkpfVxuICAgIDwvU3R5bGVkUHJvdmlkZXJTZWN0aW9uPlxuICApIDogKFxuICAgIDxwPk5vIHN0b3JhZ2UgcHJvdmlkZXIgYXZhaWxhYmxlPC9wPlxuICApO1xuXG5mdW5jdGlvbiBMb2FkU3RvcmFnZU1hcEZhY3RvcnkoKSB7XG4gIGNsYXNzIExvYWRTdG9yYWdlTWFwIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBzdGF0ZSA9IHtcbiAgICAgIHNob3dQcm92aWRlclNlbGVjdDogdHJ1ZVxuICAgIH07XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgIHRoaXMuX2dldFNhdmVkTWFwcygpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICAgIGlmIChwcmV2UHJvcHMuY3VycmVudFByb3ZpZGVyICE9PSB0aGlzLnByb3BzLmN1cnJlbnRQcm92aWRlcikge1xuICAgICAgICB0aGlzLl9nZXRTYXZlZE1hcHMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfZ2V0UHJvdmlkZXIgPSAoKSA9PiB7XG4gICAgICBjb25zdCB7Y3VycmVudFByb3ZpZGVyLCBjbG91ZFByb3ZpZGVyc30gPSB0aGlzLnByb3BzO1xuICAgICAgcmV0dXJuIChjbG91ZFByb3ZpZGVycyB8fCBbXSkuZmluZChwID0+IHAubmFtZSA9PT0gY3VycmVudFByb3ZpZGVyKTtcbiAgICB9O1xuXG4gICAgX2dldFNhdmVkTWFwcygpIHtcbiAgICAgIGNvbnN0IHByb3ZpZGVyID0gdGhpcy5fZ2V0UHJvdmlkZXIoKTtcbiAgICAgIGlmIChwcm92aWRlcikge1xuICAgICAgICB0aGlzLnByb3BzLmdldFNhdmVkTWFwcyhwcm92aWRlcik7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe3Nob3dQcm92aWRlclNlbGVjdDogZmFsc2V9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25Mb2FkQ2xvdWRNYXAocHJvdmlkZXIsIHZpcykge1xuICAgICAgdGhpcy5wcm9wcy5vbkxvYWRDbG91ZE1hcCh7XG4gICAgICAgIGxvYWRQYXJhbXM6IHZpcy5sb2FkUGFyYW1zLFxuICAgICAgICBwcm92aWRlclxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgX2NsaWNrQmFjayA9ICgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3Nob3dQcm92aWRlclNlbGVjdDogdHJ1ZX0pO1xuICAgIH07XG5cbiAgICBfc2VsZWN0UHJvdmlkZXIgPSBwcm92aWRlck5hbWUgPT4ge1xuICAgICAgdGhpcy5wcm9wcy5vblNldENsb3VkUHJvdmlkZXIocHJvdmlkZXJOYW1lKTtcbiAgICAgIGNvbnN0IHByb3ZpZGVyID0gKHRoaXMucHJvcHMuY2xvdWRQcm92aWRlcnMgfHwgW10pLmZpbmQocCA9PiBwLm5hbWUgPT09IHByb3ZpZGVyTmFtZSk7XG4gICAgICB0aGlzLnByb3BzLmdldFNhdmVkTWFwcyhwcm92aWRlcik7XG4gICAgICB0aGlzLnNldFN0YXRlKHtzaG93UHJvdmlkZXJTZWxlY3Q6IGZhbHNlfSk7XG4gICAgfTtcblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgdmlzdWFsaXphdGlvbnMsXG4gICAgICAgIGNsb3VkUHJvdmlkZXJzLFxuICAgICAgICBjdXJyZW50UHJvdmlkZXIsXG4gICAgICAgIGlzUHJvdmlkZXJMb2FkaW5nLFxuICAgICAgICBvblNldENsb3VkUHJvdmlkZXJcbiAgICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICBjb25zdCBwcm92aWRlciA9IHRoaXMuX2dldFByb3ZpZGVyKCk7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxQcm92aWRlck1vZGFsQ29udGFpbmVyXG4gICAgICAgICAgb25TZXRDbG91ZFByb3ZpZGVyPXtvblNldENsb3VkUHJvdmlkZXJ9XG4gICAgICAgICAgY2xvdWRQcm92aWRlcnM9e2Nsb3VkUHJvdmlkZXJzfVxuICAgICAgICAgIGN1cnJlbnRQcm92aWRlcj17Y3VycmVudFByb3ZpZGVyfVxuICAgICAgICA+XG4gICAgICAgICAge3RoaXMuc3RhdGUuc2hvd1Byb3ZpZGVyU2VsZWN0ID8gKFxuICAgICAgICAgICAgPFByb3ZpZGVyU2VsZWN0XG4gICAgICAgICAgICAgIG9uU2VsZWN0PXt0aGlzLl9zZWxlY3RQcm92aWRlcn1cbiAgICAgICAgICAgICAgY2xvdWRQcm92aWRlcnM9e2Nsb3VkUHJvdmlkZXJzfVxuICAgICAgICAgICAgICBvblNldENsb3VkUHJvdmlkZXI9e29uU2V0Q2xvdWRQcm92aWRlcn1cbiAgICAgICAgICAgICAgY3VycmVudFByb3ZpZGVyPXtjdXJyZW50UHJvdmlkZXJ9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8PlxuICAgICAgICAgICAgICB7aXNQcm92aWRlckxvYWRpbmcgJiYgKFxuICAgICAgICAgICAgICAgIDxTdHlsZWRTcGlubmVyPlxuICAgICAgICAgICAgICAgICAgPExvYWRpbmdEaWFsb2cgc2l6ZT17NjR9IC8+XG4gICAgICAgICAgICAgICAgPC9TdHlsZWRTcGlubmVyPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICB7IWlzUHJvdmlkZXJMb2FkaW5nICYmIHZpc3VhbGl6YXRpb25zICYmIChcbiAgICAgICAgICAgICAgICA8U3R5bGVkVmlzdWFsaXphdGlvblNlY3Rpb24+XG4gICAgICAgICAgICAgICAgICA8U3R5bGVkU3RvcmFnZUhlYWRlcj5cbiAgICAgICAgICAgICAgICAgICAgPFN0eWxlZEJhY2tCdG4+XG4gICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBsaW5rIG9uQ2xpY2s9e3RoaXMuX2NsaWNrQmFja30+XG4gICAgICAgICAgICAgICAgICAgICAgICA8QXJyb3dMZWZ0IGhlaWdodD1cIjE0cHhcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5sb2FkU3RvcmFnZU1hcC5iYWNrJ30gLz5cbiAgICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9TdHlsZWRCYWNrQnRuPlxuICAgICAgICAgICAgICAgICAgICB7cHJvdmlkZXIuZ2V0TWFuYWdlbWVudFVybCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleT17MX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGhyZWY9e3Byb3ZpZGVyLmdldE1hbmFnZW1lbnRVcmwoKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXG4gICAgICAgICAgICAgICAgICAgICAgICByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7dGV4dERlY29yYXRpb246ICd1bmRlcmxpbmUnfX1cbiAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICBpZD17J21vZGFsLmxvYWRTdG9yYWdlTWFwLmJhY2snfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM9e3tkaXNwbGF5TmFtZTogcHJvdmlkZXIuZGlzcGxheU5hbWV9fVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICA8L1N0eWxlZFN0b3JhZ2VIZWFkZXI+XG4gICAgICAgICAgICAgICAgICA8U3R5bGVkUHJvdmlkZXJWaXNTZWN0aW9uPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPntjdXJyZW50UHJvdmlkZXJ9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbW9kYWwubG9hZFN0b3JhZ2VNYXAuc3RvcmFnZU1hcHMnfSAvPlxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxTdHlsZWRTZXBhcmF0b3IgLz5cbiAgICAgICAgICAgICAgICAgICAgPFN0eWxlZFZpc3VhbGl6YXRpb25MaXN0PlxuICAgICAgICAgICAgICAgICAgICAgIHt2aXN1YWxpemF0aW9ucy5sZW5ndGggPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICB2aXN1YWxpemF0aW9ucy5tYXAodmlzID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPFZpc3VhbGl6YXRpb25JdGVtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXt2aXMuaWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5fb25Mb2FkQ2xvdWRNYXAocHJvdmlkZXIsIHZpcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzPXt2aXN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInZpc3VhbGl6YXRpb24tbGlzdF9fbWVzc2FnZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLmxvYWRTdG9yYWdlTWFwLm5vU2F2ZWRNYXBzJ30gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgIDwvU3R5bGVkVmlzdWFsaXphdGlvbkxpc3Q+XG4gICAgICAgICAgICAgICAgICA8L1N0eWxlZFByb3ZpZGVyVmlzU2VjdGlvbj5cbiAgICAgICAgICAgICAgICA8L1N0eWxlZFZpc3VhbGl6YXRpb25TZWN0aW9uPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9Qcm92aWRlck1vZGFsQ29udGFpbmVyPlxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIExvYWRTdG9yYWdlTWFwO1xufVxuXG5leHBvcnQgZGVmYXVsdCBMb2FkU3RvcmFnZU1hcEZhY3Rvcnk7XG4iXX0=