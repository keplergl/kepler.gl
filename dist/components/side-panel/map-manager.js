"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = require("../common/styled-components");

var _mapStyleSelector = _interopRequireDefault(require("./map-style-panel/map-style-selector"));

var _mapLayerSelector = _interopRequireDefault(require("./map-style-panel/map-layer-selector"));

var _icons = require("../common/icons");

var _colorSelector = _interopRequireDefault(require("./layer-panel/color-selector"));

var _reselect = require("reselect");

var _reactIntl = require("react-intl");

var _localization = require("../../localization");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

MapManagerFactory.deps = [_mapStyleSelector["default"], _mapLayerSelector["default"]];

function MapManagerFactory(MapStyleSelector, LayerGroupSelector) {
  var MapManager = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(MapManager, _Component);

    var _super = _createSuper(MapManager);

    function MapManager() {
      var _this;

      (0, _classCallCheck2["default"])(this, MapManager);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
        isSelecting: false
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "buildingColorSelector", function (props) {
        return props.mapStyle.threeDBuildingColor;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "setColorSelector", function (props) {
        return props.mapStyleActions.set3dBuildingColor;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_toggleSelecting", function () {
        _this.setState({
          isSelecting: !_this.state.isSelecting
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_selectStyle", function (val) {
        var mapStyleActions = _this.props.mapStyleActions;
        var mapStyleChange = mapStyleActions.mapStyleChange;
        mapStyleChange(val);

        _this._toggleSelecting();
      });
      return _this;
    }

    (0, _createClass2["default"])(MapManager, [{
      key: "render",
      value: function render() {
        var _this$props = this.props,
            mapStyle = _this$props.mapStyle,
            intl = _this$props.intl,
            mapStyleActions = _this$props.mapStyleActions,
            showAddMapStyleModal = _this$props.showAddMapStyleModal;
        var currentStyle = mapStyle.mapStyles[mapStyle.styleType] || {};
        var editableLayers = (currentStyle.layerGroups || []).map(function (lg) {
          return lg.slug;
        });
        var hasBuildingLayer = mapStyle.visibleLayerGroups['3d building'];
        var colorSetSelector = (0, _reselect.createSelector)(this.buildingColorSelector, this.setColorSelector, function (selectedColor, setColor) {
          return [{
            selectedColor: selectedColor,
            setColor: setColor,
            isRange: false,
            label: intl.formatMessage({
              id: 'mapManager.3dBuildingColor'
            })
          }];
        });
        var colorSets = colorSetSelector(this.props);
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: "map-style-panel"
        }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(MapStyleSelector, {
          mapStyle: mapStyle,
          isSelecting: this.state.isSelecting,
          onChange: this._selectStyle,
          toggleActive: this._toggleSelecting
        }), editableLayers.length ? /*#__PURE__*/_react["default"].createElement(LayerGroupSelector, {
          layers: mapStyle.visibleLayerGroups,
          editableLayers: editableLayers,
          topLayers: mapStyle.topLayerGroups,
          onChange: mapStyleActions.mapConfigChange
        }) : null, /*#__PURE__*/_react["default"].createElement(_styledComponents.SidePanelSection, null, /*#__PURE__*/_react["default"].createElement(_colorSelector["default"], {
          colorSets: colorSets,
          disabled: !hasBuildingLayer
        })), /*#__PURE__*/_react["default"].createElement(_styledComponents.Button, {
          className: "add-map-style-button",
          onClick: showAddMapStyleModal,
          secondary: true
        }, /*#__PURE__*/_react["default"].createElement(_icons.Add, {
          height: "12px"
        }), /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
          id: 'mapManager.addMapStyle'
        }))));
      }
    }]);
    return MapManager;
  }(_react.Component);

  (0, _defineProperty2["default"])(MapManager, "propTypes", {
    mapStyle: _propTypes["default"].object.isRequired,
    mapStyleActions: _propTypes["default"].object.isRequired,
    showAddMapStyleModal: _propTypes["default"].func.isRequired
  });
  return (0, _reactIntl.injectIntl)(MapManager);
}

var _default = MapManagerFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbWFwLW1hbmFnZXIuanMiXSwibmFtZXMiOlsiTWFwTWFuYWdlckZhY3RvcnkiLCJkZXBzIiwiTWFwU3R5bGVTZWxlY3RvckZhY3RvcnkiLCJMYXllckdyb3VwU2VsZWN0b3JGYWN0b3J5IiwiTWFwU3R5bGVTZWxlY3RvciIsIkxheWVyR3JvdXBTZWxlY3RvciIsIk1hcE1hbmFnZXIiLCJpc1NlbGVjdGluZyIsInByb3BzIiwibWFwU3R5bGUiLCJ0aHJlZURCdWlsZGluZ0NvbG9yIiwibWFwU3R5bGVBY3Rpb25zIiwic2V0M2RCdWlsZGluZ0NvbG9yIiwic2V0U3RhdGUiLCJzdGF0ZSIsInZhbCIsIm1hcFN0eWxlQ2hhbmdlIiwiX3RvZ2dsZVNlbGVjdGluZyIsImludGwiLCJzaG93QWRkTWFwU3R5bGVNb2RhbCIsImN1cnJlbnRTdHlsZSIsIm1hcFN0eWxlcyIsInN0eWxlVHlwZSIsImVkaXRhYmxlTGF5ZXJzIiwibGF5ZXJHcm91cHMiLCJtYXAiLCJsZyIsInNsdWciLCJoYXNCdWlsZGluZ0xheWVyIiwidmlzaWJsZUxheWVyR3JvdXBzIiwiY29sb3JTZXRTZWxlY3RvciIsImJ1aWxkaW5nQ29sb3JTZWxlY3RvciIsInNldENvbG9yU2VsZWN0b3IiLCJzZWxlY3RlZENvbG9yIiwic2V0Q29sb3IiLCJpc1JhbmdlIiwibGFiZWwiLCJmb3JtYXRNZXNzYWdlIiwiaWQiLCJjb2xvclNldHMiLCJfc2VsZWN0U3R5bGUiLCJsZW5ndGgiLCJ0b3BMYXllckdyb3VwcyIsIm1hcENvbmZpZ0NoYW5nZSIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFQUEsaUJBQWlC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SUUsVUFBQSxRQUFRLEVBQUUvQixlQUFlLENBQUNnQztBQUo1QixVQURELEdBT0csSUFkTixlQWVFLGdDQUFDLGtDQUFELHFCQUNFLGdDQUFDLHlCQUFEO0FBQWUsVUFBQSxTQUFTLEVBQUVKLFNBQTFCO0FBQXFDLFVBQUEsUUFBUSxFQUFFLENBQUNYO0FBQWhELFVBREYsQ0FmRixlQWtCRSxnQ0FBQyx3QkFBRDtBQUFRLFVBQUEsU0FBUyxFQUFDLHNCQUFsQjtBQUF5QyxVQUFBLE9BQU8sRUFBRVQsb0JBQWxEO0FBQXdFLFVBQUEsU0FBUztBQUFqRix3QkFDRSxnQ0FBQyxVQUFEO0FBQUssVUFBQSxNQUFNLEVBQUM7QUFBWixVQURGLGVBRUUsZ0NBQUMsOEJBQUQ7QUFBa0IsVUFBQSxFQUFFLEVBQUU7QUFBdEIsVUFGRixDQWxCRixDQURGLENBREY7QUEyQkQ7QUF6RTREO0FBQUE7QUFBQSxJQUN0Q3lCLGdCQURzQzs7QUFBQSxtQ0FDekR0QyxVQUR5RCxlQUUxQztBQUNqQkcsSUFBQUEsUUFBUSxFQUFFb0Msc0JBQVVDLE1BQVYsQ0FBaUJDLFVBRFY7QUFFakJwQyxJQUFBQSxlQUFlLEVBQUVrQyxzQkFBVUMsTUFBVixDQUFpQkMsVUFGakI7QUFHakI1QixJQUFBQSxvQkFBb0IsRUFBRTBCLHNCQUFVRyxJQUFWLENBQWVEO0FBSHBCLEdBRjBDO0FBMkUvRCxTQUFPLDJCQUFXekMsVUFBWCxDQUFQO0FBQ0Q7O2VBRWNOLGlCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQge0J1dHRvbiwgU2lkZVBhbmVsU2VjdGlvbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IE1hcFN0eWxlU2VsZWN0b3JGYWN0b3J5IGZyb20gJ2NvbXBvbmVudHMvc2lkZS1wYW5lbC9tYXAtc3R5bGUtcGFuZWwvbWFwLXN0eWxlLXNlbGVjdG9yJztcbmltcG9ydCBMYXllckdyb3VwU2VsZWN0b3JGYWN0b3J5IGZyb20gJ2NvbXBvbmVudHMvc2lkZS1wYW5lbC9tYXAtc3R5bGUtcGFuZWwvbWFwLWxheWVyLXNlbGVjdG9yJztcblxuaW1wb3J0IHtBZGR9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCBDb2xvclNlbGVjdG9yIGZyb20gJy4vbGF5ZXItcGFuZWwvY29sb3Itc2VsZWN0b3InO1xuaW1wb3J0IHtjcmVhdGVTZWxlY3Rvcn0gZnJvbSAncmVzZWxlY3QnO1xuaW1wb3J0IHtpbmplY3RJbnRsfSBmcm9tICdyZWFjdC1pbnRsJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAnbG9jYWxpemF0aW9uJztcblxuTWFwTWFuYWdlckZhY3RvcnkuZGVwcyA9IFtNYXBTdHlsZVNlbGVjdG9yRmFjdG9yeSwgTGF5ZXJHcm91cFNlbGVjdG9yRmFjdG9yeV07XG5cbmZ1bmN0aW9uIE1hcE1hbmFnZXJGYWN0b3J5KE1hcFN0eWxlU2VsZWN0b3IsIExheWVyR3JvdXBTZWxlY3Rvcikge1xuICBjbGFzcyBNYXBNYW5hZ2VyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgICAgbWFwU3R5bGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIG1hcFN0eWxlQWN0aW9uczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgc2hvd0FkZE1hcFN0eWxlTW9kYWw6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgICB9O1xuXG4gICAgc3RhdGUgPSB7XG4gICAgICBpc1NlbGVjdGluZzogZmFsc2VcbiAgICB9O1xuXG4gICAgYnVpbGRpbmdDb2xvclNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMubWFwU3R5bGUudGhyZWVEQnVpbGRpbmdDb2xvcjtcbiAgICBzZXRDb2xvclNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMubWFwU3R5bGVBY3Rpb25zLnNldDNkQnVpbGRpbmdDb2xvcjtcblxuICAgIF90b2dnbGVTZWxlY3RpbmcgPSAoKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtpc1NlbGVjdGluZzogIXRoaXMuc3RhdGUuaXNTZWxlY3Rpbmd9KTtcbiAgICB9O1xuXG4gICAgX3NlbGVjdFN0eWxlID0gdmFsID0+IHtcbiAgICAgIGNvbnN0IHttYXBTdHlsZUFjdGlvbnN9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IHttYXBTdHlsZUNoYW5nZX0gPSBtYXBTdHlsZUFjdGlvbnM7XG4gICAgICBtYXBTdHlsZUNoYW5nZSh2YWwpO1xuICAgICAgdGhpcy5fdG9nZ2xlU2VsZWN0aW5nKCk7XG4gICAgfTtcblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHttYXBTdHlsZSwgaW50bCwgbWFwU3R5bGVBY3Rpb25zLCBzaG93QWRkTWFwU3R5bGVNb2RhbH0gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3QgY3VycmVudFN0eWxlID0gbWFwU3R5bGUubWFwU3R5bGVzW21hcFN0eWxlLnN0eWxlVHlwZV0gfHwge307XG4gICAgICBjb25zdCBlZGl0YWJsZUxheWVycyA9IChjdXJyZW50U3R5bGUubGF5ZXJHcm91cHMgfHwgW10pLm1hcChsZyA9PiBsZy5zbHVnKTtcbiAgICAgIGNvbnN0IGhhc0J1aWxkaW5nTGF5ZXIgPSBtYXBTdHlsZS52aXNpYmxlTGF5ZXJHcm91cHNbJzNkIGJ1aWxkaW5nJ107XG4gICAgICBjb25zdCBjb2xvclNldFNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgICAgIHRoaXMuYnVpbGRpbmdDb2xvclNlbGVjdG9yLFxuICAgICAgICB0aGlzLnNldENvbG9yU2VsZWN0b3IsXG4gICAgICAgIChzZWxlY3RlZENvbG9yLCBzZXRDb2xvcikgPT4gW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNlbGVjdGVkQ29sb3IsXG4gICAgICAgICAgICBzZXRDb2xvcixcbiAgICAgICAgICAgIGlzUmFuZ2U6IGZhbHNlLFxuICAgICAgICAgICAgbGFiZWw6IGludGwuZm9ybWF0TWVzc2FnZSh7aWQ6ICdtYXBNYW5hZ2VyLjNkQnVpbGRpbmdDb2xvcid9KVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgKTtcblxuICAgICAgY29uc3QgY29sb3JTZXRzID0gY29sb3JTZXRTZWxlY3Rvcih0aGlzLnByb3BzKTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXAtc3R5bGUtcGFuZWxcIj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPE1hcFN0eWxlU2VsZWN0b3JcbiAgICAgICAgICAgICAgbWFwU3R5bGU9e21hcFN0eWxlfVxuICAgICAgICAgICAgICBpc1NlbGVjdGluZz17dGhpcy5zdGF0ZS5pc1NlbGVjdGluZ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuX3NlbGVjdFN0eWxlfVxuICAgICAgICAgICAgICB0b2dnbGVBY3RpdmU9e3RoaXMuX3RvZ2dsZVNlbGVjdGluZ31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7ZWRpdGFibGVMYXllcnMubGVuZ3RoID8gKFxuICAgICAgICAgICAgICA8TGF5ZXJHcm91cFNlbGVjdG9yXG4gICAgICAgICAgICAgICAgbGF5ZXJzPXttYXBTdHlsZS52aXNpYmxlTGF5ZXJHcm91cHN9XG4gICAgICAgICAgICAgICAgZWRpdGFibGVMYXllcnM9e2VkaXRhYmxlTGF5ZXJzfVxuICAgICAgICAgICAgICAgIHRvcExheWVycz17bWFwU3R5bGUudG9wTGF5ZXJHcm91cHN9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e21hcFN0eWxlQWN0aW9ucy5tYXBDb25maWdDaGFuZ2V9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgIDxTaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICAgICAgICA8Q29sb3JTZWxlY3RvciBjb2xvclNldHM9e2NvbG9yU2V0c30gZGlzYWJsZWQ9eyFoYXNCdWlsZGluZ0xheWVyfSAvPlxuICAgICAgICAgICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICAgICAgPEJ1dHRvbiBjbGFzc05hbWU9XCJhZGQtbWFwLXN0eWxlLWJ1dHRvblwiIG9uQ2xpY2s9e3Nob3dBZGRNYXBTdHlsZU1vZGFsfSBzZWNvbmRhcnk+XG4gICAgICAgICAgICAgIDxBZGQgaGVpZ2h0PVwiMTJweFwiIC8+XG4gICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbWFwTWFuYWdlci5hZGRNYXBTdHlsZSd9IC8+XG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gaW5qZWN0SW50bChNYXBNYW5hZ2VyKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFwTWFuYWdlckZhY3Rvcnk7XG4iXX0=