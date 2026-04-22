// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import {useSelector} from 'react-redux';
import {IntlProvider} from 'react-intl';
import {flattenMessages} from '@kepler.gl/utils';
import {messages as keplerGlMessages} from '@kepler.gl/localization';
import {RoomStateProvider} from '@sqlrooms/room-store';
import {TooltipProvider} from '@sqlrooms/ui';

import {SidePanelTitleFactory} from '@kepler.gl/components';

import {AiAssistantComponent} from './ai-assistant-component';
import {messages} from '../localization';

import styled from 'styled-components';

const StyledAiAssistantPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  pointer-events: none !important;
  flex-grow: 1;
  justify-content: space-between;
  overflow: hidden;
  height: 100%;
  width: 100%;
  & > * {
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

export type KeplerReduxState = {
  demo: {
    keplerGl: {
      map: {
        uiState: {locale: string};
      };
    };
  };
};

export type AiAssistantPanelProps = {
  roomStore: any;
};

/**
 * Top-level AI Assistant panel that wraps the chat in kepler.gl's side panel chrome.
 * Accepts a roomStore created by createAiAssistantStore() and provides it via RoomStateProvider.
 */
export function AiAssistantPanel({roomStore}: AiAssistantPanelProps) {
  const locale = useSelector(
    (state: KeplerReduxState) => state.demo?.keplerGl?.map?.uiState?.locale || 'en'
  );

  const combinedMessages = useMemo(() => {
    return Object.keys(messages).reduce(
      (acc, language) => ({
        ...acc,
        [language]: {
          ...(messages[language] || {}),
          ...(keplerGlMessages[language] || {})
        }
      }),
      {} as Record<string, any>
    );
  }, []);

  return (
    <IntlProvider locale={locale} messages={flattenMessages(combinedMessages[locale])}>
      <RoomStateProvider roomStore={roomStore}>
        <TooltipProvider>
          <StyledAiAssistantPanelContainer className="ai-assistant-manager">
            <StyledAiAssistantPanel>
              <StyledAiAssistantPanelHeader>
                <SidePanelTitle className="ai-assistant-manager-title" title="AI Assistant" />
              </StyledAiAssistantPanelHeader>

              <StyledAiAssistantPanelContent>
                <AiAssistantComponent />
              </StyledAiAssistantPanelContent>
            </StyledAiAssistantPanel>
          </StyledAiAssistantPanelContainer>
        </TooltipProvider>
      </RoomStateProvider>
    </IntlProvider>
  );
}
