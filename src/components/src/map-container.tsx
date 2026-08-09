// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// libraries
import React, {Component, createRef} from 'react';
import styled, {withTheme} from 'styled-components';
import {Map as MapboxLegacyMap, MapRef} from 'react-map-gl/mapbox-legacy';
import {Map as MaplibreMap} from '@vis.gl/react-maplibre';
import {PickingInfo, MapView} from '@deck.gl/core';
import DeckGL from '@deck.gl/react';
import {createSelector, Selector} from 'reselect';
import {useDroppable} from '@dnd-kit/core';
import debounce from 'lodash/debounce';

import {VisStateActions, MapStateActions, UIStateActions} from '@kepler.gl/actions';

// components
import MapPopoverFactory from './map/map-popover';
import MapControlFactory from './map/map-control';
import MapScaleFactory from './map/map-scale';
import {StyledMapContainer} from './common/styled-components';
import {
  Attribution,
  AttributionLogos,
  renderBasemapAttribution,
  dedupeBasemapAttributions
} from './map/attribution';

import EditorFactory from './editor/editor';
import {AnnotationOverlay} from './annotations';

// utils
import {
  generateMapboxLayers,
  updateMapboxLayers,
  Layer,
  LayerBaseConfig,
  VisualChannelDomain,
  EditorLayerUtils,
  AggregatedBin
} from '@kepler.gl/layers';
import {
  AttributionWithStyle,
  DatasetAttribution,
  MapState,
  MapControls,
  Viewport,
  SplitMap,
  SplitMapLayers
} from '@kepler.gl/types';
import {
  errorNotification,
  isStyleUsingMapboxTiles,
  isStyleUsingOpenStreetMapTiles,
  getBaseMapAttributions,
  getBaseMapLibrary,
  transformRequest,
  observeDimensions,
  unobserveDimensions,
  getMapLayersFromSplitMaps,
  onViewPortChange,
  getViewportFromMapState,
  normalizeEvent,
  rgbToHex,
  computeDeckEffects,
  getApplicationConfig,
  GetMapRef,
  getLayerBlendingParameters,
  patchDeckRendererForPostProcessing
} from '@kepler.gl/utils';

// default-settings
import {
  FILTER_TYPES,
  GEOCODER_LAYER_ID,
  THROTTLE_NOTIFICATION_TIME,
  DEFAULT_PICKING_RADIUS,
  NO_MAP_ID,
  EMPTY_MAPBOX_STYLE,
  MAPBOX_MAX_PITCH,
  MAP_LIB_OPTIONS,
  GLOBE_MIN_ZOOM,
  GLOBE_MAX_ZOOM
} from '@kepler.gl/constants';

import {
  getGlobeBaseLayers,
  getGlobeTopLayers,
  getGlobeClearColor,
  getGlobeBasemapAttributions,
  resolveGlobeBasemapProvider,
  getStarsBackgroundImage,
  KeplerGlobeView
} from '@kepler.gl/deckgl-layers';

import {DROPPABLE_MAP_CONTAINER_TYPE} from './common/dnd-layer-items';
// Contexts
import {MapViewStateContext} from './map-view-state-context';

import ErrorBoundary from './common/error-boundary';
import {LOCALE_CODES} from '@kepler.gl/localization';
import {
  MapStyle,
  areAnyDeckLayersLoading,
  computeDeckLayers,
  getLayerHoverProp,
  LayerHoverProp,
  prepareLayersForDeck,
  prepareLayersToRender,
  LayersToRender
} from '@kepler.gl/reducers';
import {VisState} from '@kepler.gl/schemas';

import LoadingIndicator from './loading-indicator';

// Debounce the propagation of viewport change and mouse moves to redux store.
// This is to avoid too many renders of other components when the map is
// being panned/zoomed (leading to laggy basemap/deck syncing).
const DEBOUNCE_VIEWPORT_PROPAGATE = 10;
const DEBOUNCE_MOUSE_MOVE_PROPAGATE = 10;

// How long should we wait between layer loading state changes before triggering a UI update
const DEBOUNCE_LOADING_STATE_PROPAGATE = 100;

const MAP_STYLE: {[key: string]: React.CSSProperties} = {
  container: {
    display: 'inline-block',
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  top: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none'
  }
};

const LOCALE_CODES_ARRAY = Object.keys(LOCALE_CODES);

interface StyledMapContainerProps {
  $mixBlendMode?: string;
  $mapLibCssClass: string;
}

const StyledMap = styled(StyledMapContainer)<StyledMapContainerProps>(
  ({$mixBlendMode = 'normal', $mapLibCssClass}) => `
  #default-deckgl-overlay {
    mix-blend-mode: ${$mixBlendMode};
  };
  *[${$mapLibCssClass}-children] {
    position: absolute;
  }
`
);

const MAPBOXGL_STYLE_UPDATE = 'style.load';
const MAPBOXGL_RENDER = 'render';

// Canonical OpenStreetMap attribution, injected into the collected list when a
// style is detected to use OSM tiles but the resolved sources haven't yielded
// an attribution string of their own (e.g. raw style declares OSM but the
// TileJSON hasn't exposed it). Rendered through the same safe link parser as
// every other collected attribution.
const OSM_ATTRIBUTION_HTML =
  '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

interface StyledDroppableProps {
  $isOver: boolean;
}

const StyledDroppable = styled.div<StyledDroppableProps>`
  background-color: ${props => (props.$isOver ? props.theme.dndOverBackgroundColor : 'none')};
  width: 100%;
  height: 100%;
  position: absolute;
  pointer-events: none;
  z-index: 1;
`;

const StyledMapScaleContainer = styled.div<{$left: number; $bottomOffset: number}>`
  position: absolute;
  bottom: ${props => props.theme.sidePanel.margin.left + props.$bottomOffset}px;
  left: ${props => props.$left}px;
  z-index: 1;
  pointer-events: auto;
`;

export const isSplitSelector = props =>
  props.visState.splitMaps && props.visState.splitMaps.length > 1;

export const Droppable = ({containerId}) => {
  const {isOver, setNodeRef} = useDroppable({
    id: containerId,
    data: {type: DROPPABLE_MAP_CONTAINER_TYPE, index: containerId},
    disabled: !containerId
  });

  return <StyledDroppable ref={setNodeRef} $isOver={isOver} />;
};

// Attribution UI (parser + components) lives in ./map/attribution and is
// re-exported here to preserve the public import path (@kepler.gl/components).
export {Attribution, AttributionLogos, renderBasemapAttribution, dedupeBasemapAttributions};

MapContainerFactory.deps = [MapPopoverFactory, MapControlFactory, EditorFactory, MapScaleFactory];

type MapboxStyle = string | object | undefined;
type PropSelector<R> = Selector<MapContainerProps, R>;

export interface MapContainerProps {
  visState: VisState;
  mapState: MapState;
  mapControls: MapControls;
  mapStyle: {bottomMapStyle?: MapboxStyle; topMapStyle?: MapboxStyle} & MapStyle;
  mapboxApiAccessToken: string;
  mapboxApiUrl: string;
  visStateActions: typeof VisStateActions;
  mapStateActions: typeof MapStateActions;
  uiStateActions: typeof UIStateActions;

  // optional
  primary?: boolean; // primary one will be reporting its size to appState
  readOnly?: boolean;
  isExport?: boolean;
  // onMapStyleLoaded?: (map: maplibregl.Map | ReturnType<MapRef['getMap']> | null) => void;
  onMapStyleLoaded?: (map: GetMapRef | null) => void;
  onMapRender?: (map: GetMapRef | null) => void;
  getMapboxRef?: (mapbox?: MapRef | null, index?: number) => void;
  index?: number;
  deleteMapLabels?: (containerId: string, layerId: string) => void;
  containerId?: number;

  isLoadingIndicatorVisible?: boolean;
  activeSidePanel: string | null;
  sidePanelWidth?: number;

  locale?: any;
  uiTheme?: string;
  theme?: any;
  editor?: any;
  MapComponent?: typeof MapboxLegacyMap | typeof MaplibreMap;
  deckGlProps?: any;
  onDeckInitialized?: (a: any, b: any) => void;
  onViewStateChange?: (viewport: Viewport) => void;

  topMapContainerProps: any;
  bottomMapContainerProps: any;
  transformRequest?: (url: string, resourceType?: string) => {url: string};

  /** Pass `false` to disable the remote RTL text plugin, or a URL string to self-host it. */
  RTLTextPlugin?: string | false;

  datasetAttributions?: DatasetAttribution[];
  attributionLogos?: AttributionWithStyle[];

  generateMapboxLayers?: typeof generateMapboxLayers;
  generateDeckGLLayers?: typeof computeDeckLayers;

  onMouseMove?: (event: React.MouseEvent & {lngLat?: [number, number]}) => void;

  children?: React.ReactNode;
  deckRenderCallbacks?: {
    onDeckLoad?: () => void;
    onDeckRender?: (deckProps: Record<string, unknown>) => Record<string, unknown> | null;
    onDeckAfterRender?: (deckProps: Record<string, unknown>) => any;
  };

  // Optional: override legend header logo in map controls (used by image export)
  logoComponent?: React.FC | React.ReactNode;
}

export default function MapContainerFactory(
  MapPopover: ReturnType<typeof MapPopoverFactory>,
  MapControl: ReturnType<typeof MapControlFactory>,
  Editor: ReturnType<typeof EditorFactory>,
  MapScale: ReturnType<typeof MapScaleFactory>
): React.ComponentType<MapContainerProps> {
  class MapContainer extends Component<MapContainerProps> {
    displayName = 'MapContainer';

    private anyActiveLayerLoading = false;

    static contextType = MapViewStateContext;

    declare context: React.ContextType<typeof MapViewStateContext>;

    static defaultProps = {
      deckGlProps: {},
      index: 0,
      primary: true
    };

    constructor(props) {
      super(props);
      patchDeckRendererForPostProcessing();
    }

    state = {
      // true for built-in kepler.gl styles (dark-matter, positron, …) and when the
      // basemap uses Mapbox-hosted tiles (mapbox:// sources).
      // For user-added custom styles (OpenFreeMap, CARTO self-hosted, …) MapLibre is
      // merely the rendering engine, not the tile provider, so the logo is hidden and
      // the basemap's own TileJSON attribution is shown instead.
      showBaseMapLibLogo: false,
      // attribution strings collected from the resolved map sources (e.g. CARTO,
      // OpenFreeMap).  Populated after TileJSON resolves.
      basemapAttributions: [] as string[]
    };

    componentDidMount() {
      if (!this._ref.current) {
        return;
      }
      observeDimensions(this._ref.current, this._handleResize);
    }

    componentWillUnmount() {
      if (this._map) {
        this._map.off(MAPBOXGL_STYLE_UPDATE, this._onMapboxStyleUpdate);
        this._map.off(MAPBOXGL_RENDER, this._onMapRender);
        this._removeBasemapAttributionListeners();
      }
      if (!this._ref.current) {
        return;
      }
      unobserveDimensions(this._ref.current);
    }

    componentDidUpdate(prevProps) {
      if (prevProps.mapStyle.styleType !== this.props.mapStyle.styleType) {
        this._removeBasemapAttributionListeners();
        if (this.props.mapStyle.styleType === NO_MAP_ID) {
          this.setState({
            showBaseMapLibLogo: false,
            basemapAttributions: []
          });
        } else {
          this._updateAttribution();
        }
      }
    }

    _deck: any = null;
    _map: GetMapRef | null = null;
    _ref = createRef<HTMLDivElement>();
    _deckGLErrorsElapsed: {[id: string]: number} = {};
    _basemapSourceDataListener: ((e: any) => void) | null = null;
    _basemapIdleListener: (() => void) | null = null;

    _onMapRender = () => {
      if (typeof this.props.onMapRender === 'function') {
        this.props.onMapRender(this._map);
      }
    };

    previousLayers = {
      // [layers.id]: mapboxLayerConfig
    };

    _handleResize = dimensions => {
      const {primary, index} = this.props;
      if (primary) {
        const {mapStateActions} = this.props;
        if (dimensions && dimensions.width > 0 && dimensions.height > 0) {
          mapStateActions.updateMap(dimensions, index);
        }
      }
    };

    layersSelector: PropSelector<VisState['layers']> = props => props.visState.layers;
    layerDataSelector: PropSelector<VisState['layers']> = props => props.visState.layerData;
    splitMapSelector: PropSelector<SplitMap[]> = props => props.visState.splitMaps;
    splitMapIndexSelector: PropSelector<number | undefined> = props => props.index;
    mapLayersSelector: PropSelector<SplitMapLayers | null | undefined> = createSelector(
      this.splitMapSelector,
      this.splitMapIndexSelector,
      getMapLayersFromSplitMaps
    );
    layerOrderSelector: PropSelector<VisState['layerOrder']> = props => props.visState.layerOrder;
    layersToRenderSelector: PropSelector<LayersToRender> = createSelector(
      this.layersSelector,
      this.layerDataSelector,
      this.mapLayersSelector,
      prepareLayersToRender
    );
    layersForDeckSelector = createSelector(
      this.layersSelector,
      this.layerDataSelector,
      prepareLayersForDeck
    );
    filtersSelector = props => props.visState.filters;
    polygonFiltersSelector = createSelector(this.filtersSelector, filters =>
      filters.filter(f => f.type === FILTER_TYPES.polygon && f.enabled !== false)
    );
    featuresSelector = props => props.visState.editor.features;
    selectedFeatureSelector = props => props.visState.editor.selectedFeature;
    featureCollectionSelector = createSelector(
      this.polygonFiltersSelector,
      this.featuresSelector,
      (polygonFilters, features) => ({
        type: 'FeatureCollection',
        features: features.concat(polygonFilters.map(f => f.value))
      })
    );
    // @ts-ignore - No overload matches this call
    selectedPolygonIndexSelector = createSelector(
      this.featureCollectionSelector,
      this.selectedFeatureSelector,
      (collection, selectedFeature) =>
        collection.features.findIndex(f => f.id === selectedFeature?.id)
    );
    selectedFeatureIndexArraySelector = createSelector(
      (value: number) => value,
      value => {
        return value < 0 ? [] : [value];
      }
    );

    generateMapboxLayerMethodSelector = props => props.generateMapboxLayers ?? generateMapboxLayers;

    mapboxLayersSelector = createSelector(
      this.layersSelector,
      this.layerDataSelector,
      this.layerOrderSelector,
      this.layersToRenderSelector,
      this.generateMapboxLayerMethodSelector,
      (layer, layerData, layerOrder, layersToRender, generateMapboxLayerMethod) =>
        generateMapboxLayerMethod(layer, layerData, layerOrder, layersToRender)
    );

    // merge in a background-color style if the basemap choice is NO_MAP_ID
    // used by <StyledMap> inline style prop
    mapStyleTypeSelector = props => props.mapStyle.styleType;
    mapStyleBackgroundColorSelector = props => props.mapStyle.backgroundColor;
    globeModeSelector = props => Boolean(props.mapState?.globe?.enabled);
    globeBackgroundColorSelector = props => props.mapState?.globe?.config?.backgroundColor;
    globeStarsSelector = props => Boolean(props.mapState?.globe?.config?.stars);
    styleSelector = createSelector(
      this.mapStyleTypeSelector,
      this.mapStyleBackgroundColorSelector,
      this.globeModeSelector,
      this.globeBackgroundColorSelector,
      this.globeStarsSelector,
      (styleType, backgroundColor, isGlobeMode, globeBackgroundColor, globeStars) => ({
        ...MAP_STYLE.container,
        ...(styleType === NO_MAP_ID ? {backgroundColor: rgbToHex(backgroundColor)} : {}),
        // In globe mode the deck.gl canvas is transparent (the globe View uses
        // `clearColor: false` to avoid corrupting the picking buffer), so the
        // background around the globe is painted here on the container instead.
        ...(isGlobeMode
          ? {
              // Fall back to the default globe background when none is configured.
              backgroundColor: rgbToHex(
                (globeBackgroundColor as [number, number, number]) ||
                  (getGlobeClearColor().slice(0, 3) as [number, number, number])
              ),
              // Optionally overlay a tileable star-field pattern on the background.
              ...(globeStars
                ? {
                    backgroundImage: `url('${getStarsBackgroundImage()}')`,
                    backgroundRepeat: 'repeat'
                  }
                : {})
            }
          : {})
      })
    );

    /* component private functions */
    _onCloseMapPopover = () => {
      this.props.visStateActions.onLayerClick(null);
    };

    _onLayerHover = (_idx: number, info: PickingInfo<any> | null) => {
      this.props.visStateActions.onLayerHover(info, this.props.index);
    };

    _onLayerSetDomain = (
      idx: number,
      value: number[] | {domain: VisualChannelDomain; aggregatedBins: Record<number, AggregatedBin>}
    ) => {
      // deck.gl 9 native aggregation layers (Grid, Hexagon) pass
      // {domain, aggregatedBins} via our ScaleEnhanced* overrides,
      // while ClusterLayer's CPUAggregator also passes {domain, aggregatedBins}.
      // Plain [min, max] is a fallback if the override is bypassed.
      const config = Array.isArray(value)
        ? {colorDomain: value as VisualChannelDomain}
        : {colorDomain: value.domain, aggregatedBins: value.aggregatedBins};

      const layer = this.props.visState.layers[idx];
      if (!layer) return;

      this.props.visStateActions.layerConfigChange(layer, config as Partial<LayerBaseConfig>);
    };

    _onRedrawNeeded = (_idx: number) => {
      // updateMapUpdater always returns a new state object reference, which triggers re-render
      const {mapStateActions, index} = this.props;
      mapStateActions.updateMap({}, index);
    };

    _onFitBounds = (_idx: number, bounds: [number, number, number, number]) => {
      this.props.mapStateActions.fitBounds(bounds);
    };

    _onLayerFilteredItemsChange = (idx, event) => {
      this.props.visStateActions.layerFilteredItemsChange(this.props.visState.layers[idx], event);
    };

    _onWMSFeatureInfo = (
      idx: number,
      data: {
        featureInfo: Array<{name: string; value: string}> | string | null;
        coordinate?: [number, number] | null;
      }
    ) => {
      this.props.visStateActions.wmsFeatureInfo(
        this.props.visState.layers[idx],
        data.featureInfo,
        data.coordinate
      );
    };

    _handleMapToggleLayer = layerId => {
      const {index: mapIndex = 0, visStateActions} = this.props;
      visStateActions.toggleLayerForMap(mapIndex, layerId);
    };

    _onMapboxStyleUpdate = update => {
      // force refresh mapboxgl layers
      this.previousLayers = {};
      this._updateMapboxLayers();

      this._updateAttribution(update);

      if (typeof this.props.onMapStyleLoaded === 'function') {
        this.props.onMapStyleLoaded(this._map);
      }
    };

    _updateAttribution = (update?: any) => {
      this._removeBasemapAttributionListeners();

      let styleObj = update?.style || null;
      if (!styleObj && this._map) {
        try {
          const rawStyle = this._map.isStyleLoaded?.() ? this._map.getStyle?.() : null;
          if (rawStyle) {
            styleObj = {stylesheet: rawStyle};
          }
        } catch {
          // map style not ready yet
        }
      }
      const usesMapbox = styleObj ? isStyleUsingMapboxTiles(styleObj) : false;
      const usesOsm = styleObj ? isStyleUsingOpenStreetMapTiles(styleObj) : false;
      const basemapAttributions = getBaseMapAttributions(this._map);

      // if OSM tiles are detected in the raw style but no source-level attribution
      // string was collected yet, fold in the canonical OSM attribution so the
      // render path stays uniform (no separate hardcoded fallback link)
      if (usesOsm && !basemapAttributions.length) {
        basemapAttributions.push(OSM_ATTRIBUTION_HTML);
      }

      // Determine whether to show the "Basemap by: MapLibre/Mapbox" logo:
      //  - Always show for built-in kepler.gl styles (dark-matter, positron, …):
      //    they don't carry their own "provider" branding so the rendering-engine
      //    logo acts as the basemap credit.
      //  - Always show when Mapbox tiles are in use (mapbox:// sources): Mapbox
      //    attribution is required.
      //  - Hide for custom user-added styles (custom === 'LOCAL' | 'MANAGED'):
      //    those styles supply their own TileJSON attribution (e.g. OpenFreeMap),
      //    so showing "Basemap by: MapLibre" would be misleading.
      const styleType = this.props.mapStyle?.styleType;
      const currentStyle = this.props.mapStyle?.mapStyles?.[styleType];
      const isUserCustomStyle = Boolean(currentStyle?.custom);
      const showBaseMapLibLogo = usesMapbox || !isUserCustomStyle;

      this.setState({
        showBaseMapLibLogo,
        basemapAttributions
      });

      // For non-Mapbox styles, TileJSON attribution resolves asynchronously
      // after style.load.  Start a listener so we can update basemapAttributions
      // as soon as the sources resolve their TileJSON.
      if (!usesMapbox) {
        this._collectBasemapAttributions();
      }
    };

    _removeBasemapAttributionListeners = () => {
      if (this._basemapSourceDataListener && this._map) {
        this._map.off('sourcedata', this._basemapSourceDataListener);
        this._basemapSourceDataListener = null;
      }
      if (this._basemapIdleListener && this._map) {
        this._map.off('idle', this._basemapIdleListener);
        this._basemapIdleListener = null;
      }
    };

    _collectBasemapAttributions = () => {
      if (!this._map) return;
      this._removeBasemapAttributionListeners();
      let attempts = 0;
      // Cap retries so a style that never yields attributions doesn't leave a
      // permanent sourcedata listener attached.
      const MAX_ATTEMPTS = 50;

      const tryCollect = () => {
        // TileJSON resolves asynchronously; re-collect attributions once a
        // source's metadata is available so custom basemap attributions are not lost.
        const basemapAttributions = getBaseMapAttributions(this._map);
        if (basemapAttributions.length) {
          this._removeBasemapAttributionListeners();
          // Don't change showBaseMapLibLogo here — it is fixed at style.load time
          // based on whether the style uses Mapbox tiles.  We only update the
          // provider attributions collected from the resolved TileJSON.
          this.setState({basemapAttributions});
          return true;
        }
        return false;
      };

      const onSourceData = (e: any) => {
        // Collect attributions when:
        //   (a) a source's TileJSON has just been fetched (sourceDataType === 'metadata') —
        //       this is the earliest moment the `attribution` property is available on the
        //       resolved source object, or
        //   (b) a source is fully loaded (isSourceLoaded === true) — fallback for raster
        //       sources or styles that set attribution inline rather than via TileJSON.
        if (!e?.isSourceLoaded && e?.sourceDataType !== 'metadata') return;
        attempts++;
        tryCollect();
        if (attempts >= MAX_ATTEMPTS) {
          this._removeBasemapAttributionListeners();
        }
      };

      // The `idle` event fires when the map has finished loading all pending
      // resources (tiles, TileJSON, sprites). At that point attributions from
      // all sources are guaranteed to be resolved, so this is a reliable
      // one-shot fallback that catches cases where the sourcedata metadata
      // events are missed or the source never reaches isSourceLoaded.
      const onIdle = () => {
        this._removeBasemapAttributionListeners();
        const basemapAttributions = getBaseMapAttributions(this._map);
        if (basemapAttributions.length) {
          this.setState({basemapAttributions});
        }
      };

      this._basemapSourceDataListener = onSourceData;
      this._basemapIdleListener = onIdle;
      this._map.on('sourcedata', onSourceData);
      this._map.on('idle', onIdle);
    };

    _setMapRef = mapRef => {
      // Handle change of the map library
      if (this._map && mapRef) {
        const map = mapRef.getMap();
        if (map && this._map !== map) {
          this._map.off(MAPBOXGL_STYLE_UPDATE, this._onMapboxStyleUpdate);
          this._map.off(MAPBOXGL_RENDER, this._onMapRender);
          this._removeBasemapAttributionListeners();
          this._map = null;
        }
      }

      if (!this._map && mapRef) {
        this._map = mapRef.getMap();
        // i noticed in certain context we don't access the actual map element
        if (!this._map) {
          return;
        }
        // bind mapboxgl event listener
        this._map.on(MAPBOXGL_STYLE_UPDATE, this._onMapboxStyleUpdate);
        this._map.on(MAPBOXGL_RENDER, this._onMapRender);
      }

      if (this.props.getMapboxRef) {
        // The parent component can gain access to our MapboxGlMap by
        // providing this callback. Note that 'mapbox' will be null when the
        // ref is unset (e.g. when a split map is closed).
        this.props.getMapboxRef(mapRef, this.props.index);
      }
    };

    _onDeckInitialized(device) {
      if (this.props.onDeckInitialized) {
        this.props.onDeckInitialized(this._deck, device);
      }
    }

    /**
     * 1) Allow effects only for the first view.
     * 2) Prevent effect:preRender call without valid generated viewports.
     * @param viewIndex View index.
     * @returns Returns true if effects can be used.
     */
    _isOKToRenderEffects(viewIndex?: number): boolean {
      return !viewIndex && Boolean(this._deck?.viewManager?._viewports?.length);
    }

    _onBeforeRender = () => {
      // no-op
    };

    _annotationViewportCache: {key: string; viewport: any} | null = null;

    _wasInteracting = false;

    _getAnnotationViewport(mapState: any, internalViewState: any) {
      const longitude = internalViewState?.longitude ?? mapState.longitude;
      const latitude = internalViewState?.latitude ?? mapState.latitude;
      const zoom = internalViewState?.zoom ?? mapState.zoom;
      const pitch = internalViewState?.pitch ?? mapState.pitch ?? 0;
      const bearing = internalViewState?.bearing ?? mapState.bearing ?? 0;
      const width = mapState.width || 0;
      const height = mapState.height || 0;
      const key = `${longitude},${latitude},${zoom},${pitch},${bearing},${width},${height}`;

      if (this._annotationViewportCache?.key === key) {
        return this._annotationViewportCache.viewport;
      }

      const mergedState = {...mapState, ...internalViewState, width, height};
      const vp = getViewportFromMapState(mergedState) as any;
      const viewport = {
        project: (lngLat: [number, number]) => vp.project(lngLat) as [number, number],
        unproject: (xy: [number, number]) => vp.unproject(xy) as [number, number],
        longitude,
        latitude,
        width,
        height,
        zoom
      };
      this._annotationViewportCache = {key, viewport};
      return viewport;
    }

    _onDeckError = (error, layer) => {
      const errorMessage = error?.message || 'unknown-error';
      const layerMessage = layer?.id ? ` in ${layer.id} layer` : '';
      const errorMessageFull =
        errorMessage === 'WebGL context is lost'
          ? 'Your GPU was disconnected. This can happen if your computer goes to sleep. It can also occur for other reasons, such as if you are running too many GPU applications.'
          : `An error in deck.gl: ${errorMessage}${layerMessage}.`;

      // Throttle error notifications, as React doesn't like too many state changes from here.
      const lastShown = this._deckGLErrorsElapsed[errorMessageFull];
      if (!lastShown || lastShown < Date.now() - THROTTLE_NOTIFICATION_TIME) {
        this._deckGLErrorsElapsed[errorMessageFull] = Date.now();

        // Mark layer as invalid
        let extraLayerMessage = '';
        const {visStateActions} = this.props;
        if (layer) {
          let topMostLayer = layer;
          while (topMostLayer.parent) {
            topMostLayer = topMostLayer.parent;
          }
          if (topMostLayer.props?.id) {
            visStateActions.layerSetIsValid(topMostLayer, false);
            extraLayerMessage = 'The layer has been disabled and highlighted.';
          }
        }

        // Create new error notification or update existing one with same id.
        // Update is required to preserve the order of notifications as they probably are going to "jump" based on order of errors.
        const {uiStateActions} = this.props;
        uiStateActions.addNotification(
          errorNotification({
            message: `${errorMessageFull} ${extraLayerMessage}`,
            id: errorMessageFull // treat the error message as id
          })
        );
      }
    };

    /* component render functions */

    /* eslint-disable complexity */
    _renderMapPopover() {
      // this check is for limiting the display of the `<MapPopover>` to the `<MapContainer>` the user is interacting with
      // the DeckGL onHover event handler adds a `mapIndex` property which is available in the `hoverInfo` object of `visState`
      if (this.props.index !== this.props.visState.hoverInfo?.mapIndex) {
        return null;
      }

      // TODO: move this into reducer so it can be tested
      const {
        mapState,
        visState: {
          hoverInfo,
          clicked,
          datasets,
          interactionConfig,
          animationConfig,
          layers,
          mousePos: {mousePosition, coordinate, pinned}
        }
      } = this.props;
      const layersToRender = this.layersToRenderSelector(this.props);

      if (!mousePosition || !interactionConfig.tooltip) {
        return null;
      }

      const layerHoverProp = getLayerHoverProp({
        animationConfig,
        interactionConfig,
        hoverInfo,
        layers,
        layersToRender,
        datasets
      });

      const compareMode = interactionConfig.tooltip.config
        ? interactionConfig.tooltip.config.compareMode
        : false;

      let pinnedPosition = {x: 0, y: 0};
      let layerPinnedProp: LayerHoverProp | null = null;
      if (pinned || clicked) {
        // project lnglat to screen so that tooltip follows the object on zoom
        const viewport = getViewportFromMapState(mapState);
        const lngLat = clicked ? clicked.coordinate : pinned.coordinate;
        pinnedPosition = this._getHoverXY(viewport, lngLat);
        layerPinnedProp = getLayerHoverProp({
          animationConfig,
          interactionConfig,
          hoverInfo: clicked,
          layers,
          layersToRender,
          datasets
        });
        if (layerHoverProp && layerPinnedProp) {
          layerHoverProp.primaryData = layerPinnedProp.data;
          layerHoverProp.compareType = interactionConfig.tooltip.config.compareType;
        }
      }

      const commonProp = {
        onClose: this._onCloseMapPopover,
        zoom: mapState.zoom,
        container: this._deck ? this._deck.canvas : undefined
      };

      return (
        <ErrorBoundary>
          {layerPinnedProp && (
            <MapPopover
              {...pinnedPosition}
              {...commonProp}
              layerHoverProp={layerPinnedProp}
              coordinate={interactionConfig.coordinate.enabled && (pinned || {}).coordinate}
              frozen={true}
              isBase={compareMode}
              onSetFeatures={this.props.visStateActions.setFeatures}
              setSelectedFeature={this.props.visStateActions.setSelectedFeature}
              // @ts-ignore Argument of type 'Readonly<MapContainerProps>' is not assignable to parameter of type 'never'
              featureCollection={this.featureCollectionSelector(this.props)}
            />
          )}
          {layerHoverProp && (!layerPinnedProp || compareMode) && (
            <MapPopover
              x={mousePosition[0]}
              y={mousePosition[1]}
              {...commonProp}
              layerHoverProp={layerHoverProp}
              frozen={false}
              coordinate={interactionConfig.coordinate.enabled && coordinate}
              onSetFeatures={this.props.visStateActions.setFeatures}
              setSelectedFeature={this.props.visStateActions.setSelectedFeature}
              // @ts-ignore Argument of type 'Readonly<MapContainerProps>' is not assignable to parameter of type 'never'
              featureCollection={this.featureCollectionSelector(this.props)}
            />
          )}
        </ErrorBoundary>
      );
    }

    /* eslint-enable complexity */

    _getHoverXY(viewport, lngLat) {
      const screenCoord = !viewport || !lngLat ? null : viewport.project(lngLat);
      return screenCoord && {x: screenCoord[0], y: screenCoord[1]};
    }

    _renderDeckOverlay(
      layersForDeck,
      options: {primaryMap: boolean; isInteractive?: boolean; children?: React.ReactNode} = {
        primaryMap: false
      }
    ) {
      const {
        mapStyle,
        visState,
        mapState,
        visStateActions,
        mapboxApiAccessToken,
        mapboxApiUrl,
        deckGlProps,
        index,
        mapControls,
        deckRenderCallbacks,
        theme,
        generateDeckGLLayers,
        onMouseMove
      } = this.props;

      const {hoverInfo, editor} = visState;
      const {primaryMap, isInteractive, children} = options;

      // disable double click zoom when editor is in any draw mode
      const {mapDraw} = mapControls;
      const {active: editorMenuActive = false} = mapDraw || {};
      const isEditorDrawingMode = EditorLayerUtils.isDrawingActive(editorMenuActive, editor.mode);

      const internalViewState = this.context?.getInternalViewState(index);
      const internalMapState = {...mapState, ...internalViewState};
      const viewport = getViewportFromMapState(internalMapState);

      const editorFeatureSelectedIndex = this.selectedPolygonIndexSelector(this.props);

      const {setFeatures, onLayerClick, setSelectedFeature} = visStateActions;

      const generateDeckGLLayersMethod = generateDeckGLLayers ?? computeDeckLayers;

      const extraDeckParams: {
        getTooltip?: (info: any) => object | null;
        getCursor?: ({isDragging}: {isDragging: boolean}) => string;
      } = {};
      if (primaryMap) {
        // Omit hover updates when the pointer position is invalid, ie. over UI overlays or
        // outside the map container. In those cases x/y may be < 0
        extraDeckParams.getTooltip = info => {
          const x = Number(info?.x);
          const y = Number(info?.y);
          if (Number.isNaN(x) || Number.isNaN(y) || x < 0 || y < 0) return null;

          return EditorLayerUtils.getTooltip(info, {
            editorMenuActive,
            editor,
            theme
          });
        };

        extraDeckParams.getCursor = ({isDragging}: {isDragging: boolean}) => {
          const editorCursor = EditorLayerUtils.getCursor({
            editorMenuActive,
            editor,
            hoverInfo
          });
          if (editorCursor) return editorCursor;

          if (isDragging) return 'grabbing';
          if (hoverInfo?.layer) return 'pointer';
          return 'grab';
        };
      }

      const effects = this._isOKToRenderEffects(index)
        ? computeDeckEffects({visState, mapState, isExport: this.props.isExport})
        : [];

      const isGlobeMode = mapState.globe?.enabled;

      // In globe mode with a non-default blend mode, forward pre-computed layer
      // rendering parameters into mapState so individual layers can merge them into
      // their own parameters objects. The global DeckGL parameters cannot be used in
      // globe mode because they are merged into globe system layers (atmosphere,
      // surface, etc.) and alter their carefully tuned blend/depth state.
      // 'normal' is omitted — it is the WebGL default and injecting it would
      // override intentional blend:false settings on layers like trip/scenegraph.
      const layerBlendingParams =
        isGlobeMode && visState.layerBlending && visState.layerBlending !== 'normal'
          ? getLayerBlendingParameters(visState.layerBlending)
          : undefined;
      const deckLayersMapState = layerBlendingParams
        ? {...internalMapState, layerParameters: layerBlendingParams}
        : internalMapState;

      const deckGlLayers = generateDeckGLLayersMethod(
        {
          visState,
          mapState: deckLayersMapState,
          mapStyle
        },
        {
          mapIndex: index,
          primaryMap,
          mapboxApiAccessToken,
          mapboxApiUrl,
          layersForDeck,
          editorInfo: primaryMap
            ? {
                editor,
                editorMenuActive,
                onSetFeatures: setFeatures,
                setSelectedFeature,
                onApplyPolygonFilterAll: visStateActions.setPolygonFilterAllLayers,
                // @ts-ignore Argument of type 'Readonly<MapContainerProps>' is not assignable to parameter of type 'never'
                featureCollection: this.featureCollectionSelector(this.props),
                selectedFeatureIndexes: this.selectedFeatureIndexArraySelector(
                  // @ts-ignore Argument of type 'unknown' is not assignable to parameter of type 'number'.
                  editorFeatureSelectedIndex
                ),
                viewport
              }
            : undefined
        },
        {
          onLayerHover: this._onLayerHover,
          onSetLayerDomain: this._onLayerSetDomain,
          onFilteredItemsChange: this._onLayerFilteredItemsChange,
          onWMSFeatureInfo: this._onWMSFeatureInfo,
          onRedrawNeeded: this._onRedrawNeeded,
          onFitBounds: this._onFitBounds
        },
        deckGlProps
      );

      // Follow the selected basemap style's library so the globe uses the same
      // provider as the flat 2D map (CARTO tiles for MapLibre styles, Mapbox
      // tiles for Mapbox styles).
      const globeBasemapProvider = resolveGlobeBasemapProvider(
        getBaseMapLibrary(mapStyle?.mapStyles?.[mapStyle?.styleType]),
        mapboxApiAccessToken || ''
      );

      // In globe mode, prepend globe base layers and append top layers
      const globeBaseLayers =
        isGlobeMode && mapState.globe
          ? getGlobeBaseLayers({
              mapboxApiAccessToken: mapboxApiAccessToken || '',
              globe: mapState.globe,
              mapStyleType: mapStyle?.styleType,
              basemapProvider: globeBasemapProvider,
              // Use the live (internal) latitude so the tile LOD compensation
              // stays in sync with the deck viewport during a drag; mapState
              // latitude lags behind while rotating.
              latitude: internalMapState.latitude,
              zoom: internalMapState.zoom
            })
          : [];
      const globeTopLayers =
        isGlobeMode && mapState.globe
          ? getGlobeTopLayers({globe: mapState.globe, zoom: internalMapState.zoom})
          : [];
      const finalDeckGlLayers = isGlobeMode
        ? [...globeBaseLayers, ...deckGlLayers, ...globeTopLayers]
        : deckGlLayers;

      const views = deckGlProps?.views
        ? deckGlProps?.views()
        : isGlobeMode
        ? new KeplerGlobeView({
            resolution: 5,
            // The visible background around the globe is painted by the map
            // container's CSS background (see styleSelector), NOT by a per-view
            // color clear. deck.gl applies a View's `clearColor` in *every* pass,
            // including the picking pass, and it forces the cleared alpha to 255
            // (`clearColor[3] || 255`). In the picking buffer the alpha byte encodes
            // the layer index, so a 255 clear makes deck.gl decode every pixel as a
            // non-existent layer ("Picked non-existent layer. Is picking buffer
            // corrupt?") on hover. `clearColor: false` skips the per-view color
            // clear so the picking buffer keeps its 0 alpha; the canvas stays
            // transparent and the CSS background shows through.
            clear: true,
            clearColor: false
          })
        : new MapView({farZMultiplier: 1.2});

      let allDeckGlProps = {
        ...deckGlProps,
        pickingRadius: DEFAULT_PICKING_RADIUS,
        views,
        layers: finalDeckGlLayers,
        effects,
        parameters: isGlobeMode ? {cull: true} : getLayerBlendingParameters(visState.layerBlending)
      };

      if (typeof deckRenderCallbacks?.onDeckRender === 'function') {
        allDeckGlProps = deckRenderCallbacks.onDeckRender(allDeckGlProps);
        if (!allDeckGlProps) {
          // if onDeckRender returns null, do not render deck.gl
          return null;
        }
      }

      return (
        <div
          {...(isInteractive
            ? {
                onMouseMove: primaryMap
                  ? event => {
                      onMouseMove?.(event);
                      this._onMouseMoveDebounced(event, viewport);
                    }
                  : undefined
              }
            : {style: {pointerEvents: 'none'}})}
        >
          <DeckGL
            id="default-deckgl-overlay"
            onLoad={() => {
              if (typeof deckRenderCallbacks?.onDeckLoad === 'function') {
                deckRenderCallbacks.onDeckLoad();
              }
            }}
            {...allDeckGlProps}
            controller={
              isInteractive
                ? {
                    doubleClickZoom: !isEditorDrawingMode,
                    dragRotate: this.props.mapState.dragRotate,
                    maxPitch: this.props.mapState.maxPitch ?? getApplicationConfig().maxPitch,
                    // In globe mode allow zooming out further than deck.gl's default
                    // of 0 so the whole globe can be pulled back on screen. Set on the
                    // controller so it stays authoritative regardless of the viewState
                    // round-trip through Redux/local context. Cap the max zoom too so
                    // the basemap tiles don't break down at high globe zoom.
                    ...(isGlobeMode ? {minZoom: GLOBE_MIN_ZOOM, maxZoom: GLOBE_MAX_ZOOM} : {})
                  }
                : false
            }
            viewState={
              isGlobeMode
                ? {...internalViewState, minZoom: GLOBE_MIN_ZOOM, maxZoom: GLOBE_MAX_ZOOM}
                : internalViewState
            }
            onBeforeRender={this._onBeforeRender}
            onViewStateChange={isInteractive ? this._onViewportChange : undefined}
            {...extraDeckParams}
            onHover={
              isInteractive
                ? data => {
                    const res = EditorLayerUtils.onHover(data, {
                      editorMenuActive,
                      editor,
                      hoverInfo
                    });
                    if (res) return;

                    this._onLayerHoverDebounced(data, index);
                  }
                : null
            }
            onClick={(data, event) => {
              // @ts-ignore
              normalizeEvent(event.srcEvent, viewport);

              // Handle bitmap layer alignment mode: if a bitmap layer is waiting
              // for a map click, route the click coordinate to it
              if (data.coordinate) {
                const aligningLayer = visState.layers.find(
                  (l: any) => l.type === 'bitmap' && l.alignWaitingForMap && l.config.isVisible
                );
                if (aligningLayer) {
                  (aligningLayer as any).onAlignMapClick(data.coordinate as [number, number]);
                  this._onRedrawNeeded(0);
                  return;
                }
              }

              const res = EditorLayerUtils.onClick(data, event, {
                editorMenuActive,
                editor,
                onLayerClick,
                setSelectedFeature,
                mapIndex: index
              });
              if (res) return;

              visStateActions.onLayerClick(data);
            }}
            onError={this._onDeckError}
            ref={comp => {
              // @ts-ignore
              if (comp && comp.deck && !this._deck) {
                // @ts-ignore
                this._deck = comp.deck;
              }
            }}
            onDeviceInitialized={device => this._onDeckInitialized(device)}
            onAfterRender={() => {
              if (typeof deckRenderCallbacks?.onDeckAfterRender === 'function') {
                deckRenderCallbacks.onDeckAfterRender(allDeckGlProps);
              }

              const anyActiveLayerLoading = areAnyDeckLayersLoading(allDeckGlProps.layers);
              if (anyActiveLayerLoading !== this.anyActiveLayerLoading) {
                this._onLayerLoadingStateChange();
                this.anyActiveLayerLoading = anyActiveLayerLoading;
              }
            }}
          >
            {children}
          </DeckGL>
        </div>
      );
    }

    _updateMapboxLayers() {
      const mapboxLayers = this.mapboxLayersSelector(this.props);
      if (!Object.keys(mapboxLayers).length && !Object.keys(this.previousLayers).length) {
        return;
      }

      updateMapboxLayers(this._map, mapboxLayers, this.previousLayers);

      this.previousLayers = mapboxLayers;
    }

    _renderMapboxOverlays() {
      if (this._map && this._map.isStyleLoaded()) {
        this._updateMapboxLayers();
      }
    }
    _onViewportChangePropagateDebounced = debounce(() => {
      const viewState = this.context?.getInternalViewState(this.props.index);
      onViewPortChange(
        viewState,
        this.props.mapStateActions.updateMap,
        this.props.onViewStateChange,
        this.props.primary,
        this.props.index
      );
    }, DEBOUNCE_VIEWPORT_PROPAGATE);

    _onViewportChange = viewport => {
      const {viewState, interactionState} = viewport;
      if (this.props.isExport) {
        // Image export map shouldn't be interactive (otherwise this callback can
        // lead to inadvertent changes to the state of the main map)
        return;
      }
      const {setInternalViewState} = this.context;

      // Flat map (2D/3D): keep the original, always-synchronous behavior. The
      // interaction-aware timing below exists purely to fix globe-specific
      // controlled-viewState, so it must not change the main 2D logic.
      if (!this.props.mapState?.globe?.enabled) {
        setInternalViewState(viewState, this.props.index);
        this._wasInteracting = false;
        this._onViewportChangePropagateDebounced();
        return;
      }

      const isUserInteraction =
        interactionState &&
        (interactionState.isZooming ||
          interactionState.isPanning ||
          interactionState.isRotating ||
          interactionState.isDragging ||
          interactionState.inTransition);
      // The emit that ends a gesture (panend/rotateEnd, or a fling transition
      // ending) arrives with all interaction flags false. If we defer it, the
      // controlled `viewState` fed back to deck lags a frame behind the
      // controller's committed state and deck re-seeds from the stale value,
      // making the globe visibly "jump back" to where the drag was released -
      // most noticeable on a throw/fling release. Treat the first all-false emit
      // right after an active gesture as part of that gesture and apply it
      // synchronously too.
      const isInteractionSettle = !isUserInteraction && this._wasInteracting;
      this._wasInteracting = Boolean(isUserInteraction);
      if (isUserInteraction || isInteractionSettle) {
        // For interactive gestures (pan/zoom/rotate) and their end-of-gesture
        // settle, update synchronously so the controlled `viewState` stays in
        // lockstep with the controller and there's no stale re-seed.
        setInternalViewState(viewState, this.props.index);
      } else {
        // deck.gl can fire onViewStateChange synchronously during its own render
        // (e.g. when switching view types like MapView -> GlobeView). Updating React
        // state during render throws a warning, so defer non-interactive updates.
        setTimeout(() => {
          setInternalViewState(viewState, this.props.index);
        }, 0);
      }
      this._onViewportChangePropagateDebounced();
    };

    _onLayerHoverDebounced = debounce((data, index) => {
      this.props.visStateActions.onLayerHover(data, index);
    }, DEBOUNCE_MOUSE_MOVE_PROPAGATE);

    _onMouseMoveDebounced = debounce((event, viewport) => {
      this.props.visStateActions.onMouseMove(normalizeEvent(event, viewport));
    }, DEBOUNCE_MOUSE_MOVE_PROPAGATE);

    _onLayerLoadingStateChange = debounce(() => {
      // trigger loading indicator update without any change to update UI
      this.props.visStateActions.setLoadingIndicator({change: 0});
    }, DEBOUNCE_LOADING_STATE_PROPAGATE);

    _handleToggleLayerVisibility = (layer: Layer) => {
      const {visStateActions} = this.props;
      visStateActions.layerConfigChange(layer, {isVisible: !layer.config.isVisible});
    };

    _toggleMapControl = panelId => {
      const {index, uiStateActions} = this.props;

      uiStateActions.toggleMapControl(panelId, Number(index));
    };

    /* eslint-disable complexity */
    _renderMap() {
      const {
        visState,
        mapState,
        mapStyle,
        mapStateActions,
        mapboxApiAccessToken,
        // mapboxApiUrl,
        mapControls,
        isExport,
        locale,
        uiTheme,
        uiStateActions,
        visStateActions,
        index,
        primary,
        bottomMapContainerProps,
        topMapContainerProps,
        theme,
        datasetAttributions = [],
        attributionLogos = [],
        containerId = 0,
        isLoadingIndicatorVisible,
        activeSidePanel,
        sidePanelWidth
      } = this.props;

      const {layers, datasets, editor, interactionConfig, layerOrder} = visState;

      const layersToRender = this.layersToRenderSelector(this.props);
      const layersForDeck = this.layersForDeckSelector(this.props);

      // Current style can be a custom style, from which we pull the mapbox API acccess token
      const currentStyle = mapStyle.mapStyles?.[mapStyle.styleType];
      const baseMapLibraryName = getBaseMapLibrary(currentStyle);
      const baseMapLibraryConfig = getApplicationConfig().baseMapLibraryConfig[baseMapLibraryName];

      // Select the correct Map adapter based on the active base map library.
      // Using the native adapter for each library avoids Transform API
      // incompatibilities (e.g. mapbox-legacy's cloneTransform with MapLibre v5).
      const ResolvedMapComponent =
        this.props.MapComponent ??
        (baseMapLibraryName === MAP_LIB_OPTIONS.MAPBOX ? MapboxLegacyMap : MaplibreMap);

      const useMapboxAdapter = ResolvedMapComponent === MapboxLegacyMap;

      const internalViewState = this.context?.getInternalViewState(index);
      const configMaxPitch = mapState.maxPitch ?? getApplicationConfig().maxPitch;
      const effectiveMaxPitch = useMapboxAdapter
        ? Math.min(configMaxPitch, MAPBOX_MAX_PITCH)
        : configMaxPitch;
      const mapProps: Record<string, any> = {
        ...internalViewState,
        maxPitch: effectiveMaxPitch,
        preserveDrawingBuffer: this.props.isExport ?? false,
        mapboxAccessToken: currentStyle?.accessToken || mapboxApiAccessToken,
        // baseApiUrl: mapboxApiUrl,
        transformRequest:
          this.props.transformRequest ||
          transformRequest(currentStyle?.accessToken || mapboxApiAccessToken)
      };

      if (this.props.RTLTextPlugin !== undefined) {
        mapProps.RTLTextPlugin = this.props.RTLTextPlugin;
      }

      if (useMapboxAdapter) {
        const mapboxConfig = getApplicationConfig().baseMapLibraryConfig[MAP_LIB_OPTIONS.MAPBOX];
        mapProps.mapLib = mapboxConfig.getMapLib();
      }

      const hasGeocoderLayer = Boolean(layers.find(l => l.id === GEOCODER_LAYER_ID));
      const isSplit = Boolean(mapState.isSplit);

      const deck = this._renderDeckOverlay(layersForDeck, {
        primaryMap: true,
        isInteractive: true,
        children: (
          <ResolvedMapComponent
            key={`bottom-${baseMapLibraryName}`}
            {...mapProps}
            mapStyle={
              mapState.globe?.enabled
                ? EMPTY_MAPBOX_STYLE
                : mapStyle.bottomMapStyle ?? EMPTY_MAPBOX_STYLE
            }
            {...bottomMapContainerProps}
            ref={this._setMapRef}
          />
        )
      });
      if (!deck) {
        // deckOverlay can be null if onDeckRender returns null
        // in this case we don't want to render the map
        return null;
      }
      // In split (dual) view mode, only render the map control buttons on the
      // right-side map (primary === true, i.e. index === 1). Otherwise the same
      // buttons are duplicated on both maps and any opened menu appears mirrored.
      const showMapControl = !isSplit || Boolean(primary);
      return (
        <>
          {showMapControl && (
            <MapControl
              mapState={mapState}
              mapStateActions={mapStateActions}
              datasets={datasets}
              availableLocales={LOCALE_CODES_ARRAY}
              dragRotate={mapState.dragRotate}
              isSplit={isSplit}
              primary={Boolean(primary)}
              isExport={isExport}
              layers={layers}
              layerOrder={layerOrder}
              layersToRender={layersToRender}
              mapIndex={index || 0}
              mapControls={mapControls}
              readOnly={this.props.readOnly}
              scale={mapState.scale || 1}
              logoComponent={this.props.logoComponent}
              top={
                interactionConfig.geocoder && interactionConfig.geocoder.enabled
                  ? theme.mapControlTop
                  : 0
              }
              editor={editor}
              locale={locale}
              themeName={uiTheme}
              onTogglePerspective={mapStateActions.togglePerspective}
              onSetMapViewMode={mapStateActions.setMapViewMode}
              mapViewMode={mapState.mapViewMode}
              onToggleSplitMap={mapStateActions.toggleSplitMap}
              onMapToggleLayer={this._handleMapToggleLayer}
              onToggleMapControl={this._toggleMapControl}
              onToggleSplitMapViewport={mapStateActions.toggleSplitMapViewport}
              onSetEditorMode={visStateActions.setEditorMode}
              onSetLocale={uiStateActions.setLocale}
              onSetTheme={uiStateActions.setTheme}
              onToggleEditorVisibility={visStateActions.toggleEditorVisibility}
              onLayerVisConfigChange={visStateActions.layerVisConfigChange}
              onToggleLayerVisibility={this._handleToggleLayerVisibility}
              mapHeight={mapState.height}
              setMapControlSettings={uiStateActions.setMapControlSettings}
              activeSidePanel={activeSidePanel}
              splitMaps={this.props.visState.splitMaps}
              onToggleLayerForMap={visStateActions.toggleLayerForMap}
            />
          )}
          {isSplitSelector(this.props) && <Droppable containerId={containerId} />}

          {deck}
          {this._renderMapboxOverlays()}
          <Editor
            index={index || 0}
            datasets={datasets}
            editor={editor}
            filters={this.polygonFiltersSelector(this.props)}
            layers={layers}
            onDeleteFeature={visStateActions.deleteFeature}
            onSelect={visStateActions.setSelectedFeature}
            onTogglePolygonFilter={visStateActions.setPolygonFilterLayer}
            onSetEditorMode={visStateActions.setEditorMode}
            style={{
              pointerEvents: 'all',
              position: 'absolute',
              display: editor.visible ? 'block' : 'none'
            }}
          />
          <AnnotationOverlay
            annotations={visState.annotations}
            selectedAnnotationId={visState.selectedAnnotationId}
            isEditingAnnotationText={visState.isEditingAnnotationText}
            isAnnotationMode={Boolean(mapControls?.annotation?.active)}
            mapIndex={index || 0}
            viewport={this._getAnnotationViewport(mapState, internalViewState)}
            isGlobeEnabled={Boolean(mapState.globe?.enabled)}
            updateAnnotation={visStateActions.updateAnnotation}
            setSelectedAnnotation={visStateActions.setSelectedAnnotation}
          />
          {this.props.children}
          {mapStyle.topMapStyle && !mapState.globe?.enabled ? (
            <ResolvedMapComponent
              key={`top-${baseMapLibraryName}`}
              viewState={internalViewState}
              maxPitch={effectiveMaxPitch}
              mapStyle={mapStyle.topMapStyle}
              style={MAP_STYLE.top}
              mapboxAccessToken={mapProps.mapboxAccessToken}
              transformRequest={mapProps.transformRequest}
              {...(mapProps.RTLTextPlugin !== undefined
                ? {RTLTextPlugin: mapProps.RTLTextPlugin}
                : {})}
              {...(useMapboxAdapter
                ? {
                    mapLib:
                      getApplicationConfig().baseMapLibraryConfig[
                        MAP_LIB_OPTIONS.MAPBOX
                      ].getMapLib()
                  }
                : {})}
              {...topMapContainerProps}
            />
          ) : null}

          {hasGeocoderLayer
            ? this._renderDeckOverlay(
                {[GEOCODER_LAYER_ID]: hasGeocoderLayer},
                {primaryMap: false, isInteractive: false}
              )
            : null}
          {this._renderMapPopover()}
          {!isExport && primary !== isSplit ? (
            <LoadingIndicator
              isVisible={Boolean(isLoadingIndicatorVisible || this.anyActiveLayerLoading)}
              activeSidePanel={Boolean(activeSidePanel)}
              sidePanelWidth={sidePanelWidth}
              hasAttributionLogos={attributionLogos.length > 0}
              hasMapScale={getApplicationConfig().enableMapScale}
            />
          ) : null}
          {this.props.primary ? (
            <Attribution
              showBaseMapLibLogo={this.state.showBaseMapLibLogo}
              basemapAttributions={this.state.basemapAttributions}
              datasetAttributions={datasetAttributions}
              baseMapLibraryConfig={baseMapLibraryConfig}
              globeAttributions={getGlobeBasemapAttributions({
                globe: mapState.globe,
                mapboxApiAccessToken,
                mapStyleType: mapStyle?.styleType,
                basemapProvider: resolveGlobeBasemapProvider(
                  baseMapLibraryName,
                  mapboxApiAccessToken
                )
              })}
            />
          ) : null}
          {this.props.primary ? (
            <AttributionLogos
              logos={attributionLogos}
              activeSidePanel={Boolean(activeSidePanel)}
              sidePanelWidth={sidePanelWidth}
            />
          ) : null}
          {!isExport && getApplicationConfig().enableMapScale ? (
            <StyledMapScaleContainer
              $left={
                primary && activeSidePanel
                  ? (sidePanelWidth || 0) + (theme?.sidePanel?.margin?.left ?? 9)
                  : theme?.sidePanel?.margin?.left ?? 9
              }
              $bottomOffset={primary && attributionLogos.length > 0 ? 24 : 0}
            >
              <MapScale mapState={mapState} mapIndex={index ?? 0} />
            </StyledMapScaleContainer>
          ) : null}
        </>
      );
    }

    render() {
      const {visState, mapStyle} = this.props;
      const mapContent = this._renderMap();
      if (!mapContent) {
        // mapContent can be null if onDeckRender returns null
        // in this case we don't want to render the map
        return null;
      }

      const currentStyle = mapStyle.mapStyles?.[mapStyle.styleType];
      const baseMapLibraryName = getBaseMapLibrary(currentStyle);
      const baseMapLibraryConfig = getApplicationConfig().baseMapLibraryConfig[baseMapLibraryName];

      return (
        <StyledMap
          ref={this._ref}
          style={this.styleSelector(this.props)}
          onContextMenu={event => event.preventDefault()}
          $mixBlendMode={visState.overlayBlending}
          $mapLibCssClass={baseMapLibraryConfig.mapLibCssClass}
        >
          {mapContent}
        </StyledMap>
      );
    }
  }

  return withTheme(MapContainer);
}
