// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';

import {VisStateActions} from '@kepler.gl/actions';
import {FormattedMessage} from '@kepler.gl/localization';
import {Layer} from '@kepler.gl/layers';
import {buildLayerOrderHierarchy, getAncestorLayerGroups} from '@kepler.gl/reducers';
import {
  InteractionConfig,
  LayerOrder,
  LayerOrderGroup,
  LayerOrderHierarchy
} from '@kepler.gl/types';

import Switch from '../../common/switch';
import {Legend} from '../../common/icons';
import {
  PanelContent,
  PanelHeaderContent,
  PanelHeaderTitle,
  PanelLabel,
  SidePanelDivider,
  StyledPanelHeader,
  shouldForwardProp
} from '../../common/styled-components';

const StyledLegendPanel = styled.div`
  padding-bottom: 6px;
  contain: layout paint;
`;

const LegendHint = styled.div`
  color: ${props => props.theme.subtextColor};
  font-size: 11px;
  line-height: 1.4;
  margin-bottom: 10px;
`;

const LegendRow = styled.div.withConfig({shouldForwardProp})<{$depth: number; $dimmed?: boolean}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 24px;
  margin-bottom: 4px;
  padding-left: ${props => props.$depth * 16}px;
  opacity: ${props => (props.$dimmed ? 0.45 : 1)};
`;

const LegendLabel = styled.label.withConfig({shouldForwardProp})<{$group?: boolean}>`
  color: ${props => props.theme.textColor};
  cursor: pointer;
  font-size: 12px;
  font-weight: ${props => (props.$group ? 500 : 400)};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LegendOptionRow = styled.div`
  color: ${props => props.theme.labelColor};
  display: flex;
  font-size: ${props => props.theme.inputFontSize};
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  line-height: 14px;
  margin-bottom: 12px;
`;

const DEFAULT_LEGEND_CONFIG: InteractionConfig['legend'] = {
  id: 'legend',
  label: 'interactions.legend',
  enabled: true,
  config: {hideInvisibleLayers: false}
};

type LegendConfigProps = {
  layers: readonly Layer[];
  layerOrder?: LayerOrder;
  visStateActions: typeof VisStateActions;
  legendConfig?: InteractionConfig['legend'];
};

function isHiddenByGroup(layerOrder: LayerOrder | undefined, entryId: string): boolean {
  if (!layerOrder?.length) {
    return false;
  }
  return getAncestorLayerGroups(layerOrder, entryId).some(
    group => group.isIncludedInLegend === false
  );
}

type LegendEntriesProps = {
  entries: LayerOrderHierarchy;
  depth: number;
  layers: readonly Layer[];
  layerOrder?: LayerOrder;
  onToggleLayer: (layer: Layer) => void;
  onToggleGroup: (group: LayerOrderGroup) => void;
};

const LegendEntries: React.FC<LegendEntriesProps> = ({
  entries,
  depth,
  layers,
  layerOrder,
  onToggleLayer,
  onToggleGroup
}) => {
  const intl = useIntl();
  const hiddenByGroupTitle = intl.formatMessage({id: 'interactions.legendHiddenByGroup'});

  return (
    <>
      {entries.map(entry => {
        const [type, value] = entry;
        if (type === 'layerGroup') {
          const group = value as LayerOrderGroup;
          const included = group.isIncludedInLegend !== false;
          const dimmed = isHiddenByGroup(layerOrder, group.id);
          return (
            <React.Fragment key={group.id}>
              <LegendRow
                className="interaction-legend__row interaction-legend__row--group"
                $depth={depth}
                $dimmed={dimmed}
                title={dimmed ? hiddenByGroupTitle : undefined}
                data-testid={`interaction-legend-row-${group.id}`}
              >
                <LegendLabel $group htmlFor={`legend-include-${group.id}`}>
                  {group.label}
                </LegendLabel>
                <Switch
                  checked={included}
                  id={`legend-include-${group.id}`}
                  secondary
                  onChange={() => onToggleGroup(group)}
                />
              </LegendRow>
              <LegendEntries
                entries={buildLayerOrderHierarchy(group.layerOrder, layers)}
                depth={depth + 1}
                layers={layers}
                layerOrder={layerOrder}
                onToggleLayer={onToggleLayer}
                onToggleGroup={onToggleGroup}
              />
            </React.Fragment>
          );
        }

        const layer = value as Layer;
        const included = layer.config.isIncludedInLegend !== false;
        const dimmed = isHiddenByGroup(layerOrder, layer.id);
        return (
          <LegendRow
            key={layer.id}
            className="interaction-legend__row"
            $depth={depth}
            $dimmed={dimmed}
            title={dimmed ? hiddenByGroupTitle : undefined}
            data-testid={`interaction-legend-row-${layer.id}`}
          >
            <LegendLabel htmlFor={`legend-include-${layer.id}`}>
              {layer.config.label || layer.id}
            </LegendLabel>
            <Switch
              checked={included}
              id={`legend-include-${layer.id}`}
              secondary
              onChange={() => onToggleLayer(layer)}
            />
          </LegendRow>
        );
      })}
    </>
  );
};

const LegendConfig: React.FC<LegendConfigProps> = ({
  layers,
  layerOrder,
  visStateActions,
  legendConfig
}) => {
  const legendInteraction = legendConfig ?? DEFAULT_LEGEND_CONFIG;
  const hideInvisibleLayers = legendInteraction.config.hideInvisibleLayers === true;
  const enabled = legendInteraction.enabled !== false;

  const onToggleLayer = useCallback(
    (layer: Layer) => {
      visStateActions.layerConfigChange(layer, {
        isIncludedInLegend: layer.config.isIncludedInLegend === false
      });
    },
    [visStateActions]
  );

  const onToggleGroup = useCallback(
    (group: LayerOrderGroup) => {
      visStateActions.updateLayerGroup({
        id: group.id,
        options: {isIncludedInLegend: group.isIncludedInLegend === false}
      });
    },
    [visStateActions]
  );

  const onToggleEnabled = useCallback(() => {
    visStateActions.interactionConfigChange({
      ...legendInteraction,
      enabled: !enabled
    });
  }, [visStateActions, legendInteraction, enabled]);

  const onToggleHideInvisible = useCallback(() => {
    visStateActions.interactionConfigChange({
      ...legendInteraction,
      config: {
        ...legendInteraction.config,
        hideInvisibleLayers: !hideInvisibleLayers
      }
    });
  }, [visStateActions, legendInteraction, hideInvisibleLayers]);

  const entries: LayerOrderHierarchy = layerOrder?.length
    ? buildLayerOrderHierarchy(layerOrder, layers)
    : layers.filter(layer => !layer.config.hidden).map(layer => ['layer', layer] as const);

  return (
    <StyledLegendPanel className="interaction-panel interaction-legend">
      <StyledPanelHeader className="interaction-legend__header">
        <PanelHeaderContent className="interaction-legend__header__content">
          <div className="interaction-legend__header__icon icon">
            <Legend height="16px" />
          </div>
          <div className="interaction-legend__header__title">
            <PanelHeaderTitle>
              <FormattedMessage id="interactions.legend" />
            </PanelHeaderTitle>
          </div>
        </PanelHeaderContent>
        <div className="interaction-legend__header__actions">
          <Switch checked={enabled} id="legend-toggle" onChange={onToggleEnabled} secondary />
        </div>
      </StyledPanelHeader>
      {enabled ? (
        <PanelContent className="interaction-legend__content">
          <LegendHint>
            <FormattedMessage id="interactions.legendHint" />
          </LegendHint>
          <LegendOptionRow className="interaction-legend__hide-invisible">
            <label htmlFor="legend-hide-invisible">
              <FormattedMessage id="interactions.legendHideInvisible" />
            </label>
            <Switch
              checked={hideInvisibleLayers}
              id="legend-hide-invisible"
              secondary
              onChange={onToggleHideInvisible}
            />
          </LegendOptionRow>
          <PanelLabel className="interaction-legend__all-layers">
            <FormattedMessage id="interactions.legendAllLayers" />
          </PanelLabel>
          <SidePanelDivider />
          {entries.length ? (
            <LegendEntries
              entries={entries}
              depth={0}
              layers={layers}
              layerOrder={layerOrder}
              onToggleLayer={onToggleLayer}
              onToggleGroup={onToggleGroup}
            />
          ) : (
            <LegendHint>
              <FormattedMessage id="interactions.legendEmpty" />
            </LegendHint>
          )}
        </PanelContent>
      ) : null}
    </StyledLegendPanel>
  );
};

export default LegendConfig;
