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
