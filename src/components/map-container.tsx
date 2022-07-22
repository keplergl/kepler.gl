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

// libraries
import React, {Component, createRef} from 'react';
import MapboxGLMap, {MapRef} from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {createSelector} from 'reselect';
import WebMercatorViewport from 'viewport-mercator-project';
import {errorNotification} from 'utils/notifications-utils';

import * as VisStateActions from 'actions/vis-state-actions';
import * as MapStateActions from 'actions/map-state-actions';
import * as UIStateActions from 'actions/ui-state-actions';

// components
import MapPopoverFactory from 'components/map/map-popover';
import MapControlFactory from 'components/map/map-control';
import {StyledMapContainer, StyledAttrbution} from 'components/common/styled-components';

import EditorFactory from './editor/editor';

// utils
import {generateMapboxLayers, updateMapboxLayers} from 'layers/mapbox-utils';
import {setLayerBlending} from 'utils/gl-utils';
import {transformRequest} from 'utils/map-style-utils/mapbox-utils';
import {
  getLayerHoverProp,
  renderDeckGlLayer,
  prepareLayersToRender,
  prepareLayersForDeck,
  LayerHoverProp
} from 'utils/layer-utils';

// default-settings
import {ThreeDBuildingLayer} from '@kepler.gl/deckgl-layers';
import {FILTER_TYPES, GEOCODER_LAYER_ID, THROTTLE_NOTIFICATION_TIME} from '@kepler.gl/constants';

import ErrorBoundary from 'components/common/error-boundary';
import {observeDimensions, unobserveDimensions} from '../utils/observe-dimensions';
import {LOCALE_CODES} from 'localization/locales';
import {
  Datasets,
  Filter,
  InteractionConfig,
  MapControls,
  MapState,
  MapStyle,
  Viewport
} from 'reducers';
import {Layer} from 'layers';
import {SplitMapLayers} from 'reducers/vis-state-updaters';
import {LayerBaseConfig, VisualChannelDomain} from 'layers/base-layer';

/** @type {{[key: string]: React.CSSProperties}} */
const MAP_STYLE: {[key: string]: React.CSSProperties} = {
  container: {
    display: 'inline-block',
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  top: {
    position: 'absolute',
    top: '0px',
    pointerEvents: 'none',
    width: '100%',
    height: '100%'
  }
};

const MAPBOXGL_STYLE_UPDATE = 'style.load';
const MAPBOXGL_RENDER = 'render';
const TRANSITION_DURATION = 0;
const nop = () => {};

export const Attribution = () => (
  <StyledAttrbution>
    <div className="attrition-logo">
      Basemap by:
      <a
        className="mapboxgl-ctrl-logo"
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.mapbox.com/"
        aria-label="Mapbox logo"
      />
    </div>
    <div className="attrition-link">
      <a href="https://kepler.gl/policy/" target="_blank" rel="noopener noreferrer">
        © kepler.gl |{' '}
      </a>
      <a href="https://www.mapbox.com/about/maps/" target="_blank" rel="noopener noreferrer">
        © Mapbox |{' '}
      </a>
      <a href="http://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
        © OpenStreetMap |{' '}
      </a>
      <a href="https://www.mapbox.com/map-feedback/" target="_blank" rel="noopener noreferrer">
        <strong>Improve this map</strong>
      </a>
    </div>
  </StyledAttrbution>
);

MapContainerFactory.deps = [MapPopoverFactory, MapControlFactory, EditorFactory];

type MapboxStyle = string | object | undefined;

interface MapContainerProps {
  datasets: Datasets;
  interactionConfig: InteractionConfig;
  layerBlending: string;
  layerOrder: number[];
  layerData: any[];
  layers: Layer[];
  filters: Filter[];
  mapState: MapState;
  mapControls: MapControls;
  mapStyle: {bottomMapStyle?: MapboxStyle; topMapStyle?: MapboxStyle} & MapStyle;
  mousePos: any;
  mapboxApiAccessToken: string;
  mapboxApiUrl: string;
  visStateActions: typeof VisStateActions;
  mapStateActions: typeof MapStateActions;
  uiStateActions: typeof UIStateActions;

  // optional
  primary?: boolean; // primary one will be reporting its size to appState
  readOnly?: boolean;
  isExport?: boolean;
  clicked?: any;
  hoverInfo?: any;
  mapLayers?: SplitMapLayers | null;
  onMapToggleLayer?: Function;
  onMapStyleLoaded?: Function;
  onMapRender?: Function;
  getMapboxRef?: (mapbox?: MapRef | null, index?: number) => void;
  index?: number;

  locale?: any;
  editor?: any;
  MapComponent?: typeof MapboxGLMap;
  deckGlProps?: any;
  onDeckInitialized?: (a: any, b: any) => void;
  onViewStateChange?: (viewport: Viewport) => void;
}

export default function MapContainerFactory(
  MapPopover,
  MapControl,
  Editor
): React.ComponentType<MapContainerProps> {
  class MapContainer extends Component<MapContainerProps> {
    displayName = 'MapContainer';
    static defaultProps = {
      MapComponent: MapboxGLMap,
      deckGlProps: {},
      index: 0,
      primary: true
    };

    constructor(props) {
      super(props);
    }

    componentDidMount() {
      if (!this._ref.current) {
        return;
      }
      observeDimensions(this._ref.current, this._handleResize);
    }

    componentWillUnmount() {
      // unbind mapboxgl event listener
      if (this._map) {
        this._map?.off(MAPBOXGL_STYLE_UPDATE, nop);
        this._map?.off(MAPBOXGL_RENDER, nop);
      }
      if (!this._ref.current) {
        return;
      }
      unobserveDimensions(this._ref.current);
    }

    _deck: any = null;
    _map: mapboxgl.Map | null = null;
    _ref = createRef<HTMLDivElement>();
    _deckGLErrorsElapsed: {[id: string]: number} = {};

    previousLayers = {
      // [layers.id]: mapboxLayerConfig
    };

    _handleResize = dimensions => {
      const {primary} = this.props;
      if (primary) {
        const {mapStateActions} = this.props;
        if (dimensions && dimensions.width > 0 && dimensions.height > 0) {
          mapStateActions.updateMap(dimensions);
        }
      }
    };

    layersSelector = props => props.layers;
    layerDataSelector = props => props.layerData;
    mapLayersSelector = props => props.mapLayers;
    layerOrderSelector = props => props.layerOrder;
    layersToRenderSelector = createSelector(
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
    filtersSelector = props => props.filters;
    polygonFilters = createSelector(this.filtersSelector, filters =>
      filters.filter(f => f.type === FILTER_TYPES.polygon)
    );

    mapboxLayersSelector = createSelector(
      this.layersSelector,
      this.layerDataSelector,
      this.layerOrderSelector,
      this.layersToRenderSelector,
      generateMapboxLayers
    );

    /* component private functions */
    _onCloseMapPopover = () => {
      this.props.visStateActions.onLayerClick(null);
    };

    _onLayerSetDomain = (idx: number, colorDomain: VisualChannelDomain) => {
      this.props.visStateActions.layerConfigChange(this.props.layers[idx], {
        colorDomain
      } as Partial<LayerBaseConfig>);
    };

    _handleMapToggleLayer = layerId => {
      const {index: mapIndex = 0, visStateActions} = this.props;
      visStateActions.toggleLayerForMap(mapIndex, layerId);
    };

    _onMapboxStyleUpdate = () => {
      // force refresh mapboxgl layers
      this.previousLayers = {};
      this._updateMapboxLayers();

      if (typeof this.props.onMapStyleLoaded === 'function') {
        this.props.onMapStyleLoaded(this._map);
      }
    };

    _setMapboxMap: React.Ref<MapRef> = mapbox => {
      if (!this._map && mapbox) {
        this._map = mapbox.getMap();
        // i noticed in certain context we don't access the actual map element
        if (!this._map) {
          return;
        }
        // bind mapboxgl event listener
        this._map.on(MAPBOXGL_STYLE_UPDATE, this._onMapboxStyleUpdate);

        this._map.on(MAPBOXGL_RENDER, () => {
          if (typeof this.props.onMapRender === 'function') {
            this.props.onMapRender(this._map);
          }
        });
      }

      if (this.props.getMapboxRef) {
        // The parent component can gain access to our MapboxGlMap by
        // providing this callback. Note that 'mapbox' will be null when the
        // ref is unset (e.g. when a split map is closed).
        this.props.getMapboxRef(mapbox, this.props.index);
      }
    };

    _onDeckInitialized(gl) {
      if (this.props.onDeckInitialized) {
        this.props.onDeckInitialized(this._deck, gl);
      }
    }

    _onBeforeRender = ({gl}) => {
      setLayerBlending(gl, this.props.layerBlending);
    };

    _onDeckError = (error, layer) => {
      const errorMessage = `An error in deck.gl: ${error.message} in ${layer.id}`;
      const notificationId = `${layer.id}-${error.message}`;

      // Throttle error notifications, as React doesn't like too many state changes from here.
      const lastShown = this._deckGLErrorsElapsed[notificationId];
      if (!lastShown || lastShown < Date.now() - THROTTLE_NOTIFICATION_TIME) {
        this._deckGLErrorsElapsed[notificationId] = Date.now();

        // Create new error notification or update existing one with same id.
        // Update is required to preserve the order of notifications as they probably are going to "jump" based on order of errors.
        const {uiStateActions} = this.props;
        uiStateActions.addNotification(
          errorNotification({
            message: errorMessage,
            id: notificationId
          })
        );
      }
    };

    /* component render functions */

    /* eslint-disable complexity */
    _renderMapPopover() {
      // TODO: move this into reducer so it can be tested
      const {
        mapState,
        hoverInfo,
        clicked,
        datasets,
        interactionConfig,
        layers,
        mousePos: {mousePosition, coordinate, pinned}
      } = this.props;
      const layersToRender = this.layersToRenderSelector(this.props);

      if (!mousePosition || !interactionConfig.tooltip) {
        return null;
      }

      const layerHoverProp = getLayerHoverProp({
        interactionConfig,
        hoverInfo,
        layers,
        layersToRender,
        datasets
      });

      const compareMode = interactionConfig.tooltip.config
        ? interactionConfig.tooltip.config.compareMode
        : false;

      let pinnedPosition = {};
      let layerPinnedProp: LayerHoverProp | null = null;
      if (pinned || clicked) {
        // project lnglat to screen so that tooltip follows the object on zoom
        const viewport = new WebMercatorViewport(mapState);
        const lngLat = clicked ? clicked.coordinate : pinned.coordinate;
        pinnedPosition = this._getHoverXY(viewport, lngLat);
        layerPinnedProp = getLayerHoverProp({
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

    _renderDeckOverlay(layersForDeck, options = {primaryMap: false}) {
      const {
        mapState,
        mapStyle,
        layerData,
        layerOrder,
        layers,
        visStateActions,
        mapboxApiAccessToken,
        mapboxApiUrl
      } = this.props;

      // initialise layers from props if exists
      let deckGlLayers = this.props.deckGlProps?.layers || [];

      // wait until data is ready before render data layers
      if (layerData && layerData.length) {
        // last layer render first
        const dataLayers = layerOrder
          .slice()
          .reverse()
          .filter(idx => layersForDeck[layers[idx].id])
          .reduce((overlays, idx) => {
            const layerCallbacks = {
              onSetLayerDomain: val => this._onLayerSetDomain(idx, val)
            };
            const layerOverlay = renderDeckGlLayer(this.props, layerCallbacks, idx);
            return overlays.concat(layerOverlay || []);
          }, []);
        deckGlLayers = deckGlLayers.concat(dataLayers);
      }

      if (mapStyle.visibleLayerGroups['3d building'] && options.primaryMap) {
        deckGlLayers.push(
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

      return (
        <DeckGL
          {...this.props.deckGlProps}
          viewState={mapState}
          id="default-deckgl-overlay"
          layers={deckGlLayers}
          onBeforeRender={this._onBeforeRender}
          onHover={visStateActions.onLayerHover}
          onClick={visStateActions.onLayerClick}
          onError={this._onDeckError}
          ref={comp => {
            if (comp && comp.deck && !this._deck) {
              this._deck = comp.deck;
            }
          }}
          onWebGLInitialized={gl => this._onDeckInitialized(gl)}
        />
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

    _renderDrawEditor() {
      const {layers, datasets, mapControls, visStateActions, editor, index} = this.props;
      const isEdit = mapControls.mapDraw ? mapControls.mapDraw.active : false;
      const layersToRender = this.layersToRenderSelector(this.props);

      return (
        <Editor
          index={index}
          datasets={datasets}
          editor={editor}
          filters={this.polygonFilters(this.props)}
          isEnabled={isEdit}
          layers={layers}
          layersToRender={layersToRender}
          onDeleteFeature={visStateActions.deleteFeature}
          onSelect={visStateActions.setSelectedFeature}
          onUpdate={visStateActions.setFeatures}
          onTogglePolygonFilter={visStateActions.setPolygonFilterLayer}
          style={{
            pointerEvents: isEdit ? 'all' : 'none',
            position: 'absolute',
            display: editor.visible ? 'block' : 'none'
          }}
        />
      );
    }

    _onViewportChange = viewState => {
      const {width, height, ...restViewState} = viewState;
      const {primary} = this.props;
      // react-map-gl sends 0,0 dimensions during initialization
      // after we have received proper dimensions from observeDimensions
      const next = {
        ...(width > 0 && height > 0 ? viewState : restViewState),
        // enabling transition in two maps may lead to endless update loops
        transitionDuration: primary ? TRANSITION_DURATION : 0
      };
      if (typeof this.props.onViewStateChange === 'function') {
        this.props.onViewStateChange(next);
      }
      this.props.mapStateActions.updateMap(next);
    };

    _toggleMapControl = panelId => {
      const {index, uiStateActions} = this.props;

      uiStateActions.toggleMapControl(panelId, Number(index));
    };

    /* eslint-disable complexity */
    _renderMap() {
      const {
        mapState,
        mapStyle,
        mapStateActions,
        layers,
        MapComponent = MapboxGLMap,
        datasets,
        mapboxApiAccessToken,
        mapboxApiUrl,
        mapControls,
        isExport,
        locale,
        uiStateActions,
        visStateActions,
        interactionConfig,
        editor,
        index,
        primary
      } = this.props;

      const layersToRender = this.layersToRenderSelector(this.props);
      const layersForDeck = this.layersForDeckSelector(this.props);

      const mapProps = {
        ...mapState,
        width: '100%',
        height: '100%',
        preserveDrawingBuffer: true,
        mapboxApiAccessToken,
        mapboxApiUrl,
        onViewportChange: this._onViewportChange,
        transformRequest
      };

      const hasGeocoderLayer = layers.find(l => l.id === GEOCODER_LAYER_ID);
      const isSplit = Boolean(mapState.isSplit);

      return (
        <>
          <MapControl
            datasets={datasets}
            availableLocales={Object.keys(LOCALE_CODES)}
            dragRotate={mapState.dragRotate}
            isSplit={isSplit}
            primary={primary}
            isExport={isExport}
            layers={layers}
            layersToRender={layersToRender}
            mapIndex={index}
            mapControls={mapControls}
            readOnly={this.props.readOnly}
            scale={mapState.scale || 1}
            top={interactionConfig.geocoder && interactionConfig.geocoder.enabled ? 52 : 0}
            editor={editor}
            locale={locale}
            onTogglePerspective={mapStateActions.togglePerspective}
            onToggleSplitMap={mapStateActions.toggleSplitMap}
            onMapToggleLayer={this._handleMapToggleLayer}
            onToggleMapControl={this._toggleMapControl}
            onSetEditorMode={visStateActions.setEditorMode}
            onSetLocale={uiStateActions.setLocale}
            onToggleEditorVisibility={visStateActions.toggleEditorVisibility}
            mapHeight={mapState.height}
          />
          <MapComponent
            {...mapProps}
            key="bottom"
            ref={this._setMapboxMap}
            mapStyle={mapStyle.bottomMapStyle}
            getCursor={this.props.hoverInfo ? () => 'pointer' : undefined}
            onMouseMove={this.props.visStateActions.onMouseMove}
          >
            {this._renderDeckOverlay(layersForDeck, {primaryMap: true})}
            {this._renderMapboxOverlays()}
            {this._renderDrawEditor()}
          </MapComponent>
          {mapStyle.topMapStyle || hasGeocoderLayer ? (
            <div style={MAP_STYLE.top}>
              <MapComponent {...mapProps} key="top" mapStyle={mapStyle.topMapStyle}>
                {this._renderDeckOverlay({[GEOCODER_LAYER_ID]: hasGeocoderLayer})}
              </MapComponent>
            </div>
          ) : null}
          {this._renderMapPopover()}
          {!isSplit || index === 1 ? <Attribution /> : null}
        </>
      );
    }

    render() {
      const {mapStyle} = this.props;
      return (
        <StyledMapContainer ref={this._ref} style={MAP_STYLE.container}>
          {mapStyle.bottomMapStyle && this._renderMap()}
        </StyledMapContainer>
      );
    }
  }

  return MapContainer;
}
