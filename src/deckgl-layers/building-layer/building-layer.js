// Copyright (c) 2018 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {Layer, assembleShaders} from 'deck.gl';
import earcut from 'earcut';
import flattenDeep from 'lodash.flattendeep';
import {Model, Geometry} from 'luma.gl';
import {mat4, vec3} from 'gl-matrix';

import vs from './building-layer-vertex.glsl';
import fs from './building-layer-fragment.glsl';

const viewMatrixCompat = mat4.create();
mat4.lookAt(viewMatrixCompat, [0, 0, 0], [0, 0, -1], [0, 1, 0]);
const viewMatrix = new Float32Array(viewMatrixCompat);

export default class BuildingLayer extends Layer {
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
  constructor(props) {
    super({
      opacity: 1,
      ...props
    });
  }

  initializeState() {
    const {gl} = this.context;
    const {attributeManager} = this.state;

    attributeManager.addDynamic({
      // Primtive attributes
      indices: {size: 1, update: this.calculateIndices, isIndexed: true},
      positions: {size: 3, update: this.calculatePositions},
      // colors: {update: this.calculateColors},
      normals: {size: 3, update: this.calculateNormals}
    });

    this.setUniforms({opacity: this.props.opacity});

    const IndexType = gl.getExtension('OES_element_index_uint')
      ? Uint32Array
      : Uint16Array;

    this.setState({
      numInstances: 0,
      model: this.getModel(gl),
      IndexType
    });

    this.extractBuildings();
  }

  didMount() {
    this.updateUniforms();
  }

  willReceiveProps(oldProps, newProps) {
    super.willReceiveProps(oldProps, newProps);

    const {dataChanged, attributeManager} = this.state;
    if (dataChanged) {
      this.extractBuildings();

      attributeManager.invalidateAll();
    }

    this.updateUniforms();
  }

  getShaders() {
    return {vs, fs};
  }

  getModel(gl) {
    return new Model({
      ...assembleShaders(gl, this.getShaders()),
      geometry: new Geometry({
        id: this.props.id,
        drawMode: this.props.drawWireframe ? 'LINES' : 'TRIANGLES'
      }),
      vertexCount: 0,
      isIndexed: true
    });
  }

  draw({uniforms}) {
    this.state.model.render({
      ...uniforms,
      viewMatrix
    });
  }

  // each top vertex is on 3 surfaces
  // each bottom vertex is on 2 surfaces
  calculatePositions(attribute) {
    const positions = flattenDeep(
      this.state.groupedVertices.map(vertices => {
        const topVertices = Array.prototype.concat.apply([], vertices);
        const baseVertices = topVertices.map(v => [v[0], v[1], 0]);
        return this.props.drawWireframe
          ? [topVertices, baseVertices]
          : [topVertices, topVertices, topVertices, baseVertices, baseVertices];
      })
    );
    attribute.value = new Float32Array(positions);
  }

  calculateNormals(attribute) {
    const up = [0, 1, 0];

    const normals = this.state.groupedVertices.map(
      (vertices, buildingIndex) => {
        const topNormals = new Array(countVertices(vertices)).fill(up);
        const sideNormals = vertices.map(polygon =>
          this.calculateSideNormals(polygon)
        );
        const sideNormalsForward = sideNormals.map(n => n[0]);
        const sideNormalsBackward = sideNormals.map(n => n[1]);

        return this.props.drawWireframe
          ? [topNormals, topNormals]
          : [
              topNormals,
              sideNormalsForward,
              sideNormalsBackward,
              sideNormalsForward,
              sideNormalsBackward
            ];
      }
    );

    attribute.value = new Float32Array(flattenDeep(normals));
  }

  calculateSideNormals(vertices) {
    const numVertices = vertices.length;
    const normals = [];

    for (let i = 0; i < numVertices - 1; i++) {
      const n = getNormal(vertices[i], vertices[i + 1]);
      normals.push(n);
    }

    return [[...normals, normals[0]], [normals[0], ...normals]];
  }

  calculateIndices(attribute) {
    // adjust index offset for multiple buildings
    const multiplier = this.props.drawWireframe ? 2 : 5;
    const offsets = this.state.groupedVertices.reduce(
      (acc, vertices) => [
        ...acc,
        acc[acc.length - 1] + countVertices(vertices) * multiplier
      ],
      [0]
    );

    const indices = this.state.groupedVertices.map(
      (vertices, buildingIndex) =>
        this.props.drawWireframe
          ? // 1. get sequentially ordered indices of each building wireframe
            // 2. offset them by the number of indices in previous buildings
            this.calculateContourIndices(vertices, offsets[buildingIndex])
          : // 1. get triangulated indices for the internal areas
            // 2. offset them by the number of indices in previous buildings
            this.calculateSurfaceIndices(vertices, offsets[buildingIndex])
    );

    attribute.value = new Uint32Array(flattenDeep(indices));
    attribute.target = this.state.gl.ELEMENT_ARRAY_BUFFER;
    this.state.model.setVertexCount(attribute.value.length / attribute.size);
  }

  extractBuildings() {
    const {data} = this.props;

    this.state.buildings = [];

    data.map(building => {
      const {properties, geometry} = building;
      const {coordinates, type} = geometry;
      if (type === 'MultiPolygon') {
        const buildings = coordinates.map(coords => ({
          coordinates: coords,
          properties
        }));
        this.state.buildings.push(...buildings);
      } else {
        this.state.buildings.push({coordinates, properties});
      }
    });

    this.state.groupedVertices = this.state.buildings.map(building => {
      var h = building.properties.height || 15;
      return building.coordinates.map(polygon =>
        polygon.map(coordinate => [coordinate[0], coordinate[1], h])
      );
    });
  }

  calculateContourIndices(vertices, offset) {
    const stride = countVertices(vertices);

    return vertices.map(polygon => {
      const indices = [offset];
      const numVertices = polygon.length;

      // building top
      // use vertex pairs for gl.LINES => [0, 1, 1, 2, 2, ..., n-1, n-1, 0]
      for (let i = 1; i < numVertices - 1; i++) {
        indices.push(i + offset, i + offset);
      }
      indices.push(offset);

      // building sides
      for (let i = 0; i < numVertices - 1; i++) {
        indices.push(i + offset, i + stride + offset);
      }

      offset += numVertices;
      return indices;
    });
  }

  calculateSurfaceIndices(vertices, offset) {
    const stride = countVertices(vertices);
    let holes = null;
    const quad = [[0, 1], [0, 3], [1, 2], [1, 2], [0, 3], [1, 4]];

    if (vertices.length > 1) {
      holes = vertices
        .reduce(
          (acc, polygon) => [...acc, acc[acc.length - 1] + polygon.length],
          [0]
        )
        .slice(1, vertices.length);
    }

    const topIndices = earcut(flattenDeep(vertices), holes, 3).map(
      index => index + offset
    );

    const sideIndices = vertices.map(polygon => {
      const numVertices = polygon.length;
      // building top
      const indices = [];

      // building sides
      for (let i = 0; i < numVertices - 1; i++) {
        indices.push(...drawRectangle(i));
      }

      offset += numVertices;
      return indices;
    });

    return [topIndices, sideIndices];

    function drawRectangle(i) {
      return quad.map(v => i + v[0] + stride * v[1] + offset);
    }
  }

  updateUniforms() {
    this.calculateUniforms();
    const {pixelPerMeter} = this.state;
    const {
      color,
      opacity,
      ambientColor,
      pointLightColor,
      pointLightLocation,
      pointLightAmbientCoefficient,
      pointLightAttenuation,
      materialSpecularColor,
      materialShininess
    } = this.props;

    this.setUniforms({
      pixelPerMeter,
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

  calculateUniforms() {
    const DISTANCE_IN_METER = 37.0409;
    const pixel0 = this.project({lon: -122, lat: 37.5});
    const pixel1 = this.project({lon: -122, lat: 37.5002});

    const dx = pixel0.x - pixel1.x;
    const dy = pixel0.y - pixel1.y;
    const scale = Math.sqrt(dx * dx + dy * dy) / DISTANCE_IN_METER;

    this.state.pixelPerMeter = scale;
  }
}

/*
* helpers
*/
// get normal vector of line segment
function getNormal(p1, p2) {
  if (p1[0] === p2[0] && p1[1] === p2[1]) {
    return [1, 0, 0];
  }

  const degrees2radians = Math.PI / 180;

  const lon1 = degrees2radians * p1[0];
  const lon2 = degrees2radians * p2[0];
  const lat1 = degrees2radians * p1[1];
  const lat2 = degrees2radians * p2[1];

  const a = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const b =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

  return vec3.normalize([], [b, 0, -a]);
}

// count number of vertices in geojson polygon
function countVertices(vertices) {
  return vertices.reduce((count, polygon) => count + polygon.length, 0);
}
