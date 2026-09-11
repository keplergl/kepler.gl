// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import {Switch, Checkbox, useTheme} from '@sqlrooms/ui';

import {InteractionConfig} from '@kepler.gl/types';
import {FormattedMessage} from '@kepler.gl/localization';

import {useKeplerStateActions} from '../hooks/useKeplerStateActions';
import {CustomTooltipConfig} from './CustomTooltipConfig';

const SimpleInteractionPanel: React.FC<{
  configId: string;
  config: any;
  label: string;
  onConfigChange: (configId: string, newConfig: any) => void;
}> = ({configId, config, label, onConfigChange}) => {
  const toggleEnableConfig = useCallback(() => {
    onConfigChange(configId, {
      enabled: !config.enabled
    });
  }, [configId, config.enabled, onConfigChange]);

  return (
    <div className="flex items-center justify-between p-2">
      <div className="text-muted-foreground text-sm font-medium">{label}</div>
      <Switch
        checked={config.enabled}
        onCheckedChange={toggleEnableConfig}
        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary"
      />
    </div>
  );
};

const TooltipPanel: React.FC<{
  tooltipConfig: any;
  coordinateConfig: any;
  datasets: any;
  isDark: boolean;
  handleConfigChange: (configId: string, newConfig: any) => void;
  handleCoordinateToggle: () => void;
  setColumnDisplayFormat: (dataId: string, formats: {[key: string]: string}) => void;
}> = ({
  tooltipConfig,
  coordinateConfig,
  datasets,
  isDark,
  handleConfigChange,
  handleCoordinateToggle,
  setColumnDisplayFormat
}) => {
  const handleTooltipConfigChange = useCallback(
    (newConfig: any) => {
      handleConfigChange('tooltip', {config: newConfig});
    },
    [handleConfigChange]
  );

  const handleDisplayFormatChange = useCallback(
    (dataId: string, column: string, displayFormat: string) => {
      setColumnDisplayFormat(dataId, {[column]: displayFormat});
    },
    [setColumnDisplayFormat]
  );

  if (!tooltipConfig) return null;
  return (
    <div>
      <SimpleInteractionPanel
        configId="tooltip"
        config={tooltipConfig}
        label="Tooltip"
        onConfigChange={handleConfigChange}
      />
      {tooltipConfig.enabled && (
        <div className="pr-2 pl-4">
          <div className="flex items-center space-x-2 py-2">
            <Checkbox
              checked={coordinateConfig?.enabled || false}
              onCheckedChange={handleCoordinateToggle}
              className="shadow-none"
            />
            <span className="text-muted-foreground text-xs">
              Show <FormattedMessage id="interactions.coordinate" />
            </span>
          </div>
          <CustomTooltipConfig
            datasets={datasets}
            config={tooltipConfig.config}
            onChange={handleTooltipConfigChange}
            onDisplayFormatChange={handleDisplayFormatChange}
            isDark={isDark}
          />
        </div>
      )}
    </div>
  );
};

export const CustomInteractionManager: React.FC<{mapId: string}> = ({mapId}) => {
  const {keplerActions, keplerState} = useKeplerStateActions({mapId});
  const {theme} = useTheme();

  // Determine if dark mode is active
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const rawInteractionConfig = keplerState?.visState.interactionConfig;
  const interactionConfig = useMemo<Partial<InteractionConfig>>(
    () => rawInteractionConfig ?? {},
    [rawInteractionConfig]
  );
  const datasets = keplerState?.visState.datasets || {};
  const {interactionConfigChange, setColumnDisplayFormat} = keplerActions.visStateActions;

  const handleConfigChange = useCallback(
    (configId: string, newConfig: any) => {
      const currentConfig = interactionConfig[configId as keyof InteractionConfig];
      if (currentConfig && typeof currentConfig === 'object') {
        interactionConfigChange({
          ...currentConfig,
          ...newConfig
        });
      }
    },
    [interactionConfig, interactionConfigChange]
  );

  // Handle coordinate display toggle
  const handleCoordinateToggle = useCallback(() => {
    const coordinateConfig = interactionConfig.coordinate;
    if (coordinateConfig && typeof coordinateConfig === 'object') {
      interactionConfigChange({
        ...coordinateConfig,
        enabled: !coordinateConfig.enabled
      });
    }
  }, [interactionConfig.coordinate, interactionConfigChange]);

  return (
    <div className="interaction-manager">
      <div className="space-y-2">
        <TooltipPanel
          tooltipConfig={interactionConfig.tooltip}
          coordinateConfig={interactionConfig.coordinate}
          datasets={datasets}
          isDark={isDark}
          handleConfigChange={handleConfigChange}
          handleCoordinateToggle={handleCoordinateToggle}
          setColumnDisplayFormat={setColumnDisplayFormat}
        />
        {interactionConfig.geocoder && (
          <SimpleInteractionPanel
            configId="geocoder"
            config={interactionConfig.geocoder}
            label="Location search"
            onConfigChange={handleConfigChange}
          />
        )}
        {interactionConfig.brush && (
          <SimpleInteractionPanel
            configId="brush"
            config={interactionConfig.brush}
            label="Brush filter"
            onConfigChange={handleConfigChange}
          />
        )}
      </div>
    </div>
  );
};
