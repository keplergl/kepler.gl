// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {DrawCircleFromCenterMode} from '@deck.gl-community/editable-layers';

import {formatCircleRadiusLabel} from './editor-measure-labels';

/**
 * Extends DrawCircleFromCenterMode so both click-move-click and
 * click-drag-release work, matching DrawRectangleModeExtended.
 *
 * The base TwoClickPolygonMode treats these as mutually exclusive via
 * the `dragToDraw` modeConfig flag. This subclass removes those guards:
 * - Click → move → click  (two-click)
 * - Mousedown → drag → mouseup  (drag-to-draw)
 *
 * While the circle is being sized, a radius label is shown at the rim.
 */
export class DrawCircleModeExtended extends DrawCircleFromCenterMode {
  handleClick(event, props) {
    this.addClickSequence(event);
    this.checkAndFinishPolygon(props);
  }

  handleStartDragging(event, _props) {
    this.addClickSequence(event);
    event.cancelPan();
  }

  handleStopDragging(event, props) {
    this.addClickSequence(event);
    this.checkAndFinishPolygon(props);
  }

  getTooltips() {
    if (!this.position || !Number.isFinite(this.radius) || (this.radius ?? 0) <= 0) {
      return [];
    }

    const text = formatCircleRadiusLabel(this.radius as number);
    if (!text) {
      return [];
    }

    return [
      {
        position: this.position,
        text
      }
    ];
  }
}
