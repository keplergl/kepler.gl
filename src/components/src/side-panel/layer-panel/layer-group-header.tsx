// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useState, useEffect, useRef} from 'react';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';

import {updateLayerGroup, removeLayerGroup} from '@kepler.gl/actions';
import {LayerOrderGroup} from '@kepler.gl/types';
import {getFlatLayerOrder} from '@kepler.gl/reducers';

import {StyledPanelHeader, InlineInput} from '../../common/styled-components';
import {DragHandle} from './layer-panel-header';
import {VertDots, EyeSeen, EyeUnseen, Trash, ArrowDown, ArrowRight} from '../../common/icons';
import PanelHeaderActionFactory from '../panel-header-action';

const GROUP_COLORS = [
  '#4BA9C9',
  '#E8A838',
  '#8BC58B',
  '#D67AB1',
  '#7B8FF7',
  '#F2726F',
  '#56C4A0',
  '#C9A84B'
];

function getGroupColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  return GROUP_COLORS[Math.abs(hash) % GROUP_COLORS.length];
}

const RemoveAction = styled.div`
  display: flex;
  opacity: 0;
  transition: opacity 0.15s ease;
  .panel--header__action {
    height: 16px;
  }
`;

const Container = styled(StyledPanelHeader)`
  position: relative;
  height: ${props => props.theme.layerPanelHeaderHeight}px;
  justify-content: space-between;
  color: ${props => props.theme.textColor};
  padding-right: 10px;
  align-items: center;
  overflow: hidden;

  border: 1px solid ${props => props.theme.panelBackgroundHover};

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.panelBackgroundHover};
    .layer__drag-handle {
      opacity: 1;
    }
    ${RemoveAction} {
      opacity: 1;
    }
  }
`;

const CornerTriangle = styled.div<{$color: string}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: ${props => Math.round(props.theme.layerPanelHeaderHeight / 3)}px
    ${props => Math.round(props.theme.layerPanelHeaderHeight / 3)}px 0 0;
  border-color: ${props => props.$color} transparent transparent transparent;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  height: 16px;
  .panel--header__action {
    height: 16px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  overflow: hidden;
`;

const GroupLabelInput = styled(InlineInput)`
  margin-left: 4px;
  font-weight: 500;
`;

const ConfirmationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background-color: ${props => props.theme.panelBackgroundHover};
  border: 1px solid ${props => props.theme.panelBackgroundHover};
  border-top: none;
  font-size: 11px;
  color: ${props => props.theme.textColor};
  gap: 8px;
`;

const ConfirmButton = styled.button`
  background: ${props => props.theme.secondaryBtnBgd};
  color: ${props => props.theme.secondaryBtnColor};
  border: none;
  border-radius: 2px;
  padding: 3px 8px;
  font-size: 11px;
  cursor: pointer;
  &:hover {
    background: ${props => props.theme.secondaryBtnBgdHover};
  }
`;

export type LayerGroupHeaderProps = {
  layerGroup: LayerOrderGroup;
  isLayerGroupContentOpen?: boolean;
  onToggleLayerGroupContent?: () => void;
  listeners?: any;
  className?: string;
};

LayerGroupHeaderFactory.deps = [PanelHeaderActionFactory];

function LayerGroupHeaderFactory(
  PanelHeaderAction: ReturnType<typeof PanelHeaderActionFactory>
): React.FC<LayerGroupHeaderProps> {
  const LayerGroupHeader: React.FC<LayerGroupHeaderProps> = ({
    layerGroup,
    onToggleLayerGroupContent,
    isLayerGroupContentOpen,
    listeners,
    className
  }) => {
    const {id, label} = layerGroup;
    const dispatch = useDispatch();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const confirmRef = useRef<HTMLDivElement>(null);

    const layerCount = getFlatLayerOrder(layerGroup.layerOrder).length;

    useEffect(() => {
      if (!showConfirmation) return;
      const handleClickOutside = (e: MouseEvent) => {
        if (confirmRef.current && !confirmRef.current.contains(e.target as Node)) {
          setShowConfirmation(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showConfirmation]);

    const onUpdateLabel = useCallback(
      event => {
        dispatch(updateLayerGroup({id, options: {label: event.target.value}}));
      },
      [dispatch, id]
    );

    const onToggleVisibility = useCallback(() => {
      dispatch(updateLayerGroup({id, options: {isVisible: !layerGroup.isVisible}}));
    }, [dispatch, id, layerGroup.isVisible]);

    const onDelete = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (layerCount > 0) {
          setShowConfirmation(true);
        } else {
          dispatch(removeLayerGroup({id}));
        }
      },
      [dispatch, id, layerCount]
    );

    const onConfirmDelete = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(removeLayerGroup({id}));
        setShowConfirmation(false);
      },
      [dispatch, id]
    );

    const VisibilityIcon = layerGroup.isVisible ? EyeSeen : EyeUnseen;
    const CollapseIcon = isLayerGroupContentOpen ? ArrowDown : ArrowRight;

    const stopPropagation = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
    }, []);

    return (
      <div>
        <Container className={className} onClick={onToggleLayerGroupContent}>
          <CornerTriangle $color={getGroupColor(id)} />
          <LeftSection>
            <DragHandle className="layer__drag-handle" listeners={listeners}>
              <VertDots height="20px" />
            </DragHandle>
            <GroupLabelInput
              type="text"
              value={label}
              onClick={stopPropagation}
              onChange={onUpdateLabel}
              id={`${id}:input-group-label`}
            />
          </LeftSection>
          <Actions onClick={stopPropagation}>
            <RemoveAction>
              <PanelHeaderAction
                className="layer-group__delete"
                id={`${id}-delete`}
                tooltip="Remove group"
                onClick={onDelete}
                IconComponent={Trash}
              />
            </RemoveAction>
            <PanelHeaderAction
              className="layer-group__visibility-toggle"
              id={`${id}-visibility`}
              tooltip="Toggle group visibility"
              onClick={onToggleVisibility}
              IconComponent={VisibilityIcon}
            />
            <PanelHeaderAction
              className="layer-group__section-toggle"
              id={`${id}-collapse`}
              tooltip="Toggle group content"
              onClick={onToggleLayerGroupContent}
              IconComponent={CollapseIcon}
            />
          </Actions>
        </Container>
        {showConfirmation ? (
          <ConfirmationBar ref={confirmRef} onClick={stopPropagation}>
            <span>Remove group with layers?</span>
            <ConfirmButton onClick={onConfirmDelete}>Remove</ConfirmButton>
          </ConfirmationBar>
        ) : null}
      </div>
    );
  };

  return LayerGroupHeader;
}

export default LayerGroupHeaderFactory;
