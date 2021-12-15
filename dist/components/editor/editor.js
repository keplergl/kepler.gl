"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = EditorFactory;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactMapGlDraw = require("react-map-gl-draw");

var _window = _interopRequireDefault(require("global/window"));

var _classnames = _interopRequireDefault(require("classnames"));

var _lodash = _interopRequireDefault(require("lodash.get"));

var _reselect = require("reselect");

var _featureActionPanel = _interopRequireDefault(require("./feature-action-panel"));

var _defaultSettings = require("../../constants/default-settings");

var _featureStyles = require("./feature-styles");

var _handleStyle = require("./handle-style");

var _keyevent = _interopRequireDefault(require("../../constants/keyevent"));

var _templateObject;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var StyledWrapper = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  cursor: ", ";\n  position: relative;\n"])), function (props) {
  return props.editor.mode === _defaultSettings.EDITOR_MODES.EDIT ? 'pointer' : 'crosshair';
});

var editorLayerFilter = function editorLayerFilter(layer) {
  return _defaultSettings.EDITOR_AVAILABLE_LAYERS.includes(layer.type);
};

EditorFactory.deps = [_featureActionPanel["default"]];

function EditorFactory(FeatureActionPanel) {
  var Editor = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(Editor, _Component);

    var _super = _createSuper(Editor);

    function Editor() {
      var _this;

      (0, _classCallCheck2["default"])(this, Editor);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
        showActions: false,
        lastPosition: null
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "layerSelector", function (props) {
        return props.layers;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "layersToRenderSelector", function (props) {
        return props.layersToRender;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "filterSelector", function (props) {
        return props.filters;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "selectedFeatureIdSelector", function (props) {
        return (0, _lodash["default"])(props, ['editor', 'selectedFeature', 'id']);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "editorFeatureSelector", function (props) {
        return (0, _lodash["default"])(props, ['editor', 'features']);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "currentFilterSelector", (0, _reselect.createSelector)(_this.filterSelector, _this.selectedFeatureIdSelector, function (filters, selectedFeatureId) {
        return filters.find(function (f) {
          return f.value && f.value.id === selectedFeatureId;
        });
      }));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "availableLayersSeletor", (0, _reselect.createSelector)(_this.layerSelector, _this.layersToRenderSelector, function (layers, layersToRender) {
        return layers.filter(editorLayerFilter).filter(function (layer) {
          return layersToRender[layer.id];
        });
      }));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "allFeaturesSelector", (0, _reselect.createSelector)(_this.filterSelector, _this.editorFeatureSelector, function (filters, editorFeatures) {
        return filters.filter(function (f) {
          return f.type === _defaultSettings.FILTER_TYPES.polygon;
        }).map(function (f) {
          return f.value;
        }).concat(editorFeatures);
      }));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onKeyPressed", function (event) {
        var isEnabled = _this.props.isEnabled;

        if (!isEnabled) {
          return;
        }

        switch (event.keyCode) {
          case _keyevent["default"].DOM_VK_DELETE:
          case _keyevent["default"].DOM_VK_BACK_SPACE:
            _this._onDeleteSelectedFeature();

            break;

          case _keyevent["default"].DOM_VK_ESCAPE:
            _this.props.onSelect(null);

            break;

          default:
            break;
        }
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onSelect", function (_ref) {
        var selectedFeatureId = _ref.selectedFeatureId,
            sourceEvent = _ref.sourceEvent;

        var allFeatures = _this.allFeaturesSelector(_this.props);

        _this.setState(_objectSpread({}, sourceEvent.rightButton ? {
          showActions: true,
          lastPosition: {
            x: sourceEvent.changedPointers[0].offsetX,
            y: sourceEvent.changedPointers[0].offsetY
          }
        } : null), function () {
          _this.props.onSelect(allFeatures.find(function (f) {
            return f.id === selectedFeatureId;
          }));
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onDeleteSelectedFeature", function () {
        if (_this.state.showActions) {
          _this.setState({
            showActions: false
          });
        }

        var editor = _this.props.editor;
        var _editor$selectedFeatu = editor.selectedFeature,
            selectedFeature = _editor$selectedFeatu === void 0 ? {} : _editor$selectedFeatu;

        _this.props.onDeleteFeature(selectedFeature);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_closeFeatureAction", function () {
        _this.setState({
          showActions: false
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onToggleLayer", function (layer) {
        var selectedFeature = _this.props.editor.selectedFeature;

        if (!selectedFeature) {
          return;
        }

        _this.props.onTogglePolygonFilter(layer, selectedFeature);
      });
      return _this;
    }

    (0, _createClass2["default"])(Editor, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        _window["default"].addEventListener('keydown', this._onKeyPressed);
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        _window["default"].removeEventListener('keydown', this._onKeyPressed);
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props = this.props,
            className = _this$props.className,
            clickRadius = _this$props.clickRadius,
            datasets = _this$props.datasets,
            editor = _this$props.editor,
            onUpdate = _this$props.onUpdate,
            style = _this$props.style;
        var _this$state = this.state,
            lastPosition = _this$state.lastPosition,
            showActions = _this$state.showActions;
        var selectedFeatureId = (0, _lodash["default"])(editor, ['selectedFeature', 'id']);
        var currentFilter = this.currentFilterSelector(this.props);
        var availableLayers = this.availableLayersSeletor(this.props);
        var allFeatures = this.allFeaturesSelector(this.props);
        return /*#__PURE__*/_react["default"].createElement(StyledWrapper, {
          editor: editor,
          className: (0, _classnames["default"])('editor', className),
          style: style
        }, /*#__PURE__*/_react["default"].createElement(_reactMapGlDraw.Editor, {
          clickRadius: clickRadius,
          mode: editor.mode,
          features: allFeatures,
          selectedFeatureId: selectedFeatureId,
          onSelect: this._onSelect,
          onUpdate: onUpdate,
          getEditHandleShape: _handleStyle.getEditHandleShape,
          getFeatureStyle: _featureStyles.getStyle,
          getEditHandleStyle: _handleStyle.getStyle
        }), showActions && Boolean(selectedFeatureId) ? /*#__PURE__*/_react["default"].createElement(FeatureActionPanel, {
          selectedFeature: (0, _lodash["default"])(editor, ['selectedFeature']),
          datasets: datasets,
          layers: availableLayers,
          currentFilter: currentFilter,
          onClose: this._closeFeatureAction,
          onDeleteFeature: this._onDeleteSelectedFeature,
          onToggleLayer: this._onToggleLayer,
          position: lastPosition
        }) : null);
      }
    }]);
    return Editor;
  }(_react.Component);

  (0, _defineProperty2["default"])(Editor, "propTypes", {
    filters: _propTypes["default"].arrayOf(_propTypes["default"].object).isRequired,
    layers: _propTypes["default"].arrayOf(_propTypes["default"].object).isRequired,
    datasets: _propTypes["default"].object.isRequired,
    editor: _propTypes["default"].object.isRequired,
    layersToRender: _propTypes["default"].object.isRequired,
    onSelect: _propTypes["default"].func.isRequired,
    onUpdate: _propTypes["default"].func.isRequired,
    onDeleteFeature: _propTypes["default"].func.isRequired,
    onTogglePolygonFilter: _propTypes["default"].func.isRequired,
    index: _propTypes["default"].number,
    classnames: _propTypes["default"].string,
    clickRadius: _propTypes["default"].number,
    isEnabled: _propTypes["default"].bool
  });
  (0, _defineProperty2["default"])(Editor, "defaultProps", {
    clickRadius: _featureStyles.DEFAULT_RADIUS
  });
  Editor.displayName = 'Editor';
  return Editor;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2VkaXRvci9lZGl0b3IuanMiXSwibmFtZXMiOlsiU3R5bGVkV3JhcHBlciIsInN0eWxlZCIsImRpdiIsInByb3BzIiwiZWRpdG9yIiwibW9kZSIsIkVESVRPUl9NT0RFUyIsIkVESVQiLCJlZGl0b3JMYXllckZpbHRlciIsImxheWVyIiwiRURJVE9SX0FWQUlMQUJMRV9MQVlFUlMiLCJpbmNsdWRlcyIsInR5cGUiLCJFZGl0b3JGYWN0b3J5IiwiZGVwcyIsIkZlYXR1cmVBY3Rpb25QYW5lbEZhY3RvcnkiLCJGZWF0dXJlQWN0aW9uUGFuZWwiLCJFZGl0b3IiLCJzaG93QWN0aW9ucyIsImxhc3RQb3NpdGlvbiIsImxheWVycyIsImxheWVyc1RvUmVuZGVyIiwiZmlsdGVycyIsImZpbHRlclNlbGVjdG9yIiwic2VsZWN0ZWRGZWF0dXJlSWRTZWxlY3RvciIsInNlbGVjdGVkRmVhdHVyZUlkIiwiZmluZCIsImYiLCJ2YWx1ZSIsImlkIiwibGF5ZXJTZWxlY3RvciIsImxheWVyc1RvUmVuZGVyU2VsZWN0b3IiLCJmaWx0ZXIiLCJlZGl0b3JGZWF0dXJlU2VsZWN0b3IiLCJlZGl0b3JGZWF0dXJlcyIsIkZJTFRFUl9UWVBFUyIsInBvbHlnb24iLCJtYXAiLCJjb25jYXQiLCJldmVudCIsImlzRW5hYmxlZCIsImtleUNvZGUiLCJLZXlFdmVudCIsIkRPTV9WS19ERUxFVEUiLCJET01fVktfQkFDS19TUEFDRSIsIl9vbkRlbGV0ZVNlbGVjdGVkRmVhdHVyZSIsIkRPTV9WS19FU0NBUEUiLCJvblNlbGVjdCIsInNvdXJjZUV2ZW50IiwiYWxsRmVhdHVyZXMiLCJhbGxGZWF0dXJlc1NlbGVjdG9yIiwic2V0U3RhdGUiLCJyaWdodEJ1dHRvbiIsIngiLCJjaGFuZ2VkUG9pbnRlcnMiLCJvZmZzZXRYIiwieSIsIm9mZnNldFkiLCJzdGF0ZSIsInNlbGVjdGVkRmVhdHVyZSIsIm9uRGVsZXRlRmVhdHVyZSIsIm9uVG9nZ2xlUG9seWdvbkZpbHRlciIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25LZXlQcmVzc2VkIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImNsYXNzTmFtZSIsImNsaWNrUmFkaXVzIiwiZGF0YXNldHMiLCJvblVwZGF0ZSIsInN0eWxlIiwiY3VycmVudEZpbHRlciIsImN1cnJlbnRGaWx0ZXJTZWxlY3RvciIsImF2YWlsYWJsZUxheWVycyIsImF2YWlsYWJsZUxheWVyc1NlbGV0b3IiLCJfb25TZWxlY3QiLCJnZXRFZGl0SGFuZGxlU2hhcGUiLCJnZXRGZWF0dXJlU3R5bGUiLCJnZXRFZGl0SGFuZGxlU3R5bGUiLCJCb29sZWFuIiwiX2Nsb3NlRmVhdHVyZUFjdGlvbiIsIl9vblRvZ2dsZUxheWVyIiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwiYXJyYXlPZiIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJmdW5jIiwiaW5kZXgiLCJudW1iZXIiLCJjbGFzc25hbWVzIiwic3RyaW5nIiwiYm9vbCIsIkRFRkFVTFRfUkFESVVTIiwiZGlzcGxheU5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsYUFBYSxHQUFHQyw2QkFBT0MsR0FBVixpSUFDUCxVQUFBQyxLQUFLO0FBQUEsU0FBS0EsS0FBSyxDQUFDQyxNQUFOLENBQWFDLElBQWIsS0FBc0JDLDhCQUFhQyxJQUFuQyxHQUEwQyxTQUExQyxHQUFzRCxXQUEzRDtBQUFBLENBREUsQ0FBbkI7O0FBS0EsSUFBTUMsaUJBQWlCLEdBQUcsU0FBcEJBLGlCQUFvQixDQUFBQyxLQUFLO0FBQUEsU0FBSUMseUNBQXdCQyxRQUF4QixDQUFpQ0YsS0FBSyxDQUFDRyxJQUF2QyxDQUFKO0FBQUEsQ0FBL0I7O0FBRUFDLGFBQWEsQ0FBQ0MsSUFBZCxHQUFxQixD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RUFBb0NDLFVBRjNCO0FBR2pCbEIsSUFBQUEsUUFBUSxFQUFFZSxzQkFBVUUsTUFBVixDQUFpQkMsVUFIVjtBQUlqQmxGLElBQUFBLE1BQU0sRUFBRStFLHNCQUFVRSxNQUFWLENBQWlCQyxVQUpSO0FBS2pCakUsSUFBQUEsY0FBYyxFQUFFOEQsc0JBQVVFLE1BQVYsQ0FBaUJDLFVBTGhCO0FBTWpCdkMsSUFBQUEsUUFBUSxFQUFFb0Msc0JBQVVJLElBQVYsQ0FBZUQsVUFOUjtBQU9qQmpCLElBQUFBLFFBQVEsRUFBRWMsc0JBQVVJLElBQVYsQ0FBZUQsVUFQUjtBQVFqQjFCLElBQUFBLGVBQWUsRUFBRXVCLHNCQUFVSSxJQUFWLENBQWVELFVBUmY7QUFTakJ6QixJQUFBQSxxQkFBcUIsRUFBRXNCLHNCQUFVSSxJQUFWLENBQWVELFVBVHJCO0FBV2pCRSxJQUFBQSxLQUFLLEVBQUVMLHNCQUFVTSxNQVhBO0FBWWpCQyxJQUFBQSxVQUFVLEVBQUVQLHNCQUFVUSxNQVpMO0FBYWpCeEIsSUFBQUEsV0FBVyxFQUFFZ0Isc0JBQVVNLE1BYk47QUFjakJqRCxJQUFBQSxTQUFTLEVBQUUyQyxzQkFBVVM7QUFkSixHQUZtQztBQUFBLG1DQUNsRDNFLE1BRGtELGtCQW1CaEM7QUFDcEJrRCxJQUFBQSxXQUFXLEVBQUUwQjtBQURPLEdBbkJnQztBQXlLeEQ1RSxFQUFBQSxNQUFNLENBQUM2RSxXQUFQLEdBQXFCLFFBQXJCO0FBRUEsU0FBTzdFLE1BQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtFZGl0b3IgYXMgRHJhd30gZnJvbSAncmVhY3QtbWFwLWdsLWRyYXcnO1xuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IGdldCBmcm9tICdsb2Rhc2guZ2V0JztcbmltcG9ydCB7Y3JlYXRlU2VsZWN0b3J9IGZyb20gJ3Jlc2VsZWN0JztcblxuaW1wb3J0IEZlYXR1cmVBY3Rpb25QYW5lbEZhY3RvcnkgZnJvbSAnLi9mZWF0dXJlLWFjdGlvbi1wYW5lbCc7XG5pbXBvcnQge0ZJTFRFUl9UWVBFUywgRURJVE9SX01PREVTLCBFRElUT1JfQVZBSUxBQkxFX0xBWUVSU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5pbXBvcnQge0RFRkFVTFRfUkFESVVTLCBnZXRTdHlsZSBhcyBnZXRGZWF0dXJlU3R5bGV9IGZyb20gJy4vZmVhdHVyZS1zdHlsZXMnO1xuaW1wb3J0IHtnZXRTdHlsZSBhcyBnZXRFZGl0SGFuZGxlU3R5bGUsIGdldEVkaXRIYW5kbGVTaGFwZX0gZnJvbSAnLi9oYW5kbGUtc3R5bGUnO1xuaW1wb3J0IEtleUV2ZW50IGZyb20gJ2NvbnN0YW50cy9rZXlldmVudCc7XG5cbmNvbnN0IFN0eWxlZFdyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBjdXJzb3I6ICR7cHJvcHMgPT4gKHByb3BzLmVkaXRvci5tb2RlID09PSBFRElUT1JfTU9ERVMuRURJVCA/ICdwb2ludGVyJyA6ICdjcm9zc2hhaXInKX07XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbmA7XG5cbmNvbnN0IGVkaXRvckxheWVyRmlsdGVyID0gbGF5ZXIgPT4gRURJVE9SX0FWQUlMQUJMRV9MQVlFUlMuaW5jbHVkZXMobGF5ZXIudHlwZSk7XG5cbkVkaXRvckZhY3RvcnkuZGVwcyA9IFtGZWF0dXJlQWN0aW9uUGFuZWxGYWN0b3J5XTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRWRpdG9yRmFjdG9yeShGZWF0dXJlQWN0aW9uUGFuZWwpIHtcbiAgY2xhc3MgRWRpdG9yIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgICAgZmlsdGVyczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgICAgIGxheWVyczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgICAgIGRhdGFzZXRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICBlZGl0b3I6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIGxheWVyc1RvUmVuZGVyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICBvblNlbGVjdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIG9uVXBkYXRlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgb25EZWxldGVGZWF0dXJlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgb25Ub2dnbGVQb2x5Z29uRmlsdGVyOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgICBpbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgIGNsYXNzbmFtZXM6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBjbGlja1JhZGl1czogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgIGlzRW5hYmxlZDogUHJvcFR5cGVzLmJvb2xcbiAgICB9O1xuXG4gICAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgIGNsaWNrUmFkaXVzOiBERUZBVUxUX1JBRElVU1xuICAgIH07XG5cbiAgICBzdGF0ZSA9IHtcbiAgICAgIHNob3dBY3Rpb25zOiBmYWxzZSxcbiAgICAgIGxhc3RQb3NpdGlvbjogbnVsbFxuICAgIH07XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5fb25LZXlQcmVzc2VkKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5fb25LZXlQcmVzc2VkKTtcbiAgICB9XG5cbiAgICBsYXllclNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMubGF5ZXJzO1xuICAgIGxheWVyc1RvUmVuZGVyU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5sYXllcnNUb1JlbmRlcjtcbiAgICBmaWx0ZXJTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmZpbHRlcnM7XG4gICAgc2VsZWN0ZWRGZWF0dXJlSWRTZWxlY3RvciA9IHByb3BzID0+IGdldChwcm9wcywgWydlZGl0b3InLCAnc2VsZWN0ZWRGZWF0dXJlJywgJ2lkJ10pO1xuICAgIGVkaXRvckZlYXR1cmVTZWxlY3RvciA9IHByb3BzID0+IGdldChwcm9wcywgWydlZGl0b3InLCAnZmVhdHVyZXMnXSk7XG5cbiAgICBjdXJyZW50RmlsdGVyU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcbiAgICAgIHRoaXMuZmlsdGVyU2VsZWN0b3IsXG4gICAgICB0aGlzLnNlbGVjdGVkRmVhdHVyZUlkU2VsZWN0b3IsXG4gICAgICAoZmlsdGVycywgc2VsZWN0ZWRGZWF0dXJlSWQpID0+IGZpbHRlcnMuZmluZChmID0+IGYudmFsdWUgJiYgZi52YWx1ZS5pZCA9PT0gc2VsZWN0ZWRGZWF0dXJlSWQpXG4gICAgKTtcblxuICAgIGF2YWlsYWJsZUxheWVyc1NlbGV0b3IgPSBjcmVhdGVTZWxlY3RvcihcbiAgICAgIHRoaXMubGF5ZXJTZWxlY3RvcixcbiAgICAgIHRoaXMubGF5ZXJzVG9SZW5kZXJTZWxlY3RvcixcbiAgICAgIChsYXllcnMsIGxheWVyc1RvUmVuZGVyKSA9PlxuICAgICAgICBsYXllcnMuZmlsdGVyKGVkaXRvckxheWVyRmlsdGVyKS5maWx0ZXIobGF5ZXIgPT4ge1xuICAgICAgICAgIHJldHVybiBsYXllcnNUb1JlbmRlcltsYXllci5pZF07XG4gICAgICAgIH0pXG4gICAgKTtcblxuICAgIGFsbEZlYXR1cmVzU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcbiAgICAgIHRoaXMuZmlsdGVyU2VsZWN0b3IsXG4gICAgICB0aGlzLmVkaXRvckZlYXR1cmVTZWxlY3RvcixcbiAgICAgIChmaWx0ZXJzLCBlZGl0b3JGZWF0dXJlcykgPT5cbiAgICAgICAgZmlsdGVyc1xuICAgICAgICAgIC5maWx0ZXIoZiA9PiBmLnR5cGUgPT09IEZJTFRFUl9UWVBFUy5wb2x5Z29uKVxuICAgICAgICAgIC5tYXAoZiA9PiBmLnZhbHVlKVxuICAgICAgICAgIC5jb25jYXQoZWRpdG9yRmVhdHVyZXMpXG4gICAgKTtcblxuICAgIF9vbktleVByZXNzZWQgPSBldmVudCA9PiB7XG4gICAgICBjb25zdCB7aXNFbmFibGVkfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgIGlmICghaXNFbmFibGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICAgIGNhc2UgS2V5RXZlbnQuRE9NX1ZLX0RFTEVURTpcbiAgICAgICAgY2FzZSBLZXlFdmVudC5ET01fVktfQkFDS19TUEFDRTpcbiAgICAgICAgICB0aGlzLl9vbkRlbGV0ZVNlbGVjdGVkRmVhdHVyZSgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtleUV2ZW50LkRPTV9WS19FU0NBUEU6XG4gICAgICAgICAgdGhpcy5wcm9wcy5vblNlbGVjdChudWxsKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX29uU2VsZWN0ID0gKHtzZWxlY3RlZEZlYXR1cmVJZCwgc291cmNlRXZlbnR9KSA9PiB7XG4gICAgICBjb25zdCBhbGxGZWF0dXJlcyA9IHRoaXMuYWxsRmVhdHVyZXNTZWxlY3Rvcih0aGlzLnByb3BzKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgIHtcbiAgICAgICAgICAuLi4oc291cmNlRXZlbnQucmlnaHRCdXR0b25cbiAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgIHNob3dBY3Rpb25zOiB0cnVlLFxuICAgICAgICAgICAgICAgIGxhc3RQb3NpdGlvbjoge1xuICAgICAgICAgICAgICAgICAgeDogc291cmNlRXZlbnQuY2hhbmdlZFBvaW50ZXJzWzBdLm9mZnNldFgsXG4gICAgICAgICAgICAgICAgICB5OiBzb3VyY2VFdmVudC5jaGFuZ2VkUG9pbnRlcnNbMF0ub2Zmc2V0WVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgOiBudWxsKVxuICAgICAgICB9LFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5wcm9wcy5vblNlbGVjdChhbGxGZWF0dXJlcy5maW5kKGYgPT4gZi5pZCA9PT0gc2VsZWN0ZWRGZWF0dXJlSWQpKTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgX29uRGVsZXRlU2VsZWN0ZWRGZWF0dXJlID0gKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuc2hvd0FjdGlvbnMpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7c2hvd0FjdGlvbnM6IGZhbHNlfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHtlZGl0b3J9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IHtzZWxlY3RlZEZlYXR1cmUgPSB7fX0gPSBlZGl0b3I7XG4gICAgICB0aGlzLnByb3BzLm9uRGVsZXRlRmVhdHVyZShzZWxlY3RlZEZlYXR1cmUpO1xuICAgIH07XG5cbiAgICBfY2xvc2VGZWF0dXJlQWN0aW9uID0gKCkgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7c2hvd0FjdGlvbnM6IGZhbHNlfSk7XG4gICAgfTtcblxuICAgIF9vblRvZ2dsZUxheWVyID0gbGF5ZXIgPT4ge1xuICAgICAgY29uc3Qge3NlbGVjdGVkRmVhdHVyZX0gPSB0aGlzLnByb3BzLmVkaXRvcjtcbiAgICAgIGlmICghc2VsZWN0ZWRGZWF0dXJlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wcm9wcy5vblRvZ2dsZVBvbHlnb25GaWx0ZXIobGF5ZXIsIHNlbGVjdGVkRmVhdHVyZSk7XG4gICAgfTtcblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHtjbGFzc05hbWUsIGNsaWNrUmFkaXVzLCBkYXRhc2V0cywgZWRpdG9yLCBvblVwZGF0ZSwgc3R5bGV9ID0gdGhpcy5wcm9wcztcblxuICAgICAgY29uc3Qge2xhc3RQb3NpdGlvbiwgc2hvd0FjdGlvbnN9ID0gdGhpcy5zdGF0ZTtcbiAgICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZUlkID0gZ2V0KGVkaXRvciwgWydzZWxlY3RlZEZlYXR1cmUnLCAnaWQnXSk7XG4gICAgICBjb25zdCBjdXJyZW50RmlsdGVyID0gdGhpcy5jdXJyZW50RmlsdGVyU2VsZWN0b3IodGhpcy5wcm9wcyk7XG4gICAgICBjb25zdCBhdmFpbGFibGVMYXllcnMgPSB0aGlzLmF2YWlsYWJsZUxheWVyc1NlbGV0b3IodGhpcy5wcm9wcyk7XG4gICAgICBjb25zdCBhbGxGZWF0dXJlcyA9IHRoaXMuYWxsRmVhdHVyZXNTZWxlY3Rvcih0aGlzLnByb3BzKTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFN0eWxlZFdyYXBwZXIgZWRpdG9yPXtlZGl0b3J9IGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnZWRpdG9yJywgY2xhc3NOYW1lKX0gc3R5bGU9e3N0eWxlfT5cbiAgICAgICAgICA8RHJhd1xuICAgICAgICAgICAgY2xpY2tSYWRpdXM9e2NsaWNrUmFkaXVzfVxuICAgICAgICAgICAgbW9kZT17ZWRpdG9yLm1vZGV9XG4gICAgICAgICAgICBmZWF0dXJlcz17YWxsRmVhdHVyZXN9XG4gICAgICAgICAgICBzZWxlY3RlZEZlYXR1cmVJZD17c2VsZWN0ZWRGZWF0dXJlSWR9XG4gICAgICAgICAgICBvblNlbGVjdD17dGhpcy5fb25TZWxlY3R9XG4gICAgICAgICAgICBvblVwZGF0ZT17b25VcGRhdGV9XG4gICAgICAgICAgICBnZXRFZGl0SGFuZGxlU2hhcGU9e2dldEVkaXRIYW5kbGVTaGFwZX1cbiAgICAgICAgICAgIGdldEZlYXR1cmVTdHlsZT17Z2V0RmVhdHVyZVN0eWxlfVxuICAgICAgICAgICAgZ2V0RWRpdEhhbmRsZVN0eWxlPXtnZXRFZGl0SGFuZGxlU3R5bGV9XG4gICAgICAgICAgLz5cbiAgICAgICAgICB7c2hvd0FjdGlvbnMgJiYgQm9vbGVhbihzZWxlY3RlZEZlYXR1cmVJZCkgPyAoXG4gICAgICAgICAgICA8RmVhdHVyZUFjdGlvblBhbmVsXG4gICAgICAgICAgICAgIHNlbGVjdGVkRmVhdHVyZT17Z2V0KGVkaXRvciwgWydzZWxlY3RlZEZlYXR1cmUnXSl9XG4gICAgICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICAgICAgbGF5ZXJzPXthdmFpbGFibGVMYXllcnN9XG4gICAgICAgICAgICAgIGN1cnJlbnRGaWx0ZXI9e2N1cnJlbnRGaWx0ZXJ9XG4gICAgICAgICAgICAgIG9uQ2xvc2U9e3RoaXMuX2Nsb3NlRmVhdHVyZUFjdGlvbn1cbiAgICAgICAgICAgICAgb25EZWxldGVGZWF0dXJlPXt0aGlzLl9vbkRlbGV0ZVNlbGVjdGVkRmVhdHVyZX1cbiAgICAgICAgICAgICAgb25Ub2dnbGVMYXllcj17dGhpcy5fb25Ub2dnbGVMYXllcn1cbiAgICAgICAgICAgICAgcG9zaXRpb249e2xhc3RQb3NpdGlvbn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvU3R5bGVkV3JhcHBlcj5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgRWRpdG9yLmRpc3BsYXlOYW1lID0gJ0VkaXRvcic7XG5cbiAgcmV0dXJuIEVkaXRvcjtcbn1cbiJdfQ==