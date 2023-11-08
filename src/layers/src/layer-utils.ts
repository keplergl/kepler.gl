// Copyright (c) 2023 Uber Technologies, Inc.
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

import {FieldPair} from '@kepler.gl/types';
import {getBinaryGeometriesFromArrow, parseGeometryFromArrow} from '@loaders.gl/arrow';

export function assignPointPairToLayerColumn(pair: FieldPair, hasAlt: boolean) {
  const {lat, lng, alt} = pair.pair;
  if (!hasAlt) {
    return {lat, lng};
  }

  const defaultAltColumn = {value: null, fieldIdx: -1, optional: true};

  return {
    lat,
    lng,
    altitude: alt ? {...defaultAltColumn, ...alt} : defaultAltColumn
  };
}

export function calculateDataAttributeFromArrow({
  dataContainer,
  filteredIndex,
  oldFilteredIndex,
  binaryFeatures
}) {
  // TODO: filter arrow table using predicate
  // filteredIndex.map(i => this.dataToFeature[i]).filter(d => d);
  // filter arrow table by values and make a partial copy of the raw table could be expensive
  // so we will use filteredIndex to create an attribute e.g. filtered (bool) for deck.gl layer
  const newFilteredIndex = oldFilteredIndex
    ? oldFilteredIndex
    : new Uint8ClampedArray(dataContainer.numRows());
  newFilteredIndex.fill(0);
  for (let i = 0; i < filteredIndex.length; ++i) {
    newFilteredIndex[filteredIndex[i]] = 1;
  }

  // this.filteredIndexTrigger = filteredIndex;
  return binaryFeatures;
}

export function getGeojsonLayerMetaFromArrow(dataContainer, getFeature, getColumn, getField) {
  const geoColumn = getColumn(dataContainer);
  const arrowField = getField(dataContainer);

  const encoding = arrowField?.metadata?.get('ARROW:extension:name');
  // create binary data from arrow data for GeoJsonLayer
  const {binaryGeometries, featureTypes, bounds} = getBinaryGeometriesFromArrow(
    geoColumn,
    encoding
  );

  // since there is no feature.properties.radius, we set fixedRadius to false
  const fixedRadius = false;

  return {
    dataToFeature: binaryGeometries,
    featureTypes,
    bounds,
    fixedRadius
  };
}

export function isLayerHoveredFromArrow(objectInfo, layerId) {
  // there could be multiple deck.gl layers created from multiple chunks in arrow table
  // the objectInfo.layer id should be `${this.id}-${i}`
  if (objectInfo?.picked) {
    const deckLayerId = objectInfo?.layer?.props?.id;
    return deckLayerId.startsWith(layerId);
  }
  return false;
}

export function getHoveredObjectFromArrow(
  objectInfo,
  dataContainer,
  layerId,
  columnAccessor,
  fieldAccessor
) {
  // hover object returns the index of the object in the data array
  // NOTE: this could be done in Deck.gl getPickingInfo(params) and binaryToGeojson()
  if (isLayerHoveredFromArrow(objectInfo, layerId) && objectInfo.index >= 0 && dataContainer) {
    const col = columnAccessor(dataContainer);
    const rawGeometry = col?.get(objectInfo.index);

    const field = fieldAccessor(dataContainer);
    const encoding = field?.metadata?.get('ARROW:extension:name');

    const hoveredFeature = parseGeometryFromArrow({
      encoding,
      data: rawGeometry
    });

    const properties = dataContainer.rowAsArray(objectInfo.index).reduce((prev, cur, i) => {
      const fieldName = dataContainer?.getField?.(i).name;
      if (fieldName !== field.name) {
        prev[fieldName] = cur;
      }
      return prev;
    }, {});

    return {
      ...hoveredFeature,
      properties: {
        ...properties,
        index: objectInfo.index
      }
    };
  }
  return null;
}
