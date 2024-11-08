// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState, useCallback} from 'react';
import styled from 'styled-components';
import {injectIntl, IntlShape} from 'react-intl';

import {AiAssistantConfig} from '@kepler.gl/types';
import {ActionHandler, mapStyleChange, updateAiAssistantConfig} from '@kepler.gl/actions';
import {withState} from '../injector';
import SidePanelTitleFactory from '../effects/side-panel-title';
import Settings from '../common/icons/settings';
import AiAssistantConfigFactory from './ai-assistant-config';
import AiAssistantComponentFactory from './ai-assistant-component';
import {MapStyle} from '@kepler.gl/reducers';

export type AiAssistantManagerState = {
  visStateActions: {
    updateAiAssistantConfig: ActionHandler<typeof updateAiAssistantConfig>;
  };
  mapStyleActions: {
    mapStyleChange: ActionHandler<typeof mapStyleChange>;
  };
  aiAssistant: AiAssistantConfig;
  mapStyle: MapStyle;
  children: React.ReactNode;
};

export type AiAssistantManagerProps = AiAssistantManagerWithIntlProp & AiAssistantManagerState;

export type AiAssistantManagerWithIntlProp = {intl: IntlShape};

const StyledAiAssistantPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  pointer-events: none !important; /* prevent padding from blocking input */
  flex-grow: 1;
  justify-content: space-between;
  overflow: hidden;
  height: 100%;
  & > * {
    /* all children should allow input */
    pointer-events: all;
  }
`;

const StyledAiAssistantPanel = styled.div`
  top: 0;
  background-color: ${props => props.theme.sidePanelBg};
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
`;

const StyledAiAssistantPanelHeader = styled.div`
  padding: ${({theme}) =>
    `${theme.aiAssistantPanelPaddingTop}px ${theme.aiAssistantPanelPaddingSide}px 4px ${theme.aiAssistantPanelPaddingSide}px`};
  border-bottom: 1px solid ${props => props.theme.borderColor};
  min-width: ${({theme}) => theme.aiAssistantPanelConfigWidth}px;
  color: ${props => props.theme.subtextColorActive};
`;

const StyledAiAssistantPanelContent = styled.div`
  ${props => props.theme.sidePanelScrollBar};
  color: ${props => (props.theme.subtextColorActive)};
  padding: 10px 0px 10px 0px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

AiAssistantManagerFactory.deps = [SidePanelTitleFactory, AiAssistantConfigFactory, AiAssistantComponentFactory];

function AiAssistantManagerFactory(
  SidePanelTitle: ReturnType<typeof SidePanelTitleFactory>,
  AiAssistantConfig: ReturnType<typeof AiAssistantConfigFactory>,
  AiAssistantComponent: ReturnType<typeof AiAssistantComponentFactory>
): React.FC<AiAssistantManagerProps> {
  const AiAssistantManager = (props: AiAssistantManagerWithIntlProp & AiAssistantManagerState) => {
    const {intl, visStateActions, aiAssistant, children, mapStyleActions, mapStyle} = props;
    const [showConfig, setShowConfig] = useState(false);

    const onConfigButtonClick = useCallback(() => {
      setShowConfig(true);
    }, []);

    return (
      <StyledAiAssistantPanelContainer className="ai-assistant-manager">
        <StyledAiAssistantPanel>
          <StyledAiAssistantPanelHeader>
            <SidePanelTitle
              className="ai-assistant-manager-title"
              title={intl.formatMessage({id: 'aiAssistantManager.title'})}
            >
              <Settings onClick={onConfigButtonClick} />
            </SidePanelTitle>
          </StyledAiAssistantPanelHeader>

          <StyledAiAssistantPanelContent>
            {showConfig || !aiAssistant.isReady ? (
              <AiAssistantConfig
                aiAssistant={aiAssistant}
                updateAiAssistantConfig={visStateActions.updateAiAssistantConfig}
              />
            ) : (
              <AiAssistantComponent
                aiAssistant={aiAssistant}
                mapStyleChange={mapStyleActions.mapStyleChange}
                mapStyle={mapStyle}
              />
            )}
          </StyledAiAssistantPanelContent>
        </StyledAiAssistantPanel>
        {children}
      </StyledAiAssistantPanelContainer>
    );
  };

  return withState(
    [],
    state => {
      return {
        aiAssistant: state.demo.keplerGl.map.visState.aiAssistant,
        mapStyle: state.demo.keplerGl.map.mapStyle
      };
    },
    {
      visStateActions: {updateAiAssistantConfig},
      mapStyleActions: {mapStyleChange}
    }
  )(injectIntl(AiAssistantManager)) as React.FC<AiAssistantManagerProps>;
}

export default AiAssistantManagerFactory;
