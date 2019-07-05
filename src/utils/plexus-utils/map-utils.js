import {createSelector} from 'reselect';
import {format} from 'd3-format';

import {
  SCALE_TYPES,
  SCALE_FUNC,
  ALL_FIELD_TYPES
} from 'constants/default-settings';

// Used to get choropleth colors + domains
/**
 * Generates all layers available for the current map
 * TODO: this may be moved into map-container or map-control or even at the reducer level
 * @param layers
 * @param mapLayers
 * @returns {[id, label, isVisible]}
 */
const layerSelector = (layers, mapLayers) => {
  const availableItems = Object.keys(layers).reduce(
    (availableLayers, currentLayerId) => {
      // is available ? if yes add to available list
      const currentLayer = layers[currentLayerId];
      // if maplayers exists we need to make sure currentlayer
      // is contained in mapLayers in order to add onto availableLayers
      // otherwise we add all layers

      const layerConfig = mapLayers
        ? mapLayers[currentLayer.id]
        : currentLayer.config;

      const mustBeAdded =
        mapLayers && mapLayers[currentLayer.id]
          ? mapLayers[currentLayer.id].isAvailable
          : layerConfig.isVisible;

      return mustBeAdded
        ? [
            ...availableLayers,
            {
              id: currentLayer.id,
              name: currentLayer.config.label,
              isVisible:
                mapLayers && mapLayers[currentLayer.id]
                  ? mapLayers[currentLayer.id].isVisible
                  : layerConfig.isVisible,
              layer: currentLayer
            }
          ]
        : availableLayers;
    },
    []
  );

  return availableItems;
};

// Below functions are used to get domains and color ranges (from color legends)
const getTimeLabelFormat = domain => {
  const formatter = getTimeWidgetHintFormatter(domain);
  return val => moment.utc(val).format(formatter);
};

const getNumericLabelFormat = domain => {
  const diff = domain[1] - domain[0];

  if (diff < 10) {
    return format('.2f');
  }

  return format('.1f');
};

const getQuantLabelFormat = (domain, fieldType) => {
  // quant scale can only be assigned to linear Fields: real, timestamp, integer
  return fieldType === ALL_FIELD_TYPES.timestamp
    ? getTimeLabelFormat(domain)
    : !fieldType
    ? defaultFormat
    : getNumericLabelFormat(domain);
};

const getQuantLegends = (scale, labelFormat) => {
  const labels = scale.range().map(d => {
    const invert = scale.invertExtent(d);
    return {
      low: invert[0],
      high: invert[1]
    };
  });

  return {
    data: scale.range(),
    labels
  };
};

const getBgyLayer = (mapLayers, layers) => {
  // get barangay layer to get domains and colors
  // TODO: move somewhere else (where? :( )
  let donutLayer;

  if (layers !== undefined && layers.length > 0) {
    let layerSelector2 = state => layers;
    let mapLayersSelector = state => mapLayers;

    let initialDataSelector = createSelector(
      layerSelector2,
      mapLayersSelector,
      layerSelector
    );

    let pLayers = initialDataSelector(layers, mapLayers);
    if (pLayers) {
      let items = pLayers
        .filter(item => item.isVisible)
        .map(item => item.layer);
      items.map((layer, index) => {
        if (!layer.isValidToSave()) {
          //console.log('ngek');
        } else {
          if (layer.config.label == 'Barangay') {
            donutLayer = layer;
          }
        }
      });
    }
  }

  return donutLayer;
};

export function getLegends(mapLayers, layers) {
  let layer = getBgyLayer(mapLayers, layers);

  if(layer) {
    const scaleType = layer.config.colorScale;
    const domain = layer.config.colorDomain;
    const fieldType = (layer.config.colorField && layer.config.colorField.type) || 'real';
    const range = layer.config.visConfig.colorRange.colors;

    let domainSelector = () => domain;
    let rangeSelector = () => range;
    let labelFormatSelector = () => undefined;
    let scaleTypeSelector = () => scaleType;
    let fieldTypeSelector = () => fieldType;

    // legendsSelector = createSelector(
    //   domainSelector,
    //   rangeSelector,
    //   scaleTypeSelector,
    //   labelFormatSelector,
    //   fieldTypeSelector,
    let legendsSelector = createSelector(
      domainSelector,
      rangeSelector,
      scaleTypeSelector,
      labelFormatSelector,
      fieldTypeSelector,
      (domain, range, scaleType, labelFormat, fieldType) => {
        const scaleFunction = SCALE_FUNC[scaleType];
        // color scale can only be quantize, quantile or ordinal
        const scale = scaleFunction()
          .domain(domain)
          .range(range);
        // console.log(scaleType);
        // console.log('ordinal');
        if (scaleType === SCALE_TYPES.ordinal) {
          return getOrdinalLegends(scale);
        }

        const formatLabel =
          labelFormat || getQuantLabelFormat(scale.domain(), fieldType);

        // console.log('quant');
        return getQuantLegends(scale, formatLabel);
      }
    );
    return legendsSelector(scaleType, domain, fieldType, range);
    
  }
return null;  

}
