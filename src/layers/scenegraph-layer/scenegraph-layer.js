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

import {ScenegraphLayer as DeckScenegraphLayer} from '@deck.gl/mesh-layers';
import {load} from '@loaders.gl/core';
import {GLTFScenegraphLoader} from '@luma.gl/addons';

import Layer from '../base-layer';
import memoize from 'lodash.memoize';
import ScenegraphLayerIcon from './scenegraph-layer-icon';
import ScenegraphInfoModalFactory from './scenegraph-info-modal';

export const scenegraphRequiredColumns = ['lat', 'lng'];
export const scenegraphOptionalColumns = ['altitude'];

function fetch(url, {propName, layer}) {
  if (propName === 'scenegraph') {
    return load(url, GLTFScenegraphLoader, layer.getLoadOptions());
  }

  return fetch(url).then(response => response.json());
}

export const scenegraphPosAccessor = ({lat, lng, altitude}) => d => [
  // lng
  d.data[lng.fieldIdx],
  // lat
  d.data[lat.fieldIdx],
  // altitude
  altitude && altitude.fieldIdx > -1 ? d.data[altitude.fieldIdx] : 0
];

export const scenegraphPosResolver = ({lat, lng, altitude}) =>
  `${lat.fieldIdx}-${lng.fieldIdx}-${altitude ? altitude.fieldIdx : 'z'}`;

export const scenegraphVisConfigs = {
  opacity: 'opacity',
  colorRange: 'colorRange',
  //
  sizeScale: 'sizeScale',
  angleX: 'angleX',
  angleY: 'angleY',
  angleZ: 'angleZ'
};

const DEFAULT_MODEL =
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb';
const DEFAULT_TRANSITION = [0, 0, 0];
const DEFAULT_SCALE = [1, 1, 1];
const DEFAULT_COLOR = [255, 255, 255, 255];

export default class ScenegraphLayer extends Layer {
  constructor(props) {
    super(props);

    this.registerVisConfig(scenegraphVisConfigs);
    this.getPosition = memoize(scenegraphPosAccessor, scenegraphPosResolver);

    // prepare layer info modal
    this._layerInfoModal = ScenegraphInfoModalFactory();
  }

  get type() {
    return '3D';
  }

  get requiredLayerColumns() {
    return scenegraphRequiredColumns;
  }

  get optionalColumns() {
    return scenegraphOptionalColumns;
  }

  get columnPairs() {
    return this.defaultPointColumnPairs;
  }

  get layerIcon() {
    return ScenegraphLayerIcon;
  }

  get layerInfoModal() {
    return {
      id: 'scenegraphInfo',
      template: this._layerInfoModal,
      modalProps: {
        title: 'How to use Scenegraph'
      }
    };
  }

  formatLayerData(datasets, oldLayerData, opt = {}) {
    const {columns} = this.config;
    const {filteredIndex, allData} = datasets[this.config.dataId];

    const getPosition = this.getPosition(columns);

    if (!oldLayerData || oldLayerData.getPosition !== getPosition) {
      this.updateLayerMeta(allData, getPosition);
    }

    let data;
    if (
      oldLayerData &&
      oldLayerData.data &&
      opt.sameData &&
      oldLayerData.getPosition === getPosition
    ) {
      data = oldLayerData.data;
    } else {
      data = filteredIndex.reduce((accu, index) => {
        const pos = getPosition({data: allData[index]});

        // if doesn't have point lat or lng, do not add the point
        // deck.gl can't handle position = null
        if (!pos.every(Number.isFinite)) {
          return accu;
        }

        accu.push({
          index,
          data: allData[index]
        });

        return accu;
      }, []);
    }

    return {
      data,
      getPosition
    };
  }

  updateLayerMeta(allData, getPosition) {
    const bounds = this.getPointsBounds(allData, d => getPosition({data: d}));
    this.updateMeta({bounds});
  }

  renderLayer({
    data,
    idx,
    objectHovered,
    mapState,
    interactionConfig,
    layerInteraction
  }) {
    const layerProps = {
      radiusMinPixels: 1,
      radiusScale: this.getRadiusScaleByZoom(mapState),
      ...(this.config.visConfig.fixedRadius ? {} : {radiusMaxPixels: 500})
    };

    const {
      visConfig: {sizeScale = 1, angleX = 0, angleY = 0, angleZ = 90}
    } = this.config;

    return [
      new DeckScenegraphLayer({
        ...layerProps,
        ...data,
        ...layerInteraction,
        id: this.id,
        idx,
        opacity: this.config.visConfig.opacity,

        fetch,

        scenegraph: this.config.visConfig.scenegraph || DEFAULT_MODEL,

        sizeScale,
        getTranslation: DEFAULT_TRANSITION,
        getScale: DEFAULT_SCALE,
        getOrientation: [angleX, angleY, angleZ],
        getColor: DEFAULT_COLOR,

        // picking
        pickable: true,

        // parameters
        parameters: {depthTest: true, blend: false},

        // update triggers
        updateTriggers: {
          getOrientation: {angleX, angleY, angleZ}
        }
      })
    ];
  }
}
