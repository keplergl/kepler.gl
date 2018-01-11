import Layer from '../base-layer';
import memoize from 'lodash.memoize';
import {hexToRgb} from '../../utils/color-utils';
import {svgIcons as SvgIcons} from './svg-icons.json';
import SvgIconLayer from '../../deckgl-layers/svg-icon-layer/svg-icon-layer';
import ScatterplotIconLayer from '../../deckgl-layers/svg-icon-layer/scatterplot-icon-layer';

const IconIds = SvgIcons.map(d => d.id);
const SvgIconGeometry = SvgIcons.reduce((accu, curr) => ({
  ...accu,
  [curr.id]: curr.mesh.cells.reduce((prev, cell) => {
    cell.forEach(p => {
      Array.prototype.push.apply(prev, curr.mesh.positions[p]);
    });
    return prev;
  }, [])
}), {});

export const iconPosAccessor = ({lat, lng}) => d => [
  d.data[lng.fieldIdx],
  d.data[lat.fieldIdx]
];

export const iconPosResolver = ({lat, lng}) => `${lat.fieldIdx}-${lng.fieldIdx}`;

export const iconAccessor = ({icon}) => d => d.data[icon.fieldIdx];
export const iconResolver = ({icon}) => icon.fieldIdx;

export const iconRequiredColumns = ['lat', 'lng', 'icon'];

export const pointVisConfigs = {
  radius: 'radius',
  fixedRadius: 'fixedRadius',
  opacity: 'opacity',
  colorRange: 'colorRange',
  radiusRange: 'radiusRange',
  'hi-precision': 'hi-precision'
};

export default class IconLayer extends Layer {
  constructor(props) {
    super(props);

    this.registerVisConfig(pointVisConfigs);
    this.getPosition = memoize(iconPosAccessor, iconPosResolver);
    this.getIcon = memoize(iconAccessor, iconResolver);
  }

  get type() {
    return 'icon';
  }

  get requiredLayerColumns() {
    return iconRequiredColumns;
  }

  get columnPairs() {
    return this.defaultPointColumnPairs;
  }

  get visualChannels() {
    return {
      ...super.visualChannels,
      size: {
        ...super.visualChannels.size,
        range: 'radiusRange',
        property: 'radius',
        channelScaleType: 'radius'
      }
    };
  }

  formatLayerData(_, allData, filteredIndex, oldLayerData, opt = {}) {
    const {colorScale, colorDomain, colorField, color, columns, sizeField, sizeScale, sizeDomain,
      visConfig: {radiusRange, colorRange}} = this.config;

    // point color
    const cScale = colorField && this.getVisChannelScale(
      colorScale,
      colorDomain,
      colorRange.colors.map(hexToRgb)
    );

    // point radius
    const rScale = sizeField && this.getVisChannelScale(
      sizeScale,
      sizeDomain,
      radiusRange
    );

    const getPosition = this.getPosition(columns);
    const getIcon = this.getIcon(columns);

    if (!oldLayerData || oldLayerData.getPosition !== getPosition) {
      this.updateLayerMeta(allData, getPosition);
    }

    let data;
    if (oldLayerData && oldLayerData.data && opt.sameData &&
      oldLayerData.getPosition === getPosition &&
      oldLayerData.getIcon === getIcon) {

      data = oldLayerData.data;
    } else {

      data = filteredIndex.reduce((accu, index) => {
        const pos = getPosition({data: allData[index]});
        const icon = getIcon({data: allData[index]});

        // if doesn't have point lat or lng, do not add the point
        // deck.gl can't handle position = null
        if (!pos.every(Number.isFinite) || !icon || !IconIds.includes(icon)) {
          return accu;
        }

        accu.push({
          index,
          icon,
          data: allData[index]
        });

        return accu;
      }, []);
    }

    const getRadius = d => rScale ?
      this.getEncodedChannelValue(rScale, d.data, sizeField) : 1;

    const getColor = d => cScale ?
      this.getEncodedChannelValue(cScale, d.data, colorField) : color;

    return {
      data,
      getPosition,
      getIcon,
      getColor,
      getRadius
    };
  }

  updateLayerMeta(allData, getPosition) {
    const bounds = this.getPointsBounds(allData, d => getPosition({data: d}));
    this.updateMeta({bounds});
  }

  renderLayer({data, idx, layerInteraction, objectHovered, mapState, interactionConfig}) {

    const layerProps = {
      radiusMinPixels: 1,
      fp64: this.config.visConfig['hi-precision'],
      radiusScale: this.getRadiusScaleByZoom(mapState.zoom),
      ...(this.config.visConfig.fixedRadius ? {} : {radiusMaxPixels: 500})
    };

    return [
      new SvgIconLayer({
        ...layerProps,
        ...layerInteraction,
        ...data,
        id: this.id,
        idx,
        opacity: this.config.visConfig.opacity,
        getIconGeometry: id => SvgIconGeometry[id],
        pickable: true,
        updateTriggers: {
          getRadius: {
            sizeField: this.config.colorField,
            radiusRange: this.config.visConfig.radiusRange,
            sizeScale: this.config.sizeScale
          },
          getColor: {
            color: this.config.color,
            colorField: this.config.colorField,
            colorRange: this.config.visConfig.colorRange,
            colorScale: this.config.colorScale
          }
        }
      }),
      ...this.isLayerHovered(objectHovered) ? [
        new ScatterplotIconLayer({
          ...layerProps,
          id: `${this.id}-hovered`,
          data: [{
            ...objectHovered.object,
            position: data.getPosition(objectHovered.object),
            radius: data.getRadius(objectHovered.object),
            color: this.config.highlightColor
          }],
          iconGeometry: SvgIconGeometry[objectHovered.object.icon],
          pickable: false
      })] : []
    ];
  }
}
