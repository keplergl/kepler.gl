// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Fragment, useCallback, useMemo} from 'react';
import styled from 'styled-components';

import {
  PanelHeaderContent,
  PanelLabel,
  StyledPanelHeader,
  PanelContent
} from '../../common/styled-components';
import Checkbox from '../../common/checkbox';
import {MinimalField} from '../../common/field-selector';
import PanelHeaderActionFactory from '../panel-header-action';
import LayerColumnConfigFactory from './layer-column-config';
import {FormattedMessage} from '@kepler.gl/localization';
import {Layer, LayerInfoModal, LayerBaseConfig} from '@kepler.gl/layers';
import {SupportedColumnMode, FieldPair, LayerColumns} from '@kepler.gl/types';

import {Help} from '../../common/icons';

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Separator = styled(({children, className}) => (
  <div className={className}>
    <div className="separator-line-cell">
      <div className="separator-line" />
    </div>
    <div className="separator-content">{children}</div>
    <div className="separator-line-cell">
      <div className="separator-line" />
    </div>
  </div>
))`
  display: flex;
  flex-direction: row;
  & > * + * {
    margin-left: 10px;
  }
  & > .separator-line-cell {
    display: flex;
    flex-grow: 1;
    align-items: center;
  }
  & > .separator-content {
    color: ${props => props.theme.labelColor};
  }
  & > .separator-line-cell > .separator-line {
    display: flex;
    border-bottom: 1px solid ${props => props.theme.labelColor};
    width: 100%;
    line-height: 1px;
    height: 1px;
  }
`;

const ConfigPanesContainer = styled.div`
  display: flex;
  flex-direction: column;
  & > * + * {
    margin-top: 10px;
  }
  fieldset {
    border: 1px solid ${props => props.theme.labelColor};
    margin: 0;
  }
  legend {
    display: flex;
    label {
      color: ${props => props.theme.labelColor};
    }
  }
`;

interface FieldOption extends MinimalField {
  fieldIdx: number;
}
type ColumnModeConfig = {
  key: string;
  label: string;
  columns: LayerColumns;
};
export type ColumnModeConfigProps = {
  supportedColumnModes: SupportedColumnMode[] | null;
  selectedColumnMode?: string;
  id: string;
  columns: LayerColumns;
  renderColumnConfig: (
    mode: {key: string; label: string; columns: any},
    selected: boolean
  ) => JSX.Element;
  selectColumnMode: (mode: ColumnModeConfig) => void;
  getHelpHandler?: (mode: ColumnModeConfig) => (() => void) | null;
};

ColumnModeConfigFactory.deps = [PanelHeaderActionFactory];

export function ColumnModeConfigFactory(
  PanelHeaderAction: ReturnType<typeof PanelHeaderActionFactory>
) {
  const ColumnModeConfig: React.FC<ColumnModeConfigProps> = ({
    id,
    supportedColumnModes,
    selectedColumnMode,
    columns,
    renderColumnConfig,
    selectColumnMode,
    getHelpHandler = () => null
  }: ColumnModeConfigProps) => {
    const columnModes = useMemo(
      () =>
        supportedColumnModes
          ? supportedColumnModes.map(({key, label, requiredColumns, optionalColumns}) => {
              const allColumns = (requiredColumns || [])
                .concat(optionalColumns || [])
                .reduce((acc, k) => {
                  acc[k] = columns[k];
                  return acc;
                }, {});
              return {key, label, columns: allColumns};
            })
          : Object.keys(columns).length > 0
          ? [{key: 'default', label: '', columns}]
          : [],
      [supportedColumnModes, columns]
    );

    return (
      <>
        {columnModes.length > 0 ? (
          <TopRow>
            <PanelLabel>
              <FormattedMessage id={'columns.title'} />
            </PanelLabel>
            <PanelLabel>
              <FormattedMessage id="layer.required" />
            </PanelLabel>
          </TopRow>
        ) : null}
        <ConfigPanesContainer>
          {columnModes.map((modeConfig, i) => {
            const {key: columnMode, label} = modeConfig;

            const isSelected = selectedColumnMode === columnMode || columnModes.length === 1;
            const columnPanel = renderColumnConfig(modeConfig, isSelected);
            const helpHandler = getHelpHandler(modeConfig);
            const selectColumnModeHandler = () => selectColumnMode(modeConfig);

            return (
              <Fragment key={columnMode}>
                {i > 0 ? (
                  <Separator>
                    <FormattedMessage id="layer.columnModesSeparator" />
                  </Separator>
                ) : null}
                {columnModes.length > 1 ? (
                  <div className="layer-column-mode-panel">
                    <StyledPanelHeader className="interaction-panel__header">
                      <PanelHeaderContent className="interaction-panel__header__content">
                        <Checkbox
                          type="radio"
                          name={`layer-${id}-input-modes`}
                          checked={isSelected}
                          id={`${id}-input-column-${columnMode}`}
                          label={label}
                          onChange={selectColumnModeHandler}
                        />
                      </PanelHeaderContent>
                      {helpHandler ? (
                        <div className="interaction-panel__header__actions">
                          <PanelHeaderAction
                            id={`${id}-help-button`}
                            className="layer__help-button"
                            tooltip={'layerConfiguration.howTo'}
                            onClick={helpHandler}
                            IconComponent={Help}
                          />
                        </div>
                      ) : null}
                    </StyledPanelHeader>
                    <PanelContent className="interaction-panel__content">
                      {columnPanel}
                    </PanelContent>
                  </div>
                ) : (
                  columnPanel
                )}
              </Fragment>
            );
          })}
        </ConfigPanesContainer>
      </>
    );
  };

  return ColumnModeConfig;
}

export type LayerColumnModeConfigProps = {
  layer: Layer;
  layerConfig: LayerBaseConfig;
  supportedColumnModes: SupportedColumnMode[] | null;
  id: string;
  fields: FieldOption[];
  fieldPairs?: FieldPair[];
  openModal: (l: LayerInfoModal) => void;
  updateLayerConfig: (config: Partial<LayerBaseConfig>) => void;
};

LayerColumnModeConfigFactory.deps = [LayerColumnConfigFactory, ColumnModeConfigFactory];

function LayerColumnModeConfigFactory(
  LayerColumnConfig: ReturnType<typeof LayerColumnConfigFactory>,
  ColumnModeConfig: ReturnType<typeof ColumnModeConfigFactory>
) {
  const LayerColumnModeConfig = ({
    id,
    layer,
    supportedColumnModes,
    layerConfig,
    fields,
    fieldPairs,
    openModal,
    updateLayerConfig
  }: LayerColumnModeConfigProps) => {
    const {columns} = layerConfig;

    const selectColumnMode = useCallback(
      ({key: columnMode}) => {
        updateLayerConfig({columnMode});
      },
      [updateLayerConfig]
    );

    const renderColumnConfig = useCallback(
      ({key: columnMode, columns: cols}, isSelected) => (
        <LayerColumnConfig
          columnPairs={layer.columnPairs}
          columns={cols}
          assignColumnPairs={layer.assignColumnPairs.bind(layer)}
          assignColumn={layer.assignColumn.bind(layer)}
          columnLabels={layer.columnLabels}
          fields={fields}
          fieldPairs={fieldPairs}
          updateLayerConfig={config =>
            updateLayerConfig({
              ...config,
              // if column mode not currently selected
              // set column mode along with the columns
              ...(!isSelected && columnMode !== 'defaut' ? {columnMode} : {})
            })
          }
          isActive={isSelected}
        />
      ),
      [layer, updateLayerConfig, fieldPairs, fields]
    );

    const getHelpHandler = useCallback(
      ({key: columnMode}) => {
        const modal = layer.layerInfoModal?.[columnMode];
        if (modal) {
          return () => openModal(modal);
        }
        return null;
      },
      [layer, openModal]
    );

    return (
      <ColumnModeConfig
        id={id}
        supportedColumnModes={supportedColumnModes}
        selectedColumnMode={layerConfig.columnMode}
        columns={columns}
        selectColumnMode={selectColumnMode}
        renderColumnConfig={renderColumnConfig}
        getHelpHandler={getHelpHandler}
      />
    );
  };

  return LayerColumnModeConfig;
}

export default LayerColumnModeConfigFactory;
