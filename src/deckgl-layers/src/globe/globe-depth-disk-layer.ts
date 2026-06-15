// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {COORDINATE_SYSTEM} from '@deck.gl/core';
import {SimpleMeshLayer} from '@deck.gl/mesh-layers';
import {PlaneGeometry} from '@luma.gl/engine';
import {Vector3, Matrix3} from '@math.gl/core';

import {editShader} from '../layer-utils/shader-utils';
import type {RGBColor} from '@kepler.gl/types';

const DEPTH_DISK_FULL_RADIUS = 6.371e6;

const PLANE_GEOMETRY = new PlaneGeometry({
  radius: 1
});

const DEPTH_DISK_PARAMETERS = {
  depthTest: true,
  cull: false
};

/**
 * Creates a view-oriented disk positioned along the direction from the globe's center to the camera.
 * Fills the depth buffer to prevent rendering artifacts on the back side of the globe.
 */
export class GlobeDepthDiskLayer extends SimpleMeshLayer<any> {
  static layerName = 'GlobeDepthDiskLayer';

  draw({uniforms}: {uniforms: object}): void {
    const normalizedRadius = 256;

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

    // Create orientation matrix to face the camera
    const orientationMat = new Matrix3();
    const forward = camDir.clone();
    const right = new Vector3().cross(topDir, forward).normalize();
    const up = new Vector3().cross(forward, right).normalize();
    orientationMat.set(
      right[0], up[0], forward[0],
      right[1], up[1], forward[1],
      right[2], up[2], forward[2]
    );

    const model = this.state.model;
    if (model) {
      (model as any).props.uniforms = {
        ...(model as any).props.uniforms,
        u_matDepthDiskOrientation: orientationMat,
        u_directionToCamera: camDir,
        u_depthDiskShift: (shiftToCamera / normalizedRadius) * DEPTH_DISK_FULL_RADIUS,
        u_depthDiskRadius: (adjustedDiskRadius / normalizedRadius) * DEPTH_DISK_FULL_RADIUS
      };
    }
    super.draw({uniforms});
  }

  getShaders(): any {
    const shaders = super.getShaders();

    // deck.gl 9.x uses `simpleMesh.sizeScale` instead of `sizeScale`
    const vs = editShader(
      shaders.vs,
      'globe depth disk vs',
      'vec3 pos = (instanceModelMatrix * positions) * simpleMesh.sizeScale + instanceTranslation;',
      `vec3 pos = (u_matDepthDiskOrientation * positions) * u_depthDiskRadius;
       vDepthDiskPos = pos;
       pos = pos + u_directionToCamera * u_depthDiskShift;
      `
    );

    const inject = {
      'vs:#decl': `
        uniform mat3 u_matDepthDiskOrientation;
        uniform float u_depthDiskRadius;
        uniform float u_depthDiskShift;
        uniform vec3 u_directionToCamera;
        out vec3 vDepthDiskPos;
      `,
      'fs:#decl': `
        uniform float u_depthDiskRadius;
        in vec3 vDepthDiskPos;
      `,
      'fs:#main-start': `
        if(length(vDepthDiskPos) > u_depthDiskRadius){
          discard;
        };
      `
    };

    return {
      ...shaders,
      vs,
      inject
    };
  }
}

export const getGlobeDepthDiskLayer = ({fillColor}: {fillColor?: RGBColor}) => {
  return new GlobeDepthDiskLayer({
    id: 'globe-depth-disk-layer',
    data: [[0, 0, 0]],
    coordinateOrigin: [0, 0, 0],
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    getPosition: (d: number[]) => d,
    getColor: fillColor || [0, 0, 0],
    mesh: PLANE_GEOMETRY,
    parameters: DEPTH_DISK_PARAMETERS
  });
};
