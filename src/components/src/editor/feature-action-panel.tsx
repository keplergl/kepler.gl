// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useState, ComponentType} from 'react';
import {useIntl} from 'react-intl';

import ActionPanel, {ActionPanelItem} from '../common/action-panel';
import styled from 'styled-components';
import classnames from 'classnames';
import {Trash, Layers, Copy, Checkmark} from '../common/icons';
import copy from 'copy-to-clipboard';
import {useDismiss, useFloating, useInteractions} from '@floating-ui/react';
import {Layer} from '@kepler.gl/layers';
import {Filter} from '@kepler.gl/types';
import {Feature} from '@nebula.gl/edit-modes';
import {Datasets} from '@kepler.gl/table';

const LAYOVER_OFFSET = 4;

const StyledActionsLayer = styled.div`
  position: absolute;
  .layer-panel-item-disabled {
    color: ${props => props.theme.textColor};
  }
`;
const defaultActionIcons = {
  remove: Trash,
  layer: Layers,
  copy: Copy,
  copied: Checkmark
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
  currentFilter?: Filter;
  onToggleLayer: (layer: Layer) => void;
  onDeleteFeature: () => void;
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
    position,
    layers,
    currentFilter,
    onToggleLayer,
    onDeleteFeature,
    actionIcons = defaultActionIcons,
    children,
    onClose
  }: FeatureActionPanelProps) => {
    const [copied, setCopied] = useState(false);
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

    if (!position) {
      return null;
    }

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
          <ActionPanelItem
            className="editor-layers-list"
            label={intl.formatMessage({id: 'editor.filterLayer', defaultMessage: 'Filter layers'})}
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
      </StyledActionsLayer>
    );
  };

  FeatureActionPanel.displayName = 'FeatureActionPanel';
  FeatureActionPanel.defaultProps = {
    position: null,
    actionIcons: defaultActionIcons
  };

  return FeatureActionPanel;
}

FeatureActionPanelFactory.deps = PureFeatureActionPanelFactory.deps;

export default function FeatureActionPanelFactory(): ComponentType<FeatureActionPanelProps> {
  return PureFeatureActionPanelFactory();
}
