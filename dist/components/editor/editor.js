"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = EditorFactory;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactMapGlDraw = require("react-map-gl-draw");

var _window = _interopRequireDefault(require("global/window"));

var _classnames = _interopRequireDefault(require("classnames"));

var _lodash = _interopRequireDefault(require("lodash.get"));

var _defaultSettings = require("../../constants/default-settings");

var _featureActionPanel = _interopRequireDefault(require("./feature-action-panel"));

var _featureStyles = require("./feature-styles");

var _handleStyle = require("./handle-style");

var _constants = require("../../constants");

var _reselect = require("reselect");

var _keyevent = _interopRequireDefault(require("../../constants/keyevent"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  cursor: ", ";\n  position: relative;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledWrapper = _styledComponents["default"].div(_templateObject(), function (props) {
  return props.editor.mode === _constants.EDITOR_MODES.EDIT ? 'pointer' : 'crosshair';
});

var editorLayerFilter = function editorLayerFilter(layer) {
  return _defaultSettings.EDITOR_AVAILABLE_LAYERS.includes(layer.type);
};

EditorFactory.deps = [_featureActionPanel["default"]];

function EditorFactory(FeatureActionPanel) {
  var Editor =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(Editor, _Component);

    function Editor() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2["default"])(this, Editor);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(Editor)).call.apply(_getPrototypeOf2, [this].concat(args)));
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
        return _react["default"].createElement(StyledWrapper, {
          editor: editor,
          className: (0, _classnames["default"])('editor', className),
          style: style
        }, _react["default"].createElement(_reactMapGlDraw.Editor, {
          clickRadius: clickRadius,
          mode: editor.mode,
          features: allFeatures,
          selectedFeatureId: selectedFeatureId,
          onSelect: this._onSelect,
          onUpdate: onUpdate,
          getEditHandleShape: _handleStyle.getEditHandleShape,
          getFeatureStyle: _featureStyles.getStyle,
          getEditHandleStyle: _handleStyle.getStyle
        }), showActions && Boolean(selectedFeatureId) ? _react["default"].createElement(FeatureActionPanel, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2VkaXRvci9lZGl0b3IuanMiXSwibmFtZXMiOlsiU3R5bGVkV3JhcHBlciIsInN0eWxlZCIsImRpdiIsInByb3BzIiwiZWRpdG9yIiwibW9kZSIsIkVESVRPUl9NT0RFUyIsIkVESVQiLCJlZGl0b3JMYXllckZpbHRlciIsImxheWVyIiwiRURJVE9SX0FWQUlMQUJMRV9MQVlFUlMiLCJpbmNsdWRlcyIsInR5cGUiLCJFZGl0b3JGYWN0b3J5IiwiZGVwcyIsIkZlYXR1cmVBY3Rpb25QYW5lbEZhY3RvcnkiLCJGZWF0dXJlQWN0aW9uUGFuZWwiLCJFZGl0b3IiLCJzaG93QWN0aW9ucyIsImxhc3RQb3NpdGlvbiIsImxheWVycyIsImxheWVyc1RvUmVuZGVyIiwiZmlsdGVycyIsImZpbHRlclNlbGVjdG9yIiwic2VsZWN0ZWRGZWF0dXJlSWRTZWxlY3RvciIsInNlbGVjdGVkRmVhdHVyZUlkIiwiZmluZCIsImYiLCJ2YWx1ZSIsImlkIiwibGF5ZXJTZWxlY3RvciIsImxheWVyc1RvUmVuZGVyU2VsZWN0b3IiLCJmaWx0ZXIiLCJlZGl0b3JGZWF0dXJlU2VsZWN0b3IiLCJlZGl0b3JGZWF0dXJlcyIsIkZJTFRFUl9UWVBFUyIsInBvbHlnb24iLCJtYXAiLCJjb25jYXQiLCJldmVudCIsImlzRW5hYmxlZCIsImtleUNvZGUiLCJLZXlFdmVudCIsIkRPTV9WS19ERUxFVEUiLCJET01fVktfQkFDS19TUEFDRSIsIl9vbkRlbGV0ZVNlbGVjdGVkRmVhdHVyZSIsIkRPTV9WS19FU0NBUEUiLCJvblNlbGVjdCIsInNvdXJjZUV2ZW50IiwiYWxsRmVhdHVyZXMiLCJhbGxGZWF0dXJlc1NlbGVjdG9yIiwic2V0U3RhdGUiLCJyaWdodEJ1dHRvbiIsIngiLCJjaGFuZ2VkUG9pbnRlcnMiLCJvZmZzZXRYIiwieSIsIm9mZnNldFkiLCJzdGF0ZSIsInNlbGVjdGVkRmVhdHVyZSIsIm9uRGVsZXRlRmVhdHVyZSIsIm9uVG9nZ2xlUG9seWdvbkZpbHRlciIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25LZXlQcmVzc2VkIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImNsYXNzTmFtZSIsImNsaWNrUmFkaXVzIiwiZGF0YXNldHMiLCJvblVwZGF0ZSIsInN0eWxlIiwiY3VycmVudEZpbHRlciIsImN1cnJlbnRGaWx0ZXJTZWxlY3RvciIsImF2YWlsYWJsZUxheWVycyIsImF2YWlsYWJsZUxheWVyc1NlbGV0b3IiLCJfb25TZWxlY3QiLCJnZXRFZGl0SGFuZGxlU2hhcGUiLCJnZXRGZWF0dXJlU3R5bGUiLCJnZXRFZGl0SGFuZGxlU3R5bGUiLCJCb29sZWFuIiwiX2Nsb3NlRmVhdHVyZUFjdGlvbiIsIl9vblRvZ2dsZUxheWVyIiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwiYXJyYXlPZiIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJmdW5jIiwiaW5kZXgiLCJudW1iZXIiLCJjbGFzc25hbWVzIiwic3RyaW5nIiwiYm9vbCIsIkRFRkFVTFRfUkFESVVTIiwiZGlzcGxheU5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFHQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLGFBQWEsR0FBR0MsNkJBQU9DLEdBQVYsb0JBQ1AsVUFBQUMsS0FBSztBQUFBLFNBQUtBLEtBQUssQ0FBQ0MsTUFBTixDQUFhQyxJQUFiLEtBQXNCQyx3QkFBYUMsSUFBbkMsR0FBMEMsU0FBMUMsR0FBc0QsV0FBM0Q7QUFBQSxDQURFLENBQW5COztBQUtBLElBQU1DLGlCQUFpQixHQUFHLFNBQXBCQSxpQkFBb0IsQ0FBQUMsS0FBSztBQUFBLFNBQUlDLHlDQUF3QkMsUUFBeEIsQ0FBaUNGLEtBQUssQ0FBQ0csSUFBdkMsQ0FBSjtBQUFBLENBQS9COztBQUVBQyxhQUFhLENBQUNDLElB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VjtBQUlqQmxGLElBQUFBLE1BQU0sRUFBRStFLHNCQUFVRSxNQUFWLENBQWlCQyxVQUpSO0FBS2pCakUsSUFBQUEsY0FBYyxFQUFFOEQsc0JBQVVFLE1BQVYsQ0FBaUJDLFVBTGhCO0FBTWpCdkMsSUFBQUEsUUFBUSxFQUFFb0Msc0JBQVVJLElBQVYsQ0FBZUQsVUFOUjtBQU9qQmpCLElBQUFBLFFBQVEsRUFBRWMsc0JBQVVJLElBQVYsQ0FBZUQsVUFQUjtBQVFqQjFCLElBQUFBLGVBQWUsRUFBRXVCLHNCQUFVSSxJQUFWLENBQWVELFVBUmY7QUFTakJ6QixJQUFBQSxxQkFBcUIsRUFBRXNCLHNCQUFVSSxJQUFWLENBQWVELFVBVHJCO0FBV2pCRSxJQUFBQSxLQUFLLEVBQUVMLHNCQUFVTSxNQVhBO0FBWWpCQyxJQUFBQSxVQUFVLEVBQUVQLHNCQUFVUSxNQVpMO0FBYWpCeEIsSUFBQUEsV0FBVyxFQUFFZ0Isc0JBQVVNLE1BYk47QUFjakJqRCxJQUFBQSxTQUFTLEVBQUUyQyxzQkFBVVM7QUFkSixHQUZtQztBQUFBLG1DQUNsRDNFLE1BRGtELGtCQW1CaEM7QUFDcEJrRCxJQUFBQSxXQUFXLEVBQUUwQjtBQURPLEdBbkJnQztBQXdLeEQ1RSxFQUFBQSxNQUFNLENBQUM2RSxXQUFQLEdBQXFCLFFBQXJCO0FBRUEsU0FBTzdFLE1BQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtFZGl0b3IgYXMgRHJhd30gZnJvbSAncmVhY3QtbWFwLWdsLWRyYXcnO1xuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IGdldCBmcm9tICdsb2Rhc2guZ2V0JztcblxuaW1wb3J0IHtFRElUT1JfQVZBSUxBQkxFX0xBWUVSU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IEZlYXR1cmVBY3Rpb25QYW5lbEZhY3RvcnkgZnJvbSAnLi9mZWF0dXJlLWFjdGlvbi1wYW5lbCc7XG5pbXBvcnQge0ZJTFRFUl9UWVBFU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5pbXBvcnQge0RFRkFVTFRfUkFESVVTLCBnZXRTdHlsZSBhcyBnZXRGZWF0dXJlU3R5bGV9IGZyb20gJy4vZmVhdHVyZS1zdHlsZXMnO1xuaW1wb3J0IHtnZXRTdHlsZSBhcyBnZXRFZGl0SGFuZGxlU3R5bGUsIGdldEVkaXRIYW5kbGVTaGFwZX0gZnJvbSAnLi9oYW5kbGUtc3R5bGUnO1xuaW1wb3J0IHtFRElUT1JfTU9ERVN9IGZyb20gJ2NvbnN0YW50cyc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5pbXBvcnQgS2V5RXZlbnQgZnJvbSAnY29uc3RhbnRzL2tleWV2ZW50JztcblxuY29uc3QgU3R5bGVkV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGN1cnNvcjogJHtwcm9wcyA9PiAocHJvcHMuZWRpdG9yLm1vZGUgPT09IEVESVRPUl9NT0RFUy5FRElUID8gJ3BvaW50ZXInIDogJ2Nyb3NzaGFpcicpfTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuYDtcblxuY29uc3QgZWRpdG9yTGF5ZXJGaWx0ZXIgPSBsYXllciA9PiBFRElUT1JfQVZBSUxBQkxFX0xBWUVSUy5pbmNsdWRlcyhsYXllci50eXBlKTtcblxuRWRpdG9yRmFjdG9yeS5kZXBzID0gW0ZlYXR1cmVBY3Rpb25QYW5lbEZhY3RvcnldO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBFZGl0b3JGYWN0b3J5KEZlYXR1cmVBY3Rpb25QYW5lbCkge1xuICBjbGFzcyBFZGl0b3IgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgICBmaWx0ZXJzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICAgICAgbGF5ZXJzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICAgICAgZGF0YXNldHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIGVkaXRvcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgbGF5ZXJzVG9SZW5kZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIG9uU2VsZWN0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgb25VcGRhdGU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBvbkRlbGV0ZUZlYXR1cmU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBvblRvZ2dsZVBvbHlnb25GaWx0ZXI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAgIGluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgY2xhc3NuYW1lczogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIGNsaWNrUmFkaXVzOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgaXNFbmFibGVkOiBQcm9wVHlwZXMuYm9vbFxuICAgIH07XG5cbiAgICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgICAgY2xpY2tSYWRpdXM6IERFRkFVTFRfUkFESVVTXG4gICAgfTtcblxuICAgIHN0YXRlID0ge1xuICAgICAgc2hvd0FjdGlvbnM6IGZhbHNlLFxuICAgICAgbGFzdFBvc2l0aW9uOiBudWxsXG4gICAgfTtcblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLl9vbktleVByZXNzZWQpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLl9vbktleVByZXNzZWQpO1xuICAgIH1cblxuICAgIGxheWVyU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5sYXllcnM7XG4gICAgbGF5ZXJzVG9SZW5kZXJTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmxheWVyc1RvUmVuZGVyO1xuICAgIGZpbHRlclNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMuZmlsdGVycztcbiAgICBzZWxlY3RlZEZlYXR1cmVJZFNlbGVjdG9yID0gcHJvcHMgPT4gZ2V0KHByb3BzLCBbJ2VkaXRvcicsICdzZWxlY3RlZEZlYXR1cmUnLCAnaWQnXSk7XG4gICAgZWRpdG9yRmVhdHVyZVNlbGVjdG9yID0gcHJvcHMgPT4gZ2V0KHByb3BzLCBbJ2VkaXRvcicsICdmZWF0dXJlcyddKTtcblxuICAgIGN1cnJlbnRGaWx0ZXJTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgICAgdGhpcy5maWx0ZXJTZWxlY3RvcixcbiAgICAgIHRoaXMuc2VsZWN0ZWRGZWF0dXJlSWRTZWxlY3RvcixcbiAgICAgIChmaWx0ZXJzLCBzZWxlY3RlZEZlYXR1cmVJZCkgPT4gZmlsdGVycy5maW5kKGYgPT4gZi52YWx1ZSAmJiBmLnZhbHVlLmlkID09PSBzZWxlY3RlZEZlYXR1cmVJZClcbiAgICApO1xuXG4gICAgYXZhaWxhYmxlTGF5ZXJzU2VsZXRvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgICAgdGhpcy5sYXllclNlbGVjdG9yLFxuICAgICAgdGhpcy5sYXllcnNUb1JlbmRlclNlbGVjdG9yLFxuICAgICAgKGxheWVycywgbGF5ZXJzVG9SZW5kZXIpID0+XG4gICAgICAgIGxheWVycy5maWx0ZXIoZWRpdG9yTGF5ZXJGaWx0ZXIpLmZpbHRlcihsYXllciA9PiB7XG4gICAgICAgICAgcmV0dXJuIGxheWVyc1RvUmVuZGVyW2xheWVyLmlkXTtcbiAgICAgICAgfSlcbiAgICApO1xuXG4gICAgYWxsRmVhdHVyZXNTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgICAgdGhpcy5maWx0ZXJTZWxlY3RvcixcbiAgICAgIHRoaXMuZWRpdG9yRmVhdHVyZVNlbGVjdG9yLFxuICAgICAgKGZpbHRlcnMsIGVkaXRvckZlYXR1cmVzKSA9PlxuICAgICAgICBmaWx0ZXJzXG4gICAgICAgICAgLmZpbHRlcihmID0+IGYudHlwZSA9PT0gRklMVEVSX1RZUEVTLnBvbHlnb24pXG4gICAgICAgICAgLm1hcChmID0+IGYudmFsdWUpXG4gICAgICAgICAgLmNvbmNhdChlZGl0b3JGZWF0dXJlcylcbiAgICApO1xuXG4gICAgX29uS2V5UHJlc3NlZCA9IGV2ZW50ID0+IHtcbiAgICAgIGNvbnN0IHtpc0VuYWJsZWR9ID0gdGhpcy5wcm9wcztcblxuICAgICAgaWYgKCFpc0VuYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgICAgY2FzZSBLZXlFdmVudC5ET01fVktfREVMRVRFOlxuICAgICAgICBjYXNlIEtleUV2ZW50LkRPTV9WS19CQUNLX1NQQUNFOlxuICAgICAgICAgIHRoaXMuX29uRGVsZXRlU2VsZWN0ZWRGZWF0dXJlKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgS2V5RXZlbnQuRE9NX1ZLX0VTQ0FQRTpcbiAgICAgICAgICB0aGlzLnByb3BzLm9uU2VsZWN0KG51bGwpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfb25TZWxlY3QgPSAoe3NlbGVjdGVkRmVhdHVyZUlkLCBzb3VyY2VFdmVudH0pID0+IHtcbiAgICAgIGNvbnN0IGFsbEZlYXR1cmVzID0gdGhpcy5hbGxGZWF0dXJlc1NlbGVjdG9yKHRoaXMucHJvcHMpO1xuICAgICAgdGhpcy5zZXRTdGF0ZShcbiAgICAgICAge1xuICAgICAgICAgIC4uLihzb3VyY2VFdmVudC5yaWdodEJ1dHRvblxuICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgc2hvd0FjdGlvbnM6IHRydWUsXG4gICAgICAgICAgICAgICAgbGFzdFBvc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgICB4OiBzb3VyY2VFdmVudC5jaGFuZ2VkUG9pbnRlcnNbMF0ub2Zmc2V0WCxcbiAgICAgICAgICAgICAgICAgIHk6IHNvdXJjZUV2ZW50LmNoYW5nZWRQb2ludGVyc1swXS5vZmZzZXRZXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA6IG51bGwpXG4gICAgICAgIH0sXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICB0aGlzLnByb3BzLm9uU2VsZWN0KGFsbEZlYXR1cmVzLmZpbmQoZiA9PiBmLmlkID09PSBzZWxlY3RlZEZlYXR1cmVJZCkpO1xuICAgICAgICB9XG4gICAgICApO1xuICAgIH07XG5cbiAgICBfb25EZWxldGVTZWxlY3RlZEZlYXR1cmUgPSAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5zaG93QWN0aW9ucykge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtzaG93QWN0aW9uczogZmFsc2V9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qge2VkaXRvcn0gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3Qge3NlbGVjdGVkRmVhdHVyZSA9IHt9fSA9IGVkaXRvcjtcbiAgICAgIHRoaXMucHJvcHMub25EZWxldGVGZWF0dXJlKHNlbGVjdGVkRmVhdHVyZSk7XG4gICAgfTtcblxuICAgIF9jbG9zZUZlYXR1cmVBY3Rpb24gPSAoKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtzaG93QWN0aW9uczogZmFsc2V9KTtcbiAgICB9O1xuXG4gICAgX29uVG9nZ2xlTGF5ZXIgPSBsYXllciA9PiB7XG4gICAgICBjb25zdCB7c2VsZWN0ZWRGZWF0dXJlfSA9IHRoaXMucHJvcHMuZWRpdG9yO1xuICAgICAgaWYgKCFzZWxlY3RlZEZlYXR1cmUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnByb3BzLm9uVG9nZ2xlUG9seWdvbkZpbHRlcihsYXllciwgc2VsZWN0ZWRGZWF0dXJlKTtcbiAgICB9O1xuXG4gICAgcmVuZGVyKCkge1xuICAgICAgY29uc3Qge2NsYXNzTmFtZSwgY2xpY2tSYWRpdXMsIGRhdGFzZXRzLCBlZGl0b3IsIG9uVXBkYXRlLCBzdHlsZX0gPSB0aGlzLnByb3BzO1xuXG4gICAgICBjb25zdCB7bGFzdFBvc2l0aW9uLCBzaG93QWN0aW9uc30gPSB0aGlzLnN0YXRlO1xuICAgICAgY29uc3Qgc2VsZWN0ZWRGZWF0dXJlSWQgPSBnZXQoZWRpdG9yLCBbJ3NlbGVjdGVkRmVhdHVyZScsICdpZCddKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRGaWx0ZXIgPSB0aGlzLmN1cnJlbnRGaWx0ZXJTZWxlY3Rvcih0aGlzLnByb3BzKTtcbiAgICAgIGNvbnN0IGF2YWlsYWJsZUxheWVycyA9IHRoaXMuYXZhaWxhYmxlTGF5ZXJzU2VsZXRvcih0aGlzLnByb3BzKTtcbiAgICAgIGNvbnN0IGFsbEZlYXR1cmVzID0gdGhpcy5hbGxGZWF0dXJlc1NlbGVjdG9yKHRoaXMucHJvcHMpO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3R5bGVkV3JhcHBlciBlZGl0b3I9e2VkaXRvcn0gY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdlZGl0b3InLCBjbGFzc05hbWUpfSBzdHlsZT17c3R5bGV9PlxuICAgICAgICAgIDxEcmF3XG4gICAgICAgICAgICBjbGlja1JhZGl1cz17Y2xpY2tSYWRpdXN9XG4gICAgICAgICAgICBtb2RlPXtlZGl0b3IubW9kZX1cbiAgICAgICAgICAgIGZlYXR1cmVzPXthbGxGZWF0dXJlc31cbiAgICAgICAgICAgIHNlbGVjdGVkRmVhdHVyZUlkPXtzZWxlY3RlZEZlYXR1cmVJZH1cbiAgICAgICAgICAgIG9uU2VsZWN0PXt0aGlzLl9vblNlbGVjdH1cbiAgICAgICAgICAgIG9uVXBkYXRlPXtvblVwZGF0ZX1cbiAgICAgICAgICAgIGdldEVkaXRIYW5kbGVTaGFwZT17Z2V0RWRpdEhhbmRsZVNoYXBlfVxuICAgICAgICAgICAgZ2V0RmVhdHVyZVN0eWxlPXtnZXRGZWF0dXJlU3R5bGV9XG4gICAgICAgICAgICBnZXRFZGl0SGFuZGxlU3R5bGU9e2dldEVkaXRIYW5kbGVTdHlsZX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIHtzaG93QWN0aW9ucyAmJiBCb29sZWFuKHNlbGVjdGVkRmVhdHVyZUlkKSA/IChcbiAgICAgICAgICAgIDxGZWF0dXJlQWN0aW9uUGFuZWxcbiAgICAgICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgICAgICBsYXllcnM9e2F2YWlsYWJsZUxheWVyc31cbiAgICAgICAgICAgICAgY3VycmVudEZpbHRlcj17Y3VycmVudEZpbHRlcn1cbiAgICAgICAgICAgICAgb25DbG9zZT17dGhpcy5fY2xvc2VGZWF0dXJlQWN0aW9ufVxuICAgICAgICAgICAgICBvbkRlbGV0ZUZlYXR1cmU9e3RoaXMuX29uRGVsZXRlU2VsZWN0ZWRGZWF0dXJlfVxuICAgICAgICAgICAgICBvblRvZ2dsZUxheWVyPXt0aGlzLl9vblRvZ2dsZUxheWVyfVxuICAgICAgICAgICAgICBwb3NpdGlvbj17bGFzdFBvc2l0aW9ufVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPC9TdHlsZWRXcmFwcGVyPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBFZGl0b3IuZGlzcGxheU5hbWUgPSAnRWRpdG9yJztcblxuICByZXR1cm4gRWRpdG9yO1xufVxuIl19