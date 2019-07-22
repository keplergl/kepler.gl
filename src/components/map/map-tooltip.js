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

import React from 'react';
import MapPopoverFactory from 'components/map/map-popover';
import WebMercatorViewport from 'viewport-mercator-project';

MapTooltipContainer.deps = [MapPopoverFactory];

const getHoverXY = (viewport, lngLat) => {
  const screenCoord = !viewport || !lngLat ? null : viewport.project(lngLat);
  return screenCoord && {x: screenCoord[0], y: screenCoord[1]};
};

export default function MapTooltipContainer(MapPopover) {
  /* eslint-disable complexity */
  const MapTooltip = React.memo(({
                                   mapState,
                                   hoverInfo,
                                   clicked,
                                   datasets,
                                   interactionConfig,
                                   layers,
                                   mapLayers,
                                   mousePos: {mousePosition, coordinate, pinned},
                                   onClose
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
      position = getHoverXY(viewport, lngLat);
    }

    return (
      <div>
        <MapPopover
          {...position}
          layerHoverProp={layerHoverProp}
          coordinate={interactionConfig.coordinate.enabled && ((pinned || {}).coordinate || coordinate)}
          freezed={Boolean(clicked || pinned)}
          onClose={onClose}
          mapW={mapState.width}
          mapH={mapState.height}
        />
      </div>
    );
  });

  MapTooltip.displayName = 'MapTooltip';

  return MapTooltip;
}
/* eslint-enable complexity */
