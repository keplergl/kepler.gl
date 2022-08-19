// Copyright (c) 2022 Uber Technologies, Inc.
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
import {Bounds} from '@kepler.gl/types';
import {Layer} from '@kepler.gl/layers';
import {DataContainerInterface} from 'reducers/table-utils/data-container-interface';
import {timeToUnixMilli} from '@kepler.gl/utils';

const MAX_LATITUDE = 90;
const MIN_LATITUDE = -90;
const MAX_LONGITUDE = 180;
const MIN_LONGITUDE = -180;

/**
 * return center of map from given points
 * @param layers
 * @returns coordinates of map center, empty if not found
 */
export function findMapBounds(layers: Layer[]): Bounds | null {
  // find bounds in formatted layerData
  // take ALL layers into account when finding map bounds
  const availableLayerBounds: Bounds | [] = layers.reduce((res, l) => {
    // @ts-expect-error
    if (l.meta && l.meta.bounds) {
      // @ts-expect-error
      res.push(l.meta.bounds);
    }
    return res;
  }, []);
  // return null if no layer is available
  if (availableLayerBounds.length === 0) {
    return null;
  }
  // merge bounds in each layer
  const newBounds = (availableLayerBounds as Bounds).reduce(
    (res, b) => {
      return [
        Math.min(res[0], b[0]),
        Math.min(res[1], b[1]),
        Math.max(res[2], b[2]),
        Math.max(res[3], b[3])
      ];
    },
    [MAX_LONGITUDE, MAX_LATITUDE, MIN_LONGITUDE, MIN_LATITUDE]
  );
  // @ts-expect-error
  return newBounds;
}

export function maybeToDate(
  isTime: boolean,
  fieldIdx: number,
  format: string,
  dc: DataContainerInterface,
  d: {index: number}
) {
  if (isTime) {
    return timeToUnixMilli(dc.valueAt(d.index, fieldIdx), format);
  }

  return dc.valueAt(d.index, fieldIdx);
}
