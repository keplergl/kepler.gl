// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {SolidPolygonLayer} from '@deck.gl/layers';
import {Layer, LayerExtension, phongMaterial} from '@deck.gl/core';
import {editShader, insertBefore} from '@kepler.gl/deckgl-layers';

/** All three passes receive positions already expressed in common map units. */
export class ContourProjectionExtension extends LayerExtension {
  static extensionName = 'ContourProjectionExtension';

  draw(this: Layer): void {
    for (const model of this.getModels()) {
      const project = model.shaderInputs.getUniformValues().project;
      if (project) {
        // Cartesian projection still treats Z as meters by default. Override
        // the draw's uniforms so it neither rescales nor warps our shared mesh.
        project.commonUnitsPerWorldUnit = [1, 1, 1];
        project.commonUnitsPerWorldUnit2 = [0, 0, 0];
      }
    }
  }
}

/** Light the draped surface without extruding its polygons into columns. */
export default class ContourSurfaceLayer extends SolidPolygonLayer {
  static layerName = 'ContourSurfaceLayer';

  initializeState(): void {
    super.initializeState();
    this.getAttributeManager()?.add({
      contourNormals: {
        size: 3,
        type: 'float32',
        stepMode: 'dynamic',
        noAlloc: true,
        update: this.calculateSurfaceNormals
      }
    });
  }

  protected calculateSurfaceNormals(attribute): void {
    const positions = this.state.polygonTesselator.get('positions');
    const getNormal = (this.props as any).getSurfaceNormal as
      | ((position: number[]) => [number, number, number])
      | undefined;
    if (!positions || !getNormal) {
      attribute.value = null;
      return;
    }
    const normals = new Float32Array(positions.length);
    for (let i = 0; i < positions.length; i += 3) {
      normals.set(getNormal([positions[i], positions[i + 1], positions[i + 2]]), i);
    }
    attribute.startIndices = this.state.polygonTesselator.vertexStarts;
    attribute.value = normals;
  }

  getShaders(type: unknown): ReturnType<SolidPolygonLayer['getShaders']> {
    const shaders = super.getShaders(type);
    let vs = editShader(
      shaders.vs,
      'contour surface position outputs',
      'out vec4 vColor;',
      `in vec3 contourNormals;
out vec4 vColor;
out vec3 vCommonPosition;
out vec3 vCameraPosition;
out vec3 vSurfaceNormal;`
    );
    vs = insertBefore(
      vs,
      'contour surface projected position',
      'DECKGL_FILTER_GL_POSITION(gl_Position, geometry);',
      `float elevationScale = abs(project.modelMatrix[2][2]);
  // Apply the inverse vertical scale once before interpolating the normals.
  vec3 surfaceNormal = elevationScale > 0.0
    ? vec3(contourNormals.xy, contourNormals.z / elevationScale)
    : vec3(0.0, 0.0, 1.0);
  vSurfaceNormal = project.coordinateSystem == COORDINATE_SYSTEM_CARTESIAN
    ? normalize(surfaceNormal)
    : normalize(project_offset_normal(surfaceNormal));
  vCommonPosition = geometry.position.xyz;
  vCameraPosition = project.cameraPosition;
  `
    );
    // Phong lighting runs in the fragment stage. Remove the stock vertex-stage
    // call as well, even though the non-extruded surface never takes that branch.
    vs = editShader(
      vs,
      'contour surface vertex color',
      'lighting_getLightColor(colors.rgb, project.cameraPosition, geometry.position.xyz, geometry.normal)',
      'colors.rgb'
    );
    const fs = insertBefore(
      editShader(
        shaders.fs,
        'contour surface position inputs',
        'in vec4 vColor;',
        `in vec4 vColor;
in vec3 vCommonPosition;
in vec3 vCameraPosition;
in vec3 vSurfaceNormal;`
      ),
      'contour surface lighting',
      'DECKGL_FILTER_COLOR(fragColor, geometry);',
      `vec3 normal = normalize(vSurfaceNormal);
  normal = gl_FrontFacing ? normal : -normal;
  fragColor.rgb = lighting_getLightColor(
    fragColor.rgb, vCameraPosition, vCommonPosition, normal
  );
  `
    );
    return {
      ...shaders,
      vs,
      fs,
      modules: shaders.modules.map(module =>
        module.name === 'gouraudMaterial' ? phongMaterial : module
      )
    };
  }
}
