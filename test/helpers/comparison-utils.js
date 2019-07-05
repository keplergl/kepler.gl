// Copyright (c) 2019 Uber Technologies, Inc.
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

import {FILTER_TYPES} from 'utils/filter-utils';
export function cmpFilters(
  expectedFilter,
  actualFilter,
  opt = {},
  idx = ''
) {
  expect(typeof actualFilter).toEqual(typeof expectedFilter);

  if (Array.isArray(expectedFilter) && Array.isArray(actualFilter)) {
    expect(actualFilter.length).toEqual(expectedFilter.length);

    expectedFilter.forEach((f, i) => {
      cmpFilters(expectedFilter[i], actualFilter[i], opt, i);
    });
  } else {
    expect(Object.keys(actualFilter).sort()).toEqual(Object.keys(expectedFilter).sort());

    Object.keys(actualFilter).forEach(key => {
      if (key === 'histogram' || key === 'enlargedHistogram') {
        if (actualFilter.type === FILTER_TYPES.range || FILTER_TYPES.timeRange) {
          expect(actualFilter[key].length).not.toBe(0);
        }
      } else if (key !== 'id' || opt.id) {
        // test everything except id, which is auto generated
        expect(actualFilter[key]).toEqual(expectedFilter[key]);
      }
    });
  }
}

export function cmpLayers(expectedLayer, actualLayer, opt = {}) {
  expect(actualLayer.constructor).toEqual(expectedLayer.constructor);

  // if is array of layers
  if (Array.isArray(expectedLayer) && Array.isArray(actualLayer)) {
    expect(actualLayer.length).toEqual(expectedLayer.length);

    expectedLayer.forEach((_, i) => {
      cmpLayers(expectedLayer[i], actualLayer[i]);
    });
  } else {
    expect(Object.keys(actualLayer.config).sort())
      .toEqual(Object.keys(expectedLayer.config).sort());

    Object.keys(expectedLayer.config).forEach(key => {
      // test everything except color and id, which is auto generated
      // also skip functions
      if (
        (key !== 'id' || opt.id) &&
        (key !== 'color' || opt.color) &&
        typeof expectedLayer.config[key] !== 'function'
      ) {
        expect(actualLayer.config[key]).toEqual(expectedLayer.config[key]);
      }
    });
  }
}

export function cmpSavedLayers(
  expectedLayer,
  actualLayer,
  opt = {},
  idx = ''
) {
  // if is array of layers
  if (Array.isArray(expectedLayer) && Array.isArray(actualLayer)) {
    expect(actualLayer.length).toEqual(expectedLayer.length);

    expectedLayer.forEach((_, i) => {
      cmpSavedLayers(expectedLayer[i], actualLayer[i], opt, i);
    });
  } else {
    expect(Object.keys(actualLayer).sort()).toEqual(Object.keys(expectedLayer).sort());

    expect(actualLayer).toEqual(expectedLayer);

    Object.keys(expectedLayer).forEach(key => {
      expect(actualLayer[key]).toEqual(expectedLayer[key]);

      if (key === 'config') {
        expect(Object.keys(actualLayer.config).sort()).toEqual(Object.keys(expectedLayer.config).sort());

        Object.keys(actualLayer.config).forEach(ck => {
          expect(actualLayer.config[ck]).toEqual(expectedLayer.config[ck]);
        });
      }
    });
  }
}

export function cmpDatasets(t, expectedDatasets, actualDatasets) {
  expect(Object.keys(actualDatasets).sort())
    .toEqual(Object.keys(expectedDatasets).sort());

  Object.keys(actualDatasets).forEach(dataId => {
    cmpDataset(t, expectedDatasets[dataId], actualDatasets[dataId]);
  });
}

export function cmpDataset(t, expectedDataset, actualDataset, opt = {}) {
  expect(Object.keys(actualDataset).sort())
    .toEqual(Object.keys(expectedDataset).sort());

  // test everything except color, which is auto generated
  Object.keys(actualDataset).forEach(key => {
    if (key === 'fields') {
      expect(actualDataset.fields.length)
        .toEqual(expectedDataset.fields.length);

      actualDataset.fields.forEach((actualField, i) => {
        expect(actualField).toEqual(expectedDataset.fields[i]);
      });
    } else if (key !== 'color' || opt.color) {
      expect(actualDataset[key]).toEqual(expectedDataset[key]);
    }
  });
}

export function cmpInteraction(t, expectedInt, actualInt) {
  expect(typeof expectedInt).toBe('object');
  expect(typeof actualInt).toBe('object');

  expect(Object.keys(actualInt).sort())
    .toEqual(Object.keys(expectedInt).sort());

  Object.keys(actualInt).forEach(key => {
    expect(typeof actualInt[key]).toEqual(typeof expectedInt[key]);

    if (typeof actualInt[key] === 'object' && actualInt[key] !== null && !Array.isArray(actualInt[key])) {
      cmpInteraction(expectedInt[key], actualInt[key]);
    } else {
      expect(actualInt[key]).toEqual(expectedInt[key]);
    }
  });
}

export function cmpParsedAppConfigs(
  expectedConfig,
  actualConfig,
  {name} = {}
) {
  expect(actualConfig).toEqual(expectedConfig);

  Object.keys(actualConfig).forEach(key => {
    if (key === 'visState') {
      expect(Object.keys(actualConfig[key]).sort()).toEqual(Object.keys(expectedConfig[key]).sort());
      // for visConfig go through each entry
      cmpParsedAppConfigs(expectedConfig[key], actualConfig[key], {
        name: key
      });
    } else if (key === 'layers') {
      cmpSavedLayers(expectedConfig[key], actualConfig[key], {id: true});
    } else if (key === 'filters') {
      cmpFilters(expectedConfig[key], actualConfig[key], {id: true});
    } else {
      // for each reducer entry
      expect(actualConfig[key]).toEqual(expectedConfig[key]);
    }
  });
}
