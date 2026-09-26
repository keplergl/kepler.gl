// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  CompositeMode,
  GeoJsonEditMode,
  ModifyMode,
  TranslateMode
} from '@deck.gl-community/editable-layers';

export const BITMAP_MOVE_HANDLE_TYPE = 'move';

type PickLike = {isGuide?: boolean; object?: any};

function isMoveHandlePick(picks?: PickLike[]): boolean {
  return Boolean(
    picks?.some(
      pick =>
        pick?.isGuide &&
        pick?.object?.properties?.guideType === 'editHandle' &&
        pick?.object?.properties?.editHandleType === BITMAP_MOVE_HANDLE_TYPE
    )
  );
}

/**
 * Corner resize must not treat the center move handle as a vertex.
 * Skip modify when that handle is the drag target so TranslateMode can
 * move the whole rectangle.
 */
class BitmapModifyMode extends ModifyMode {
  handlePointerMove(event, props) {
    if (isMoveHandlePick(event?.picks)) {
      props.onUpdateCursor('move');
      return;
    }
    super.handlePointerMove(event, props);
  }

  handleStartDragging(event, props) {
    if (isMoveHandlePick(event?.picks)) {
      return;
    }
    super.handleStartDragging(event, props);
  }

  handleDragging(event, props) {
    if (isMoveHandlePick(event?.pointerDownPicks)) {
      return;
    }
    super.handleDragging(event, props);
  }

  handleStopDragging(event, props) {
    if (isMoveHandlePick(event?.pointerDownPicks)) {
      return;
    }
    super.handleStopDragging(event, props);
  }
}

/**
 * Rectangle edit mode: yellow corners resize, center handle moves the bitmap.
 */
export class BitmapBoundsEditMode extends CompositeMode {
  constructor() {
    super([
      new TranslateMode() as unknown as GeoJsonEditMode,
      new BitmapModifyMode() as unknown as GeoJsonEditMode
    ]);
  }

  getGuides(props) {
    const guides = super.getGuides(props);
    const selectedIndex = props.selectedIndexes?.[0];
    const feature =
      typeof selectedIndex === 'number' ? props.data?.features?.[selectedIndex] : null;
    const coords = feature?.geometry?.coordinates?.[0];
    if (!coords || coords.length < 4) {
      return guides;
    }

    // Closing ring repeats the first vertex; exclude it from the centroid.
    const first = coords[0];
    const last = coords[coords.length - 1];
    const pts = first[0] === last[0] && first[1] === last[1] ? coords.slice(0, -1) : coords;
    const lng = pts.reduce((sum, point) => sum + point[0], 0) / pts.length;
    const lat = pts.reduce((sum, point) => sum + point[1], 0) / pts.length;

    guides.features.push({
      type: 'Feature',
      properties: {
        guideType: 'editHandle',
        editHandleType: BITMAP_MOVE_HANDLE_TYPE,
        featureIndex: selectedIndex
      },
      geometry: {
        type: 'Point',
        coordinates: [lng, lat]
      }
    });

    return guides;
  }
}

export const BITMAP_BOUNDS_EDIT_MODE = new BitmapBoundsEditMode();
