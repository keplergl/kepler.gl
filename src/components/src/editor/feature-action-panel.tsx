// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useState, ComponentType} from 'react';
import {useIntl} from 'react-intl';
import copy from 'copy-to-clipboard';
import {useDismiss, useFloating, useInteractions} from '@floating-ui/react';
import classnames from 'classnames';
import styled from 'styled-components';

import {Layer} from '@kepler.gl/layers';
import {Filter} from '@kepler.gl/types';
import {Feature} from '@deck.gl-community/editable-layers';
import {Datasets} from '@kepler.gl/table';
import {canApplyFeatureFilter, getApplicationConfig, isExtractableLayer} from '@kepler.gl/utils';

import ActionPanel, {ActionPanelItem} from '../common/action-panel';
import {Trash, Layers, Copy, Checkmark, Edit, Files} from '../common/icons';
import FeaturePropertiesEditor from './feature-properties-editor';

const LAYOVER_OFFSET = 4;

const StyledActionsLayer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 4px;
  .layer-panel-item-disabled {
    color: ${props => props.theme.textColor};
  }
  .editor-extract-list .nested-group {
    max-width: none;
    overflow: visible;
    width: max-content;
  }
  .editor-extract-list:hover .nested-group {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .editor-extract-list .nested-group > .action-panel-item {
    max-width: none;
    width: auto;
  }
  .extract-layer-panel-item .label {
    overflow: visible;
    text-overflow: unset;
  }
`;
const defaultActionIcons = {
  remove: Trash,
  layer: Layers,
  copy: Copy,
  copied: Checkmark,
  edit: Edit,
  extract: Files
};
PureFeatureActionPanelFactory.deps = [];

export interface FeatureActionPanelProps {
  className?: string;
  datasets: Datasets;
  selectedFeature: Feature | null;
  position: {
    x: number;
    y: number;
  } | null;
  layers: Layer[];
  extractLayers?: Layer[];
  currentFilter?: Filter;
  onToggleLayer: (layer: Layer) => void;
  onDeleteFeature: () => void;
  onExtractData?: (layer: Layer) => void;
  onSetFeatureProperties?: (feature: Feature, properties: Record<string, unknown>) => void;
  onClose?: () => void;
  children?: React.ReactNode;
  actionIcons?: {
    [id: string]: React.ElementType;
  };
}

export function PureFeatureActionPanelFactory(): React.FC<FeatureActionPanelProps> {
  const FeatureActionPanel = ({
    className,
    datasets,
    selectedFeature,
    position = null,
    layers,
    extractLayers,
    currentFilter,
    onToggleLayer,
    onDeleteFeature,
    onExtractData,
    onSetFeatureProperties,
    actionIcons = defaultActionIcons,
    children,
    onClose
  }: FeatureActionPanelProps) => {
    const [copied, setCopied] = useState(false);
    const [showProperties, setShowProperties] = useState(false);
    const {layerId = []} = currentFilter || {};
    const intl = useIntl();

    const {refs, context} = useFloating({
      open: true,
      onOpenChange: v => {
        if (!v && onClose) {
          onClose();
        }
      }
    });
    const dismiss = useDismiss(context);

    const {getFloatingProps} = useInteractions([dismiss]);

    const copyGeometry = useCallback(() => {
      if (selectedFeature?.geometry) copy(JSON.stringify(selectedFeature.geometry));
      setCopied(true);
    }, [selectedFeature?.geometry]);

    useEffect(() => {
      setShowProperties(false);
    }, [selectedFeature?.id]);

    if (!position) {
      return null;
    }

    const canFilterLayers = canApplyFeatureFilter(selectedFeature as any);
    const enableSketches = getApplicationConfig().enableDrawOnMapSketches;
    const extractableLayers = canFilterLayers
      ? (extractLayers ?? layers).filter(layer => isExtractableLayer(layer, datasets))
      : [];
    return (
      <StyledActionsLayer
        ref={refs.setFloating}
        {...getFloatingProps()}
        className={classnames('feature-action-panel', className)}
        style={{
          top: `${position.y + LAYOVER_OFFSET}px`,
          left: `${position.x + LAYOVER_OFFSET}px`
        }}
      >
        <ActionPanel>
          {canFilterLayers ? (
            <ActionPanelItem
              className="editor-layers-list"
              label={intl.formatMessage({
                id: 'editor.filterLayer',
                defaultMessage: 'Filter layers'
              })}
              Icon={actionIcons.layer}
            >
              {layers.length ? (
                layers.map((layer, index) => (
                  <ActionPanelItem
                    key={index}
                    label={layer.config.label}
                    // @ts-ignore
                    color={datasets[layer.config.dataId].color}
                    isSelection={true}
                    isActive={layerId.includes(layer.id)}
                    onClick={() => onToggleLayer(layer)}
                    className="layer-panel-item"
                  />
                ))
              ) : (
                <ActionPanelItem
                  key={'no-layers'}
                  label={intl.formatMessage({
                    id: 'editor.noLayersToFilter',
                    defaultMessage: 'No layers to filter'
                  })}
                  isSelection={false}
                  isActive={false}
                  className="layer-panel-item-disabled"
                />
              )}
            </ActionPanelItem>
          ) : null}
          {canFilterLayers ? (
            <ActionPanelItem
              className="editor-extract-list"
              label={intl.formatMessage({
                id: 'editor.extractData',
                defaultMessage: 'Extract data'
              })}
              Icon={actionIcons.extract}
            >
              {extractableLayers.length ? (
                extractableLayers.map((layer, index) => {
                  const dataset = datasets[layer.config.dataId];
                  return (
                    <ActionPanelItem
                      key={layer.id || index}
                      label={intl.formatMessage(
                        {
                          id: 'editor.extractFromLayer',
                          defaultMessage: 'from {layerName} layer'
                        },
                        {layerName: layer.config.label}
                      )}
                      // @ts-ignore
                      color={dataset?.color}
                      onClick={() => {
                        onExtractData?.(layer);
                        onClose?.();
                      }}
                      className="extract-layer-panel-item"
                    />
                  );
                })
              ) : (
                <ActionPanelItem
                  key={'no-layers-extract'}
                  label={intl.formatMessage({
                    id: 'editor.noLayersToExtract',
                    defaultMessage: 'No layers to extract'
                  })}
                  isSelection={false}
                  isActive={false}
                  className="layer-panel-item-disabled"
                />
              )}
            </ActionPanelItem>
          ) : null}
          {enableSketches ? (
            <ActionPanelItem
              label={intl.formatMessage({
                id: 'editor.editProperties',
                defaultMessage: 'Edit Properties'
              })}
              className="edit-properties-panel-item"
              Icon={actionIcons.edit}
              onClick={() => setShowProperties(open => !open)}
            />
          ) : null}
          <ActionPanelItem
            label={intl.formatMessage({id: 'editor.copyGeometry', defaultMessage: 'Copy Geometry'})}
            className="delete-panel-item"
            Icon={copied ? actionIcons.copied : actionIcons.copy}
            onClick={copyGeometry}
          />
          {children}
          <ActionPanelItem
            label={intl.formatMessage({id: 'tooltip.delete', defaultMessage: 'Delete'})}
            className="delete-panel-item"
            Icon={actionIcons.remove}
            onClick={onDeleteFeature}
          />
        </ActionPanel>
        {enableSketches && showProperties ? (
          <FeaturePropertiesEditor
            selectedFeature={selectedFeature}
            onSetFeatureProperties={onSetFeatureProperties}
          />
        ) : null}
      </StyledActionsLayer>
    );
  };

  FeatureActionPanel.displayName = 'FeatureActionPanel';

  return FeatureActionPanel;
}

FeatureActionPanelFactory.deps = PureFeatureActionPanelFactory.deps;

export default function FeatureActionPanelFactory(): ComponentType<FeatureActionPanelProps> {
  return PureFeatureActionPanelFactory();
}
