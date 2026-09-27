// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {SolidPolygonLayer, SolidPolygonLayerProps} from '@deck.gl/layers';

import {editShader, insertBefore} from '../layer-utils/shader-utils';

const ELEVATION_OFFSET_DECL = 'in float elevations;';
const ELEVATION_OFFSET_DECL_REPLACEMENT = `in float elevations;
in float elevationOffsets;`;

/**
 * Lift SolidPolygonLayer geometry by a per-feature offset, independent of
 * Enable height / extrusion. Offset is added to vertex Z in world units.
 */
export function injectElevationOffsetShader(vs: string): string {
  return insertBefore(
    editShader(
      vs,
      'solid polygon vs add elevation offset attr',
      ELEVATION_OFFSET_DECL,
      ELEVATION_OFFSET_DECL_REPLACEMENT
    ),
    'solid polygon vs add elevation offset',
    'if (solidPolygon.extruded)',
    'pos.z += elevationOffsets;\n  '
  );
}

export type OffsetSolidPolygonLayerProps<DataT = any> = {
  getElevationOffset?: ((d: DataT) => number) | number;
} & SolidPolygonLayerProps<DataT>;

export default class OffsetSolidPolygonLayer<DataT = any> extends SolidPolygonLayer<
  DataT,
  OffsetSolidPolygonLayerProps<DataT>
> {
  getShaders(type: unknown): ReturnType<SolidPolygonLayer['getShaders']> {
    const shaders = super.getShaders(type);
    return {
      ...shaders,
      vs: injectElevationOffsetShader(shaders.vs)
    };
  }

  initializeState(): void {
    super.initializeState();
    this.getAttributeManager()?.add({
      elevationOffsets: {
        size: 1,
        stepMode: 'dynamic',
        accessor: 'getElevationOffset'
      }
    });
  }
}

OffsetSolidPolygonLayer.layerName = 'OffsetSolidPolygonLayer';
OffsetSolidPolygonLayer.defaultProps = {
  getElevationOffset: {type: 'accessor', value: 0}
};
