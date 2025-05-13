// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import Console from 'global/console';

import {GEOCODER_LAYER_ID, LIGHT_AND_SHADOW_EFFECT} from '@kepler.gl/constants';
import {Layer as DeckLayer, LayerProps as DeckLayerProps} from '@deck.gl/core/typed';
import {
  Field,
  TooltipField,
  CompareType,
  SplitMapLayers,
  Editor,
  Feature,
  FeatureSelectionContext,
  BindedLayerCallbacks,
  LayerCallbacks,
  Viewport
} from '@kepler.gl/types';
import {
  FindDefaultLayerPropsReturnValue,
  FindDefaultLayerProps,
  Layer,
  LayerClassesType,
  OVERLAY_TYPE_CONST,
  getEditorLayer
} from '@kepler.gl/layers';

import KeplerTable from '@kepler.gl/table';
import {VisState} from '@kepler.gl/schemas';
import {isFunction, getMapLayersFromSplitMaps, DataRow} from '@kepler.gl/utils';
import {arrayMove} from '@kepler.gl/common-utils';

import {ThreeDBuildingLayer} from '@kepler.gl/deckgl-layers';

export type LayersToRender = {
  [layerId: string]: boolean;
};

export type AggregationLayerHoverData = {
  points: any[];
  colorValue?: any;
  elevationValue?: any;
  aggregatedData?: Record<
    string,
    {
      measure: string;
      value?: any;
    }
  >;
};

export type LayerHoverProp = {
  data: DataRow | AggregationLayerHoverData | null;
  fields: Field[];
  fieldsToShow: TooltipField[];
  layer: Layer;
  primaryData?: DataRow | AggregationLayerHoverData | null;
  compareType?: CompareType;
  currentTime?: VisState['animationConfig']['currentTime'];
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
          dataId: dataset.id,
          // set arc layer initial visiblity to false, because arcs tend to be too musy
          ...(lc === 'arc' || lc === 'line' ? {isVisible: false} : {})
        }))
      );
    },
    [] as (FindDefaultLayerProps & {type: string})[]
  );

  // go through all layerProps to create layer
  return layerProps.map(props => {
    const layer = new layerClasses[props.type](props);
    return typeof layer.setInitialLayerConfig === 'function' && dataset.dataContainer
      ? layer.setInitialLayerConfig(dataset)
      : layer;
  });
}

type MinVisStateForLayerData = {
  datasets: VisState['datasets'];
  animationConfig: VisState['animationConfig'];
};

/**
 * Calculate layer data based on layer type, col Config,
 * return updated layer if colorDomain, dataMap has changed.
 * Also, returns updated layer in case the input layer was in invalid state.
 * Adds an error message to the layer in case of an exception.
 */
export function calculateLayerData<S extends MinVisStateForLayerData>(
  layer: Layer,
  state: S,
  oldLayerData?: any
): {
  layerData: any;
  layer: Layer;
} {
  let layerData;
  try {
    // Make sure the layer updates data after an error
    if (!layer.isValid) {
      layer._oldDataUpdateTriggers = undefined;
    }

    if (!layer.type || !layer.hasAllColumns() || !layer.config.dataId) {
      return {layer, layerData: {}};
    }

    layerData = layer.formatLayerData(state.datasets, oldLayerData);

    // At this point the data for the layer is updated without errors
    if (!layer.isValid) {
      // Switch to visible after an error
      layer = layer.updateLayerConfig({
        isVisible: true
      });
    }
    layer.isValid = true;
    layer.errorMessage = null;
  } catch (err) {
    Console.error(err);
    layer = layer.updateLayerConfig({
      isVisible: false
    });
    layer.isValid = false;

    layer.errorMessage =
      err instanceof Error && err.message ? err.message.substring(0, 100) : 'Unknown error';

    layerData = {};
  }

  return {
    layer,
    layerData
  };
}

/**
 * Calculate props passed to LayerHoverInfo
 */
export function getLayerHoverProp({
  animationConfig,
  interactionConfig,
  hoverInfo,
  layers,
  layersToRender,
  datasets
}: {
  interactionConfig: VisState['interactionConfig'];
  animationConfig: VisState['animationConfig'];
  hoverInfo: VisState['hoverInfo'];
  layers: VisState['layers'];
  layersToRender: LayersToRender;
  datasets: VisState['datasets'];
}): LayerHoverProp | null {
  if (interactionConfig.tooltip.enabled && hoverInfo && hoverInfo.picked) {
    // if anything hovered
    const {object, layer: overlay} = hoverInfo;

    // deckgl layer to kepler-gl layer
    const layer = layers[overlay.props.idx];

    // NOTE: for binary format GeojsonLayer, deck will return object=null but hoverInfo.index >= 0
    if (
      (object || hoverInfo.index >= 0) &&
      layer &&
      layer.getHoverData &&
      layersToRender[layer.id]
    ) {
      // if layer is visible and have hovered data
      const {
        config: {dataId}
      } = layer;
      if (!dataId) {
        return null;
      }
      const {dataContainer, fields} = datasets[dataId];
      const data: DataRow | null = layer.getHoverData(
        object || hoverInfo.index,
        dataContainer,
        fields,
        animationConfig,
        hoverInfo
      );
      if (!data) {
        return null;
      }
      const fieldsToShow = interactionConfig.tooltip.config.fieldsToShow[dataId];

      return {
        data,
        fields,
        fieldsToShow,
        layer,
        currentTime: animationConfig.currentTime
      };
    }
  }

  return null;
}

export function renderDeckGlLayer(props: any, layerCallbacks: {[key: string]: any}) {
  const {
    datasets,
    layer,
    layerIndex,
    data,
    hoverInfo,
    clicked,
    mapState,
    interactionConfig,
    animationConfig,
    mapLayers,
    experimentalContext
  } = props;
  const dataset = datasets[layer.config.dataId];
  const {gpuFilter} = dataset || {};
  const objectHovered = clicked || hoverInfo;
  const visible = !mapLayers || (mapLayers && mapLayers[layer.id]);
  // Layer is Layer class
  return layer.renderLayer({
    data,
    gpuFilter,
    idx: layerIndex,
    interactionConfig,
    layerCallbacks,
    mapState,
    animationConfig,
    objectHovered,
    visible,
    dataset,
    experimentalContext
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
  layerData: VisState['layerData']
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
  mapLayers?: SplitMapLayers | undefined | null
): LayersToRender {
  return layers.reduce(
    (accu, layer, idx) => ({
      ...accu,
      [layer.id]: isLayerRenderable(layer, layerData[idx]) && isLayerVisible(layer, mapLayers)
    }),
    {}
  );
}

type CustomDeckLayer = DeckLayer<DeckLayerProps>;

export function getCustomDeckLayers(deckGlProps?: any): [CustomDeckLayer[], CustomDeckLayer[]] {
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
  editorInfo?: {
    editor: Editor;
    editorMenuActive: boolean;
    onSetFeatures: (features: Feature[]) => any;
    setSelectedFeature: (
      feature: Feature | null,
      selectionContext?: FeatureSelectionContext
    ) => any;
    featureCollection: {
      type: string;
      features: Feature[];
    };
    selectedFeatureIndexes: number[];
    viewport: Viewport;
  };
};

export function bindLayerCallbacks(
  layerCallbacks: LayerCallbacks = {},
  idx: number
): BindedLayerCallbacks {
  return Object.keys(layerCallbacks).reduce(
    (accu, key) => ({
      ...accu,
      [key]: val => layerCallbacks[key](idx, val)
    }),
    {} as Record<string, (val: unknown) => void>
  );
}

// eslint-disable-next-line complexity
export function computeDeckLayers(
  {visState, mapState, mapStyle}: any,
  options?: ComputeDeckLayersProps,
  layerCallbacks?: LayerCallbacks,
  deckGlProps?: any
): Layer[] {
  const {
    datasets,
    effects,
    layers,
    layerOrder,
    layerData,
    hoverInfo,
    clicked,
    interactionConfig,
    animationConfig,
    splitMaps
  } = visState;

  const {mapIndex, mapboxApiAccessToken, mapboxApiUrl, primaryMap, layersForDeck, editorInfo} =
    options || {};

  let dataLayers: any[] = [];

  const hasShadowEffect = effects.some(effect => {
    return effect.type === LIGHT_AND_SHADOW_EFFECT.type;
  });

  if (layerData && layerData.length) {
    const mapLayers = getMapLayersFromSplitMaps(splitMaps, mapIndex || 0);

    const currentLayersForDeck = layersForDeck || prepareLayersForDeck(layers, layerData);

    dataLayers = layerOrder
      .slice()
      .reverse()
      .filter(id => currentLayersForDeck[id])
      .reduce((overlays, layerId) => {
        const layerIndex = layers.findIndex(({id}) => id === layerId);
        const bindedLayerCallbacks = layerCallbacks
          ? bindLayerCallbacks(layerCallbacks, layerIndex)
          : {};
        const layer = layers[layerIndex];
        const data = layerData[layerIndex];
        const layerOverlay = renderDeckGlLayer(
          {
            datasets,
            layer,
            layerIndex,
            data,
            hoverInfo,
            clicked,
            mapState,
            interactionConfig,
            animationConfig,
            mapLayers,
            experimentalContext: {
              hasShadowEffect
            }
          },
          bindedLayerCallbacks
        );
        return overlays.concat(layerOverlay || []);
      }, []);
  }

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

  const editorLayer: any[] = [];
  if (editorInfo) {
    editorLayer.push(
      getEditorLayer({
        ...editorInfo
      })
    );
  }

  return [...customBottomDeckLayers, ...dataLayers, ...customTopDeckLayers, ...editorLayer];
}

export function getLayerOrderFromLayers<T extends {id: string}>(layers: T[]): string[] {
  return layers.map(({id}) => id);
}

export function reorderLayerOrder(
  layerOrder: VisState['layerOrder'],
  originLayerId: string,
  destinationLayerId: string
): VisState['layerOrder'] {
  const activeIndex = layerOrder.indexOf(originLayerId);
  const overIndex = layerOrder.indexOf(destinationLayerId);

  return arrayMove(layerOrder, activeIndex, overIndex);
}

export function addLayerToLayerOrder(
  layerOrder: VisState['layerOrder'],
  layerId: string
): string[] {
  return [layerId, ...layerOrder];
}

export function getLayerHoverPropValue(
  data: DataRow | AggregationLayerHoverData | null | undefined,
  fieldIndex: number
) {
  if (!data) return undefined;
  if (data instanceof DataRow) return data.valueAt(fieldIndex);
  return data[fieldIndex];
}

/** Checks if any Deck layers are in the process of loading. */
export function areAnyDeckLayersLoading(layers: DeckLayer[]): boolean {
  return layers.some(
    // layer.isLoaded changes frequently in Deck (even on hover) so we check additional properties
    layer => layer.internalState && !layer.isLoaded
  );
}
