// Copyright (c) 2018 Uber Technologies, Inc.
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
import MapboxGLMap from 'react-map-gl';
import DeckGL from 'deck.gl';
import {GL} from 'luma.gl';
import {registerShaderModules, setParameters} from 'luma.gl';
import pickingModule from 'shaderlib/picking-module';
import brushingModule from 'shaderlib/brushing-module';

// components
import MapPopoverFactory from 'components/map/map-popover';
import MapControlFactory from 'components/map/map-control';
import {StyledMapContainer} from 'components/common/styled-components';

// Overlay type
import {generateMapboxLayers, updateMapboxLayers} from '../layers/mapbox-utils';

import {transformRequest} from 'utils/map-style-utils/mapbox-utils';

// default-settings
import {LAYER_BLENDINGS} from 'constants/default-settings';

const MAP_STYLE = {
  container: {
    display: 'inline-block',
    position: 'relative'
  },
  top: {
    position: 'absolute', top: '0px', pointerEvents: 'none'
  }
};

const getGlConst = d => GL[d];

const MAPBOXGL_STYLE_UPDATE = 'style.load';
MapContainerFactory.deps = [
  MapPopoverFactory, MapControlFactory];

export default function MapContainerFactory(MapPopover, MapControl) {
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
      mapStyle: PropTypes.object.isRequired,
      mapControls: PropTypes.object.isRequired,
      mapboxApiAccessToken: PropTypes.string.isRequired,
      toggleMapControl: PropTypes.func.isRequired,
      visStateActions: PropTypes.object.isRequired,
      mapStateActions: PropTypes.object.isRequired,

      // optional
      isExport: PropTypes.bool,
      clicked: PropTypes.object,
      hoverInfo: PropTypes.object,
      mapLayers: PropTypes.object,
      onMapToggleLayer: PropTypes.func,
      onMapStyleLoaded: PropTypes.func,
      onMapRender: PropTypes.func
    };

    static defaultProps = {
      MapComponent: MapboxGLMap
    };

    constructor(props) {
      super(props);
      this.state = {
        mousePosition: [0, 0]
      };
      this.previousLayers = {
        // [layers.id]: mapboxLayerConfig
      };
    }

    componentWillUnmount() {
      // unbind mapboxgl event listener
      if (this._map) {
        this._map.off(MAPBOXGL_STYLE_UPDATE);
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

    _onWebGLInitialized = gl => {
      registerShaderModules(
        [pickingModule, brushingModule], {
          ignoreMultipleRegistrations: true
      });

      // allow Uint32 indices in building layer
      // gl.getExtension('OES_element_index_uint');
    };

    _onMouseMove = evt => {
      const {interactionConfig: {brush}} = this.props;

      if (evt.nativeEvent && brush.enabled) {
        this.setState({
          mousePosition: [evt.nativeEvent.offsetX, evt.nativeEvent.offsetY]
        });
      }
    };

    _handleMapToggleLayer = layerId => {
      const {index: mapIndex = 0, visStateActions} = this.props;
      visStateActions.toggleLayerForMap(mapIndex, layerId);
    };

    _setMapboxMap = (mapbox) => {
      if (!this._map && mapbox) {
        this._map = mapbox.getMap();
        // bind mapboxgl event listener
        this._map.on(MAPBOXGL_STYLE_UPDATE, () => {
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
        });

        this._map.on('render', () => {
          if (typeof this.props.onMapRender === 'function') {
            this.props.onMapRender(this._map);
          }
        });
      }
    }

    _onBeforeRender = ({gl}) => {
      this._setlayerBlending(gl);
    };

    _setlayerBlending = gl => {
      const blending = LAYER_BLENDINGS[this.props.layerBlending];
      const {blendFunc, blendEquation} = blending;

      setParameters(gl, {
        [GL.BLEND]: true,
        ...(blendFunc ? {
          blendFunc: blendFunc.map(getGlConst),
          blendEquation: Array.isArray(blendEquation) ? blendEquation.map(getGlConst) : getGlConst(blendEquation)
        } : {})
      });
    };

    /* component render functions */
    /* eslint-disable complexity */
    _renderObjectLayerPopover() {
      // TODO: move this into reducer so it can be tested
      const {
        mapState,
        hoverInfo,
        clicked,
        datasets,
        interactionConfig,
        layers,
        mapLayers
      } = this.props;

      // if clicked something, ignore hover behavior
      const objectInfo = clicked || hoverInfo;
      if (
        !interactionConfig.tooltip.enabled ||
        !objectInfo ||
        !objectInfo.picked
      ) {
        // nothing hovered
        return null;
      }

      const {lngLat, object, layer: overlay} = objectInfo;

      // deckgl layer to kepler-gl layer
      const layer = layers[overlay.props.idx];

      if (
        !layer ||
        !layer.config.isVisible ||
        !object ||
        !layer.getHoverData ||
        (mapLayers && !mapLayers[layer.id].isVisible)
      ) {
        // layer is not visible
        return null;
      }

      const {config: {dataId}} = layer;
      const {allData, fields} = datasets[dataId];
      const data = layer.getHoverData(object, allData);

      // project lnglat to screen so that tooltip follows the object on zoom
      const {viewport} = overlay.context;
      const {x, y} = this._getHoverXY(viewport, lngLat) || objectInfo;

      const popoverProps = {
        data,
        fields,
        fieldsToShow: interactionConfig.tooltip.config.fieldsToShow[dataId],
        layer,
        isVisible: true,
        x,
        y,
        freezed: Boolean(clicked),
        onClose: this._onCloseMapPopover,
        mapState
      };

      return (
        <div>
          <MapPopover {...popoverProps} />
        </div>
      );
    }

    /* eslint-enable complexity */

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
        interactionConfig
      } = this.props;
      const {mousePosition} = this.state;
      const layer = layers[idx];
      const data = layerData[idx];

      const layerInteraction = {
        mousePosition
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
        layerData,
        layerOrder,
        visStateActions
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

      return (
        <DeckGL
          viewState={mapState}
          id="default-deckgl-overlay"
          layers={deckGlLayers}
          onWebGLInitialized={this._onWebGLInitialized}
          onBeforeRender={this._onBeforeRender}
          onLayerHover={visStateActions.onLayerHover}
          onLayerClick={visStateActions.onLayerClick}
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

    render() {
      const {mapState, mapStyle, mapStateActions} = this.props;
      const {updateMap, onMapClick} = mapStateActions;

      if (!mapStyle.bottomMapStyle) {
        // style not yet loaded
        return <div/>;
      }

      const {mapLayers, layers, datasets, mapboxApiAccessToken,
        mapControls, toggleMapControl} = this.props;

      const mapProps = {
        ...mapState,
        preserveDrawingBuffer: true,
        mapboxApiAccessToken,
        onViewportChange: updateMap,
        transformRequest
      };

      return (
        <StyledMapContainer style={MAP_STYLE.container} onMouseMove={this._onMouseMove}>
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
            onTogglePerspective={mapStateActions.togglePerspective}
            onToggleSplitMap={mapStateActions.toggleSplitMap}
            onMapToggleLayer={this._handleMapToggleLayer}
            onToggleFullScreen={mapStateActions.toggleFullScreen}
            onToggleMapControl={toggleMapControl}
          />
          <this.props.MapComponent
            {...mapProps}
            key="bottom"
            ref={this._setMapboxMap}
            mapStyle={mapStyle.bottomMapStyle}
            onClick={onMapClick}
            getCursor={this.props.hoverInfo ? () => 'pointer' : undefined}
          >
            {this._renderOverlay()}
            {this._renderMapboxOverlays()}
          </this.props.MapComponent>
          {mapStyle.topMapStyle && (
            <div style={MAP_STYLE.top}>
              <this.props.MapComponent
                {...mapProps}
                key="top"
                mapStyle={mapStyle.topMapStyle}
              />
            </div>
          )}
          {this._renderObjectLayerPopover()}
        </StyledMapContainer>
      );
    }
  }

  return MapContainer;
}
