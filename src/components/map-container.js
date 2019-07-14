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

// libraries
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MapboxGLMap from 'react-map-gl';
import DeckGL from 'deck.gl';
import WebMercatorViewport from 'viewport-mercator-project';

// components
import MapPopoverFactory from 'components/map/map-popover';
import MapControlFactory from 'components/map/map-control';
import {StyledMapContainer} from 'components/common/styled-components';

import Draw from './editor';

// utils
import {generateMapboxLayers, updateMapboxLayers} from '../layers/mapbox-utils';
import {onWebGLInitialized, setLayerBlending} from 'utils/gl-utils';
import {transformRequest} from 'utils/map-style-utils/mapbox-utils';

// default-settings
import ThreeDBuildingLayer from '../deckgl-layers/3d-building-layer/3d-building-layer';

const Editor = styled(Draw)`
  display: ${props => props.visible ? 'default' : 'none'};
`;

const MAP_STYLE = {
  container: {
    display: 'inline-block',
    position: 'relative'
  },
  top: {
    position: 'absolute', top: '0px', pointerEvents: 'none'
  }
};

const MAPBOXGL_STYLE_UPDATE = 'style.load';
const MAPBOXGL_RENDER = 'render';
const TRANSITION_DURATION = 0;

MapContainerFactory.deps = [
  MapPopoverFactory,
  MapControlFactory
];

export default function MapContainerFactory(MapPopover, MapControl) {
  /* eslint-disable complexity */
  const MapTooltip = React.memo(({
                             mapState,
                             hoverInfo,
                             clicked,
                             datasets,
                             interactionConfig,
                             layers,
                             mapLayers,
                             mousePos: {mousePosition, coordinate, pinned}
                           }) => {
    if (!mousePosition) {
      return null;
    }

    // if clicked something, ignore hover behavior
    const objectInfo = clicked || hoverInfo;
    let layerHoverProp = null;
    let position = {x: mousePosition[0], y: mousePosition[1]};

    if (
      interactionConfig.tooltip.enabled &&
      objectInfo &&
      objectInfo.picked
    ) {
      // if anything hovered
      const {object, layer: overlay} = objectInfo;

      // deckgl layer to kepler-gl layer
      const layer = layers[overlay.props.idx];

      if (
        layer.config.isVisible &&
        layer.getHoverData &&
        (!mapLayers || mapLayers[layer.id].isVisible)
      ) {

        // if layer is visible and have hovered data
        const {config: {dataId}} = layer;
        const {allData, fields} = datasets[dataId];
        const data = layer.getHoverData(object, allData);
        const fieldsToShow = interactionConfig.tooltip.config.fieldsToShow[dataId];

        layerHoverProp = {
          data,
          fields,
          fieldsToShow,
          layer
        }
      }
    }

    if (pinned || clicked) {
      // project lnglat to screen so that tooltip follows the object on zoom
      const viewport = new WebMercatorViewport(mapState);
      const lngLat = clicked ? clicked.lngLat : pinned.coordinate;
      position = this._getHoverXY(viewport, lngLat);
    }
    return (
      <div>
        <MapPopover
          {...position}
          layerHoverProp={layerHoverProp}
          coordinate={interactionConfig.coordinate.enabled && ((pinned || {}).coordinate || coordinate)}
          freezed={Boolean(clicked || pinned)}
          onClose={this._onCloseMapPopover}
          mapW={mapState.width}
          mapH={mapState.height}
        />
      </div>
    );
  });
  /* eslint-enable complexity */

  class MapContainer extends Component {
    static propTypes = {
      // required
      datasets: PropTypes.object,
      interactionConfig: PropTypes.object.isRequired,
      layerBlending: PropTypes.string.isRequired,
      layerOrder: PropTypes.arrayOf(PropTypes.any).isRequired,
      layerData: PropTypes.arrayOf(PropTypes.any).isRequired,
      layers: PropTypes.arrayOf(PropTypes.any).isRequired,
      mapState: PropTypes.object.isRequired,
      uiState: PropTypes.object.isRequired,
      visState: PropTypes.object.isRequired,
      mapStyle: PropTypes.object.isRequired,
      mapControls: PropTypes.object.isRequired,
      mousePos: PropTypes.object.isRequired,
      mapboxApiAccessToken: PropTypes.string.isRequired,
      mapboxApiUrl: PropTypes.string,
      toggleMapControl: PropTypes.func.isRequired,
      visStateActions: PropTypes.object.isRequired,
      mapStateActions: PropTypes.object.isRequired,
      uiStateActions: PropTypes.object.isRequired,

      // optional
      isExport: PropTypes.bool,
      clicked: PropTypes.object,
      hoverInfo: PropTypes.object,
      mapLayers: PropTypes.object,
      onMapToggleLayer: PropTypes.func,
      onMapStyleLoaded: PropTypes.func,
      onMapRender: PropTypes.func,
      getMapboxRef: PropTypes.func
    };

    static defaultProps = {
      MapComponent: MapboxGLMap,
      deckGlProps: {}
    };

    constructor(props) {
      super(props);

      this.previousLayers = {
        // [layers.id]: mapboxLayerConfig
      };
    }

    componentWillUnmount() {
      // unbind mapboxgl event listener
      if (this._map) {
        this._map.off(MAPBOXGL_STYLE_UPDATE);
        this._map.off(MAPBOXGL_RENDER);
      }
    }

    /* component private functions */
    _onCloseMapPopover = () => {
      this.props.visStateActions.onLayerClick(null);
    };

    _onLayerSetDomain = (idx, colorDomain) => {
      this.props.visStateActions.layerConfigChange(this.props.layers[idx], {
        colorDomain
      });
    };

    _onWebGLInitialized = onWebGLInitialized;

    _handleMapToggleLayer = layerId => {
      const {index: mapIndex = 0, visStateActions} = this.props;
      visStateActions.toggleLayerForMap(mapIndex, layerId);
    };

    _onMapboxStyleUpdate = () => {
      // force refresh mapboxgl layers

      updateMapboxLayers(
        this._map,
        this._renderMapboxLayers(),
        this.previousLayers,
        this.props.mapLayers,
        {force: true}
      );

      if (typeof this.props.onMapStyleLoaded === 'function') {
        this.props.onMapStyleLoaded(this._map);
      }
    };

    _setMapboxMap = mapbox => {
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

    _onBeforeRender = ({gl}) => {
      setLayerBlending(gl, this.props.layerBlending);
    };

    /* component render functions */
    _getHoverXY(viewport, lngLat) {
      const screenCoord = !viewport || !lngLat ? null : viewport.project(lngLat);
      return screenCoord && {x: screenCoord[0], y: screenCoord[1]};
    }

    _shouldRenderLayer(layer, data, mapLayers) {
      const isAvailableAndVisible =
        !(mapLayers && mapLayers[layer.id]) || mapLayers[layer.id].isVisible;
      return layer.shouldRenderLayer(data) && isAvailableAndVisible;
    }

    _renderLayer = (overlays, idx) => {
      const {
        layers,
        layerData,
        hoverInfo,
        clicked,
        mapLayers,
        mapState,
        interactionConfig,
        mousePos
      } = this.props;
      const {mousePosition} = mousePos;
      const layer = layers[idx];
      const data = layerData[idx];

      const layerInteraction = {
        mousePosition,
        wrapLongitude: true
      };

      const objectHovered = clicked || hoverInfo;
      const layerCallbacks = {
        onSetLayerDomain: val => this._onLayerSetDomain(idx, val)
      };

      if (!this._shouldRenderLayer(layer, data, mapLayers)) {
        return overlays;
      }

      let layerOverlay = [];

      // Layer is Layer class
      if (typeof layer.renderLayer === 'function') {
        layerOverlay = layer.renderLayer({
          data,
          idx,
          layerInteraction,
          objectHovered,
          mapState,
          interactionConfig,
          layerCallbacks
        });
      }

      if (layerOverlay.length) {
        overlays = overlays.concat(layerOverlay);
      }
      return overlays;
    };

    _renderOverlay() {
      const {
        mapState,
        mapStyle,
        layerData,
        layerOrder,
        visStateActions,
        mapboxApiAccessToken,
        mapboxApiUrl,
        uiState
      } = this.props;

      let deckGlLayers = [];

      // wait until data is ready before render data layers
      if (layerData && layerData.length) {
        // last layer render first
        deckGlLayers = layerOrder
          .slice()
          .reverse()
          .reduce(this._renderLayer, []);
      }

      if (mapStyle.visibleLayerGroups['3d building']) {
        deckGlLayers.push(new ThreeDBuildingLayer({
          id: '_keplergl_3d-building',
          mapboxApiAccessToken,
          mapboxApiUrl,
          threeDBuildingColor: mapStyle.threeDBuildingColor
        }));
      }

      const isEdit = uiState.mapControls.mapDraw.active;

      return (
        <DeckGL
          {...this.props.deckGlProps}
          viewState={mapState}
          id="default-deckgl-overlay"
          layers={deckGlLayers}
          onWebGLInitialized={this._onWebGLInitialized}
          onBeforeRender={this._onBeforeRender}
          onHover={visStateActions.onLayerHover}
          onClick={visStateActions.onLayerClick}
          style={{zIndex: isEdit ? -1 : 0}}
        />
      );
    }

    _renderMapboxLayers() {
      const {
        layers,
        layerData,
        layerOrder
      } = this.props;

      return generateMapboxLayers(layers, layerData, layerOrder);
    }

    _renderMapboxOverlays() {
      if (this._map && this._map.isStyleLoaded()) {

        const mapboxLayers = this._renderMapboxLayers();

        updateMapboxLayers(
          this._map,
          mapboxLayers,
          this.previousLayers,
          this.props.mapLayers
        );

        this.previousLayers = mapboxLayers.reduce((final, layer) => ({
          ...final,
          [layer.id]: layer.config
        }), {})
      }
    }

    _onViewportChange = (viewState) => {
      if (typeof this.props.onViewStateChange === 'function') {
        this.props.onViewStateChange(viewState);
      }
      this.props.mapStateActions.updateMap(viewState);
    };

    render() {
      const {
        mapState, mapStyle, mapStateActions, mapLayers, layers, MapComponent,
        datasets, mapboxApiAccessToken, mapboxApiUrl, mapControls,
        uiState, uiStateActions, visState, visStateActions,
        hoverInfo, clicked, interactionConfig,
        mousePos
      } = this.props;

      if (!mapStyle.bottomMapStyle) {
        // style not yet loaded
        return <div/>;
      }

      const mapProps = {
        ...mapState,
        preserveDrawingBuffer: true,
        mapboxApiAccessToken,
        mapboxApiUrl,
        onViewportChange: this._onViewportChange,
        transformRequest
      };

      const isEdit = uiState.mapControls.mapDraw.active;

      return (
        <StyledMapContainer style={MAP_STYLE.container}>
          <MapControl
            datasets={datasets}
            dragRotate={mapState.dragRotate}
            isSplit={mapState.isSplit}
            isExport={this.props.isExport}
            layers={layers}
            mapIndex={this.props.index}
            mapLayers={mapLayers}
            mapControls={mapControls}
            scale={mapState.scale || 1}
            top={0}
            editor={uiState.editor}
            onTogglePerspective={mapStateActions.togglePerspective}
            onToggleSplitMap={mapStateActions.toggleSplitMap}
            onMapToggleLayer={this._handleMapToggleLayer}
            onToggleMapControl={uiStateActions.toggleMapControl}
            onSetEditorMode={uiStateActions.setEditorMode}
          />
          <div>
            <MapComponent
              {...mapProps}
              key="bottom"
              ref={this._setMapboxMap}
              mapStyle={mapStyle.bottomMapStyle}
              getCursor={this.props.hoverInfo ? () => 'pointer' : undefined}
              transitionDuration={TRANSITION_DURATION}
            >
              {this._renderOverlay()}
              {this._renderMapboxOverlays()}
              {/*
                By placing the editor in this map we have to perform fewer checks for css zIndex
                and fewer updates when we switch from edit to read mode
              */}
              <Editor
                editor={uiState.editor}
                features={visState.editor.features}
                isEnabled={isEdit}
                onDeleteFeature={uiStateActions.deleteFeature}
                onSelect={uiStateActions.setSelectedFeature}
                onUpdate={visStateActions.setFeatures}
                style={{zIndex: isEdit ? 0 : -1}}
              />
            </MapComponent>
          </div>
          {mapStyle.topMapStyle && (
            <div style={MAP_STYLE.top}>
              <MapComponent
                {...mapProps}
                key="top"
                mapStyle={mapStyle.topMapStyle}
              />
            </div>
          )}
          <MapTooltip
            mapState={mapState}
            hoverInfo={hoverInfo}
            clicked={clicked}
            datasets={datasets}
            interactionConfig={interactionConfig}
            layers={layers}
            mapLayers={mapLayers}
            mousePos={mousePos}
          />
        </StyledMapContainer>
      );
    }
  }

  return MapContainer;
}
