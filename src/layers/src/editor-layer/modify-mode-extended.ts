// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  ModifyMode,
  FeatureOf,
  LineString,
  Point,
  Viewport as NebulaViewport
} from '@nebula.gl/edit-modes';
import {Viewport} from '@deck.gl/core';

import {EDITOR_LAYER_PICKING_RADIUS} from '@kepler.gl/constants';

const RIGHT_BUTTON = 2;

/**
 * Show helper only when the point is close enough to the line.
 */
export class ModifyModeExtended extends ModifyMode {
  // @ts-expect-error expect to return no point when object is too far
  getNearestPoint(
    line: FeatureOf<LineString>,
    inPoint: FeatureOf<Point>,
    viewport: Viewport | null | undefined
  ) {
    const p = super.getNearestPoint(line, inPoint, viewport as NebulaViewport | null | undefined);
    if (p && viewport) {
      const p1 = viewport.project(p.geometry.coordinates);
      const p2 = viewport.project(inPoint.geometry.coordinates);
      const d = Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
      if (d > EDITOR_LAYER_PICKING_RADIUS) {
        return;
      }
    }
    return p;
  }

  handleClick(event, props) {
    // prevent insertion of points for right click
    if (event?.sourceEvent?.button === RIGHT_BUTTON) {
      return;
    }
    super.handleClick(event, props);
  }
}
