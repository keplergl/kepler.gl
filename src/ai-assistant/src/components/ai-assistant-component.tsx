// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {textColorLT, theme} from '@kepler.gl/styles';
import {MessageModel, useAssistant} from '@openassistant/core';
import {AiAssistant} from '@openassistant/ui';
import '@openassistant/echarts/dist/index.css';
import '@openassistant/ui/dist/index.css';
import {setScreenCaptured, setStartScreenCapture, updateAiAssistantMessages} from '../actions';
import {
  ASSISTANT_DESCRIPTION,
  ASSISTANT_NAME,
  ASSISTANT_VERSION,
  INSTRUCTIONS,
  PROMPT_IDEAS,
  WELCOME_MESSAGE
} from '../constants';
import {getDatasetContext} from '../tools/utils';
import {setupLLMTools} from '../tools/tools';
import {State} from './ai-assistant-manager';

const StyledAiAssistantComponent = styled.div`
  height: 100%;
  padding-bottom: 4px;

  * {
    font-size: 11px;
  }
`;

export function AiAssistantComponent() {
  const visState = useSelector((state: State) => state.demo.keplerGl.map.visState);
  const aiAssistant = useSelector((state: State) => state.demo.aiAssistant);
  const dispatch = useDispatch();

  // define LLM functions
  const tools = setupLLMTools({visState, aiAssistant, dispatch});

  // enable voice and screen capture
  const enableVoiceAndScreenCapture =
    aiAssistant?.config.provider === 'openai' || aiAssistant?.config.provider === 'google' || false;

  // define assistant props
  const assistantProps = {
    name: ASSISTANT_NAME,
    description: ASSISTANT_DESCRIPTION,
    version: ASSISTANT_VERSION,
    modelProvider: aiAssistant?.config.provider || '',
    model: aiAssistant?.config.model || '',
    apiKey: aiAssistant?.config.apiKey || '',
    baseUrl: aiAssistant?.config.baseUrl || '',
    tools
  };

  const [datasetMetaData, setDatasetMetaData] = useState<string>('');

  const [ideas, setIdeas] = useState<{title: string; description: string}[]>([]);

  // get dataset meta data and re-initialize assistant when datasets or layers change
  useEffect(() => {
    const metaData = getDatasetContext(visState?.datasets, visState?.layers || []);
    setDatasetMetaData(metaData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visState?.datasets, visState?.layers]);

  // use dataset meta data in LLM instructions
  const instructions = `${INSTRUCTIONS}\n\n${datasetMetaData}`;

  // generate ideas from LLM
  const {temporaryPrompt} = useAssistant({...assistantProps, instructions});

  const generateIdeas = async () => {
    try {
      const response = await temporaryPrompt({
        prompt: PROMPT_IDEAS,
        temperature: 1.0
      });
      // find [{},{}...] in the text and parse it as json, handling whitespace
      const match = response?.match(/\[\s*\{.*\}\s*\]/s);
      if (match) {
        const json = JSON.parse(match[0]);
        setIdeas(json);
      }
    } catch (error) {
      console.error('Error generating ideas', error);
    }
  };

  useEffect(() => {
    // get ideas UI component
    if (ideas.length === 0 && datasetMetaData.length > 0) {
      generateIdeas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasetMetaData]);

  const onRestartAssistant = () => {
    // clean up aiAssistant state
    dispatch(updateAiAssistantMessages([]));
  };

  const onMessagesUpdated = (messages: MessageModel[]) => {
    dispatch(updateAiAssistantMessages(messages));
  };

  const onScreenshotClick = () => {
    dispatch(setStartScreenCapture(true));
  };

  const onRemoveScreenshot = () => {
    dispatch(setScreenCaptured(''));
  };

  return (
    <StyledAiAssistantComponent className="ai-assistant-component">
      <AiAssistant
        {...assistantProps}
        instructions={instructions}
        theme={theme.textColor === textColorLT ? 'light' : 'dark'}
        welcomeMessage={WELCOME_MESSAGE}
        temperature={aiAssistant?.config.temperature || 0}
        topP={aiAssistant?.config.topP || 0}
        initialMessages={aiAssistant?.messages}
        onMessagesUpdated={onMessagesUpdated}
        enableVoice={enableVoiceAndScreenCapture}
        enableScreenCapture={enableVoiceAndScreenCapture}
        onScreenshotClick={onScreenshotClick}
        screenCapturedBase64={aiAssistant?.screenshotToAsk.screenCaptured || ''}
        onRemoveScreenshot={onRemoveScreenshot}
        onRestartChat={onRestartAssistant}
        fontSize={'text-tiny'}
        botMessageClassName={''}
        githubIssueLink={'https://github.com/keplergl/kepler.gl/issues'}
        ideas={ideas}
        onRefreshIdeas={generateIdeas}
      />
    </StyledAiAssistantComponent>
  );
}
