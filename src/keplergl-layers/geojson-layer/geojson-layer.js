import memoize from 'lodash.memoize';

import Layer from '../base-layer';
import {GeoJsonLayer as DeckGLGeoJsonLayer} from 'deck.gl';
import {hexToRgb} from 'utils/color-utils';
import {
  getGeojsonDataMaps,
  getGeojsonBounds,
  featureToDeckGlGeoType
} from './geojson-utils';

export const pointVisConfigs = {
  opacity: 'opacity',
  thickness: 'thickness',
  colorRange: 'colorRange',
  radius: 'radius',

  sizeRange: 'strokeWidthRange',
  radiusRange: 'radiusRange',
  heightRange: 'elevationRange',
  elevationScale: 'elevationScale',

  'hi-precision': 'hi-precision',
  stroked: 'stroked',
  filled: 'filled',
  enable3d: 'enable3d',
  wireframe: 'wireframe'
};

export const geoJsonRequiredColumns = ['geojson'];
export const featureAccessor = ({geojson}) => d => d[geojson.fieldIdx];
export const featureResolver = ({geojson}) => geojson.fieldIdx;

export default class GeoJsonLayer extends Layer {
  constructor(props) {
    super(props);
    this.config = {
      ...this.config,

      // add height visual channel
      heightField: null,
      heightDomain: [0, 1],
      heightScale: 'linear',

      // add radius visual channel
      radiusField: null,
      radiusDomain: [0, 1],
      radiusScale: 'linear'
    };

    this.dataToFeature = {};

    this.registerVisConfig(pointVisConfigs);
    this.getFeature = memoize(featureAccessor, featureResolver);
  }

  get type() {
    return 'geojson';
  }

  get requiredLayerColumns() {
    return geoJsonRequiredColumns;
  }

  get visualChannels() {
    return {
      ...super.visualChannels,
      size: {
        ...super.visualChannels.size,
        property: 'stroke',
        condition: config => config.visConfig.stroked
      },
      height: {
        property: 'height',
        field: 'heightField',
        scale: 'heightScale',
        domain: 'heightDomain',
        range: 'heightRange',
        key: 'height',
        channelScaleType: 'size',
        condition: config => config.visConfig.enable3d
      },
      radius: {
        property: 'radius',
        field: 'radiusField',
        scale: 'radiusScale',
        domain: 'radiusDomain',
        range: 'radiusRange',
        key: 'radius',
        channelScaleType: 'radius'
      }
    };
  }

  getHoverData(object, allData) {
    // index of allData is saved to feature.properties
    return allData[object.properties.index];
  }

  formatLayerData(_, allData, filteredIndex, oldLayerData, opt = {}) {
    const {
      colorScale,
      colorField,
      colorDomain,
      color,
      sizeScale,
      sizeDomain,
      sizeField,
      heightField,
      heightDomain,
      heightScale,
      radiusField,
      radiusDomain,
      radiusScale,
      visConfig,
      columns
    } = this.config;

    const {
      enable3d,
      stroked,
      colorRange,
      heightRange,
      sizeRange,
      radiusRange
    } = visConfig;

    const getFeature = this.getFeature(columns);

    // geojson feature are object, if doesn't exists
    // create it and save to layer
    if (!oldLayerData || oldLayerData.getFeature !== getFeature) {
      this.updateLayerMeta(allData, getFeature);
    }

    let geojsonData;

    if (
      oldLayerData &&
      oldLayerData.data &&
      opt.sameData &&
      oldLayerData.getFeature === getFeature
    ) {
      // no need to create a new array of data
      // use updateTriggers to selectively re-calculate attributes
      geojsonData = oldLayerData.data;
    } else {
      // filteredIndex is a reference of index in allData which can map to feature
      geojsonData = filteredIndex
        .map(i => this.dataToFeature[i])
        .filter(d => d);
    }

    const cScale =
      colorField &&
      this.getVisChannelScale(
        colorScale,
        colorDomain,
        colorRange.colors.map(hexToRgb)
      );

    // calculate stroke scale - if stroked = true
    const sScale =
      sizeField &&
      stroked &&
      this.getVisChannelScale(sizeScale, sizeDomain, sizeRange);

    // calculate elevation scale - if extruded = true
    const eScale =
      heightField &&
      enable3d &&
      this.getVisChannelScale(heightScale, heightDomain, heightRange);

    // point radius
    const rScale =
      radiusField &&
      this.getVisChannelScale(radiusScale, radiusDomain, radiusRange);

    return {
      data: geojsonData,
      getFeature,
      getFillColor: d =>
        cScale
          ? this.getEncodedChannelValue(
              cScale,
              allData[d.properties.index],
              colorField
            )
          : d.properties.fillColor || color,
      getLineColor: d =>
        cScale
          ? this.getEncodedChannelValue(
              cScale,
              allData[d.properties.index],
              colorField
            )
          : d.properties.lineColor || color,
      getLineWidth: d =>
        sScale
          ? this.getEncodedChannelValue(
              sScale,
              allData[d.properties.index],
              sizeField,
              0
            )
          : d.properties.lineWidth || 1,
      getElevation: d =>
        eScale
          ? this.getEncodedChannelValue(
              eScale,
              allData[d.properties.index],
              heightField,
              0
            )
          : d.properties.elevation || 500,
      getRadius: d =>
        rScale
          ? this.getEncodedChannelValue(
              rScale,
              allData[d.properties.index],
              radiusField,
              0
            )
          : d.properties.radius || 1
    };
  }

  updateLayerMeta(allData, getFeature) {
    this.dataToFeature = getGeojsonDataMaps(allData, getFeature);

    // calculate layer meta
    const allFeatures = Object.values(this.dataToFeature);

    // get bounds from features
    const bounds = getGeojsonBounds(allFeatures);

    // get lightSettings from points
    const lightSettings = this.getLightSettingsFromBounds(bounds);

    // if any of the feature has properties.hi-precision set to be true
    const fp64 = Boolean(
      allFeatures.find(d => d && d.properties && d.properties['hi-precision'])
    );
    const fixedRadius = Boolean(
      allFeatures.find(d => d && d.properties && d.properties.radius)
    );

    // keep a record of what type of geometry the collection has
    const featureTypes = allFeatures.reduce((accu, f) => {
      const geoType = featureToDeckGlGeoType(
        f && f.geometry && f.geometry.type
      );

      if (geoType) {
        accu[geoType] = true;
      }
      return accu;
    }, {});

    this.updateMeta({bounds, lightSettings, fp64, fixedRadius, featureTypes});
  }

  renderLayer({
    data,
    idx,
    layerInteraction,
    objectHovered,
    mapState,
    interactionConfig
  }) {
    const {fp64, lightSettings, fixedRadius} = this.meta;
    const radiusScale = this.getRadiusScaleByZoom(mapState.zoom, fixedRadius);
    const zoomFactor = this.getZoomFactor(mapState.zoom);

    const layerProps = {
      // multiplier applied just so it being consistent with previously saved maps
      lineWidthScale: this.config.visConfig.thickness * zoomFactor * 8,
      lineWidthMinPixels: 1,
      elevationScale: this.config.visConfig.elevationScale,
      pointRadiusScale: radiusScale,
      fp64: fp64 || this.config.visConfig['hi-precision'],
      lineMiterLimit: 10 * zoomFactor,
      rounded: true
    };

    const updateTriggers = {
      getElevation: {
        heightField: this.config.heightField,
        heightScale: this.config.heightScale,
        heightRange: this.config.visConfig.heightRange
      },
      getFillColor: {
        color: this.config.color,
        colorField: this.config.colorField,
        colorRange: this.config.visConfig.colorRange,
        colorScale: this.config.colorScale
      },
      getLineColor: {
        color: this.config.color,
        colorField: this.config.colorField,
        colorRange: this.config.visConfig.colorRange,
        colorScale: this.config.colorScale
      },
      getLineWidth: {
        sizeField: this.config.sizeField,
        sizeRange: this.config.visConfig.sizeRange
      },
      getRadius: {
        radiusField: this.config.radiusField,
        radiusRange: this.config.visConfig.radiusRange
      }
    };

    return [
      new DeckGLGeoJsonLayer({
        ...layerProps,
        ...layerInteraction,
        id: this.id,
        idx,
        data: data.data,
        getFillColor: data.getFillColor,
        getLineColor: data.getLineColor,
        getLineWidth: data.getLineWidth,
        getRadius: data.getRadius,
        getElevation: data.getElevation,
        pickable: true,
        opacity: this.config.visConfig.opacity,
        stroked: this.config.visConfig.stroked,
        filled: this.config.visConfig.filled,
        extruded: this.config.visConfig.enable3d,
        wireframe: this.config.visConfig.wireframe,
        lightSettings,
        updateTriggers
      }),
      ...(this.isLayerHovered(objectHovered)
        ? [
            new DeckGLGeoJsonLayer({
              ...layerProps,
              id: `${this.id}-hovered`,
              data: [
                {
                  ...objectHovered.object,
                  properties: {
                    ...objectHovered.object.properties,
                    lineColor: this.config.highlightColor,
                    fillColor: this.config.highlightColor
                  },
                  getLineWidth: data.getLineWidth,
                  getRadius: data.getRadius,
                  getElevation: data.getElevation
                }
              ],
              updateTriggers,
              stroked: true,
              pickable: false,
              filled: false
            })
          ]
        : [])
    ];
  }
}
