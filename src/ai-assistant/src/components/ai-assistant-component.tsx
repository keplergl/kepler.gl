// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect} from 'react';
import styled, {withTheme} from 'styled-components';
import {AiAssistant, MessageModel, useAssistant} from 'react-ai-assist';
import 'react-ai-assist/dist/index.css';

import {textColorLT} from '@kepler.gl/styles';
import {ActionHandler, addDataToMap, loadFiles, mapStyleChange} from '@kepler.gl/actions';
import {MapStyle} from '@kepler.gl/reducers';
import {Loader} from '@loaders.gl/loader-utils';

import {basemapFunctionDefinition} from '../tools/basemap-functions';
import {loadUrlFunctionDefinition} from '../tools/loadurl-function';

import {AiAssistantState} from '../reducers';
import {setScreenCaptured, setStartScreenCapture, updateAiAssistantMessages} from '../actions';
import {
  ASSISTANT_DESCRIPTION,
  ASSISTANT_NAME,
  ASSISTANT_VERSION,
  INSTRUCTIONS,
  WELCOME_MESSAGE
} from '../constants';

export type AiAssistantComponentProps = {
  theme: any;
  aiAssistant: AiAssistantState;
  updateAiAssistantMessages: ActionHandler<typeof updateAiAssistantMessages>;
  setStartScreenCapture: ActionHandler<typeof setStartScreenCapture>;
  setScreenCaptured: ActionHandler<typeof setScreenCaptured>;
  keplerGlActions: {
    mapStyleChange: ActionHandler<typeof mapStyleChange>;
    loadFiles: ActionHandler<typeof loadFiles>;
    addDataToMap: ActionHandler<typeof addDataToMap>;
  };
  mapStyle: MapStyle;
  visState: {
    loaders: Loader[];
    loadOptions: object;
  };
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
    setStartScreenCapture,
    setScreenCaptured,
    keplerGlActions,
    mapStyle,
    visState
  }: AiAssistantComponentProps) => {
    const functions = [
      basemapFunctionDefinition({mapStyleChange: keplerGlActions.mapStyleChange, mapStyle}),
      loadUrlFunctionDefinition({
        addDataToMap: keplerGlActions.addDataToMap,
        loaders: visState.loaders,
        loadOptions: visState.loadOptions
      })
    ];

    const enableVoiceAndScreenCapture =
      aiAssistant.config.provider === 'openai' || aiAssistant.config.provider === 'google';

    const assistantProps = {
      name: ASSISTANT_NAME,
      description: ASSISTANT_DESCRIPTION,
      version: ASSISTANT_VERSION,
      modelProvider: aiAssistant.config.provider,
      model: aiAssistant.config.model,
      apiKey: aiAssistant.config.apiKey,
      instructions: INSTRUCTIONS,
      functions
    };

    const {initializeAssistant} = useAssistant(assistantProps);

    useEffect(() => {
      initializeAssistant();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
          theme={theme.textColor === textColorLT ? 'light' : 'dark'}
          welcomeMessage={WELCOME_MESSAGE}
          temperature={aiAssistant.config.temperature}
          topP={aiAssistant.config.topP}
          historyMessages={aiAssistant.messages}
          onMessagesUpdated={onMessagesUpdated}
          enableVoice={enableVoiceAndScreenCapture}
          enableScreenCapture={enableVoiceAndScreenCapture}
          onScreenshotClick={onScreenshotClick}
          screenCapturedBase64={aiAssistant.screenshotToAsk.screenCaptured}
          onRemoveScreenshot={onRemoveScreenshot}
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
