// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

import {
  PanelLabel,
  SidePanelSection,
  SourceDataSelectorFactory,
  SourceDataSelectorProps
} from '@kepler.gl/components';
import {FormattedMessage} from '@kepler.gl/localization';
import {Button, cn} from '@sqlrooms/ui';
import React, {useCallback, useMemo, useState} from 'react';
import {useStoreWithKepler} from '../KeplerSlice';
import {buildKeplerTableSourceOptions, type KeplerTableSourceOption} from '../keplerTableSelection';
import {KeplerTableSourceSelector} from './KeplerTableSourceSelector';

type SourceDataSelectorValue = Parameters<SourceDataSelectorProps['onSelect']>[0];
type SourceDataSelectorContent = React.ComponentType<SourceDataSelectorProps>;
type CustomSourceDataSelectorProps = SourceDataSelectorProps & {
  id?: string;
};

function getSelectedDatasetId(value: SourceDataSelectorValue): string | undefined {
  if (value === null) {
    return undefined;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return undefined;
    }
    return getSelectedDatasetId(value[0] as SourceDataSelectorValue);
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'boolean') {
    return String(value);
  }

  if (typeof value === 'object') {
    const option = value as {id?: unknown; value?: unknown};
    if (typeof option.value === 'string') {
      return option.value;
    }
    if (typeof option.id === 'string') {
      return option.id;
    }
  }

  return undefined;
}

/**
 * Kepler uses the same SourceDataSelector in layer config and filter config.
 * Layer config passes a layer id, so only that version includes unloaded
 * SQLRooms table options. Filter selectors use the same UI with loaded Kepler
 * datasets only because a filter needs a loaded dataset to expose fields.
 */
export function CustomSourceDataSelectorFactory(
  _DataSourceSelectorContent: SourceDataSelectorContent
): React.FC<CustomSourceDataSelectorProps> {
  const SourceDataSelector: React.FC<CustomSourceDataSelectorProps> = ({
    dataId,
    datasets,
    disabled,
    onSelect,
    defaultValue = 'Select A Dataset',
    className,
    id: layerId
  }) => {
    const [isLoadingTable, setIsLoadingTable] = useState(false);
    const dbTables = useStoreWithKepler(state => state.db.tables);
    const tableSelection = useStoreWithKepler(state => state.kepler.tableSelection);
    const addTableToMap = useStoreWithKepler(state => state.kepler.addTableToMap);
    const keplerMap = useStoreWithKepler(state => state.kepler.map);
    const mapId = useMemo(() => {
      if (!layerId) {
        return undefined;
      }

      for (const [candidateMapId, mapState] of Object.entries(keplerMap)) {
        const hasLayer = mapState?.visState?.layers?.some(
          (layer: {id?: string}) => layer.id === layerId
        );
        if (hasLayer) {
          return candidateMapId;
        }
      }

      return undefined;
    }, [keplerMap, layerId]);
    const mapDatasets = useMemo(() => {
      if (!mapId) {
        return undefined;
      }

      return keplerMap[mapId]?.visState.datasets;
    }, [keplerMap, mapId]);
    const loadedDatasetIds = useMemo(
      () => Object.keys(mapDatasets ?? datasets),
      [datasets, mapDatasets]
    );

    const options = useMemo(() => {
      return buildKeplerTableSourceOptions({
        dbTables,
        datasets,
        includeUnloadedTables: Boolean(layerId && mapId),
        loadedDatasetIds,
        tableSelection
      });
    }, [datasets, dbTables, layerId, loadedDatasetIds, mapId, tableSelection]);

    const handleSelect = useCallback(
      (option: KeplerTableSourceOption) => {
        if (!layerId || !mapId) {
          onSelect(option.value);
          return;
        }

        if (option.isLoaded) {
          onSelect(option.value);
          return;
        }

        setIsLoadingTable(true);
        void addTableToMap({
          mapId,
          tableName: option.value,
          options: {
            autoCreateLayers: false,
            centerMap: false
          }
        })
          .then(() => {
            onSelect(option.value);
          })
          .catch(e => {
            console.error('Failed to load layer data source:', e);
          })
          .finally(() => {
            setIsLoadingTable(false);
          });
      },
      [addTableToMap, layerId, mapId, onSelect]
    );

    const selectedValue = getSelectedDatasetId(dataId);
    const selectedDataset = selectedValue ? datasets[selectedValue] : undefined;
    const selectedOption = options.find(option => option.value === selectedValue);
    const selectedLabel =
      selectedOption?.label ?? selectedDataset?.label ?? selectedValue ?? defaultValue;
    const selectedColor = selectedOption?.color ?? selectedDataset?.color ?? [143, 149, 161];
    const isDisabled = Boolean(disabled || isLoadingTable || !options.length);

    return (
      <SidePanelSection className="data-source-selector">
        <PanelLabel>
          <FormattedMessage id="misc.dataSource" />
        </PanelLabel>
        <KeplerTableSourceSelector
          disabled={isDisabled}
          options={options}
          popoverClassName="w-[360px]"
          searchPlaceholder="Search"
          selectedValue={selectedValue}
          onSelect={handleSelect}
          renderTrigger={({disabled: triggerDisabled, selectedOption}) => {
            const triggerColor = selectedOption?.color ?? selectedColor;
            const triggerLabel = selectedOption?.label ?? selectedLabel;

            return (
              <Button
                type="button"
                variant="secondary"
                className={cn(
                  className,
                  'h-9 w-full justify-start gap-2.5 rounded-sm px-3 text-left text-xs font-semibold'
                )}
                disabled={triggerDisabled}
              >
                <span
                  className="h-2.5 w-2.5 shrink-0"
                  style={{
                    backgroundColor: `rgb(${triggerColor.join(',')})`
                  }}
                />
                <span className="min-w-0 truncate">{triggerLabel}</span>
              </Button>
            );
          }}
        />
      </SidePanelSection>
    );
  };

  SourceDataSelector.displayName = 'CustomSourceDataSelector';
  return SourceDataSelector;
}

CustomSourceDataSelectorFactory.deps = SourceDataSelectorFactory.deps;
