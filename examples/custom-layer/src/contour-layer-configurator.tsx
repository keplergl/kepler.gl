// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Custom configurator for the Contour layer. kepler.gl dispatches to
// `_render${Type}LayerConfig` by convention; this wraps the built-in
// LayerConfiguratorFactory and adds the contour/surface controls.

import React from 'react';
import {
  ItemSelector,
  LayerColorRangeSelector,
  LayerColorSelector,
  LayerConfiguratorFactory,
  VisConfigSwitch
} from '@kepler.gl/components';

export function CustomLayerConfiguratorFactory(
  SourceDataSelector,
  VisConfigSlider,
  TextLabelPanel,
  LayerConfigGroup,
  ...rest
) {
  // Build the original configurator using all the same deps.
  const OriginalConfigurator = LayerConfiguratorFactory(
    SourceDataSelector,
    VisConfigSlider,
    TextLabelPanel,
    LayerConfigGroup,
    ...rest
  );

  // Subclass so we can add _renderContourLayerConfig while keeping everything else.
  class ContourAwareLayerConfigurator extends (OriginalConfigurator as any) {
    _renderContourLayerConfig({layer, visConfiguratorProps, layerChannelConfigProps}) {
      const modeOptions = (
        layer.visConfigSettings.renderMode?.options || ['contour', 'surface']
      ).map(mode => ({
        id: mode,
        label: mode === 'surface' ? '3D surface' : 'Contour lines'
      }));
      const selectedMode =
        modeOptions.find(({id}) => id === layer.config.visConfig.renderMode) || modeOptions[0];
      const isSurface = layer.config.visConfig.renderMode === 'surface';

      const COUNT_WEIGHT_ID = '__count__';
      const weightOptions = [
        {id: COUNT_WEIGHT_ID, label: 'Point count (density)'},
        ...(layerChannelConfigProps?.fields || [])
          .filter(field => field.type === 'real' || field.type === 'integer')
          .map(field => ({id: field.name, label: field.name}))
      ];
      const selectedWeight =
        weightOptions.find(
          option => option.id === (layer.config.visConfig.weightColumn || COUNT_WEIGHT_ID)
        ) || weightOptions[0];

      return (
        <>
          <LayerConfigGroup label="Render mode">
            <ItemSelector
              selectedItems={selectedMode}
              options={modeOptions}
              displayOption="label"
              getOptionValue="id"
              multiSelect={false}
              searchable={false}
              onChange={value => visConfiguratorProps.onChange({renderMode: value})}
            />
          </LayerConfigGroup>
          {isSurface ? (
            <>
              <LayerConfigGroup label="3D surface" collapsible>
                <VisConfigSlider
                  {...layer.visConfigSettings.cellRadius}
                  focusRange={[0.1, 3]}
                  focusWeight={0.2}
                  {...visConfiguratorProps}
                />
                <VisConfigSlider
                  {...layer.visConfigSettings.elevationScale}
                  {...visConfiguratorProps}
                />
                <VisConfigSlider
                  {...layer.visConfigSettings.smoothing}
                  allowCustomValue
                  customInputLabel="Custom passes"
                  {...visConfiguratorProps}
                />
              </LayerConfigGroup>
              <LayerConfigGroup label="Contours" collapsible>
                <VisConfigSwitch
                  {...layer.visConfigSettings.showContours}
                  {...visConfiguratorProps}
                />
                <VisConfigSlider
                  {...layer.visConfigSettings.contourCount}
                  disabled={!layer.config.visConfig.showContours}
                  {...visConfiguratorProps}
                />
              </LayerConfigGroup>
              <LayerConfigGroup label="Contour color">
                <LayerColorSelector
                  {...visConfiguratorProps}
                  property="contourColor"
                  selectedColor={layer.config.visConfig.contourColor}
                />
              </LayerConfigGroup>
              <LayerConfigGroup label="Color">
                <LayerColorRangeSelector {...visConfiguratorProps} />
              </LayerConfigGroup>
              <LayerConfigGroup label="Weight">
                <ItemSelector
                  selectedItems={selectedWeight}
                  options={weightOptions}
                  displayOption="label"
                  getOptionValue="id"
                  multiSelect={false}
                  searchable={false}
                  onChange={value =>
                    visConfiguratorProps.onChange({
                      weightColumn: value === COUNT_WEIGHT_ID ? null : value
                    })
                  }
                />
              </LayerConfigGroup>
            </>
          ) : (
            <LayerConfigGroup label="Contour Settings" collapsible>
              <VisConfigSlider
                {...layer.visConfigSettings.cellRadius}
                focusRange={[0.1, 3]}
                focusWeight={0.2}
                {...visConfiguratorProps}
              />
              <VisConfigSlider
                {...layer.visConfigSettings.lowerThreshold}
                focusRange={[1, 20]}
                focusWeight={0.6}
                {...visConfiguratorProps}
              />
              <VisConfigSlider
                {...layer.visConfigSettings.higherThreshold}
                focusRange={[1, 20]}
                focusWeight={0.6}
                {...visConfiguratorProps}
              />
            </LayerConfigGroup>
          )}
          <LayerConfigGroup label="Display" collapsible>
            <VisConfigSlider {...layer.visConfigSettings.opacity} {...visConfiguratorProps} />
          </LayerConfigGroup>
        </>
      );
    }
  }

  return ContourAwareLayerConfigurator;
}

// Mirror the deps list so kepler.gl can resolve them via its DI container.
CustomLayerConfiguratorFactory.deps = LayerConfiguratorFactory.deps;
