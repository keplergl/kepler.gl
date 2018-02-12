'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _deck = require('deck.gl');

var _earcut = require('earcut');

var _earcut2 = _interopRequireDefault(_earcut);

var _lodash = require('lodash.flattendeep');

var _lodash2 = _interopRequireDefault(_lodash);

var _luma = require('luma.gl');

var _glMatrix = require('gl-matrix');

var _buildingLayerVertex = require('./building-layer-vertex.glsl');

var _buildingLayerVertex2 = _interopRequireDefault(_buildingLayerVertex);

var _buildingLayerFragment = require('./building-layer-fragment.glsl');

var _buildingLayerFragment2 = _interopRequireDefault(_buildingLayerFragment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var viewMatrixCompat = _glMatrix.mat4.create();
_glMatrix.mat4.lookAt(viewMatrixCompat, [0, 0, 0], [0, 0, -1], [0, 1, 0]);
var viewMatrix = new Float32Array(viewMatrixCompat);

var BuildingLayer = function (_Layer) {
  (0, _inherits3.default)(BuildingLayer, _Layer);

  /**
   * @classdesc
   * BuildingLayer
   *
   * @class
   * @param {object} props
   * @param {bool} props.drawWireframe - ? drawWireframe : drawSolid
   * @param {function} props.onBuildingHovered - provide proerties of the
   * selected building, together with the mouse event when mouse hovered
   * @param {function} props.onBuildingClicked - provide proerties of the
   * selected building, together with the mouse event when mouse clicked
   */
  function BuildingLayer(props) {
    (0, _classCallCheck3.default)(this, BuildingLayer);
    return (0, _possibleConstructorReturn3.default)(this, (BuildingLayer.__proto__ || Object.getPrototypeOf(BuildingLayer)).call(this, (0, _extends3.default)({
      opacity: 1
    }, props)));
  }

  (0, _createClass3.default)(BuildingLayer, [{
    key: 'initializeState',
    value: function initializeState() {
      var gl = this.context.gl;
      var attributeManager = this.state.attributeManager;


      attributeManager.addDynamic({
        // Primtive attributes
        indices: { size: 1, update: this.calculateIndices, isIndexed: true },
        positions: { size: 3, update: this.calculatePositions },
        // colors: {update: this.calculateColors},
        normals: { size: 3, update: this.calculateNormals }
      });

      this.setUniforms({ opacity: this.props.opacity });

      var IndexType = gl.getExtension('OES_element_index_uint') ? Uint32Array : Uint16Array;

      this.setState({
        numInstances: 0,
        model: this.getModel(gl),
        IndexType: IndexType
      });

      this.extractBuildings();
    }
  }, {
    key: 'didMount',
    value: function didMount() {
      this.updateUniforms();
    }
  }, {
    key: 'willReceiveProps',
    value: function willReceiveProps(oldProps, newProps) {
      (0, _get3.default)(BuildingLayer.prototype.__proto__ || Object.getPrototypeOf(BuildingLayer.prototype), 'willReceiveProps', this).call(this, oldProps, newProps);

      var _state = this.state,
          dataChanged = _state.dataChanged,
          attributeManager = _state.attributeManager;

      if (dataChanged) {
        this.extractBuildings();

        attributeManager.invalidateAll();
      }

      this.updateUniforms();
    }
  }, {
    key: 'getShaders',
    value: function getShaders() {
      return { vs: _buildingLayerVertex2.default, fs: _buildingLayerFragment2.default };
    }
  }, {
    key: 'getModel',
    value: function getModel(gl) {
      return new _luma.Model((0, _extends3.default)({}, (0, _deck.assembleShaders)(gl, this.getShaders()), {
        geometry: new _luma.Geometry({
          id: this.props.id,
          drawMode: this.props.drawWireframe ? 'LINES' : 'TRIANGLES'
        }),
        vertexCount: 0,
        isIndexed: true
      }));
    }
  }, {
    key: 'draw',
    value: function draw(_ref) {
      var uniforms = _ref.uniforms;

      this.state.model.render((0, _extends3.default)({}, uniforms, {
        viewMatrix: viewMatrix
      }));
    }

    // each top vertex is on 3 surfaces
    // each bottom vertex is on 2 surfaces

  }, {
    key: 'calculatePositions',
    value: function calculatePositions(attribute) {
      var _this2 = this;

      var positions = (0, _lodash2.default)(this.state.groupedVertices.map(function (vertices) {
        var topVertices = Array.prototype.concat.apply([], vertices);
        var baseVertices = topVertices.map(function (v) {
          return [v[0], v[1], 0];
        });
        return _this2.props.drawWireframe ? [topVertices, baseVertices] : [topVertices, topVertices, topVertices, baseVertices, baseVertices];
      }));
      attribute.value = new Float32Array(positions);
    }
  }, {
    key: 'calculateNormals',
    value: function calculateNormals(attribute) {
      var _this3 = this;

      var up = [0, 1, 0];

      var normals = this.state.groupedVertices.map(function (vertices, buildingIndex) {
        var topNormals = new Array(countVertices(vertices)).fill(up);
        var sideNormals = vertices.map(function (polygon) {
          return _this3.calculateSideNormals(polygon);
        });
        var sideNormalsForward = sideNormals.map(function (n) {
          return n[0];
        });
        var sideNormalsBackward = sideNormals.map(function (n) {
          return n[1];
        });

        return _this3.props.drawWireframe ? [topNormals, topNormals] : [topNormals, sideNormalsForward, sideNormalsBackward, sideNormalsForward, sideNormalsBackward];
      });

      attribute.value = new Float32Array((0, _lodash2.default)(normals));
    }
  }, {
    key: 'calculateSideNormals',
    value: function calculateSideNormals(vertices) {
      var numVertices = vertices.length;
      var normals = [];

      for (var i = 0; i < numVertices - 1; i++) {
        var n = getNormal(vertices[i], vertices[i + 1]);
        normals.push(n);
      }

      return [[].concat(normals, [normals[0]]), [normals[0]].concat(normals)];
    }
  }, {
    key: 'calculateIndices',
    value: function calculateIndices(attribute) {
      var _this4 = this;

      // adjust index offset for multiple buildings
      var multiplier = this.props.drawWireframe ? 2 : 5;
      var offsets = this.state.groupedVertices.reduce(function (acc, vertices) {
        return [].concat((0, _toConsumableArray3.default)(acc), [acc[acc.length - 1] + countVertices(vertices) * multiplier]);
      }, [0]);

      var indices = this.state.groupedVertices.map(function (vertices, buildingIndex) {
        return _this4.props.drawWireframe ? // 1. get sequentially ordered indices of each building wireframe
        // 2. offset them by the number of indices in previous buildings
        _this4.calculateContourIndices(vertices, offsets[buildingIndex]) : // 1. get triangulated indices for the internal areas
        // 2. offset them by the number of indices in previous buildings
        _this4.calculateSurfaceIndices(vertices, offsets[buildingIndex]);
      });

      attribute.value = new Uint32Array((0, _lodash2.default)(indices));
      attribute.target = this.state.gl.ELEMENT_ARRAY_BUFFER;
      this.state.model.setVertexCount(attribute.value.length / attribute.size);
    }
  }, {
    key: 'extractBuildings',
    value: function extractBuildings() {
      var _this5 = this;

      var data = this.props.data;


      this.state.buildings = [];

      data.map(function (building) {
        var properties = building.properties,
            geometry = building.geometry;
        var coordinates = geometry.coordinates,
            type = geometry.type;

        if (type === 'MultiPolygon') {
          var _state$buildings;

          var buildings = coordinates.map(function (coords) {
            return {
              coordinates: coords,
              properties: properties
            };
          });
          (_state$buildings = _this5.state.buildings).push.apply(_state$buildings, (0, _toConsumableArray3.default)(buildings));
        } else {
          _this5.state.buildings.push({ coordinates: coordinates, properties: properties });
        }
      });

      this.state.groupedVertices = this.state.buildings.map(function (building) {
        var h = building.properties.height || 15;
        return building.coordinates.map(function (polygon) {
          return polygon.map(function (coordinate) {
            return [coordinate[0], coordinate[1], h];
          });
        });
      });
    }
  }, {
    key: 'calculateContourIndices',
    value: function calculateContourIndices(vertices, offset) {
      var stride = countVertices(vertices);

      return vertices.map(function (polygon) {
        var indices = [offset];
        var numVertices = polygon.length;

        // building top
        // use vertex pairs for gl.LINES => [0, 1, 1, 2, 2, ..., n-1, n-1, 0]
        for (var i = 1; i < numVertices - 1; i++) {
          indices.push(i + offset, i + offset);
        }
        indices.push(offset);

        // building sides
        for (var _i = 0; _i < numVertices - 1; _i++) {
          indices.push(_i + offset, _i + stride + offset);
        }

        offset += numVertices;
        return indices;
      });
    }
  }, {
    key: 'calculateSurfaceIndices',
    value: function calculateSurfaceIndices(vertices, offset) {
      var stride = countVertices(vertices);
      var holes = null;
      var quad = [[0, 1], [0, 3], [1, 2], [1, 2], [0, 3], [1, 4]];

      if (vertices.length > 1) {
        holes = vertices.reduce(function (acc, polygon) {
          return [].concat((0, _toConsumableArray3.default)(acc), [acc[acc.length - 1] + polygon.length]);
        }, [0]).slice(1, vertices.length);
      }

      var topIndices = (0, _earcut2.default)((0, _lodash2.default)(vertices), holes, 3).map(function (index) {
        return index + offset;
      });

      var sideIndices = vertices.map(function (polygon) {
        var numVertices = polygon.length;
        // building top
        var indices = [];

        // building sides
        for (var i = 0; i < numVertices - 1; i++) {
          indices.push.apply(indices, (0, _toConsumableArray3.default)(drawRectangle(i)));
        }

        offset += numVertices;
        return indices;
      });

      return [topIndices, sideIndices];

      function drawRectangle(i) {
        return quad.map(function (v) {
          return i + v[0] + stride * v[1] + offset;
        });
      }
    }
  }, {
    key: 'updateUniforms',
    value: function updateUniforms() {
      this.calculateUniforms();
      var pixelPerMeter = this.state.pixelPerMeter;
      var _props = this.props,
          color = _props.color,
          opacity = _props.opacity,
          ambientColor = _props.ambientColor,
          pointLightColor = _props.pointLightColor,
          pointLightLocation = _props.pointLightLocation,
          pointLightAmbientCoefficient = _props.pointLightAmbientCoefficient,
          pointLightAttenuation = _props.pointLightAttenuation,
          materialSpecularColor = _props.materialSpecularColor,
          materialShininess = _props.materialShininess;


      this.setUniforms({
        pixelPerMeter: pixelPerMeter,
        colors: color || [128, 128, 128],
        opacity: opacity || 1,
        uAmbientColor: ambientColor || [255, 255, 255],
        uPointLightAmbientCoefficient: pointLightAmbientCoefficient || 0.1,
        uPointLightLocation: pointLightLocation || [0, 0, 0],
        uPointLightColor: pointLightColor || [255, 255, 255],
        uPointLightAttenuation: pointLightAttenuation || 0.1,
        uMaterialSpecularColor: materialSpecularColor || [255, 255, 255],
        uMaterialShininess: materialShininess || 1
      });
    }
  }, {
    key: 'calculateUniforms',
    value: function calculateUniforms() {
      var DISTANCE_IN_METER = 37.0409;
      var pixel0 = this.project({ lon: -122, lat: 37.5 });
      var pixel1 = this.project({ lon: -122, lat: 37.5002 });

      var dx = pixel0.x - pixel1.x;
      var dy = pixel0.y - pixel1.y;
      var scale = Math.sqrt(dx * dx + dy * dy) / DISTANCE_IN_METER;

      this.state.pixelPerMeter = scale;
    }
  }]);
  return BuildingLayer;
}(_deck.Layer);

/*
* helpers
*/
// get normal vector of line segment


exports.default = BuildingLayer;
function getNormal(p1, p2) {
  if (p1[0] === p2[0] && p1[1] === p2[1]) {
    return [1, 0, 0];
  }

  var degrees2radians = Math.PI / 180;

  var lon1 = degrees2radians * p1[0];
  var lon2 = degrees2radians * p2[0];
  var lat1 = degrees2radians * p1[1];
  var lat2 = degrees2radians * p2[1];

  var a = Math.sin(lon2 - lon1) * Math.cos(lat2);
  var b = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

  return _glMatrix.vec3.normalize([], [b, 0, -a]);
}

// count number of vertices in geojson polygon
function countVertices(vertices) {
  return vertices.reduce(function (count, polygon) {
    return count + polygon.length;
  }, 0);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2J1aWxkaW5nLWxheWVyL2J1aWxkaW5nLWxheWVyLmpzIl0sIm5hbWVzIjpbInZpZXdNYXRyaXhDb21wYXQiLCJjcmVhdGUiLCJsb29rQXQiLCJ2aWV3TWF0cml4IiwiRmxvYXQzMkFycmF5IiwiQnVpbGRpbmdMYXllciIsInByb3BzIiwib3BhY2l0eSIsImdsIiwiY29udGV4dCIsImF0dHJpYnV0ZU1hbmFnZXIiLCJzdGF0ZSIsImFkZER5bmFtaWMiLCJpbmRpY2VzIiwic2l6ZSIsInVwZGF0ZSIsImNhbGN1bGF0ZUluZGljZXMiLCJpc0luZGV4ZWQiLCJwb3NpdGlvbnMiLCJjYWxjdWxhdGVQb3NpdGlvbnMiLCJub3JtYWxzIiwiY2FsY3VsYXRlTm9ybWFscyIsInNldFVuaWZvcm1zIiwiSW5kZXhUeXBlIiwiZ2V0RXh0ZW5zaW9uIiwiVWludDMyQXJyYXkiLCJVaW50MTZBcnJheSIsInNldFN0YXRlIiwibnVtSW5zdGFuY2VzIiwibW9kZWwiLCJnZXRNb2RlbCIsImV4dHJhY3RCdWlsZGluZ3MiLCJ1cGRhdGVVbmlmb3JtcyIsIm9sZFByb3BzIiwibmV3UHJvcHMiLCJkYXRhQ2hhbmdlZCIsImludmFsaWRhdGVBbGwiLCJ2cyIsImZzIiwiZ2V0U2hhZGVycyIsImdlb21ldHJ5IiwiaWQiLCJkcmF3TW9kZSIsImRyYXdXaXJlZnJhbWUiLCJ2ZXJ0ZXhDb3VudCIsInVuaWZvcm1zIiwicmVuZGVyIiwiYXR0cmlidXRlIiwiZ3JvdXBlZFZlcnRpY2VzIiwibWFwIiwidG9wVmVydGljZXMiLCJBcnJheSIsInByb3RvdHlwZSIsImNvbmNhdCIsImFwcGx5IiwidmVydGljZXMiLCJiYXNlVmVydGljZXMiLCJ2IiwidmFsdWUiLCJ1cCIsImJ1aWxkaW5nSW5kZXgiLCJ0b3BOb3JtYWxzIiwiY291bnRWZXJ0aWNlcyIsImZpbGwiLCJzaWRlTm9ybWFscyIsImNhbGN1bGF0ZVNpZGVOb3JtYWxzIiwicG9seWdvbiIsInNpZGVOb3JtYWxzRm9yd2FyZCIsIm4iLCJzaWRlTm9ybWFsc0JhY2t3YXJkIiwibnVtVmVydGljZXMiLCJsZW5ndGgiLCJpIiwiZ2V0Tm9ybWFsIiwicHVzaCIsIm11bHRpcGxpZXIiLCJvZmZzZXRzIiwicmVkdWNlIiwiYWNjIiwiY2FsY3VsYXRlQ29udG91ckluZGljZXMiLCJjYWxjdWxhdGVTdXJmYWNlSW5kaWNlcyIsInRhcmdldCIsIkVMRU1FTlRfQVJSQVlfQlVGRkVSIiwic2V0VmVydGV4Q291bnQiLCJkYXRhIiwiYnVpbGRpbmdzIiwicHJvcGVydGllcyIsImJ1aWxkaW5nIiwiY29vcmRpbmF0ZXMiLCJ0eXBlIiwiY29vcmRzIiwiaCIsImhlaWdodCIsImNvb3JkaW5hdGUiLCJvZmZzZXQiLCJzdHJpZGUiLCJob2xlcyIsInF1YWQiLCJzbGljZSIsInRvcEluZGljZXMiLCJpbmRleCIsInNpZGVJbmRpY2VzIiwiZHJhd1JlY3RhbmdsZSIsImNhbGN1bGF0ZVVuaWZvcm1zIiwicGl4ZWxQZXJNZXRlciIsImNvbG9yIiwiYW1iaWVudENvbG9yIiwicG9pbnRMaWdodENvbG9yIiwicG9pbnRMaWdodExvY2F0aW9uIiwicG9pbnRMaWdodEFtYmllbnRDb2VmZmljaWVudCIsInBvaW50TGlnaHRBdHRlbnVhdGlvbiIsIm1hdGVyaWFsU3BlY3VsYXJDb2xvciIsIm1hdGVyaWFsU2hpbmluZXNzIiwiY29sb3JzIiwidUFtYmllbnRDb2xvciIsInVQb2ludExpZ2h0QW1iaWVudENvZWZmaWNpZW50IiwidVBvaW50TGlnaHRMb2NhdGlvbiIsInVQb2ludExpZ2h0Q29sb3IiLCJ1UG9pbnRMaWdodEF0dGVudWF0aW9uIiwidU1hdGVyaWFsU3BlY3VsYXJDb2xvciIsInVNYXRlcmlhbFNoaW5pbmVzcyIsIkRJU1RBTkNFX0lOX01FVEVSIiwicGl4ZWwwIiwicHJvamVjdCIsImxvbiIsImxhdCIsInBpeGVsMSIsImR4IiwieCIsImR5IiwieSIsInNjYWxlIiwiTWF0aCIsInNxcnQiLCJwMSIsInAyIiwiZGVncmVlczJyYWRpYW5zIiwiUEkiLCJsb24xIiwibG9uMiIsImxhdDEiLCJsYXQyIiwiYSIsInNpbiIsImNvcyIsImIiLCJub3JtYWxpemUiLCJjb3VudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsbUJBQW1CLGVBQUtDLE1BQUwsRUFBekI7QUFDQSxlQUFLQyxNQUFMLENBQVlGLGdCQUFaLEVBQThCLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBQTlCLEVBQXlDLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFDLENBQVIsQ0FBekMsRUFBcUQsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsQ0FBckQ7QUFDQSxJQUFNRyxhQUFhLElBQUlDLFlBQUosQ0FBaUJKLGdCQUFqQixDQUFuQjs7SUFFcUJLLGE7OztBQUNuQjs7Ozs7Ozs7Ozs7O0FBWUEseUJBQVlDLEtBQVosRUFBbUI7QUFBQTtBQUFBO0FBRWZDLGVBQVM7QUFGTSxPQUdaRCxLQUhZO0FBS2xCOzs7O3NDQUVpQjtBQUFBLFVBQ1RFLEVBRFMsR0FDSCxLQUFLQyxPQURGLENBQ1RELEVBRFM7QUFBQSxVQUVURSxnQkFGUyxHQUVXLEtBQUtDLEtBRmhCLENBRVRELGdCQUZTOzs7QUFJaEJBLHVCQUFpQkUsVUFBakIsQ0FBNEI7QUFDMUI7QUFDQUMsaUJBQVMsRUFBQ0MsTUFBTSxDQUFQLEVBQVVDLFFBQVEsS0FBS0MsZ0JBQXZCLEVBQXlDQyxXQUFXLElBQXBELEVBRmlCO0FBRzFCQyxtQkFBVyxFQUFDSixNQUFNLENBQVAsRUFBVUMsUUFBUSxLQUFLSSxrQkFBdkIsRUFIZTtBQUkxQjtBQUNBQyxpQkFBUyxFQUFDTixNQUFNLENBQVAsRUFBVUMsUUFBUSxLQUFLTSxnQkFBdkI7QUFMaUIsT0FBNUI7O0FBUUEsV0FBS0MsV0FBTCxDQUFpQixFQUFDZixTQUFTLEtB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ImZpbGUiOiJidWlsZGluZy1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TGF5ZXIsIGFzc2VtYmxlU2hhZGVyc30gZnJvbSAnZGVjay5nbCc7XG5pbXBvcnQgZWFyY3V0IGZyb20gJ2VhcmN1dCc7XG5pbXBvcnQgZmxhdHRlbkRlZXAgZnJvbSAnbG9kYXNoLmZsYXR0ZW5kZWVwJztcbmltcG9ydCB7TW9kZWwsIEdlb21ldHJ5fSBmcm9tICdsdW1hLmdsJztcbmltcG9ydCB7bWF0NCwgdmVjM30gZnJvbSAnZ2wtbWF0cml4JztcblxuaW1wb3J0IHZzIGZyb20gJy4vYnVpbGRpbmctbGF5ZXItdmVydGV4Lmdsc2wnO1xuaW1wb3J0IGZzIGZyb20gJy4vYnVpbGRpbmctbGF5ZXItZnJhZ21lbnQuZ2xzbCc7XG5cbmNvbnN0IHZpZXdNYXRyaXhDb21wYXQgPSBtYXQ0LmNyZWF0ZSgpO1xubWF0NC5sb29rQXQodmlld01hdHJpeENvbXBhdCwgWzAsIDAsIDBdLCBbMCwgMCwgLTFdLCBbMCwgMSwgMF0pO1xuY29uc3Qgdmlld01hdHJpeCA9IG5ldyBGbG9hdDMyQXJyYXkodmlld01hdHJpeENvbXBhdCk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1aWxkaW5nTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAY2xhc3NkZXNjXG4gICAqIEJ1aWxkaW5nTGF5ZXJcbiAgICpcbiAgICogQGNsYXNzXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wc1xuICAgKiBAcGFyYW0ge2Jvb2x9IHByb3BzLmRyYXdXaXJlZnJhbWUgLSA/IGRyYXdXaXJlZnJhbWUgOiBkcmF3U29saWRcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gcHJvcHMub25CdWlsZGluZ0hvdmVyZWQgLSBwcm92aWRlIHByb2VydGllcyBvZiB0aGVcbiAgICogc2VsZWN0ZWQgYnVpbGRpbmcsIHRvZ2V0aGVyIHdpdGggdGhlIG1vdXNlIGV2ZW50IHdoZW4gbW91c2UgaG92ZXJlZFxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBwcm9wcy5vbkJ1aWxkaW5nQ2xpY2tlZCAtIHByb3ZpZGUgcHJvZXJ0aWVzIG9mIHRoZVxuICAgKiBzZWxlY3RlZCBidWlsZGluZywgdG9nZXRoZXIgd2l0aCB0aGUgbW91c2UgZXZlbnQgd2hlbiBtb3VzZSBjbGlja2VkXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHtcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAuLi5wcm9wc1xuICAgIH0pO1xuICB9XG5cbiAgaW5pdGlhbGl6ZVN0YXRlKCkge1xuICAgIGNvbnN0IHtnbH0gPSB0aGlzLmNvbnRleHQ7XG4gICAgY29uc3Qge2F0dHJpYnV0ZU1hbmFnZXJ9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGF0dHJpYnV0ZU1hbmFnZXIuYWRkRHluYW1pYyh7XG4gICAgICAvLyBQcmltdGl2ZSBhdHRyaWJ1dGVzXG4gICAgICBpbmRpY2VzOiB7c2l6ZTogMSwgdXBkYXRlOiB0aGlzLmNhbGN1bGF0ZUluZGljZXMsIGlzSW5kZXhlZDogdHJ1ZX0sXG4gICAgICBwb3NpdGlvbnM6IHtzaXplOiAzLCB1cGRhdGU6IHRoaXMuY2FsY3VsYXRlUG9zaXRpb25zfSxcbiAgICAgIC8vIGNvbG9yczoge3VwZGF0ZTogdGhpcy5jYWxjdWxhdGVDb2xvcnN9LFxuICAgICAgbm9ybWFsczoge3NpemU6IDMsIHVwZGF0ZTogdGhpcy5jYWxjdWxhdGVOb3JtYWxzfVxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXRVbmlmb3Jtcyh7b3BhY2l0eTogdGhpcy5wcm9wcy5vcGFjaXR5fSk7XG5cbiAgICBjb25zdCBJbmRleFR5cGUgPSBnbC5nZXRFeHRlbnNpb24oJ09FU19lbGVtZW50X2luZGV4X3VpbnQnKVxuICAgICAgPyBVaW50MzJBcnJheVxuICAgICAgOiBVaW50MTZBcnJheTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbnVtSW5zdGFuY2VzOiAwLFxuICAgICAgbW9kZWw6IHRoaXMuZ2V0TW9kZWwoZ2wpLFxuICAgICAgSW5kZXhUeXBlXG4gICAgfSk7XG5cbiAgICB0aGlzLmV4dHJhY3RCdWlsZGluZ3MoKTtcbiAgfVxuXG4gIGRpZE1vdW50KCkge1xuICAgIHRoaXMudXBkYXRlVW5pZm9ybXMoKTtcbiAgfVxuXG4gIHdpbGxSZWNlaXZlUHJvcHMob2xkUHJvcHMsIG5ld1Byb3BzKSB7XG4gICAgc3VwZXIud2lsbFJlY2VpdmVQcm9wcyhvbGRQcm9wcywgbmV3UHJvcHMpO1xuXG4gICAgY29uc3Qge2RhdGFDaGFuZ2VkLCBhdHRyaWJ1dGVNYW5hZ2VyfSA9IHRoaXMuc3RhdGU7XG4gICAgaWYgKGRhdGFDaGFuZ2VkKSB7XG4gICAgICB0aGlzLmV4dHJhY3RCdWlsZGluZ3MoKTtcblxuICAgICAgYXR0cmlidXRlTWFuYWdlci5pbnZhbGlkYXRlQWxsKCk7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVVbmlmb3JtcygpO1xuICB9XG5cbiAgZ2V0U2hhZGVycygpIHtcbiAgICByZXR1cm4ge3ZzLCBmc307XG4gIH1cblxuICBnZXRNb2RlbChnbCkge1xuICAgIHJldHVybiBuZXcgTW9kZWwoe1xuICAgICAgLi4uYXNzZW1ibGVTaGFkZXJzKGdsLCB0aGlzLmdldFNoYWRlcnMoKSksXG4gICAgICBnZW9tZXRyeTogbmV3IEdlb21ldHJ5KHtcbiAgICAgICAgaWQ6IHRoaXMucHJvcHMuaWQsXG4gICAgICAgIGRyYXdNb2RlOiB0aGlzLnByb3BzLmRyYXdXaXJlZnJhbWUgPyAnTElORVMnIDogJ1RSSUFOR0xFUydcbiAgICAgIH0pLFxuICAgICAgdmVydGV4Q291bnQ6IDAsXG4gICAgICBpc0luZGV4ZWQ6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIGRyYXcoe3VuaWZvcm1zfSkge1xuICAgIHRoaXMuc3RhdGUubW9kZWwucmVuZGVyKHtcbiAgICAgIC4uLnVuaWZvcm1zLFxuICAgICAgdmlld01hdHJpeFxuICAgIH0pO1xuICB9XG5cbiAgLy8gZWFjaCB0b3AgdmVydGV4IGlzIG9uIDMgc3VyZmFjZXNcbiAgLy8gZWFjaCBib3R0b20gdmVydGV4IGlzIG9uIDIgc3VyZmFjZXNcbiAgY2FsY3VsYXRlUG9zaXRpb25zKGF0dHJpYnV0ZSkge1xuICAgIGNvbnN0IHBvc2l0aW9ucyA9IGZsYXR0ZW5EZWVwKFxuICAgICAgdGhpcy5zdGF0ZS5ncm91cGVkVmVydGljZXMubWFwKHZlcnRpY2VzID0+IHtcbiAgICAgICAgY29uc3QgdG9wVmVydGljZXMgPSBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KFtdLCB2ZXJ0aWNlcyk7XG4gICAgICAgIGNvbnN0IGJhc2VWZXJ0aWNlcyA9IHRvcFZlcnRpY2VzLm1hcCh2ID0+IFt2WzBdLCB2WzFdLCAwXSk7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmRyYXdXaXJlZnJhbWVcbiAgICAgICAgICA/IFt0b3BWZXJ0aWNlcywgYmFzZVZlcnRpY2VzXVxuICAgICAgICAgIDogW3RvcFZlcnRpY2VzLCB0b3BWZXJ0aWNlcywgdG9wVmVydGljZXMsIGJhc2VWZXJ0aWNlcywgYmFzZVZlcnRpY2VzXTtcbiAgICAgIH0pXG4gICAgKTtcbiAgICBhdHRyaWJ1dGUudmFsdWUgPSBuZXcgRmxvYXQzMkFycmF5KHBvc2l0aW9ucyk7XG4gIH1cblxuICBjYWxjdWxhdGVOb3JtYWxzKGF0dHJpYnV0ZSkge1xuICAgIGNvbnN0IHVwID0gWzAsIDEsIDBdO1xuXG4gICAgY29uc3Qgbm9ybWFscyA9IHRoaXMuc3RhdGUuZ3JvdXBlZFZlcnRpY2VzLm1hcChcbiAgICAgICh2ZXJ0aWNlcywgYnVpbGRpbmdJbmRleCkgPT4ge1xuICAgICAgICBjb25zdCB0b3BOb3JtYWxzID0gbmV3IEFycmF5KGNvdW50VmVydGljZXModmVydGljZXMpKS5maWxsKHVwKTtcbiAgICAgICAgY29uc3Qgc2lkZU5vcm1hbHMgPSB2ZXJ0aWNlcy5tYXAocG9seWdvbiA9PlxuICAgICAgICAgIHRoaXMuY2FsY3VsYXRlU2lkZU5vcm1hbHMocG9seWdvbilcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3Qgc2lkZU5vcm1hbHNGb3J3YXJkID0gc2lkZU5vcm1hbHMubWFwKG4gPT4gblswXSk7XG4gICAgICAgIGNvbnN0IHNpZGVOb3JtYWxzQmFja3dhcmQgPSBzaWRlTm9ybWFscy5tYXAobiA9PiBuWzFdKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5kcmF3V2lyZWZyYW1lXG4gICAgICAgICAgPyBbdG9wTm9ybWFscywgdG9wTm9ybWFsc11cbiAgICAgICAgICA6IFtcbiAgICAgICAgICAgICAgdG9wTm9ybWFscyxcbiAgICAgICAgICAgICAgc2lkZU5vcm1hbHNGb3J3YXJkLFxuICAgICAgICAgICAgICBzaWRlTm9ybWFsc0JhY2t3YXJkLFxuICAgICAgICAgICAgICBzaWRlTm9ybWFsc0ZvcndhcmQsXG4gICAgICAgICAgICAgIHNpZGVOb3JtYWxzQmFja3dhcmRcbiAgICAgICAgICAgIF07XG4gICAgICB9XG4gICAgKTtcblxuICAgIGF0dHJpYnV0ZS52YWx1ZSA9IG5ldyBGbG9hdDMyQXJyYXkoZmxhdHRlbkRlZXAobm9ybWFscykpO1xuICB9XG5cbiAgY2FsY3VsYXRlU2lkZU5vcm1hbHModmVydGljZXMpIHtcbiAgICBjb25zdCBudW1WZXJ0aWNlcyA9IHZlcnRpY2VzLmxlbmd0aDtcbiAgICBjb25zdCBub3JtYWxzID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVZlcnRpY2VzIC0gMTsgaSsrKSB7XG4gICAgICBjb25zdCBuID0gZ2V0Tm9ybWFsKHZlcnRpY2VzW2ldLCB2ZXJ0aWNlc1tpICsgMV0pO1xuICAgICAgbm9ybWFscy5wdXNoKG4pO1xuICAgIH1cblxuICAgIHJldHVybiBbWy4uLm5vcm1hbHMsIG5vcm1hbHNbMF1dLCBbbm9ybWFsc1swXSwgLi4ubm9ybWFsc11dO1xuICB9XG5cbiAgY2FsY3VsYXRlSW5kaWNlcyhhdHRyaWJ1dGUpIHtcbiAgICAvLyBhZGp1c3QgaW5kZXggb2Zmc2V0IGZvciBtdWx0aXBsZSBidWlsZGluZ3NcbiAgICBjb25zdCBtdWx0aXBsaWVyID0gdGhpcy5wcm9wcy5kcmF3V2lyZWZyYW1lID8gMiA6IDU7XG4gICAgY29uc3Qgb2Zmc2V0cyA9IHRoaXMuc3RhdGUuZ3JvdXBlZFZlcnRpY2VzLnJlZHVjZShcbiAgICAgIChhY2MsIHZlcnRpY2VzKSA9PiBbXG4gICAgICAgIC4uLmFjYyxcbiAgICAgICAgYWNjW2FjYy5sZW5ndGggLSAxXSArIGNvdW50VmVydGljZXModmVydGljZXMpICogbXVsdGlwbGllclxuICAgICAgXSxcbiAgICAgIFswXVxuICAgICk7XG5cbiAgICBjb25zdCBpbmRpY2VzID0gdGhpcy5zdGF0ZS5ncm91cGVkVmVydGljZXMubWFwKFxuICAgICAgKHZlcnRpY2VzLCBidWlsZGluZ0luZGV4KSA9PlxuICAgICAgICB0aGlzLnByb3BzLmRyYXdXaXJlZnJhbWVcbiAgICAgICAgICA/IC8vIDEuIGdldCBzZXF1ZW50aWFsbHkgb3JkZXJlZCBpbmRpY2VzIG9mIGVhY2ggYnVpbGRpbmcgd2lyZWZyYW1lXG4gICAgICAgICAgICAvLyAyLiBvZmZzZXQgdGhlbSBieSB0aGUgbnVtYmVyIG9mIGluZGljZXMgaW4gcHJldmlvdXMgYnVpbGRpbmdzXG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZUNvbnRvdXJJbmRpY2VzKHZlcnRpY2VzLCBvZmZzZXRzW2J1aWxkaW5nSW5kZXhdKVxuICAgICAgICAgIDogLy8gMS4gZ2V0IHRyaWFuZ3VsYXRlZCBpbmRpY2VzIGZvciB0aGUgaW50ZXJuYWwgYXJlYXNcbiAgICAgICAgICAgIC8vIDIuIG9mZnNldCB0aGVtIGJ5IHRoZSBudW1iZXIgb2YgaW5kaWNlcyBpbiBwcmV2aW91cyBidWlsZGluZ3NcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlU3VyZmFjZUluZGljZXModmVydGljZXMsIG9mZnNldHNbYnVpbGRpbmdJbmRleF0pXG4gICAgKTtcblxuICAgIGF0dHJpYnV0ZS52YWx1ZSA9IG5ldyBVaW50MzJBcnJheShmbGF0dGVuRGVlcChpbmRpY2VzKSk7XG4gICAgYXR0cmlidXRlLnRhcmdldCA9IHRoaXMuc3RhdGUuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVI7XG4gICAgdGhpcy5zdGF0ZS5tb2RlbC5zZXRWZXJ0ZXhDb3VudChhdHRyaWJ1dGUudmFsdWUubGVuZ3RoIC8gYXR0cmlidXRlLnNpemUpO1xuICB9XG5cbiAgZXh0cmFjdEJ1aWxkaW5ncygpIHtcbiAgICBjb25zdCB7ZGF0YX0gPSB0aGlzLnByb3BzO1xuXG4gICAgdGhpcy5zdGF0ZS5idWlsZGluZ3MgPSBbXTtcblxuICAgIGRhdGEubWFwKGJ1aWxkaW5nID0+IHtcbiAgICAgIGNvbnN0IHtwcm9wZXJ0aWVzLCBnZW9tZXRyeX0gPSBidWlsZGluZztcbiAgICAgIGNvbnN0IHtjb29yZGluYXRlcywgdHlwZX0gPSBnZW9tZXRyeTtcbiAgICAgIGlmICh0eXBlID09PSAnTXVsdGlQb2x5Z29uJykge1xuICAgICAgICBjb25zdCBidWlsZGluZ3MgPSBjb29yZGluYXRlcy5tYXAoY29vcmRzID0+ICh7XG4gICAgICAgICAgY29vcmRpbmF0ZXM6IGNvb3JkcyxcbiAgICAgICAgICBwcm9wZXJ0aWVzXG4gICAgICAgIH0pKTtcbiAgICAgICAgdGhpcy5zdGF0ZS5idWlsZGluZ3MucHVzaCguLi5idWlsZGluZ3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5idWlsZGluZ3MucHVzaCh7Y29vcmRpbmF0ZXMsIHByb3BlcnRpZXN9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuc3RhdGUuZ3JvdXBlZFZlcnRpY2VzID0gdGhpcy5zdGF0ZS5idWlsZGluZ3MubWFwKGJ1aWxkaW5nID0+IHtcbiAgICAgIHZhciBoID0gYnVpbGRpbmcucHJvcGVydGllcy5oZWlnaHQgfHwgMTU7XG4gICAgICByZXR1cm4gYnVpbGRpbmcuY29vcmRpbmF0ZXMubWFwKHBvbHlnb24gPT5cbiAgICAgICAgcG9seWdvbi5tYXAoY29vcmRpbmF0ZSA9PiBbY29vcmRpbmF0ZVswXSwgY29vcmRpbmF0ZVsxXSwgaF0pXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgY2FsY3VsYXRlQ29udG91ckluZGljZXModmVydGljZXMsIG9mZnNldCkge1xuICAgIGNvbnN0IHN0cmlkZSA9IGNvdW50VmVydGljZXModmVydGljZXMpO1xuXG4gICAgcmV0dXJuIHZlcnRpY2VzLm1hcChwb2x5Z29uID0+IHtcbiAgICAgIGNvbnN0IGluZGljZXMgPSBbb2Zmc2V0XTtcbiAgICAgIGNvbnN0IG51bVZlcnRpY2VzID0gcG9seWdvbi5sZW5ndGg7XG5cbiAgICAgIC8vIGJ1aWxkaW5nIHRvcFxuICAgICAgLy8gdXNlIHZlcnRleCBwYWlycyBmb3IgZ2wuTElORVMgPT4gWzAsIDEsIDEsIDIsIDIsIC4uLiwgbi0xLCBuLTEsIDBdXG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8IG51bVZlcnRpY2VzIC0gMTsgaSsrKSB7XG4gICAgICAgIGluZGljZXMucHVzaChpICsgb2Zmc2V0LCBpICsgb2Zmc2V0KTtcbiAgICAgIH1cbiAgICAgIGluZGljZXMucHVzaChvZmZzZXQpO1xuXG4gICAgICAvLyBidWlsZGluZyBzaWRlc1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1WZXJ0aWNlcyAtIDE7IGkrKykge1xuICAgICAgICBpbmRpY2VzLnB1c2goaSArIG9mZnNldCwgaSArIHN0cmlkZSArIG9mZnNldCk7XG4gICAgICB9XG5cbiAgICAgIG9mZnNldCArPSBudW1WZXJ0aWNlcztcbiAgICAgIHJldHVybiBpbmRpY2VzO1xuICAgIH0pO1xuICB9XG5cbiAgY2FsY3VsYXRlU3VyZmFjZUluZGljZXModmVydGljZXMsIG9mZnNldCkge1xuICAgIGNvbnN0IHN0cmlkZSA9IGNvdW50VmVydGljZXModmVydGljZXMpO1xuICAgIGxldCBob2xlcyA9IG51bGw7XG4gICAgY29uc3QgcXVhZCA9IFtbMCwgMV0sIFswLCAzXSwgWzEsIDJdLCBbMSwgMl0sIFswLCAzXSwgWzEsIDRdXTtcblxuICAgIGlmICh2ZXJ0aWNlcy5sZW5ndGggPiAxKSB7XG4gICAgICBob2xlcyA9IHZlcnRpY2VzXG4gICAgICAgIC5yZWR1Y2UoXG4gICAgICAgICAgKGFjYywgcG9seWdvbikgPT4gWy4uLmFjYywgYWNjW2FjYy5sZW5ndGggLSAxXSArIHBvbHlnb24ubGVuZ3RoXSxcbiAgICAgICAgICBbMF1cbiAgICAgICAgKVxuICAgICAgICAuc2xpY2UoMSwgdmVydGljZXMubGVuZ3RoKTtcbiAgICB9XG5cbiAgICBjb25zdCB0b3BJbmRpY2VzID0gZWFyY3V0KGZsYXR0ZW5EZWVwKHZlcnRpY2VzKSwgaG9sZXMsIDMpLm1hcChcbiAgICAgIGluZGV4ID0+IGluZGV4ICsgb2Zmc2V0XG4gICAgKTtcblxuICAgIGNvbnN0IHNpZGVJbmRpY2VzID0gdmVydGljZXMubWFwKHBvbHlnb24gPT4ge1xuICAgICAgY29uc3QgbnVtVmVydGljZXMgPSBwb2x5Z29uLmxlbmd0aDtcbiAgICAgIC8vIGJ1aWxkaW5nIHRvcFxuICAgICAgY29uc3QgaW5kaWNlcyA9IFtdO1xuXG4gICAgICAvLyBidWlsZGluZyBzaWRlc1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1WZXJ0aWNlcyAtIDE7IGkrKykge1xuICAgICAgICBpbmRpY2VzLnB1c2goLi4uZHJhd1JlY3RhbmdsZShpKSk7XG4gICAgICB9XG5cbiAgICAgIG9mZnNldCArPSBudW1WZXJ0aWNlcztcbiAgICAgIHJldHVybiBpbmRpY2VzO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIFt0b3BJbmRpY2VzLCBzaWRlSW5kaWNlc107XG5cbiAgICBmdW5jdGlvbiBkcmF3UmVjdGFuZ2xlKGkpIHtcbiAgICAgIHJldHVybiBxdWFkLm1hcCh2ID0+IGkgKyB2WzBdICsgc3RyaWRlICogdlsxXSArIG9mZnNldCk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlVW5pZm9ybXMoKSB7XG4gICAgdGhpcy5jYWxjdWxhdGVVbmlmb3JtcygpO1xuICAgIGNvbnN0IHtwaXhlbFBlck1ldGVyfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3Qge1xuICAgICAgY29sb3IsXG4gICAgICBvcGFjaXR5LFxuICAgICAgYW1iaWVudENvbG9yLFxuICAgICAgcG9pbnRMaWdodENvbG9yLFxuICAgICAgcG9pbnRMaWdodExvY2F0aW9uLFxuICAgICAgcG9pbnRMaWdodEFtYmllbnRDb2VmZmljaWVudCxcbiAgICAgIHBvaW50TGlnaHRBdHRlbnVhdGlvbixcbiAgICAgIG1hdGVyaWFsU3BlY3VsYXJDb2xvcixcbiAgICAgIG1hdGVyaWFsU2hpbmluZXNzXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICB0aGlzLnNldFVuaWZvcm1zKHtcbiAgICAgIHBpeGVsUGVyTWV0ZXIsXG4gICAgICBjb2xvcnM6IGNvbG9yIHx8IFsxMjgsIDEyOCwgMTI4XSxcbiAgICAgIG9wYWNpdHk6IG9wYWNpdHkgfHwgMSxcbiAgICAgIHVBbWJpZW50Q29sb3I6IGFtYmllbnRDb2xvciB8fCBbMjU1LCAyNTUsIDI1NV0sXG4gICAgICB1UG9pbnRMaWdodEFtYmllbnRDb2VmZmljaWVudDogcG9pbnRMaWdodEFtYmllbnRDb2VmZmljaWVudCB8fCAwLjEsXG4gICAgICB1UG9pbnRMaWdodExvY2F0aW9uOiBwb2ludExpZ2h0TG9jYXRpb24gfHwgWzAsIDAsIDBdLFxuICAgICAgdVBvaW50TGlnaHRDb2xvcjogcG9pbnRMaWdodENvbG9yIHx8IFsyNTUsIDI1NSwgMjU1XSxcbiAgICAgIHVQb2ludExpZ2h0QXR0ZW51YXRpb246IHBvaW50TGlnaHRBdHRlbnVhdGlvbiB8fCAwLjEsXG4gICAgICB1TWF0ZXJpYWxTcGVjdWxhckNvbG9yOiBtYXRlcmlhbFNwZWN1bGFyQ29sb3IgfHwgWzI1NSwgMjU1LCAyNTVdLFxuICAgICAgdU1hdGVyaWFsU2hpbmluZXNzOiBtYXRlcmlhbFNoaW5pbmVzcyB8fCAxXG4gICAgfSk7XG4gIH1cblxuICBjYWxjdWxhdGVVbmlmb3JtcygpIHtcbiAgICBjb25zdCBESVNUQU5DRV9JTl9NRVRFUiA9IDM3LjA0MDk7XG4gICAgY29uc3QgcGl4ZWwwID0gdGhpcy5wcm9qZWN0KHtsb246IC0xMjIsIGxhdDogMzcuNX0pO1xuICAgIGNvbnN0IHBpeGVsMSA9IHRoaXMucHJvamVjdCh7bG9uOiAtMTIyLCBsYXQ6IDM3LjUwMDJ9KTtcblxuICAgIGNvbnN0IGR4ID0gcGl4ZWwwLnggLSBwaXhlbDEueDtcbiAgICBjb25zdCBkeSA9IHBpeGVsMC55IC0gcGl4ZWwxLnk7XG4gICAgY29uc3Qgc2NhbGUgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpIC8gRElTVEFOQ0VfSU5fTUVURVI7XG5cbiAgICB0aGlzLnN0YXRlLnBpeGVsUGVyTWV0ZXIgPSBzY2FsZTtcbiAgfVxufVxuXG4vKlxuKiBoZWxwZXJzXG4qL1xuLy8gZ2V0IG5vcm1hbCB2ZWN0b3Igb2YgbGluZSBzZWdtZW50XG5mdW5jdGlvbiBnZXROb3JtYWwocDEsIHAyKSB7XG4gIGlmIChwMVswXSA9PT0gcDJbMF0gJiYgcDFbMV0gPT09IHAyWzFdKSB7XG4gICAgcmV0dXJuIFsxLCAwLCAwXTtcbiAgfVxuXG4gIGNvbnN0IGRlZ3JlZXMycmFkaWFucyA9IE1hdGguUEkgLyAxODA7XG5cbiAgY29uc3QgbG9uMSA9IGRlZ3JlZXMycmFkaWFucyAqIHAxWzBdO1xuICBjb25zdCBsb24yID0gZGVncmVlczJyYWRpYW5zICogcDJbMF07XG4gIGNvbnN0IGxhdDEgPSBkZWdyZWVzMnJhZGlhbnMgKiBwMVsxXTtcbiAgY29uc3QgbGF0MiA9IGRlZ3JlZXMycmFkaWFucyAqIHAyWzFdO1xuXG4gIGNvbnN0IGEgPSBNYXRoLnNpbihsb24yIC0gbG9uMSkgKiBNYXRoLmNvcyhsYXQyKTtcbiAgY29uc3QgYiA9XG4gICAgTWF0aC5jb3MobGF0MSkgKiBNYXRoLnNpbihsYXQyKSAtXG4gICAgTWF0aC5zaW4obGF0MSkgKiBNYXRoLmNvcyhsYXQyKSAqIE1hdGguY29zKGxvbjIgLSBsb24xKTtcblxuICByZXR1cm4gdmVjMy5ub3JtYWxpemUoW10sIFtiLCAwLCAtYV0pO1xufVxuXG4vLyBjb3VudCBudW1iZXIgb2YgdmVydGljZXMgaW4gZ2VvanNvbiBwb2x5Z29uXG5mdW5jdGlvbiBjb3VudFZlcnRpY2VzKHZlcnRpY2VzKSB7XG4gIHJldHVybiB2ZXJ0aWNlcy5yZWR1Y2UoKGNvdW50LCBwb2x5Z29uKSA9PiBjb3VudCArIHBvbHlnb24ubGVuZ3RoLCAwKTtcbn1cbiJdfQ==