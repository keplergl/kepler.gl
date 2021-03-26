import React, {useCallback, useState} from 'react';
import {PanelLabel} from 'components/common/styled-components';
import MapStyleSelectorFactory from 'components/side-panel/map-style-panel/map-style-selector';
import GlobeTogglePanelFactory from './globe-panel/globe-toggle-panel';
import GlobeRangePanelFactory from './globe-panel/globe-range-panel';

GlobeManagerFactory.deps = [
  MapStyleSelectorFactory,
  GlobeTogglePanelFactory,
  GlobeRangePanelFactory
];

function GlobeManagerFactory(MapStyleSelector, GlobeTogglePanel, GlobeRangePanel) {
  const GlobeManager = ({globe, mapStyle, mapStyleActions, mapStateActions}) => {
    const {mapStyleChange} = mapStyleActions;
    const {globeConfigChange} = mapStateActions;
    const [isSelecting, setIsSelecting] = useState(false);
    const toggleSelection = useCallback(() => setIsSelecting(!isSelecting), [
      isSelecting,
      setIsSelecting
    ]);

    const selectStyle = useCallback(
      style => {
        mapStyleChange(style);
        toggleSelection();
      },
      [mapStyleChange, toggleSelection]
    );

    return (
      <>
        <MapStyleSelector
          mapStyle={mapStyle}
          isSelecting={isSelecting}
          onChange={selectStyle}
          toggleActive={toggleSelection}
        />
        <div className="layer-group__header">
          <PanelLabel>Atmosphere</PanelLabel>
        </div>

        <GlobeTogglePanel
          config={globe.config}
          label="Atmosphere"
          id="atmosphere"
          value={globe.config.atmosphere}
          onConfigChange={globeConfigChange}
        />

        <GlobeRangePanel
          config={globe.config}
          label="Terminator"
          toggleId="terminator"
          toggleValue={globe.config.terminator}
          rangeId="terminatorOpacity"
          rangeValue={globe.config.terminatorOpacity}
          rangeLimit={1}
          rangeStep={0.01}
          onConfigChange={globeConfigChange}
        />

        <GlobeRangePanel
          config={globe.config}
          label="Sun Azimuth"
          toggleId="azimuth"
          toggleValue={globe.config.azimuth}
          rangeId="azimuthAngle"
          rangeValue={globe.config.azimuthAngle}
          rangeLimit={360}
          rangeStep={1}
          onConfigChange={globeConfigChange}
        />

        <div className="layer-group__header">
          <PanelLabel>Basemap</PanelLabel>
        </div>

        <GlobeTogglePanel
          config={globe.config}
          label="Basemap"
          id="basemap"
          value={globe.config.basemap}
          onConfigChange={globeConfigChange}
        />

        <GlobeTogglePanel
          config={globe.config}
          label="Labels"
          id="labels"
          value={globe.config.labels}
          onConfigChange={globeConfigChange}
        />
      </>
    );
  };

  return GlobeManager;
}

export default GlobeManagerFactory;
