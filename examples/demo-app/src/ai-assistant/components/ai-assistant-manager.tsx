// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';
import {useSelector, useDispatch} from 'react-redux';
import {IntlProvider} from 'react-intl';
import {flattenMessages} from '@kepler.gl/utils';
import {messages as keplerGlMessages} from '@kepler.gl/localization';

import {MapStyle} from '@kepler.gl/reducers';
import {SidePanelTitleFactory, Icons} from '@kepler.gl/components';
import {VisState} from '@kepler.gl/schemas';

import {AiAssistantState} from '../index';
import {updateAiAssistantConfig} from '../actions';
import {AiAssistantConfig} from './ai-assistant-config';
import {AiAssistantComponent} from './ai-assistant-component';
import {messages} from '../localization';

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
        uiState: {locale: string};
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
  const locale = useSelector((state: State) => state.demo.keplerGl.map.uiState.locale);

  const onConfigButtonClick = useCallback(() => {
    if (aiAssistant) {
      // set aiAssistant.config.isReady to false so we can render the config component
      dispatch(updateAiAssistantConfig({...aiAssistant.config, isReady: false}));
    }
  }, [aiAssistant, dispatch]);

  // combine keplerGlMessages and messages
  const combinedMessages = useMemo(() => {
    return Object.keys(messages).reduce(
      (acc, language) => ({
        ...acc,
        [language]: {
          ...(messages[language] || {}),
          ...(keplerGlMessages[language] || {})
        }
      }),
      {}
    );
  }, []);

  return (
    <IntlProvider locale={locale} messages={flattenMessages(combinedMessages[locale])}>
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
    </IntlProvider>
  );
}
