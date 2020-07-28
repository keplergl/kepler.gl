// Copyright (c) 2020 Uber Technologies, Inc.
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

import React, {Component, useState, useRef} from 'react';

//Map Component
import DeckGL from '@deck.gl/react';
import {OVERLAY_TYPE} from 'layers/base-layer';
import MapboxGLMap from 'react-map-gl';
import {transformRequest} from 'utils/map-style-utils/mapbox-utils';

//Hubble Imports - Animation (from example for starters)
import {DeckScene, CameraKeyframes} from '@hubble.gl/core';
import {easing} from 'popmotion';
import {BasicControls} from '@hubble.gl/react';
import {DeckAdapter} from 'hubble.gl';


// Hubble Part (Maybe we should get this in a different file or put everything on a folder)
// Question: Does is make sense to have the sceneBuilder and enconderSettings in RenderSettingsPanel?
/*function sceneBuilder(animationLoop) {
    const data = {};
    const keyframes = {
      camera: new CameraKeyframes({
        timings: [0, 2000],
        keyframes: [
          {
            longitude: 0,
            latitude: 11,
            zoom: 2,
            pitch: 0,
            bearing: 0
          },
          {
            longitude: 0,
            latitude: 11,
            zoom: 2,
            bearing: 90,
            pitch: 0
          }
        ],
        easings: [easing.easeInOut]
      })
    };
    animationLoop.timeline.attachAnimation(keyframes.camera);
  
    // TODO: Figure out how to set up the size 
    return new DeckScene({
      animationLoop,
      keyframes,
      lengthMs: 5000,
      data,
     width: 480,
     height: 460
    });
  }*/

 /* const encoderSettings = {
    framerate: 30,
    webm: {
      quality: 0.8
    },
    jpeg: {
      quality: 0.8
    },
    gif: {
      sampleInterval: 1000
    }
  };*/


const TRANSITION_DURATION = 0;

export class Scene extends Component {

    constructor(props) {
        super(props);
   this.mapData = this.props.mapData;
   
   //this.adapter = new DeckAdapter(this.props.sceneBuilder);
      }

  _renderLayer = (overlays, idx) => {
    const datasets = this.mapData.visState.datasets;
    const layers = this.mapData.visState.layers;    
    const layerData = this.mapData.visState.layerData;
    const hoverInfo = this.mapData.visState.hoverInfo;
    const clicked = this.mapData.visState.clicked;
    const mapState = this.mapData.mapState;
    const interactionConfig = this.mapData.visState.interactionConfig;
    const animationConfig = this.mapData.visState.animationConfig;

    const layer = layers[idx];
    const data = layerData[idx];
    const {gpuFilter} = datasets[layer.config.dataId] || {};
  
    const objectHovered = clicked || hoverInfo;
    const layerCallbacks = {
          onSetLayerDomain: val => this._onLayerSetDomain(idx, val)
        };
  
        // Layer is Layer class
    const layerOverlay = layer.renderLayer({
          data,
          gpuFilter,
          idx,
          interactionConfig,
          layerCallbacks,
          mapState,
          animationConfig,
          objectHovered
        });
        return overlays.concat(layerOverlay || []);
      };
 
      // Testing purposes
      print(prop){
        console.log("this.deckgl", prop);
      };

      // Is this being used right?
      componentDidMount() {
        this.forceUpdate();
      }
       
     //   interactionConfig,  
        render() {
        console.log("all props ", this.props.mapData);

        const mapStyle = this.mapData.mapStyle;
        const mapState = this.mapData.mapState;
        const layers = this.mapData.visState.layers;    
        const layerData = this.mapData.visState.layerData;
        const layerOrder = this.mapData.visState.layerOrder;
        const animationConfig = this.mapData.visState.animationConfig;
        const width = '100%';
        const height = '100%';
        const useDevicePixels = 2;
        //Map data
        const mapboxApiAccessToken = this.mapData.mapStyle.mapboxApiAccessToken;
        const mapboxApiUrl = this.mapData.mapStyle.mapboxApiUrl;
        // define trip and geojson layers 
        let deckGlLayers = [];

        // wait until data is ready before render data layers
        if (layerData && layerData.length) {
          // last layer render first
          deckGlLayers = layerOrder
            .slice()
            .reverse()
            .filter(
              idx => layers[idx].overlayType === OVERLAY_TYPE.deckgl && layers[idx].id
            )
            .reduce(this._renderLayer, []);
        }

        // MapboxGLMap
        const mapProps = {
            ...mapState,
            preserveDrawingBuffer: true,
            mapboxApiAccessToken,
            mapboxApiUrl,
            transformRequest
          };

         const style = {
            position: 'relative'
          }
          console.log("mapState prop ",mapState);
     
        return (
            <div style={{width: '100%', height: "100%", position: 'relative'}}>
              <DeckGL
                ref={r => {this.deckgl={current:r}}}
                viewState={mapState}
                id="default-deckgl-overlay2"
                layers={deckGlLayers}
                useDevicePixels={useDevicePixels}
                width={width}
                height={height}
                style={style}
                /* onBeforeRender={this._onBeforeRender} // Not yet
                      onHover={visStateActions.onLayerHover} // Not yet
                      onClick={visStateActions.onLayerClick}*/ // Not yet
                {...this.props.adapter.getProps(this.deckgl, () => {}, () => {this.forceUpdate()})}
              >
            <MapboxGLMap // Maybe be missing Mapbox overlays
                 {...mapProps}
                  key="bottom"
                  ref={this._setMapboxMap}
                  mapStyle={mapStyle.bottomMapStyle}
                  getCursor={this.props.hoverInfo ? () => 'pointer' : undefined}
                  transitionDuration={TRANSITION_DURATION}
                ></MapboxGLMap>
              </DeckGL>
              <div style={{position: 'absolute'}}>
                <BasicControls
                  adapter={this.props.adapter}
                  encoderSettings={this.props.encoderSettings}
                  setBusy={()=>{}}
                />
              </div>
            </div>
          );
    }

}