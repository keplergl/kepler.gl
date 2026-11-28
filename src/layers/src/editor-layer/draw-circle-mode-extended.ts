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
  override getGuides(
    props: Parameters<DrawCircleFromCenterMode['getGuides']>[0]
  ): ReturnType<DrawCircleFromCenterMode['getGuides']> {
    const center = this.getClickSequence()[0];
    const rim = props.lastPointerMoveEvent?.mapCoords;

    // The base mode clamps a zero radius to 1 m, producing a tiny stroked polygon
    // before the pointer moves. Omit that preview and its radius label instead.
    if (
      !center ||
      !rim ||
      ![center[0], center[1], rim[0], rim[1]].every(Number.isFinite) ||
      (center[0] === rim[0] && center[1] === rim[1])
    ) {
      this.radius = null;
      this.areaCircle = null;
      return {type: 'FeatureCollection', features: []};
    }

    return super.getGuides(props);
  }

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
