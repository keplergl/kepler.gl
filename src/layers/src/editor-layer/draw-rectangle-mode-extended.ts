// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {DrawRectangleMode} from '@deck.gl-community/editable-layers';

/**
 * Extends DrawRectangleMode to support both click-move-click and
 * click-drag-release interactions for drawing rectangles.
 *
 * The base TwoClickPolygonMode treats these as mutually exclusive via
 * the `dragToDraw` modeConfig flag. This subclass removes those guards
 * so both gestures work simultaneously:
 * - Click → move → click  (original two-click behavior)
 * - Mousedown → drag → mouseup  (drag-to-draw behavior)
 */
export class DrawRectangleModeExtended extends DrawRectangleMode {
  override getGuides(
    props: Parameters<DrawRectangleMode['getGuides']>[0]
  ): ReturnType<DrawRectangleMode['getGuides']> {
    const start = this.getClickSequence()[0];
    const end = props.lastPointerMoveEvent?.mapCoords;

    // Collapsed polygon strokes can produce unbounded joins in deck.gl.
    // Wait until both rectangle dimensions are nonzero before rendering or committing it.
    if (
      !start ||
      !end ||
      ![start[0], start[1], end[0], end[1]].every(Number.isFinite) ||
      start[0] === end[0] ||
      start[1] === end[1]
    ) {
      return {type: 'FeatureCollection', features: []};
    }

    return super.getGuides(props);
  }

  handleClick(event, props) {
    // Always handle clicks (no dragToDraw guard)
    this.addClickSequence(event);
    this.checkAndFinishPolygon(props);
  }

  handleStartDragging(event, _props) {
    // Always handle drag start (no dragToDraw guard)
    this.addClickSequence(event);
    event.cancelPan();
  }

  handleStopDragging(event, props) {
    // Always handle drag stop (no dragToDraw guard)
    this.addClickSequence(event);
    this.checkAndFinishPolygon(props);
  }
}
