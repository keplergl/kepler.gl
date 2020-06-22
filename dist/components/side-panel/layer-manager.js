"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AddDataButtonFactory = AddDataButtonFactory;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactSortableHoc = require("react-sortable-hoc");

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reselect = require("reselect");

var _reactIntl = require("react-intl");

var _dataUtils = require("../../utils/data-utils");

var _layerPanel = _interopRequireDefault(require("./layer-panel/layer-panel"));

var _sourceDataCatalog = _interopRequireDefault(require("./common/source-data-catalog"));

var _icons = require("../common/icons");

var _itemSelector = _interopRequireDefault(require("../common/item-selector/item-selector"));

var _styledComponents2 = require("../common/styled-components");

var _defaultSettings = require("../../constants/default-settings");

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  z-index: ", ";\n\n  &.sorting {\n    pointer-events: none;\n  }\n\n  &.sorting-layers .layer-panel__header {\n    background-color: ", ";\n    font-family: ", ";\n    font-weight: ", ";\n    font-size: ", ";\n    line-height: ", ";\n    *,\n    *:before,\n    *:after {\n      box-sizing: border-box;\n    }\n    .layer__drag-handle {\n      opacity: 1;\n      color: ", ";\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var LayerBlendingSelector = function LayerBlendingSelector(_ref) {
  var layerBlending = _ref.layerBlending,
      updateLayerBlending = _ref.updateLayerBlending,
      intl = _ref.intl;
  var labeledLayerBlendings = Object.keys(_defaultSettings.LAYER_BLENDINGS).reduce(function (acc, current) {
    return _objectSpread({}, acc, (0, _defineProperty2["default"])({}, intl.formatMessage({
      id: _defaultSettings.LAYER_BLENDINGS[current].label
    }), current));
  }, {});
  var onChange = (0, _react.useCallback)(function (blending) {
    return updateLayerBlending(labeledLayerBlendings[blending]);
  }, [updateLayerBlending, labeledLayerBlendings]);
  return _react["default"].createElement(_styledComponents2.SidePanelSection, null, _react["default"].createElement(_styledComponents2.PanelLabel, null, _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: "layerBlending.title"
  })), _react["default"].createElement(_itemSelector["default"], {
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


var SortableStyledItem = _styledComponents["default"].div(_templateObject(), function (props) {
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
    return _react["default"].createElement(_styledComponents2.Button, {
      className: "add-data-button",
      onClick: onClick,
      isInactive: !isInactive,
      width: "105px",
      secondary: true
    }, _react["default"].createElement(_icons.Add, {
      height: "12px"
    }), _react["default"].createElement(_reactIntl.FormattedMessage, {
      id: 'layerManager.addData'
    }));
  };

  return AddDataButton;
}

LayerManagerFactory.deps = [AddDataButtonFactory, _layerPanel["default"], _sourceDataCatalog["default"]];

function LayerManagerFactory(AddDataButton, LayerPanel, SourceDataCatalog) {
  // By wrapping layer panel using a sortable element we don't have to implement the drag and drop logic into the panel itself;
  // Developers can provide any layer panel implementation and it will still be sortable
  var SortableItem = (0, _reactSortableHoc.sortableElement)(function (_ref3) {
    var children = _ref3.children,
        isSorting = _ref3.isSorting;
    return _react["default"].createElement(SortableStyledItem, {
      className: (0, _classnames["default"])('sortable-layer-items', {
        sorting: isSorting
      })
    }, children);
  });
  var SortableContainer = (0, _reactSortableHoc.sortableContainer)(function (_ref4) {
    var children = _ref4.children;
    return _react["default"].createElement("div", null, children);
  });

  var LayerManager =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(LayerManager, _Component);

    function LayerManager() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2["default"])(this, LayerManager);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(LayerManager)).call.apply(_getPrototypeOf2, [this].concat(args)));
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
            icon: layer.layerIcon
          };
        });
      }));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_addEmptyNewLayer", function () {
        _this.props.addLayer();
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_handleSort", function (_ref5) {
        var oldIndex = _ref5.oldIndex,
            newIndex = _ref5.newIndex;

        _this.props.updateLayerOrder((0, _dataUtils.arrayMove)(_this.props.layerOrder, oldIndex, newIndex));

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
            layerConfigChange = _this$props.layerConfigChange;
        var layerIdx = layerOrder[index];

        if (layers[layerIdx].config.isConfigActive) {
          layerConfigChange(layers[layerIdx], {
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
            layerOrder = _this$props2.layerOrder,
            openModal = _this$props2.openModal,
            intl = _this$props2.intl;
        var defaultDataset = Object.keys(datasets)[0];
        var layerTypeOptions = this.layerTypeOptionsSelector(this.props);
        var layerActions = {
          layerColorUIChange: this.props.layerColorUIChange,
          layerConfigChange: this.props.layerConfigChange,
          layerVisualChannelConfigChange: this.props.layerVisualChannelConfigChange,
          layerTypeChange: this.props.layerTypeChange,
          layerVisConfigChange: this.props.layerVisConfigChange,
          layerTextLabelChange: this.props.layerTextLabelChange,
          removeLayer: this.props.removeLayer
        };
        var panelProps = {
          datasets: datasets,
          openModal: openModal,
          layerTypeOptions: layerTypeOptions
        };
        return _react["default"].createElement("div", {
          className: "layer-manager"
        }, _react["default"].createElement(SourceDataCatalog, {
          datasets: datasets,
          showDatasetTable: this.props.showDatasetTable,
          removeDataset: this.props.removeDataset,
          showDeleteDataset: true
        }), _react["default"].createElement(AddDataButton, {
          onClick: this.props.showAddDataModal,
          isInactive: !defaultDataset
        }), _react["default"].createElement(_styledComponents2.SidePanelDivider, null), _react["default"].createElement(_styledComponents2.SidePanelSection, null, _react["default"].createElement(SortableContainer, {
          onSortEnd: this._handleSort,
          onSortStart: this._onSortStart,
          updateBeforeSortStart: this._updateBeforeSortStart,
          lockAxis: "y",
          helperClass: "sorting-layers",
          useDragHandle: true
        }, layerOrder.map(function (layerIdx, index) {
          return !layers[layerIdx].config.hidden && _react["default"].createElement(SortableItem, {
            key: "layer-".concat(layerIdx),
            index: index,
            isSorting: _this2.state.isSorting
          }, _react["default"].createElement(LayerPanel, (0, _extends2["default"])({}, panelProps, layerActions, {
            sortData: layerIdx,
            key: layers[layerIdx].id,
            idx: layerIdx,
            layer: layers[layerIdx]
          })));
        }))), _react["default"].createElement(_styledComponents2.SidePanelSection, null, defaultDataset ? _react["default"].createElement(_styledComponents2.Button, {
          className: "add-layer-button",
          onClick: this._addEmptyNewLayer,
          width: "105px"
        }, _react["default"].createElement(_icons.Add, {
          height: "12px"
        }), _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'layerManager.addLayer'
        })) : null), _react["default"].createElement(LayerBlendingSelector, {
          layerBlending: this.props.layerBlending,
          updateLayerBlending: this.props.updateLayerBlending,
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
    // functions
    addLayer: _propTypes["default"].func.isRequired,
    layerColorUIChange: _propTypes["default"].func.isRequired,
    layerConfigChange: _propTypes["default"].func.isRequired,
    layerTextLabelChange: _propTypes["default"].func.isRequired,
    layerVisualChannelConfigChange: _propTypes["default"].func.isRequired,
    layerTypeChange: _propTypes["default"].func.isRequired,
    layerVisConfigChange: _propTypes["default"].func.isRequired,
    openModal: _propTypes["default"].func.isRequired,
    removeLayer: _propTypes["default"].func.isRequired,
    removeDataset: _propTypes["default"].func.isRequired,
    showDatasetTable: _propTypes["default"].func.isRequired,
    updateLayerBlending: _propTypes["default"].func.isRequired,
    updateLayerOrder: _propTypes["default"].func.isRequired
  });
  return (0, _reactIntl.injectIntl)(LayerManager);
}

var _default = LayerManagerFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItbWFuYWdlci5qcyJdLCJuYW1lcyI6WyJMYXllckJsZW5kaW5nU2VsZWN0b3IiLCJsYXllckJsZW5kaW5nIiwidXBkYXRlTGF5ZXJCbGVuZGluZyIsImludGwiLCJsYWJlbGVkTGF5ZXJCbGVuZGluZ3MiLCJPYmplY3QiLCJrZXlzIiwiTEFZRVJfQkxFTkRJTkdTIiwicmVkdWNlIiwiYWNjIiwiY3VycmVudCIsImZvcm1hdE1lc3NhZ2UiLCJpZCIsImxhYmVsIiwib25DaGFuZ2UiLCJibGVuZGluZyIsIlNvcnRhYmxlU3R5bGVkSXRlbSIsInN0eWxlZCIsImRpdiIsInByb3BzIiwidGhlbWUiLCJkcm9wZG93bldyYXBwZXJaIiwicGFuZWxCYWNrZ3JvdW5kSG92ZXIiLCJmb250RmFtaWx5IiwiZm9udFdlaWdodCIsImZvbnRTaXplIiwibGluZUhlaWdodCIsInRleHRDb2xvckhsIiwiQWRkRGF0YUJ1dHRvbkZhY3RvcnkiLCJBZGREYXRhQnV0dG9uIiwib25DbGljayIsImlzSW5hY3RpdmUiLCJMYXllck1hbmFnZXJGYWN0b3J5IiwiZGVwcyIsIkxheWVyUGFuZWxGYWN0b3J5IiwiU291cmNlRGF0YUNhdGFsb2dGYWN0b3J5IiwiTGF5ZXJQYW5lbCIsIlNvdXJjZURhdGFDYXRhbG9nIiwiU29ydGFibGVJdGVtIiwiY2hpbGRyZW4iLCJpc1NvcnRpbmciLCJzb3J0aW5nIiwiU29ydGFibGVDb250YWluZXIiLCJMYXllck1hbmFnZXIiLCJsYXllckNsYXNzZXMiLCJsYXllckNsYXNzU2VsZWN0b3IiLCJtYXAiLCJrZXkiLCJsYXllciIsIm5hbWUiLCJpY29uIiwibGF5ZXJJY29uIiwiYWRkTGF5ZXIiLCJvbGRJbmRleCIsIm5ld0luZGV4IiwidXBkYXRlTGF5ZXJPcmRlciIsImxheWVyT3JkZXIiLCJzZXRTdGF0ZSIsImluZGV4IiwibGF5ZXJzIiwibGF5ZXJDb25maWdDaGFuZ2UiLCJsYXllcklkeCIsImNvbmZpZyIsImlzQ29uZmlnQWN0aXZlIiwiZGF0YXNldHMiLCJvcGVuTW9kYWwiLCJkZWZhdWx0RGF0YXNldCIsImxheWVyVHlwZU9wdGlvbnMiLCJsYXllclR5cGVPcHRpb25zU2VsZWN0b3IiLCJsYXllckFjdGlvbnMiLCJsYXllckNvbG9yVUlDaGFuZ2UiLCJsYXllclZpc3VhbENoYW5uZWxDb25maWdDaGFuZ2UiLCJsYXllclR5cGVDaGFuZ2UiLCJsYXllclZpc0NvbmZpZ0NoYW5nZSIsImxheWVyVGV4dExhYmVsQ2hhbmdlIiwicmVtb3ZlTGF5ZXIiLCJwYW5lbFByb3BzIiwic2hvd0RhdGFzZXRUYWJsZSIsInJlbW92ZURhdGFzZXQiLCJzaG93QWRkRGF0YU1vZGFsIiwiX2hhbmRsZVNvcnQiLCJfb25Tb3J0U3RhcnQiLCJfdXBkYXRlQmVmb3JlU29ydFN0YXJ0IiwiaGlkZGVuIiwic3RhdGUiLCJfYWRkRW1wdHlOZXdMYXllciIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJzdHJpbmciLCJhcnJheU9mIiwiYW55IiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQU9BOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEscUJBQXFCLEdBQUcsU0FBeEJBLHFCQUF3QixPQUFnRDtBQUFBLE1BQTlDQyxhQUE4QyxRQUE5Q0EsYUFBOEM7QUFBQSxNQUEvQkMsbUJBQStCLFFBQS9CQSxtQkFBK0I7QUFBQSxNQUFWQyxJQUFVLFFBQVZBLElBQVU7QUFDNUUsTUFBTUMscUJBQXFCLEdBQUdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZQyxnQ0FBWixFQUE2QkMsTUFBN0IsQ0FDNUIsVUFBQ0MsR0FBRCxFQUFNQyxPQUFOO0FBQUEsNkJBQ0tELEdBREwsdUNBRUdOLElB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QmQsSUFBQUEsV0FBVyxFQUFFWSxzQkFBVU0sSUFBVixDQUFlSixVQWRYO0FBZWpCWCxJQUFBQSxhQUFhLEVBQUVTLHNCQUFVTSxJQUFWLENBQWVKLFVBZmI7QUFnQmpCWixJQUFBQSxnQkFBZ0IsRUFBRVUsc0JBQVVNLElBQVYsQ0FBZUosVUFoQmhCO0FBaUJqQnZGLElBQUFBLG1CQUFtQixFQUFFcUYsc0JBQVVNLElBQVYsQ0FBZUosVUFqQm5CO0FBa0JqQmxDLElBQUFBLGdCQUFnQixFQUFFZ0Msc0JBQVVNLElBQVYsQ0FBZUo7QUFsQmhCLEdBaEJvRDtBQXdKekUsU0FBTywyQkFBVzlDLFlBQVgsQ0FBUDtBQUNEOztlQUVjWCxtQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudCwgdXNlQ2FsbGJhY2t9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtzb3J0YWJsZUNvbnRhaW5lciwgc29ydGFibGVFbGVtZW50fSBmcm9tICdyZWFjdC1zb3J0YWJsZS1ob2MnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5pbXBvcnQge0Zvcm1hdHRlZE1lc3NhZ2UsIGluamVjdEludGx9IGZyb20gJ3JlYWN0LWludGwnO1xuaW1wb3J0IHthcnJheU1vdmV9IGZyb20gJ3V0aWxzL2RhdGEtdXRpbHMnO1xuXG5pbXBvcnQgTGF5ZXJQYW5lbEZhY3RvcnkgZnJvbSAnLi9sYXllci1wYW5lbC9sYXllci1wYW5lbCc7XG5pbXBvcnQgU291cmNlRGF0YUNhdGFsb2dGYWN0b3J5IGZyb20gJy4vY29tbW9uL3NvdXJjZS1kYXRhLWNhdGFsb2cnO1xuaW1wb3J0IHtBZGR9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCBJdGVtU2VsZWN0b3IgZnJvbSAnY29tcG9uZW50cy9jb21tb24vaXRlbS1zZWxlY3Rvci9pdGVtLXNlbGVjdG9yJztcbmltcG9ydCB7XG4gIEJ1dHRvbixcbiAgUGFuZWxMYWJlbCxcbiAgU2lkZVBhbmVsRGl2aWRlcixcbiAgU2lkZVBhbmVsU2VjdGlvblxufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5cbmltcG9ydCB7TEFZRVJfQkxFTkRJTkdTfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmNvbnN0IExheWVyQmxlbmRpbmdTZWxlY3RvciA9ICh7bGF5ZXJCbGVuZGluZywgdXBkYXRlTGF5ZXJCbGVuZGluZywgaW50bH0pID0+IHtcbiAgY29uc3QgbGFiZWxlZExheWVyQmxlbmRpbmdzID0gT2JqZWN0LmtleXMoTEFZRVJfQkxFTkRJTkdTKS5yZWR1Y2UoXG4gICAgKGFjYywgY3VycmVudCkgPT4gKHtcbiAgICAgIC4uLmFjYyxcbiAgICAgIFtpbnRsLmZvcm1hdE1lc3NhZ2Uoe2lkOiBMQVlFUl9CTEVORElOR1NbY3VycmVudF0ubGFiZWx9KV06IGN1cnJlbnRcbiAgICB9KSxcbiAgICB7fVxuICApO1xuXG4gIGNvbnN0IG9uQ2hhbmdlID0gdXNlQ2FsbGJhY2soYmxlbmRpbmcgPT4gdXBkYXRlTGF5ZXJCbGVuZGluZyhsYWJlbGVkTGF5ZXJCbGVuZGluZ3NbYmxlbmRpbmddKSwgW1xuICAgIHVwZGF0ZUxheWVyQmxlbmRpbmcsXG4gICAgbGFiZWxlZExheWVyQmxlbmRpbmdzXG4gIF0pO1xuXG4gIHJldHVybiAoXG4gICAgPFNpZGVQYW5lbFNlY3Rpb24+XG4gICAgICA8UGFuZWxMYWJlbD5cbiAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9XCJsYXllckJsZW5kaW5nLnRpdGxlXCIgLz5cbiAgICAgIDwvUGFuZWxMYWJlbD5cbiAgICAgIDxJdGVtU2VsZWN0b3JcbiAgICAgICAgc2VsZWN0ZWRJdGVtcz17aW50bC5mb3JtYXRNZXNzYWdlKHtpZDogTEFZRVJfQkxFTkRJTkdTW2xheWVyQmxlbmRpbmddLmxhYmVsfSl9XG4gICAgICAgIG9wdGlvbnM9e09iamVjdC5rZXlzKGxhYmVsZWRMYXllckJsZW5kaW5ncyl9XG4gICAgICAgIG11bHRpU2VsZWN0PXtmYWxzZX1cbiAgICAgICAgc2VhcmNoYWJsZT17ZmFsc2V9XG4gICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgIC8+XG4gICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICApO1xufTtcblxuLy8gbWFrZSBzdXJlIHRoZSBlbGVtZW50IGlzIGFsd2F5cyB2aXNpYmxlIHdoaWxlIGlzIGJlaW5nIGRyYWdnZWRcbi8vIGl0ZW0gYmVpbmcgZHJhZ2dlZCBpcyBhcHBlbmRlZCBpbiBib2R5LCBoZXJlIHRvIHJlc2V0IGl0cyBnbG9iYWwgc3R5bGVcbmNvbnN0IFNvcnRhYmxlU3R5bGVkSXRlbSA9IHN0eWxlZC5kaXZgXG4gIHotaW5kZXg6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25XcmFwcGVyWiArIDF9O1xuXG4gICYuc29ydGluZyB7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIH1cblxuICAmLnNvcnRpbmctbGF5ZXJzIC5sYXllci1wYW5lbF9faGVhZGVyIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZEhvdmVyfTtcbiAgICBmb250LWZhbWlseTogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5mb250RmFtaWx5fTtcbiAgICBmb250LXdlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5mb250V2VpZ2h0fTtcbiAgICBmb250LXNpemU6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZm9udFNpemV9O1xuICAgIGxpbmUtaGVpZ2h0OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxpbmVIZWlnaHR9O1xuICAgICosXG4gICAgKjpiZWZvcmUsXG4gICAgKjphZnRlciB7XG4gICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgIH1cbiAgICAubGF5ZXJfX2RyYWctaGFuZGxlIHtcbiAgICAgIG9wYWNpdHk6IDE7XG4gICAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gICAgfVxuICB9XG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gQWRkRGF0YUJ1dHRvbkZhY3RvcnkoKSB7XG4gIGNvbnN0IEFkZERhdGFCdXR0b24gPSAoe29uQ2xpY2ssIGlzSW5hY3RpdmV9KSA9PiAoXG4gICAgPEJ1dHRvblxuICAgICAgY2xhc3NOYW1lPVwiYWRkLWRhdGEtYnV0dG9uXCJcbiAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICBpc0luYWN0aXZlPXshaXNJbmFjdGl2ZX1cbiAgICAgIHdpZHRoPVwiMTA1cHhcIlxuICAgICAgc2Vjb25kYXJ5XG4gICAgPlxuICAgICAgPEFkZCBoZWlnaHQ9XCIxMnB4XCIgLz5cbiAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbGF5ZXJNYW5hZ2VyLmFkZERhdGEnfSAvPlxuICAgIDwvQnV0dG9uPlxuICApO1xuXG4gIHJldHVybiBBZGREYXRhQnV0dG9uO1xufVxuXG5MYXllck1hbmFnZXJGYWN0b3J5LmRlcHMgPSBbQWRkRGF0YUJ1dHRvbkZhY3RvcnksIExheWVyUGFuZWxGYWN0b3J5LCBTb3VyY2VEYXRhQ2F0YWxvZ0ZhY3RvcnldO1xuXG5mdW5jdGlvbiBMYXllck1hbmFnZXJGYWN0b3J5KEFkZERhdGFCdXR0b24sIExheWVyUGFuZWwsIFNvdXJjZURhdGFDYXRhbG9nKSB7XG4gIC8vIEJ5IHdyYXBwaW5nIGxheWVyIHBhbmVsIHVzaW5nIGEgc29ydGFibGUgZWxlbWVudCB3ZSBkb24ndCBoYXZlIHRvIGltcGxlbWVudCB0aGUgZHJhZyBhbmQgZHJvcCBsb2dpYyBpbnRvIHRoZSBwYW5lbCBpdHNlbGY7XG4gIC8vIERldmVsb3BlcnMgY2FuIHByb3ZpZGUgYW55IGxheWVyIHBhbmVsIGltcGxlbWVudGF0aW9uIGFuZCBpdCB3aWxsIHN0aWxsIGJlIHNvcnRhYmxlXG4gIGNvbnN0IFNvcnRhYmxlSXRlbSA9IHNvcnRhYmxlRWxlbWVudCgoe2NoaWxkcmVuLCBpc1NvcnRpbmd9KSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxTb3J0YWJsZVN0eWxlZEl0ZW0gY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdzb3J0YWJsZS1sYXllci1pdGVtcycsIHtzb3J0aW5nOiBpc1NvcnRpbmd9KX0+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvU29ydGFibGVTdHlsZWRJdGVtPlxuICAgICk7XG4gIH0pO1xuXG4gIGNvbnN0IFNvcnRhYmxlQ29udGFpbmVyID0gc29ydGFibGVDb250YWluZXIoKHtjaGlsZHJlbn0pID0+IHtcbiAgICByZXR1cm4gPGRpdj57Y2hpbGRyZW59PC9kaXY+O1xuICB9KTtcblxuICBjbGFzcyBMYXllck1hbmFnZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgICBkYXRhc2V0czogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgbGF5ZXJCbGVuZGluZzogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgbGF5ZXJDbGFzc2VzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICBsYXllcnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5hbnkpLmlzUmVxdWlyZWQsXG4gICAgICAvLyBmdW5jdGlvbnNcbiAgICAgIGFkZExheWVyOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgbGF5ZXJDb2xvclVJQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgbGF5ZXJDb25maWdDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBsYXllclRleHRMYWJlbENoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGxheWVyVHlwZUNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGxheWVyVmlzQ29uZmlnQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgb3Blbk1vZGFsOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgcmVtb3ZlTGF5ZXI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICByZW1vdmVEYXRhc2V0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgc2hvd0RhdGFzZXRUYWJsZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIHVwZGF0ZUxheWVyQmxlbmRpbmc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICB1cGRhdGVMYXllck9yZGVyOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gICAgfTtcbiAgICBzdGF0ZSA9IHtcbiAgICAgIGlzU29ydGluZzogZmFsc2VcbiAgICB9O1xuXG4gICAgbGF5ZXJDbGFzc1NlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMubGF5ZXJDbGFzc2VzO1xuICAgIGxheWVyVHlwZU9wdGlvbnNTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKHRoaXMubGF5ZXJDbGFzc1NlbGVjdG9yLCBsYXllckNsYXNzZXMgPT5cbiAgICAgIE9iamVjdC5rZXlzKGxheWVyQ2xhc3NlcykubWFwKGtleSA9PiB7XG4gICAgICAgIGNvbnN0IGxheWVyID0gbmV3IGxheWVyQ2xhc3Nlc1trZXldKCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaWQ6IGtleSxcbiAgICAgICAgICBsYWJlbDogbGF5ZXIubmFtZSxcbiAgICAgICAgICBpY29uOiBsYXllci5sYXllckljb25cbiAgICAgICAgfTtcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIF9hZGRFbXB0eU5ld0xheWVyID0gKCkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy5hZGRMYXllcigpO1xuICAgIH07XG5cbiAgICBfaGFuZGxlU29ydCA9ICh7b2xkSW5kZXgsIG5ld0luZGV4fSkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy51cGRhdGVMYXllck9yZGVyKGFycmF5TW92ZSh0aGlzLnByb3BzLmxheWVyT3JkZXIsIG9sZEluZGV4LCBuZXdJbmRleCkpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7aXNTb3J0aW5nOiBmYWxzZX0pO1xuICAgIH07XG5cbiAgICBfb25Tb3J0U3RhcnQgPSAoKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtpc1NvcnRpbmc6IHRydWV9KTtcbiAgICB9O1xuXG4gICAgX3VwZGF0ZUJlZm9yZVNvcnRTdGFydCA9ICh7aW5kZXh9KSA9PiB7XG4gICAgICAvLyBpZiBsYXllciBjb25maWcgaXMgYWN0aXZlLCBjbG9zZSBpdFxuICAgICAgY29uc3Qge2xheWVyT3JkZXIsIGxheWVycywgbGF5ZXJDb25maWdDaGFuZ2V9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IGxheWVySWR4ID0gbGF5ZXJPcmRlcltpbmRleF07XG4gICAgICBpZiAobGF5ZXJzW2xheWVySWR4XS5jb25maWcuaXNDb25maWdBY3RpdmUpIHtcbiAgICAgICAgbGF5ZXJDb25maWdDaGFuZ2UobGF5ZXJzW2xheWVySWR4XSwge2lzQ29uZmlnQWN0aXZlOiBmYWxzZX0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7bGF5ZXJzLCBkYXRhc2V0cywgbGF5ZXJPcmRlciwgb3Blbk1vZGFsLCBpbnRsfSA9IHRoaXMucHJvcHM7XG4gICAgICBjb25zdCBkZWZhdWx0RGF0YXNldCA9IE9iamVjdC5rZXlzKGRhdGFzZXRzKVswXTtcbiAgICAgIGNvbnN0IGxheWVyVHlwZU9wdGlvbnMgPSB0aGlzLmxheWVyVHlwZU9wdGlvbnNTZWxlY3Rvcih0aGlzLnByb3BzKTtcblxuICAgICAgY29uc3QgbGF5ZXJBY3Rpb25zID0ge1xuICAgICAgICBsYXllckNvbG9yVUlDaGFuZ2U6IHRoaXMucHJvcHMubGF5ZXJDb2xvclVJQ2hhbmdlLFxuICAgICAgICBsYXllckNvbmZpZ0NoYW5nZTogdGhpcy5wcm9wcy5sYXllckNvbmZpZ0NoYW5nZSxcbiAgICAgICAgbGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnQ2hhbmdlOiB0aGlzLnByb3BzLmxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZSxcbiAgICAgICAgbGF5ZXJUeXBlQ2hhbmdlOiB0aGlzLnByb3BzLmxheWVyVHlwZUNoYW5nZSxcbiAgICAgICAgbGF5ZXJWaXNDb25maWdDaGFuZ2U6IHRoaXMucHJvcHMubGF5ZXJWaXNDb25maWdDaGFuZ2UsXG4gICAgICAgIGxheWVyVGV4dExhYmVsQ2hhbmdlOiB0aGlzLnByb3BzLmxheWVyVGV4dExhYmVsQ2hhbmdlLFxuICAgICAgICByZW1vdmVMYXllcjogdGhpcy5wcm9wcy5yZW1vdmVMYXllclxuICAgICAgfTtcblxuICAgICAgY29uc3QgcGFuZWxQcm9wcyA9IHtcbiAgICAgICAgZGF0YXNldHMsXG4gICAgICAgIG9wZW5Nb2RhbCxcbiAgICAgICAgbGF5ZXJUeXBlT3B0aW9uc1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsYXllci1tYW5hZ2VyXCI+XG4gICAgICAgICAgPFNvdXJjZURhdGFDYXRhbG9nXG4gICAgICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgICAgICBzaG93RGF0YXNldFRhYmxlPXt0aGlzLnByb3BzLnNob3dEYXRhc2V0VGFibGV9XG4gICAgICAgICAgICByZW1vdmVEYXRhc2V0PXt0aGlzLnByb3BzLnJlbW92ZURhdGFzZXR9XG4gICAgICAgICAgICBzaG93RGVsZXRlRGF0YXNldFxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEFkZERhdGFCdXR0b24gb25DbGljaz17dGhpcy5wcm9wcy5zaG93QWRkRGF0YU1vZGFsfSBpc0luYWN0aXZlPXshZGVmYXVsdERhdGFzZXR9IC8+XG4gICAgICAgICAgPFNpZGVQYW5lbERpdmlkZXIgLz5cbiAgICAgICAgICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICAgIDxTb3J0YWJsZUNvbnRhaW5lclxuICAgICAgICAgICAgICBvblNvcnRFbmQ9e3RoaXMuX2hhbmRsZVNvcnR9XG4gICAgICAgICAgICAgIG9uU29ydFN0YXJ0PXt0aGlzLl9vblNvcnRTdGFydH1cbiAgICAgICAgICAgICAgdXBkYXRlQmVmb3JlU29ydFN0YXJ0PXt0aGlzLl91cGRhdGVCZWZvcmVTb3J0U3RhcnR9XG4gICAgICAgICAgICAgIGxvY2tBeGlzPVwieVwiXG4gICAgICAgICAgICAgIGhlbHBlckNsYXNzPVwic29ydGluZy1sYXllcnNcIlxuICAgICAgICAgICAgICB1c2VEcmFnSGFuZGxlXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtsYXllck9yZGVyLm1hcChcbiAgICAgICAgICAgICAgICAobGF5ZXJJZHgsIGluZGV4KSA9PlxuICAgICAgICAgICAgICAgICAgIWxheWVyc1tsYXllcklkeF0uY29uZmlnLmhpZGRlbiAmJiAoXG4gICAgICAgICAgICAgICAgICAgIDxTb3J0YWJsZUl0ZW1cbiAgICAgICAgICAgICAgICAgICAgICBrZXk9e2BsYXllci0ke2xheWVySWR4fWB9XG4gICAgICAgICAgICAgICAgICAgICAgaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAgICAgICAgICAgIGlzU29ydGluZz17dGhpcy5zdGF0ZS5pc1NvcnRpbmd9XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8TGF5ZXJQYW5lbFxuICAgICAgICAgICAgICAgICAgICAgICAgey4uLnBhbmVsUHJvcHN9XG4gICAgICAgICAgICAgICAgICAgICAgICB7Li4ubGF5ZXJBY3Rpb25zfVxuICAgICAgICAgICAgICAgICAgICAgICAgc29ydERhdGE9e2xheWVySWR4fVxuICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtsYXllcnNbbGF5ZXJJZHhdLmlkfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWR4PXtsYXllcklkeH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyPXtsYXllcnNbbGF5ZXJJZHhdfVxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvU29ydGFibGVJdGVtPlxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9Tb3J0YWJsZUNvbnRhaW5lcj5cbiAgICAgICAgICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4gICAgICAgICAgPFNpZGVQYW5lbFNlY3Rpb24+XG4gICAgICAgICAgICB7ZGVmYXVsdERhdGFzZXQgPyAoXG4gICAgICAgICAgICAgIDxCdXR0b24gY2xhc3NOYW1lPVwiYWRkLWxheWVyLWJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMuX2FkZEVtcHR5TmV3TGF5ZXJ9IHdpZHRoPVwiMTA1cHhcIj5cbiAgICAgICAgICAgICAgICA8QWRkIGhlaWdodD1cIjEycHhcIiAvPlxuICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbGF5ZXJNYW5hZ2VyLmFkZExheWVyJ30gLz5cbiAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4gICAgICAgICAgPExheWVyQmxlbmRpbmdTZWxlY3RvclxuICAgICAgICAgICAgbGF5ZXJCbGVuZGluZz17dGhpcy5wcm9wcy5sYXllckJsZW5kaW5nfVxuICAgICAgICAgICAgdXBkYXRlTGF5ZXJCbGVuZGluZz17dGhpcy5wcm9wcy51cGRhdGVMYXllckJsZW5kaW5nfVxuICAgICAgICAgICAgaW50bD17aW50bH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICB9XG4gIHJldHVybiBpbmplY3RJbnRsKExheWVyTWFuYWdlcik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IExheWVyTWFuYWdlckZhY3Rvcnk7XG4iXX0=