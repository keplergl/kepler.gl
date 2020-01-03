// Copyright (c) 2020 Uber Technologies, Inc.
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
  t,
  expectedFilter,
  actualFilter,
  opt = {},
  idx = ''
) {
  t.equal(
    typeof actualFilter,
    typeof expectedFilter,
    'filters should be same type'
  );

  if (Array.isArray(expectedFilter) && Array.isArray(actualFilter)) {
    t.equal(
      actualFilter.length,
      expectedFilter.length,
      'should have same number of filters'
    );
    expectedFilter.forEach((f, i) => {
      cmpFilters(t, expectedFilter[i], actualFilter[i], opt, i);
    });
  } else {
    t.deepEqual(
      Object.keys(actualFilter).sort(),
      Object.keys(expectedFilter).sort(),
      `idx:${idx} | ${actualFilter.type} filter should have same keys`
    );

    Object.keys(actualFilter).forEach(key => {
      if (key === 'histogram' || key === 'enlargedHistogram') {
        if (actualFilter.type === FILTER_TYPES.range || FILTER_TYPES.timeRange) {
          t.ok(actualFilter[key].length, `filter.${key} should not be empty`);
        }
      } else if (key !== 'id' || opt.id) {
        // test everything except id, which is auto generated
        t.deepEqual(
          actualFilter[key],
          expectedFilter[key],
          `idx:${idx} |  ${actualFilter.type} filter.${key} should be correct`
        );
      }
    });
  }
}

export function cmpLayers(t, expectedLayer, actualLayer, opt = {}) {
  t.ok(
    actualLayer.constructor === expectedLayer.constructor,
    'layer should be same class'
  );

  // if is array of layers
  if (Array.isArray(expectedLayer) && Array.isArray(actualLayer)) {
    t.equal(
      actualLayer.length,
      expectedLayer.length,
      'should have same number of layers'
    );
    expectedLayer.forEach((_, i) => {
      cmpLayers(t, expectedLayer[i], actualLayer[i]);
    });
  } else {
    t.deepEqual(
      Object.keys(actualLayer.config).sort(),
      Object.keys(expectedLayer.config).sort(),
      `layer.${actualLayer.id} should have same keys`
    );

    Object.keys(expectedLayer.config).forEach(key => {
      // test everything except color and id, which is auto generated
      // also skip functions
      if (
        (key !== 'id' || opt.id) &&
        (key !== 'color' || opt.color) &&
        typeof expectedLayer.config[key] !== 'function'
      ) {
        t.deepEqual(
          actualLayer.config[key],
          expectedLayer.config[key],
          `${actualLayer.type} layer ${key} should be correct`
        );
      }
    });
  }
}

export function cmpSavedLayers(
  t,
  expectedLayer,
  actualLayer,
  opt = {},
  idx = ''
) {
  // if is array of layers
  if (Array.isArray(expectedLayer) && Array.isArray(actualLayer)) {
    t.equal(
      actualLayer.length,
      expectedLayer.length,
      'should have same number of layers'
    );
    expectedLayer.forEach((_, i) => {
      cmpSavedLayers(t, expectedLayer[i], actualLayer[i], opt, i);
    });
  } else {
    t.deepEqual(
      Object.keys(actualLayer).sort(),
      Object.keys(expectedLayer).sort(),
      `idx:${idx} | layer.${actualLayer.type} should have same keys`
    );

    t.deepEqual(
      actualLayer,
      expectedLayer,
      `idx:${idx} | layer.${actualLayer.type} should be saved correctly`
    );

    Object.keys(expectedLayer).forEach(key => {
      t.deepEqual(
        actualLayer[key],
        expectedLayer[key],
        `idx:${idx} | ${actualLayer.type} layer ${key} should be correct`
      );

      if (key === 'config') {
        t.deepEqual(
          Object.keys(actualLayer.config).sort(),
          Object.keys(expectedLayer.config).sort(),
          `idx:${idx} | layer.${actualLayer.type} config should have same keys`
        );

        Object.keys(actualLayer.config).forEach(ck => {
          t.deepEqual(
            actualLayer.config[ck],
            expectedLayer.config[ck],
            `idx:${idx} | ${
              actualLayer.type
            } layer.config ${ck} should be correct`
          );
        });
      }
    });
  }
}

export function cmpDatasets(t, expectedDatasets, actualDatasets) {
  t.deepEqual(
    Object.keys(actualDatasets).sort(),
    Object.keys(expectedDatasets).sort(),
    'datasets should have same keys'
  );

  Object.keys(actualDatasets).forEach(dataId => {
    cmpDataset(t, expectedDatasets[dataId], actualDatasets[dataId]);
  });
}

export function cmpDataset(t, expectedDataset, actualDataset, opt = {}) {
  t.deepEqual(
    Object.keys(actualDataset).sort(),
    Object.keys(expectedDataset).sort(),
    'dataset should have same keys'
  );

  // test everything except color, which is auto generated
  Object.keys(actualDataset).forEach(key => {
    if (key === 'fields') {
      t.equal(
        actualDataset.fields.length,
        expectedDataset.fields.length,
        `dataset.${key} should have same number of fields`
      );
      actualDataset.fields.forEach((actualField, i) => {
        t.deepEqual(
          actualField,
          expectedDataset.fields[i],
          `dataset.${key} fields ${actualField.name} should be the same`
        );
      });
    } else if (key !== 'color' || opt.color) {
      t.deepEqual(
        actualDataset[key],
        expectedDataset[key],
        `dataset.${key} should be correct`
      );
    }
  });
}

export function cmpInteraction(t, expectedInt, actualInt) {
  t.ok(typeof expectedInt === 'object', 'expected interaction should be an object');
  t.ok(typeof actualInt === 'object', 'actual interaction should be an object');

  t.deepEqual(
    Object.keys(actualInt).sort(),
    Object.keys(expectedInt).sort(),
    'interaction should have same keys'
  );

  Object.keys(actualInt).forEach(key => {
    t.equal(
      typeof actualInt[key],
      typeof expectedInt[key],
      `interaction.${key} should be same type`
    );

    if (typeof actualInt[key] === 'object' && actualInt[key] !== null && !Array.isArray(actualInt[key])) {
      cmpInteraction(t, expectedInt[key], actualInt[key]);
    } else {
      t.deepEqual(
        actualInt[key],
        expectedInt[key],
        `interaction.${key} should be correct`
      );
    }
  });
}

export function cmpParsedAppConfigs(
  t,
  expectedConfig,
  actualConfig,
  {name} = {}
) {
  t.deepEqual(actualConfig, expectedConfig, `${name} should be expected`);

  Object.keys(actualConfig).forEach(key => {
    if (key === 'visState') {
      t.deepEqual(
        Object.keys(actualConfig[key]).sort(),
        Object.keys(expectedConfig[key]).sort(),
        'visState should have same keys'
      );
      // for visConfig go through each entry
      cmpParsedAppConfigs(t, expectedConfig[key], actualConfig[key], {
        name: key
      });
    } else if (key === 'layers') {
      cmpSavedLayers(t, expectedConfig[key], actualConfig[key], {id: true});
    } else if (key === 'filters') {
      cmpFilters(t, expectedConfig[key], actualConfig[key], {id: true});
    } else {
      // for each reducer entry
      t.deepEqual(
        actualConfig[key],
        expectedConfig[key],
        `${key} should be correct`
      );
    }
  });
}
