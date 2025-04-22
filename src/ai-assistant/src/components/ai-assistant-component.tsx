// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect, useState} from 'react';
import styled, {withTheme} from 'styled-components';
import {MessageModel, useAssistant} from '@openassistant/core';
import {AiAssistant} from '@openassistant/ui';
import '@openassistant/echarts/dist/index.css';
import '@openassistant/ui/dist/index.css';

import {textColorLT} from '@kepler.gl/styles';
import {ActionHandler} from '@kepler.gl/actions';
import {MapStyle} from '@kepler.gl/reducers';
import {VisState} from '@kepler.gl/schemas';

import {AiAssistantState} from '../reducers';
import {setScreenCaptured, setStartScreenCapture, updateAiAssistantMessages} from '../actions';
import {
  ASSISTANT_DESCRIPTION,
  ASSISTANT_NAME,
  ASSISTANT_VERSION,
  INSTRUCTIONS,
  PROMPT_IDEAS,
  WELCOME_MESSAGE
} from '../constants';
import {SelectedKeplerGlActions} from './ai-assistant-manager';
import {getDatasetContext} from '../tools/utils';
import {setupLLMFunctions} from '../tools/tools';

type ThemeProps = {theme: any};

export type AiAssistantComponentProps = {
  aiAssistant: AiAssistantState;
  updateAiAssistantMessages: ActionHandler<typeof updateAiAssistantMessages>;
  setStartScreenCapture: ActionHandler<typeof setStartScreenCapture>;
  setScreenCaptured: ActionHandler<typeof setScreenCaptured>;
  keplerGlActions: SelectedKeplerGlActions;
  mapStyle: MapStyle;
  visState: VisState;
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
  const AiAssistantComponent: React.FC<AiAssistantComponentProps & ThemeProps> = ({
    theme,
    aiAssistant,
    updateAiAssistantMessages,
    setStartScreenCapture,
    setScreenCaptured,
    keplerGlActions,
    mapStyle,
    visState
  }: AiAssistantComponentProps & ThemeProps) => {
    // define LLM functions
    const functions = setupLLMFunctions({
      visState,
      keplerGlActions,
      mapStyle
    });

    // enable voice and screen capture
    const enableVoiceAndScreenCapture =
      aiAssistant.config.provider === 'openai' || aiAssistant.config.provider === 'google';

    // define assistant props
    const assistantProps = {
      name: ASSISTANT_NAME,
      description: ASSISTANT_DESCRIPTION,
      version: ASSISTANT_VERSION,
      modelProvider: aiAssistant.config.provider,
      model: aiAssistant.config.model,
      apiKey: aiAssistant.config.apiKey,
      baseUrl: aiAssistant.config.baseUrl,
      functions
    };

    const [datasetMetaData, setDatasetMetaData] = useState<string>('');

    // get dataset meta data
    useEffect(() => {
      const metaData = getDatasetContext(visState.datasets, visState.layers);
      setDatasetMetaData(metaData);
      // re-initialize assistant when datasets, filters or layers change
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visState.datasets, visState.filters, visState.layers]);

    // use dataset meta data in LLM instructions
    const instructions = `${INSTRUCTIONS}\n\n${datasetMetaData}`;

    const {initializeAssistant} = useAssistant({
      ...assistantProps,
      instructions
    });

    useEffect(() => {
      initializeAssistant();
    }, [initializeAssistant]);

    const onRestartAssistant = () => {
      // clean up aiAssistant state
      updateAiAssistantMessages([]);
    };

    const onMessagesUpdated = (messages: MessageModel[]) => {
      updateAiAssistantMessages(messages);
    };

    const onScreenshotClick = () => {
      setStartScreenCapture(true);
    };

    const onRemoveScreenshot = () => {
      setScreenCaptured('');
    };

    return (
      <StyledAiAssistantComponent className="ai-assistant-component">
        <AiAssistant
          {...assistantProps}
          instructions={instructions}
          theme={theme.textColor === textColorLT ? 'light' : 'dark'}
          welcomeMessage={WELCOME_MESSAGE}
          temperature={aiAssistant.config.temperature}
          topP={aiAssistant.config.topP}
          initialMessages={aiAssistant.messages}
          onMessagesUpdated={onMessagesUpdated}
          enableVoice={enableVoiceAndScreenCapture}
          enableScreenCapture={enableVoiceAndScreenCapture}
          onScreenshotClick={onScreenshotClick}
          screenCapturedBase64={aiAssistant.screenshotToAsk.screenCaptured}
          onRemoveScreenshot={onRemoveScreenshot}
          onRestartChat={onRestartAssistant}
          fontSize={'text-tiny'}
          botMessageClassName={''}
          githubIssueLink={'https://github.com/keplergl/kepler.gl/issues'}
          ideas={PROMPT_IDEAS}
        />
      </StyledAiAssistantComponent>
    );
  };

  return withTheme(AiAssistantComponent) as React.FC<AiAssistantComponentProps>;
}

export default AiAssistantComponentFactory;
