// Copyright (c) 2022 Uber Technologies, Inc.
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

import Layer, {
  LayerBaseConfig,
  LayerColorConfig,
  LayerColumn,
  LayerCoverageConfig,
  LayerSizeConfig
} from '../base-layer';
import {findDefaultColorField} from 'utils/dataset-utils';
import {GeoJsonLayer} from '@deck.gl/layers';
import {H3HexagonLayer} from '@deck.gl/geo-layers';
import {EnhancedColumnLayer} from '@kepler.gl/deckgl-layers';
import {getCentroid, idToPolygonGeo, h3IsValid, getHexFields, Centroid} from './h3-utils';
import H3HexagonLayerIcon from './h3-hexagon-layer-icon';
import {CHANNEL_SCALES, HIGHLIGH_COLOR_3D, ColorRange} from '@kepler.gl/constants';

import {createDataContainer} from 'utils/table-utils';
import {
  VisConfigBoolean,
  VisConfigColorRange,
  VisConfigNumber,
  VisConfigRange
} from '../layer-factory';
import {Merge} from '@kepler.gl/types';
import {DataContainerInterface} from '../../utils/table-utils/data-container-interface';
import {KeplerTable} from '../../utils';

export type HexagonIdLayerColumnsConfig = {
  hex_id: LayerColumn;
};

export type HexagonIdLayerVisConfigSettings = {
  opacity: VisConfigNumber;
  colorRange: VisConfigColorRange;
  coverage: VisConfigNumber;
  enable3d: VisConfigBoolean;
  sizeRange: VisConfigRange;
  coverageRange: VisConfigRange;
  elevationScale: VisConfigNumber;
  enableElevationZoomFactor: VisConfigBoolean;
};

export type HexagonIdLayerVisConfig = {
  opacity: number;
  colorRange: ColorRange;
  coverage: number;
  enable3d: boolean;
  sizeRange: [number, number];
  coverageRange: [number, number];
  elevationScale: number;
  enableElevationZoomFactor: boolean;
};

export type HexagonIdLayerVisualChannelConfig = LayerColorConfig &
  LayerSizeConfig &
  LayerCoverageConfig;
export type HexagonIdLayerConfig = Merge<
  LayerBaseConfig,
  {columns: HexagonIdLayerColumnsConfig; visConfig: HexagonIdLayerVisConfig}
> &
  HexagonIdLayerVisualChannelConfig;

export type HexagonIdLayerData = {index: number; id; centroid: Centroid};

const DEFAULT_LINE_SCALE_VALUE = 8;

export const hexIdRequiredColumns: ['hex_id'] = ['hex_id'];
export const hexIdAccessor = ({hex_id}: HexagonIdLayerColumnsConfig) => (
  dc: DataContainerInterface
) => d => dc.valueAt(d.index, hex_id.fieldIdx);

export const defaultElevation = 500;
export const defaultCoverage = 1;

export const HexagonIdVisConfigs: {
  opacity: 'opacity';
  colorRange: 'colorRange';
  coverage: 'coverage';
  enable3d: 'enable3d';
  sizeRange: 'elevationRange';
  coverageRange: 'coverageRange';
  elevationScale: 'elevationScale';
  enableElevationZoomFactor: 'enableElevationZoomFactor';
} = {
  opacity: 'opacity',
  colorRange: 'colorRange',
  coverage: 'coverage',
  enable3d: 'enable3d',
  sizeRange: 'elevationRange',
  coverageRange: 'coverageRange',
  elevationScale: 'elevationScale',
  enableElevationZoomFactor: 'enableElevationZoomFactor'
};

export default class HexagonIdLayer extends Layer {
  dataToFeature: {centroids: Centroid[]};

  declare config: HexagonIdLayerConfig;
  declare visConfigSettings: HexagonIdLayerVisConfigSettings;
  constructor(props) {
    super(props);
    this.dataToFeature = {centroids: []};
    this.registerVisConfig(HexagonIdVisConfigs);
    this.getPositionAccessor = (dataContainer: DataContainerInterface) =>
      hexIdAccessor(this.config.columns)(dataContainer);
  }

  get type(): 'hexagonId' {
    return 'hexagonId';
  }

  get name(): 'H3' {
    return 'H3';
  }

  get requiredLayerColumns() {
    return hexIdRequiredColumns;
  }

  get layerIcon() {
    // use hexagon layer icon for now
    return H3HexagonLayerIcon;
  }

  get visualChannels() {
    const visualChannels = super.visualChannels;
    return {
      color: {
        ...visualChannels.color,
        accessor: 'getFillColor'
      },
      size: {
        ...visualChannels.size,
        property: 'height',
        accessor: 'getElevation',
        nullValue: 0,
        condition: config => config.visConfig.enable3d,
        defaultValue: defaultElevation
      },
      coverage: {
        property: 'coverage',
        field: 'coverageField',
        scale: 'coverageScale',
        domain: 'coverageDomain',
        range: 'coverageRange',
        key: 'coverage',
        channelScaleType: CHANNEL_SCALES.radius,
        accessor: 'getCoverage',
        nullValue: 0,
        defaultValue: defaultCoverage
      }
    };
  }

  setInitialLayerConfig(dataset) {
    const defaultColorField = findDefaultColorField(dataset);

    if (defaultColorField) {
      this.updateLayerConfig<HexagonIdLayerConfig>({
        colorField: defaultColorField
      });
      this.updateLayerVisualChannel(dataset, 'color');
    }

    return this;
  }

  static findDefaultLayerProps({fields = [], dataContainer}: KeplerTable) {
    const hexFields = getHexFields(fields, dataContainer);
    if (!hexFields.length) {
      return {props: []};
    }

    return {
      props: hexFields.map(f => ({
        isVisible: true,
        label: f.displayName || f.name,
        columns: {
          hex_id: {
            value: f.name,
            fieldIdx: fields.findIndex(fid => fid.name === f.name)
          }
        }
      }))
    };
  }

  getDefaultLayerConfig(props = {}) {
    return {
      ...super.getDefaultLayerConfig(props),

      // add height visual channel
      coverageField: null,
      coverageDomain: [0, 1],
      coverageScale: 'linear'
    };
  }

  calculateDataAttribute({dataContainer, filteredIndex}: KeplerTable, getHexId) {
    const data: HexagonIdLayerData[] = [];

    for (let i = 0; i < filteredIndex.length; i++) {
      const index = filteredIndex[i];
      const id = getHexId({index});
      const centroid = this.dataToFeature.centroids[index];

      if (centroid) {
        data.push({
          index,
          id,
          centroid
        });
      }
    }
    return data;
  }

  // TODO: fix complexity
  /* eslint-disable complexity */
  formatLayerData(datasets, oldLayerData, opt = {}) {
    if (this.config.dataId === null) {
      return {};
    }
    const {gpuFilter, dataContainer} = datasets[this.config.dataId];
    const getHexId = this.getPositionAccessor(dataContainer);
    const {data} = this.updateData(datasets, oldLayerData);
    const accessors = this.getAttributeAccessors({dataContainer});

    return {
      data,
      getHexId,
      getFilterValue: gpuFilter.filterValueAccessor(dataContainer)(),
      ...accessors
    };
  }
  /* eslint-enable complexity */

  updateLayerMeta(dataContainer, getHexId) {
    const centroids = dataContainer.map((d, index) => {
      const id = getHexId({index});
      if (!h3IsValid(id)) {
        return null;
      }
      // save a reference of centroids to dataToFeature
      // so we don't have to re calculate it again
      return getCentroid({id});
    }, true);

    const centroidsDataContainer = createDataContainer(centroids);

    const bounds = this.getPointsBounds(centroidsDataContainer, (d, dc) => {
      return [dc.valueAt(d.index, 0), dc.valueAt(d.index, 1)];
    });
    this.dataToFeature = {centroids};
    this.updateMeta({bounds});
  }

  renderLayer(opts) {
    const {data, gpuFilter, objectHovered, mapState} = opts;

    const zoomFactor = this.getZoomFactor(mapState);
    const eleZoomFactor = this.getElevationZoomFactor(mapState);
    const {config} = this;
    const {visConfig} = config;
    const updateTriggers = this.getVisualChannelUpdateTriggers();

    const h3HexagonLayerTriggers = {
      getHexagon: this.config.columns,
      getFillColor: updateTriggers.getFillColor,
      getElevation: updateTriggers.getElevation,
      getFilterValue: gpuFilter.filterValueUpdateTriggers
    };

    const columnLayerTriggers = {
      getCoverage: updateTriggers.getCoverage
    };

    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);
    const hoveredObject = this.hasHoveredObject(objectHovered);

    return [
      new H3HexagonLayer({
        ...defaultLayerProps,
        ...data,
        wrapLongitude: false,

        getHexagon: (x: any) => x.id,

        // coverage
        coverage: config.coverageField ? 1 : visConfig.coverage,

        // highlight
        autoHighlight: visConfig.enable3d,
        highlightColor: HIGHLIGH_COLOR_3D,

        // elevation
        extruded: visConfig.enable3d,
        elevationScale: visConfig.elevationScale * eleZoomFactor,

        // render
        updateTriggers: h3HexagonLayerTriggers,
        _subLayerProps: {
          'hexagon-cell': {
            type: EnhancedColumnLayer,
            getCoverage: data.getCoverage,
            updateTriggers: columnLayerTriggers
          }
        }
      }),
      ...(hoveredObject && !config.sizeField
        ? [
            new GeoJsonLayer({
              ...this.getDefaultHoverLayerProps(),
              data: [idToPolygonGeo(hoveredObject)],
              getLineColor: config.highlightColor,
              lineWidthScale: DEFAULT_LINE_SCALE_VALUE * zoomFactor,
              wrapLongitude: false
            })
          ]
        : [])
    ];
  }
}
