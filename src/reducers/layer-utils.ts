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

import {GEOCODER_LAYER_ID} from '@kepler.gl/constants';
import {
  Field,
  TooltipField,
  CompareType,
  SplitMapLayers,
  InteractionConfig
} from '@kepler.gl/types';
import {
  FindDefaultLayerPropsReturnValue,
  Layer,
  LayerClassesType,
  OVERLAY_TYPE_CONST
} from '@kepler.gl/layers';

import KeplerTable, {Datasets} from 'reducers/table-utils/kepler-table';

export type LayersToRender = {
  [layerId: string]: boolean;
};

export type AggregationLayerHoverData = {points: any[]; colorValue?: any; elevationValue?: any};

export type LayerHoverProp = {
  data: any[] | AggregationLayerHoverData;
  fields: Field[];
  fieldsToShow: TooltipField[];
  layer: Layer;
  primaryData?: any[] | AggregationLayerHoverData;
  compareType?: CompareType;
};

/**
 * Find default layers from fields
 */
export function findDefaultLayer(dataset: KeplerTable, layerClasses: LayerClassesType): Layer[] {
  if (!dataset) {
    return [];
  }
  const layerProps = (Object.keys(layerClasses) as Array<keyof LayerClassesType>).reduce(
    (previous, lc) => {
      const result: FindDefaultLayerPropsReturnValue =
        typeof layerClasses[lc].findDefaultLayerProps === 'function'
          ? layerClasses[lc].findDefaultLayerProps(dataset, previous)
          : {props: []};

      const props = Array.isArray(result) ? result : result.props || [];
      const foundLayers = result.foundLayers || previous;

      return foundLayers.concat(
        props.map(p => ({
          ...p,
          type: lc,
          dataId: dataset.id
        }))
      );
    },
    [] as LayerClassesType[keyof LayerClassesType][]
  );

  // go through all layerProps to create layer
  return layerProps.map(props => {
    // @ts-expect-error TODO: checking props.type !== null
    const layer = new layerClasses[props.type](props);
    return typeof layer.setInitialLayerConfig === 'function' && dataset.dataContainer
      ? layer.setInitialLayerConfig(dataset)
      : layer;
  });
}

/**
 * calculate layer data based on layer type, col Config,
 * return updated layer if colorDomain, dataMap has changed
 */
export function calculateLayerData(
  layer: Layer,
  state: {datasets: Datasets},
  oldLayerData?: any
): {
  layerData: any;
  layer: Layer;
} {
  const {type} = layer;

  if (!type || !layer.hasAllColumns() || !layer.config.dataId) {
    return {layer, layerData: {}};
  }

  const layerData = layer.formatLayerData(state.datasets, oldLayerData);
  return {layerData, layer};
}

/**
 * Calculate props passed to LayerHoverInfo
 * @type {typeof import('./layer-utils').getLayerHoverProp}
 */
export function getLayerHoverProp({
  interactionConfig,
  hoverInfo,
  layers,
  layersToRender,
  datasets
}: {
  interactionConfig: InteractionConfig;
  hoverInfo: any;
  layers: Layer[];
  layersToRender: LayersToRender;
  datasets: Datasets;
}): LayerHoverProp | null {
  if (interactionConfig.tooltip.enabled && hoverInfo && hoverInfo.picked) {
    // if anything hovered
    const {object, layer: overlay} = hoverInfo;

    // deckgl layer to kepler-gl layer
    const layer = layers[overlay.props.idx];

    if (object && layer && layer.getHoverData && layersToRender[layer.id]) {
      // if layer is visible and have hovered data
      const {
        config: {dataId}
      } = layer;
      if (!dataId) {
        return null;
      }
      const {dataContainer, fields} = datasets[dataId];
      const data = layer.getHoverData(object, dataContainer, fields);
      const fieldsToShow = interactionConfig.tooltip.config.fieldsToShow[dataId];

      return {
        // @ts-expect-error
        data,
        fields,
        fieldsToShow,
        layer
      };
    }
  }

  return null;
}

export function renderDeckGlLayer(props: any, layerCallbacks: {[key: string]: any}, idx: number) {
  const {
    datasets,
    layers,
    layerData,
    hoverInfo,
    clicked,
    mapState,
    interactionConfig,
    animationConfig,
    mapLayers
  } = props;
  const layer = layers[idx];
  const data = layerData[idx];
  const {gpuFilter} = datasets[layer.config.dataId] || {};
  const objectHovered = clicked || hoverInfo;
  const visible = !mapLayers || (mapLayers && mapLayers[layer.id]);
  // Layer is Layer class
  return layer.renderLayer({
    data,
    gpuFilter,
    idx,
    interactionConfig,
    layerCallbacks,
    mapState,
    animationConfig,
    objectHovered,
    visible
  });
}

export function isLayerRenderable(layer: Layer, layerData) {
  return layer.id !== GEOCODER_LAYER_ID && layer.shouldRenderLayer(layerData);
}

export function isLayerVisible(layer, mapLayers) {
  return (
    layer.config.isVisible &&
    // if layer.id is not in mapLayers, don't render it
    (!mapLayers || (mapLayers && mapLayers[layer.id]))
  );
}

// Prepare a dict of layers rendered by the deck.gl
// Note, isVisible: false layer is passed to deck.gl here
// return {[id]: true \ false}
export function prepareLayersForDeck(
  layers: Layer[],
  layerData: any[]
): {
  [key: string]: boolean;
} {
  return layers.reduce(
    (accu, layer, idx) => ({
      ...accu,
      [layer.id]:
        isLayerRenderable(layer, layerData[idx]) && layer.overlayType === OVERLAY_TYPE_CONST.deckgl
    }),
    {}
  );
}

// Prepare a dict of rendered layers rendered in the map
// This includes only the visibile layers for single map view and split map view
// return {[id]: true \ false}
export function prepareLayersToRender(
  layers: Layer[],
  layerData: VisState['layerData'],
  mapLayers?: SplitMapLayers | null
): {
  [key: string]: boolean;
} {
  return layers.reduce(
    (accu, layer, idx) => ({
      ...accu,
      [layer.id]: isLayerRenderable(layer, layerData[idx]) && isLayerVisible(layer, mapLayers)
    }),
    {}
  );
}

export function getCustomDeckLayers(deckGlProps) {
  const bottomDeckLayers = Array.isArray(deckGlProps?.layers)
    ? deckGlProps?.layers
    : isFunction(deckGlProps?.layers)
    ? deckGlProps?.layers()
    : [];
  const topDeckLayers = Array.isArray(deckGlProps?.topLayers)
    ? deckGlProps?.topLayers
    : isFunction(deckGlProps?.topLayers)
    ? deckGlProps?.topLayers()
    : [];

  return [bottomDeckLayers, topDeckLayers];
}

export type ComputeDeckLayersProps = {
  mapIndex?: number;
  mapboxApiAccessToken?: string;
  mapboxApiUrl?: string;
  primaryMap?: boolean;
  layersForDeck?: {[key: string]: boolean};
};

export function computeDeckLayers(
  {visState, mapState, mapStyle}: any,
  options?: ComputeDeckLayersProps,
  onSetLayerDomain?: (idx: number, value: any) => void,
  deckGlProps?: any
): Layer[] {
  const {
    datasets,
    layers,
    layerOrder,
    layerData,
    hoverInfo,
    clicked,
    interactionConfig,
    animationConfig,
    splitMaps
  } = visState;

  const {mapIndex, mapboxApiAccessToken, mapboxApiUrl, primaryMap, layersForDeck} = options || {};

  if (!layerData || !layerData.length) {
    return [];
  }

  const mapLayers = getMapLayersFromSplitMaps(splitMaps, mapIndex || 0);

  const currentLayersForDeck = layersForDeck || prepareLayersForDeck(layers, layerData);

  const dataLayers = layerOrder
    .slice()
    .reverse()
    .filter(idx => currentLayersForDeck[layers[idx].id])
    .reduce((overlays, idx) => {
      const layerCallbacks = onSetLayerDomain
        ? {
            onSetLayerDomain: val => onSetLayerDomain(idx, val)
          }
        : {};
      const layerOverlay = renderDeckGlLayer(
        {
          datasets,
          layers,
          layerData,
          hoverInfo,
          clicked,
          mapState,
          interactionConfig,
          animationConfig,
          mapLayers
        },
        layerCallbacks,
        idx
      );
      return overlays.concat(layerOverlay || []);
    }, []);

  if (!primaryMap) {
    return dataLayers;
  }

  if (
    mapStyle?.visibleLayerGroups['3d building'] &&
    primaryMap &&
    mapboxApiAccessToken &&
    mapboxApiUrl
  ) {
    dataLayers.push(
      new ThreeDBuildingLayer({
        id: '_keplergl_3d-building',
        mapboxApiAccessToken,
        mapboxApiUrl,
        threeDBuildingColor: mapStyle.threeDBuildingColor,
        updateTriggers: {
          getFillColor: mapStyle.threeDBuildingColor
        }
      })
    );
  }

  const [customBottomDeckLayers, customTopDeckLayers] = getCustomDeckLayers(deckGlProps);

  return [...customBottomDeckLayers, ...dataLayers, ...customTopDeckLayers];
}
