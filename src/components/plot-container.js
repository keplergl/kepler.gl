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
import {setTimeout} from 'global/window';

import MapContainerFactory from './map-container';
import {RATIOS, WAIT_FOR_LOADING} from 'constants/default-settings';
import {calculateExportImageSize, convertToPng} from 'utils/export-image-utils';

const propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  exportImageSetting: PropTypes.object.isRequired,
  mapFields: PropTypes.object.isRequired
};

PlotContainerFactory.deps = [MapContainerFactory];

export default function PlotContainerFactory(MapContainer) {
  class PlotContainer extends Component {
    
    componentDidMount() {
      this._retrieveNewScreenshot();
    }

    componentWillReceiveProps(newProps) {
      // re-fetch the new screenshot only when ratio or resolution changes
      if (
        this.props.exportImageSetting.ratio !== newProps.exportImageSetting.ratio ||
        this.props.exportImageSetting.resolution !== this.props.exportImageSetting.resolution
      ) {
        this._retrieveNewScreenshot();
      }
    }

    componentDidUpdate() {
      const map = this.mapRef && this.mapRef.getMap();
      if (map && this._map !== map) {
        this._map = map;

        map.on('style.load', () => {
          const style = map.getStyle();
          this.loadMapStyleJson(style);
        });

        map.on('render', () => {
          if (map.isStyleLoaded()) {
            this.loadMapStyleIcon();
          }
        });

        map.on('error', () => {
          this.loadMaoStyleError();
        })
      }
    }

    _retrieveNewScreenshot = () => {
      this.props.startExportingImage();
      // Quick hack: wait for few seconds to load the map tiles and deck.gl layers.
      // TODO: we should hook up with the map loaded event
      // https://www.mapbox.com/mapbox-gl-js/api/#mapdataevent
      // and the "onAfterRender" event from deck.gl
      setTimeout(() => {
        convertToPng(this.plottingAreaRef).then(
          dataUri => this.props.setExportImageDataUri({dataUri})
        );
      }, WAIT_FOR_LOADING);
    };

    render() {
      const {width, height, exportImageSetting, mapFields} = this.props;
      const {ratio, resolution} = exportImageSetting;
      // const {exportImageSetting} = exportImageSetting; <= not used yet.
      const exportImageSize = calculateExportImageSize({
        width, height, ratio, resolution
      });

      const exportRatio = ratio === RATIOS.ONE_X ? 1 : 2;

      // TODO: should override the map style accoring to the exportRatio
      const mapboxStyle = mapFields.mapStyle;

      // figure out how to turn on legend through mapProps
      const mapProps = {
        ...mapFields,
        mapboxStyle,
        mapState: {
          ...mapFields.mapState,
          zoom: mapFields.mapState.zoom + Math.log2(exportRatio),
          width: exportImageSize.width,
          height: exportImageSize.height
        },
        mapStateActions: {
          ...mapFields.mapStateActions,
          updateMap: () => {}
        }
      };

      return (
        <div style={{position: 'absolute', top: -9999, left: -9999}}>
          <div
            ref={element => {this.plottingAreaRef = element}}
            style={{
              width: exportImageSize.width,
              height: exportImageSize.height
            }}
          >
            <MapContainer
              index={0}
              {...mapProps}
            />
          </div>
        </div>
      );
    }
  }

  PlotContainer.propsTypes = propTypes;
  return PlotContainer;
}
