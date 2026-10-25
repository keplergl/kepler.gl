// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {ZarrDatasetMetadata, ZarrDimensionInfo} from '@kepler.gl/constants';

const MAX_PREVIEW_ITEMS = 20;
const COORDINATE_SAMPLE_SIZE = 3;

function previewDimension(dimension: ZarrDimensionInfo) {
  const values = dimension.values;
  return {
    name: dimension.name,
    size: dimension.size,
    kind: dimension.kind,
    units: dimension.units,
    calendar: dimension.calendar,
    coordinates: values
      ? {
          count: values.length,
          first: values.slice(0, COORDINATE_SAMPLE_SIZE),
          ...(values.length > COORDINATE_SAMPLE_SIZE
            ? {
                last: values.slice(
                  -Math.min(COORDINATE_SAMPLE_SIZE, values.length - COORDINATE_SAMPLE_SIZE)
                )
              }
            : {})
        }
      : undefined
  };
}

/** Keep the preview small without serializing or modifying the full coordinate arrays. */
export function getZarrMetadataPreview(metadata: ZarrDatasetMetadata) {
  const variable =
    metadata.variables.find(item => item.path === metadata.variable) ?? metadata.variables[0];
  const dimensions = variable?.nonSpatialDims ?? metadata.nonSpatialDims;
  return {
    url: metadata.url,
    variableCount: metadata.variables.length,
    variables: metadata.variables.slice(0, MAX_PREVIEW_ITEMS).map(item => item.displayName),
    omittedVariables: Math.max(0, metadata.variables.length - MAX_PREVIEW_ITEMS),
    selectedVariable: variable
      ? {
          path: variable.path,
          name: variable.displayName,
          dtype: variable.dtype,
          shape: variable.shape,
          chunks: variable.chunks,
          dataRange: variable.dataRange,
          nodataValue: variable.nodataValue
        }
      : undefined,
    dimensionCount: dimensions.length,
    dimensions: dimensions.slice(0, MAX_PREVIEW_ITEMS).map(previewDimension),
    omittedDimensions: Math.max(0, dimensions.length - MAX_PREVIEW_ITEMS),
    timeDimension: variable?.timeDimension?.name,
    crs: metadata.crs,
    resolutionLevelCount: metadata.levels.length,
    levels: metadata.levels.slice(0, MAX_PREVIEW_ITEMS),
    omittedLevels: Math.max(0, metadata.levels.length - MAX_PREVIEW_ITEMS)
  };
}
