// Copyright (c) 2021 Uber Technologies, Inc.
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
import {LAYER_VIS_CONFIGS} from 'layers/layer-factory';
import Schema from './schema';
import cloneDeep from 'lodash.clonedeep';
import {notNullorUndefined} from 'utils/data-utils';

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
  save(field) {
    // should not be called anymore
    return {
      [this.key]: field !== null ? this.savePropertiesOrApplySchema(field)[this.key] : null
    };
  }

  load(field, parents, accumulated) {
    const [config] = parents.slice(-1);
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
  load(scale, parents, accumulated) {
    const [config] = parents.slice(-1);
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
  load(saved, parents, accumulated) {
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
  load(saved, parents, accumulated) {
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
  load(saved, parents, accumulated) {
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

  load(visConfig, parents, accumulator) {
    const [config] = parents.slice(-1);
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
  hidden: new LayerConfigSchemaV0({key: 'hidden'}),

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
      [this.key]: textLabel.map(tl => ({
        ...tl,
        field: tl.field ? pick(tl.field, ['name', 'type']) : null
      }))
    };
  }

  load(textLabel) {
    return {textLabel: Array.isArray(textLabel) ? textLabel : [textLabel]};
  }
}

const visualChannelModificationV1 = {
  geojson: (vc, parents, accumulator) => {
    const [layer] = parents.slice(-1);
    const isOld = !vc.hasOwnProperty('strokeColorField');
    // make our best guess if this geojson layer contains point
    const isPoint =
      vc.radiusField || layer.config.visConfig.radius !== LAYER_VIS_CONFIGS.radius.defaultValue;

    if (isOld && !isPoint && layer.config.visConfig.stroked) {
      // if stroked is true, copy color config to stroke color config
      return {
        strokeColorField: vc.colorField,
        strokeColorScale: vc.colorScale
      };
    }
    return {};
  }
};
/**
 * V1: save [field]: {name, type}, [scale]: '' for each channel
 */
class VisualChannelSchemaV1 extends Schema {
  save(visualChannels, parents) {
    // only save field and scale of each channel
    const [layer] = parents.slice(-1);
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
  load(vc, parents, accumulator) {
    // fold channels into config
    const [layer] = parents.slice(-1);
    const modified = visualChannelModificationV1[layer.type]
      ? visualChannelModificationV1[layer.type](vc, parents, accumulator)
      : {};

    return {
      ...accumulator,
      config: {
        ...(accumulator.config || {}),
        ...vc,
        ...modified
      }
    };
  }
}
const visConfigModificationV1 = {
  point: (visConfig, parents, accumulated) => {
    const modified = {};
    const [layer] = parents.slice(-2, -1);
    const isOld =
      !visConfig.hasOwnProperty('filled') && !visConfig.strokeColor && !visConfig.strokeColorRange;
    if (isOld) {
      // color color & color range to stroke color
      modified.strokeColor = layer.config.color;
      modified.strokeColorRange = cloneDeep(visConfig.colorRange);
      if (visConfig.outline) {
        // point layer now supports both outline and fill
        // for older schema where filled has not been added to point layer
        // set it to false
        modified.filled = false;
      }
    }

    return modified;
  },
  geojson: (visConfig, parents, accumulated) => {
    // is points?
    const modified = {};
    const [layer] = parents.slice(-2, -1);
    const isOld =
      layer.visualChannels &&
      !layer.visualChannels.hasOwnProperty('strokeColorField') &&
      !visConfig.strokeColor &&
      !visConfig.strokeColorRange;
    // make our best guess if this geojson layer contains point
    const isPoint =
      (layer.visualChannels && layer.visualChannels.radiusField) ||
      (visConfig && visConfig.radius !== LAYER_VIS_CONFIGS.radius.defaultValue);

    if (isOld) {
      // color color & color range to stroke color
      modified.strokeColor = layer.config.color;
      modified.strokeColorRange = cloneDeep(visConfig.colorRange);
      if (isPoint) {
        // if is point, set stroke to false
        modified.filled = true;
        modified.stroked = false;
      }
    }

    return modified;
  }
};

class VisConfigSchemaV1 extends Schema {
  key = 'visConfig';

  load(visConfig, parents, accumulated) {
    const [layer] = parents.slice(-2, -1);
    const modified = visConfigModificationV1[layer.type]
      ? visConfigModificationV1[layer.type](visConfig, parents, accumulated)
      : {};

    return {
      visConfig: {
        ...visConfig,
        ...modified
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
      highlightColor: null,
      columns: new ColumnSchemaV1({
        version: VERSIONS.v1,
        key: 'columns'
      }),
      isVisible: null,
      visConfig: new VisConfigSchemaV1({
        version: VERSIONS.v1
      }),
      hidden: null,
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

export class LayerSchemaV0 extends Schema {
  key = 'layers';

  save(layers, parents) {
    const [visState] = parents.slice(-1);

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

  load(layers) {
    return {
      [this.key]: layers.map(layer => this.loadPropertiesOrApplySchema(layer, layers).layers)
    };
  }
}

export class FilterSchemaV0 extends Schema {
  key = 'filters';
  save(filters) {
    return {
      filters: filters
        .filter(isValidFilterValue)
        .map(filter => this.savePropertiesOrApplySchema(filter).filters)
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
    return Array.isArray(this.properties)
      ? {
          [this.key]: this.properties.reduce(
            (accu, key) => ({
              ...accu,
              ...(interactionConfig[key].enabled ? {[key]: interactionConfig[key].config} : {})
            }),
            {}
          )
        }
      : {};
  }
  load(interactionConfig) {
    // convert v0 -> v1
    // return enabled: false if disabled,
    return Array.isArray(this.properties)
      ? {
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
        }
      : {};
  }
}

const interactionPropsV1 = [...interactionPropsV0, 'geocoder', 'coordinate'];

export class InteractionSchemaV1 extends Schema {
  key = 'interactionConfig';

  save(interactionConfig) {
    // save config even if disabled,
    return Array.isArray(this.properties)
      ? {
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
        }
      : {};
  }
  load(interactionConfig) {
    const modifiedConfig = interactionConfig;
    Object.keys(interactionConfig).forEach(configType => {
      if (configType === 'tooltip') {
        const fieldsToShow = modifiedConfig[configType].fieldsToShow;
        if (!notNullorUndefined(fieldsToShow)) {
          return {[this.key]: modifiedConfig};
        }
        Object.keys(fieldsToShow).forEach(key => {
          fieldsToShow[key] = fieldsToShow[key].map(fieldData => {
            if (!fieldData.name) {
              return {
                name: fieldData,
                format: null
              };
            }
            return fieldData;
          });
        });
      }
      return;
    });
    return {[this.key]: modifiedConfig};
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
      [this.key]: field ? this.savePropertiesOrApplySchema(field)[this.key] : null
    };
  }

  load(field) {
    return {[this.key]: field};
  }
}

export class SplitMapsSchema extends Schema {
  convertLayerSettings(accu, [key, value]) {
    if (typeof value === 'boolean') {
      return {
        ...accu,
        [key]: value
      };
    } else if (value && typeof value === 'object' && value.isAvailable) {
      return {
        ...accu,
        [key]: Boolean(value.isVisible)
      };
    }
    return accu;
  }

  load(splitMaps) {
    // previous splitMaps Schema {layers: {layerId: {isVisible, isAvailable}}}

    if (!Array.isArray(splitMaps) || !splitMaps.length) {
      return {splitMaps: []};
    }

    return {
      splitMaps: splitMaps.map(settings => ({
        ...settings,
        layers: Object.entries(settings.layers || {}).reduce(this.convertLayerSettings, {})
      }))
    };
  }
}

export const filterPropsV1 = {
  ...filterPropsV0,
  plotType: null,
  animationWindow: null,
  yAxis: new DimensionFieldSchema({
    version: VERSIONS.v1,
    key: 'yAxis',
    properties: {
      name: null,
      type: null
    }
  }),

  // polygon filter properties
  layerId: null,
  speed: null
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
    properties: interactionPropsV1
  }),
  layerBlending: null,
  splitMaps: new SplitMapsSchema({
    key: 'splitMaps',
    version: VERSIONS.v1
  }),
  animationConfig: new Schema({
    version: VERSIONS.v1,
    properties: {
      currentTime: null,
      speed: null
    },
    key: 'animationConfig'
  })
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
    load: toLoad => visStateSchemaV1.load(visStateSchemaV0.load(toLoad).visState)
  },
  [VERSIONS.v1]: visStateSchemaV1
};

// test load v0
export default visStateSchema;
