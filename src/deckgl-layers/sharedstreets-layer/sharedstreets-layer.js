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
import { mergeDomain } from 'utils/domain-utils';
 
export default class SharedstreetsLayer extends CompositeLayer {
  initializeState() {
    this.setState({
      oldLayerDataMaps: new Map(),
      // stores domains for each encoded field and for each z-level 
      layerDomains: new Map(),
      // stores domains for each encoded field and for each z-x-y tile
      tileDomains: new Map()
    })
  }
  
  shouldUpdateState({oldProps, props, context, changeFlags}) {
    return changeFlags.propsOrDataChanged || changeFlags.stateChanged;
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
        fields,
        tile: {x, y, z}
      };
    });
  }

  /**
   * Called when all tiles in the current viewport are loaded. Calculate and store domains 
   * for each field, and for each tile.
   * @param {*} viewportTilesData an array data in the current viewport
   */
  onDataLoaded(viewportTilesData) {
    // data: all data in the viewport => an array of whatever is returned by getTileData
    if (viewportTilesData && viewportTilesData.length === 0) {
      return;
    }
    const {layers} = this.props;
    layers && layers.forEach(layer => {
      for (let i = 0; i < viewportTilesData.length; i++) {
        const {tile, allData, fields: allDataFields} = viewportTilesData[i];
        const {x, y, z} = tile;
        const tileId = `${z}-${x}-${y}`;
        const data = {
          allData,
          fields: allDataFields,
          filteredIndexForDomain: Object.keys(allData)
        };  
        const visualChannels = Object.values(layer.visualChannels);
        for (let j = 0; j < visualChannels.length; j++) {
          const channel = visualChannels[j];
          const field = layer.config[channel.field];
          if (field) {
            const newDomain = this.getTileDomain(layer, tileId, field.name, channel, data);
            this.updateLayerDomain(layer, z, field, channel, newDomain);
          }
        }
      }
    });
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
        maxZoom: 13,
        minZoom: 10,
        renderSubLayers: this.renderSubLayers.bind(this),
        onDataLoaded: this.onDataLoaded.bind(this)
      })
    ];
  }

  /**
   * return domain for the given tile  
   * @param {*} layer 
   * @param {*} tileId 
   * @param {*} fieldName 
   * @param {*} channel name of visual encoding channel for this field
   * @param {*} data data that's loaded in the tile
   */
  getTileDomain(layer, tileId, fieldName, channel, data) {
    const {id: layerId} = layer;
    const keyObj = {
      layerId,
      fieldName,
      tileId
    };
    const key = JSON.stringify(keyObj, Object.keys(keyObj).sort());
    if (this.state.tileDomains.has(key)) {
      return this.state.tileDomains.get(key);
    }
    const domain = layer.calculateLayerDomain(data, channel);
    this.state.tileDomains.set(key, domain);
    return domain;
  }

  /**
   * Merge the previous layer domain with new domain, for the given field 
   * at the given zoom level.
   * @param {*} layer 
   * @param {*} zLevel 
   * @param {*} field 
   * @param {*} channel 
   * @param {*} newDomain: domain to be merged
   */
  updateLayerDomain(layer, zLevel, field, channel, newDomain) {
    const {name: fieldName, type: fieldType} = field;
    const keyObj = {
      layerId: layer.id,
      fieldName,
      zLevel
    };
    const key = JSON.stringify(keyObj, Object.keys(keyObj).sort());
    const oldDomain = this.state.layerDomains.get(key);
    
    let mergedDomain = newDomain;
    if (oldDomain) {
      mergedDomain = mergeDomain(oldDomain, newDomain, fieldType);
    }

    const {domain} = channel;
    layer.updateLayerConfig({[domain]: mergedDomain});
    if (mergedDomain !== oldDomain) {
      this.state.layerDomains.set(key, mergedDomain);
    }
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
