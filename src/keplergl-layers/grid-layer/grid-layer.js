import {GeoJsonLayer} from 'deck.gl';

import AggregationLayer from '../aggregation-layer';
import EnhancedGridLayer from '../../deckgl-layers/grid-layer/enhanced-grid-layer';
import {pointToPolygonGeo} from './grid-utils';

export const gridVisConfigs = {
  opacity: 'opacity',
  worldUnitSize: 'worldUnitSize',
  colorRange: 'colorRange',
  coverage: 'coverage',
  sizeRange: 'elevationRange',
  percentile: 'percentile',
  elevationPercentile: 'percentile',
  elevationScale: 'elevationScale',
  'hi-precision': 'hi-precision',
  colorAggregation: 'aggregation',
  sizeAggregation: 'aggregation',
  enable3d: 'enable3d'
};

export default class GridLayer extends AggregationLayer {
  constructor(props) {
    super(props);

    this.registerVisConfig(gridVisConfigs);
  }

  get type() {
    return 'grid';
  }

  formatLayerData(_, allData, filteredIndex, oldLayerData, opt = {}) {
    const formattedData = super.formatLayerData(
      _,
      allData,
      filteredIndex,
      oldLayerData,
      opt
    );

    const {getPosition, data} = formattedData;

    // TODO: fix this in deck.gl layer
    const cleaned = data.filter(d => {
      const pos = getPosition(d);
      return pos.every(Number.isFinite);
    });

    // All data processing is done in deck.gl layer
    return {
      ...formattedData,
      data: cleaned
    };
  }

  renderLayer({
    data,
    idx,
    layerInteraction,
    objectHovered,
    mapState,
    interaction,
    layerCallbacks
  }) {
    const zoomFactor = this.getZoomFactor(mapState.zoom);
    const eleZoomFactor = this.getElevationZoomFactor(mapState.zoom);
    const {visConfig} = this.config;
    const cellSize = visConfig.worldUnitSize * 1000;

    return [
      new EnhancedGridLayer({
        ...data,
        ...layerInteraction,
        id: this.id,
        idx,
        cellSize,
        coverage: visConfig.coverage,

        // color
        colorRange: this.getColorRange(visConfig.colorRange),
        colorScale: this.config.colorScale,
        opacity: visConfig.opacity,
        upperPercentile: visConfig.percentile[1],
        lowerPercentile: visConfig.percentile[0],

        // elevation
        extruded: visConfig.enable3d,
        elevationScale: visConfig.elevationScale * eleZoomFactor,
        elevationLowerPercentile: visConfig.elevationPercentile[0],
        elevationUpperPercentile: visConfig.elevationPercentile[1],

        // render
        fp64: visConfig['hi-precision'],
        pickable: true,
        lightSettings: this.meta && this.meta.lightSettings,

        // callbacks
        onSetColorDomain: layerCallbacks.onSetLayerDomain
      }),

      ...(this.isLayerHovered(objectHovered) && !visConfig.enable3d
        ? [
            new GeoJsonLayer({
              id: `${this.id}-hovered`,
              data: [
                pointToPolygonGeo({
                  object: objectHovered.object,
                  cellSize,
                  coverage: visConfig.coverage,
                  properties: {lineColor: this.config.highlightColor},
                  mapState
                })
              ],
              lineWidthScale: 8 * zoomFactor
            })
          ]
        : [])
    ];
  }
}
