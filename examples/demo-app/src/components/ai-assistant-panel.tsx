import React from 'react';
import {useSelector} from 'react-redux';
import {IntlProvider} from 'react-intl';
import {flattenMessages} from '@kepler.gl/utils';
import {messages} from '@kepler.gl/localization';
import {RoomStateProvider} from '@sqlrooms/room-store';
import {TooltipProvider} from '@sqlrooms/ui';

import {SidePanelTitleFactory} from '@kepler.gl/components';

import {AiAssistantComponent, BrushLinkProvider} from 'openassistant';
import type {BrushLinkCallback} from 'openassistant';

import styled, {createGlobalStyle} from 'styled-components';

/**
 * Apply dark theme CSS variables to Radix portaled elements (dropdowns, tooltips, dialogs)
 * which render outside #root directly into body. This avoids adding `dark` class to body/html
 * which would trigger Tailwind preflight body styles and break kepler's layout.
 */
const PortalDarkMode = createGlobalStyle`
  body > [data-radix-popper-content-wrapper] {
    color-scheme: dark;
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
  }
`;

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

// const StyledAiAssistantPanelHeader = styled.div`
//   padding: 16px 16px 4px 16px;
//   border-bottom: 1px solid ${props => props.theme.borderColor};
//   color: ${props => props.theme.subtextColorActive};
// `;

const StyledAiAssistantPanelContent = styled.div`
  ${props => props.theme.sidePanelScrollBar};
  color: ${props => props.theme.subtextColorActive};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

// const SidePanelTitle = SidePanelTitleFactory();

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
  onSelected?: BrushLinkCallback;
};

export function AiAssistantPanel({roomStore, onSelected}: AiAssistantPanelProps) {
  const locale = useSelector(
    (state: KeplerReduxState) => state.demo?.keplerGl?.map?.uiState?.locale || 'en'
  );

  return (
    <IntlProvider locale={locale} messages={flattenMessages(messages[locale])}>
      <RoomStateProvider roomStore={roomStore}>
        <TooltipProvider>
          <BrushLinkProvider value={onSelected}>
            <PortalDarkMode />
            <StyledAiAssistantPanelContainer className="ai-assistant-manager">
              <StyledAiAssistantPanel>
                {/* <StyledAiAssistantPanelHeader>
                  <SidePanelTitle className="ai-assistant-manager-title" title="AI Assistant" />
                </StyledAiAssistantPanelHeader> */}

                <StyledAiAssistantPanelContent>
                  <AiAssistantComponent />
                </StyledAiAssistantPanelContent>
              </StyledAiAssistantPanel>
            </StyledAiAssistantPanelContainer>
          </BrushLinkProvider>
        </TooltipProvider>
      </RoomStateProvider>
    </IntlProvider>
  );
}
