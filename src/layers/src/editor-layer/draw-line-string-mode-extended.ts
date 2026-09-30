// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {DrawLineStringMode} from '@deck.gl-community/editable-layers';

import {formatLineLengthLabel, getLineLengthKm} from './editor-measure-labels';

/**
 * Line sketching for Draw on Map. While vertices are being added, a length
 * label is shown at the cursor (including the tentative segment).
 */
export class DrawLineStringModeExtended extends DrawLineStringMode {
  getTooltips(props) {
    const clickSequence = this.getClickSequence() || [];
    if (!clickSequence.length) {
      return [];
    }

    const lastPointer = props?.lastPointerMoveEvent?.mapCoords;
    const coordinates = lastPointer ? [...clickSequence, lastPointer] : clickSequence;
    if (coordinates.length < 2) {
      return [];
    }

    const text = formatLineLengthLabel(getLineLengthKm(coordinates));
    if (!text) {
      return [];
    }

    return [
      {
        position: coordinates[coordinates.length - 1],
        text
      }
    ];
  }
}
