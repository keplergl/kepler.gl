// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {COORDINATE_SYSTEM} from '@deck.gl/core';
import {SimpleMeshLayer} from '@deck.gl/mesh-layers';
import {PlaneGeometry} from '@luma.gl/engine';
import {Vector3} from '@math.gl/core';

import {editShader} from '../layer-utils/shader-utils';
import type {RGBColor} from '@kepler.gl/types';

// luma.gl 9's PlaneGeometry ignores `radius`; pass explicit type/xlen/ylen so we
// get a [-1, 1] quad (a `radius: 1` plane would only span [-0.5, 0.5]).
const PLANE_GEOMETRY = new PlaneGeometry({
  type: 'x,y',
  xlen: 2,
  ylen: 2
} as any);

const DEPTH_DISK_PARAMETERS = {
  // Depth writes only happen with depthTest enabled. The disk is opaque-black-ish
  // and used purely to fill the depth buffer so far-side geometry (arcs/lines) is
  // occluded by the planet.
  depthTest: true,
  cull: false
};

// Earth radius in meters. The disk geometry is a [-1, 1] plane; we scale it into
// METERS in the vertex shader (like the atmosphere SphereGeometry, whose radius is
// ~6.4e6 m) and let SimpleMeshLayer's stock projection map it onto the globe —
// exactly the working path the atmosphere mesh layers use.
const DEPTH_DISK_FULL_RADIUS = 6.371e6;

// Globe common space uses GLOBE_RADIUS = 256 units (see deck.gl's project_globe_).
// The disk orientation math is done in that 256-unit common space (matching
// viewport.cameraPosition), then the resulting radius/shift ratios are converted to
// meters for the shader, since the disk geometry is expressed in meters.
const GLOBE_COMMON_RADIUS = 256;

/**
 * Creates a view-oriented disk positioned along the direction from the globe's center to the camera.
 * The disk is a cross-section of the globe between the front (visible) and back side, and it fills
 * the depth buffer so anything on the far side of the globe (e.g. arcs/lines) is depth-culled and
 * hidden behind the planet.
 */
export class GlobeDepthDiskLayer extends SimpleMeshLayer<any> {
  static layerName = 'GlobeDepthDiskLayer';

  getShaders(): any {
    const shaders = super.getShaders();

    // Override the local `pos` computation: reorient the flat [-1,1] plane to face
    // the camera, scale it to meters, and shift it toward the camera along the view
    // axis so it sits at the globe's silhouette cross-section. The stock
    // project_position_to_clipspace call is left untouched so the disk projects onto
    // the globe through the exact same (working) path the atmosphere mesh layers use.
    const vs = editShader(
      shaders.vs,
      'globe depth disk vs',
      'vec3 pos = (instanceModelMatrix * positions) * simpleMesh.sizeScale + instanceTranslation;',
      `mat3 u_matDepthDiskOrientation = mat3(
         u_depthDiskOrientCol0,
         u_depthDiskOrientCol1,
         u_depthDiskOrientCol2
       );
       vec3 pos = (u_matDepthDiskOrientation * positions) * u_depthDiskRadius;
       vDepthDiskPos = pos;
       pos = pos + u_directionToCamera * u_depthDiskShift;
      `
    );

    const inject = {
      'vs:#decl': `
        uniform vec3 u_depthDiskOrientCol0;
        uniform vec3 u_depthDiskOrientCol1;
        uniform vec3 u_depthDiskOrientCol2;
        uniform vec3 u_directionToCamera;
        uniform float u_depthDiskShift;
        uniform float u_depthDiskRadius;
        out vec3 vDepthDiskPos;
      `,
      'fs:#decl': `
        uniform float u_depthDiskRadius;
        in vec3 vDepthDiskPos;
      `,
      'fs:#main-start': `
        if (length(vDepthDiskPos) > u_depthDiskRadius) {
          discard;
        }
      `
    };

    return {
      ...shaders,
      vs,
      inject
    };
  }

  draw({uniforms}: {uniforms: object}): void {
    const normalizedRadius = GLOBE_COMMON_RADIUS;

    const camPos = new Vector3((this.context.viewport as any).cameraPosition);
    const camDir = camPos.clone().normalize();
    const topDir = new Vector3(0, 0, 1);
    const sideDir = camDir.clone().cross(topDir);
    const sidePoint = sideDir.clone().scale(normalizedRadius);

    const camToSide = sidePoint.clone().subtract(camPos).normalize();
    const adjustedSidePoint = camToSide.cross(topDir).scale(-normalizedRadius);

    const shiftToCamera = camDir.dot(adjustedSidePoint);
    const adjustedDiskRadius = Math.sqrt(
      normalizedRadius * normalizedRadius - shiftToCamera * shiftToCamera
    );

    // Camera-facing orientation: the plane's local X/Y axes map to world `right`/`up`
    // (both perpendicular to the camera direction), and local Z maps to `forward`.
    // Columns are handed to the shader as vec3s to avoid Matrix3 row/column ambiguity.
    const forward = camDir.clone();
    const right = topDir.clone().cross(forward).normalize();
    const up = forward.clone().cross(right).normalize();

    const model = this.state.model;
    if (model) {
      // Use the same uniform-delivery mechanism as the (working) atmosphere layers:
      // raw `uniform` declarations + assignment to model.props.uniforms.
      (model as any).props.uniforms = {
        ...(model as any).props.uniforms,
        // mat3(col0, col1, col2) in GLSL is column-major; mat3 * (x, y, 0) = x*right + y*up.
        u_depthDiskOrientCol0: [right[0], right[1], right[2]],
        u_depthDiskOrientCol1: [up[0], up[1], up[2]],
        u_depthDiskOrientCol2: [forward[0], forward[1], forward[2]],
        u_directionToCamera: [camDir[0], camDir[1], camDir[2]],
        // Convert the common-space (256-unit) radius/shift to meters, since the disk
        // geometry (and therefore `pos`) is expressed in meters.
        u_depthDiskShift: (shiftToCamera / normalizedRadius) * DEPTH_DISK_FULL_RADIUS,
        u_depthDiskRadius: (adjustedDiskRadius / normalizedRadius) * DEPTH_DISK_FULL_RADIUS
      };
    }
    super.draw({uniforms});
  }
}

export const getGlobeDepthDiskLayer = ({fillColor}: {fillColor?: RGBColor}) => {
  return new GlobeDepthDiskLayer({
    id: 'globe-depth-disk-layer',
    data: [[0, 0, 0]],
    coordinateOrigin: [0, 0, 0],
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    getPosition: (d: number[]) => d,
    getColor: (fillColor ?? [0, 0, 0]) as any,
    mesh: PLANE_GEOMETRY,
    parameters: DEPTH_DISK_PARAMETERS
  } as any);
};
