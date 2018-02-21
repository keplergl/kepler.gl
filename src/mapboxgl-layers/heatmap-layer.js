import {createSelector} from 'reselect';
import {CHANNEL_SCALES} from 'constants/default-settings';
import {geojsonFromPoints} from './mapbox-utils';
import {SCALE_FUNC} from "../constants/default-settings";
import {hexToRgb} from 'utils/color-utils';
import MapboxGLLayer from './mapboxgl-layer';

const MAX_ZOOM_LEVEL = 18;
const DEFAULT_OPACITY = .8;

export const heatmapVisConfigs = {
  opacity: 'opacity',
  weight: 'weight',
  colorRange: 'colorRange'
};

const heatmapDensity = (colorDomain, colorScale, visConfig) => {
  const scaleFunction = SCALE_FUNC[colorScale];
  // color scale can only be quantize, quantile or ordinal

  // this is for the quantile case
  const scale = scaleFunction()
    .domain(colorDomain)
    .range(visConfig.colorRange.colors);

  return scale.range().reduce((bands, level) => {
    const invert = scale.invertExtent(level);
    return [
      ...bands,
      invert[0], // first value in the range
      `rgb(${hexToRgb(level).join(',')})` // color
    ]
  }, []);
};

const shouldRebuild = (sameData, sameConfig) => !(sameData && sameConfig);

class HeatmapLayer extends MapboxGLLayer {
  sameDataSelector = ({allData, filteredIndex, oldLayerData, opt = {}}) => {
    return Boolean(oldLayerData &&
      oldLayerData.data && oldLayerData.columns &&
      opt.sameData
    );
  };
  sameConfigSelector = ({oldLayerData, config}) => {
    // columns must use the same filedIdx
    // this is a fast way to compare columns object
    const {
      columns,
      weightField
    } = config;

    if (!oldLayerData) {
      return false;
    }

    const sameColumns = columns === oldLayerData.columns;
    const sameWeightField = weightField === oldLayerData.weightField;
    return sameColumns && sameWeightField;
  };
  rebuildSelector = createSelector(
    this.sameDataSelector,
    this.sameConfigSelector,
    (sameData, sameColumns) => !(sameData && sameColumns)
  );
  datasetSelector = config => config.dataId;
  isVisibleSelector = config => config.isVisible;
  visConfigSelector = config => config.visConfig;
  weightFieldSelector = config => config.weightField;
  colorDomainSelector = config => config.colorDomain;
  colorScaleSelector = config => config.colorScale;

  computeHeatmapConfiguration = createSelector(
    this.datasetSelector,
    this.isVisibleSelector,
    this.visConfigSelector,
    this.weightFieldSelector,
    this.colorDomainSelector,
    this.colorScaleSelector,
    (datasetId, isVisible, visConfig, weightField, colorDomain, colorScale) => {
      // TODO: improve using setPaintProperty
      return {
        type: 'heatmap',
        source: datasetId,
        layout: {
          visibility: isVisible ? 'visible' : 'none'
        },
        maxzoom: MAX_ZOOM_LEVEL,
        paint: {
          'heatmap-weight': weightField ? [
            'interpolate',
            ['linear'],
            ['get', weightField.name],
            0, 0,
            MAX_ZOOM_LEVEL, visConfig.weight
          ] : 1,
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 1,
            MAX_ZOOM_LEVEL, 3
          ],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            ...heatmapDensity(colorDomain, colorScale, visConfig)
          ],
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 2,
            MAX_ZOOM_LEVEL, 20 // radius
          ],
          'heatmap-opacity': visConfig.opacity || DEFAULT_OPACITY
        }
      };
    }
  );

  constructor(props) {
    super(props);
    this.config = {
      ...this.config,
      // add height visual channel
      weightField: null,
      weightDomain: [0, 1],
      weightRange: [0, 1],
      weightScale: 'linear'
    };
    this.registerVisConfig(heatmapVisConfigs);
  }

  get type() {
    return 'heatmap';
  }

  get visualChannels() {
    return {
      ...super.visualChannels,
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

  formatLayerData(_, allData, filteredIndex, oldLayerData, opt = {}) {
    const options = {
      allData,
      filteredIndex,
      oldLayerData,
      opt,
      config: this.config
    };

    const {weightField} = this.config;

    const data = !shouldRebuild(this.sameDataSelector(options), this.sameConfigSelector(options)) ?
      null :
      geojsonFromPoints(
        allData,
        filteredIndex,
        this.config.columns,
        weightField ? [weightField] : []
      );

    const newConfig = this.computeHeatmapConfiguration(this.config);
    newConfig.id = this.id;

    return {
      columns: this.config.columns,
      config: newConfig,
      data,
      weightField
    };
  }
}

export default HeatmapLayer;
