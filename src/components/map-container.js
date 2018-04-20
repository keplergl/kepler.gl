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

// components
import MapPopoverFactory from 'components/map/map-popover';
import MapControlFactory from 'components/map/map-control';
import {StyledMapContainer} from 'components/common/styled-components';

// Overlay type
import {generateMapboxLayers, updateMapboxLayers} from '../layers/mapbox-utils';

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
      data: PropTypes.arrayOf(PropTypes.any),
      fields: PropTypes.arrayOf(PropTypes.any),
      interactionConfig: PropTypes.object.isRequired,
      layerBlending: PropTypes.string.isRequired,
      layerData: PropTypes.arrayOf(PropTypes.any).isRequired,
      layers: PropTypes.arrayOf(PropTypes.any).isRequired,
      mapState: PropTypes.object.isRequired,
      mapStyle: PropTypes.object.isRequired,

      // optional
      mapLayers: PropTypes.object,
      onMapToggleLayer: PropTypes.func
    };

    constructor(props) {
      super(props);
      this.state = {
        reRenderKey: 0,
        gl: null,
        mousePosition: [0, 0]
      };
      this.previousLayers = {
        // [layers.id]: mapboxLayerConfig
      };
    }

    componentWillReceiveProps(nextProps) {
      if (
        this.props.mapState.dragRotate !== nextProps.mapState.dragRotate ||
        this.props.layerBlending !== nextProps.layerBlending
      ) {
        // increment rerender key to force gl reinitialize when
        // perspective or layer blending changed
        // TODO: layer blending can now be implemented per layer base
        this.setState({
          reRenderKey: this.state.reRenderKey + 1
        });
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if (!this._map && this.refs.mapbox) {
        this._map = this.refs.mapbox.getMap();
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
        })
      }
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
      // enable depth test for perspective mode
      if (this.props.mapState.dragRotate) {
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
      } else {
        gl.disable(gl.DEPTH_TEST);
      }

      // allow Uint32 indices in building layer
      gl.getExtension('OES_element_index_uint');

      this._togglelayerBlending(gl);

      this.setState({gl});
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

    /* deck.gl doesn't support blendFuncSeparate yet
     * so we're applying the blending ourselves
    */
    _togglelayerBlending = gl => {
      const blending = LAYER_BLENDINGS[this.props.layerBlending];
      const {
        enable,
        blendFunc,
        blendEquation,
        blendFuncSeparate,
        blendEquationSeparate
      } = blending;

      if (enable) {
        gl.enable(GL.BLEND);
        if (blendFunc) {
          gl.blendFunc(...blendFunc.map(getGlConst));
          gl.blendEquation(GL[blendEquation]);
        } else {
          gl.blendFuncSeparate(...blendFuncSeparate.map(getGlConst));
          gl.blendEquationSeparate(...blendEquationSeparate.map(getGlConst));
        }
      } else {
        gl.disable(GL.BLEND);
      }
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
        visStateActions,
        interactionConfig
      } = this.props;
      const {mousePosition} = this.state;
      const layer = layers[idx];
      const data = layerData[idx];

      const layerInteraction = {
        onHover: visStateActions.onLayerHover,
        onClick: visStateActions.onLayerClick,
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
        layerOrder
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
          {...mapState}
          id="default-deckgl-overlay"
          layers={deckGlLayers}
          key={this.state.reRenderKey}
          onWebGLInitialized={this._onWebGLInitialized}
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

      const {mapLayers, layers, datasets, index, mapboxApiAccessToken} = this.props;

      const mapProps = {
        ...mapState,
        preserveDrawingBuffer: true,
        mapboxApiAccessToken,
        onViewportChange: updateMap
      };

      return (
        <StyledMapContainer style={MAP_STYLE.container} onMouseMove={this._onMouseMove}>
          <MapControl
            index={index}
            datasets={datasets}
            dragRotate={mapState.dragRotate}
            isSplit={mapState.isSplit}
            layers={layers}
            mapIndex={this.props.index}
            mapLayers={mapLayers}
            onTogglePerspective={mapStateActions.togglePerspective}
            onToggleSplitMap={mapStateActions.toggleSplitMap}
            onMapToggleLayer={this._handleMapToggleLayer}
            onToggleFullScreen={mapStateActions.toggleFullScreen}
            top={0}
          />
          <MapboxGLMap
            {...mapProps}
            key="bottom"
            ref="mapbox"
            mapStyle={mapStyle.bottomMapStyle}
            onClick={onMapClick}
          >
            {this._renderOverlay()}
            {this._renderMapboxOverlays()}
          </MapboxGLMap>
          {mapStyle.topMapStyle && (
            <div style={MAP_STYLE.top}>
              <MapboxGLMap
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
