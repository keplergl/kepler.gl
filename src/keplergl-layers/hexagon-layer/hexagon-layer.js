import {GeoJsonLayer} from 'deck.gl';
import AggregationLayer from '../aggregation-layer';
import EnhancedHexagonLayer from 'deckgl-layers/hexagon-layer/enhanced-hexagon-layer';
import {hexagonToPolygonGeo} from './hexagon-utils';

export const hexagonVisConfigs = {
  opacity: 'opacity',
  worldUnitSize: 'worldUnitSize',
  resolution: 'resolution',
  colorRange: 'colorRange',
  coverage: 'coverage',
  sizeRange: 'elevationRange',
  percentile: 'percentile',
  elevationPercentile: 'elevationPercentile',
  elevationScale: 'elevationScale',
  'hi-precision': 'hi-precision',
  colorAggregation: 'aggregation',
  sizeAggregation: 'aggregation',
  enable3d: 'enable3d'
};

export default class HexagonLayer extends AggregationLayer {
  constructor(props) {
    super(props);

    this.registerVisConfig(hexagonVisConfigs);
  }

  get type() {
    return 'hexagon';
  }

  renderLayer({data, idx, layerInteraction, objectHovered, mapState, interaction, layerCallbacks}) {
    const zoomFactor = this.getZoomFactor(mapState.zoom);
    const eleZoomFactor = this.getElevationZoomFactor(mapState.zoom);
    const {visConfig} = this.config;
    const radius = visConfig.worldUnitSize * 1000;

    return [
      new EnhancedHexagonLayer({
        ...data,
        ...layerInteraction,
        id: this.id,
        idx,
        radius,
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
        lightSettings: this.meta.lightSettings,

        // callbacks
        onSetColorDomain: layerCallbacks.onSetLayerDomain
      }),

      ...this.isLayerHovered(objectHovered) && !visConfig.enable3d ?
        [new GeoJsonLayer({
          id: `${this.id}-hovered`,
          data: [
            hexagonToPolygonGeo(
              objectHovered,
              {lineColor: this.config.highlightColor},
              radius * visConfig.coverage,
              mapState
            )
          ],
          lineWidthScale: 8 * zoomFactor
        })] : []
    ];
  }
}
