// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component, ComponentType} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import {dataTestIds, LIGHT_AND_SHADOW_EFFECT} from '@kepler.gl/constants';
import {removeEffect, updateEffect} from '@kepler.gl/actions';
import {Effect} from '@kepler.gl/types';

import EffectPanelHeaderFactory from './effect-panel-header';
import EffectConfiguratorFactory from './effect-configurator';

export type EffectPanelProps = {
  className: string;
  effect: Effect;
  isDraggable: boolean;
  listeners: any;
  removeEffect: typeof removeEffect;
  updateEffect: typeof updateEffect;

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
  margin: 3px auto 3px 25px;
  max-width: 295px;
`;

EffectPanelFactory.deps = [EffectPanelHeaderFactory, EffectConfiguratorFactory];

function EffectPanelFactory(
  EffectPanelHeader: ReturnType<typeof EffectPanelHeaderFactory>,
  EffectConfigurator: ReturnType<typeof EffectConfiguratorFactory>
): ComponentType<EffectPanelProps> {
  class EffectPanel extends Component<EffectPanelProps> {
    static propTypes = {
      effect: PropTypes.object.isRequired,
      removeEffect: PropTypes.func.isRequired,
      updateEffect: PropTypes.func.isRequired,
      isDraggable: PropTypes.bool
    };

    _toggleEnabled = (event?: Event) => {
      event?.stopPropagation();
      this.props.updateEffect(this.props.effect.id, {
        isEnabled: !this.props.effect.isEnabled
      });
    };

    _toggleConfigActive = (event?: Event) => {
      event?.stopPropagation();
      this.props.updateEffect(this.props.effect.id, {
        isConfigActive: !this.props.effect.isConfigActive
      });
    };

    _removeEffect = (event?: Event) => {
      event?.stopPropagation();
      this.props.removeEffect(this.props.effect.id);
    };

    _updateEffectConfig = (event, id, props) => {
      event?.stopPropagation();
      this.props.updateEffect(id, props);
    };

    render() {
      const {effect, isDraggable, listeners} = this.props;
      const {id, type, isConfigActive, isJsonEditorActive, isEnabled} = effect;

      const sortingAllowed = type !== LIGHT_AND_SHADOW_EFFECT.type;

      return (
        <PanelWrapper
          active={false}
          className={classnames('effect-panel', this.props.className)}
          data-testid={dataTestIds.effectPanel}
          style={this.props.style}
          onMouseDown={this.props.onMouseDown}
          onTouchStart={this.props.onTouchStart}
        >
          <EffectPanelHeader
            isConfigActive={isConfigActive}
            effectId={id}
            type={type}
            isEnabled={isEnabled}
            isJsonEditorActive={isJsonEditorActive}
            onToggleEnabled={this._toggleEnabled}
            onRemoveEffect={this._removeEffect}
            onToggleEnableConfig={this._toggleConfigActive}
            isDragNDropEnabled={isDraggable && sortingAllowed}
            listeners={listeners}
            showSortHandle={type !== LIGHT_AND_SHADOW_EFFECT.type}
          />
          {isConfigActive && (
            <EffectConfigurator
              key={`effect-configurator-${id}`}
              effect={effect}
              updateEffectConfig={this._updateEffectConfig}
            />
          )}
        </PanelWrapper>
      );
    }
  }

  // @ts-expect-error fix The types of 'propTypes.isDraggable[nominalTypeHack]' are incompatible between these types.
  return EffectPanel;
}

export default EffectPanelFactory;
