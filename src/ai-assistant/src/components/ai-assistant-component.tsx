// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect} from 'react';
import styled, {withTheme} from 'styled-components';
import {AiAssistant, MessageModel, useAssistant} from 'react-ai-assist';
import 'react-ai-assist/dist/index.css';

import {textColorLT} from '@kepler.gl/styles';
import {ActionHandler, mapStyleChange} from '@kepler.gl/actions';
import {MapStyle} from '@kepler.gl/reducers';

import {basemapFunctionDefinition} from '../tools/basemap-functions';
import {AiAssistantState} from '../reducers';
import {updateAiAssistantMessages} from '../actions';

export type AiAssistantComponentProps = {
  theme: any;
  aiAssistant: AiAssistantState;
  updateAiAssistantMessages: ActionHandler<typeof updateAiAssistantMessages>;
  mapStyleChange: ActionHandler<typeof mapStyleChange>;
  mapStyle: MapStyle;
};

const StyledAiAssistantComponent = styled.div`
  height: 100%;
  padding-bottom: 4px;

  * {
    font-size: 11px;
  }
`;

AiAssistantComponentFactory.deps = [];

function AiAssistantComponentFactory() {
  const AiAssistantComponent: React.FC<AiAssistantComponentProps> = ({
    theme,
    aiAssistant,
    updateAiAssistantMessages,
    mapStyleChange,
    mapStyle
  }: AiAssistantComponentProps) => {
    const welcomeMessage = 'Welcome to the Kepler.gl AI Assistant!';
    const instructions =
      'You are a helpful assistant that can answer questions and help with tasks. If you can use tools, please use them. If the parameters of functions are not provided, please ask user to specify them. Otherwise, just answer the question directly. Do not include any programming code in your response. You can do the following tasks: 1. Change the basemap style.';

    const functions = [basemapFunctionDefinition({mapStyleChange, mapStyle})];

    const {initializeAssistant} = useAssistant({
      modelProvider: aiAssistant.config.provider,
      model: aiAssistant.config.model,
      apiKey: aiAssistant.config.apiKey,
      instructions,
      functions
    });

    useEffect(() => {
      initializeAssistant();
    }, [initializeAssistant]);

    const onMessagesUpdated = (messages: MessageModel[]) => {
      updateAiAssistantMessages(messages);
    };

    return (
      <StyledAiAssistantComponent className="ai-assistant-component">
        <AiAssistant
          theme={theme.textColor === textColorLT ? 'light' : 'dark'}
          welcomeMessage={welcomeMessage}
          modelProvider={aiAssistant.config.provider}
          model={aiAssistant.config.model}
          apiKey={aiAssistant.config.apiKey}
          instructions={instructions}
          temperature={aiAssistant.config.temperature}
          topP={aiAssistant.config.topP}
          historyMessages={aiAssistant.messages}
          onMessagesUpdated={onMessagesUpdated}
          functions={functions}
          enableVoice={
            aiAssistant.config.provider === 'openai' || aiAssistant.config.provider === 'google'
          }
          enableScreenCapture={false}
          fontSize={'text-tiny'}
          botMessageClassName={''}
          githubIssueLink={'https://github.com/keplergl/kepler.gl/issues'}
        />
      </StyledAiAssistantComponent>
    );
  };

  return withTheme(AiAssistantComponent);
}

export default AiAssistantComponentFactory;
