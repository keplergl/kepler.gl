"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ProviderSelect = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

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

var _reactIntl = require("react-intl");

function _templateObject9() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  flex: 0 0 auto;\n  width: 208px;\n  display: flex;\n  flex-direction: column;\n  padding: 16px 8px;\n  color: #3a414c;\n  cursor: pointer;\n  font-size: 12px;\n  line-height: 18px;\n\n  &:hover {\n    .vis_item-icon,\n    .vis_item-thumb,\n    .vis_item-description,\n    .vis_item-modification-date {\n      opacity: 1;\n    }\n  }\n\n  .vis_item-icon,\n  .vis_item-thumb,\n  .vis_item-description,\n  .vis_item-modification-date {\n    opacity: 0.9;\n    transition: opacity 0.4s ease;\n  }\n\n  .vis_item-icon {\n    position: relative;\n    flex: 0 0 108px;\n    background-color: #6a7484;\n    border-radius: 4px;\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    justify-content: center;\n  }\n\n  .vis_item-thumb {\n    position: relative;\n    flex: 0 0 108px;\n    background-size: cover;\n    background-position: center;\n    border-radius: 4px;\n  }\n\n  .vis_item-privacy {\n    position: absolute;\n    top: 0;\n    left: 0;\n    padding: 3px 6px;\n    border-radius: 4px 0;\n    background-color: rgba(58, 65, 76, 0.7);\n    color: #fff;\n    font-size: 11px;\n    line-height: 18px;\n  }\n\n  .vis_item-title {\n    margin-top: 16px;\n    font-weight: 500;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n  }\n\n  .vis_item-description {\n    flex: 1 1 auto;\n    margin-top: 8px;\n  }\n\n  .vis_item-modification-date {\n    margin-top: 16px;\n    flex: 1 0 auto;\n    color: #6a7484;\n    line-height: 15px;\n  }\n"]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-flow: row wrap;\n  align-items: stretch;\n  justify-content: space-between;\n"]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  border: solid #bfbfbf;\n  border-width: 0 0 1px 0;\n  margin-bottom: 16px;\n"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  flex: 1 1 auto;\n  background-color: #f8f8f9;\n  padding: 20px 24px;\n  min-height: 280px;\n\n  .title {\n    font-size: 14px;\n    line-height: 16px;\n    font-weight: 500;\n    margin-bottom: 16px;\n\n    span {\n      text-transform: capitalize;\n    }\n  }\n"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  margin-bottom: 16px;\n  color: #3a414c;\n  cursor: pointer;\n\n  &:hover {\n    font-weight: 500;\n  }\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 16px;\n  font-size: 12px;\n  line-height: 14px;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-direction: column;\n  align-items: stretch;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  text-align: center;\n  span {\n    margin: 0 auto;\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledProviderSection = _styledComponents["default"].div.attrs({
  className: 'provider-selection'
})(_templateObject());

var StyledSpinner = _styledComponents["default"].div(_templateObject2());

var StyledVisualizationSection = _styledComponents["default"].div(_templateObject3());

var StyledStorageHeader = _styledComponents["default"].div(_templateObject4());

var StyledBackBtn = _styledComponents["default"].a(_templateObject5());

var StyledProviderVisSection = _styledComponents["default"].div(_templateObject6());

var StyledSeparator = _styledComponents["default"].hr(_templateObject7());

var StyledVisualizationList = _styledComponents["default"].div(_templateObject8());

var StyledVisualizationItem = _styledComponents["default"].div(_templateObject9());

var MapIcon = function MapIcon(props) {
  return _react["default"].createElement("div", props, props.children, _react["default"].createElement(_icons.Base, {
    height: "32px",
    viewBox: '0 0 16 16'
  }, _react["default"].createElement("path", {
    fill: "#d3d8d6",
    d: "m13.6 11.572-3.2 2.1336v-9.2776l3.2-2.1336zm-12-7.144 3.2-2.1336v9.2776l-3.2 2.1336zm13.244 8.2376c0.2224-0.148 0.356-0.3984 0.356-0.6656v-11.2c0-0.2952-0.1624-0.5664-0.4224-0.7048-0.26-0.14-0.576-0.1248-0.8216 0.0392l-4.3128 2.876-3.5432-2.8352c-0.1208-0.0936-0.2952-0.1624-0.472-0.1688-0.1648-0.0064-0.348 0.0464-0.472 0.128l-4.8 3.2c-0.2224 0.1488-0.356 0.3984-0.356 0.6656v11.2c0 0.2952 0.1624 0.5664 0.4224 0.7056 0.1184 0.0632 0.248 0.0944 0.3776 0.0944 0.1552 0 0.3096-0.0448 0.444-0.1344l4.3128-2.876 3.5432 2.8352c0.1448 0.116 0.3216 0.1752 0.5 0.1752 0.1184 0 0.236-0.0248 0.3464-0.0784z"
  })));
};

var PrivacyBadge = function PrivacyBadge(_ref) {
  var privateMap = _ref.privateMap;
  return _react["default"].createElement("span", {
    className: "vis_item-privacy"
  }, privateMap ? 'Private' : 'Public');
};

var VisualizationItem = function VisualizationItem(_ref2) {
  var vis = _ref2.vis,
      onClick = _ref2.onClick;
  return _react["default"].createElement(StyledVisualizationItem, {
    onClick: onClick
  }, vis.thumbnail ? _react["default"].createElement("div", {
    className: "vis_item-thumb",
    style: {
      backgroundImage: "url(".concat(vis.thumbnail, ")")
    }
  }, vis.hasOwnProperty('privateMap') ? _react["default"].createElement(PrivacyBadge, {
    privateMap: vis.privateMap
  }) : null) : _react["default"].createElement(MapIcon, {
    className: "vis_item-icon"
  }, vis.hasOwnProperty('privateMap') ? _react["default"].createElement(PrivacyBadge, {
    privateMap: vis.privateMap
  }) : null), _react["default"].createElement("span", {
    className: "vis_item-title"
  }, vis.title), vis.description && vis.description.length && _react["default"].createElement("span", {
    className: "vis_item-description"
  }, vis.description), _react["default"].createElement("span", {
    className: "vis_item-modification-date"
  }, "Last modified ", _moment["default"].utc(vis.lastModification).fromNow()));
};

var ProviderSelect = function ProviderSelect(_ref3) {
  var _ref3$cloudProviders = _ref3.cloudProviders,
      cloudProviders = _ref3$cloudProviders === void 0 ? [] : _ref3$cloudProviders,
      _onSelect = _ref3.onSelect,
      onSetCloudProvider = _ref3.onSetCloudProvider,
      currentProvider = _ref3.currentProvider;
  return cloudProviders.length ? _react["default"].createElement(StyledProviderSection, null, cloudProviders.map(function (provider) {
    return _react["default"].createElement(_cloudTile["default"], {
      key: provider.name,
      onSelect: function onSelect() {
        return _onSelect(provider.name);
      },
      onSetCloudProvider: onSetCloudProvider,
      cloudProvider: provider,
      isSelected: provider.name === currentProvider,
      isConnected: Boolean(provider.getAccessToken && provider.getAccessToken())
    });
  })) : _react["default"].createElement("p", null, "No storage provider available");
};

exports.ProviderSelect = ProviderSelect;

function LoadStorageMapFactory() {
  var LoadStorageMap =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(LoadStorageMap, _Component);

    function LoadStorageMap() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2["default"])(this, LoadStorageMap);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(LoadStorageMap)).call.apply(_getPrototypeOf2, [this].concat(args)));
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

        return _react["default"].createElement(_providerModalContainer["default"], {
          onSetCloudProvider: onSetCloudProvider,
          cloudProviders: cloudProviders,
          currentProvider: currentProvider
        }, this.state.showProviderSelect ? _react["default"].createElement(ProviderSelect, {
          onSelect: this._selectProvider,
          cloudProviders: cloudProviders,
          onSetCloudProvider: onSetCloudProvider,
          currentProvider: currentProvider
        }) : _react["default"].createElement(_react["default"].Fragment, null, isProviderLoading && _react["default"].createElement(StyledSpinner, null, _react["default"].createElement(_loadingDialog["default"], {
          size: 64
        })), !isProviderLoading && visualizations && _react["default"].createElement(StyledVisualizationSection, null, _react["default"].createElement(StyledStorageHeader, null, _react["default"].createElement(StyledBackBtn, null, _react["default"].createElement(_styledComponents2.Button, {
          link: true,
          onClick: this._clickBack
        }, _react["default"].createElement(_icons.ArrowLeft, {
          height: "14px"
        }), _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.loadStorageMap.back'
        }))), provider.getManagementUrl && _react["default"].createElement("a", {
          key: 1,
          href: provider.getManagementUrl(),
          target: "_blank",
          rel: "noopener noreferrer",
          style: {
            textDecoration: 'underline'
          }
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.loadStorageMap.back',
          values: {
            displayName: provider.displayName
          }
        }))), _react["default"].createElement(StyledProviderVisSection, null, _react["default"].createElement("span", {
          className: "title"
        }, _react["default"].createElement("span", null, currentProvider), _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.loadStorageMap.storageMaps'
        })), _react["default"].createElement(StyledSeparator, null), _react["default"].createElement(StyledVisualizationList, null, visualizations.length ? visualizations.map(function (vis) {
          return _react["default"].createElement(VisualizationItem, {
            key: vis.id,
            onClick: function onClick() {
              return _this2._onLoadCloudMap(provider, vis);
            },
            vis: vis
          });
        }) : _react["default"].createElement("div", {
          className: "visualization-list__message"
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9sb2FkLXN0b3JhZ2UtbWFwLmpzIl0sIm5hbWVzIjpbIlN0eWxlZFByb3ZpZGVyU2VjdGlvbiIsInN0eWxlZCIsImRpdiIsImF0dHJzIiwiY2xhc3NOYW1lIiwiU3R5bGVkU3Bpbm5lciIsIlN0eWxlZFZpc3VhbGl6YXRpb25TZWN0aW9uIiwiU3R5bGVkU3RvcmFnZUhlYWRlciIsIlN0eWxlZEJhY2tCdG4iLCJhIiwiU3R5bGVkUHJvdmlkZXJWaXNTZWN0aW9uIiwiU3R5bGVkU2VwYXJhdG9yIiwiaHIiLCJTdHlsZWRWaXN1YWxpemF0aW9uTGlzdCIsIlN0eWxlZFZpc3VhbGl6YXRpb25JdGVtIiwiTWFwSWNvbiIsInByb3BzIiwiY2hpbGRyZW4iLCJQcml2YWN5QmFkZ2UiLCJwcml2YXRlTWFwIiwiVmlzdWFsaXphdGlvbkl0ZW0iLCJ2aXMiLCJvbkNsaWNrIiwidGh1bWJuYWlsIiwiYmFja2dyb3VuZEltYWdlIiwiaGFzT3duUHJvcGVydHkiLCJ0aXRsZSIsImRlc2NyaXB0aW9uIiwibGVuZ3RoIiwibW9tZW50IiwidXRjIiwibGFzdE1vZGlmaWNhdGlvbiIsImZyb21Ob3ciLCJQcm92aWRlclNlbGVjdCIsImNsb3VkUHJvdmlkZXJzIiwib25TZWxlY3QiLCJvblNldENsb3VkUHJvdmlkZXIiLCJjdXJyZW50UHJvdmlkZXIiLCJtYXAiLCJwcm92aWRlciIsIm5hbWUiLCJCb29sZWFuIiwiZ2V0QWNjZXNzVG9rZW4iLCJMb2FkU3RvcmFnZU1hcEZhY3RvcnkiLCJMb2FkU3RvcmFnZU1hcCIsInNob3dQcm92aWRlclNlbGVjdCIsImZpbmQiLCJwIiwic2V0U3RhdGUiLCJwcm92aWRlck5hbWUiLCJnZXRTYXZlZE1hcHMiLCJfZ2V0U2F2ZWRNYXBzIiwicHJldlByb3BzIiwiX2dldFByb3ZpZGVyIiwib25Mb2FkQ2xvdWRNYXAiLCJsb2FkUGFyYW1zIiwidmlzdWFsaXphdGlvbnMiLCJpc1Byb3ZpZGVyTG9hZGluZyIsInN0YXRlIiwiX3NlbGVjdFByb3ZpZGVyIiwiX2NsaWNrQmFjayIsImdldE1hbmFnZW1lbnRVcmwiLCJ0ZXh0RGVjb3JhdGlvbiIsImRpc3BsYXlOYW1lIiwiaWQiLCJfb25Mb2FkQ2xvdWRNYXAiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxxQkFBcUIsR0FBR0MsNkJBQU9DLEdBQVAsQ0FBV0MsS0FBWCxDQUFpQjtBQUM3Q0MsRUFBQUEsU0FBUyxFQUFFO0FBRGtDLENBQWpCLENBQUgsbUJBQTNCOztBQU1BLElBQU1DLGFBQWEsR0FBR0osNkJBQU9DLEdBQVYsb0JBQW5COztBQU9BLElBQU1JLDBCQUEwQixHQUFHTCw2QkFBT0MsR0FBVixvQkFBaEM7O0FBTUEsSUFBTUssbUJBQW1CLEdBQUdOLDZCQUFPQyxHQUFWLG9CQUF6Qjs7QUFVQSxJQUFNTSxhQUFhLEdBQUdQLDZCQUFPUSxDQUFWLG9CQUFuQjs7QUFVQSxJQUFNQyx3QkFBd0IsR0FBR1QsNkJBQU9DLEdBQVYsb0JBQTlCOztBQWtCQSxJQUFNUyxlQUFlLEdBQUdWLDZCQUFPVyxFQUFWLG9CQUFyQjs7QUFNQSxJQUFNQyx1QkFBdUIsR0FBR1osNkJBQU9DLEdBQVYsb0JBQTdCOztBQU9BLElBQU1ZLHVCQUF1QixHQUFHYiw2QkFBT0MsR0FBVixvQkFBN0I7O0FBZ0ZBLElBQU1hLE9BQU8sR0FBRyxTQUFWQSxPQUFVLENBQUFDLEtBQUssRUFBSTtBQUN2QixTQUNFLHVDQUFTQSxLQUFULEVBQ0dBLEtBQUssQ0FBQ0MsUUFEVCxFQUVFLGdDQUFDLFdBQUQ7QUFBTSxJQUFBLE1BQU0sRUFBQyxNQUFi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cEIsZ0NBQUMsaUJBQUQ7QUFDRSxZQUFBLEdBQUcsRUFBRUEsR0FBRyxDQUFDMkMsRUFEWDtBQUVFLFlBQUEsT0FBTyxFQUFFO0FBQUEscUJBQU0sTUFBSSxDQUFDQyxlQUFMLENBQXFCMUIsUUFBckIsRUFBK0JsQixHQUEvQixDQUFOO0FBQUEsYUFGWDtBQUdFLFlBQUEsR0FBRyxFQUFFQTtBQUhQLFlBRG9CO0FBQUEsU0FBdEIsQ0FERCxHQVNDO0FBQUssVUFBQSxTQUFTLEVBQUM7QUFBZixXQUNFLGdDQUFDLDJCQUFEO0FBQWtCLFVBQUEsRUFBRSxFQUFFO0FBQXRCLFVBREYsQ0FWSixDQU5GLENBdkJGLENBUEosQ0FiSixDQURGO0FBd0VEO0FBbEk0QjtBQUFBO0FBQUEsSUFDRjZDLGdCQURFOztBQW9JL0IsU0FBT3RCLGNBQVA7QUFDRDs7ZUFFY0QscUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuXG5pbXBvcnQgTG9hZGluZ0RpYWxvZyBmcm9tICcuL2xvYWRpbmctZGlhbG9nJztcbmltcG9ydCB7QnV0dG9ufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgQ2xvdWRUaWxlIGZyb20gJy4vY2xvdWQtdGlsZSc7XG5pbXBvcnQge0Jhc2UsIEFycm93TGVmdH0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IFByb3ZpZGVyTW9kYWxDb250YWluZXIgZnJvbSAnLi9wcm92aWRlci1tb2RhbC1jb250YWluZXInO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdyZWFjdC1pbnRsJztcblxuY29uc3QgU3R5bGVkUHJvdmlkZXJTZWN0aW9uID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ3Byb3ZpZGVyLXNlbGVjdGlvbidcbn0pYFxuICBkaXNwbGF5OiBmbGV4O1xuYDtcblxuY29uc3QgU3R5bGVkU3Bpbm5lciA9IHN0eWxlZC5kaXZgXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgc3BhbiB7XG4gICAgbWFyZ2luOiAwIGF1dG87XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZFZpc3VhbGl6YXRpb25TZWN0aW9uID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IHN0cmV0Y2g7XG5gO1xuXG5jb25zdCBTdHlsZWRTdG9yYWdlSGVhZGVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBtYXJnaW4tYm90dG9tOiAxNnB4O1xuICBmb250LXNpemU6IDEycHg7XG4gIGxpbmUtaGVpZ2h0OiAxNHB4O1xuYDtcblxuY29uc3QgU3R5bGVkQmFja0J0biA9IHN0eWxlZC5hYFxuICBtYXJnaW4tYm90dG9tOiAxNnB4O1xuICBjb2xvcjogIzNhNDE0YztcbiAgY3Vyc29yOiBwb2ludGVyO1xuXG4gICY6aG92ZXIge1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZFByb3ZpZGVyVmlzU2VjdGlvbiA9IHN0eWxlZC5kaXZgXG4gIGZsZXg6IDEgMSBhdXRvO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjhmOGY5O1xuICBwYWRkaW5nOiAyMHB4IDI0cHg7XG4gIG1pbi1oZWlnaHQ6IDI4MHB4O1xuXG4gIC50aXRsZSB7XG4gICAgZm9udC1zaXplOiAxNHB4O1xuICAgIGxpbmUtaGVpZ2h0OiAxNnB4O1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgbWFyZ2luLWJvdHRvbTogMTZweDtcblxuICAgIHNwYW4ge1xuICAgICAgdGV4dC10cmFuc2Zvcm06IGNhcGl0YWxpemU7XG4gICAgfVxuICB9XG5gO1xuXG5jb25zdCBTdHlsZWRTZXBhcmF0b3IgPSBzdHlsZWQuaHJgXG4gIGJvcmRlcjogc29saWQgI2JmYmZiZjtcbiAgYm9yZGVyLXdpZHRoOiAwIDAgMXB4IDA7XG4gIG1hcmdpbi1ib3R0b206IDE2cHg7XG5gO1xuXG5jb25zdCBTdHlsZWRWaXN1YWxpemF0aW9uTGlzdCA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZmxvdzogcm93IHdyYXA7XG4gIGFsaWduLWl0ZW1zOiBzdHJldGNoO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG5gO1xuXG5jb25zdCBTdHlsZWRWaXN1YWxpemF0aW9uSXRlbSA9IHN0eWxlZC5kaXZgXG4gIGZsZXg6IDAgMCBhdXRvO1xuICB3aWR0aDogMjA4cHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIHBhZGRpbmc6IDE2cHggOHB4O1xuICBjb2xvcjogIzNhNDE0YztcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBmb250LXNpemU6IDEycHg7XG4gIGxpbmUtaGVpZ2h0OiAxOHB4O1xuXG4gICY6aG92ZXIge1xuICAgIC52aXNfaXRlbS1pY29uLFxuICAgIC52aXNfaXRlbS10aHVtYixcbiAgICAudmlzX2l0ZW0tZGVzY3JpcHRpb24sXG4gICAgLnZpc19pdGVtLW1vZGlmaWNhdGlvbi1kYXRlIHtcbiAgICAgIG9wYWNpdHk6IDE7XG4gICAgfVxuICB9XG5cbiAgLnZpc19pdGVtLWljb24sXG4gIC52aXNfaXRlbS10aHVtYixcbiAgLnZpc19pdGVtLWRlc2NyaXB0aW9uLFxuICAudmlzX2l0ZW0tbW9kaWZpY2F0aW9uLWRhdGUge1xuICAgIG9wYWNpdHk6IDAuOTtcbiAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuNHMgZWFzZTtcbiAgfVxuXG4gIC52aXNfaXRlbS1pY29uIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgZmxleDogMCAwIDEwOHB4O1xuICAgIGJhY2tncm91bmQtY29sb3I6ICM2YTc0ODQ7XG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICB9XG5cbiAgLnZpc19pdGVtLXRodW1iIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgZmxleDogMCAwIDEwOHB4O1xuICAgIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gICAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyO1xuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgfVxuXG4gIC52aXNfaXRlbS1wcml2YWN5IHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiAwO1xuICAgIGxlZnQ6IDA7XG4gICAgcGFkZGluZzogM3B4IDZweDtcbiAgICBib3JkZXItcmFkaXVzOiA0cHggMDtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDU4LCA2NSwgNzYsIDAuNyk7XG4gICAgY29sb3I6ICNmZmY7XG4gICAgZm9udC1zaXplOiAxMXB4O1xuICAgIGxpbmUtaGVpZ2h0OiAxOHB4O1xuICB9XG5cbiAgLnZpc19pdGVtLXRpdGxlIHtcbiAgICBtYXJnaW4tdG9wOiAxNnB4O1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICB9XG5cbiAgLnZpc19pdGVtLWRlc2NyaXB0aW9uIHtcbiAgICBmbGV4OiAxIDEgYXV0bztcbiAgICBtYXJnaW4tdG9wOiA4cHg7XG4gIH1cblxuICAudmlzX2l0ZW0tbW9kaWZpY2F0aW9uLWRhdGUge1xuICAgIG1hcmdpbi10b3A6IDE2cHg7XG4gICAgZmxleDogMSAwIGF1dG87XG4gICAgY29sb3I6ICM2YTc0ODQ7XG4gICAgbGluZS1oZWlnaHQ6IDE1cHg7XG4gIH1cbmA7XG5cbmNvbnN0IE1hcEljb24gPSBwcm9wcyA9PiB7XG4gIHJldHVybiAoXG4gICAgPGRpdiB7Li4ucHJvcHN9PlxuICAgICAge3Byb3BzLmNoaWxkcmVufVxuICAgICAgPEJhc2UgaGVpZ2h0PVwiMzJweFwiIHZpZXdCb3g9eycwIDAgMTYgMTYnfT5cbiAgICAgICAgPHBhdGhcbiAgICAgICAgICBmaWxsPVwiI2QzZDhkNlwiXG4gICAgICAgICAgZD1cIm0xMy42IDExLjU3Mi0zLjIgMi4xMzM2di05LjI3NzZsMy4yLTIuMTMzNnptLTEyLTcuMTQ0IDMuMi0yLjEzMzZ2OS4yNzc2bC0zLjIgMi4xMzM2em0xMy4yNDQgOC4yMzc2YzAuMjIyNC0wLjE0OCAwLjM1Ni0wLjM5ODQgMC4zNTYtMC42NjU2di0xMS4yYzAtMC4yOTUyLTAuMTYyNC0wLjU2NjQtMC40MjI0LTAuNzA0OC0wLjI2LTAuMTQtMC41NzYtMC4xMjQ4LTAuODIxNiAwLjAzOTJsLTQuMzEyOCAyLjg3Ni0zLjU0MzItMi44MzUyYy0wLjEyMDgtMC4wOTM2LTAuMjk1Mi0wLjE2MjQtMC40NzItMC4xNjg4LTAuMTY0OC0wLjAwNjQtMC4zNDggMC4wNDY0LTAuNDcyIDAuMTI4bC00LjggMy4yYy0wLjIyMjQgMC4xNDg4LTAuMzU2IDAuMzk4NC0wLjM1NiAwLjY2NTZ2MTEuMmMwIDAuMjk1MiAwLjE2MjQgMC41NjY0IDAuNDIyNCAwLjcwNTYgMC4xMTg0IDAuMDYzMiAwLjI0OCAwLjA5NDQgMC4zNzc2IDAuMDk0NCAwLjE1NTIgMCAwLjMwOTYtMC4wNDQ4IDAuNDQ0LTAuMTM0NGw0LjMxMjgtMi44NzYgMy41NDMyIDIuODM1MmMwLjE0NDggMC4xMTYgMC4zMjE2IDAuMTc1MiAwLjUgMC4xNzUyIDAuMTE4NCAwIDAuMjM2LTAuMDI0OCAwLjM0NjQtMC4wNzg0elwiXG4gICAgICAgIC8+XG4gICAgICA8L0Jhc2U+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5jb25zdCBQcml2YWN5QmFkZ2UgPSAoe3ByaXZhdGVNYXB9KSA9PiAoXG4gIDxzcGFuIGNsYXNzTmFtZT1cInZpc19pdGVtLXByaXZhY3lcIj57cHJpdmF0ZU1hcCA/ICdQcml2YXRlJyA6ICdQdWJsaWMnfTwvc3Bhbj5cbik7XG5cbmNvbnN0IFZpc3VhbGl6YXRpb25JdGVtID0gKHt2aXMsIG9uQ2xpY2t9KSA9PiB7XG4gIHJldHVybiAoXG4gICAgPFN0eWxlZFZpc3VhbGl6YXRpb25JdGVtIG9uQ2xpY2s9e29uQ2xpY2t9PlxuICAgICAge3Zpcy50aHVtYm5haWwgPyAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidmlzX2l0ZW0tdGh1bWJcIiBzdHlsZT17e2JhY2tncm91bmRJbWFnZTogYHVybCgke3Zpcy50aHVtYm5haWx9KWB9fT5cbiAgICAgICAgICB7dmlzLmhhc093blByb3BlcnR5KCdwcml2YXRlTWFwJykgPyA8UHJpdmFjeUJhZGdlIHByaXZhdGVNYXA9e3Zpcy5wcml2YXRlTWFwfSAvPiA6IG51bGx9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSA6IChcbiAgICAgICAgPE1hcEljb24gY2xhc3NOYW1lPVwidmlzX2l0ZW0taWNvblwiPlxuICAgICAgICAgIHt2aXMuaGFzT3duUHJvcGVydHkoJ3ByaXZhdGVNYXAnKSA/IDxQcml2YWN5QmFkZ2UgcHJpdmF0ZU1hcD17dmlzLnByaXZhdGVNYXB9IC8+IDogbnVsbH1cbiAgICAgICAgPC9NYXBJY29uPlxuICAgICAgKX1cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInZpc19pdGVtLXRpdGxlXCI+e3Zpcy50aXRsZX08L3NwYW4+XG4gICAgICB7dmlzLmRlc2NyaXB0aW9uICYmIHZpcy5kZXNjcmlwdGlvbi5sZW5ndGggJiYgKFxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ2aXNfaXRlbS1kZXNjcmlwdGlvblwiPnt2aXMuZGVzY3JpcHRpb259PC9zcGFuPlxuICAgICAgKX1cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInZpc19pdGVtLW1vZGlmaWNhdGlvbi1kYXRlXCI+XG4gICAgICAgIExhc3QgbW9kaWZpZWQge21vbWVudC51dGModmlzLmxhc3RNb2RpZmljYXRpb24pLmZyb21Ob3coKX1cbiAgICAgIDwvc3Bhbj5cbiAgICA8L1N0eWxlZFZpc3VhbGl6YXRpb25JdGVtPlxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IFByb3ZpZGVyU2VsZWN0ID0gKHtcbiAgY2xvdWRQcm92aWRlcnMgPSBbXSxcbiAgb25TZWxlY3QsXG4gIG9uU2V0Q2xvdWRQcm92aWRlcixcbiAgY3VycmVudFByb3ZpZGVyXG59KSA9PlxuICBjbG91ZFByb3ZpZGVycy5sZW5ndGggPyAoXG4gICAgPFN0eWxlZFByb3ZpZGVyU2VjdGlvbj5cbiAgICAgIHtjbG91ZFByb3ZpZGVycy5tYXAocHJvdmlkZXIgPT4gKFxuICAgICAgICA8Q2xvdWRUaWxlXG4gICAgICAgICAga2V5PXtwcm92aWRlci5uYW1lfVxuICAgICAgICAgIG9uU2VsZWN0PXsoKSA9PiBvblNlbGVjdChwcm92aWRlci5uYW1lKX1cbiAgICAgICAgICBvblNldENsb3VkUHJvdmlkZXI9e29uU2V0Q2xvdWRQcm92aWRlcn1cbiAgICAgICAgICBjbG91ZFByb3ZpZGVyPXtwcm92aWRlcn1cbiAgICAgICAgICBpc1NlbGVjdGVkPXtwcm92aWRlci5uYW1lID09PSBjdXJyZW50UHJvdmlkZXJ9XG4gICAgICAgICAgaXNDb25uZWN0ZWQ9e0Jvb2xlYW4ocHJvdmlkZXIuZ2V0QWNjZXNzVG9rZW4gJiYgcHJvdmlkZXIuZ2V0QWNjZXNzVG9rZW4oKSl9XG4gICAgICAgIC8+XG4gICAgICApKX1cbiAgICA8L1N0eWxlZFByb3ZpZGVyU2VjdGlvbj5cbiAgKSA6IChcbiAgICA8cD5ObyBzdG9yYWdlIHByb3ZpZGVyIGF2YWlsYWJsZTwvcD5cbiAgKTtcblxuZnVuY3Rpb24gTG9hZFN0b3JhZ2VNYXBGYWN0b3J5KCkge1xuICBjbGFzcyBMb2FkU3RvcmFnZU1hcCBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgc3RhdGUgPSB7XG4gICAgICBzaG93UHJvdmlkZXJTZWxlY3Q6IHRydWVcbiAgICB9O1xuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICB0aGlzLl9nZXRTYXZlZE1hcHMoKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzKSB7XG4gICAgICBpZiAocHJldlByb3BzLmN1cnJlbnRQcm92aWRlciAhPT0gdGhpcy5wcm9wcy5jdXJyZW50UHJvdmlkZXIpIHtcbiAgICAgICAgdGhpcy5fZ2V0U2F2ZWRNYXBzKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2dldFByb3ZpZGVyID0gKCkgPT4ge1xuICAgICAgY29uc3Qge2N1cnJlbnRQcm92aWRlciwgY2xvdWRQcm92aWRlcnN9ID0gdGhpcy5wcm9wcztcbiAgICAgIHJldHVybiAoY2xvdWRQcm92aWRlcnMgfHwgW10pLmZpbmQocCA9PiBwLm5hbWUgPT09IGN1cnJlbnRQcm92aWRlcik7XG4gICAgfTtcblxuICAgIF9nZXRTYXZlZE1hcHMoKSB7XG4gICAgICBjb25zdCBwcm92aWRlciA9IHRoaXMuX2dldFByb3ZpZGVyKCk7XG4gICAgICBpZiAocHJvdmlkZXIpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5nZXRTYXZlZE1hcHMocHJvdmlkZXIpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtzaG93UHJvdmlkZXJTZWxlY3Q6IGZhbHNlfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uTG9hZENsb3VkTWFwKHByb3ZpZGVyLCB2aXMpIHtcbiAgICAgIHRoaXMucHJvcHMub25Mb2FkQ2xvdWRNYXAoe1xuICAgICAgICBsb2FkUGFyYW1zOiB2aXMubG9hZFBhcmFtcyxcbiAgICAgICAgcHJvdmlkZXJcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIF9jbGlja0JhY2sgPSAoKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtzaG93UHJvdmlkZXJTZWxlY3Q6IHRydWV9KTtcbiAgICB9O1xuXG4gICAgX3NlbGVjdFByb3ZpZGVyID0gcHJvdmlkZXJOYW1lID0+IHtcbiAgICAgIHRoaXMucHJvcHMub25TZXRDbG91ZFByb3ZpZGVyKHByb3ZpZGVyTmFtZSk7XG4gICAgICBjb25zdCBwcm92aWRlciA9ICh0aGlzLnByb3BzLmNsb3VkUHJvdmlkZXJzIHx8IFtdKS5maW5kKHAgPT4gcC5uYW1lID09PSBwcm92aWRlck5hbWUpO1xuICAgICAgdGhpcy5wcm9wcy5nZXRTYXZlZE1hcHMocHJvdmlkZXIpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7c2hvd1Byb3ZpZGVyU2VsZWN0OiBmYWxzZX0pO1xuICAgIH07XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIHZpc3VhbGl6YXRpb25zLFxuICAgICAgICBjbG91ZFByb3ZpZGVycyxcbiAgICAgICAgY3VycmVudFByb3ZpZGVyLFxuICAgICAgICBpc1Byb3ZpZGVyTG9hZGluZyxcbiAgICAgICAgb25TZXRDbG91ZFByb3ZpZGVyXG4gICAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgY29uc3QgcHJvdmlkZXIgPSB0aGlzLl9nZXRQcm92aWRlcigpO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8UHJvdmlkZXJNb2RhbENvbnRhaW5lclxuICAgICAgICAgIG9uU2V0Q2xvdWRQcm92aWRlcj17b25TZXRDbG91ZFByb3ZpZGVyfVxuICAgICAgICAgIGNsb3VkUHJvdmlkZXJzPXtjbG91ZFByb3ZpZGVyc31cbiAgICAgICAgICBjdXJyZW50UHJvdmlkZXI9e2N1cnJlbnRQcm92aWRlcn1cbiAgICAgICAgPlxuICAgICAgICAgIHt0aGlzLnN0YXRlLnNob3dQcm92aWRlclNlbGVjdCA/IChcbiAgICAgICAgICAgIDxQcm92aWRlclNlbGVjdFxuICAgICAgICAgICAgICBvblNlbGVjdD17dGhpcy5fc2VsZWN0UHJvdmlkZXJ9XG4gICAgICAgICAgICAgIGNsb3VkUHJvdmlkZXJzPXtjbG91ZFByb3ZpZGVyc31cbiAgICAgICAgICAgICAgb25TZXRDbG91ZFByb3ZpZGVyPXtvblNldENsb3VkUHJvdmlkZXJ9XG4gICAgICAgICAgICAgIGN1cnJlbnRQcm92aWRlcj17Y3VycmVudFByb3ZpZGVyfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAge2lzUHJvdmlkZXJMb2FkaW5nICYmIChcbiAgICAgICAgICAgICAgICA8U3R5bGVkU3Bpbm5lcj5cbiAgICAgICAgICAgICAgICAgIDxMb2FkaW5nRGlhbG9nIHNpemU9ezY0fSAvPlxuICAgICAgICAgICAgICAgIDwvU3R5bGVkU3Bpbm5lcj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgeyFpc1Byb3ZpZGVyTG9hZGluZyAmJiB2aXN1YWxpemF0aW9ucyAmJiAoXG4gICAgICAgICAgICAgICAgPFN0eWxlZFZpc3VhbGl6YXRpb25TZWN0aW9uPlxuICAgICAgICAgICAgICAgICAgPFN0eWxlZFN0b3JhZ2VIZWFkZXI+XG4gICAgICAgICAgICAgICAgICAgIDxTdHlsZWRCYWNrQnRuPlxuICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gbGluayBvbkNsaWNrPXt0aGlzLl9jbGlja0JhY2t9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPEFycm93TGVmdCBoZWlnaHQ9XCIxNHB4XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbW9kYWwubG9hZFN0b3JhZ2VNYXAuYmFjayd9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDwvU3R5bGVkQmFja0J0bj5cbiAgICAgICAgICAgICAgICAgICAge3Byb3ZpZGVyLmdldE1hbmFnZW1lbnRVcmwgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk9ezF9XG4gICAgICAgICAgICAgICAgICAgICAgICBocmVmPXtwcm92aWRlci5nZXRNYW5hZ2VtZW50VXJsKCl9XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e3RleHREZWNvcmF0aW9uOiAndW5kZXJsaW5lJ319XG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9eydtb2RhbC5sb2FkU3RvcmFnZU1hcC5iYWNrJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzPXt7ZGlzcGxheU5hbWU6IHByb3ZpZGVyLmRpc3BsYXlOYW1lfX1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgPC9TdHlsZWRTdG9yYWdlSGVhZGVyPlxuICAgICAgICAgICAgICAgICAgPFN0eWxlZFByb3ZpZGVyVmlzU2VjdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57Y3VycmVudFByb3ZpZGVyfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLmxvYWRTdG9yYWdlTWFwLnN0b3JhZ2VNYXBzJ30gLz5cbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8U3R5bGVkU2VwYXJhdG9yIC8+XG4gICAgICAgICAgICAgICAgICAgIDxTdHlsZWRWaXN1YWxpemF0aW9uTGlzdD5cbiAgICAgICAgICAgICAgICAgICAgICB7dmlzdWFsaXphdGlvbnMubGVuZ3RoID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgdmlzdWFsaXphdGlvbnMubWFwKHZpcyA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxWaXN1YWxpemF0aW9uSXRlbVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17dmlzLmlkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMuX29uTG9hZENsb3VkTWFwKHByb3ZpZGVyLCB2aXMpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpcz17dmlzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ2aXN1YWxpemF0aW9uLWxpc3RfX21lc3NhZ2VcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5sb2FkU3RvcmFnZU1hcC5ub1NhdmVkTWFwcyd9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICA8L1N0eWxlZFZpc3VhbGl6YXRpb25MaXN0PlxuICAgICAgICAgICAgICAgICAgPC9TdHlsZWRQcm92aWRlclZpc1NlY3Rpb24+XG4gICAgICAgICAgICAgICAgPC9TdHlsZWRWaXN1YWxpemF0aW9uU2VjdGlvbj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvUHJvdmlkZXJNb2RhbENvbnRhaW5lcj5cbiAgICAgICk7XG4gICAgfVxuICB9XG4gIHJldHVybiBMb2FkU3RvcmFnZU1hcDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9hZFN0b3JhZ2VNYXBGYWN0b3J5O1xuIl19