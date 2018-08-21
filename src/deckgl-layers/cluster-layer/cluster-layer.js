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

import {CompositeLayer, ScatterplotLayer} from 'deck.gl';
import geoViewport from '@mapbox/geo-viewport';
import {ascending, max} from 'd3-array';
import {
  getQuantileDomain,
  getOrdinalDomain,
  getLinearDomain
} from 'utils/data-scale-utils';
import {
  getColorScaleFunction,
  getRadiusScaleFunction,
  needsRecalculateRadiusRange,
  needsRecalculateColorDomain,
  needReCalculateScaleFunction
} from '../layer-utils/utils';
import {DefaultColorRange} from 'constants/color-ranges';
import {LAYER_VIS_CONFIGS} from 'layers/layer-factory';
import {SCALE_TYPES} from 'constants/default-settings';

import {
  clearClustererCache,
  clustersAtZoom,
  getGeoJSON
} from '../layer-utils/cluster-utils';

const defaultRadius = LAYER_VIS_CONFIGS.clusterRadius.defaultValue;
const defaultRadiusRange = LAYER_VIS_CONFIGS.clusterRadiusRange.defaultValue;

const defaultProps = {
  clusterRadius: defaultRadius,
  colorDomain: null,
  colorRange: DefaultColorRange,
  colorScale: SCALE_TYPES.quantize,
  radiusRange: defaultRadiusRange,

  // maybe later...
  lowerPercentile: 0,
  upperPercentile: 100,

  getPosition: x => x.position,

  // if want to have color based on customized aggregator, instead of count
  getColorValue: points => points.length,

  //  if want to have radius based on customized aggregator, instead of count
  getRadiusValue: cell => cell.properties.point_count,
  fp64: false
};

export default class ClusterLayer extends CompositeLayer {
  initializeState() {
    this.state = {
      clusters: null,
      geoJSON: null
    };
  }

  shouldUpdateState({changeFlags}) {
    return changeFlags.somethingChanged;
  }

  updateState({context, oldProps, props, changeFlags}) {
    if (changeFlags.dataChanged || this.needsReProjectPoints(oldProps, props)) {
      // project data into clusters, and get clustered data
      this.processGeoJSON();
      this.getClusters();

      // this needs clustered data to be set
      this.getColorValueDomain();
    } else if (this.needsReclusterPoints(oldProps, props)) {
      this.getClusters();
      this.getColorValueDomain();
    } else if (this.needsRecalculateScaleFunction(oldProps, props)) {
      this.getColorValueDomain();
    }
  }

  needsReProjectPoints(oldProps, props) {
    return (
      oldProps.clusterRadius !== props.clusterRadius ||
      oldProps.getPosition !== props.getPosition
    );
  }

  needsReclusterPoints(oldProps, props) {
    return (
      Math.round(oldProps.zoom) !== Math.round(props.zoom)
    );
  }

  needsRecalculateScaleFunction(oldProps, props) {
    return (
      needsRecalculateColorDomain(oldProps, props) ||
      needReCalculateScaleFunction(oldProps, props) ||
      needsRecalculateRadiusRange(oldProps, props) ||
      oldProps.getColorValue !== props.getColorValue
    );
  }

  processGeoJSON() {
    const {data, getPosition} = this.props;
    this.setState({geoJSON: getGeoJSON(data, getPosition)});
    clearClustererCache();
  }

  getClusters() {
    const {geoJSON} = this.state;
    const {clusterRadius} = this.props;
    const {
      viewport,
      viewport: {longitude, latitude, height, width}
    } = this.context;

    // zoom needs to be an integer for the different map utils. Also helps with cache key.
    const zoom = Math.round(viewport.zoom);
    const bbox = geoViewport.bounds([longitude, latitude], zoom, [
      width,
      height
    ]);

    const clusters = clustersAtZoom({bbox, clusterRadius, geoJSON, zoom});

    this.setState({clusters});
  }

  getColorValueDomain() {
    const {
      colorScale,
      getColorValue,
      getRadiusValue,
      onSetColorDomain
    } = this.props;
    const {clusters} = this.state;

    const radiusDomain = [0, max(clusters, getRadiusValue)];

    const colorValues = clusters.map(d => getColorValue(d.properties.points));

    const identity = d => d;

    const colorDomain =
      colorScale === SCALE_TYPES.ordinal
        ? getOrdinalDomain(colorValues, identity)
        : colorScale === SCALE_TYPES.quantile
          ? getQuantileDomain(colorValues, identity, ascending)
          : getLinearDomain(colorValues, identity);

    this.setState({
      colorDomain,
      radiusDomain
    });

    getColorScaleFunction(this);
    getRadiusScaleFunction(this);

    onSetColorDomain(colorDomain);
  }

  getUpdateTriggers() {
    return {
      getColor: {
        colorRange: this.props.colorRange,
        colorDomain: this.props.colorDomain,
        getColorValue: this.props.getColorValue,
        colorScale: this.props.colorScale,
        lowerPercentile: this.props.lowerPercentile,
        upperPercentile: this.props.upperPercentile
      },
      getRadius: {
        radiusRange: this.props.radiusRange,
        radiusDomain: this.props.radiusDomain,
        getRadiusValue: this.props.getRadiusValue
      }
    };
  }

  /*
   * override default layer method to calculate cell color based on color scale function
   */
  _onGetSublayerColor(cell) {
    const {getColorValue} = this.props;
    const {colorScaleFunc, colorDomain} = this.state;

    const cv = getColorValue(cell.properties.points);

    // if cell value is outside domain, set alpha to 0
    const color =
      cv >= colorDomain[0] && cv <= colorDomain[colorDomain.length - 1]
        ? colorScaleFunc(cv)
        : [0, 0, 0, 0];

    // add final alpha to color
    color[3] = Number.isFinite(color[3]) ? color[3] : 255;

    return color;
  }

  _onGetSublayerRadius(cell) {
    const {getRadiusValue} = this.props;
    const {radiusScaleFunc} = this.state;
    return radiusScaleFunc(getRadiusValue(cell));
  }

  getPickingInfo({info}) {
    const {clusters} = this.state;
    const isPicked = info.picked && info.index > -1;

    let object = null;
    if (isPicked) {
      // add cluster colorValue to object
      const cluster = clusters[info.index];
      const colorValue = this.props.getColorValue(cluster.properties.points);

      object = {
        ...cluster.properties,
        colorValue,
        radius: this._onGetSublayerRadius(cluster),
        position: cluster.geometry.coordinates
      };
    }

    return {
      ...info,
      picked: Boolean(object),
      // override object with picked cluster property
      object
    };
  }

  renderLayers() {
    // for subclassing, override this method to return
    // customized sub layer props
    const {id, radiusScale, fp64} = this.props;

    // base layer props
    const {opacity, pickable, autoHighlight, highlightColor} = this.props;

    // return props to the sublayer constructor
    return new ScatterplotLayer({
      id: `${id}-cluster`,
      data: this.state.clusters,
      radiusScale,
      fp64,
      opacity,
      pickable,
      autoHighlight,
      highlightColor,
      getPosition: d => d.geometry.coordinates,
      getRadius: this._onGetSublayerRadius.bind(this),
      getColor: this._onGetSublayerColor.bind(this),
      updateTriggers: this.getUpdateTriggers()
    });
  }
}

ClusterLayer.layerName = 'ClusterLayer';
ClusterLayer.defaultProps = defaultProps;
