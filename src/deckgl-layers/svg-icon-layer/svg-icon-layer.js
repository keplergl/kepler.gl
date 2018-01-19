import {CompositeLayer} from 'deck.gl';
import ScatterplotIconLayer from './scatterplot-icon-layer';

// default icon geometry is a square
const DEFAULT_ICON_GEOMETRY = [
  1,
  1,
  0,
  1,
  -1,
  0,
  -1,
  -1,
  0,
  -1,
  -1,
  0,
  -1,
  1,
  0,
  1,
  1,
  0
];
const defaultProps = {
  getIconGeometry: iconId => DEFAULT_ICON_GEOMETRY,
  getIcon: d => d.icon
};

export default class SvgIconLayer extends CompositeLayer {
  // Must be defined
  initializeState() {
    this.state = {
      data: {}
    };
  }

  updateState({changeFlags}) {
    if (changeFlags.dataChanged) {
      this._extractSublayers();
    }
  }

  _extractSublayers() {
    const {data, getIconGeometry, getIcon} = this.props;

    const iconLayers = data.reduce((accu, d) => {
      const iconId = getIcon(d);

      if (iconId in accu) {
        accu[iconId].data.push(d);
      } else {
        const geometry = getIconGeometry(iconId) || DEFAULT_ICON_GEOMETRY;
        accu[iconId] = {
          id: iconId,
          geometry,
          data: [d]
        };
      }

      return accu;
    }, {});

    this.setState({
      data: Object.values(iconLayers)
    });
  }

  renderLayers() {
    const layerId = this.props.id;

    const layers =
      this.state.data &&
      this.state.data.length &&
      this.state.data.map(
        ({id, data, geometry}) =>
          new ScatterplotIconLayer({
            ...this.props,
            id: `${layerId}-${id}`,
            data,
            iconGeometry: geometry
          })
      );

    return layers && layers.length > 0 ? layers : null;
  }
}

SvgIconLayer.layerName = 'SvgIconLayer';
SvgIconLayer.defaultProps = defaultProps;
