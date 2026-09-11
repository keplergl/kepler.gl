// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

import React, {useCallback} from 'react';
import {
  Icons,
  MapControlButton,
  MapControlTooltipFactory,
  MapControlPanelFactory,
  MapLegendFactory,
  MapLegendPanelFactory,
  MapLegendPanelProps
} from '@kepler.gl/components';

CustomMapLegendPanelFactory.deps = MapLegendPanelFactory.deps;

export function CustomMapLegendPanelFactory(
  MapControlTooltip: ReturnType<typeof MapControlTooltipFactory>,
  MapControlPanel: ReturnType<typeof MapControlPanelFactory>,
  MapLegend: ReturnType<typeof MapLegendFactory>
): ReturnType<typeof MapLegendPanelFactory> {
  const OriginalMapLegendPanel = MapLegendPanelFactory(
    MapControlTooltip,
    MapControlPanel,
    MapLegend
  );

  const SplitPaneLegend = (props: MapLegendPanelProps & {mapIndex?: number; isSplit?: boolean}) => {
    const mapLegend = props.mapControls?.mapLegend;
    const isActive = mapLegend?.active;
    const {onToggleMapControl} = props;

    const toggleLegend = useCallback(
      (e?: React.MouseEvent) => {
        e?.preventDefault();
        onToggleMapControl('mapLegend');
      },
      [onToggleMapControl]
    );

    if (!mapLegend?.show) return null;

    // The secondary (right) pane only shows the toggle button
    if (props.mapIndex !== 0) {
      return (
        <MapControlTooltip
          id="show-legend"
          message={isActive ? 'tooltip.hideLegend' : 'tooltip.showLegend'}
        >
          <MapControlButton
            className="map-control-button show-legend"
            active={isActive}
            onClick={toggleLegend}
          >
            <Icons.Legend height="22px" />
          </MapControlButton>
        </MapControlTooltip>
      );
    }

    // Primary (left) pane: render the full draggable legend panel
    // (OriginalMapLegendPanel handles DraggableLegend + createPortal,
    // and MapControlPanel renders "Unlock Viewport" / "Sync Zoom" in its header)
    return (
      <>
        <style>{`.draggable-legend .map-control__panel-header:not(.map-control__panel-split-viewport-tools) { display: none !important; }`}</style>
        <OriginalMapLegendPanel {...props} />
      </>
    );
  };

  const CustomMapLegendPanel = (
    props: MapLegendPanelProps & {mapIndex?: number; isSplit?: boolean}
  ) => {
    if (props.isSplit) {
      return <SplitPaneLegend {...props} />;
    }

    return (
      <>
        <style>{`.draggable-legend .map-control__panel-header:not(.map-control__panel-split-viewport-tools) { display: none !important; }`}</style>
        <OriginalMapLegendPanel {...props} />
      </>
    );
  };

  CustomMapLegendPanel.displayName = 'CustomMapLegendPanel';
  return CustomMapLegendPanel;
}
