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

import pick from 'lodash.pick';
import {VERSIONS} from './versions';
import {isValidFilterValue} from 'utils/filter-utils';

import Schema from './schema';

/**
 * V0 Schema
 */

export const dimensionPropsV0 = ['name', 'type'];

// in v0 geojson there is only sizeField

// in v1 geojson
// stroke base on -> sizeField
// height based on -> heightField
// radius based on -> radiusField
// here we make our wiredst guess on which channel sizeField belongs to
function geojsonSizeFieldV0ToV1(config) {
  const defaultRaiuds = 10;
  const defaultRadiusRange = [0, 50];

  // if extruded, sizeField is most likely used for height
  if (config.visConfig.extruded) {
    return 'heightField';
  }

  // if show stroke enabled, sizeField is most likely used for stroke
  if (config.visConfig.stroked) {
    return 'sizeField';
  }

  // if radius changed, or radius Range Changed, sizeField is most likely used for radius
  // this is the most unreliable guess, that's why we put it in the end
  if (
    config.visConfig.radius !== defaultRaiuds ||
    config.visConfig.radiusRange.some((d, i) => d !== defaultRadiusRange[i])
  ) {
    return 'radiusField';
  }

  return 'sizeField';
}

// convert v0 to v1 layer config
class DimensionFieldSchemaV0 extends Schema {
  version = VERSIONS.v0;
  save(field, config) {
    // should not be called anymore
    return {
      [this.key]:
        field !== null
          ? this.savePropertiesOrApplySchema(field)[this.key]
          : null
    };
  }

  load(field, config, accumulated) {
    let fieldName = this.key;
    if (config.type === 'geojson' && this.key === 'sizeField' && field) {
      fieldName = geojsonSizeFieldV0ToV1(config);
    }
    // fold into visualChannels to be load by VisualChannelSchemaV1
    return {
      visualChannels: {
        ...(accumulated.visualChannels || {}),
        [fieldName]: field
      }
    };
  }
}

class DimensionScaleSchemaV0 extends Schema {
  version = VERSIONS.v0;
  save(scale) {
    return {[this.key]: scale};
  }
  load(scale, config, accumulated) {
    // fold into visualChannels to be load by VisualChannelSchemaV1
    if (this.key === 'sizeScale' && config.type === 'geojson') {
      // sizeScale now split into radiusScale, heightScale
      // no user customization, just use default
      return {};
    }

    return {
      visualChannels: {
        ...(accumulated.visualChannels || {}),
        [this.key]: scale
      }
    };
  }
}

// used to convert v0 to v1 layer config
class LayerConfigSchemaV0 extends Schema {
  version = VERSIONS.v0;
  load(saved, layer, accumulated) {
    // fold v0 layer property into config.key
    return {
      config: {
        ...(accumulated.config || {}),
        [this.key]: saved
      }
    };
  }
}

// used to convert v0 to v1 layer columns
// only return column value for each column
class LayerColumnsSchemaV0 extends Schema {
  version = VERSIONS.v0;
  load(saved, layer, accumulated) {
    // fold v0 layer property into config.key, flatten columns
    return {
      config: {
        ...(accumulated.config || {}),
        columns: Object.keys(saved).reduce(
          (accu, key) => ({
            ...accu,
            [key]: saved[key].value
          }),
          {}
        )
      }
    };
  }
}

// used to convert v0 to v1 layer config.visConfig
class LayerConfigToVisConfigSchemaV0 extends Schema {
  version = VERSIONS.v0;
  load(saved, layer, accumulated) {
    // fold v0 layer property into config.visConfig
    const accumulatedConfig = accumulated.config || {};
    return {
      config: {
        ...accumulatedConfig,
        visConfig: {
          ...(accumulatedConfig.visConfig || {}),
          [this.key]: saved
        }
      }
    };
  }
}

class LayerVisConfigSchemaV0 extends Schema {
  version = VERSIONS.v0;
  key = 'visConfig';

  load(visConfig, config, accumulator) {
    const rename = {
      geojson: {
        extruded: 'enable3d',
        elevationRange: 'heightRange'
      }
    };

    if (config.type in rename) {
      const propToRename = rename[config.type];
      return {
        config: {
          ...(accumulator.config || {}),
          visConfig: Object.keys(visConfig).reduce(
            (accu, key) => ({
              ...accu,
              ...(propToRename[key]
                ? {[propToRename[key]]: visConfig[key]}
                : {[key]: visConfig[key]})
            }),
            {}
          )
        }
      };
    }

    return {
      config: {
        ...(accumulator.config || {}),
        visConfig
      }
    };
  }
}

class LayerConfigSchemaDeleteV0 extends Schema {
  version = VERSIONS.v0;
  load(value) {
    return {};
  }
}

/**
 * V0 -> V1 Changes
 * - layer is now a class
 * - config saved in a config object
 * - id, type, isAggregated is outside layer.config
 * - visualChannels is outside config, it defines available visual channel and
 *   property names for field, scale, domain and range of each visual chanel.
 * - enable3d, colorAggregation and sizeAggregation are moved into visConfig
 * - GeojsonLayer - added height, radius specific properties
 */

export const layerPropsV0 = {
  id: null,
  type: null,

  // move into layer.config
  dataId: new LayerConfigSchemaV0({key: 'dataId'}),
  label: new LayerConfigSchemaV0({key: 'label'}),
  color: new LayerConfigSchemaV0({key: 'color'}),
  isVisible: new LayerConfigSchemaV0({key: 'isVisible'}),

  // convert visConfig
  visConfig: new LayerVisConfigSchemaV0({key: 'visConfig'}),

  // move into layer.config
  // flatten
  columns: new LayerColumnsSchemaV0(),

  // save into visualChannels
  colorField: new DimensionFieldSchemaV0({
    properties: dimensionPropsV0,
    key: 'colorField'
  }),
  colorScale: new DimensionScaleSchemaV0({
    key: 'colorScale'
  }),
  sizeField: new DimensionFieldSchemaV0({
    properties: dimensionPropsV0,
    key: 'sizeField'
  }),
  sizeScale: new DimensionScaleSchemaV0({
    key: 'sizeScale'
  }),

  // move into config.visConfig
  enable3d: new LayerConfigToVisConfigSchemaV0({key: 'enable3d'}),
  colorAggregation: new LayerConfigToVisConfigSchemaV0({
    key: 'colorAggregation'
  }),
  sizeAggregation: new LayerConfigToVisConfigSchemaV0({key: 'sizeAggregation'}),

  // delete
  isAggregated: new LayerConfigSchemaDeleteV0()
};

/**
 * V1 Schema
 */
class ColumnSchemaV1 extends Schema {
  save(columns, state) {
    // starting from v1, only save column value
    // fieldIdx will be calculated during merge
    return {
      [this.key]: Object.keys(columns).reduce(
        (accu, ckey) => ({
          ...accu,
          [ckey]: columns[ckey].value
        }),
        {}
      )
    };
  }

  load(columns) {
    return {columns};
  }
}

class TextLabelSchemaV1 extends Schema {
  save(textLabel) {
    return {
      [this.key]: {
        ...textLabel,
        field: textLabel.field ? pick(textLabel.field, ['name', 'type']) : null
      }
    }
  }

  load(textLabel) {
    return {textLabel};
  }
}

/**
 * V1: save [field]: {name, type}, [scale]: '' for each channel
 */
class VisualChannelSchemaV1 extends Schema {
  save(visualChannels, layer) {
    // only save field and scale of each channel
    return {
      [this.key]: Object.keys(visualChannels).reduce(
        //  save channel to null if didn't select any field
        (accu, key) => ({
          ...accu,
          [visualChannels[key].field]: layer.config[visualChannels[key].field]
            ? pick(layer.config[visualChannels[key].field], ['name', 'type'])
            : null,
          [visualChannels[key].scale]: layer.config[visualChannels[key].scale]
        }),
        {}
      )
    };
  }
  load(vc, layer, accumulator) {
    // fold channels into config
    return {
      ...accumulator,
      config: {
        ...(accumulator.config || {}),
        ...vc
      }
    };
  }
}

export const layerPropsV1 = {
  id: null,
  type: null,
  config: new Schema({
    version: VERSIONS.v1,
    key: 'config',
    properties: {
      dataId: null,
      label: null,
      color: null,
      columns: new ColumnSchemaV1({
        version: VERSIONS.v1,
        key: 'columns'
      }),
      isVisible: null,
      visConfig: null,
      textLabel: new TextLabelSchemaV1({
        version: VERSIONS.v1,
        key: 'textLabel'
      })
    }
  }),
  visualChannels: new VisualChannelSchemaV1({
    version: VERSIONS.v1,
    key: 'visualChannels'
  })
};

class LayerSchemaV0 extends Schema {
  key = 'layers';

  save(layers, visState) {
    return {
      [this.key]: visState.layerOrder.reduce((saved, index) => {
        // save layers according to their rendering order
        const layer = layers[index];
        if (layer.isValidToSave()) {
          saved.push(this.savePropertiesOrApplySchema(layer).layers);
        }
        return saved;
      }, [])
    };
  }

  load(layers, visState) {
    return {
      [this.key]: layers.map(
        layer => this.loadPropertiesOrApplySchema(layer, layers).layers
      )
    };
  }
}

class FilterSchemaV0 extends Schema {
  key = 'filters';
  save(filters) {
    return {
      filters: filters
        .filter(isValidFilterValue)
        .map(
          filter =>
            this.savePropertiesOrApplySchema(filter, this.properties).filters
        )
    };
  }
  load(filters) {
    return {filters};
  }
}

const interactionPropsV0 = ['tooltip', 'brush'];

class InteractionSchemaV0 extends Schema {
  key = 'interactionConfig';

  save(interactionConfig) {
    return {
      [this.key]: this.properties.reduce(
        (accu, key) => ({
          ...accu,
          ...(interactionConfig[key].enabled
            ? {[key]: interactionConfig[key].config}
            : {})
        }),
        {}
      )
    };
  }
  load(interactionConfig) {
    // convert v0 -> v1
    // return enabled: false if disabled,
    return {
      [this.key]: this.properties.reduce(
        (accu, key) => ({
          ...accu,
          ...{
            [key]: {
              ...(interactionConfig[key] || {}),
              enabled: Boolean(interactionConfig[key])
            }
          }
        }),
        {}
      )
    };
  }
}

class InteractionSchemaV1 extends Schema {
  key = 'interactionConfig';

  save(interactionConfig) {
    // save config even if disabled,
    return {
      [this.key]: this.properties.reduce(
        (accu, key) => ({
          ...accu,
          [key]: {
            ...interactionConfig[key].config,
            enabled: interactionConfig[key].enabled
          }
        }),
        {}
      )
    };
  }
  load(interactionConfig) {
    return {[this.key]: interactionConfig};
  }
}

export const filterPropsV0 = {
  dataId: null,
  id: null,
  name: null,
  type: null,
  value: null,
  enlarged: null
};

export class DimensionFieldSchema extends Schema {
  save(field) {
    return {
      [this.key]: field
        ? this.savePropertiesOrApplySchema(field)[this.key]
        : null
    };
  }

  load(field) {
    return {[this.key]: field};
  }
}

export const filterPropsV1 = {
  ...filterPropsV0,
  plotType: null,
  yAxis: new DimensionFieldSchema({
    version: VERSIONS.v1,
    key: 'yAxis',
    properties: {
      name: null,
      type: null
    }
  })
};

export const propertiesV0 = {
  filters: new FilterSchemaV0({
    version: VERSIONS.v0,
    properties: filterPropsV0
  }),
  layers: new LayerSchemaV0({
    version: VERSIONS.v0,
    properties: layerPropsV0
  }),
  interactionConfig: new InteractionSchemaV0({
    version: VERSIONS.v0,
    properties: interactionPropsV0
  }),
  layerBlending: null
};

export const propertiesV1 = {
  filters: new FilterSchemaV0({
    version: VERSIONS.v1,
    properties: filterPropsV1
  }),
  layers: new LayerSchemaV0({
    version: VERSIONS.v1,
    properties: layerPropsV1
  }),
  interactionConfig: new InteractionSchemaV1({
    version: VERSIONS.v1,
    properties: interactionPropsV0
  }),
  layerBlending: null,
  splitMaps: null
};

export const visStateSchemaV0 = new Schema({
  version: VERSIONS.v0,
  properties: propertiesV0,
  key: 'visState'
});

export const visStateSchemaV1 = new Schema({
  version: VERSIONS.v1,
  properties: propertiesV1,
  key: 'visState'
});

export const visStateSchema = {
  [VERSIONS.v0]: {
    save: toSave => visStateSchemaV0.save(toSave),
    load: toLoad =>
      visStateSchemaV1.load(visStateSchemaV0.load(toLoad).visState)
  },
  [VERSIONS.v1]: visStateSchemaV1
};

// test load v0
export default visStateSchema;
