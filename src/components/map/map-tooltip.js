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
