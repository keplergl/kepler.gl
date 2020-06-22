"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PureFeatureActionPanelFactory = PureFeatureActionPanelFactory;
exports["default"] = FeatureActionPanelFactory;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _actionPanel = _interopRequireWildcard(require("../common/action-panel"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactOnclickoutside = _interopRequireDefault(require("react-onclickoutside"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _icons = require("../common/icons");

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  position: absolute;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var LAYOVER_OFFSET = 4;

var StyledActionsLayer = _styledComponents["default"].div(_templateObject());

PureFeatureActionPanelFactory.deps = [];

function PureFeatureActionPanelFactory() {
  var FeatureActionPanel =
  /*#__PURE__*/
  function (_PureComponent) {
    (0, _inherits2["default"])(FeatureActionPanel, _PureComponent);

    function FeatureActionPanel() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2["default"])(this, FeatureActionPanel);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(FeatureActionPanel)).call.apply(_getPrototypeOf2, [this].concat(args)));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleClickOutside", function (e) {
        e.preventDefault();
        e.stopPropagation();

        _this.props.onClose();
      });
      return _this;
    }

    (0, _createClass2["default"])(FeatureActionPanel, [{
      key: "render",
      value: function render() {
        var _this$props = this.props,
            className = _this$props.className,
            datasets = _this$props.datasets,
            position = _this$props.position,
            layers = _this$props.layers,
            currentFilter = _this$props.currentFilter,
            onToggleLayer = _this$props.onToggleLayer,
            onDeleteFeature = _this$props.onDeleteFeature;

        var _ref = currentFilter || {},
            _ref$layerId = _ref.layerId,
            layerId = _ref$layerId === void 0 ? [] : _ref$layerId;

        return _react["default"].createElement(StyledActionsLayer, {
          className: (0, _classnames["default"])('feature-action-panel', className),
          style: {
            top: "".concat(position.y + LAYOVER_OFFSET, "px"),
            left: "".concat(position.x + LAYOVER_OFFSET, "px")
          }
        }, _react["default"].createElement(_actionPanel["default"], null, _react["default"].createElement(_actionPanel.ActionPanelItem, {
          className: "editor-layers-list",
          label: "layers",
          Icon: _icons.Layers
        }, layers.map(function (layer, index) {
          return _react["default"].createElement(_actionPanel.ActionPanelItem, {
            key: index,
            label: layer.config.label,
            color: datasets[layer.config.dataId].color,
            isSelection: true,
            isActive: layerId.includes(layer.id),
            onClick: function onClick() {
              return onToggleLayer(layer);
            },
            className: "layer-panel-item"
          });
        })), _react["default"].createElement(_actionPanel.ActionPanelItem, {
          label: "delete",
          className: "delete-panel-item",
          Icon: _icons.Trash,
          onClick: onDeleteFeature
        })));
      }
    }]);
    return FeatureActionPanel;
  }(_react.PureComponent);

  (0, _defineProperty2["default"])(FeatureActionPanel, "propTypes", {
    className: _propTypes["default"].string,
    datasets: _propTypes["default"].object.isRequired,
    position: _propTypes["default"].object.isRequired,
    layers: _propTypes["default"].arrayOf(_propTypes["default"].object).isRequired,
    currentFilter: _propTypes["default"].object,
    onClose: _propTypes["default"].func.isRequired,
    onDeleteFeature: _propTypes["default"].func.isRequired
  });
  (0, _defineProperty2["default"])(FeatureActionPanel, "defaultProps", {
    position: {}
  });
  FeatureActionPanel.displayName = 'FeatureActionPanel';
  return FeatureActionPanel;
}

FeatureActionPanelFactory.deps = PureFeatureActionPanelFactory.deps;

function FeatureActionPanelFactory() {
  return (0, _reactOnclickoutside["default"])(PureFeatureActionPanelFactory());
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2VkaXRvci9mZWF0dXJlLWFjdGlvbi1wYW5lbC5qcyJdLCJuYW1lcyI6WyJMQVlPVkVSX09GRlNFVCIsIlN0eWxlZEFjdGlvbnNMYXllciIsInN0eWxlZCIsImRpdiIsIlB1cmVGZWF0dXJlQWN0aW9uUGFuZWxGYWN0b3J5IiwiZGVwcyIsIkZlYXR1cmVBY3Rpb25QYW5lbCIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsInByb3BzIiwib25DbG9zZSIsImNsYXNzTmFtZSIsImRhdGFzZXRzIiwicG9zaXRpb24iLCJsYXllcnMiLCJjdXJyZW50RmlsdGVyIiwib25Ub2dnbGVMYXllciIsIm9uRGVsZXRlRmVhdHVyZSIsImxheWVySWQiLCJ0b3AiLCJ5IiwibGVmdCIsIngiLCJMYXllcnMiLCJtYXAiLCJsYXllciIsImluZGV4IiwiY29uZmlnIiwibGFiZWwiLCJkYXRhSWQiLCJjb2xvciIsImluY2x1ZGVzIiwiaWQiLCJUcmFzaCIsIlB1cmVDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiYXJyYXlPZiIsImZ1bmMiLCJkaXNwbGF5TmFtZSIsIkZlYXR1cmVBY3Rpb25QYW5lbEZhY3RvcnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLGNBQWMsR0FBRyxDQUF2Qjs7QUFFQSxJQUFNQyxrQkFBa0IsR0FBR0MsNkJBQU9DLEdBQVYsbUJBQXhCOztBQUlBQyw2QkFBNkIsQ0FBQ0MsSUFBOUIsR0FBcUMsRUFBckM7O0FBRU8sU0FBU0QsNkJBQVQsR0FBeUM7QUFBQSxNQUN4Q0Usa0JBRHdDO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FB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LEVBQUU7QUFEVSxHQVpzQjtBQXNFOUNSLEVBQUFBLGtCQUFrQixDQUFDb0MsV0FBbkIsR0FBaUMsb0JBQWpDO0FBRUEsU0FBT3BDLGtCQUFQO0FBQ0Q7O0FBRURxQyx5QkFBeUIsQ0FBQ3RDLElBQTFCLEdBQWlDRCw2QkFBNkIsQ0FBQ0MsSUFBL0Q7O0FBRWUsU0FBU3NDLHlCQUFULEdBQXFDO0FBQ2xELFNBQU8scUNBQWV2Qyw2QkFBNkIsRUFBNUMsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7UHVyZUNvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IEFjdGlvblBhbmVsLCB7QWN0aW9uUGFuZWxJdGVtfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9hY3Rpb24tcGFuZWwnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgb25DbGlja091dHNpZGUgZnJvbSAncmVhY3Qtb25jbGlja291dHNpZGUnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHtUcmFzaCwgTGF5ZXJzfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5cbmNvbnN0IExBWU9WRVJfT0ZGU0VUID0gNDtcblxuY29uc3QgU3R5bGVkQWN0aW9uc0xheWVyID0gc3R5bGVkLmRpdmBcbiAgcG9zaXRpb246IGFic29sdXRlO1xuYDtcblxuUHVyZUZlYXR1cmVBY3Rpb25QYW5lbEZhY3RvcnkuZGVwcyA9IFtdO1xuXG5leHBvcnQgZnVuY3Rpb24gUHVyZUZlYXR1cmVBY3Rpb25QYW5lbEZhY3RvcnkoKSB7XG4gIGNsYXNzIEZlYXR1cmVBY3Rpb25QYW5lbCBleHRlbmRzIFB1cmVDb21wb25lbnQge1xuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBkYXRhc2V0czogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgcG9zaXRpb246IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIGxheWVyczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgICAgIGN1cnJlbnRGaWx0ZXI6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgICBvbkNsb3NlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgb25EZWxldGVGZWF0dXJlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gICAgfTtcblxuICAgIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICBwb3NpdGlvbjoge31cbiAgICB9O1xuXG4gICAgLy8gVXNlZCBieSBvbkNsaWNrT3V0c2lkZVxuICAgIGhhbmRsZUNsaWNrT3V0c2lkZSA9IGUgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHRoaXMucHJvcHMub25DbG9zZSgpO1xuICAgIH07XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICAgZGF0YXNldHMsXG4gICAgICAgIHBvc2l0aW9uLFxuICAgICAgICBsYXllcnMsXG4gICAgICAgIGN1cnJlbnRGaWx0ZXIsXG4gICAgICAgIG9uVG9nZ2xlTGF5ZXIsXG4gICAgICAgIG9uRGVsZXRlRmVhdHVyZVxuICAgICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgIGNvbnN0IHtsYXllcklkID0gW119ID0gY3VycmVudEZpbHRlciB8fCB7fTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFN0eWxlZEFjdGlvbnNMYXllclxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnZmVhdHVyZS1hY3Rpb24tcGFuZWwnLCBjbGFzc05hbWUpfVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICB0b3A6IGAke3Bvc2l0aW9uLnkgKyBMQVlPVkVSX09GRlNFVH1weGAsXG4gICAgICAgICAgICBsZWZ0OiBgJHtwb3NpdGlvbi54ICsgTEFZT1ZFUl9PRkZTRVR9cHhgXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxBY3Rpb25QYW5lbD5cbiAgICAgICAgICAgIDxBY3Rpb25QYW5lbEl0ZW0gY2xhc3NOYW1lPVwiZWRpdG9yLWxheWVycy1saXN0XCIgbGFiZWw9XCJsYXllcnNcIiBJY29uPXtMYXllcnN9PlxuICAgICAgICAgICAgICB7bGF5ZXJzLm1hcCgobGF5ZXIsIGluZGV4KSA9PiAoXG4gICAgICAgICAgICAgICAgPEFjdGlvblBhbmVsSXRlbVxuICAgICAgICAgICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgICAgIGxhYmVsPXtsYXllci5jb25maWcubGFiZWx9XG4gICAgICAgICAgICAgICAgICBjb2xvcj17ZGF0YXNldHNbbGF5ZXIuY29uZmlnLmRhdGFJZF0uY29sb3J9XG4gICAgICAgICAgICAgICAgICBpc1NlbGVjdGlvbj17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgIGlzQWN0aXZlPXtsYXllcklkLmluY2x1ZGVzKGxheWVyLmlkKX1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uVG9nZ2xlTGF5ZXIobGF5ZXIpfVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibGF5ZXItcGFuZWwtaXRlbVwiXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L0FjdGlvblBhbmVsSXRlbT5cbiAgICAgICAgICAgIDxBY3Rpb25QYW5lbEl0ZW1cbiAgICAgICAgICAgICAgbGFiZWw9XCJkZWxldGVcIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJkZWxldGUtcGFuZWwtaXRlbVwiXG4gICAgICAgICAgICAgIEljb249e1RyYXNofVxuICAgICAgICAgICAgICBvbkNsaWNrPXtvbkRlbGV0ZUZlYXR1cmV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvQWN0aW9uUGFuZWw+XG4gICAgICAgIDwvU3R5bGVkQWN0aW9uc0xheWVyPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBGZWF0dXJlQWN0aW9uUGFuZWwuZGlzcGxheU5hbWUgPSAnRmVhdHVyZUFjdGlvblBhbmVsJztcblxuICByZXR1cm4gRmVhdHVyZUFjdGlvblBhbmVsO1xufVxuXG5GZWF0dXJlQWN0aW9uUGFuZWxGYWN0b3J5LmRlcHMgPSBQdXJlRmVhdHVyZUFjdGlvblBhbmVsRmFjdG9yeS5kZXBzO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBGZWF0dXJlQWN0aW9uUGFuZWxGYWN0b3J5KCkge1xuICByZXR1cm4gb25DbGlja091dHNpZGUoUHVyZUZlYXR1cmVBY3Rpb25QYW5lbEZhY3RvcnkoKSk7XG59XG4iXX0=