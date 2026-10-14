// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const THIRD_PI = Math.PI / 3;

export type AggregationCountLabel = {
  position: [number, number];
  count: number;
};

type ScaledChannel = {
  attribute?: {value?: ArrayLike<number>};
  domain?: [number, number] | null;
  cutoff?: [number, number] | null;
};

type CountLabelLayer = {
  state: {
    aggregator?: {
      binCount: number;
      getBin: (index: number) => {
        id: number[];
        count: number;
        pointIndices?: number[];
      } | null;
      getResultDomain: (channel: number) => [number, number];
    };
    colors?: ScaledChannel;
    elevations?: ScaledChannel;
    radiusCommon?: number;
    hexOriginCommon?: [number, number];
    cellOriginCommon?: [number, number];
    cellSizeCommon?: [number, number];
    aggregatorViewport?: {unprojectFlat?: (xy: number[]) => number[]};
  };
  props: {
    data?: unknown;
    colorDomain?: [number, number] | null;
    elevationDomain?: [number, number] | null;
    _filterData?: (point: any) => boolean;
    renderCountLabels?: (data: AggregationCountLabel[]) => unknown;
  };
};

/**
 * Hide a label when the cell shader would discard the bin (percentile cutoff
 * or a non-finite aggregated value). Thresholds match hexagon-cell-layer and
 * grid-cell-layer: values outside colorDomain.zw / elevationDomain.zw.
 */
export function aggregationBinIsDrawn(
  colorValue: number,
  elevationValue: number,
  colors: ScaledChannel,
  elevations: ScaledChannel,
  colorDomain: [number, number],
  elevationDomain: [number, number]
): boolean {
  return (
    valueInChannel(colorValue, colors, colorDomain) &&
    valueInChannel(elevationValue, elevations, elevationDomain)
  );
}

function valueInChannel(
  value: number,
  scaled: ScaledChannel,
  fallbackDomain: [number, number]
): boolean {
  if (!Number.isFinite(value)) {
    return false;
  }
  const domain = scaled.domain || fallbackDomain;
  if (!domain || !Number.isFinite(domain[0]) || !Number.isFinite(domain[1])) {
    return true;
  }
  const cutoff = scaled.cutoff || [-Infinity, Infinity];
  const low = Math.max(domain[0] - 1, cutoff[0]);
  const high = Math.min(domain[1] + 1, cutoff[1]);
  return value >= low && value <= high;
}

/** Same centroid deck.gl's hexagon cell shader uses, before the common-space origin. */
export function getHexbinCentroid(id: [number, number], radius: number): [number, number] {
  const distX = 2 * Math.sin(THIRD_PI);
  const distY = 1.5;
  return [(id[0] + (id[1] & 1) / 2) * radius * distX, id[1] * radius * distY];
}

export function collectHexagonCountLabels(layer: CountLabelLayer): AggregationCountLabel[] {
  return collectBinCountLabels(layer, (col, row) => {
    const {radiusCommon, hexOriginCommon, aggregatorViewport} = layer.state;
    if (!radiusCommon || !aggregatorViewport?.unprojectFlat) {
      return null;
    }
    const centroid = getHexbinCentroid([col, row], radiusCommon);
    const lngLat = aggregatorViewport.unprojectFlat([
      centroid[0] + (hexOriginCommon?.[0] ?? 0),
      centroid[1] + (hexOriginCommon?.[1] ?? 0)
    ]);
    return finiteLngLat(lngLat);
  });
}

export function collectGridCountLabels(layer: CountLabelLayer): AggregationCountLabel[] {
  return collectBinCountLabels(layer, (col, row) => {
    const {cellOriginCommon, cellSizeCommon, aggregatorViewport} = layer.state;
    if (!cellOriginCommon || !cellSizeCommon || !aggregatorViewport?.unprojectFlat) {
      return null;
    }
    const lngLat = aggregatorViewport.unprojectFlat([
      (col + 0.5) * cellSizeCommon[0] + cellOriginCommon[0],
      (row + 0.5) * cellSizeCommon[1] + cellOriginCommon[1]
    ]);
    return finiteLngLat(lngLat);
  });
}

export function appendAggregationCountLabels(
  layer: CountLabelLayer,
  layerName: string,
  rendered: unknown
): unknown {
  const renderCountLabels = layer.props?.renderCountLabels;
  if (typeof renderCountLabels !== 'function') {
    return rendered;
  }
  const labels =
    layerName === 'GridLayer'
      ? collectGridCountLabels(layer)
      : layerName === 'HexagonLayer'
      ? collectHexagonCountLabels(layer)
      : [];
  const textLayers = renderCountLabels(labels) || [];
  if (!Array.isArray(textLayers) || textLayers.length === 0) {
    return rendered;
  }
  const cells = rendered == null ? [] : Array.isArray(rendered) ? rendered : [rendered];
  return [...cells, ...textLayers];
}

function collectBinCountLabels(
  layer: CountLabelLayer,
  getPosition: (col: number, row: number) => [number, number] | null
): AggregationCountLabel[] {
  const {aggregator, colors, elevations} = layer.state;
  if (!aggregator || aggregator.binCount <= 0 || !colors?.attribute || !elevations?.attribute) {
    return [];
  }
  const colorValues = colors.attribute.value;
  const elevationValues = elevations.attribute.value;
  if (!colorValues || !elevationValues) {
    return [];
  }
  const colorDomain = colors.domain || layer.props.colorDomain || aggregator.getResultDomain(0);
  const elevationDomain =
    elevations.domain || layer.props.elevationDomain || aggregator.getResultDomain(1);

  const labels: AggregationCountLabel[] = [];
  for (let i = 0; i < aggregator.binCount; i++) {
    const bin = aggregator.getBin(i);
    if (!bin || bin.id.length < 2) {
      continue;
    }
    if (
      !aggregationBinIsDrawn(
        colorValues[i],
        elevationValues[i],
        colors,
        elevations,
        colorDomain,
        elevationDomain
      )
    ) {
      continue;
    }
    const count = filteredBinCount(layer, bin);
    if (count <= 0) {
      continue;
    }
    const position = getPosition(bin.id[0], bin.id[1]);
    if (!position) {
      continue;
    }
    labels.push({position, count});
  }
  return labels;
}

function filteredBinCount(
  layer: CountLabelLayer,
  bin: {count: number; pointIndices?: number[]}
): number {
  const filterData = layer.props._filterData;
  const data = layer.props.data;
  if (typeof filterData !== 'function' || !bin.pointIndices || !Array.isArray(data)) {
    return bin.count;
  }
  let count = 0;
  for (const index of bin.pointIndices) {
    const point = data[index];
    if (point != null && filterData(point)) {
      count += 1;
    }
  }
  return count;
}

function finiteLngLat(lngLat: number[] | null | undefined): [number, number] | null {
  if (!lngLat || !Number.isFinite(lngLat[0]) || !Number.isFinite(lngLat[1])) {
    return null;
  }
  // Labels stay on the ground. Extruded GeoJSON does the same: the label is
  // placed at the base, and the text layer draws on top of the extrusion.
  return [lngLat[0], lngLat[1]];
}
