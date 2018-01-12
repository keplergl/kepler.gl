// libraries
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MapboxGLMap from 'react-map-gl';
import geoViewport from '@mapbox/geo-viewport';
import DeckGL from 'deck.gl';
import {GL} from 'luma.gl';
import throttle from 'lodash.throttle';

// components
import MapPopover from 'components/map/map-popover';
import MapControl from 'components/map-control';

// deckgl layers
import {PolygonLayer} from 'deck.gl';

// default-settings
import {
  MAPBOX_ACCESS_TOKEN,
  LAYER_BLENDINGS
} from 'constants/default-settings';

// utils
import {getLightSettingsFromBounds} from 'utils/layer-utils/layer-utils';

const MAP_STYLE = {
  container: {
    display: 'inline-block',
    position: 'relative'
  },
  top: {position: 'absolute', top: '0px', pointerEvents: 'none'}
};

const getGlConst = d => GL[d];

const propTypes = {
  // required
  data: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
  interactionConfig: PropTypes.object.isRequired,
  layerBlending: PropTypes.string.isRequired,
  layerData: PropTypes.array.isRequired,
  layers: PropTypes.array.isRequired,
  mapState: PropTypes.object.isRequired,
  mapStyle: PropTypes.object.isRequired,
  popoverOffset: PropTypes.object.isRequired,

  // optional
  mapLayers: React.PropTypes.object,
  onMapToggleLayer: React.PropTypes.func
};

export default class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasBuildingLayer: false,
      reRenderKey: 0,
      gl: null,
      mousePosition: [0, 0]
    };

    this.loadBuildingTiles = throttle(this.loadBuildingTiles, 100);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.mapState.dragRotate !== nextProps.mapState.dragRotate ||
      this.props.layerBlending !== nextProps.layerBlending) {
      // increment rerender key to force gl reinitialize when
      // perspective or layer blending changed
      // TODO: layer blending can now be implemented per layer base
      this.setState({
        reRenderKey: this.state.reRenderKey + 1
      });
    }
    if (this.props.mapStyle !== nextProps.mapStyle) {
      this.setState({
        hasBuildingLayer: nextProps.mapStyle.buildingLayer.isVisible
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.mapState.dragRotate && this.state.hasBuildingLayer &&
        this.props.mapState !== prevProps.mapState) {
      this.loadBuildingTiles(this.props.mapState);
    }
  }

  /* component actions */
  loadBuildingTiles(mapState) {
    this.props.buildingDataActions.loadBuildingTile(mapState);
  }

  /* component private functions */

  _onCloseMapPopover = () => {
    this.props.visStateActions.onLayerClick(null);
  };

  _onLayerSetDomain = (idx, colorDomain) => {
    this.props.visStateActions.layerConfigChange(
      this.props.layers[idx], {colorDomain}
    );
  };

  _onWebGLInitialized = (gl) => {
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
      this.setState({mousePosition: [evt.nativeEvent.offsetX, evt.nativeEvent.offsetY]});
    }
  };

  _handleMapToggleLayer = (layerId) => {
    const {index: mapIndex = 0, visStateActions} = this.props;
    visStateActions.toggleLayerForMap(mapIndex, layerId);
  };

  /* deck.gl doesn't support blendFuncSeparate yet
   * so we're applying the blending ourselves
  */
  _togglelayerBlending = (gl) => {
    const blending = LAYER_BLENDINGS[this.props.layerBlending];
    const {
      enable,
      blendFunc, blendEquation,
      blendFuncSeparate, blendEquationSeparate
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
  }

  /* component render functions */
  /* eslint-disable complexity */
  _renderObjectLayerPopover() {

    // TODO: move this into reducer so it can be tested
    const {hoverInfo, clicked, datasets, interactionConfig, layers, mapLayers, popoverOffset} = this.props;

    // if clicked something, ignore hover behavior
    const objectInfo = clicked || hoverInfo;
    if (!interactionConfig.tooltip.enabled || !objectInfo || !objectInfo.picked) {
      // nothing hovered
      return null;
    }

    const {lngLat, object, layer: overlay} = objectInfo;

    // deckgl layer to kepler-gl layer
    const layer = layers[overlay.props.idx];

    if (!layer || !layer.config.isVisible || !object || !layer.getHoverData ||
    (mapLayers && !mapLayers[layer.id].isVisible)) {
      // layer is no visible
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
      lngLat,
      x,
      y: y + popoverOffset.top,
      freezed: Boolean(clicked),
      onClose: this._onCloseMapPopover
    };

    return (
      <div><MapPopover {...popoverProps}/></div>
    );
  }
  /* eslint-enable complexity */

  _getHoverXY(viewport, lngLat) {
    const screenCoord = !viewport || !lngLat ? null : viewport.project(lngLat);

    return screenCoord && {x: screenCoord[0], y: screenCoord[1]};
  }

  _renderBuildingLayer(layer, buildingData, mapState) {
    const {longitude, latitude, zoom, width, height} = mapState;
    const bbox = geoViewport.bounds([longitude, latitude], Math.floor(zoom), [width, height]);
    const lightSettings = getLightSettingsFromBounds(bbox);

    // render one layer per tile
    return buildingData.map(({tileId, data}) => new PolygonLayer({
      id: tileId,
      data,
      fp64: Math.floor(zoom) >= 16,
      extruded: true,
      getFillColor: f => layer.color,
      updateTriggers: {
        getFillColor: layer.color
      },
      lightSettings,
      getPolygon: f => f.geometry.coordinates,
      getElevation: f => f.properties.height,
      opacity: layer.opacity
    }));
  }

  _shouldRenderLayer(layer, data, mapLayers) {
    const isAvailableAndVisible = !(mapLayers && mapLayers[layer.id]) || mapLayers[layer.id].isVisible;
    return layer.shouldRenderLayer(data) && isAvailableAndVisible;
  }

  _renderLayer = (overlays, idx) => {
    const {
      layers, layerData, hoverInfo, clicked,
      mapLayers, mapState, visStateActions,
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
  }

  _renderOverlay() {
    const {mapState, mapStyle, buildingData, layerData, layerOrder} = this.props;
    const {hasBuildingLayer} = this.state;

    let deckGlLayers = [];

    // wait until data is ready before render data layers
    if (layerData && layerData.length) {
      // last layer render first
      deckGlLayers = layerOrder.slice().reverse()
        .reduce(this._renderLayer, []);
    }

    // add 3d building layer
    if (hasBuildingLayer) {
      deckGlLayers = deckGlLayers
        .concat(this._renderBuildingLayer(mapStyle.buildingLayer, buildingData, mapState));
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

  render() {
    const {mapState, mapStyle, mapStateActions} = this.props;
    const {updateMap, onMapClick} = mapStateActions;

    if (!mapStyle.bottomMapStyle) {
      // style not yet loaded
      return <div/>;
    }

    const {mapLayers, layers, datasets, index} = this.props;

    const mapProps = {
      ...mapState,
      preserveDrawingBuffer: true,
      mapboxApiAccessToken: MAPBOX_ACCESS_TOKEN,
      onViewportChange: updateMap
    };

    return (
      <div
        style={MAP_STYLE.container}
        onMouseMove={this._onMouseMove}>
        <MapControl
          index={index}
          datasets={datasets}
          dragRotate={mapState.dragRotate}
          isSplit={mapState.isSplit}
          isFullScreen={mapState.isFullScreen}
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
          mapStyle={mapStyle.bottomMapStyle}
          onClick={onMapClick}>
          {this._renderOverlay()}
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
      </div>
    );
  }
}

MapContainer.propsTypes = propTypes;
