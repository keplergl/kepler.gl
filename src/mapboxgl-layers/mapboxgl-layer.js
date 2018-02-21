import {CHANNEL_SCALES} from 'constants/default-settings';
import Layer, {OVERLAY_TYPE} from "../keplergl-layers/base-layer";

export const mapboxRequiredColumns = ['lat', 'lng'];

class MapboxLayerGL extends Layer {

  get overlayType() {
    return OVERLAY_TYPE.mapboxgl;
  }

  get type() {
    return null;
  }

  get isAggregated() {
    return true;
  }

  get requiredLayerColumns() {
    return mapboxRequiredColumns;
  }

  get columnPairs() {
    return this.defaultPointColumnPairs;
  }

  get noneLayerDataAffectingProps() {
    return [];
  }

  get visualChannels() {
    return {
      color: {
        property: 'color',
        field: 'colorField',
        scale: 'colorScale',
        domain: 'colorDomain',
        range: 'colorRange',
        key: 'color',
        channelScaleType: CHANNEL_SCALES.colorAggr,
        defaultMeasure: 'Point Count'
      },
      weight: {
        property: 'weight',
        field: 'weightField',
        scale: 'weightScale',
        domain: 'weightDomain',
        range: 'weightRange',
        key: 'weight',
        channelScaleType: CHANNEL_SCALES.sizeAggr,
        defaultMeasure: 'Weight'
      }
    };
  }

  // this layer is rendered at mapbox level
  // todo: maybe need to find a better solution for this one
  shouldRenderLayer() {
    return false;
  }

}

export default MapboxLayerGL;
