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
      return _this4.props.drawWireframe ? // 1. get sequentially ordered indices of each building wireframe
      // 2. offset them by the number of indices in previous buildings
      _this4.calculateContourIndices(vertices, offsets[buildingIndex]) : // 1. get triangulated indices for the internal areas
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2J1aWxkaW5nLWxheWVyL2J1aWxkaW5nLWxheWVyLmpzIl0sIm5hbWVzIjpbInZpZXdNYXRyaXhDb21wYXQiLCJjcmVhdGUiLCJsb29rQXQiLCJ2aWV3TWF0cml4IiwiRmxvYXQzMkFycmF5IiwiQnVpbGRpbmdMYXllciIsInByb3BzIiwib3BhY2l0eSIsImluaXRpYWxpemVTdGF0ZSIsImdsIiwiY29udGV4dCIsImF0dHJpYnV0ZU1hbmFnZXIiLCJzdGF0ZSIsImFkZER5bmFtaWMiLCJpbmRpY2VzIiwic2l6ZSIsInVwZGF0ZSIsImNhbGN1bGF0ZUluZGljZXMiLCJpc0luZGV4ZWQiLCJwb3NpdGlvbnMiLCJjYWxjdWxhdGVQb3NpdGlvbnMiLCJub3JtYWxzIiwiY2FsY3VsYXRlTm9ybWFscyIsInNldFVuaWZvcm1zIiwiSW5kZXhUeXBlIiwiZ2V0RXh0ZW5zaW9uIiwiVWludDMyQXJyYXkiLCJVaW50MTZBcnJheSIsInNldFN0YXRlIiwibnVtSW5zdGFuY2VzIiwibW9kZWwiLCJnZXRNb2RlbCIsImV4dHJhY3RCdWlsZGluZ3MiLCJkaWRNb3VudCIsInVwZGF0ZVVuaWZvcm1zIiwid2lsbFJlY2VpdmVQcm9wcyIsIm9sZFByb3BzIiwibmV3UHJvcHMiLCJkYXRhQ2hhbmdlZCIsImludmFsaWRhdGVBbGwiLCJnZXRTaGFkZXJzIiwidnMiLCJmcyIsImdlb21ldHJ5IiwiaWQiLCJkcmF3TW9kZSIsImRyYXdXaXJlZnJhbWUiLCJ2ZXJ0ZXhDb3VudCIsImRyYXciLCJ1bmlmb3JtcyIsInJlbmRlciIsImF0dHJpYnV0ZSIsImdyb3VwZWRWZXJ0aWNlcyIsIm1hcCIsInRvcFZlcnRpY2VzIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJjb25jYXQiLCJhcHBseSIsInZlcnRpY2VzIiwiYmFzZVZlcnRpY2VzIiwidiIsInZhbHVlIiwidXAiLCJidWlsZGluZ0luZGV4IiwidG9wTm9ybWFscyIsImNvdW50VmVydGljZXMiLCJmaWxsIiwic2lkZU5vcm1hbHMiLCJjYWxjdWxhdGVTaWRlTm9ybWFscyIsInBvbHlnb24iLCJzaWRlTm9ybWFsc0ZvcndhcmQiLCJuIiwic2lkZU5vcm1hbHNCYWNrd2FyZCIsIm51bVZlcnRpY2VzIiwibGVuZ3RoIiwiaSIsImdldE5vcm1hbCIsInB1c2giLCJtdWx0aXBsaWVyIiwib2Zmc2V0cyIsInJlZHVjZSIsImFjYyIsImNhbGN1bGF0ZUNvbnRvdXJJbmRpY2VzIiwiY2FsY3VsYXRlU3VyZmFjZUluZGljZXMiLCJ0YXJnZXQiLCJFTEVNRU5UX0FSUkFZX0JVRkZFUiIsInNldFZlcnRleENvdW50IiwiZGF0YSIsImJ1aWxkaW5ncyIsInByb3BlcnRpZXMiLCJidWlsZGluZyIsImNvb3JkaW5hdGVzIiwidHlwZSIsImNvb3JkcyIsImgiLCJoZWlnaHQiLCJjb29yZGluYXRlIiwib2Zmc2V0Iiwic3RyaWRlIiwiaG9sZXMiLCJxdWFkIiwic2xpY2UiLCJ0b3BJbmRpY2VzIiwiaW5kZXgiLCJzaWRlSW5kaWNlcyIsImRyYXdSZWN0YW5nbGUiLCJjYWxjdWxhdGVVbmlmb3JtcyIsInBpeGVsUGVyTWV0ZXIiLCJjb2xvciIsImFtYmllbnRDb2xvciIsInBvaW50TGlnaHRDb2xvciIsInBvaW50TGlnaHRMb2NhdGlvbiIsInBvaW50TGlnaHRBbWJpZW50Q29lZmZpY2llbnQiLCJwb2ludExpZ2h0QXR0ZW51YXRpb24iLCJtYXRlcmlhbFNwZWN1bGFyQ29sb3IiLCJtYXRlcmlhbFNoaW5pbmVzcyIsImNvbG9ycyIsInVBbWJpZW50Q29sb3IiLCJ1UG9pbnRMaWdodEFtYmllbnRDb2VmZmljaWVudCIsInVQb2ludExpZ2h0TG9jYXRpb24iLCJ1UG9pbnRMaWdodENvbG9yIiwidVBvaW50TGlnaHRBdHRlbnVhdGlvbiIsInVNYXRlcmlhbFNwZWN1bGFyQ29sb3IiLCJ1TWF0ZXJpYWxTaGluaW5lc3MiLCJESVNUQU5DRV9JTl9NRVRFUiIsInBpeGVsMCIsInByb2plY3QiLCJsb24iLCJsYXQiLCJwaXhlbDEiLCJkeCIsIngiLCJkeSIsInkiLCJzY2FsZSIsIk1hdGgiLCJzcXJ0IiwicDEiLCJwMiIsImRlZ3JlZXMycmFkaWFucyIsIlBJIiwibG9uMSIsImxvbjIiLCJsYXQxIiwibGF0MiIsImEiLCJzaW4iLCJjb3MiLCJiIiwibm9ybWFsaXplIiwiY291bnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUVBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLG1CQUFtQixlQUFLQyxNQUFMLEVBQXpCO0FBQ0EsZUFBS0MsTUFBTCxDQUFZRixnQkFBWixFQUE4QixDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxDQUE5QixFQUF5QyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBQyxDQUFSLENBQXpDLEVBQXFELENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBQXJEO0FBQ0EsSUFBTUcsYUFBYSxJQUFJQyxZQUFKLENBQWlCSixnQkFBakIsQ0FBbkI7O0lBRXFCSyxhOzs7QUFDbkI7Ozs7Ozs7Ozs7OztBQVlBLHlCQUFZQyxLQUFaLEVBQW1CO0FBQUE7QUFBQSwwREFDakI7QUFDRUMsZUFBUztBQURYLE9BRUtELEtBRkwsRUFEaUI7QUFLbEI7OzBCQUVERSxlLDhCQUFrQjtBQUFBLFFBQ1RDLEVBRFMsR0FDSCxLQUFLQyxPQURGLENBQ1RELEVBRFM7QUFBQSxRQUVURSxnQkFGUyxHQUVXLEtBQUtDLEtBRmhCLENBRVRELGdCQUZTOzs7QUFJaEJBLHFCQUFpQkUsVUFBakIsQ0FBNEI7QUFDMUI7QUFDQUMsZUFBUyxFQUFDQyxNQUFNLENBQVAsRUFBVUMsUUFBUSxLQUFLQyxnQkFBdkIsRUFBeUNDLFdBQVcsSUFBcEQsRUFGaUI7QUFHMUJDLGlCQUFXLEVBQUNKLE1BQU0sQ0FBUCxFQUFVQyxRQUFRLEtBQUtJLGtCQUF2QixFQUhlO0FBSTFCO0FBQ0FDLGVBQVMsRUFBQ04sTUFBTSxDQUFQLEVBQVVDLFFBQVEs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Q0FBQ0QsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFDSCxDQUFSLENBQW5CLENBQVA7QUFDRDs7QUFFRDtBQUNBLFNBQVNoRixhQUFULENBQXVCUCxRQUF2QixFQUFpQztBQUMvQixTQUFPQSxTQUFTc0IsTUFBVCxDQUFnQixVQUFDc0UsS0FBRCxFQUFRakYsT0FBUjtBQUFBLFdBQW9CaUYsUUFBUWpGLFFBQVFLLE1BQXBDO0FBQUEsR0FBaEIsRUFBNEQsQ0FBNUQsQ0FBUDtBQUNEIiwiZmlsZSI6ImJ1aWxkaW5nLWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtMYXllciwgYXNzZW1ibGVTaGFkZXJzfSBmcm9tICdkZWNrLmdsJztcbmltcG9ydCBlYXJjdXQgZnJvbSAnZWFyY3V0JztcbmltcG9ydCBmbGF0dGVuRGVlcCBmcm9tICdsb2Rhc2guZmxhdHRlbmRlZXAnO1xuaW1wb3J0IHtNb2RlbCwgR2VvbWV0cnl9IGZyb20gJ2x1bWEuZ2wnO1xuaW1wb3J0IHttYXQ0LCB2ZWMzfSBmcm9tICdnbC1tYXRyaXgnO1xuXG5pbXBvcnQgdnMgZnJvbSAnLi9idWlsZGluZy1sYXllci12ZXJ0ZXguZ2xzbCc7XG5pbXBvcnQgZnMgZnJvbSAnLi9idWlsZGluZy1sYXllci1mcmFnbWVudC5nbHNsJztcblxuY29uc3Qgdmlld01hdHJpeENvbXBhdCA9IG1hdDQuY3JlYXRlKCk7XG5tYXQ0Lmxvb2tBdCh2aWV3TWF0cml4Q29tcGF0LCBbMCwgMCwgMF0sIFswLCAwLCAtMV0sIFswLCAxLCAwXSk7XG5jb25zdCB2aWV3TWF0cml4ID0gbmV3IEZsb2F0MzJBcnJheSh2aWV3TWF0cml4Q29tcGF0KTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVpbGRpbmdMYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqIEBjbGFzc2Rlc2NcbiAgICogQnVpbGRpbmdMYXllclxuICAgKlxuICAgKiBAY2xhc3NcbiAgICogQHBhcmFtIHtvYmplY3R9IHByb3BzXG4gICAqIEBwYXJhbSB7Ym9vbH0gcHJvcHMuZHJhd1dpcmVmcmFtZSAtID8gZHJhd1dpcmVmcmFtZSA6IGRyYXdTb2xpZFxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBwcm9wcy5vbkJ1aWxkaW5nSG92ZXJlZCAtIHByb3ZpZGUgcHJvZXJ0aWVzIG9mIHRoZVxuICAgKiBzZWxlY3RlZCBidWlsZGluZywgdG9nZXRoZXIgd2l0aCB0aGUgbW91c2UgZXZlbnQgd2hlbiBtb3VzZSBob3ZlcmVkXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IHByb3BzLm9uQnVpbGRpbmdDbGlja2VkIC0gcHJvdmlkZSBwcm9lcnRpZXMgb2YgdGhlXG4gICAqIHNlbGVjdGVkIGJ1aWxkaW5nLCB0b2dldGhlciB3aXRoIHRoZSBtb3VzZSBldmVudCB3aGVuIG1vdXNlIGNsaWNrZWRcbiAgICovXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIoe1xuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIC4uLnByb3BzXG4gICAgfSk7XG4gIH1cblxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgY29uc3Qge2dsfSA9IHRoaXMuY29udGV4dDtcbiAgICBjb25zdCB7YXR0cmlidXRlTWFuYWdlcn0gPSB0aGlzLnN0YXRlO1xuXG4gICAgYXR0cmlidXRlTWFuYWdlci5hZGREeW5hbWljKHtcbiAgICAgIC8vIFByaW10aXZlIGF0dHJpYnV0ZXNcbiAgICAgIGluZGljZXM6IHtzaXplOiAxLCB1cGRhdGU6IHRoaXMuY2FsY3VsYXRlSW5kaWNlcywgaXNJbmRleGVkOiB0cnVlfSxcbiAgICAgIHBvc2l0aW9uczoge3NpemU6IDMsIHVwZGF0ZTogdGhpcy5jYWxjdWxhdGVQb3NpdGlvbnN9LFxuICAgICAgLy8gY29sb3JzOiB7dXBkYXRlOiB0aGlzLmNhbGN1bGF0ZUNvbG9yc30sXG4gICAgICBub3JtYWxzOiB7c2l6ZTogMywgdXBkYXRlOiB0aGlzLmNhbGN1bGF0ZU5vcm1hbHN9XG4gICAgfSk7XG5cbiAgICB0aGlzLnNldFVuaWZvcm1zKHtvcGFjaXR5OiB0aGlzLnByb3BzLm9wYWNpdHl9KTtcblxuICAgIGNvbnN0IEluZGV4VHlwZSA9IGdsLmdldEV4dGVuc2lvbignT0VTX2VsZW1lbnRfaW5kZXhfdWludCcpXG4gICAgICA/IFVpbnQzMkFycmF5XG4gICAgICA6IFVpbnQxNkFycmF5O1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBudW1JbnN0YW5jZXM6IDAsXG4gICAgICBtb2RlbDogdGhpcy5nZXRNb2RlbChnbCksXG4gICAgICBJbmRleFR5cGVcbiAgICB9KTtcblxuICAgIHRoaXMuZXh0cmFjdEJ1aWxkaW5ncygpO1xuICB9XG5cbiAgZGlkTW91bnQoKSB7XG4gICAgdGhpcy51cGRhdGVVbmlmb3JtcygpO1xuICB9XG5cbiAgd2lsbFJlY2VpdmVQcm9wcyhvbGRQcm9wcywgbmV3UHJvcHMpIHtcbiAgICBzdXBlci53aWxsUmVjZWl2ZVByb3BzKG9sZFByb3BzLCBuZXdQcm9wcyk7XG5cbiAgICBjb25zdCB7ZGF0YUNoYW5nZWQsIGF0dHJpYnV0ZU1hbmFnZXJ9ID0gdGhpcy5zdGF0ZTtcbiAgICBpZiAoZGF0YUNoYW5nZWQpIHtcbiAgICAgIHRoaXMuZXh0cmFjdEJ1aWxkaW5ncygpO1xuXG4gICAgICBhdHRyaWJ1dGVNYW5hZ2VyLmludmFsaWRhdGVBbGwoKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZVVuaWZvcm1zKCk7XG4gIH1cblxuICBnZXRTaGFkZXJzKCkge1xuICAgIHJldHVybiB7dnMsIGZzfTtcbiAgfVxuXG4gIGdldE1vZGVsKGdsKSB7XG4gICAgcmV0dXJuIG5ldyBNb2RlbCh7XG4gICAgICAuLi5hc3NlbWJsZVNoYWRlcnMoZ2wsIHRoaXMuZ2V0U2hhZGVycygpKSxcbiAgICAgIGdlb21ldHJ5OiBuZXcgR2VvbWV0cnkoe1xuICAgICAgICBpZDogdGhpcy5wcm9wcy5pZCxcbiAgICAgICAgZHJhd01vZGU6IHRoaXMucHJvcHMuZHJhd1dpcmVmcmFtZSA/ICdMSU5FUycgOiAnVFJJQU5HTEVTJ1xuICAgICAgfSksXG4gICAgICB2ZXJ0ZXhDb3VudDogMCxcbiAgICAgIGlzSW5kZXhlZDogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgZHJhdyh7dW5pZm9ybXN9KSB7XG4gICAgdGhpcy5zdGF0ZS5tb2RlbC5yZW5kZXIoe1xuICAgICAgLi4udW5pZm9ybXMsXG4gICAgICB2aWV3TWF0cml4XG4gICAgfSk7XG4gIH1cblxuICAvLyBlYWNoIHRvcCB2ZXJ0ZXggaXMgb24gMyBzdXJmYWNlc1xuICAvLyBlYWNoIGJvdHRvbSB2ZXJ0ZXggaXMgb24gMiBzdXJmYWNlc1xuICBjYWxjdWxhdGVQb3NpdGlvbnMoYXR0cmlidXRlKSB7XG4gICAgY29uc3QgcG9zaXRpb25zID0gZmxhdHRlbkRlZXAoXG4gICAgICB0aGlzLnN0YXRlLmdyb3VwZWRWZXJ0aWNlcy5tYXAodmVydGljZXMgPT4ge1xuICAgICAgICBjb25zdCB0b3BWZXJ0aWNlcyA9IEFycmF5LnByb3RvdHlwZS5jb25jYXQuYXBwbHkoW10sIHZlcnRpY2VzKTtcbiAgICAgICAgY29uc3QgYmFzZVZlcnRpY2VzID0gdG9wVmVydGljZXMubWFwKHYgPT4gW3ZbMF0sIHZbMV0sIDBdKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuZHJhd1dpcmVmcmFtZVxuICAgICAgICAgID8gW3RvcFZlcnRpY2VzLCBiYXNlVmVydGljZXNdXG4gICAgICAgICAgOiBbdG9wVmVydGljZXMsIHRvcFZlcnRpY2VzLCB0b3BWZXJ0aWNlcywgYmFzZVZlcnRpY2VzLCBiYXNlVmVydGljZXNdO1xuICAgICAgfSlcbiAgICApO1xuICAgIGF0dHJpYnV0ZS52YWx1ZSA9IG5ldyBGbG9hdDMyQXJyYXkocG9zaXRpb25zKTtcbiAgfVxuXG4gIGNhbGN1bGF0ZU5vcm1hbHMoYXR0cmlidXRlKSB7XG4gICAgY29uc3QgdXAgPSBbMCwgMSwgMF07XG5cbiAgICBjb25zdCBub3JtYWxzID0gdGhpcy5zdGF0ZS5ncm91cGVkVmVydGljZXMubWFwKFxuICAgICAgKHZlcnRpY2VzLCBidWlsZGluZ0luZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IHRvcE5vcm1hbHMgPSBuZXcgQXJyYXkoY291bnRWZXJ0aWNlcyh2ZXJ0aWNlcykpLmZpbGwodXApO1xuICAgICAgICBjb25zdCBzaWRlTm9ybWFscyA9IHZlcnRpY2VzLm1hcChwb2x5Z29uID0+XG4gICAgICAgICAgdGhpcy5jYWxjdWxhdGVTaWRlTm9ybWFscyhwb2x5Z29uKVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBzaWRlTm9ybWFsc0ZvcndhcmQgPSBzaWRlTm9ybWFscy5tYXAobiA9PiBuWzBdKTtcbiAgICAgICAgY29uc3Qgc2lkZU5vcm1hbHNCYWNrd2FyZCA9IHNpZGVOb3JtYWxzLm1hcChuID0+IG5bMV0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmRyYXdXaXJlZnJhbWVcbiAgICAgICAgICA/IFt0b3BOb3JtYWxzLCB0b3BOb3JtYWxzXVxuICAgICAgICAgIDogW1xuICAgICAgICAgICAgICB0b3BOb3JtYWxzLFxuICAgICAgICAgICAgICBzaWRlTm9ybWFsc0ZvcndhcmQsXG4gICAgICAgICAgICAgIHNpZGVOb3JtYWxzQmFja3dhcmQsXG4gICAgICAgICAgICAgIHNpZGVOb3JtYWxzRm9yd2FyZCxcbiAgICAgICAgICAgICAgc2lkZU5vcm1hbHNCYWNrd2FyZFxuICAgICAgICAgICAgXTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgYXR0cmlidXRlLnZhbHVlID0gbmV3IEZsb2F0MzJBcnJheShmbGF0dGVuRGVlcChub3JtYWxzKSk7XG4gIH1cblxuICBjYWxjdWxhdGVTaWRlTm9ybWFscyh2ZXJ0aWNlcykge1xuICAgIGNvbnN0IG51bVZlcnRpY2VzID0gdmVydGljZXMubGVuZ3RoO1xuICAgIGNvbnN0IG5vcm1hbHMgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtVmVydGljZXMgLSAxOyBpKyspIHtcbiAgICAgIGNvbnN0IG4gPSBnZXROb3JtYWwodmVydGljZXNbaV0sIHZlcnRpY2VzW2kgKyAxXSk7XG4gICAgICBub3JtYWxzLnB1c2gobik7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtbLi4ubm9ybWFscywgbm9ybWFsc1swXV0sIFtub3JtYWxzWzBdLCAuLi5ub3JtYWxzXV07XG4gIH1cblxuICBjYWxjdWxhdGVJbmRpY2VzKGF0dHJpYnV0ZSkge1xuICAgIC8vIGFkanVzdCBpbmRleCBvZmZzZXQgZm9yIG11bHRpcGxlIGJ1aWxkaW5nc1xuICAgIGNvbnN0IG11bHRpcGxpZXIgPSB0aGlzLnByb3BzLmRyYXdXaXJlZnJhbWUgPyAyIDogNTtcbiAgICBjb25zdCBvZmZzZXRzID0gdGhpcy5zdGF0ZS5ncm91cGVkVmVydGljZXMucmVkdWNlKFxuICAgICAgKGFjYywgdmVydGljZXMpID0+IFtcbiAgICAgICAgLi4uYWNjLFxuICAgICAgICBhY2NbYWNjLmxlbmd0aCAtIDFdICsgY291bnRWZXJ0aWNlcyh2ZXJ0aWNlcykgKiBtdWx0aXBsaWVyXG4gICAgICBdLFxuICAgICAgWzBdXG4gICAgKTtcblxuICAgIGNvbnN0IGluZGljZXMgPSB0aGlzLnN0YXRlLmdyb3VwZWRWZXJ0aWNlcy5tYXAoXG4gICAgICAodmVydGljZXMsIGJ1aWxkaW5nSW5kZXgpID0+XG4gICAgICAgIHRoaXMucHJvcHMuZHJhd1dpcmVmcmFtZVxuICAgICAgICAgID8gLy8gMS4gZ2V0IHNlcXVlbnRpYWxseSBvcmRlcmVkIGluZGljZXMgb2YgZWFjaCBidWlsZGluZyB3aXJlZnJhbWVcbiAgICAgICAgICAgIC8vIDIuIG9mZnNldCB0aGVtIGJ5IHRoZSBudW1iZXIgb2YgaW5kaWNlcyBpbiBwcmV2aW91cyBidWlsZGluZ3NcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlQ29udG91ckluZGljZXModmVydGljZXMsIG9mZnNldHNbYnVpbGRpbmdJbmRleF0pXG4gICAgICAgICAgOiAvLyAxLiBnZXQgdHJpYW5ndWxhdGVkIGluZGljZXMgZm9yIHRoZSBpbnRlcm5hbCBhcmVhc1xuICAgICAgICAgICAgLy8gMi4gb2Zmc2V0IHRoZW0gYnkgdGhlIG51bWJlciBvZiBpbmRpY2VzIGluIHByZXZpb3VzIGJ1aWxkaW5nc1xuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVTdXJmYWNlSW5kaWNlcyh2ZXJ0aWNlcywgb2Zmc2V0c1tidWlsZGluZ0luZGV4XSlcbiAgICApO1xuXG4gICAgYXR0cmlidXRlLnZhbHVlID0gbmV3IFVpbnQzMkFycmF5KGZsYXR0ZW5EZWVwKGluZGljZXMpKTtcbiAgICBhdHRyaWJ1dGUudGFyZ2V0ID0gdGhpcy5zdGF0ZS5nbC5FTEVNRU5UX0FSUkFZX0JVRkZFUjtcbiAgICB0aGlzLnN0YXRlLm1vZGVsLnNldFZlcnRleENvdW50KGF0dHJpYnV0ZS52YWx1ZS5sZW5ndGggLyBhdHRyaWJ1dGUuc2l6ZSk7XG4gIH1cblxuICBleHRyYWN0QnVpbGRpbmdzKCkge1xuICAgIGNvbnN0IHtkYXRhfSA9IHRoaXMucHJvcHM7XG5cbiAgICB0aGlzLnN0YXRlLmJ1aWxkaW5ncyA9IFtdO1xuXG4gICAgZGF0YS5tYXAoYnVpbGRpbmcgPT4ge1xuICAgICAgY29uc3Qge3Byb3BlcnRpZXMsIGdlb21ldHJ5fSA9IGJ1aWxkaW5nO1xuICAgICAgY29uc3Qge2Nvb3JkaW5hdGVzLCB0eXBlfSA9IGdlb21ldHJ5O1xuICAgICAgaWYgKHR5cGUgPT09ICdNdWx0aVBvbHlnb24nKSB7XG4gICAgICAgIGNvbnN0IGJ1aWxkaW5ncyA9IGNvb3JkaW5hdGVzLm1hcChjb29yZHMgPT4gKHtcbiAgICAgICAgICBjb29yZGluYXRlczogY29vcmRzLFxuICAgICAgICAgIHByb3BlcnRpZXNcbiAgICAgICAgfSkpO1xuICAgICAgICB0aGlzLnN0YXRlLmJ1aWxkaW5ncy5wdXNoKC4uLmJ1aWxkaW5ncyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXRlLmJ1aWxkaW5ncy5wdXNoKHtjb29yZGluYXRlcywgcHJvcGVydGllc30pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5zdGF0ZS5ncm91cGVkVmVydGljZXMgPSB0aGlzLnN0YXRlLmJ1aWxkaW5ncy5tYXAoYnVpbGRpbmcgPT4ge1xuICAgICAgdmFyIGggPSBidWlsZGluZy5wcm9wZXJ0aWVzLmhlaWdodCB8fCAxNTtcbiAgICAgIHJldHVybiBidWlsZGluZy5jb29yZGluYXRlcy5tYXAocG9seWdvbiA9PlxuICAgICAgICBwb2x5Z29uLm1hcChjb29yZGluYXRlID0+IFtjb29yZGluYXRlWzBdLCBjb29yZGluYXRlWzFdLCBoXSlcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICBjYWxjdWxhdGVDb250b3VySW5kaWNlcyh2ZXJ0aWNlcywgb2Zmc2V0KSB7XG4gICAgY29uc3Qgc3RyaWRlID0gY291bnRWZXJ0aWNlcyh2ZXJ0aWNlcyk7XG5cbiAgICByZXR1cm4gdmVydGljZXMubWFwKHBvbHlnb24gPT4ge1xuICAgICAgY29uc3QgaW5kaWNlcyA9IFtvZmZzZXRdO1xuICAgICAgY29uc3QgbnVtVmVydGljZXMgPSBwb2x5Z29uLmxlbmd0aDtcblxuICAgICAgLy8gYnVpbGRpbmcgdG9wXG4gICAgICAvLyB1c2UgdmVydGV4IHBhaXJzIGZvciBnbC5MSU5FUyA9PiBbMCwgMSwgMSwgMiwgMiwgLi4uLCBuLTEsIG4tMSwgMF1cbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbnVtVmVydGljZXMgLSAxOyBpKyspIHtcbiAgICAgICAgaW5kaWNlcy5wdXNoKGkgKyBvZmZzZXQsIGkgKyBvZmZzZXQpO1xuICAgICAgfVxuICAgICAgaW5kaWNlcy5wdXNoKG9mZnNldCk7XG5cbiAgICAgIC8vIGJ1aWxkaW5nIHNpZGVzXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVZlcnRpY2VzIC0gMTsgaSsrKSB7XG4gICAgICAgIGluZGljZXMucHVzaChpICsgb2Zmc2V0LCBpICsgc3RyaWRlICsgb2Zmc2V0KTtcbiAgICAgIH1cblxuICAgICAgb2Zmc2V0ICs9IG51bVZlcnRpY2VzO1xuICAgICAgcmV0dXJuIGluZGljZXM7XG4gICAgfSk7XG4gIH1cblxuICBjYWxjdWxhdGVTdXJmYWNlSW5kaWNlcyh2ZXJ0aWNlcywgb2Zmc2V0KSB7XG4gICAgY29uc3Qgc3RyaWRlID0gY291bnRWZXJ0aWNlcyh2ZXJ0aWNlcyk7XG4gICAgbGV0IGhvbGVzID0gbnVsbDtcbiAgICBjb25zdCBxdWFkID0gW1swLCAxXSwgWzAsIDNdLCBbMSwgMl0sIFsxLCAyXSwgWzAsIDNdLCBbMSwgNF1dO1xuXG4gICAgaWYgKHZlcnRpY2VzLmxlbmd0aCA+IDEpIHtcbiAgICAgIGhvbGVzID0gdmVydGljZXNcbiAgICAgICAgLnJlZHVjZShcbiAgICAgICAgICAoYWNjLCBwb2x5Z29uKSA9PiBbLi4uYWNjLCBhY2NbYWNjLmxlbmd0aCAtIDFdICsgcG9seWdvbi5sZW5ndGhdLFxuICAgICAgICAgIFswXVxuICAgICAgICApXG4gICAgICAgIC5zbGljZSgxLCB2ZXJ0aWNlcy5sZW5ndGgpO1xuICAgIH1cblxuICAgIGNvbnN0IHRvcEluZGljZXMgPSBlYXJjdXQoZmxhdHRlbkRlZXAodmVydGljZXMpLCBob2xlcywgMykubWFwKFxuICAgICAgaW5kZXggPT4gaW5kZXggKyBvZmZzZXRcbiAgICApO1xuXG4gICAgY29uc3Qgc2lkZUluZGljZXMgPSB2ZXJ0aWNlcy5tYXAocG9seWdvbiA9PiB7XG4gICAgICBjb25zdCBudW1WZXJ0aWNlcyA9IHBvbHlnb24ubGVuZ3RoO1xuICAgICAgLy8gYnVpbGRpbmcgdG9wXG4gICAgICBjb25zdCBpbmRpY2VzID0gW107XG5cbiAgICAgIC8vIGJ1aWxkaW5nIHNpZGVzXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVZlcnRpY2VzIC0gMTsgaSsrKSB7XG4gICAgICAgIGluZGljZXMucHVzaCguLi5kcmF3UmVjdGFuZ2xlKGkpKTtcbiAgICAgIH1cblxuICAgICAgb2Zmc2V0ICs9IG51bVZlcnRpY2VzO1xuICAgICAgcmV0dXJuIGluZGljZXM7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gW3RvcEluZGljZXMsIHNpZGVJbmRpY2VzXTtcblxuICAgIGZ1bmN0aW9uIGRyYXdSZWN0YW5nbGUoaSkge1xuICAgICAgcmV0dXJuIHF1YWQubWFwKHYgPT4gaSArIHZbMF0gKyBzdHJpZGUgKiB2WzFdICsgb2Zmc2V0KTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVVbmlmb3JtcygpIHtcbiAgICB0aGlzLmNhbGN1bGF0ZVVuaWZvcm1zKCk7XG4gICAgY29uc3Qge3BpeGVsUGVyTWV0ZXJ9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCB7XG4gICAgICBjb2xvcixcbiAgICAgIG9wYWNpdHksXG4gICAgICBhbWJpZW50Q29sb3IsXG4gICAgICBwb2ludExpZ2h0Q29sb3IsXG4gICAgICBwb2ludExpZ2h0TG9jYXRpb24sXG4gICAgICBwb2ludExpZ2h0QW1iaWVudENvZWZmaWNpZW50LFxuICAgICAgcG9pbnRMaWdodEF0dGVudWF0aW9uLFxuICAgICAgbWF0ZXJpYWxTcGVjdWxhckNvbG9yLFxuICAgICAgbWF0ZXJpYWxTaGluaW5lc3NcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIHRoaXMuc2V0VW5pZm9ybXMoe1xuICAgICAgcGl4ZWxQZXJNZXRlcixcbiAgICAgIGNvbG9yczogY29sb3IgfHwgWzEyOCwgMTI4LCAxMjhdLFxuICAgICAgb3BhY2l0eTogb3BhY2l0eSB8fCAxLFxuICAgICAgdUFtYmllbnRDb2xvcjogYW1iaWVudENvbG9yIHx8IFsyNTUsIDI1NSwgMjU1XSxcbiAgICAgIHVQb2ludExpZ2h0QW1iaWVudENvZWZmaWNpZW50OiBwb2ludExpZ2h0QW1iaWVudENvZWZmaWNpZW50IHx8IDAuMSxcbiAgICAgIHVQb2ludExpZ2h0TG9jYXRpb246IHBvaW50TGlnaHRMb2NhdGlvbiB8fCBbMCwgMCwgMF0sXG4gICAgICB1UG9pbnRMaWdodENvbG9yOiBwb2ludExpZ2h0Q29sb3IgfHwgWzI1NSwgMjU1LCAyNTVdLFxuICAgICAgdVBvaW50TGlnaHRBdHRlbnVhdGlvbjogcG9pbnRMaWdodEF0dGVudWF0aW9uIHx8IDAuMSxcbiAgICAgIHVNYXRlcmlhbFNwZWN1bGFyQ29sb3I6IG1hdGVyaWFsU3BlY3VsYXJDb2xvciB8fCBbMjU1LCAyNTUsIDI1NV0sXG4gICAgICB1TWF0ZXJpYWxTaGluaW5lc3M6IG1hdGVyaWFsU2hpbmluZXNzIHx8IDFcbiAgICB9KTtcbiAgfVxuXG4gIGNhbGN1bGF0ZVVuaWZvcm1zKCkge1xuICAgIGNvbnN0IERJU1RBTkNFX0lOX01FVEVSID0gMzcuMDQwOTtcbiAgICBjb25zdCBwaXhlbDAgPSB0aGlzLnByb2plY3Qoe2xvbjogLTEyMiwgbGF0OiAzNy41fSk7XG4gICAgY29uc3QgcGl4ZWwxID0gdGhpcy5wcm9qZWN0KHtsb246IC0xMjIsIGxhdDogMzcuNTAwMn0pO1xuXG4gICAgY29uc3QgZHggPSBwaXhlbDAueCAtIHBpeGVsMS54O1xuICAgIGNvbnN0IGR5ID0gcGl4ZWwwLnkgLSBwaXhlbDEueTtcbiAgICBjb25zdCBzY2FsZSA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSkgLyBESVNUQU5DRV9JTl9NRVRFUjtcblxuICAgIHRoaXMuc3RhdGUucGl4ZWxQZXJNZXRlciA9IHNjYWxlO1xuICB9XG59XG5cbi8qXG4qIGhlbHBlcnNcbiovXG4vLyBnZXQgbm9ybWFsIHZlY3RvciBvZiBsaW5lIHNlZ21lbnRcbmZ1bmN0aW9uIGdldE5vcm1hbChwMSwgcDIpIHtcbiAgaWYgKHAxWzBdID09PSBwMlswXSAmJiBwMVsxXSA9PT0gcDJbMV0pIHtcbiAgICByZXR1cm4gWzEsIDAsIDBdO1xuICB9XG5cbiAgY29uc3QgZGVncmVlczJyYWRpYW5zID0gTWF0aC5QSSAvIDE4MDtcblxuICBjb25zdCBsb24xID0gZGVncmVlczJyYWRpYW5zICogcDFbMF07XG4gIGNvbnN0IGxvbjIgPSBkZWdyZWVzMnJhZGlhbnMgKiBwMlswXTtcbiAgY29uc3QgbGF0MSA9IGRlZ3JlZXMycmFkaWFucyAqIHAxWzFdO1xuICBjb25zdCBsYXQyID0gZGVncmVlczJyYWRpYW5zICogcDJbMV07XG5cbiAgY29uc3QgYSA9IE1hdGguc2luKGxvbjIgLSBsb24xKSAqIE1hdGguY29zKGxhdDIpO1xuICBjb25zdCBiID1cbiAgICBNYXRoLmNvcyhsYXQxKSAqIE1hdGguc2luKGxhdDIpIC1cbiAgICBNYXRoLnNpbihsYXQxKSAqIE1hdGguY29zKGxhdDIpICogTWF0aC5jb3MobG9uMiAtIGxvbjEpO1xuXG4gIHJldHVybiB2ZWMzLm5vcm1hbGl6ZShbXSwgW2IsIDAsIC1hXSk7XG59XG5cbi8vIGNvdW50IG51bWJlciBvZiB2ZXJ0aWNlcyBpbiBnZW9qc29uIHBvbHlnb25cbmZ1bmN0aW9uIGNvdW50VmVydGljZXModmVydGljZXMpIHtcbiAgcmV0dXJuIHZlcnRpY2VzLnJlZHVjZSgoY291bnQsIHBvbHlnb24pID0+IGNvdW50ICsgcG9seWdvbi5sZW5ndGgsIDApO1xufVxuIl19