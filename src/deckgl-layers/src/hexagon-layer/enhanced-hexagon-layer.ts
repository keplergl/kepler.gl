// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {HexagonLayer} from '@deck.gl/aggregation-layers';

const THIRD_PI = Math.PI / 3;
const HexbinVertices = Array.from({length: 6}, (_, i) => {
  const angle = i * THIRD_PI;
  return [Math.sin(angle), -Math.cos(angle)];
});

function getHexbinCentroid(id: [number, number], radius: number): [number, number] {
  const DIST_X = 2 * Math.sin(THIRD_PI);
  const DIST_Y = 1.5;
  return [(id[0] + (id[1] & 1) / 2) * radius * DIST_X, id[1] * radius * DIST_Y];
}

/**
 * In deck.gl 9, HexagonLayer natively supports CPU aggregation via gpuAggregation: false,
 * custom getColorValue/getElevationValue accessors, percentile filtering, and scale types.
 *
 * We override getPickingInfo to add `cellOutline` — an array of [lng, lat] coordinates
 * computed in common space so the outline aligns with rendered cells at all latitudes.
 */
export default class ScaleEnhancedHexagonLayer extends HexagonLayer<any> {
  static defaultProps = {
    ...HexagonLayer.defaultProps,
    gpuAggregation: false
  };

  getPickingInfo(params: any) {
    const info = super.getPickingInfo(params);
    if (info.object) {
      const {radiusCommon, hexOriginCommon, aggregatorViewport} = this.state as any;
      const coverage = this.props.coverage ?? 1;
      if (radiusCommon && aggregatorViewport) {
        const centroid = getHexbinCentroid([info.object.col, info.object.row], radiusCommon);
        const ox = hexOriginCommon?.[0] ?? 0;
        const oy = hexOriginCommon?.[1] ?? 0;
        const r = radiusCommon * coverage;

        const outline: number[][] = [];
        for (let i = 0; i < 6; i++) {
          const vx = centroid[0] + r * HexbinVertices[i][0] + ox;
          const vy = centroid[1] + r * HexbinVertices[i][1] + oy;
          outline.push(aggregatorViewport.unprojectFlat([vx, vy]));
        }
        outline.push(outline[0]);
        info.object.cellOutline = outline;
      }
    }
    return info;
  }
}

ScaleEnhancedHexagonLayer.layerName = 'ScaleEnhancedHexagonLayer';
