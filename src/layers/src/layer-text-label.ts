// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as arrow from 'apache-arrow';
import {getDistanceScales} from 'viewport-mercator-project';
import {notNullorUndefined, DataContainerInterface, ArrowDataContainer} from '@kepler.gl/utils';
import uniq from 'lodash.uniq';

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

    if (
      !triggerChanged?.[`getLabelCharacterSet-${i}`] &&
      oldLayerData &&
      oldLayerData.textLabels &&
      oldLayerData.textLabels[i]
    ) {
      characterSet = oldLayerData.textLabels[i].characterSet;
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

    let getText: typeof getTextAccessor | arrow.Vector = getTextAccessor;
    // For Arrow Layers getText has to be an arrow vector.
    // For now check here for ArrowTable, not ArrowDataContainer.
    if (data instanceof arrow.Table && dataContainer instanceof ArrowDataContainer) {
      // TODO the data has to be a column of string type.
      // as numerical and other columns types lack valueOffsets prop.
      getText = dataContainer.getColumn(tl.field.fieldIdx);
    }

    return {
      characterSet,
      getText
    };
  });
};
