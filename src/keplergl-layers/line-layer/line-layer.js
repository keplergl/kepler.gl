import ArcLayer from '../arc-layer/arc-layer';
import DeckGLLineLayer from '../../deckgl-layers/line-layer/line-layer';

export default class LineLayer extends ArcLayer {

  get type() {
    return 'line';
  }

  renderLayer({data, idx, layerInteraction, objectHovered, mapState, interactionConfig}) {
    const {brush} = interactionConfig;

    const colorUpdateTriggers = {
      color: this.config.color,
      colorField: this.config.colorField,
      colorRange: this.config.visConfig.colorRange,
      colorScale: this.config.colorScale
    };

    return [
      // base layer
      new DeckGLLineLayer({
        ...layerInteraction,
        ...data,
        getColor: data.getSourceColor,
        id: this.id,
        idx,
        brushRadius: brush.config.size * 1000,
        brushSource: true,
        brushTarget: true,
        enableBrushing: brush.enabled,
        fp64: this.config.visConfig['hi-precision'],
        opacity: this.config.visConfig.opacity,
        pickable: true,
        pickedColor: this.config.highlightColor,
        strokeScale: this.config.visConfig.thickness,
        updateTriggers: {
          getStrokeWidth: {
            sizeField: this.config.sizeField,
            sizeRange: this.config.visConfig.sizeRange
          },
          getColor: colorUpdateTriggers
        }
      })
    ];
  }
}
