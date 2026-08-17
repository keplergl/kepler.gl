// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  ModifyMode,
  Feature,
  LineString,
  Point,
  Viewport as NebulaViewport
} from '@deck.gl-community/editable-layers';
import {Viewport} from '@deck.gl/core';

import {EDITOR_LAYER_PICKING_RADIUS} from '@kepler.gl/constants';

const RIGHT_BUTTON = 2;

function getIntermediateHandle(picks?: {isGuide?: boolean; object?: any}[]) {
  return picks?.find(
    pick =>
      pick?.isGuide &&
      pick?.object?.properties?.guideType === 'editHandle' &&
      pick?.object?.properties?.editHandleType === 'intermediate'
  )?.object;
}

function isLineStringType(type?: string) {
  return type === 'LineString' || type === 'MultiLineString';
}

/**
 * Dragging the body of a selected line currently hits the insert-vertex
 * handle. Skip modify in that case so TranslateMode can move the whole line.
 * Clicking the line still inserts a point via handleClick.
 */
function shouldTranslateLine(
  picks: {isGuide?: boolean; object?: any}[] | undefined,
  props: {data?: {features?: {geometry?: {type?: string}}[]}}
) {
  const handle = getIntermediateHandle(picks);
  if (!handle) {
    return false;
  }
  const feature = props?.data?.features?.[handle.properties.featureIndex];
  return isLineStringType(feature?.geometry?.type);
}

/**
 * Show helper only when the point is close enough to the line.
 */
export class ModifyModeExtended extends ModifyMode {
  // @ts-expect-error expect to return no point when object is too far
  getNearestPoint(
    line: Feature<LineString>,
    inPoint: Feature<Point>,
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

  handlePointerMove(event, props) {
    if (shouldTranslateLine(event?.picks, props)) {
      props.onUpdateCursor('move');
      return;
    }
    super.handlePointerMove(event, props);
  }

  handleStartDragging(event, props) {
    if (shouldTranslateLine(event?.picks, props)) {
      return;
    }
    super.handleStartDragging(event, props);
  }

  handleDragging(event, props) {
    if (shouldTranslateLine(event?.pointerDownPicks, props)) {
      return;
    }
    super.handleDragging(event, props);
  }

  handleStopDragging(event, props) {
    if (shouldTranslateLine(event?.pointerDownPicks, props)) {
      return;
    }
    super.handleStopDragging(event, props);
  }
}
