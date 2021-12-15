"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _core = require("@deck.gl/core");

var _scatterplotIconLayer = _interopRequireDefault(require("./scatterplot-icon-layer"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

// default icon geometry is a square
var DEFAULT_ICON_GEOMETRY = [1, 1, 0, 1, -1, 0, -1, -1, 0, -1, -1, 0, -1, 1, 0, 1, 1, 0];
var defaultProps = {
  getIconGeometry: function getIconGeometry(iconId) {
    return DEFAULT_ICON_GEOMETRY;
  },
  getIcon: function getIcon(d) {
    return d.icon;
  }
};

var SvgIconLayer = /*#__PURE__*/function (_CompositeLayer) {
  (0, _inherits2["default"])(SvgIconLayer, _CompositeLayer);

  var _super = _createSuper(SvgIconLayer);

  function SvgIconLayer() {
    (0, _classCallCheck2["default"])(this, SvgIconLayer);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(SvgIconLayer, [{
    key: "initializeState",
    value: // Must be defined
    function initializeState() {
      this.state = {
        data: {}
      };
    }
  }, {
    key: "updateState",
    value: function updateState(_ref) {
      var changeFlags = _ref.changeFlags;

      if (changeFlags.dataChanged) {
        this._extractSublayers();
      }
    }
  }, {
    key: "_extractSublayers",
    value: function _extractSublayers() {
      var _this$props = this.props,
          data = _this$props.data,
          getIconGeometry = _this$props.getIconGeometry,
          getIcon = _this$props.getIcon;
      var iconLayers = {};

      for (var i = 0; i < data.length; i++) {
        var iconId = getIcon(data[i]);
        iconLayers[iconId] = iconLayers[iconId] || {
          id: iconId,
          geometry: getIconGeometry(iconId) || DEFAULT_ICON_GEOMETRY,
          data: []
        };
        iconLayers[iconId].data.push(data[i]);
      }

      this.setState({
        data: Object.values(iconLayers)
      });
    }
  }, {
    key: "renderLayers",
    value: function renderLayers() {
      var _this = this;

      var layerId = this.props.id;
      var layers = this.state.data && this.state.data.length && this.state.data.map(function (_ref2) {
        var id = _ref2.id,
            data = _ref2.data,
            geometry = _ref2.geometry;
        return new _scatterplotIconLayer["default"](_objectSpread(_objectSpread({}, _this.props), {}, {
          id: "".concat(layerId, "-").concat(id),
          data: data,
          iconGeometry: geometry
        }));
      });
      return layers && layers.length > 0 ? layers : null;
    }
  }]);
  return SvgIconLayer;
}(_core.CompositeLayer);

exports["default"] = SvgIconLayer;
SvgIconLayer.layerName = 'SvgIconLayer';
SvgIconLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL3N2Zy1pY29uLWxheWVyL3N2Zy1pY29uLWxheWVyLmpzIl0sIm5hbWVzIjpbIkRFRkFVTFRfSUNPTl9HRU9NRVRSWSIsImRlZmF1bHRQcm9wcyIsImdldEljb25HZW9tZXRyeSIsImljb25JZCIsImdldEljb24iLCJkIiwiaWNvbiIsIlN2Z0ljb25MYXllciIsInN0YXRlIiwiZGF0YSIsImNoYW5nZUZsYWdzIiwiZGF0YUNoYW5nZWQiLCJfZXh0cmFjdFN1YmxheWVycyIsInByb3BzIiwiaWNvbkxheWVycyIsImkiLCJsZW5ndGgiLCJpZCIsImdlb21ldHJ5IiwicHVzaCIsInNldFN0YXRlIiwiT2JqZWN0IiwidmFsdWVzIiwibGF5ZXJJZCIsImxheWVycyIsIm1hcCIsIlNjYXR0ZXJwbG90SWNvbkxheWVyIiwiaWNvbkdlb21ldHJ5IiwiQ29tcG9zaXRlTGF5ZXIiLCJsYXllck5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7Ozs7Ozs7OztBQUVBO0FBQ0EsSUFBTUEscUJBQXFCLEdBQUcsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWLEVBQWEsQ0FBQyxDQUFkLEVBQWlCLENBQWpCLEVBQW9CLENBQUMsQ0FBckIsRUFBd0IsQ0FBQyxDQUF6QixFQUE0QixDQUE1QixFQUErQixDQUFDLENBQWhDLEVBQW1DLENBQUMsQ0FBcEMsRUFBdUMsQ0FBdkMsRUFBMEMsQ0FBQyxDQUEzQyxFQUE4QyxDQUE5QyxFQUFpRCxDQUFqRCxFQUFvRCxDQUFwRCxFQUF1RCxDQUF2RCxFQUEwRCxDQUExRCxDQUE5QjtBQUVBLElBQU1DLFlBQVksR0FBRztBQUNuQkMsRUFBQUEsZUFBZSxFQUFFLHlCQUFBQyxNQUFNO0FBQUEsV0FBSUgscUJBQUo7QUFBQSxHQURKO0FBRW5CSSxFQUFBQSxPQUFPLEVBQUUsaUJBQUFDLENBQUM7QUFBQSxXQUFJQSxDQUFDLENBQUNDLElBQU47QUFBQTtBQUZTLENBQXJCOztJQUtxQkMsWTs7Ozs7Ozs7Ozs7O1dBQ25CO0FBQ0EsK0JBQWtCO0FBQ2hCLFdBQUtDLEtBQUwsR0FBYTtBQUNYQyxRQUFBQSxJQUFJLEVBQUU7QUFESyxPQUFiO0FBR0Q7OztXQUVELDJCQUEyQjtBQUFBLFVBQWRDLFdBQWMsUUFBZEEsV0FBYzs7QUFDekIsVUFBSUEsV0FBVyxDQUFDQyxXQUFoQixFQUE2QjtBQUMzQixhQUFLQyxpQkFBTDtBQUNEO0FBQ0Y7OztXQUVELDZCQUFvQjtBQUFBLHdCQUN1QixLQUFLQyxLQUQ1QjtBQUFBLFVBQ1hKLElBRFcsZUFDWEEsSUFEVztBQUFBLFVBQ0xQLGVBREssZUFDTEEsZUFESztBQUFBLFVBQ1lFLE9BRFosZUFDWUEsT0FEWjtBQUdsQixVQUFNVSxVQUFVLEdBQUcsRUFBbkI7O0FBQ0EsV0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHTixJQUFJLENBQUNPLE1BQXpCLEVBQWlDRCxDQUFDLEVBQWxDLEVBQXNDO0FBQ3BDLFlBQU1aLE1BQU0sR0FBR0MsT0FBTyxDQUFDSyxJQUFJLENBQUNNLENBQUQsQ0FBTCxDQUF0QjtBQUNBRCxRQUFBQSxVQUFVLENBQUNYLE1BQUQsQ0FBVixHQUFxQlcsVUFBVSxDQUFDWCxNQUFELENBQVYsSUFBc0I7QUFDekNjLFVBQUFBLEVBQUUsRUFBRWQsTUFEcUM7QUFFekNlLFVBQUFBLFFBQVEsRUFBRWhCLGVBQWUsQ0FBQ0MsTUFBRCxDQUFmLElBQTJCSCxxQkFGSTtBQUd6Q1MsVUFBQUEsSUFBSSxFQUFFO0FBSG1DLFNBQTNDO0FBS0FLLFFBQUFBLFVBQVUsQ0FBQ1gsTUFBRCxDQUFWLENBQW1CTSxJQUFuQixDQUF3QlUsSUFBeEIsQ0FBNkJWLElBQUksQ0FBQ00sQ0FBRCxDQUFqQztBQUNEOztBQUNELFdBQUtLLFFBQUwsQ0FBYztBQUNaWCxRQUFBQSxJQUFJLEVBQUVZLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjUixVQUFkO0FBRE0sT0FBZDtBQUdEOzs7V0FFRCx3QkFBZTtBQUFBOztBQUNiLFVBQU1TLE9BQU8sR0FBRyxLQUFLVixLQUFMLENBQVdJLEVBQTNCO0FBRUEsVUFBTU8sTUFBTSxHQUNWLEtBQUtoQixLQUFMLENBQVdDLElBQVgsSUFDQSxLQUFLRCxLQUFMLENBQVdDLElBQVgsQ0FBZ0JPLE1BRGhCLElBRUEsS0FBS1IsS0FBTCxDQUFXQyxJQUFYLENBQWdCZ0IsR0FBaEIsQ0FDRTtBQUFBLFlBQUVSLEVBQUYsU0FBRUEsRUFBRjtBQUFBLFlBQU1SLElBQU4sU0FBTUEsSUFBTjtBQUFBLFlBQVlTLFFBQVosU0FBWUEsUUFBWjtBQUFBLGVBQ0UsSUFBSVEsZ0NBQUosaUNBQ0ssS0FBSSxDQUFDYixLQURWO0FBRUVJLFVBQUFBLEVBQUUsWUFBS00sT0FBTCxjQUFnQk4sRUFBaEIsQ0FGSjtBQUdFUixVQUFBQSxJQUFJLEVBQUpBLElBSEY7QUFJRWtCLFVBQUFBLFlBQVksRUFBRVQ7QUFKaEIsV0FERjtBQUFBLE9BREYsQ0FIRjtBQWFBLGFBQU9NLE1BQU0sSUFBSUEsTUFBTSxDQUFDUixNQUFQLEdBQWdCLENBQTFCLEdBQThCUSxNQUE5QixHQUF1QyxJQUE5QztBQUNEOzs7RUFqRHVDSSxvQjs7O0FBb0QxQ3JCLFlBQVksQ0FBQ3NCLFNBQWIsR0FBeUIsY0FBekI7QUFDQXRCLFlBQVksQ0FBQ04sWUFBYixHQUE0QkEsWUFBNUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge0NvbXBvc2l0ZUxheWVyfSBmcm9tICdAZGVjay5nbC9jb3JlJztcbmltcG9ydCBTY2F0dGVycGxvdEljb25MYXllciBmcm9tICcuL3NjYXR0ZXJwbG90LWljb24tbGF5ZXInO1xuXG4vLyBkZWZhdWx0IGljb24gZ2VvbWV0cnkgaXMgYSBzcXVhcmVcbmNvbnN0IERFRkFVTFRfSUNPTl9HRU9NRVRSWSA9IFsxLCAxLCAwLCAxLCAtMSwgMCwgLTEsIC0xLCAwLCAtMSwgLTEsIDAsIC0xLCAxLCAwLCAxLCAxLCAwXTtcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBnZXRJY29uR2VvbWV0cnk6IGljb25JZCA9PiBERUZBVUxUX0lDT05fR0VPTUVUUlksXG4gIGdldEljb246IGQgPT4gZC5pY29uXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdmdJY29uTGF5ZXIgZXh0ZW5kcyBDb21wb3NpdGVMYXllciB7XG4gIC8vIE11c3QgYmUgZGVmaW5lZFxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGRhdGE6IHt9XG4gICAgfTtcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlKHtjaGFuZ2VGbGFnc30pIHtcbiAgICBpZiAoY2hhbmdlRmxhZ3MuZGF0YUNoYW5nZWQpIHtcbiAgICAgIHRoaXMuX2V4dHJhY3RTdWJsYXllcnMoKTtcbiAgICB9XG4gIH1cblxuICBfZXh0cmFjdFN1YmxheWVycygpIHtcbiAgICBjb25zdCB7ZGF0YSwgZ2V0SWNvbkdlb21ldHJ5LCBnZXRJY29ufSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBpY29uTGF5ZXJzID0ge307XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpY29uSWQgPSBnZXRJY29uKGRhdGFbaV0pO1xuICAgICAgaWNvbkxheWVyc1tpY29uSWRdID0gaWNvbkxheWVyc1tpY29uSWRdIHx8IHtcbiAgICAgICAgaWQ6IGljb25JZCxcbiAgICAgICAgZ2VvbWV0cnk6IGdldEljb25HZW9tZXRyeShpY29uSWQpIHx8IERFRkFVTFRfSUNPTl9HRU9NRVRSWSxcbiAgICAgICAgZGF0YTogW11cbiAgICAgIH07XG4gICAgICBpY29uTGF5ZXJzW2ljb25JZF0uZGF0YS5wdXNoKGRhdGFbaV0pO1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGRhdGE6IE9iamVjdC52YWx1ZXMoaWNvbkxheWVycylcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlckxheWVycygpIHtcbiAgICBjb25zdCBsYXllcklkID0gdGhpcy5wcm9wcy5pZDtcblxuICAgIGNvbnN0IGxheWVycyA9XG4gICAgICB0aGlzLnN0YXRlLmRhdGEgJiZcbiAgICAgIHRoaXMuc3RhdGUuZGF0YS5sZW5ndGggJiZcbiAgICAgIHRoaXMuc3RhdGUuZGF0YS5tYXAoXG4gICAgICAgICh7aWQsIGRhdGEsIGdlb21ldHJ5fSkgPT5cbiAgICAgICAgICBuZXcgU2NhdHRlcnBsb3RJY29uTGF5ZXIoe1xuICAgICAgICAgICAgLi4udGhpcy5wcm9wcyxcbiAgICAgICAgICAgIGlkOiBgJHtsYXllcklkfS0ke2lkfWAsXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgaWNvbkdlb21ldHJ5OiBnZW9tZXRyeVxuICAgICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgcmV0dXJuIGxheWVycyAmJiBsYXllcnMubGVuZ3RoID4gMCA/IGxheWVycyA6IG51bGw7XG4gIH1cbn1cblxuU3ZnSWNvbkxheWVyLmxheWVyTmFtZSA9ICdTdmdJY29uTGF5ZXInO1xuU3ZnSWNvbkxheWVyLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcbiJdfQ==