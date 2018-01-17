import {ScatterplotLayer} from 'deck.gl';
import AggregationLayer from '../aggregation-layer';
import DeckGLClusterLayer from 'deckgl-layers/cluster-layer/cluster-layer';
import {CHANNEL_SCALES} from 'constants/default-settings';

export const clusterVisConfigs = {
  opacity: 'opacity',
  clusterRadius: 'clusterRadius',
  colorRange: 'colorRange',
  radiusRange: 'clusterRadiusRange',
  'hi-precision': 'hi-precision',
  colorAggregation: 'aggregation',
  sizeAggregation: 'aggregation'
};

export default class ClusterLayer extends AggregationLayer {
  constructor(props) {
    super(props);

    this.registerVisConfig(clusterVisConfigs);
  }

  get type() {
    return 'cluster';
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
        defaultMeasure: 'Point Count',
        channelScaleType: CHANNEL_SCALES.colorAggr
      }
    }
  }

  renderLayer({data, idx, layerInteraction, objectHovered, mapState, interaction, layerCallbacks}) {
    const {visConfig} = this.config;

    return [
      new DeckGLClusterLayer({
        ...data,
        ...layerInteraction,
        id: this.id,
        idx,
        radiusScale: 1,
        radiusRange: visConfig.radiusRange,
        clusterRadius: visConfig.clusterRadius,
        colorRange: this.getColorRange(visConfig.colorRange),
        colorScale: this.config.colorScale,
        pickable: true,
        opacity: visConfig.opacity,
        fp64: visConfig['hi-precision'],
        lightSettings: this.meta.lightSettings,

        // call back from layer after calculate clusters
        onSetColorDomain: layerCallbacks.onSetLayerDomain
      }),

      ...this.isLayerHovered(objectHovered) ?
        [new ScatterplotLayer({
          id: `${this.id}-hovered`,
          data: [objectHovered.object],
          getColor: d => this.config.highlightColor
        })] : []
    ];
  }
}
