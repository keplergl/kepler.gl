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
import {assignColumnsByColumnMode, Layer, LayerInfoModal, LayerBaseConfig} from '@kepler.gl/layers';
import {SupportedColumnModes, FieldPair} from '@kepler.gl/types';

import {Help} from '../../common/icons';

LayerColumnModeConfigFactory.deps = [LayerColumnConfigFactory, PanelHeaderActionFactory];

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

export type LayerColumnModeConfigProps<FieldOption extends MinimalField> = {
  layer: Layer;
  supportedColumnModes: SupportedColumnModes[] | null;
  id: string;
  layerConfig: LayerBaseConfig;
  fields: FieldOption[];
  fieldPairs?: FieldPair[];
  openModal: (l: LayerInfoModal) => void;
  updateLayerConfig: (config: Partial<LayerBaseConfig>) => void;
};

function LayerColumnModeConfigFactory(
  LayerColumnConfig: ReturnType<typeof LayerColumnConfigFactory>,
  PanelHeaderAction: ReturnType<typeof PanelHeaderActionFactory>
) {
  const LayerColumnModeConfig: React.FC<LayerColumnModeConfigProps<any>> = ({
    layer,
    supportedColumnModes,
    id,
    layerConfig,
    fields,
    fieldPairs,
    openModal,
    updateLayerConfig
  }: LayerColumnModeConfigProps<any>) => {
    const {columns} = layerConfig;
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
          ? [{key: 'default', label: undefined, columns}]
          : [],
      [supportedColumnModes, columns]
    );

    const handleSelectColumnMode = useCallback(
      columnMode => {
        const updatedColumns = assignColumnsByColumnMode({
          columns,
          supportedColumnModes,
          columnMode
        });

        updateLayerConfig({columnMode, columns: updatedColumns});
      },
      [updateLayerConfig, columns, supportedColumnModes]
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
          {columnModes.map(({key: columnMode, label, columns: cols}, i) => {
            const columnPanel = (
              <LayerColumnConfig
                columnPairs={layer.columnPairs}
                columns={cols}
                assignColumnPairs={layer.assignColumnPairs.bind(layer)}
                assignColumn={layer.assignColumn.bind(layer)}
                columnLabels={layer.columnLabels}
                fields={fields}
                fieldPairs={fieldPairs}
                updateLayerConfig={updateLayerConfig}
              />
            );

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
                          checked={layerConfig.columnMode === columnMode}
                          id={`${id}-input-column-${columnMode}`}
                          label={label}
                          secondary
                          onChange={() => handleSelectColumnMode(columnMode)}
                        />
                      </PanelHeaderContent>
                      {layer.layerInfoModal?.[columnMode] ? (
                        <div className="interaction-panel__header__actions">
                          <PanelHeaderAction
                            id={`${id}-help-button`}
                            className="layer__help-button"
                            tooltip={'layerConfiguration.howTo'}
                            onClick={() => openModal(layer.layerInfoModal?.[columnMode])}
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

  return LayerColumnModeConfig;
}

export default LayerColumnModeConfigFactory;
