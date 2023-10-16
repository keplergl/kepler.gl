import React, {Component, ComponentType} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import {dataTestIds, LIGHT_AND_SHADOW_EFFECT} from '@kepler.gl/constants';
import {removeEffect, updateEffect} from '@kepler.gl/actions';
import {Effect, EffectConfig} from '@kepler.gl/types';

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
  margin-bottom: 8px;
  z-index: 1000;
  &.dragging {
    cursor: move;
  }
  margin: 3px 25px;
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

    _toggleEnabled = (e?: Event) => {
      e?.stopPropagation();
      this.props.updateEffect(this.props.effect.id, {
        isEnabled: !this.props.effect.config.isEnabled
      });
    };

    _toggleConfigActive = (e?: Event) => {
      e?.stopPropagation();
      this.props.updateEffect(this.props.effect.id, {
        isConfigActive: !this.props.effect.config.isConfigActive
      });
    };

    _removeEffect = (e?: Event) => {
      e?.stopPropagation();
      this.props.removeEffect(this.props.effect.id);
    };

    _updateEffectConfig = (e, id, props) => {
      e?.stopPropagation();
      this.props.updateEffect(id, props);
    };

    render() {
      const {effect, isDraggable, listeners} = this.props;
      const {config = {} as EffectConfig} = effect;

      return (
        <PanelWrapper
          active={false}
          className={`effect-panel ${this.props.className}`}
          data-testid={dataTestIds.effectPanel}
          style={this.props.style}
          onMouseDown={this.props.onMouseDown}
          onTouchStart={this.props.onTouchStart}
        >
          <EffectPanelHeader
            isConfigActive={config.isConfigActive}
            effectId={effect.id}
            label={config.name}
            isEnabled={config.isEnabled}
            onToggleEnabled={this._toggleEnabled}
            onRemoveEffect={this._removeEffect}
            onToggleEnableConfig={this._toggleConfigActive}
            isDragNDropEnabled={isDraggable}
            listeners={listeners}
            showSortHandle={effect.type !== LIGHT_AND_SHADOW_EFFECT.type}
          />
          {config.isConfigActive && (
            <EffectConfigurator
              key={`effect-configurator-${effect.id}`}
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
