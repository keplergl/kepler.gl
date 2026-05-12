// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {COORDINATE_SYSTEM} from '@deck.gl/core';
import {SimpleMeshLayer} from '@deck.gl/mesh-layers';
import {PlaneGeometry} from '@luma.gl/engine';
import {Quaternion, Vector3, Matrix3} from '@math.gl/core';
import {editShader} from '@kepler.gl/deckgl-layers';
import type {RGBColor} from '@kepler.gl/types';

const DEPTH_DISK_FULL_RADIUS = 6.371e6;

const PLANE_GEOMETRY = new PlaneGeometry({
  type: 'x,y',
  xlen: 2,
  ylen: 2
} as any);

const DEPTH_DISK_PARAMETERS = {
  depthWriteEnabled: true,
  depthCompare: 'less-equal' as const,
  cullMode: 'none' as const
};

/**
 * Creates a view-oriented disk positioned along the direction from globe center to camera.
 * The disk represents a cross-section of the globe between front (visible) and back side.
 * Fills depth buffer to allow variable-resolution basemap layers without depth writes,
 * preventing retesellation artifacts over the basemap.
 */
export class GlobeDepthDiskLayer extends SimpleMeshLayer<any, any> {
  draw({uniforms}: {uniforms: any}): void {
    const normalizedRadius = 256;

    const camPos = new Vector3(this.context.viewport.cameraPosition);
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

    const orientationQuat = new Quaternion();
    orientationQuat.rotationTo(topDir, camDir);

    const orientationMat = new Matrix3();
    orientationMat.fromQuaternion(orientationQuat);

    super.draw({
      uniforms: {
        ...uniforms,
        u_matDepthDiskOrientation: orientationMat,
        u_directionToCamera: camDir,
        u_depthDiskShift: (shiftToCamera / normalizedRadius) * DEPTH_DISK_FULL_RADIUS,
        u_depthDiskRadius: (adjustedDiskRadius / normalizedRadius) * DEPTH_DISK_FULL_RADIUS
      }
    });
  }

  getShaders(): any {
    const shaders = super.getShaders();

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

export const getGlobeDepthDiskLayer = ({fillColor}: {fillColor?: RGBColor}): any => {
  return new GlobeDepthDiskLayer({
    id: 'globe-depth-disk-layer',
    data: [[0, 0, 0]],
    coordinateOrigin: [0, 0, 0],
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    getPosition: (d: any) => d,
    getColor: fillColor || [0, 0, 0],
    mesh: PLANE_GEOMETRY,
    pickable: false,
    parameters: DEPTH_DISK_PARAMETERS
  } as any);
};
