// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo, useState, useCallback} from 'react';
import styled from 'styled-components';
import {injectIntl, IntlShape} from 'react-intl';

import {
  addEffect,
  updateEffect,
  removeEffect,
  reorderEffect,
  ActionHandler
} from '@kepler.gl/actions';
import {LIGHT_AND_SHADOW_EFFECT, EFFECT_DESCRIPTIONS} from '@kepler.gl/constants';
import {Effect} from '@kepler.gl/types';

import {withState} from '../injector';
import SidePanelTitleFactory from './side-panel-title';
import EffectListFactory from './effect-list';
import EffectTypeSelectorFactory from './effect-type-selector';

export type EffectManagerState = {
  visStateActions: {
    addEffect: ActionHandler<typeof addEffect>;
    updateEffect: ActionHandler<typeof updateEffect>;
    removeEffect: ActionHandler<typeof removeEffect>;
    reorderEffect: ActionHandler<typeof reorderEffect>;
  };
  effects: Effect[];
  effectOrder: string[];
  children: React.ReactNode;
};
export type EffectManagerProps = EffectManagerWithIntlProp & EffectManagerState;

export type EffectManagerWithIntlProp = {intl: IntlShape};

const StyledEffectPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  pointer-events: none !important; /* prevent padding from blocking input */
  flex-grow: 1;
  justify-content: space-between;
  overflow: hidden;

  & > * {
    /* all children should allow input */
    pointer-events: all;
  }
`;

// top right position absolute
const StyledEffectPanel = styled.div`
  top: 0;
  background-color: ${props => props.theme.sidePanelBg};
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
`;

const StyledEffectPanelHeader = styled.div`
  padding: ${({theme}) =>
    `${theme.effectPanelPaddingTop}px ${theme.effectPanelPaddingSide}px 4px ${theme.effectPanelPaddingSide}px`};
  border-bottom: 1px solid ${props => props.theme.borderColor};
  min-width: ${({theme}) => theme.effectPanelWidth}px;
`;

type StyledEffectPanelContentProps = {
  extended?: boolean;
};
const StyledEffectPanelContent = styled.div<StyledEffectPanelContentProps>`
  ${props => props.theme.sidePanelScrollBar};
  padding: ${props => (props.extended ? '32px' : '10px 0px 10px 0px')};
  overflow: overlay;
  display: flex;
  flex-direction: column;
`;

EffectManagerFactory.deps = [EffectListFactory, SidePanelTitleFactory, EffectTypeSelectorFactory];

function EffectManagerFactory(
  EffectList: ReturnType<typeof EffectListFactory>,
  SidePanelTitle: ReturnType<typeof SidePanelTitleFactory>,
  EffectTypeSelector: ReturnType<typeof EffectTypeSelectorFactory>
): React.FC<EffectManagerProps> {
  const EffectManager = (props: EffectManagerWithIntlProp & EffectManagerState) => {
    const {intl, visStateActions, effects, effectOrder, children} = props;
    const {addEffect: visStateAddEffect} = visStateActions;
    const [typeSelectorOpened, setTypeSelectorOpened] = useState(false);

    // Prevent shadow effect from being added multiple times
    const effectOptions = useMemo(() => {
      const hasShadow = effects.some(effect => {
        return effect.type === LIGHT_AND_SHADOW_EFFECT.type;
      });

      return EFFECT_DESCRIPTIONS.map(desc => {
        return {
          ...desc,
          disabled: Boolean(hasShadow && desc.type === LIGHT_AND_SHADOW_EFFECT.type)
        };
      });
    }, [effects]);

    const onAddEffect = useCallback(
      type => {
        visStateAddEffect({type});
      },
      [visStateAddEffect]
    );

    const onTypeSelectOpen = useCallback(() => {
      setTypeSelectorOpened(true);
    }, []);

    const onTypeSelectClose = useCallback(() => {
      setTypeSelectorOpened(false);
    }, []);

    return (
      <StyledEffectPanelContainer className="effect-manager">
        <StyledEffectPanel>
          <StyledEffectPanelHeader>
            <SidePanelTitle
              className="effect-manager-title"
              title={intl.formatMessage({id: 'effectManager.effects'})}
            >
              <EffectTypeSelector
                options={effectOptions}
                onSelect={onAddEffect}
                onOpen={onTypeSelectOpen}
                onBlur={onTypeSelectClose}
              />
            </SidePanelTitle>
          </StyledEffectPanelHeader>

          <StyledEffectPanelContent extended={typeSelectorOpened && effects.length === 0}>
            <EffectList
              effects={effects}
              effectOrder={effectOrder}
              visStateActions={visStateActions}
              isSortable={true}
            />
          </StyledEffectPanelContent>
        </StyledEffectPanel>
        {children}
      </StyledEffectPanelContainer>
    );
  };

  return withState(
    [],
    state => {
      const visState = state.demo.keplerGl.map.visState;
      return {
        effects: visState.effects,
        effectOrder: visState.effectOrder
      };
    },
    {
      visStateActions: {addEffect, updateEffect, removeEffect, reorderEffect}
    }
  )(injectIntl(EffectManager)) as React.FC<EffectManagerProps>;
}

export default EffectManagerFactory;
