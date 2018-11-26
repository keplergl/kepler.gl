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

/* global fetch */

import {CompositeLayer} from '@deck.gl/core';
import {TileLayer as DeckGLTileLayer} from '@deck.gl/experimental-layers';
import dataProcessor from 'processors';
import {memoize} from 'utils/utils';
 
export default class SharedstreetsLayer extends CompositeLayer {
  initializeState() {
    this.setState({
      oldLayerDataMaps: new Map()
    })
  }
  
  shouldUpdateState({oldProps, props, context, changeFlags}) {
    return changeFlags.propsOrDataChanged || changeFlags.stateChanged;
  }

  /**
   * return data in tile z-x-y
   * @param {object} tile
   * @returns {object} {allData} in KeplerGl allData format
   */
  getTileData({ x, y, z }) {
    const fetchConfig = {
      method: "GET",
      mode: "cors",
      cache: "no-cache"
    };
    // eslint-disable-next-line no-template-curly-in-string
    const dataUrl = this.props.dataUrl.replace('${z}', z).replace('${x}', x).replace('${y}', y);
    return fetch(dataUrl, fetchConfig)
    .then(response => {
      return response.arrayBuffer();
    })
    .then(buffer => {
      const {rows: allData, fields} = dataProcessor.processGeobuf(buffer);
      return {
        allData,
        fields
      };
    });
  }

  getPickingInfo({info, sourceLayer}) {
    // info.sourceLayer is the deck gl layer that renders data.
    const idx = info.sourceLayer.props.idx;
    const tile = info.tile;
    const {allData, fields} = tile._data;
    info.allData = allData;
    info.fields = fields;
    info.idx = idx;
    return info;
  }
  
  /**
   * returns all deckGl layers rendering data in the viewport. 
   * @param {*} subLayerProps 
   * @param {*} tile current tile for this sub-layers 
   */
  renderSubLayers(subLayerProps) {
    const {layers, objectHovered, mapState, interactionConfig, layerVersion} = this.props;
    const {oldLayerDataMaps} = this.state;
    // layers are kepler layers rendering a subset of data. We can render other layers in the 
    // viewport by giving different ids and data. 
    const tile = subLayerProps.tile;
    return layers && layers.map((layer, idx) => {
      const layerDataId = `${layer.id}-${tile.z}-${tile.x}-${tile.y}`;
      let oldLayerData;
      if (oldLayerDataMaps.has(layerDataId)) {
        oldLayerData = oldLayerDataMaps.get(layerDataId);
        if (oldLayerData.data.length === 0) {
          oldLayerData = undefined;
        }
      }
      
      const data = this.getLayerData(layer, tile, layerVersion, oldLayerData);
      oldLayerDataMaps.set(layerDataId, data);
      this.setState({ oldLayerDataMaps });

      return layer.renderLayer({
        data,
        idx,
        objectHovered,
        mapState,
        interactionConfig
      }, {
        sampleKeplerLayerId: this.props.id,
        id: `${subLayerProps.id}-${layer.id}`,
        tile
      });
    })
  }

  renderLayers() {
    return [
      new DeckGLTileLayer({
        getTileData: this.getTileData.bind(this),
        maxZoom: 12,
        minZoom: 12,
        renderSubLayers: this.renderSubLayers.bind(this)
      })
    ];
  }

  /**
   * Returns the updated deckGl layer data props for the given tile and kepler layer. 
   * @param {*} keplerLayer 
   * @param {*} tile 
   */
  recomputeLayerData(keplerLayer, tile, oldLayerData) {
    if (tile.isLoaded) {
      return keplerLayer.formatLayerData([], tile._data.allData, Array.from(tile._data.allData.keys()), oldLayerData, {sameData: true});
    }
    tile.data.then(data => {
      this.setLayerNeedsUpdate();
    })
    return keplerLayer.formatLayerData([], [], [], oldLayerData);
  }

  /**
   * Returns the deckGl layer data prop for the given keplerLayer, layerVersion and tile.
   * @param {*} keplerLayer 
   * @param {*} tile 
   * @param {*} layerVersion 
   */
  getLayerData(keplerLayer, tile, layerVersion, oldLayerData) {
    if (!tile.keplerCache) {
      tile.keplerCache = {};
    }
    if (!tile.keplerCache[keplerLayer.id]) {
      tile.keplerCache[keplerLayer.id] = memoize(this.recomputeLayerData.bind(this));
    }
    // recompute layer data iff any of the following arguments (keplerlayer, tile, layerVersion,
    // tile.isLoaded) changes.
    const result = tile.keplerCache[keplerLayer.id](keplerLayer, tile, oldLayerData, layerVersion, tile.isLoaded);
    return result;
  }
}

