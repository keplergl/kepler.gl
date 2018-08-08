// Copyright (c) 2018 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {scaleQuantize, scaleOrdinal, scaleQuantile, scaleSqrt} from 'd3-scale';
import {unique} from 'utils/data-utils';

import {SCALE_TYPES} from 'constants/default-settings';

// Enable render color by customized color Scale
export function getBinColorDomain(scaleType, bins, [lowerIdx, upperIdx]) {
  switch (scaleType) {
    case SCALE_TYPES.quantize:
      return [bins[lowerIdx].value, bins[upperIdx].value];

    case SCALE_TYPES.quantile:
      return bins.slice(lowerIdx, upperIdx + 1).map(d => d.value);
    case SCALE_TYPES.ordinal:
      return unique(bins.map(b => b.value)).sort();
    default:
      return [bins[lowerIdx].value, bins[upperIdx].value];
  }
}

export function getScaleFunctor(scaleType) {
  switch (scaleType) {
    case SCALE_TYPES.quantize:
      return scaleQuantize;

    case SCALE_TYPES.quantile:
      return scaleQuantile;
    case SCALE_TYPES.ordinal:
      return scaleOrdinal;
    default:
      return scaleQuantile;
  }
}

export function getColorValueDomain(layer) {
  const {lowerPercentile, upperPercentile, colorScale} = layer.props;
  const {sortedBins} = layer.state.sortedColorBins;
  const len = sortedBins.length;

  if (!len) {
    // err... what do we do
    layer.state.colorValueDomain = null;
  } else {
    const lowerIdx = Math.ceil(lowerPercentile / 100 * (len - 1));
    const upperIdx = Math.floor(upperPercentile / 100 * (len - 1));

    // calculate valueDomain based on
    layer.state.colorValueDomain = getBinColorDomain(colorScale, sortedBins, [
      lowerIdx,
      upperIdx
    ]);
    layer.getColorScale();
  }

  layer.props.onSetColorDomain(layer.state.colorValueDomain);
}

export function getColorScaleFunction(layer) {
  const {colorScale, colorDomain} = layer.props;
  layer.state.colorScaleFunc = getScaleFunctor(colorScale)()
    .domain(
      colorDomain || layer.state.colorDomain || layer.state.colorValueDomain
    )
    .range(layer.props.colorRange);
}

export function getRadiusScaleFunction(layer) {
  const {viewport} = layer.context;
  layer.state.radiusScaleFunc = scaleSqrt()
    .domain(layer.state.radiusDomain)
    .range(
      layer.props.radiusRange.map(
        d => d * viewport.distanceScales.metersPerPixel[0]
      )
    );
}

export function needsRecalculateColorDomain(oldProps, props) {
  return (
    oldProps.lowerPercentile !== props.lowerPercentile ||
    oldProps.upperPercentile !== props.upperPercentile ||
    oldProps.colorScale !== props.colorScale
  );
}

export function needReCalculateScaleFunction(oldProps, props) {
  return oldProps.colorRange !== props.colorRange;
}

export function needsRecalculateRadiusRange(oldProps, props) {
  return (
    oldProps.radiusRange !== props.radiusRange &&
    (oldProps.radiusRange[0] !== props.radiusRange[0] ||
      oldProps.radiusRange[1] !== props.radiusRange[1])
  );
}
