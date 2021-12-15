"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AddDataButtonFactory = AddDataButtonFactory;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactSortableHoc = require("react-sortable-hoc");

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reselect = require("reselect");

var _reactIntl = require("react-intl");

var _localization = require("../../localization");

var _dataUtils = require("../../utils/data-utils");

var _layerPanel = _interopRequireDefault(require("./layer-panel/layer-panel"));

var _sourceDataCatalog = _interopRequireDefault(require("./common/source-data-catalog"));

var _icons = require("../common/icons");

var _itemSelector = _interopRequireDefault(require("../common/item-selector/item-selector"));

var _styledComponents2 = require("../common/styled-components");

var _defaultSettings = require("../../constants/default-settings");

var _templateObject;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var LayerBlendingSelector = function LayerBlendingSelector(_ref) {
  var layerBlending = _ref.layerBlending,
      updateLayerBlending = _ref.updateLayerBlending,
      intl = _ref.intl;
  var labeledLayerBlendings = Object.keys(_defaultSettings.LAYER_BLENDINGS).reduce(function (acc, current) {
    return _objectSpread(_objectSpread({}, acc), {}, (0, _defineProperty2["default"])({}, intl.formatMessage({
      id: _defaultSettings.LAYER_BLENDINGS[current].label
    }), current));
  }, {});
  var onChange = (0, _react.useCallback)(function (blending) {
    return updateLayerBlending(labeledLayerBlendings[blending]);
  }, [updateLayerBlending, labeledLayerBlendings]);
  return /*#__PURE__*/_react["default"].createElement(_styledComponents2.SidePanelSection, null, /*#__PURE__*/_react["default"].createElement(_styledComponents2.PanelLabel, null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
    id: "layerBlending.title"
  })), /*#__PURE__*/_react["default"].createElement(_itemSelector["default"], {
    selectedItems: intl.formatMessage({
      id: _defaultSettings.LAYER_BLENDINGS[layerBlending].label
    }),
    options: Object.keys(labeledLayerBlendings),
    multiSelect: false,
    searchable: false,
    onChange: onChange
  }));
}; // make sure the element is always visible while is being dragged
// item being dragged is appended in body, here to reset its global style


var SortableStyledItem = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  z-index: ", ";\n\n  &.sorting {\n    pointer-events: none;\n  }\n\n  &.sorting-layers .layer-panel__header {\n    background-color: ", ";\n    font-family: ", ";\n    font-weight: ", ";\n    font-size: ", ";\n    line-height: ", ";\n    *,\n    *:before,\n    *:after {\n      box-sizing: border-box;\n    }\n    .layer__drag-handle {\n      opacity: 1;\n      color: ", ";\n    }\n  }\n"])), function (props) {
  return props.theme.dropdownWrapperZ + 1;
}, function (props) {
  return props.theme.panelBackgroundHover;
}, function (props) {
  return props.theme.fontFamily;
}, function (props) {
  return props.theme.fontWeight;
}, function (props) {
  return props.theme.fontSize;
}, function (props) {
  return props.theme.lineHeight;
}, function (props) {
  return props.theme.textColorHl;
});

function AddDataButtonFactory() {
  var AddDataButton = function AddDataButton(_ref2) {
    var onClick = _ref2.onClick,
        isInactive = _ref2.isInactive;
    return /*#__PURE__*/_react["default"].createElement(_styledComponents2.Button, {
      className: "add-data-button",
      onClick: onClick,
      isInactive: !isInactive,
      width: "105px",
      secondary: true
    }, /*#__PURE__*/_react["default"].createElement(_icons.Add, {
      height: "12px"
    }), /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'layerManager.addData'
    }));
  };

  return AddDataButton;
}

LayerManagerFactory.deps = [AddDataButtonFactory, _layerPanel["default"], _sourceDataCatalog["default"]];

function LayerManagerFactory(AddDataButton, LayerPanel, SourceDataCatalog) {
  // By wrapping layer panel using a sortable element we don't have to implement the drag and drop logic into the panel itself;
  // Developers can provide any layer panel implementation and it will still be sortable
  var SortableItem = (0, _reactSortableHoc.SortableElement)(function (_ref3) {
    var children = _ref3.children,
        isSorting = _ref3.isSorting;
    return /*#__PURE__*/_react["default"].createElement(SortableStyledItem, {
      className: (0, _classnames["default"])('sortable-layer-items', {
        sorting: isSorting
      })
    }, children);
  });
  var WrappedSortableContainer = (0, _reactSortableHoc.SortableContainer)(function (_ref4) {
    var children = _ref4.children;
    return /*#__PURE__*/_react["default"].createElement("div", null, children);
  });

  var LayerManager = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(LayerManager, _Component);

    var _super = _createSuper(LayerManager);

    function LayerManager() {
      var _this;

      (0, _classCallCheck2["default"])(this, LayerManager);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
        isSorting: false
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "layerClassSelector", function (props) {
        return props.layerClasses;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "layerTypeOptionsSelector", (0, _reselect.createSelector)(_this.layerClassSelector, function (layerClasses) {
        return Object.keys(layerClasses).map(function (key) {
          var layer = new layerClasses[key]();
          return {
            id: key,
            label: layer.name,
            icon: layer.layerIcon,
            requireData: layer.requireData
          };
        });
      }));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_addEmptyNewLayer", function () {
        var visStateActions = _this.props.visStateActions;
        visStateActions.addLayer();
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_handleSort", function (_ref5) {
        var oldIndex = _ref5.oldIndex,
            newIndex = _ref5.newIndex;
        var visStateActions = _this.props.visStateActions;
        visStateActions.reorderLayer((0, _dataUtils.arrayMove)(_this.props.layerOrder, oldIndex, newIndex));

        _this.setState({
          isSorting: false
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onSortStart", function () {
        _this.setState({
          isSorting: true
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_updateBeforeSortStart", function (_ref6) {
        var index = _ref6.index;
        // if layer config is active, close it
        var _this$props = _this.props,
            layerOrder = _this$props.layerOrder,
            layers = _this$props.layers,
            visStateActions = _this$props.visStateActions;
        var layerIdx = layerOrder[index];

        if (layers[layerIdx].config.isConfigActive) {
          visStateActions.layerConfigChange(layers[layerIdx], {
            isConfigActive: false
          });
        }
      });
      return _this;
    }

    (0, _createClass2["default"])(LayerManager, [{
      key: "render",
      value: function render() {
        var _this2 = this;

        var _this$props2 = this.props,
            layers = _this$props2.layers,
            datasets = _this$props2.datasets,
            intl = _this$props2.intl,
            layerOrder = _this$props2.layerOrder,
            showAddDataModal = _this$props2.showAddDataModal,
            showDatasetTable = _this$props2.showDatasetTable,
            removeDataset = _this$props2.removeDataset,
            uiStateActions = _this$props2.uiStateActions,
            visStateActions = _this$props2.visStateActions;
        var openModal = uiStateActions.toggleModal;
        var defaultDataset = Object.keys(datasets)[0];
        var layerTypeOptions = this.layerTypeOptionsSelector(this.props);
        var layerActions = {
          layerColorUIChange: visStateActions.layerColorUIChange,
          layerConfigChange: visStateActions.layerConfigChange,
          layerVisualChannelConfigChange: visStateActions.layerVisualChannelConfigChange,
          layerTypeChange: visStateActions.layerTypeChange,
          layerVisConfigChange: visStateActions.layerVisConfigChange,
          layerTextLabelChange: visStateActions.layerTextLabelChange,
          removeLayer: visStateActions.removeLayer,
          duplicateLayer: visStateActions.duplicateLayer
        };
        var panelProps = {
          datasets: datasets,
          openModal: openModal,
          layerTypeOptions: layerTypeOptions
        };
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: "layer-manager"
        }, /*#__PURE__*/_react["default"].createElement(SourceDataCatalog, {
          datasets: datasets,
          showDatasetTable: showDatasetTable,
          removeDataset: removeDataset,
          showDeleteDataset: true
        }), /*#__PURE__*/_react["default"].createElement(AddDataButton, {
          onClick: showAddDataModal,
          isInactive: !defaultDataset
        }), /*#__PURE__*/_react["default"].createElement(_styledComponents2.SidePanelDivider, null), /*#__PURE__*/_react["default"].createElement(_styledComponents2.SidePanelSection, null, /*#__PURE__*/_react["default"].createElement(WrappedSortableContainer, {
          onSortEnd: this._handleSort,
          onSortStart: this._onSortStart,
          updateBeforeSortStart: this._updateBeforeSortStart,
          lockAxis: "y",
          helperClass: "sorting-layers",
          useDragHandle: true
        }, layerOrder.map(function (layerIdx, index) {
          return !layers[layerIdx].config.hidden && /*#__PURE__*/_react["default"].createElement(SortableItem, {
            key: "layer-".concat(layerIdx),
            index: index,
            isSorting: _this2.state.isSorting
          }, /*#__PURE__*/_react["default"].createElement(LayerPanel, (0, _extends2["default"])({}, panelProps, layerActions, {
            sortData: layerIdx,
            key: layers[layerIdx].id,
            idx: layerIdx,
            layer: layers[layerIdx]
          })));
        }))), /*#__PURE__*/_react["default"].createElement(_styledComponents2.SidePanelSection, null, defaultDataset ? /*#__PURE__*/_react["default"].createElement(_styledComponents2.Button, {
          className: "add-layer-button",
          onClick: this._addEmptyNewLayer,
          width: "105px"
        }, /*#__PURE__*/_react["default"].createElement(_icons.Add, {
          height: "12px"
        }), /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
          id: 'layerManager.addLayer'
        })) : null), /*#__PURE__*/_react["default"].createElement(LayerBlendingSelector, {
          layerBlending: this.props.layerBlending,
          updateLayerBlending: visStateActions.updateLayerBlending,
          intl: intl
        }));
      }
    }]);
    return LayerManager;
  }(_react.Component);

  (0, _defineProperty2["default"])(LayerManager, "propTypes", {
    datasets: _propTypes["default"].object.isRequired,
    layerBlending: _propTypes["default"].string.isRequired,
    layerClasses: _propTypes["default"].object.isRequired,
    layers: _propTypes["default"].arrayOf(_propTypes["default"].any).isRequired,
    visStateActions: _propTypes["default"].object.isRequired,
    // functions
    removeDataset: _propTypes["default"].func.isRequired,
    showDatasetTable: _propTypes["default"].func.isRequired
  });
  return (0, _reactIntl.injectIntl)(LayerManager);
}

var _default = LayerManagerFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItbWFuYWdlci5qcyJdLCJuYW1lcyI6WyJMYXllckJsZW5kaW5nU2VsZWN0b3IiLCJsYXllckJsZW5kaW5nIiwidXBkYXRlTGF5ZXJCbGVuZGluZyIsImludGwiLCJsYWJlbGVkTGF5ZXJCbGVuZGluZ3MiLCJPYmplY3QiLCJrZXlzIiwiTEFZRVJfQkxFTkRJTkdTIiwicmVkdWNlIiwiYWNjIiwiY3VycmVudCIsImZvcm1hdE1lc3NhZ2UiLCJpZCIsImxhYmVsIiwib25DaGFuZ2UiLCJibGVuZGluZyIsIlNvcnRhYmxlU3R5bGVkSXRlbSIsInN0eWxlZCIsImRpdiIsInByb3BzIiwidGhlbWUiLCJkcm9wZG93bldyYXBwZXJaIiwicGFuZWxCYWNrZ3JvdW5kSG92ZXIiLCJmb250RmFtaWx5IiwiZm9udFdlaWdodCIsImZvbnRTaXplIiwibGluZUhlaWdodCIsInRleHRDb2xvckhsIiwiQWRkRGF0YUJ1dHRvbkZhY3RvcnkiLCJBZGREYXRhQnV0dG9uIiwib25DbGljayIsImlzSW5hY3RpdmUiLCJMYXllck1hbmFnZXJGYWN0b3J5IiwiZGVwcyIsIkxheWVyUGFuZWxGYWN0b3J5IiwiU291cmNlRGF0YUNhdGFsb2dGYWN0b3J5IiwiTGF5ZXJQYW5lbCIsIlNvdXJjZURhdGFDYXRhbG9nIiwiU29ydGFibGVJdGVtIiwiY2hpbGRyZW4iLCJpc1NvcnRpbmciLCJzb3J0aW5nIiwiV3JhcHBlZFNvcnRhYmxlQ29udGFpbmVyIiwiTGF5ZXJNYW5hZ2VyIiwibGF5ZXJDbGFzc2VzIiwibGF5ZXJDbGFzc1NlbGVjdG9yIiwibWFwIiwia2V5IiwibGF5ZXIiLCJuYW1lIiwiaWNvbiIsImxheWVySWNvbiIsInJlcXVpcmVEYXRhIiwidmlzU3RhdGVBY3Rpb25zIiwiYWRkTGF5ZXIiLCJvbGRJbmRleCIsIm5ld0luZGV4IiwicmVvcmRlckxheWVyIiwibGF5ZXJPcmRlciIsInNldFN0YXRlIiwiaW5kZXgiLCJsYXllcnMiLCJsYXllcklkeCIsImNvbmZpZyIsImlzQ29uZmlnQWN0aXZlIiwibGF5ZXJDb25maWdDaGFuZ2UiLCJkYXRhc2V0cyIsInNob3dBZGREYXRhTW9kYWwiLCJzaG93RGF0YXNldFRhYmxlIiwicmVtb3ZlRGF0YXNldCIsInVpU3RhdGVBY3Rpb25zIiwib3Blbk1vZGFsIiwidG9nZ2xlTW9kYWwiLCJkZWZhdWx0RGF0YXNldCIsImxheWVyVHlwZU9wdGlvbnMiLCJsYXllclR5cGVPcHRpb25zU2VsZWN0b3IiLCJsYXllckFjdGlvbnMiLCJsYXllckNvbG9yVUlDaGFuZ2UiLCJsYXllclZpc3VhbENoYW5uZWxDb25maWdDaGFuZ2UiLCJsYXllclR5cGVDaGFuZ2UiLCJsYXllclZpc0NvbmZpZ0NoYW5nZSIsImxheWVyVGV4dExhYmVsQ2hhbmdlIiwicmVtb3ZlTGF5ZXIiLCJkdXBsaWNhdGVMYXllciIsInBhbmVsUHJvcHMiLCJfaGFuZGxlU29ydCIsIl9vblNvcnRTdGFydCIsIl91cGRhdGVCZWZvcmVTb3J0U3RhcnQiLCJoaWRkZW4iLCJzdGF0ZSIsIl9hZGRFbXB0eU5ld0xheWVyIiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsInN0cmluZyIsImFycmF5T2YiLCJhbnkiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBT0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLHFCQUFxQixHQUFHLFNBQXhCQSxxQkFBd0IsT0FBZ0Q7QUFBQSxNQUE5Q0MsYUFBOEMsUUFBOUNBLGFBQThDO0FBQUEsTUFBL0JDLG1CQUErQixRQUEvQkEsbUJBQStCO0FBQUEsTUFBVkMsSUFBVSxRQUFWQSxJQUFVO0FBQzVFLE1BQU1DLHFCQUFxQixHQUFHQyxNQUFNLENBQUND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QkFBVU0sSUFBVixDQUFlSixVQVBiO0FBUWpCMUIsSUFBQUEsZ0JBQWdCLEVBQUV3QixzQkFBVU0sSUFBVixDQUFlSjtBQVJoQixHQWhCb0Q7QUE2SnpFLFNBQU8sMkJBQVduRCxZQUFYLENBQVA7QUFDRDs7ZUFFY1gsbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnQsIHVzZUNhbGxiYWNrfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcblxuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7U29ydGFibGVDb250YWluZXIsIFNvcnRhYmxlRWxlbWVudH0gZnJvbSAncmVhY3Qtc29ydGFibGUtaG9jJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtjcmVhdGVTZWxlY3Rvcn0gZnJvbSAncmVzZWxlY3QnO1xuaW1wb3J0IHtpbmplY3RJbnRsfSBmcm9tICdyZWFjdC1pbnRsJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAnbG9jYWxpemF0aW9uJztcbmltcG9ydCB7YXJyYXlNb3ZlfSBmcm9tICd1dGlscy9kYXRhLXV0aWxzJztcblxuaW1wb3J0IExheWVyUGFuZWxGYWN0b3J5IGZyb20gJy4vbGF5ZXItcGFuZWwvbGF5ZXItcGFuZWwnO1xuaW1wb3J0IFNvdXJjZURhdGFDYXRhbG9nRmFjdG9yeSBmcm9tICcuL2NvbW1vbi9zb3VyY2UtZGF0YS1jYXRhbG9nJztcbmltcG9ydCB7QWRkfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQgSXRlbVNlbGVjdG9yIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2l0ZW0tc2VsZWN0b3IvaXRlbS1zZWxlY3Rvcic7XG5pbXBvcnQge1xuICBCdXR0b24sXG4gIFBhbmVsTGFiZWwsXG4gIFNpZGVQYW5lbERpdmlkZXIsXG4gIFNpZGVQYW5lbFNlY3Rpb25cbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQge0xBWUVSX0JMRU5ESU5HU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5jb25zdCBMYXllckJsZW5kaW5nU2VsZWN0b3IgPSAoe2xheWVyQmxlbmRpbmcsIHVwZGF0ZUxheWVyQmxlbmRpbmcsIGludGx9KSA9PiB7XG4gIGNvbnN0IGxhYmVsZWRMYXllckJsZW5kaW5ncyA9IE9iamVjdC5rZXlzKExBWUVSX0JMRU5ESU5HUykucmVkdWNlKFxuICAgIChhY2MsIGN1cnJlbnQpID0+ICh7XG4gICAgICAuLi5hY2MsXG4gICAgICBbaW50bC5mb3JtYXRNZXNzYWdlKHtpZDogTEFZRVJfQkxFTkRJTkdTW2N1cnJlbnRdLmxhYmVsfSldOiBjdXJyZW50XG4gICAgfSksXG4gICAge31cbiAgKTtcblxuICBjb25zdCBvbkNoYW5nZSA9IHVzZUNhbGxiYWNrKGJsZW5kaW5nID0+IHVwZGF0ZUxheWVyQmxlbmRpbmcobGFiZWxlZExheWVyQmxlbmRpbmdzW2JsZW5kaW5nXSksIFtcbiAgICB1cGRhdGVMYXllckJsZW5kaW5nLFxuICAgIGxhYmVsZWRMYXllckJsZW5kaW5nc1xuICBdKTtcblxuICByZXR1cm4gKFxuICAgIDxTaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgPFBhbmVsTGFiZWw+XG4gICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPVwibGF5ZXJCbGVuZGluZy50aXRsZVwiIC8+XG4gICAgICA8L1BhbmVsTGFiZWw+XG4gICAgICA8SXRlbVNlbGVjdG9yXG4gICAgICAgIHNlbGVjdGVkSXRlbXM9e2ludGwuZm9ybWF0TWVzc2FnZSh7aWQ6IExBWUVSX0JMRU5ESU5HU1tsYXllckJsZW5kaW5nXS5sYWJlbH0pfVxuICAgICAgICBvcHRpb25zPXtPYmplY3Qua2V5cyhsYWJlbGVkTGF5ZXJCbGVuZGluZ3MpfVxuICAgICAgICBtdWx0aVNlbGVjdD17ZmFsc2V9XG4gICAgICAgIHNlYXJjaGFibGU9e2ZhbHNlfVxuICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAvPlxuICAgIDwvU2lkZVBhbmVsU2VjdGlvbj5cbiAgKTtcbn07XG5cbi8vIG1ha2Ugc3VyZSB0aGUgZWxlbWVudCBpcyBhbHdheXMgdmlzaWJsZSB3aGlsZSBpcyBiZWluZyBkcmFnZ2VkXG4vLyBpdGVtIGJlaW5nIGRyYWdnZWQgaXMgYXBwZW5kZWQgaW4gYm9keSwgaGVyZSB0byByZXNldCBpdHMgZ2xvYmFsIHN0eWxlXG5jb25zdCBTb3J0YWJsZVN0eWxlZEl0ZW0gPSBzdHlsZWQuZGl2YFxuICB6LWluZGV4OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duV3JhcHBlclogKyAxfTtcblxuICAmLnNvcnRpbmcge1xuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICB9XG5cbiAgJi5zb3J0aW5nLWxheWVycyAubGF5ZXItcGFuZWxfX2hlYWRlciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJhY2tncm91bmRIb3Zlcn07XG4gICAgZm9udC1mYW1pbHk6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZm9udEZhbWlseX07XG4gICAgZm9udC13ZWlnaHQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZm9udFdlaWdodH07XG4gICAgZm9udC1zaXplOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmZvbnRTaXplfTtcbiAgICBsaW5lLWhlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5saW5lSGVpZ2h0fTtcbiAgICAqLFxuICAgICo6YmVmb3JlLFxuICAgICo6YWZ0ZXIge1xuICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICB9XG4gICAgLmxheWVyX19kcmFnLWhhbmRsZSB7XG4gICAgICBvcGFjaXR5OiAxO1xuICAgICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICAgIH1cbiAgfVxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIEFkZERhdGFCdXR0b25GYWN0b3J5KCkge1xuICBjb25zdCBBZGREYXRhQnV0dG9uID0gKHtvbkNsaWNrLCBpc0luYWN0aXZlfSkgPT4gKFxuICAgIDxCdXR0b25cbiAgICAgIGNsYXNzTmFtZT1cImFkZC1kYXRhLWJ1dHRvblwiXG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgaXNJbmFjdGl2ZT17IWlzSW5hY3RpdmV9XG4gICAgICB3aWR0aD1cIjEwNXB4XCJcbiAgICAgIHNlY29uZGFyeVxuICAgID5cbiAgICAgIDxBZGQgaGVpZ2h0PVwiMTJweFwiIC8+XG4gICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J2xheWVyTWFuYWdlci5hZGREYXRhJ30gLz5cbiAgICA8L0J1dHRvbj5cbiAgKTtcblxuICByZXR1cm4gQWRkRGF0YUJ1dHRvbjtcbn1cblxuTGF5ZXJNYW5hZ2VyRmFjdG9yeS5kZXBzID0gW0FkZERhdGFCdXR0b25GYWN0b3J5LCBMYXllclBhbmVsRmFjdG9yeSwgU291cmNlRGF0YUNhdGFsb2dGYWN0b3J5XTtcblxuZnVuY3Rpb24gTGF5ZXJNYW5hZ2VyRmFjdG9yeShBZGREYXRhQnV0dG9uLCBMYXllclBhbmVsLCBTb3VyY2VEYXRhQ2F0YWxvZykge1xuICAvLyBCeSB3cmFwcGluZyBsYXllciBwYW5lbCB1c2luZyBhIHNvcnRhYmxlIGVsZW1lbnQgd2UgZG9uJ3QgaGF2ZSB0byBpbXBsZW1lbnQgdGhlIGRyYWcgYW5kIGRyb3AgbG9naWMgaW50byB0aGUgcGFuZWwgaXRzZWxmO1xuICAvLyBEZXZlbG9wZXJzIGNhbiBwcm92aWRlIGFueSBsYXllciBwYW5lbCBpbXBsZW1lbnRhdGlvbiBhbmQgaXQgd2lsbCBzdGlsbCBiZSBzb3J0YWJsZVxuICBjb25zdCBTb3J0YWJsZUl0ZW0gPSBTb3J0YWJsZUVsZW1lbnQoKHtjaGlsZHJlbiwgaXNTb3J0aW5nfSkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICA8U29ydGFibGVTdHlsZWRJdGVtIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnc29ydGFibGUtbGF5ZXItaXRlbXMnLCB7c29ydGluZzogaXNTb3J0aW5nfSl9PlxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICA8L1NvcnRhYmxlU3R5bGVkSXRlbT5cbiAgICApO1xuICB9KTtcblxuICBjb25zdCBXcmFwcGVkU29ydGFibGVDb250YWluZXIgPSBTb3J0YWJsZUNvbnRhaW5lcigoe2NoaWxkcmVufSkgPT4ge1xuICAgIHJldHVybiA8ZGl2PntjaGlsZHJlbn08L2Rpdj47XG4gIH0pO1xuXG4gIGNsYXNzIExheWVyTWFuYWdlciBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAgIGRhdGFzZXRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICBsYXllckJsZW5kaW5nOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBsYXllckNsYXNzZXM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIGxheWVyczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmFueSkuaXNSZXF1aXJlZCxcbiAgICAgIHZpc1N0YXRlQWN0aW9uczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgLy8gZnVuY3Rpb25zXG4gICAgICByZW1vdmVEYXRhc2V0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgc2hvd0RhdGFzZXRUYWJsZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICAgIH07XG4gICAgc3RhdGUgPSB7XG4gICAgICBpc1NvcnRpbmc6IGZhbHNlXG4gICAgfTtcblxuICAgIGxheWVyQ2xhc3NTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmxheWVyQ2xhc3NlcztcbiAgICBsYXllclR5cGVPcHRpb25zU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3Rvcih0aGlzLmxheWVyQ2xhc3NTZWxlY3RvciwgbGF5ZXJDbGFzc2VzID0+XG4gICAgICBPYmplY3Qua2V5cyhsYXllckNsYXNzZXMpLm1hcChrZXkgPT4ge1xuICAgICAgICBjb25zdCBsYXllciA9IG5ldyBsYXllckNsYXNzZXNba2V5XSgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlkOiBrZXksXG4gICAgICAgICAgbGFiZWw6IGxheWVyLm5hbWUsXG4gICAgICAgICAgaWNvbjogbGF5ZXIubGF5ZXJJY29uLFxuICAgICAgICAgIHJlcXVpcmVEYXRhOiBsYXllci5yZXF1aXJlRGF0YVxuICAgICAgICB9O1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgX2FkZEVtcHR5TmV3TGF5ZXIgPSAoKSA9PiB7XG4gICAgICBjb25zdCB7dmlzU3RhdGVBY3Rpb25zfSA9IHRoaXMucHJvcHM7XG4gICAgICB2aXNTdGF0ZUFjdGlvbnMuYWRkTGF5ZXIoKTtcbiAgICB9O1xuXG4gICAgX2hhbmRsZVNvcnQgPSAoe29sZEluZGV4LCBuZXdJbmRleH0pID0+IHtcbiAgICAgIGNvbnN0IHt2aXNTdGF0ZUFjdGlvbnN9ID0gdGhpcy5wcm9wcztcbiAgICAgIHZpc1N0YXRlQWN0aW9ucy5yZW9yZGVyTGF5ZXIoYXJyYXlNb3ZlKHRoaXMucHJvcHMubGF5ZXJPcmRlciwgb2xkSW5kZXgsIG5ld0luZGV4KSk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtpc1NvcnRpbmc6IGZhbHNlfSk7XG4gICAgfTtcblxuICAgIF9vblNvcnRTdGFydCA9ICgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2lzU29ydGluZzogdHJ1ZX0pO1xuICAgIH07XG5cbiAgICBfdXBkYXRlQmVmb3JlU29ydFN0YXJ0ID0gKHtpbmRleH0pID0+IHtcbiAgICAgIC8vIGlmIGxheWVyIGNvbmZpZyBpcyBhY3RpdmUsIGNsb3NlIGl0XG4gICAgICBjb25zdCB7bGF5ZXJPcmRlciwgbGF5ZXJzLCB2aXNTdGF0ZUFjdGlvbnN9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IGxheWVySWR4ID0gbGF5ZXJPcmRlcltpbmRleF07XG4gICAgICBpZiAobGF5ZXJzW2xheWVySWR4XS5jb25maWcuaXNDb25maWdBY3RpdmUpIHtcbiAgICAgICAgdmlzU3RhdGVBY3Rpb25zLmxheWVyQ29uZmlnQ2hhbmdlKGxheWVyc1tsYXllcklkeF0sIHtpc0NvbmZpZ0FjdGl2ZTogZmFsc2V9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmVuZGVyKCkge1xuICAgICAgY29uc3Qge1xuICAgICAgICBsYXllcnMsXG4gICAgICAgIGRhdGFzZXRzLFxuICAgICAgICBpbnRsLFxuICAgICAgICBsYXllck9yZGVyLFxuICAgICAgICBzaG93QWRkRGF0YU1vZGFsLFxuICAgICAgICBzaG93RGF0YXNldFRhYmxlLFxuICAgICAgICByZW1vdmVEYXRhc2V0LFxuICAgICAgICB1aVN0YXRlQWN0aW9ucyxcbiAgICAgICAgdmlzU3RhdGVBY3Rpb25zXG4gICAgICB9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IHt0b2dnbGVNb2RhbDogb3Blbk1vZGFsfSA9IHVpU3RhdGVBY3Rpb25zO1xuICAgICAgY29uc3QgZGVmYXVsdERhdGFzZXQgPSBPYmplY3Qua2V5cyhkYXRhc2V0cylbMF07XG4gICAgICBjb25zdCBsYXllclR5cGVPcHRpb25zID0gdGhpcy5sYXllclR5cGVPcHRpb25zU2VsZWN0b3IodGhpcy5wcm9wcyk7XG5cbiAgICAgIGNvbnN0IGxheWVyQWN0aW9ucyA9IHtcbiAgICAgICAgbGF5ZXJDb2xvclVJQ2hhbmdlOiB2aXNTdGF0ZUFjdGlvbnMubGF5ZXJDb2xvclVJQ2hhbmdlLFxuICAgICAgICBsYXllckNvbmZpZ0NoYW5nZTogdmlzU3RhdGVBY3Rpb25zLmxheWVyQ29uZmlnQ2hhbmdlLFxuICAgICAgICBsYXllclZpc3VhbENoYW5uZWxDb25maWdDaGFuZ2U6IHZpc1N0YXRlQWN0aW9ucy5sYXllclZpc3VhbENoYW5uZWxDb25maWdDaGFuZ2UsXG4gICAgICAgIGxheWVyVHlwZUNoYW5nZTogdmlzU3RhdGVBY3Rpb25zLmxheWVyVHlwZUNoYW5nZSxcbiAgICAgICAgbGF5ZXJWaXNDb25maWdDaGFuZ2U6IHZpc1N0YXRlQWN0aW9ucy5sYXllclZpc0NvbmZpZ0NoYW5nZSxcbiAgICAgICAgbGF5ZXJUZXh0TGFiZWxDaGFuZ2U6IHZpc1N0YXRlQWN0aW9ucy5sYXllclRleHRMYWJlbENoYW5nZSxcbiAgICAgICAgcmVtb3ZlTGF5ZXI6IHZpc1N0YXRlQWN0aW9ucy5yZW1vdmVMYXllcixcbiAgICAgICAgZHVwbGljYXRlTGF5ZXI6IHZpc1N0YXRlQWN0aW9ucy5kdXBsaWNhdGVMYXllclxuICAgICAgfTtcblxuICAgICAgY29uc3QgcGFuZWxQcm9wcyA9IHtcbiAgICAgICAgZGF0YXNldHMsXG4gICAgICAgIG9wZW5Nb2RhbCxcbiAgICAgICAgbGF5ZXJUeXBlT3B0aW9uc1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsYXllci1tYW5hZ2VyXCI+XG4gICAgICAgICAgPFNvdXJjZURhdGFDYXRhbG9nXG4gICAgICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgICAgICBzaG93RGF0YXNldFRhYmxlPXtzaG93RGF0YXNldFRhYmxlfVxuICAgICAgICAgICAgcmVtb3ZlRGF0YXNldD17cmVtb3ZlRGF0YXNldH1cbiAgICAgICAgICAgIHNob3dEZWxldGVEYXRhc2V0XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8QWRkRGF0YUJ1dHRvbiBvbkNsaWNrPXtzaG93QWRkRGF0YU1vZGFsfSBpc0luYWN0aXZlPXshZGVmYXVsdERhdGFzZXR9IC8+XG4gICAgICAgICAgPFNpZGVQYW5lbERpdmlkZXIgLz5cbiAgICAgICAgICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICAgIDxXcmFwcGVkU29ydGFibGVDb250YWluZXJcbiAgICAgICAgICAgICAgb25Tb3J0RW5kPXt0aGlzLl9oYW5kbGVTb3J0fVxuICAgICAgICAgICAgICBvblNvcnRTdGFydD17dGhpcy5fb25Tb3J0U3RhcnR9XG4gICAgICAgICAgICAgIHVwZGF0ZUJlZm9yZVNvcnRTdGFydD17dGhpcy5fdXBkYXRlQmVmb3JlU29ydFN0YXJ0fVxuICAgICAgICAgICAgICBsb2NrQXhpcz1cInlcIlxuICAgICAgICAgICAgICBoZWxwZXJDbGFzcz1cInNvcnRpbmctbGF5ZXJzXCJcbiAgICAgICAgICAgICAgdXNlRHJhZ0hhbmRsZVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7bGF5ZXJPcmRlci5tYXAoXG4gICAgICAgICAgICAgICAgKGxheWVySWR4LCBpbmRleCkgPT5cbiAgICAgICAgICAgICAgICAgICFsYXllcnNbbGF5ZXJJZHhdLmNvbmZpZy5oaWRkZW4gJiYgKFxuICAgICAgICAgICAgICAgICAgICA8U29ydGFibGVJdGVtXG4gICAgICAgICAgICAgICAgICAgICAga2V5PXtgbGF5ZXItJHtsYXllcklkeH1gfVxuICAgICAgICAgICAgICAgICAgICAgIGluZGV4PXtpbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICBpc1NvcnRpbmc9e3RoaXMuc3RhdGUuaXNTb3J0aW5nfVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPExheWVyUGFuZWxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsuLi5wYW5lbFByb3BzfVxuICAgICAgICAgICAgICAgICAgICAgICAgey4uLmxheWVyQWN0aW9uc31cbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnREYXRhPXtsYXllcklkeH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGtleT17bGF5ZXJzW2xheWVySWR4XS5pZH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlkeD17bGF5ZXJJZHh9XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXllcj17bGF5ZXJzW2xheWVySWR4XX1cbiAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8L1NvcnRhYmxlSXRlbT5cbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvV3JhcHBlZFNvcnRhYmxlQ29udGFpbmVyPlxuICAgICAgICAgIDwvU2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICAgIHtkZWZhdWx0RGF0YXNldCA/IChcbiAgICAgICAgICAgICAgPEJ1dHRvbiBjbGFzc05hbWU9XCJhZGQtbGF5ZXItYnV0dG9uXCIgb25DbGljaz17dGhpcy5fYWRkRW1wdHlOZXdMYXllcn0gd2lkdGg9XCIxMDVweFwiPlxuICAgICAgICAgICAgICAgIDxBZGQgaGVpZ2h0PVwiMTJweFwiIC8+XG4gICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydsYXllck1hbmFnZXIuYWRkTGF5ZXInfSAvPlxuICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIDwvU2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICA8TGF5ZXJCbGVuZGluZ1NlbGVjdG9yXG4gICAgICAgICAgICBsYXllckJsZW5kaW5nPXt0aGlzLnByb3BzLmxheWVyQmxlbmRpbmd9XG4gICAgICAgICAgICB1cGRhdGVMYXllckJsZW5kaW5nPXt2aXNTdGF0ZUFjdGlvbnMudXBkYXRlTGF5ZXJCbGVuZGluZ31cbiAgICAgICAgICAgIGludGw9e2ludGx9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gaW5qZWN0SW50bChMYXllck1hbmFnZXIpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBMYXllck1hbmFnZXJGYWN0b3J5O1xuIl19