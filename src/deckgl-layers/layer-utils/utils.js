import {scaleQuantize, scaleQuantile, scaleSqrt} from 'd3-scale';
import {SCALE_TYPES} from '../../constants/default-settings';

// Enable render color by customized color Scale
export function getBinColorDomain(scaleType, bins, [lowerIdx, upperIdx]) {
  switch (scaleType) {
    case SCALE_TYPES.quantize:
      return [bins[lowerIdx].value, bins[upperIdx].value];

    case SCALE_TYPES.quantile:
      return bins.slice(lowerIdx, upperIdx + 1).map(d => d.value);

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
