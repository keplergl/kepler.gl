// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

import React, {useCallback, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import styled from 'styled-components';

import {
  LayerListFactory,
  DatasetLayerGroupFactory,
  PanelTitleFactory,
  SidePanelSection
} from '@kepler.gl/components';
import {PANEL_VIEW_TOGGLES, SIDEBAR_PANELS} from '@kepler.gl/constants';
import {LayerClassesType} from '@kepler.gl/layers';
import {getApplicationConfig} from '@kepler.gl/utils';
import {Plus} from 'lucide-react';
import {Button} from '@sqlrooms/ui';

import {getKeplerFactory} from './KeplerInjector';
import {KeplerActions, useKeplerStateActions} from '../hooks/useKeplerStateActions';
import {
  buildKeplerTableSourceOptions,
  type KeplerSourceDataset,
  type KeplerTableSourceOption
} from '../keplerTableSelection';
import {useStoreWithKepler} from '../KeplerSlice';
import type {RGBColor} from '@kepler.gl/types';
import {KeplerTableSourceSelector} from './KeplerTableSourceSelector';

const LayerList = getKeplerFactory(LayerListFactory);
const DatasetLayerGroup = getKeplerFactory(DatasetLayerGroupFactory);
const PanelTitle = getKeplerFactory(PanelTitleFactory);

const layerPanelMetadata = SIDEBAR_PANELS.find(p => p.id === 'layer');

const CustomLayerManagerContainer = styled.div`
  .add-layer-button {
    background-color: ${props => props.theme.primaryBtnBgd};
    color: ${props => props.theme.primaryBtnColor};
    border-radius: ${props => props.theme.primaryBtnRadius};

    &:hover:not(:disabled) {
      background-color: ${props => props.theme.primaryBtnBgdHover};
    }
    border: 0px;
    height: 28px;
    font-weight: 500;
    font-size: 14px;
  }

  .layer__title__type {
    display: none !important;
  }

  .layer-panel__header {
    height: 36px;
  }

  .layer__title {
    min-width: 0;
  }

  .layer__title > div {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .layer__title__editor {
    width: 100%;
    min-width: 0;
    flex: 1;
  }
}
`;

/**
 * Dropdown button that lists available datasets and DuckDB tables.
 * When a table is selected, it is synced to Kepler on demand and a new
 * layer is created for it.
 */
const AddTableLayerButton: React.FC<{
  onAdd: (tableName: string) => Promise<void>;
  datasets: Record<string, KeplerSourceDataset>;
  disabled?: boolean;
}> = ({onAdd, datasets, disabled}) => {
  const [isAdding, setIsAdding] = useState(false);
  const intl = useIntl();

  const dbTables = useStoreWithKepler(state => state.db.tables);
  const tableSelection = useStoreWithKepler(state => state.kepler.tableSelection);

  const options = useMemo(() => {
    return buildKeplerTableSourceOptions({
      dbTables,
      datasets,
      tableSelection
    });
  }, [datasets, dbTables, tableSelection]);

  const handleSelect = useCallback(
    (option: KeplerTableSourceOption) => {
      setIsAdding(true);
      onAdd(option.value)
        .catch(e => console.error('Failed to add layer:', e))
        .finally(() => setIsAdding(false));
    },
    [onAdd]
  );

  return (
    <KeplerTableSourceSelector
      disabled={!options.length || disabled || isAdding}
      options={options}
      popoverAlign="end"
      searchPlaceholder={intl ? intl.formatMessage({id: 'placeholder.search'}) : 'Search'}
      onSelect={handleSelect}
      renderTrigger={({disabled: isDisabled}) => (
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="add-layer-button"
          disabled={isDisabled}
        >
          <Plus className="h-3.5 w-3.5" />
          {intl.formatMessage({id: 'layerManager.addLayer'})}
        </Button>
      )}
    />
  );
};

type CustomLayerManagerProps = {
  mapId: string;
  showDeleteDataset?: boolean;
};

function useCustomSidePanelActions(keplerActions: KeplerActions) {
  const {openDeleteModal, toggleModal} = keplerActions.uiStateActions;
  const {updateTableColor} = keplerActions.visStateActions;

  const onRemoveDataset = useCallback(
    (dataId: string) => openDeleteModal(dataId),
    [openDeleteModal]
  );

  const onShowAddDataModal = useCallback(() => toggleModal('addData'), [toggleModal]);

  const onUpdateTableColor = useCallback(
    (dataId: string, newColor: RGBColor) => updateTableColor(dataId, newColor),
    [updateTableColor]
  );

  return {
    onRemoveDataset,
    onShowAddDataModal,
    onUpdateTableColor
  };
}

// Main Custom Layer Manager Component
export const CustomLayerManager: React.FC<CustomLayerManagerProps> = ({
  mapId,
  showDeleteDataset = true
}) => {
  const {keplerActions, keplerState} = useKeplerStateActions({mapId});
  const intl = useIntl();
  const addTableToMap = useStoreWithKepler(state => state.kepler.addTableToMap);

  const {onRemoveDataset, onUpdateTableColor} = useCustomSidePanelActions(keplerActions);

  const {addLayer} = keplerActions.visStateActions;

  const onAddTableLayer = useCallback(
    async (tableName: string) => {
      const keplerDatasets = keplerState?.visState.datasets;
      if (!keplerDatasets?.[tableName]) {
        await addTableToMap({
          mapId,
          tableName,
          options: {
            autoCreateLayers: true,
            centerMap: true
          }
        });
      } else {
        addLayer(undefined, tableName);
      }
    },
    [addLayer, addTableToMap, keplerState?.visState.datasets, mapId]
  );

  const isSortByDatasetMode =
    keplerState?.uiState.layerPanelListView === PANEL_VIEW_TOGGLES.byDataset;

  const enableRasterTileLayer = getApplicationConfig().enableRasterTileLayer;
  const enableWMSLayer = getApplicationConfig().enableWMSLayer;

  const filteredLayerClasses = useMemo(() => {
    let filteredClasses = keplerState?.visState.layerClasses || {};
    if (!enableRasterTileLayer && 'rasterTile' in filteredClasses) {
      const {rasterTile: _rasterTile, ...rest} = filteredClasses;
      filteredClasses = rest as LayerClassesType;
    }
    if (!enableWMSLayer && 'wms' in filteredClasses) {
      const {wms: _wms, ...rest} = filteredClasses;
      filteredClasses = rest as LayerClassesType;
    }
    return filteredClasses as LayerClassesType;
  }, [enableRasterTileLayer, enableWMSLayer, keplerState?.visState.layerClasses]);

  if (!keplerState || !keplerActions) {
    return null;
  }

  return (
    <CustomLayerManagerContainer>
      <div className="layer-manager">
        <SidePanelSection>
          <PanelTitle
            className="layer-manager-title"
            title={intl.formatMessage({
              id: layerPanelMetadata?.label || 'Layers'
            })}
          >
            <AddTableLayerButton onAdd={onAddTableLayer} datasets={keplerState.visState.datasets} />
          </PanelTitle>
        </SidePanelSection>

        <SidePanelSection>
          {isSortByDatasetMode ? (
            <DatasetLayerGroup
              datasets={keplerState.visState.datasets}
              showDatasetTable={keplerActions.visStateActions.showDatasetTable}
              layers={keplerState.visState.layers}
              updateTableColor={onUpdateTableColor}
              removeDataset={onRemoveDataset}
              layerOrder={keplerState.visState.layerOrder}
              layerClasses={filteredLayerClasses}
              uiStateActions={keplerActions.uiStateActions}
              visStateActions={keplerActions.visStateActions}
              mapStateActions={keplerActions.mapStateActions}
              showDeleteDataset={showDeleteDataset}
            />
          ) : (
            <LayerList
              layers={keplerState.visState.layers}
              datasets={keplerState.visState.datasets}
              layerOrder={keplerState.visState.layerOrder}
              uiStateActions={keplerActions.uiStateActions}
              visStateActions={keplerActions.visStateActions}
              mapStateActions={keplerActions.mapStateActions}
              layerClasses={filteredLayerClasses}
            />
          )}
        </SidePanelSection>
      </div>
    </CustomLayerManagerContainer>
  );
};
