"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.hexagonAggregation = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _aggregationLayers = require("@deck.gl/aggregation-layers");

var _cpuAggregator = _interopRequireWildcard(require("../layer-utils/cpu-aggregator"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var hexagonAggregation = {
  key: 'position',
  updateSteps: [{
    key: 'aggregate',
    triggers: {
      cellSize: {
        prop: 'radius'
      },
      position: {
        prop: 'getPosition',
        updateTrigger: 'getPosition'
      },
      aggregator: {
        prop: 'hexagonAggregator'
      }
    },
    updater: _cpuAggregator.getAggregatedData
  }]
};
exports.hexagonAggregation = hexagonAggregation;

var ScaleEnhancedHexagonLayer = /*#__PURE__*/function (_HexagonLayer) {
  (0, _inherits2["default"])(ScaleEnhancedHexagonLayer, _HexagonLayer);

  var _super = _createSuper(ScaleEnhancedHexagonLayer);

  function ScaleEnhancedHexagonLayer() {
    (0, _classCallCheck2["default"])(this, ScaleEnhancedHexagonLayer);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(ScaleEnhancedHexagonLayer, [{
    key: "initializeState",
    value: function initializeState() {
      var cpuAggregator = new _cpuAggregator["default"]({
        aggregation: hexagonAggregation
      });
      this.state = {
        cpuAggregator: cpuAggregator,
        aggregatorState: cpuAggregator.state
      };
      var attributeManager = this.getAttributeManager();
      attributeManager.add({
        positions: {
          size: 3,
          accessor: 'getPosition'
        }
      });
    }
  }]);
  return ScaleEnhancedHexagonLayer;
}(_aggregationLayers.HexagonLayer);

exports["default"] = ScaleEnhancedHexagonLayer;
ScaleEnhancedHexagonLayer.layerName = 'ScaleEnhancedHexagonLayer';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2hleGFnb24tbGF5ZXIvZW5oYW5jZWQtaGV4YWdvbi1sYXllci5qcyJdLCJuYW1lcyI6WyJoZXhhZ29uQWdncmVnYXRpb24iLCJrZXkiLCJ1cGRhdGVTdGVwcyIsInRyaWdnZXJzIiwiY2VsbFNpemUiLCJwcm9wIiwicG9zaXRpb24iLCJ1cGRhdGVUcmlnZ2VyIiwiYWdncmVnYXRvciIsInVwZGF0ZXIiLCJnZXRBZ2dyZWdhdGVkRGF0YSIsIlNjYWxlRW5oYW5jZWRIZXhhZ29uTGF5ZXIiLCJjcHVBZ2dyZWdhdG9yIiwiQ1BVQWdncmVnYXRvciIsImFnZ3JlZ2F0aW9uIiwic3RhdGUiLCJhZ2dyZWdhdG9yU3RhdGUiLCJhdHRyaWJ1dGVNYW5hZ2VyIiwiZ2V0QXR0cmlidXRlTWFuYWdlciIsImFkZCIsInBvc2l0aW9ucyIsInNpemUiLCJhY2Nlc3NvciIsIkhleGFnb25MYXllciIsImxheWVyTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOzs7Ozs7QUFFTyxJQUFNQSxrQkFBa0IsR0FBRztBQUNoQ0MsRUFBQUEsR0FBRyxFQUFFLFVBRDJCO0FBRWhDQyxFQUFBQSxXQUFXLEVBQUUsQ0FDWDtBQUNFRCxJQUFBQSxHQUFHLEVBQUUsV0FEUDtBQUVFRSxJQUFBQSxRQUFRLEVBQUU7QUFDUkMsTUFBQUEsUUFBUSxFQUFFO0FBQ1JDLFFBQUFBLElBQUksRUFBRTtBQURFLE9BREY7QUFJUkMsTUFBQUEsUUFBUSxFQUFFO0FBQ1JELFFBQUFBLElBQUksRUFBRSxhQURFO0FBRVJFLFFBQUFBLGFBQWEsRUFBRTtBQUZQLE9BSkY7QUFRUkMsTUFBQUEsVUFBVSxFQUFFO0FBQ1ZILFFBQUFBLElBQUksRUFBRTtBQURJO0FBUkosS0FGWjtBQWNFSSxJQUFBQSxPQUFPLEVBQUVDO0FBZFgsR0FEVztBQUZtQixDQUEzQjs7O0lBc0JjQyx5Qjs7Ozs7Ozs7Ozs7O1dBQ25CLDJCQUFrQjtBQUNoQixVQUFNQyxhQUFhLEdBQUcsSUFBSUMseUJBQUosQ0FBa0I7QUFDdENDLFFBQUFBLFdBQVcsRUFBRWQ7QUFEeUIsT0FBbEIsQ0FBdEI7QUFJQSxXQUFLZSxLQUFMLEdBQWE7QUFDWEgsUUFBQUEsYUFBYSxFQUFiQSxhQURXO0FBRVhJLFFBQUFBLGVBQWUsRUFBRUosYUFBYSxDQUFDRztBQUZwQixPQUFiO0FBSUEsVUFBTUUsZ0JBQWdCLEdBQUcsS0FBS0MsbUJBQUwsRUFBekI7QUFDQUQsTUFBQUEsZ0JBQWdCLENBQUNFLEdBQWpCLENBQXFCO0FBQ25CQyxRQUFBQSxTQUFTLEVBQUU7QUFBQ0MsVUFBQUEsSUFBSSxFQUFFLENBQVA7QUFBVUMsVUFBQUEsUUFBUSxFQUFFO0FBQXBCO0FBRFEsT0FBckI7QUFHRDs7O0VBZG9EQywrQjs7O0FBaUJ2RFoseUJBQXlCLENBQUNhLFNBQTFCLEdBQXNDLDJCQUF0QyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7SGV4YWdvbkxheWVyfSBmcm9tICdAZGVjay5nbC9hZ2dyZWdhdGlvbi1sYXllcnMnO1xuaW1wb3J0IENQVUFnZ3JlZ2F0b3IsIHtnZXRBZ2dyZWdhdGVkRGF0YX0gZnJvbSAnLi4vbGF5ZXItdXRpbHMvY3B1LWFnZ3JlZ2F0b3InO1xuXG5leHBvcnQgY29uc3QgaGV4YWdvbkFnZ3JlZ2F0aW9uID0ge1xuICBrZXk6ICdwb3NpdGlvbicsXG4gIHVwZGF0ZVN0ZXBzOiBbXG4gICAge1xuICAgICAga2V5OiAnYWdncmVnYXRlJyxcbiAgICAgIHRyaWdnZXJzOiB7XG4gICAgICAgIGNlbGxTaXplOiB7XG4gICAgICAgICAgcHJvcDogJ3JhZGl1cydcbiAgICAgICAgfSxcbiAgICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgICBwcm9wOiAnZ2V0UG9zaXRpb24nLFxuICAgICAgICAgIHVwZGF0ZVRyaWdnZXI6ICdnZXRQb3NpdGlvbidcbiAgICAgICAgfSxcbiAgICAgICAgYWdncmVnYXRvcjoge1xuICAgICAgICAgIHByb3A6ICdoZXhhZ29uQWdncmVnYXRvcidcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHVwZGF0ZXI6IGdldEFnZ3JlZ2F0ZWREYXRhXG4gICAgfVxuICBdXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2FsZUVuaGFuY2VkSGV4YWdvbkxheWVyIGV4dGVuZHMgSGV4YWdvbkxheWVyIHtcbiAgaW5pdGlhbGl6ZVN0YXRlKCkge1xuICAgIGNvbnN0IGNwdUFnZ3JlZ2F0b3IgPSBuZXcgQ1BVQWdncmVnYXRvcih7XG4gICAgICBhZ2dyZWdhdGlvbjogaGV4YWdvbkFnZ3JlZ2F0aW9uXG4gICAgfSk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgY3B1QWdncmVnYXRvcixcbiAgICAgIGFnZ3JlZ2F0b3JTdGF0ZTogY3B1QWdncmVnYXRvci5zdGF0ZVxuICAgIH07XG4gICAgY29uc3QgYXR0cmlidXRlTWFuYWdlciA9IHRoaXMuZ2V0QXR0cmlidXRlTWFuYWdlcigpO1xuICAgIGF0dHJpYnV0ZU1hbmFnZXIuYWRkKHtcbiAgICAgIHBvc2l0aW9uczoge3NpemU6IDMsIGFjY2Vzc29yOiAnZ2V0UG9zaXRpb24nfVxuICAgIH0pO1xuICB9XG59XG5cblNjYWxlRW5oYW5jZWRIZXhhZ29uTGF5ZXIubGF5ZXJOYW1lID0gJ1NjYWxlRW5oYW5jZWRIZXhhZ29uTGF5ZXInO1xuIl19