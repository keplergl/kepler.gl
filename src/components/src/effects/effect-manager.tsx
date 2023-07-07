import React, {useMemo} from 'react';
import styled from 'styled-components';
import {IntlShape} from 'react-intl';
import {injectIntl} from 'react-intl';

import {addEffect, updateEffect, removeEffect, reorderEffect} from '@kepler.gl/actions';
import {LIGHT_AND_SHADOW_EFFECT, EFFECT_DESCS} from '@kepler.gl/constants';
import {VisStateActions} from '@kepler.gl/actions';
import {Effect} from '@kepler.gl/types';

import {withState} from '../injector';
import SidePanelTitleFactory from './side-panel-title';
import EffectListFactory from './effect-list';
import EffectTypeSelectorFactory from './effect-type-selector';

export type EffectManagerState = {
  visStateActions: typeof VisStateActions;
  effects: Effect[];
  effectOrder: string[];
  children: React.ReactNode;
};
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
    `${theme.effectPanelPaddingTop}px ${theme.effectPanelPaddingSide}px 4px ${theme.effectPanelPaddingSide}px}`};
  border-bottom: 1px solid ${props => props.theme.borderColor};
  min-width: ${({theme}) => theme.effectPanelWidth}px;
`;

const StyledEffectPanelContent = styled.div`
  ${props => props.theme.sidePanelScrollBar};
  padding: 10px 0;
  overflow: overlay;
  display: flex;
  flex-direction: column;
`;

EffectManagerFactory.deps = [EffectListFactory, SidePanelTitleFactory, EffectTypeSelectorFactory];

function EffectManagerFactory(
  EffectList: ReturnType<typeof EffectListFactory>,
  SidePanelTitle: ReturnType<typeof SidePanelTitleFactory>,
  EffectTypeSelector: ReturnType<typeof EffectTypeSelectorFactory>
): React.FC<EffectManagerWithIntlProp> {
  const EffectManager = (props: EffectManagerWithIntlProp & EffectManagerState) => {
    const {intl, visStateActions, effects, effectOrder, children} = props;

    // Prevent shadow effect from being added multiple times
    const effectOptions = useMemo(() => {
      const hasShadow = effects.some(effect => {
        return effect.config.type === LIGHT_AND_SHADOW_EFFECT.type;
      });

      return hasShadow
        ? EFFECT_DESCS.filter(desc => desc.type !== LIGHT_AND_SHADOW_EFFECT.type)
        : EFFECT_DESCS;
    }, [effects]);

    return (
      <StyledEffectPanelContainer className="effect-manager">
        <StyledEffectPanel>
          <StyledEffectPanelHeader>
            <SidePanelTitle
              className="effect-manager-title"
              title={intl.formatMessage({id: 'effectManager.effect'})}
            >
              <EffectTypeSelector options={effectOptions} onSelect={visStateActions.addEffect} />
            </SidePanelTitle>
          </StyledEffectPanelHeader>

          <StyledEffectPanelContent>
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
  )(injectIntl(EffectManager)) as React.FC<{}>;
}

export default EffectManagerFactory;
