// Copyright (c) 2019 Uber Technologies, Inc.
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

import Layer from '../base-layer';
import window from 'global/window';

import {hexToRgb} from 'utils/color-utils';
import SvgIconLayer from 'deckgl-layers/svg-icon-layer/svg-icon-layer';
import IconLayerIcon from './icon-layer-icon';
import {ICON_FIELDS, CLOUDFRONT} from 'constants/default-settings';
import IconInfoModalFactory from './icon-info-modal';

export const SVG_ICON_URL = `${CLOUDFRONT}/icons/svg-icons.json`;

export const iconPosAccessor = ({lat, lng}) => d => [
  d.data[lng.fieldIdx],
  d.data[lat.fieldIdx]
];
export const iconAccessor = ({icon}) => d => d.data[icon.fieldIdx];

export const iconRequiredColumns = ['lat', 'lng', 'icon'];

export const pointVisConfigs = {
  radius: 'radius',
  fixedRadius: 'fixedRadius',
  opacity: 'opacity',
  colorRange: 'colorRange',
  radiusRange: 'radiusRange'
};

export default class IconLayer extends Layer {
  constructor(props) {
    super(props);

    this.registerVisConfig(pointVisConfigs);
    this.getPositionAccessor = () => iconPosAccessor(this.config.columns);
    this.getIconAccessor = () => iconAccessor(this.config.columns);

    // prepare layer info modal
    this._layerInfoModal = IconInfoModalFactory();
    this.getSvgIcons();
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

  get layerIcon() {
    return IconLayerIcon;
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

  get layerInfoModal() {
    return {
      id: 'iconInfo',
      template: this._layerInfoModal,
      modalProps: {
        title: 'How to draw icons'
      }
    };
  }

  async getSvgIcons() {
    const fetchConfig = {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache'
    };

    if (window.fetch) {
      const response = await window.fetch(SVG_ICON_URL, fetchConfig);
      const {svgIcons} = await response.json();

      this.iconGeometry = svgIcons.reduce(
        (accu, curr) => ({
          ...accu,
          [curr.id]: curr.mesh.cells.reduce((prev, cell) => {
            cell.forEach(p => {
              Array.prototype.push.apply(prev, curr.mesh.positions[p]);
            });
            return prev;
          }, [])
        }),
        {}
      );
      this._layerInfoModal = IconInfoModalFactory(svgIcons);
    }
  }

  static findDefaultLayerProps({fieldPairs, fields}) {
    if (!fieldPairs.length) {
      return [];
    }

    const iconFields = fields.filter(({name}) =>
      name
        .replace(/[_,.]+/g, ' ')
        .trim()
        .split(' ')
        .some(seg => ICON_FIELDS.icon.some(t => t.includes(seg)))
    );

    if (!iconFields.length) {
      return [];
    }

    // create icon layers for first point pair
    const ptPair = fieldPairs[0];

    const props = iconFields.map(iconField => ({
      label: iconField.name.replace(/[_,.]+/g, ' ').trim(),
      columns: {
        lat: ptPair.pair.lat,
        lng: ptPair.pair.lng,
        icon: {
          value: iconField.name,
          fieldIdx: iconField.tableFieldIndex - 1
        }
      },
      isVisible: true
    }));

    return props;
  }

  calculateDataAttribute(allData, filteredIndex, getPosition) {
    const getIcon = this.getIconAccessor();
    const data = [];

    for (let i = 0; i < filteredIndex.length; i++) {
      const index = filteredIndex[i];
      const pos = getPosition({data: allData[index]});
      const icon = getIcon({data: allData[index]});

      // if doesn't have point lat or lng, do not add the point
      // deck.gl can't handle position = null
      if (pos.every(Number.isFinite) && typeof icon === 'string') {
        data.push({
          index,
          icon,
          position: pos,
          data: allData[index]
        });
      }
    }

    return data;
  }

  formatLayerData(datasets, oldLayerData, opt = {}) {
    const {
      colorScale,
      colorDomain,
      colorField,
      color,
      sizeField,
      sizeScale,
      sizeDomain,
      visConfig: {radiusRange, colorRange}
    } = this.config;

    const {filteredIndex, allData, gpuFilter} = datasets[this.config.dataId];
    const {data} = this.updateData(allData, filteredIndex, oldLayerData);

    // point color
    const cScale =
      colorField &&
      this.getVisChannelScale(
        colorScale,
        colorDomain,
        colorRange.colors.map(hexToRgb)
      );

    // point radius
    const rScale =
      sizeField && this.getVisChannelScale(sizeScale, sizeDomain, radiusRange, 0);

    const getRadius = rScale ? d =>
      this.getEncodedChannelValue(rScale, d.data, sizeField) : 1;

    const getFillColor = cScale
      ? d => this.getEncodedChannelValue(cScale, d.data, colorField)
      : color;

    return {
      data,
      getFillColor,
      getFilterValue: gpuFilter.filterValueAccessor(),
      getRadius
    };
  }

  updateLayerMeta(allData, getPosition) {
    const bounds = this.getPointsBounds(allData, d => getPosition({data: d}));
    this.updateMeta({bounds});
  }

  renderLayer({
    data,
    idx,
    gpuFilter,
    objectHovered,
    mapState,
    interactionConfig,
    layerInteraction
  }) {
    const layerProps = {
      radiusMinPixels: 1,
      radiusScale: this.getRadiusScaleByZoom(mapState),
      ...(this.config.visConfig.fixedRadius ? {} : {radiusMaxPixels: 500})
    };

    return !this.iconGeometry ? [] : [
      new SvgIconLayer({
        ...layerProps,
        ...data,
        ...layerInteraction,
        id: this.id,
        idx,
        opacity: this.config.visConfig.opacity,
        getIconGeometry: id => this.iconGeometry[id],

        // picking
        autoHighlight: true,
        highlightColor: this.config.highlightColor,
        pickable: true,

        // parameters
        parameters: {depthTest: mapState.dragRotate},
        filterRange: gpuFilter.filterRange,

        // update triggers
        updateTriggers: {
          getFilterValue: gpuFilter.filterValueUpdateTriggers,
          getRadius: {
            sizeField: this.config.colorField,
            radiusRange: this.config.visConfig.radiusRange,
            sizeScale: this.config.sizeScale
          },
          getFillColor: {
            color: this.config.color,
            colorField: this.config.colorField,
            colorRange: this.config.visConfig.colorRange,
            colorScale: this.config.colorScale
          }
        }
      }),
      ...(this.isLayerHovered(objectHovered)
      ? [
          new SvgIconLayer({
            ...layerProps,
            id: `${this.id}-hovered`,
            data: [objectHovered.object],
            getRadius: data.getRadius,
            getColor: this.config.highlightColor,
            getIconGeometry: id => this.iconGeometry[id],
            pickable: false
          })
        ]
      : [])
    ];
  }
}
