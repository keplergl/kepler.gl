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

import {FILTER_TYPES} from 'constants/default-settings';

export function cmpObjectKeys(t, expectedObj, actualObj, name) {
  t.deepEqual(
    Object.keys(actualObj).sort(),
    Object.keys(expectedObj).sort(),
    `${name} should have same keys`
  );
}

export function cmpFilters(t, expectedFilter, actualFilter, opt = {}, idx = '', name = '') {
  t.equal(typeof actualFilter, typeof expectedFilter, `${name}filters should be same type`);
  if (Array.isArray(expectedFilter) && Array.isArray(actualFilter)) {
    t.equal(
      actualFilter.length,
      expectedFilter.length,
      `${name} should have same number of filters`
    );
    expectedFilter.forEach((f, i) => {
      cmpFilters(t, expectedFilter[i], actualFilter[i], opt, i, name);
    });
  } else {
    cmpObjectKeys(
      t,
      expectedFilter,
      actualFilter,
      `idx:${idx} | ${actualFilter.type} filter ${actualFilter.name}`
    );

    Object.keys(actualFilter).forEach(key => {
      if (key === 'histogram' || key === 'enlargedHistogram') {
        if (actualFilter.type === FILTER_TYPES.range || FILTER_TYPES.timeRange) {
          t.ok(actualFilter[key].length, `${name}.filter.${key} should not be empty`);
        }
      } else if (key !== 'id' || opt.id) {
        // test everything except id, which is auto generated
        t.deepEqual(
          actualFilter[key],
          expectedFilter[key],
          `${name}.idx:${idx} |  ${actualFilter.type} filter ${actualFilter.name} ${key} should be correct`
        );
      }
    });
  }
}

export function cmpLayers(t, expectedLayer, actualLayer, opt = {}) {
  t.ok(actualLayer.constructor === expectedLayer.constructor, 'layer should be same class');

  // if is array of layers
  if (Array.isArray(expectedLayer) && Array.isArray(actualLayer)) {
    t.equal(actualLayer.length, expectedLayer.length, 'should have same number of layers');
    expectedLayer.forEach((_, i) => {
      cmpLayers(t, expectedLayer[i], actualLayer[i]);
    });
  } else {
    cmpObjectKeys(t, expectedLayer.config, actualLayer.config, `layer.${actualLayer.id}`);

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

export function cmpSavedLayers(t, expectedLayer, actualLayer, opt = {}, idx = '') {
  // if is array of layers
  if (Array.isArray(expectedLayer) && Array.isArray(actualLayer)) {
    t.equal(actualLayer.length, expectedLayer.length, 'should have same number of layers');
    expectedLayer.forEach((_, i) => {
      cmpSavedLayers(t, expectedLayer[i], actualLayer[i], opt, i);
    });
  } else {
    cmpObjectKeys(t, expectedLayer, actualLayer, `idx:${idx} | layer.${actualLayer.type}`);

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
        cmpObjectKeys(
          t,
          expectedLayer.config,
          actualLayer.config,
          `idx:${idx} | layer.${actualLayer.type}`
        );

        Object.keys(actualLayer.config).forEach(ck => {
          t.deepEqual(
            actualLayer.config[ck],
            expectedLayer.config[ck],
            `idx:${idx} | ${actualLayer.type} layer.config ${ck} should be correct`
          );
        });
      }
    });
  }
}

export function cmpDatasets(t, expectedDatasets, actualDatasets) {
  cmpObjectKeys(t, expectedDatasets, actualDatasets, 'datasets');

  Object.keys(actualDatasets).forEach(dataId => {
    cmpDataset(t, expectedDatasets[dataId], actualDatasets[dataId]);
  });
}

export function cmpDataset(t, expectedDataset, actualDataset, opt = {}) {
  cmpObjectKeys(t, expectedDataset, actualDataset, `dataset:${expectedDataset.id}`);

  // test everything except auto generated color
  Object.keys(actualDataset).forEach(key => {
    if (key === 'fields') {
      t.equal(
        actualDataset.fields.length,
        expectedDataset.fields.length,
        `dataset.${expectedDataset.id}.${key} should have same number of fields`
      );
      actualDataset.fields.forEach((actualField, i) => {
        cmpField(
          t,
          expectedDataset.fields[i],
          actualField,
          `dataset.${expectedDataset.id} fields ${actualField.name}`
        );
      });
    } else if (key === 'gpuFilter') {
      // test gpuFilter props
      cmpGpuFilterProp(t, expectedDataset.gpuFilter, actualDataset.gpuFilter);
    } else if (key === 'filterRecord' || key === 'filterRecordCPU') {
      cmpObjectKeys(
        t,
        expectedDataset[key],
        actualDataset[key],
        `dataset.${expectedDataset.id}.${key}`
      );
      Object.keys(expectedDataset[key]).forEach(item => {
        t.ok(
          Array.isArray(expectedDataset[key][item]),
          `dataset.${expectedDataset.id}[key].${item} should be an array`
        );
        // compare filter name
        t.deepEqual(
          actualDataset[key][item].map(f => f.name),
          expectedDataset[key][item].map(f => f.name),
          `dataset.${expectedDataset.id}.${key}.${item} should contain correct filter`
        );
      });
    } else if (key !== 'color' || opt.color) {
      t.deepEqual(
        actualDataset[key],
        expectedDataset[key],
        `dataset.${expectedDataset.id}.${key} should be correct`
      );
    }
  });
}

export function cmpGpuFilterProp(t, expectedGpuFilter, actualGpuFilter) {
  cmpObjectKeys(t, expectedGpuFilter, actualGpuFilter, 'gpu filter');

  Object.keys(expectedGpuFilter).forEach(key => {
    if (key === 'filterValueAccessor' && expectedGpuFilter.filterValueAccessor.inputs) {
      const {inputs, result} = expectedGpuFilter.filterValueAccessor;
      t.deepEqual(
        actualGpuFilter.filterValueAccessor()(...inputs),
        result,
        'getFilterValue should be correct'
      );
    } else if (
      key === 'filterValueAccessor' &&
      typeof expectedGpuFilter.filterValueAccessor === 'function'
    ) {
      // don't compare filter value accessor
      return;
    } else {
      t.deepEqual(
        actualGpuFilter[key],
        expectedGpuFilter[key],
        `getFilterValue.${key} should be correct`
      );
    }
  });
}

export function cmpInteraction(t, expectedInt, actualInt) {
  cmpObjectKeys(t, expectedInt, actualInt, 'interaction');
  Object.keys(actualInt).forEach(key => {
    t.equal(
      typeof actualInt[key],
      typeof expectedInt[key],
      `interaction.${key} should be same type`
    );

    if (
      typeof actualInt[key] === 'object' &&
      actualInt[key] !== null &&
      !Array.isArray(actualInt[key])
    ) {
      cmpInteraction(t, expectedInt[key], actualInt[key]);
    } else {
      t.deepEqual(actualInt[key], expectedInt[key], `interaction.${key} should be correct`);
    }
  });
}

export function cmpParsedAppConfigs(t, expectedConfig, actualConfig, {name} = {}) {
  t.deepEqual(actualConfig, expectedConfig, `${name} should be expected`);

  Object.keys(actualConfig).forEach(key => {
    if (key === 'visState') {
      cmpObjectKeys(t, expectedConfig.visState, actualConfig.visState, 'visState');
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
      t.deepEqual(actualConfig[key], expectedConfig[key], `${key} should be correct`);
    }
  });
}

export function cmpField(t, expected, actual, name) {
  cmpObjectKeys(t, expected, actual, name);

  Object.keys(expected).forEach(k => {
    if (k === 'filterProps') {
      // compare filterProps
      t.ok(typeof actual[k] === 'object', `${name} should have filterProps`);

      if (actual[k]) {
        cmpObjectKeys(t, expected[k], actual[k], `${name} filterProps`);
        // compare filterProps key
        Object.keys(expected[k]).forEach(key => {
          if (key === 'histogram' || key === 'enlargedHistogram') {
            t.ok(actual[k][key].length, `${name}.filterProps.${key} should not be empty`);
          } else {
            t.deepEqual(
              actual[k][key],
              expected[k][key],
              `${name}.filterProps.${key} should be correct`
            );
          }
        });
      }
    } else {
      t.deepEqual(actual[k], expected[k], `${name}.${k} should be the same`);
    }
  });
}
