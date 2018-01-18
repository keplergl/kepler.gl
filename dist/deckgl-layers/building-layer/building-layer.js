'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

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
    return (0, _possibleConstructorReturn3.default)(this, _Layer.call(this, (0, _extends3.default)({
      opacity: 1
    }, props)));
  }

  BuildingLayer.prototype.initializeState = function initializeState() {
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
  };

  BuildingLayer.prototype.didMount = function didMount() {
    this.updateUniforms();
  };

  BuildingLayer.prototype.willReceiveProps = function willReceiveProps(oldProps, newProps) {
    _Layer.prototype.willReceiveProps.call(this, oldProps, newProps);

    var _state = this.state,
        dataChanged = _state.dataChanged,
        attributeManager = _state.attributeManager;

    if (dataChanged) {
      this.extractBuildings();

      attributeManager.invalidateAll();
    }

    this.updateUniforms();
  };

  BuildingLayer.prototype.getShaders = function getShaders() {
    return { vs: _buildingLayerVertex2.default, fs: _buildingLayerFragment2.default };
  };

  BuildingLayer.prototype.getModel = function getModel(gl) {
    return new _luma.Model((0, _extends3.default)({}, (0, _deck.assembleShaders)(gl, this.getShaders()), {
      geometry: new _luma.Geometry({
        id: this.props.id,
        drawMode: this.props.drawWireframe ? 'LINES' : 'TRIANGLES'
      }),
      vertexCount: 0,
      isIndexed: true
    }));
  };

  BuildingLayer.prototype.draw = function draw(_ref) {
    var uniforms = _ref.uniforms;

    this.state.model.render((0, _extends3.default)({}, uniforms, {
      viewMatrix: viewMatrix
    }));
  };

  // each top vertex is on 3 surfaces
  // each bottom vertex is on 2 surfaces


  BuildingLayer.prototype.calculatePositions = function calculatePositions(attribute) {
    var _this2 = this;

    var positions = (0, _lodash2.default)(this.state.groupedVertices.map(function (vertices) {
      var topVertices = Array.prototype.concat.apply([], vertices);
      var baseVertices = topVertices.map(function (v) {
        return [v[0], v[1], 0];
      });
      return _this2.props.drawWireframe ? [topVertices, baseVertices] : [topVertices, topVertices, topVertices, baseVertices, baseVertices];
    }));
    attribute.value = new Float32Array(positions);
  };

  BuildingLayer.prototype.calculateNormals = function calculateNormals(attribute) {
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
  };

  BuildingLayer.prototype.calculateSideNormals = function calculateSideNormals(vertices) {
    var numVertices = vertices.length;
    var normals = [];

    for (var i = 0; i < numVertices - 1; i++) {
      var n = getNormal(vertices[i], vertices[i + 1]);
      normals.push(n);
    }

    return [[].concat(normals, [normals[0]]), [normals[0]].concat(normals)];
  };

  BuildingLayer.prototype.calculateIndices = function calculateIndices(attribute) {
    var _this4 = this;

    // adjust index offset for multiple buildings
    var multiplier = this.props.drawWireframe ? 2 : 5;
    var offsets = this.state.groupedVertices.reduce(function (acc, vertices) {
      return [].concat(acc, [acc[acc.length - 1] + countVertices(vertices) * multiplier]);
    }, [0]);

    var indices = this.state.groupedVertices.map(function (vertices, buildingIndex) {
      return _this4.props.drawWireframe ?
      // 1. get sequentially ordered indices of each building wireframe
      // 2. offset them by the number of indices in previous buildings
      _this4.calculateContourIndices(vertices, offsets[buildingIndex]) :
      // 1. get triangulated indices for the internal areas
      // 2. offset them by the number of indices in previous buildings
      _this4.calculateSurfaceIndices(vertices, offsets[buildingIndex]);
    });

    attribute.value = new Uint32Array((0, _lodash2.default)(indices));
    attribute.target = this.state.gl.ELEMENT_ARRAY_BUFFER;
    this.state.model.setVertexCount(attribute.value.length / attribute.size);
  };

  BuildingLayer.prototype.extractBuildings = function extractBuildings() {
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
        (_state$buildings = _this5.state.buildings).push.apply(_state$buildings, buildings);
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
  };

  BuildingLayer.prototype.calculateContourIndices = function calculateContourIndices(vertices, offset) {
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
  };

  BuildingLayer.prototype.calculateSurfaceIndices = function calculateSurfaceIndices(vertices, offset) {
    var stride = countVertices(vertices);
    var holes = null;
    var quad = [[0, 1], [0, 3], [1, 2], [1, 2], [0, 3], [1, 4]];

    if (vertices.length > 1) {
      holes = vertices.reduce(function (acc, polygon) {
        return [].concat(acc, [acc[acc.length - 1] + polygon.length]);
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
        indices.push.apply(indices, drawRectangle(i));
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
  };

  BuildingLayer.prototype.updateUniforms = function updateUniforms() {
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
  };

  BuildingLayer.prototype.calculateUniforms = function calculateUniforms() {
    var DISTANCE_IN_METER = 37.0409;
    var pixel0 = this.project({ lon: -122, lat: 37.5 });
    var pixel1 = this.project({ lon: -122, lat: 37.5002 });

    var dx = pixel0.x - pixel1.x;
    var dy = pixel0.y - pixel1.y;
    var scale = Math.sqrt(dx * dx + dy * dy) / DISTANCE_IN_METER;

    this.state.pixelPerMeter = scale;
  };

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2J1aWxkaW5nLWxheWVyL2J1aWxkaW5nLWxheWVyLmpzIl0sIm5hbWVzIjpbInZpZXdNYXRyaXhDb21wYXQiLCJjcmVhdGUiLCJsb29rQXQiLCJ2aWV3TWF0cml4IiwiRmxvYXQzMkFycmF5IiwiQnVpbGRpbmdMYXllciIsInByb3BzIiwib3BhY2l0eSIsImluaXRpYWxpemVTdGF0ZSIsImdsIiwiY29udGV4dCIsImF0dHJpYnV0ZU1hbmFnZXIiLCJzdGF0ZSIsImFkZER5bmFtaWMiLCJpbmRpY2VzIiwic2l6ZSIsInVwZGF0ZSIsImNhbGN1bGF0ZUluZGljZXMiLCJpc0luZGV4ZWQiLCJwb3NpdGlvbnMiLCJjYWxjdWxhdGVQb3NpdGlvbnMiLCJub3JtYWxzIiwiY2FsY3VsYXRlTm9ybWFscyIsInNldFVuaWZvcm1zIiwiSW5kZXhUeXBlIiwiZ2V0RXh0ZW5zaW9uIiwiVWludDMyQXJyYXkiLCJVaW50MTZBcnJheSIsInNldFN0YXRlIiwibnVtSW5zdGFuY2VzIiwibW9kZWwiLCJnZXRNb2RlbCIsImV4dHJhY3RCdWlsZGluZ3MiLCJkaWRNb3VudCIsInVwZGF0ZVVuaWZvcm1zIiwid2lsbFJlY2VpdmVQcm9wcyIsIm9sZFByb3BzIiwibmV3UHJvcHMiLCJkYXRhQ2hhbmdlZCIsImludmFsaWRhdGVBbGwiLCJnZXRTaGFkZXJzIiwidnMiLCJmcyIsImdlb21ldHJ5IiwiaWQiLCJkcmF3TW9kZSIsImRyYXdXaXJlZnJhbWUiLCJ2ZXJ0ZXhDb3VudCIsImRyYXciLCJ1bmlmb3JtcyIsInJlbmRlciIsImF0dHJpYnV0ZSIsImdyb3VwZWRWZXJ0aWNlcyIsIm1hcCIsInRvcFZlcnRpY2VzIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJjb25jYXQiLCJhcHBseSIsInZlcnRpY2VzIiwiYmFzZVZlcnRpY2VzIiwidiIsInZhbHVlIiwidXAiLCJidWlsZGluZ0luZGV4IiwidG9wTm9ybWFscyIsImNvdW50VmVydGljZXMiLCJmaWxsIiwic2lkZU5vcm1hbHMiLCJjYWxjdWxhdGVTaWRlTm9ybWFscyIsInBvbHlnb24iLCJzaWRlTm9ybWFsc0ZvcndhcmQiLCJuIiwic2lkZU5vcm1hbHNCYWNrd2FyZCIsIm51bVZlcnRpY2VzIiwibGVuZ3RoIiwiaSIsImdldE5vcm1hbCIsInB1c2giLCJtdWx0aXBsaWVyIiwib2Zmc2V0cyIsInJlZHVjZSIsImFjYyIsImNhbGN1bGF0ZUNvbnRvdXJJbmRpY2VzIiwiY2FsY3VsYXRlU3VyZmFjZUluZGljZXMiLCJ0YXJnZXQiLCJFTEVNRU5UX0FSUkFZX0JVRkZFUiIsInNldFZlcnRleENvdW50IiwiZGF0YSIsImJ1aWxkaW5ncyIsInByb3BlcnRpZXMiLCJidWlsZGluZyIsImNvb3JkaW5hdGVzIiwidHlwZSIsImNvb3JkcyIsImgiLCJoZWlnaHQiLCJjb29yZGluYXRlIiwib2Zmc2V0Iiwic3RyaWRlIiwiaG9sZXMiLCJxdWFkIiwic2xpY2UiLCJ0b3BJbmRpY2VzIiwiaW5kZXgiLCJzaWRlSW5kaWNlcyIsImRyYXdSZWN0YW5nbGUiLCJjYWxjdWxhdGVVbmlmb3JtcyIsInBpeGVsUGVyTWV0ZXIiLCJjb2xvciIsImFtYmllbnRDb2xvciIsInBvaW50TGlnaHRDb2xvciIsInBvaW50TGlnaHRMb2NhdGlvbiIsInBvaW50TGlnaHRBbWJpZW50Q29lZmZpY2llbnQiLCJwb2ludExpZ2h0QXR0ZW51YXRpb24iLCJtYXRlcmlhbFNwZWN1bGFyQ29sb3IiLCJtYXRlcmlhbFNoaW5pbmVzcyIsImNvbG9ycyIsInVBbWJpZW50Q29sb3IiLCJ1UG9pbnRMaWdodEFtYmllbnRDb2VmZmljaWVudCIsInVQb2ludExpZ2h0TG9jYXRpb24iLCJ1UG9pbnRMaWdodENvbG9yIiwidVBvaW50TGlnaHRBdHRlbnVhdGlvbiIsInVNYXRlcmlhbFNwZWN1bGFyQ29sb3IiLCJ1TWF0ZXJpYWxTaGluaW5lc3MiLCJESVNUQU5DRV9JTl9NRVRFUiIsInBpeGVsMCIsInByb2plY3QiLCJsb24iLCJsYXQiLCJwaXhlbDEiLCJkeCIsIngiLCJkeSIsInkiLCJzY2FsZSIsIk1hdGgiLCJzcXJ0IiwicDEiLCJwMiIsImRlZ3JlZXMycmFkaWFucyIsIlBJIiwibG9uMSIsImxvbjIiLCJsYXQxIiwibGF0MiIsImEiLCJzaW4iLCJjb3MiLCJiIiwibm9ybWFsaXplIiwiY291bnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUVBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLG1CQUFtQixlQUFLQyxNQUFMLEVBQXpCO0FBQ0EsZUFBS0MsTUFBTCxDQUFZRixnQkFBWixFQUE4QixDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxDQUE5QixFQUF5QyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBQyxDQUFSLENBQXpDLEVBQXFELENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBQXJEO0FBQ0EsSUFBTUcsYUFBYSxJQUFJQyxZQUFKLENBQWlCSixnQkFBakIsQ0FBbkI7O0lBRXFCSyxhOzs7QUFDbkI7Ozs7Ozs7Ozs7OztBQVlBLHlCQUFZQyxLQUFaLEVBQW1CO0FBQUE7QUFBQSwwREFDakI7QUFDRUMsZUFBUztBQURYLE9BRUtELEtBRkwsRUFEaUI7QUFLbEI7OzBCQUVERSxlLDhCQUFrQjtBQUFBLFFBQ1RDLEVBRFMsR0FDSCxLQUFLQyxPQURGLENBQ1RELEVBRFM7QUFBQSxRQUVURSxnQkFGUyxHQUVXLEtBQUtDLEtBRmhCLENBRVRELGdCQUZTOzs7QUFJaEJBLHFCQUFpQkUsVUFBakIsQ0FBNEI7QUFDMUI7QUFDQUMsZUFBUyxFQUFDQyxNQUFNLENBQVAsRUFBVUMsUUFBUSxLQUFLQyxnQkFBdkIsRUFBeUNDLFdBQVcsSUFBcEQsRUFGaUI7QUFHMUJDLGlCQUFXLEVBQUNKLE1BQU0sQ0FBUCxFQUFVQyxRQUFRLEtBQUtJLGtCQUF2QixFQUhlO0FBSTFCO0FBQ0FDLGVBQVMsRUFBQ04sTUFBTSxDQUFQLEVBQVVDLFFBQVEs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Q0FBQ0QsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFDSCxDQUFSLENBQW5CLENBQVA7QUFDRDs7QUFFRDtBQUNBLFNBQVNoRixhQUFULENBQXVCUCxRQUF2QixFQUFpQztBQUMvQixTQUFPQSxTQUFTc0IsTUFBVCxDQUFnQixVQUFDc0UsS0FBRCxFQUFRakYsT0FBUjtBQUFBLFdBQW9CaUYsUUFBUWpGLFFBQVFLLE1BQXBDO0FBQUEsR0FBaEIsRUFBNEQsQ0FBNUQsQ0FBUDtBQUNEIiwiZmlsZSI6ImJ1aWxkaW5nLWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQge0xheWVyLCBhc3NlbWJsZVNoYWRlcnN9IGZyb20gJ2RlY2suZ2wnO1xuaW1wb3J0IGVhcmN1dCBmcm9tICdlYXJjdXQnO1xuaW1wb3J0IGZsYXR0ZW5EZWVwIGZyb20gJ2xvZGFzaC5mbGF0dGVuZGVlcCc7XG5pbXBvcnQge01vZGVsLCBHZW9tZXRyeX0gZnJvbSAnbHVtYS5nbCc7XG5pbXBvcnQge21hdDQsIHZlYzN9IGZyb20gJ2dsLW1hdHJpeCc7XG5cbmltcG9ydCB2cyBmcm9tICcuL2J1aWxkaW5nLWxheWVyLXZlcnRleC5nbHNsJztcbmltcG9ydCBmcyBmcm9tICcuL2J1aWxkaW5nLWxheWVyLWZyYWdtZW50Lmdsc2wnO1xuXG5jb25zdCB2aWV3TWF0cml4Q29tcGF0ID0gbWF0NC5jcmVhdGUoKTtcbm1hdDQubG9va0F0KHZpZXdNYXRyaXhDb21wYXQsIFswLCAwLCAwXSwgWzAsIDAsIC0xXSwgWzAsIDEsIDBdKTtcbmNvbnN0IHZpZXdNYXRyaXggPSBuZXcgRmxvYXQzMkFycmF5KHZpZXdNYXRyaXhDb21wYXQpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdWlsZGluZ0xheWVyIGV4dGVuZHMgTGF5ZXIge1xuICAvKipcbiAgICogQGNsYXNzZGVzY1xuICAgKiBCdWlsZGluZ0xheWVyXG4gICAqXG4gICAqIEBjbGFzc1xuICAgKiBAcGFyYW0ge29iamVjdH0gcHJvcHNcbiAgICogQHBhcmFtIHtib29sfSBwcm9wcy5kcmF3V2lyZWZyYW1lIC0gPyBkcmF3V2lyZWZyYW1lIDogZHJhd1NvbGlkXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IHByb3BzLm9uQnVpbGRpbmdIb3ZlcmVkIC0gcHJvdmlkZSBwcm9lcnRpZXMgb2YgdGhlXG4gICAqIHNlbGVjdGVkIGJ1aWxkaW5nLCB0b2dldGhlciB3aXRoIHRoZSBtb3VzZSBldmVudCB3aGVuIG1vdXNlIGhvdmVyZWRcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gcHJvcHMub25CdWlsZGluZ0NsaWNrZWQgLSBwcm92aWRlIHByb2VydGllcyBvZiB0aGVcbiAgICogc2VsZWN0ZWQgYnVpbGRpbmcsIHRvZ2V0aGVyIHdpdGggdGhlIG1vdXNlIGV2ZW50IHdoZW4gbW91c2UgY2xpY2tlZFxuICAgKi9cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcih7XG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgLi4ucHJvcHNcbiAgICB9KTtcbiAgfVxuXG4gIGluaXRpYWxpemVTdGF0ZSgpIHtcbiAgICBjb25zdCB7Z2x9ID0gdGhpcy5jb250ZXh0O1xuICAgIGNvbnN0IHthdHRyaWJ1dGVNYW5hZ2VyfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBhdHRyaWJ1dGVNYW5hZ2VyLmFkZER5bmFtaWMoe1xuICAgICAgLy8gUHJpbXRpdmUgYXR0cmlidXRlc1xuICAgICAgaW5kaWNlczoge3NpemU6IDEsIHVwZGF0ZTogdGhpcy5jYWxjdWxhdGVJbmRpY2VzLCBpc0luZGV4ZWQ6IHRydWV9LFxuICAgICAgcG9zaXRpb25zOiB7c2l6ZTogMywgdXBkYXRlOiB0aGlzLmNhbGN1bGF0ZVBvc2l0aW9uc30sXG4gICAgICAvLyBjb2xvcnM6IHt1cGRhdGU6IHRoaXMuY2FsY3VsYXRlQ29sb3JzfSxcbiAgICAgIG5vcm1hbHM6IHtzaXplOiAzLCB1cGRhdGU6IHRoaXMuY2FsY3VsYXRlTm9ybWFsc31cbiAgICB9KTtcblxuICAgIHRoaXMuc2V0VW5pZm9ybXMoe29wYWNpdHk6IHRoaXMucHJvcHMub3BhY2l0eX0pO1xuXG4gICAgY29uc3QgSW5kZXhUeXBlID0gZ2wuZ2V0RXh0ZW5zaW9uKCdPRVNfZWxlbWVudF9pbmRleF91aW50JykgP1xuICAgICAgVWludDMyQXJyYXkgOiBVaW50MTZBcnJheTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbnVtSW5zdGFuY2VzOiAwLFxuICAgICAgbW9kZWw6IHRoaXMuZ2V0TW9kZWwoZ2wpLFxuICAgICAgSW5kZXhUeXBlXG4gICAgfSk7XG5cbiAgICB0aGlzLmV4dHJhY3RCdWlsZGluZ3MoKTtcbiAgfVxuXG4gIGRpZE1vdW50KCkge1xuICAgIHRoaXMudXBkYXRlVW5pZm9ybXMoKTtcbiAgfVxuXG4gIHdpbGxSZWNlaXZlUHJvcHMob2xkUHJvcHMsIG5ld1Byb3BzKSB7XG4gICAgc3VwZXIud2lsbFJlY2VpdmVQcm9wcyhvbGRQcm9wcywgbmV3UHJvcHMpO1xuXG4gICAgY29uc3Qge2RhdGFDaGFuZ2VkLCBhdHRyaWJ1dGVNYW5hZ2VyfSA9IHRoaXMuc3RhdGU7XG4gICAgaWYgKGRhdGFDaGFuZ2VkKSB7XG4gICAgICB0aGlzLmV4dHJhY3RCdWlsZGluZ3MoKTtcblxuICAgICAgYXR0cmlidXRlTWFuYWdlci5pbnZhbGlkYXRlQWxsKCk7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVVbmlmb3JtcygpO1xuICB9XG5cbiAgZ2V0U2hhZGVycygpIHtcbiAgICByZXR1cm4ge3ZzLCBmc307XG4gIH1cblxuICBnZXRNb2RlbChnbCkge1xuICAgIHJldHVybiBuZXcgTW9kZWwoe1xuICAgICAgLi4uYXNzZW1ibGVTaGFkZXJzKGdsLCB0aGlzLmdldFNoYWRlcnMoKSksXG4gICAgICBnZW9tZXRyeTogbmV3IEdlb21ldHJ5KHtcbiAgICAgICAgaWQ6IHRoaXMucHJvcHMuaWQsXG4gICAgICAgIGRyYXdNb2RlOiB0aGlzLnByb3BzLmRyYXdXaXJlZnJhbWUgPyAnTElORVMnIDogJ1RSSUFOR0xFUydcbiAgICAgIH0pLFxuICAgICAgdmVydGV4Q291bnQ6IDAsXG4gICAgICBpc0luZGV4ZWQ6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIGRyYXcoe3VuaWZvcm1zfSkge1xuICAgIHRoaXMuc3RhdGUubW9kZWwucmVuZGVyKHtcbiAgICAgIC4uLnVuaWZvcm1zLFxuICAgICAgdmlld01hdHJpeFxuICAgIH0pO1xuICB9XG5cbiAgLy8gZWFjaCB0b3AgdmVydGV4IGlzIG9uIDMgc3VyZmFjZXNcbiAgLy8gZWFjaCBib3R0b20gdmVydGV4IGlzIG9uIDIgc3VyZmFjZXNcbiAgY2FsY3VsYXRlUG9zaXRpb25zKGF0dHJpYnV0ZSkge1xuICAgIGNvbnN0IHBvc2l0aW9ucyA9IGZsYXR0ZW5EZWVwKHRoaXMuc3RhdGUuZ3JvdXBlZFZlcnRpY2VzLm1hcChcbiAgICAgIHZlcnRpY2VzID0+IHtcbiAgICAgICAgY29uc3QgdG9wVmVydGljZXMgPSBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KFtdLCB2ZXJ0aWNlcyk7XG4gICAgICAgIGNvbnN0IGJhc2VWZXJ0aWNlcyA9IHRvcFZlcnRpY2VzLm1hcCh2ID0+IFt2WzBdLCB2WzFdLCAwXSk7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmRyYXdXaXJlZnJhbWUgPyBbdG9wVmVydGljZXMsIGJhc2VWZXJ0aWNlc10gOlxuICAgICAgICAgIFt0b3BWZXJ0aWNlcywgdG9wVmVydGljZXMsIHRvcFZlcnRpY2VzLCBiYXNlVmVydGljZXMsIGJhc2VWZXJ0aWNlc107XG4gICAgICB9XG4gICAgKSk7XG4gICAgYXR0cmlidXRlLnZhbHVlID0gbmV3IEZsb2F0MzJBcnJheShwb3NpdGlvbnMpO1xuICB9XG5cbiAgY2FsY3VsYXRlTm9ybWFscyhhdHRyaWJ1dGUpIHtcbiAgICBjb25zdCB1cCA9IFswLCAxLCAwXTtcblxuICAgIGNvbnN0IG5vcm1hbHMgPSB0aGlzLnN0YXRlLmdyb3VwZWRWZXJ0aWNlcy5tYXAoXG4gICAgICAodmVydGljZXMsIGJ1aWxkaW5nSW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgdG9wTm9ybWFscyA9IG5ldyBBcnJheShjb3VudFZlcnRpY2VzKHZlcnRpY2VzKSkuZmlsbCh1cCk7XG4gICAgICAgIGNvbnN0IHNpZGVOb3JtYWxzID0gdmVydGljZXMubWFwKHBvbHlnb24gPT5cbiAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVNpZGVOb3JtYWxzKHBvbHlnb24pKTtcbiAgICAgICAgY29uc3Qgc2lkZU5vcm1hbHNGb3J3YXJkID0gc2lkZU5vcm1hbHMubWFwKG4gPT4gblswXSk7XG4gICAgICAgIGNvbnN0IHNpZGVOb3JtYWxzQmFja3dhcmQgPSBzaWRlTm9ybWFscy5tYXAobiA9PiBuWzFdKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5kcmF3V2lyZWZyYW1lID8gW3RvcE5vcm1hbHMsIHRvcE5vcm1hbHNdIDpcbiAgICAgICAgICBbdG9wTm9ybWFscywgc2lkZU5vcm1hbHNGb3J3YXJkLCBzaWRlTm9ybWFsc0JhY2t3YXJkLFxuICAgICAgICAgICAgc2lkZU5vcm1hbHNGb3J3YXJkLCBzaWRlTm9ybWFsc0JhY2t3YXJkXTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgYXR0cmlidXRlLnZhbHVlID0gbmV3IEZsb2F0MzJBcnJheShmbGF0dGVuRGVlcChub3JtYWxzKSk7XG4gIH1cblxuICBjYWxjdWxhdGVTaWRlTm9ybWFscyh2ZXJ0aWNlcykge1xuICAgIGNvbnN0IG51bVZlcnRpY2VzID0gdmVydGljZXMubGVuZ3RoO1xuICAgIGNvbnN0IG5vcm1hbHMgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtVmVydGljZXMgLSAxOyBpKyspIHtcbiAgICAgIGNvbnN0IG4gPSBnZXROb3JtYWwodmVydGljZXNbaV0sIHZlcnRpY2VzW2kgKyAxXSk7XG4gICAgICBub3JtYWxzLnB1c2gobik7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtcbiAgICAgIFsuLi5ub3JtYWxzLCBub3JtYWxzWzBdXSxcbiAgICAgIFtub3JtYWxzWzBdLCAuLi5ub3JtYWxzXVxuICAgIF07XG4gIH1cblxuICBjYWxjdWxhdGVJbmRpY2VzKGF0dHJpYnV0ZSkge1xuICAgIC8vIGFkanVzdCBpbmRleCBvZmZzZXQgZm9yIG11bHRpcGxlIGJ1aWxkaW5nc1xuICAgIGNvbnN0IG11bHRpcGxpZXIgPSB0aGlzLnByb3BzLmRyYXdXaXJlZnJhbWUgPyAyIDogNTtcbiAgICBjb25zdCBvZmZzZXRzID0gdGhpcy5zdGF0ZS5ncm91cGVkVmVydGljZXMucmVkdWNlKFxuICAgICAgKGFjYywgdmVydGljZXMpID0+XG4gICAgICAgIFsuLi5hY2MsIGFjY1thY2MubGVuZ3RoIC0gMV0gKyBjb3VudFZlcnRpY2VzKHZlcnRpY2VzKSAqIG11bHRpcGxpZXJdLFxuICAgICAgWzBdXG4gICAgKTtcblxuICAgIGNvbnN0IGluZGljZXMgPSB0aGlzLnN0YXRlLmdyb3VwZWRWZXJ0aWNlcy5tYXAoXG4gICAgICAodmVydGljZXMsIGJ1aWxkaW5nSW5kZXgpID0+IHRoaXMucHJvcHMuZHJhd1dpcmVmcmFtZSA/XG4gICAgICAgIC8vIDEuIGdldCBzZXF1ZW50aWFsbHkgb3JkZXJlZCBpbmRpY2VzIG9mIGVhY2ggYnVpbGRpbmcgd2lyZWZyYW1lXG4gICAgICAgIC8vIDIuIG9mZnNldCB0aGVtIGJ5IHRoZSBudW1iZXIgb2YgaW5kaWNlcyBpbiBwcmV2aW91cyBidWlsZGluZ3NcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVDb250b3VySW5kaWNlcyh2ZXJ0aWNlcywgb2Zmc2V0c1tidWlsZGluZ0luZGV4XSkgOlxuICAgICAgICAvLyAxLiBnZXQgdHJpYW5ndWxhdGVkIGluZGljZXMgZm9yIHRoZSBpbnRlcm5hbCBhcmVhc1xuICAgICAgICAvLyAyLiBvZmZzZXQgdGhlbSBieSB0aGUgbnVtYmVyIG9mIGluZGljZXMgaW4gcHJldmlvdXMgYnVpbGRpbmdzXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlU3VyZmFjZUluZGljZXModmVydGljZXMsIG9mZnNldHNbYnVpbGRpbmdJbmRleF0pXG4gICAgKTtcblxuICAgIGF0dHJpYnV0ZS52YWx1ZSA9IG5ldyBVaW50MzJBcnJheShmbGF0dGVuRGVlcChpbmRpY2VzKSk7XG4gICAgYXR0cmlidXRlLnRhcmdldCA9IHRoaXMuc3RhdGUuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVI7XG4gICAgdGhpcy5zdGF0ZS5tb2RlbC5zZXRWZXJ0ZXhDb3VudChhdHRyaWJ1dGUudmFsdWUubGVuZ3RoIC8gYXR0cmlidXRlLnNpemUpO1xuICB9XG5cbiAgZXh0cmFjdEJ1aWxkaW5ncygpIHtcbiAgICBjb25zdCB7ZGF0YX0gPSB0aGlzLnByb3BzO1xuXG4gICAgdGhpcy5zdGF0ZS5idWlsZGluZ3MgPSBbXTtcblxuICAgIGRhdGEubWFwKGJ1aWxkaW5nID0+IHtcbiAgICAgIGNvbnN0IHtwcm9wZXJ0aWVzLCBnZW9tZXRyeX0gPSBidWlsZGluZztcbiAgICAgIGNvbnN0IHtjb29yZGluYXRlcywgdHlwZX0gPSBnZW9tZXRyeTtcbiAgICAgIGlmICh0eXBlID09PSAnTXVsdGlQb2x5Z29uJykge1xuICAgICAgICBjb25zdCBidWlsZGluZ3MgPSBjb29yZGluYXRlcy5tYXAoY29vcmRzID0+ICh7XG4gICAgICAgICAgY29vcmRpbmF0ZXM6IGNvb3JkcyxcbiAgICAgICAgICBwcm9wZXJ0aWVzXG4gICAgICAgIH0pKTtcbiAgICAgICAgdGhpcy5zdGF0ZS5idWlsZGluZ3MucHVzaCguLi5idWlsZGluZ3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5idWlsZGluZ3MucHVzaCh7Y29vcmRpbmF0ZXMsIHByb3BlcnRpZXN9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuc3RhdGUuZ3JvdXBlZFZlcnRpY2VzID0gdGhpcy5zdGF0ZS5idWlsZGluZ3MubWFwKFxuICAgICAgYnVpbGRpbmcgPT4ge1xuICAgICAgICB2YXIgaCA9IGJ1aWxkaW5nLnByb3BlcnRpZXMuaGVpZ2h0IHx8IDE1O1xuICAgICAgICByZXR1cm4gYnVpbGRpbmcuY29vcmRpbmF0ZXMubWFwKFxuICAgICAgICAgIHBvbHlnb24gPT4gcG9seWdvbi5tYXAoXG4gICAgICAgICAgICBjb29yZGluYXRlID0+IFtjb29yZGluYXRlWzBdLCBjb29yZGluYXRlWzFdLCBoXVxuICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgY2FsY3VsYXRlQ29udG91ckluZGljZXModmVydGljZXMsIG9mZnNldCkge1xuICAgIGNvbnN0IHN0cmlkZSA9IGNvdW50VmVydGljZXModmVydGljZXMpO1xuXG4gICAgcmV0dXJuIHZlcnRpY2VzLm1hcChwb2x5Z29uID0+IHtcbiAgICAgIGNvbnN0IGluZGljZXMgPSBbb2Zmc2V0XTtcbiAgICAgIGNvbnN0IG51bVZlcnRpY2VzID0gcG9seWdvbi5sZW5ndGg7XG5cbiAgICAgIC8vIGJ1aWxkaW5nIHRvcFxuICAgICAgLy8gdXNlIHZlcnRleCBwYWlycyBmb3IgZ2wuTElORVMgPT4gWzAsIDEsIDEsIDIsIDIsIC4uLiwgbi0xLCBuLTEsIDBdXG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8IG51bVZlcnRpY2VzIC0gMTsgaSsrKSB7XG4gICAgICAgIGluZGljZXMucHVzaChpICsgb2Zmc2V0LCBpICsgb2Zmc2V0KTtcbiAgICAgIH1cbiAgICAgIGluZGljZXMucHVzaChvZmZzZXQpO1xuXG4gICAgICAvLyBidWlsZGluZyBzaWRlc1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1WZXJ0aWNlcyAtIDE7IGkrKykge1xuICAgICAgICBpbmRpY2VzLnB1c2goaSArIG9mZnNldCwgaSArIHN0cmlkZSArIG9mZnNldCk7XG4gICAgICB9XG5cbiAgICAgIG9mZnNldCArPSBudW1WZXJ0aWNlcztcbiAgICAgIHJldHVybiBpbmRpY2VzO1xuICAgIH0pO1xuICB9XG5cbiAgY2FsY3VsYXRlU3VyZmFjZUluZGljZXModmVydGljZXMsIG9mZnNldCkge1xuICAgIGNvbnN0IHN0cmlkZSA9IGNvdW50VmVydGljZXModmVydGljZXMpO1xuICAgIGxldCBob2xlcyA9IG51bGw7XG4gICAgY29uc3QgcXVhZCA9IFtcbiAgICAgIFswLCAxXSwgWzAsIDNdLCBbMSwgMl0sXG4gICAgICBbMSwgMl0sIFswLCAzXSwgWzEsIDRdXG4gICAgXTtcblxuICAgIGlmICh2ZXJ0aWNlcy5sZW5ndGggPiAxKSB7XG4gICAgICBob2xlcyA9IHZlcnRpY2VzLnJlZHVjZShcbiAgICAgICAgKGFjYywgcG9seWdvbikgPT4gWy4uLmFjYywgYWNjW2FjYy5sZW5ndGggLSAxXSArIHBvbHlnb24ubGVuZ3RoXSxcbiAgICAgICAgWzBdXG4gICAgICApLnNsaWNlKDEsIHZlcnRpY2VzLmxlbmd0aCk7XG4gICAgfVxuXG4gICAgY29uc3QgdG9wSW5kaWNlcyA9IGVhcmN1dChmbGF0dGVuRGVlcCh2ZXJ0aWNlcyksIGhvbGVzLCAzKVxuICAgICAgLm1hcChpbmRleCA9PiBpbmRleCArIG9mZnNldCk7XG5cbiAgICBjb25zdCBzaWRlSW5kaWNlcyA9IHZlcnRpY2VzLm1hcChwb2x5Z29uID0+IHtcbiAgICAgIGNvbnN0IG51bVZlcnRpY2VzID0gcG9seWdvbi5sZW5ndGg7XG4gICAgICAvLyBidWlsZGluZyB0b3BcbiAgICAgIGNvbnN0IGluZGljZXMgPSBbXTtcblxuICAgICAgLy8gYnVpbGRpbmcgc2lkZXNcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtVmVydGljZXMgLSAxOyBpKyspIHtcbiAgICAgICAgaW5kaWNlcy5wdXNoKC4uLmRyYXdSZWN0YW5nbGUoaSkpO1xuICAgICAgfVxuXG4gICAgICBvZmZzZXQgKz0gbnVtVmVydGljZXM7XG4gICAgICByZXR1cm4gaW5kaWNlcztcbiAgICB9KTtcblxuICAgIHJldHVybiBbdG9wSW5kaWNlcywgc2lkZUluZGljZXNdO1xuXG4gICAgZnVuY3Rpb24gZHJhd1JlY3RhbmdsZShpKSB7XG4gICAgICByZXR1cm4gcXVhZC5tYXAodiA9PiBpICsgdlswXSArIHN0cmlkZSAqIHZbMV0gKyBvZmZzZXQpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVVuaWZvcm1zKCkge1xuICAgIHRoaXMuY2FsY3VsYXRlVW5pZm9ybXMoKTtcbiAgICBjb25zdCB7cGl4ZWxQZXJNZXRlcn0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHtcbiAgICAgIGNvbG9yLCBvcGFjaXR5LCBhbWJpZW50Q29sb3IsIHBvaW50TGlnaHRDb2xvcixcbiAgICAgIHBvaW50TGlnaHRMb2NhdGlvbiwgcG9pbnRMaWdodEFtYmllbnRDb2VmZmljaWVudCxcbiAgICAgIHBvaW50TGlnaHRBdHRlbnVhdGlvbiwgbWF0ZXJpYWxTcGVjdWxhckNvbG9yLCBtYXRlcmlhbFNoaW5pbmVzc1xuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgdGhpcy5zZXRVbmlmb3Jtcyh7XG4gICAgICBwaXhlbFBlck1ldGVyLFxuICAgICAgY29sb3JzOiBjb2xvciB8fCBbMTI4LCAxMjgsIDEyOF0sXG4gICAgICBvcGFjaXR5OiBvcGFjaXR5IHx8IDEsXG4gICAgICB1QW1iaWVudENvbG9yOiBhbWJpZW50Q29sb3IgfHwgWzI1NSwgMjU1LCAyNTVdLFxuICAgICAgdVBvaW50TGlnaHRBbWJpZW50Q29lZmZpY2llbnQ6IHBvaW50TGlnaHRBbWJpZW50Q29lZmZpY2llbnQgfHwgMC4xLFxuICAgICAgdVBvaW50TGlnaHRMb2NhdGlvbjogcG9pbnRMaWdodExvY2F0aW9uIHx8IFswLCAwLCAwXSxcbiAgICAgIHVQb2ludExpZ2h0Q29sb3I6IHBvaW50TGlnaHRDb2xvciB8fCBbMjU1LCAyNTUsIDI1NV0sXG4gICAgICB1UG9pbnRMaWdodEF0dGVudWF0aW9uOiBwb2ludExpZ2h0QXR0ZW51YXRpb24gfHwgMC4xLFxuICAgICAgdU1hdGVyaWFsU3BlY3VsYXJDb2xvcjogbWF0ZXJpYWxTcGVjdWxhckNvbG9yIHx8IFsyNTUsIDI1NSwgMjU1XSxcbiAgICAgIHVNYXRlcmlhbFNoaW5pbmVzczogbWF0ZXJpYWxTaGluaW5lc3MgfHwgMVxuICAgIH0pO1xuICB9XG5cbiAgY2FsY3VsYXRlVW5pZm9ybXMoKSB7XG4gICAgY29uc3QgRElTVEFOQ0VfSU5fTUVURVIgPSAzNy4wNDA5O1xuICAgIGNvbnN0IHBpeGVsMCA9IHRoaXMucHJvamVjdCh7bG9uOiAtMTIyLCBsYXQ6IDM3LjV9KTtcbiAgICBjb25zdCBwaXhlbDEgPSB0aGlzLnByb2plY3Qoe2xvbjogLTEyMiwgbGF0OiAzNy41MDAyfSk7XG5cbiAgICBjb25zdCBkeCA9IHBpeGVsMC54IC0gcGl4ZWwxLng7XG4gICAgY29uc3QgZHkgPSBwaXhlbDAueSAtIHBpeGVsMS55O1xuICAgIGNvbnN0IHNjYWxlID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KSAvIERJU1RBTkNFX0lOX01FVEVSO1xuXG4gICAgdGhpcy5zdGF0ZS5waXhlbFBlck1ldGVyID0gc2NhbGU7XG4gIH1cbn1cblxuLypcbiogaGVscGVyc1xuKi9cbi8vIGdldCBub3JtYWwgdmVjdG9yIG9mIGxpbmUgc2VnbWVudFxuZnVuY3Rpb24gZ2V0Tm9ybWFsKHAxLCBwMikge1xuICBpZiAocDFbMF0gPT09IHAyWzBdICYmIHAxWzFdID09PSBwMlsxXSkge1xuICAgIHJldHVybiBbMSwgMCwgMF07XG4gIH1cblxuICBjb25zdCBkZWdyZWVzMnJhZGlhbnMgPSBNYXRoLlBJIC8gMTgwO1xuXG4gIGNvbnN0IGxvbjEgPSBkZWdyZWVzMnJhZGlhbnMgKiBwMVswXTtcbiAgY29uc3QgbG9uMiA9IGRlZ3JlZXMycmFkaWFucyAqIHAyWzBdO1xuICBjb25zdCBsYXQxID0gZGVncmVlczJyYWRpYW5zICogcDFbMV07XG4gIGNvbnN0IGxhdDIgPSBkZWdyZWVzMnJhZGlhbnMgKiBwMlsxXTtcblxuICBjb25zdCBhID0gTWF0aC5zaW4obG9uMiAtIGxvbjEpICogTWF0aC5jb3MobGF0Mik7XG4gIGNvbnN0IGIgPSBNYXRoLmNvcyhsYXQxKSAqIE1hdGguc2luKGxhdDIpIC1cbiAgICAgTWF0aC5zaW4obGF0MSkgKiBNYXRoLmNvcyhsYXQyKSAqIE1hdGguY29zKGxvbjIgLSBsb24xKTtcblxuICByZXR1cm4gdmVjMy5ub3JtYWxpemUoW10sIFtiLCAwLCAtYV0pO1xufVxuXG4vLyBjb3VudCBudW1iZXIgb2YgdmVydGljZXMgaW4gZ2VvanNvbiBwb2x5Z29uXG5mdW5jdGlvbiBjb3VudFZlcnRpY2VzKHZlcnRpY2VzKSB7XG4gIHJldHVybiB2ZXJ0aWNlcy5yZWR1Y2UoKGNvdW50LCBwb2x5Z29uKSA9PiBjb3VudCArIHBvbHlnb24ubGVuZ3RoLCAwKTtcbn1cbiJdfQ==