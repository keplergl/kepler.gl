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

import {
  DEFAULT_TOOLTIP_FIELDS,
  MAX_DEFAULT_TOOLTIPS,
  ALL_FIELD_TYPES,
  TRIP_POINT_FIELDS
} from 'constants/default-settings';
import {Messages, Crosshairs} from 'components/common/icons/index';

export function getDefaultInteraction() {
  return {
    tooltip: {
      id: 'tooltip',
      enabled: true,
      iconComponent: Messages,
      config: {
        fieldsToShow: {}
      }
    },
    brush: {
      id: 'brush',
      enabled: false,
      iconComponent: Crosshairs,
      config: {
        // size is in km
        size: 0.5
      }
    }
  };
}

export const BRUSH_CONFIG = {
  range: [0, 50]
};

export function findFieldsToShow({fields, id}) {
  // first find default tooltip fields for trips
  const fieldsToShow = DEFAULT_TOOLTIP_FIELDS.reduce((prev, curr) => {
    if (fields.find(({name}) => curr === name)) {
      prev.push(curr);
    }
    return prev;
  }, []);

  return {
    [id]: fieldsToShow.length ? fieldsToShow : autoFindTooltipFields(fields)
  };
}

function autoFindTooltipFields(fields) {
  const ptFields = _mergeFieldPairs(TRIP_POINT_FIELDS);
  // filter out the default fields that contains lat and lng and any geometry
  const fieldsToShow = fields.filter(
    ({name, type}) =>
      name
        .replace(/[_,.]+/g, ' ')
        .trim()
        .split(' ')
        .every(seg => !ptFields.includes(seg)) &&
      type !== ALL_FIELD_TYPES.geojson &&
      type !== 'object'
  );

  return fieldsToShow.slice(0, MAX_DEFAULT_TOOLTIPS).map(d => d.name);
}

function _mergeFieldPairs(pairs) {
  return pairs.reduce((prev, pair) => [...prev, ...pair], []);
}
