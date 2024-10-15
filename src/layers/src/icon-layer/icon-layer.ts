// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import window from 'global/window';
import {BrushingExtension} from '@deck.gl/extensions';
import GL from '@luma.gl/constants';

import {SvgIconLayer} from '@kepler.gl/deckgl-layers';
import IconLayerIcon from './icon-layer-icon';
import {ICON_FIELDS, KEPLER_UNFOLDED_BUCKET, ColorRange} from '@kepler.gl/constants';
import IconInfoModalFactory from './icon-info-modal';
import Layer, {LayerBaseConfig, LayerBaseConfigPartial} from '../base-layer';
import {assignPointPairToLayerColumn} from '../layer-utils';
import {isTest} from '@kepler.gl/utils';
import {getTextOffsetByRadius, formatTextLabelData} from '../layer-text-label';
import {default as KeplerTable} from '@kepler.gl/table';
import {DataContainerInterface} from '@kepler.gl/utils';
import {
  VisConfigBoolean,
  VisConfigColorRange,
  VisConfigNumber,
  VisConfigRange,
  Merge,
  LayerColumn
} from '@kepler.gl/types';

export type IconLayerColumnsConfig = {
  lat: LayerColumn;
  lng: LayerColumn;
  altitude: LayerColumn;
  icon: LayerColumn;
};

type IconGeometry = object | null;

export type IconLayerVisConfigSettings = {
  radius: VisConfigNumber;
  fixedRadius: VisConfigBoolean;
  opacity: VisConfigNumber;
  colorRange: VisConfigColorRange;
  radiusRange: VisConfigRange;
};

export type IconLayerVisConfig = {
  radius: number;
  fixedRadius: boolean;
  opacity: number;
  colorRange: ColorRange;
  radiusRange: [number, number];
  billboard: boolean;
};

export type IconLayerConfig = Merge<
  LayerBaseConfig,
  {columns: IconLayerColumnsConfig; visConfig: IconLayerVisConfig}
>;

export type IconLayerData = {index: number; icon: string};

const brushingExtension = new BrushingExtension();

export const SVG_ICON_URL = `${KEPLER_UNFOLDED_BUCKET}/icons/svg-icons.json`;

export const iconPosAccessor =
  ({lat, lng, altitude}: IconLayerColumnsConfig) =>
  (dc: DataContainerInterface) =>
  d =>
    [
      dc.valueAt(d.index, lng.fieldIdx),
      dc.valueAt(d.index, lat.fieldIdx),
      altitude?.fieldIdx > -1 ? dc.valueAt(d.index, altitude.fieldIdx) : 0
    ];

export const iconAccessor =
  ({icon}: IconLayerColumnsConfig) =>
  (dc: DataContainerInterface) =>
  d =>
    dc.valueAt(d.index, icon.fieldIdx);

export const iconRequiredColumns: ['lat', 'lng', 'icon'] = ['lat', 'lng', 'icon'];
export const iconOptionalColumns: ['altitude'] = ['altitude'];

export const pointVisConfigs: {
  radius: 'radius';
  fixedRadius: 'fixedRadius';
  opacity: 'opacity';
  colorRange: 'colorRange';
  radiusRange: 'radiusRange';
  billboard: 'billboard';
} = {
  radius: 'radius',
  fixedRadius: 'fixedRadius',
  opacity: 'opacity',
  colorRange: 'colorRange',
  radiusRange: 'radiusRange',
  billboard: 'billboard'
};

function flatterIconPositions(icon) {
  // had to flip y, since @luma modal has changed
  return icon.mesh.cells.reduce((prev, cell) => {
    cell.forEach(p => {
      prev.push(
        ...[icon.mesh.positions[p][0], -icon.mesh.positions[p][1], icon.mesh.positions[p][2]]
      );
    });
    return prev;
  }, []);
}

export default class IconLayer extends Layer {
  getIconAccessor: (dataContainer: DataContainerInterface) => (d: any) => any;
  _layerInfoModal: () => JSX.Element;
  iconGeometry: IconGeometry;

  declare visConfigSettings: IconLayerVisConfigSettings;
  declare config: IconLayerConfig;

  constructor(
    props: {
      id?: string;
      iconGeometry?: IconGeometry;
      svgIcons?: any[];
    } & LayerBaseConfigPartial
  ) {
    super(props);

    this.registerVisConfig(pointVisConfigs);
    this.getPositionAccessor = (dataContainer: DataContainerInterface) =>
      iconPosAccessor(this.config.columns)(dataContainer);
    this.getIconAccessor = dataContainer => iconAccessor(this.config.columns)(dataContainer);

    this._layerInfoModal = IconInfoModalFactory(props.svgIcons);
    this.iconGeometry = props.iconGeometry || null;

    if (isTest()) {
      return;
    }
    if (props.svgIcons) {
      // if svg icons are passed in then bypass fetching of remote svg icons
      this.setSvgIcons(props.svgIcons);
    } else {
      // prepare layer info modal and fetch remote svg icons
      this.getSvgIcons();
    }
  }

  get svgIconUrl() {
    return SVG_ICON_URL;
  }

  get type(): 'icon' {
    return 'icon';
  }

  get requiredLayerColumns() {
    return iconRequiredColumns;
  }

  get optionalColumns() {
    return iconOptionalColumns;
  }

  get columnPairs() {
    return this.defaultPointColumnPairs;
  }

  get layerIcon() {
    return IconLayerIcon;
  }

  get visualChannels() {
    return {
      color: {
        ...super.visualChannels.color,
        accessor: 'getFillColor',
        defaultValue: config => config.color
      },
      size: {
        ...super.visualChannels.size,
        property: 'radius',
        range: 'radiusRange',
        channelScaleType: 'radius',
        accessor: 'getRadius',
        defaultValue: 1
      }
    };
  }

  get layerInfoModal() {
    return {
      id: 'iconInfo',
      template: this._layerInfoModal,
      modalProps: {
        title: 'modal.iconInfo.title'
      }
    };
  }

  getSvgIcons() {
    const fetchConfig = {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache'
    };

    if (window.fetch && this.svgIconUrl) {
      window
        .fetch(this.svgIconUrl, fetchConfig)
        .then(response => response.json())
        .then((parsed: {svgIcons?: any[]} = {}) => {
          this.setSvgIcons(parsed.svgIcons);
        });
    }
  }

  setSvgIcons(svgIcons: any[] = []) {
    this.iconGeometry = svgIcons.reduce(
      (accu, curr) => ({
        ...accu,
        [curr.id]: flatterIconPositions(curr)
      }),
      {}
    );

    this._layerInfoModal = IconInfoModalFactory(svgIcons);
  }

  static findDefaultLayerProps({fieldPairs = [], fields = []}: KeplerTable) {
    const notFound = {props: []};
    if (!fieldPairs.length || !fields.length) {
      return notFound;
    }

    const iconFields = fields.filter(({name}) =>
      name
        .replace(/[_,.]+/g, ' ')
        .trim()
        .split(' ')
        .some(seg => ICON_FIELDS.icon.some(t => t.includes(seg)))
    );

    if (!iconFields.length) {
      return notFound;
    }

    // create icon layers for first point pair
    const ptPair = fieldPairs[0];
    const columns = assignPointPairToLayerColumn(ptPair, true);

    const props = iconFields.map(iconField => ({
      label: iconField.name.replace(/[_,.]+/g, ' ').trim(),
      columns: {
        ...columns,
        icon: {
          value: iconField.name,
          fieldIdx: iconField.fieldIdx
        }
      },
      isVisible: true
    }));

    return {props};
  }

  getFilteredItemCount() {
    // use total
    if (Object.keys(this.filteredItemCount).length) {
      return Object.values(this.filteredItemCount).reduce(
        (total, curr) => (Number.isFinite(curr) ? total + curr : total),
        0
      );
    }

    return null;
  }

  calculateDataAttribute({dataContainer, filteredIndex}: KeplerTable, getPosition) {
    const getIcon = this.getIconAccessor(dataContainer);
    const data: IconLayerData[] = [];

    for (let i = 0; i < filteredIndex.length; i++) {
      const index = filteredIndex[i];
      const rowIndex = {index};
      const pos = getPosition(rowIndex);
      const icon = getIcon(rowIndex);

      // if doesn't have point lat or lng, do not add the point
      // deck.gl can't handle position = null
      if (pos.every(Number.isFinite) && typeof icon === 'string') {
        data.push({
          index,
          icon
        });
      }
    }

    return data;
  }

  formatLayerData(datasets, oldLayerData) {
    if (this.config.dataId === null) {
      return {};
    }
    const {textLabel} = this.config;
    const {gpuFilter, dataContainer} = datasets[this.config.dataId];

    const getPosition = this.getPositionAccessor(dataContainer);

    const {data, triggerChanged} = this.updateData(datasets, oldLayerData);

    // get all distinct characters in the text labels
    const textLabels = formatTextLabelData({
      textLabel,
      triggerChanged,
      oldLayerData,
      data,
      dataContainer
    });

    const accessors = this.getAttributeAccessors({dataContainer});

    return {
      data,
      getPosition,
      getFilterValue: gpuFilter.filterValueAccessor(dataContainer)(),
      textLabels,
      ...accessors
    };
  }

  updateLayerMeta(dataContainer, getPosition) {
    const bounds = this.getPointsBounds(dataContainer, getPosition);
    this.updateMeta({bounds});
  }

  renderLayer(opts) {
    const {data, gpuFilter, objectHovered, mapState, interactionConfig} = opts;

    const radiusScale = this.getRadiusScaleByZoom(mapState);

    const layerProps = {
      radiusScale,
      billboard: this.config.visConfig.billboard,
      ...(this.config.visConfig.fixedRadius ? {} : {radiusMaxPixels: 500})
    };

    const updateTriggers = {
      getPosition: this.config.columns,
      getFilterValue: gpuFilter.filterValueUpdateTriggers,
      ...this.getVisualChannelUpdateTriggers()
    };

    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);
    const brushingProps = this.getBrushingExtensionProps(interactionConfig);
    const getPixelOffset = getTextOffsetByRadius(radiusScale, data.getRadius, mapState);
    const extensions = [...defaultLayerProps.extensions, brushingExtension];

    // shared Props between layer and label layer
    const sharedProps = {
      getFilterValue: data.getFilterValue,
      extensions,
      filterRange: defaultLayerProps.filterRange,
      ...brushingProps
    };

    const labelLayers = [
      ...this.renderTextLabelLayer(
        {
          getPosition: data.getPosition,
          sharedProps,
          getPixelOffset,
          updateTriggers
        },
        opts
      )
    ];
    const hoveredObject = this.hasHoveredObject(objectHovered);

    const parameters = {
      // icons will be flat on the map when the altitude column is not used
      depthTest: this.config.columns.altitude?.fieldIdx > -1,
      cullFace: GL.FRONT
    };

    return !this.iconGeometry
      ? []
      : [
          new SvgIconLayer({
            ...defaultLayerProps,
            ...brushingProps,
            ...layerProps,
            ...data,
            parameters,
            getIconGeometry: id => this.iconGeometry?.[id],

            // update triggers
            updateTriggers,
            extensions
          }),

          // hover layer
          ...(hoveredObject
            ? [
                // @ts-expect-error SvgIconLayerProps needs getIcon Field
                new SvgIconLayer({
                  ...this.getDefaultHoverLayerProps(),
                  ...layerProps,
                  visible: defaultLayerProps.visible,
                  data: [hoveredObject],
                  parameters,
                  getPosition: data.getPosition,
                  getRadius: data.getRadius,
                  getFillColor: this.config.highlightColor,
                  getIconGeometry: id => this.iconGeometry?.[id]
                })
              ]
            : []),

          // text label layer
          ...labelLayers
        ];
  }
}
