// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as arrow from 'apache-arrow';
import {getDistanceScales} from 'viewport-mercator-project';
import {DataContainerInterface, ArrowDataContainer} from '@kepler.gl/utils';
import {notNullorUndefined} from '@kepler.gl/common-utils';
import uniq from 'lodash/uniq';

export const defaultPadding = 20;

export function getTextOffsetByRadius(radiusScale, getRadius, mapState) {
  return textLabel => {
    const distanceScale = getDistanceScales(mapState);
    const xMult = textLabel.anchor === 'middle' ? 0 : textLabel.anchor === 'start' ? 1 : -1;
    const yMult = textLabel.alignment === 'center' ? 0 : textLabel.alignment === 'bottom' ? 1 : -1;

    const sizeOffset =
      textLabel.alignment === 'center'
        ? 0
        : textLabel.alignment === 'bottom'
        ? textLabel.size
        : textLabel.size;

    const pixelRadius = radiusScale * distanceScale.pixelsPerMeter[0];
    const padding = defaultPadding;

    return typeof getRadius === 'function'
      ? d => [
          xMult * (getRadius(d) * pixelRadius + padding),
          yMult * (getRadius(d) * pixelRadius + padding + sizeOffset)
        ]
      : [
          xMult * (getRadius * pixelRadius + padding),
          yMult * (getRadius * pixelRadius + padding + sizeOffset)
        ];
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const textLabelAccessor = textLabel => dc => d => {
  const val = textLabel.field.valueAccessor(d);
  return notNullorUndefined(val) ? String(val) : '';
};

export const formatTextLabelData = ({
  textLabel,
  triggerChanged,
  oldLayerData,
  data,
  dataContainer,
  filteredIndex
}: {
  textLabel: any;
  triggerChanged?: boolean | {[key: string]: boolean};
  oldLayerData: any;
  data: any;
  dataContainer: DataContainerInterface;
  filteredIndex?: Uint8ClampedArray | null;
}) => {
  return textLabel.map((tl, i) => {
    if (!tl.field) {
      // if no field selected,
      return {
        getText: null,
        characterSet: []
      };
    }

    const getTextAccessor: (d: {index: number}) => string = textLabelAccessor(tl)(dataContainer);
    let characterSet;
    let getText: typeof getTextAccessor | arrow.Vector = getTextAccessor;

    let rebuildArrowTextVector = true;
    if (
      !triggerChanged?.[`getLabelCharacterSet-${i}`] &&
      oldLayerData &&
      oldLayerData.textLabels &&
      oldLayerData.textLabels[i]
    ) {
      characterSet = oldLayerData.textLabels[i].characterSet;
      getText = oldLayerData.textLabels[i].getText;
      rebuildArrowTextVector = false;
    } else {
      if (data instanceof arrow.Table) {
        // we don't filter out arrow tables,
        // so we use filteredIndex array instead
        const allLabels: string[] = [];
        if (tl.field) {
          if (filteredIndex) {
            filteredIndex.forEach((value, index) => {
              if (value > 0) allLabels.push(getTextAccessor({index}));
            });
          } else {
            for (let index = 0; index < dataContainer.numRows(); ++index) {
              allLabels.push(getTextAccessor({index}));
            }
          }
        }
        characterSet = uniq(allLabels.join(''));
      } else {
        const allLabels = tl.field ? data.map(getTextAccessor) : [];
        characterSet = uniq(allLabels.join(''));
      }
    }

    // For Arrow Layers getText has to be an arrow vector.
    // For now check here for ArrowTable, not ArrowDataContainer.
    if (
      rebuildArrowTextVector &&
      data instanceof arrow.Table &&
      dataContainer instanceof ArrowDataContainer
    ) {
      getText = dataContainer.getColumn(tl.field.fieldIdx);
      try {
        getText = getArrowTextVector(getText as arrow.Vector, getTextAccessor);
      } catch (error) {
        // empty text labels
        getText = getArrowTextVector(getText, () => ' ');
      }
    }

    return {
      characterSet,
      getText
    };
  });
};

/**
 * Get an arrow vector suitable to render text labels with arrow layers.
 * @param getText A candidate arrow vector to use for text labels.
 * @param getTextAccessor Text label accessor.
 */
export const getArrowTextVector = (
  candidateTextVector: arrow.Vector,
  getTextAccessor: ({index}: {index: number}) => string
): arrow.Vector => {
  // if the passed vector is suitable for text labels
  if (arrow.DataType.isUtf8(candidateTextVector?.type)) {
    return candidateTextVector;
  }

  // create utf8 vector from source vector with the same number of batches.
  // @ts-expect-error
  const offsets = candidateTextVector._offsets;
  const numOffsets = offsets.length;
  const batchVectors: arrow.Vector[] = [];
  const datum = {index: 0};
  for (let batchIndex = 0; batchIndex < numOffsets - 1; batchIndex++) {
    const batchStart = offsets[batchIndex];
    const batchEnd = offsets[batchIndex + 1];

    const batchLabels: string[] = [];
    for (let rowIndex = batchStart; rowIndex < batchEnd; ++rowIndex) {
      datum.index = rowIndex;
      batchLabels.push(getTextAccessor(datum));
    }

    batchVectors.push(arrow.vectorFromArray(batchLabels, new arrow.Utf8()));
  }

  const input = batchVectors.flatMap(x => x.data).flat(Number.POSITIVE_INFINITY);

  return new arrow.Vector(input);
};
