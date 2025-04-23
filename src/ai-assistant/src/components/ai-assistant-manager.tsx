// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import styled from 'styled-components';
import {useSelector, useDispatch} from 'react-redux';

import {MapStyle} from '@kepler.gl/reducers';
import {SidePanelTitleFactory, Icons} from '@kepler.gl/components';
import {VisState} from '@kepler.gl/schemas';

import {AiAssistantState} from '../index';
import {updateAiAssistantConfig} from '../actions';
import {AiAssistantConfig} from './ai-assistant-config';
import {AiAssistantComponent} from './ai-assistant-component';

const StyledAiAssistantPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  pointer-events: none !important; /* prevent padding from blocking input */
  flex-grow: 1;
  justify-content: space-between;
  overflow: hidden;
  height: 100%;
  width: 100%;
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
  padding: 16px 16px 4px 16px;
  border-bottom: 1px solid ${props => props.theme.borderColor};
  color: ${props => props.theme.subtextColorActive};
`;

const StyledAiAssistantPanelContent = styled.div`
  ${props => props.theme.sidePanelScrollBar};
  color: ${props => props.theme.subtextColorActive};
  padding: 10px 0px 10px 0px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const SidePanelTitle = SidePanelTitleFactory();

export type State = {
  demo: {
    keplerGl: {
      map: {
        visState: VisState;
        mapStyle: MapStyle;
      };
    };
    aiAssistant: AiAssistantState;
  };
};

export function AiAssistantPanel() {
  const dispatch = useDispatch();
  const aiAssistant = useSelector((state: State) => state.demo.aiAssistant);

  const onConfigButtonClick = useCallback(() => {
    if (aiAssistant) {
      // set aiAssistant.config.isReady to false so we can render the config component
      dispatch(updateAiAssistantConfig({...aiAssistant.config, isReady: false}));
    }
  }, [aiAssistant, dispatch]);

  return (
    <StyledAiAssistantPanelContainer className="ai-assistant-manager">
      <StyledAiAssistantPanel>
        <StyledAiAssistantPanelHeader>
          <SidePanelTitle className="ai-assistant-manager-title" title="AI Assistant">
            <Icons.Settings onClick={onConfigButtonClick} />
          </SidePanelTitle>
        </StyledAiAssistantPanelHeader>

        <StyledAiAssistantPanelContent>
          {!aiAssistant?.config.isReady ? <AiAssistantConfig /> : <AiAssistantComponent />}
        </StyledAiAssistantPanelContent>
      </StyledAiAssistantPanel>
    </StyledAiAssistantPanelContainer>
  );
}
