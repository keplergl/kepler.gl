// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {getDistanceScales} from 'viewport-mercator-project';
import {notNullorUndefined} from '@kepler.gl/utils';
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

export const textLabelAccessor = textLabel => dc => d => {
  const val = textLabel.field.valueAccessor(d);
  return notNullorUndefined(val) ? String(val) : '';
};

export const formatTextLabelData = ({
  textLabel,
  triggerChanged,
  oldLayerData,
  data,
  dataContainer
}) => {
  return textLabel.map((tl, i) => {
    if (!tl.field) {
      // if no field selected,
      return {
        getText: null,
        characterSet: []
      };
    }

    const getText = textLabelAccessor(tl)(dataContainer);
    let characterSet;

    if (
      !triggerChanged[`getLabelCharacterSet-${i}`] &&
      oldLayerData &&
      oldLayerData.textLabels &&
      oldLayerData.textLabels[i]
    ) {
      characterSet = oldLayerData.textLabels[i].characterSet;
    } else {
      const allLabels = tl.field ? data.map(getText) : [];
      characterSet = uniq(allLabels.join(''));
    }

    return {
      characterSet,
      getText
    };
  });
};
