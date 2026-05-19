// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, ComponentType} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

import {dataTestIds, LIGHT_AND_SHADOW_EFFECT} from '@kepler.gl/constants';
import {ActionHandler, removeEffect, updateEffect} from '@kepler.gl/actions';
import {Effect} from '@kepler.gl/types';

import EffectPanelHeaderFactory from './effect-panel-header';
import EffectConfiguratorFactory from './effect-configurator';

export type EffectPanelProps = {
  className: string;
  effect: Effect;
  isDraggable: boolean;
  listeners: any;
  removeEffect: ActionHandler<typeof removeEffect>;
  updateEffect: ActionHandler<typeof updateEffect>;

  style?: React.CSSProperties;
  onMouseDown: React.MouseEventHandler<HTMLDivElement>;
  onTouchStart: React.TouchEventHandler<HTMLDivElement>;
};

export type PanelWrapperProps = {
  active: boolean;
};

const PanelWrapper = styled.div<PanelWrapperProps>`
  font-size: 12px;
  border-radius: 1px;
  z-index: 1000;
  &.dragging {
    cursor: move;
  }
  margin: 3px 16px;
`;

EffectPanelFactory.deps = [EffectPanelHeaderFactory, EffectConfiguratorFactory];

function EffectPanelFactory(
  EffectPanelHeader: ReturnType<typeof EffectPanelHeaderFactory>,
  EffectConfigurator: ReturnType<typeof EffectConfiguratorFactory>
): ComponentType<EffectPanelProps> {
  const EffectPanel: React.FC<EffectPanelProps> = ({
    className,
    effect,
    isDraggable,
    listeners,
    removeEffect: removeEffectAction,
    updateEffect: updateEffectAction,
    style,
    onMouseDown,
    onTouchStart
  }) => {
    const toggleEnabled = useCallback(
      (event?: Event) => {
        event?.stopPropagation();
        updateEffectAction(effect.id, {isEnabled: !effect.isEnabled});
      },
      [updateEffectAction, effect.id, effect.isEnabled]
    );

    const toggleConfigActive = useCallback(
      (event?: Event) => {
        event?.stopPropagation();
        updateEffectAction(effect.id, {isConfigActive: !effect.isConfigActive});
      },
      [updateEffectAction, effect.id, effect.isConfigActive]
    );

    const handleRemoveEffect = useCallback(
      (event?: Event) => {
        event?.stopPropagation();
        removeEffectAction(effect.id);
      },
      [removeEffectAction, effect.id]
    );

    const handleUpdateEffectConfig = useCallback(
      (event, id, props) => {
        event?.stopPropagation();
        updateEffectAction(id, props);
      },
      [updateEffectAction]
    );

    const {id, type, isConfigActive, isJsonEditorActive, isEnabled} = effect;
    const sortingAllowed = type !== LIGHT_AND_SHADOW_EFFECT.type;

    return (
      <PanelWrapper
        active={false}
        className={classnames('effect-panel', className)}
        data-testid={dataTestIds.effectPanel}
        style={style}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <EffectPanelHeader
          isConfigActive={isConfigActive}
          effectId={id}
          type={type}
          isEnabled={isEnabled}
          isJsonEditorActive={isJsonEditorActive}
          onToggleEnabled={toggleEnabled}
          onRemoveEffect={handleRemoveEffect}
          onToggleEnableConfig={toggleConfigActive}
          isDragNDropEnabled={isDraggable && sortingAllowed}
          listeners={listeners}
          showSortHandle={type !== LIGHT_AND_SHADOW_EFFECT.type}
        />
        {isConfigActive && (
          <EffectConfigurator
            key={`effect-configurator-${id}`}
            effect={effect}
            updateEffectConfig={handleUpdateEffectConfig}
          />
        )}
      </PanelWrapper>
    );
  };

  return EffectPanel;
}

export default EffectPanelFactory;
