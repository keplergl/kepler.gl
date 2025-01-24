// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect} from 'react';
import styled, {withTheme} from 'styled-components';
import {MessageModel, useAssistant} from '@openassistant/core';
import {
  dataClassifyFunctionDefinition,
  spatialCountFunctionDefinition,
  SpatialJoinGeometries
} from '@openassistant/geoda';
import {histogramFunctionDefinition, scatterplotFunctionDefinition} from '@openassistant/echarts';
import {AiAssistant} from '@openassistant/ui';
import '@openassistant/echarts/dist/index.css';
import '@openassistant/ui/dist/index.css';

import {textColorLT} from '@kepler.gl/styles';
import {ActionHandler} from '@kepler.gl/actions';
import {MapStyle} from '@kepler.gl/reducers';
import {VisState} from '@kepler.gl/schemas';

import {basemapFunctionDefinition} from '../tools/basemap-functions';
import {loadUrlFunctionDefinition} from '../tools/loadurl-function';

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
import {addLayerFunctionDefinition} from '../tools/layer-creation-function';
import {updateLayerColorFunctionDefinition} from '../tools/layer-style-function';
import {SelectedKeplerGlActions} from './ai-assistant-manager';
import {
  getDatasetContext,
  getGeometriesFromDataset,
  getScatterplotValuesFromDataset,
  getValuesFromDataset,
  highlightRows,
  saveAsDataset
} from '../tools/utils';

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
    // get values from dataset, used by LLM functions
    const getValuesCallback = (datasetName: string, variableName: string): number[] =>
      getValuesFromDataset(visState.datasets, datasetName, variableName);

    // highlight rows, used by LLM functions and plots (scatterplot, histogram)
    const highlightRowsCallback = (datasetName: string, selectedRowIndices: number[]) =>
      highlightRows(
        visState.datasets,
        visState.layers,
        datasetName,
        selectedRowIndices,
        keplerGlActions.layerSetIsValid
      );

    // define LLM functions
    const functions = [
      basemapFunctionDefinition({mapStyleChange: keplerGlActions.mapStyleChange, mapStyle}),
      loadUrlFunctionDefinition({
        addDataToMap: keplerGlActions.addDataToMap,
        loaders: visState.loaders,
        loadOptions: visState.loadOptions
      }),
      addLayerFunctionDefinition({
        addLayer: keplerGlActions.addLayer,
        datasets: visState.datasets
      }),
      updateLayerColorFunctionDefinition({
        layerVisualChannelConfigChange: keplerGlActions.layerVisualChannelConfigChange,
        layers: visState.layers
      }),
      histogramFunctionDefinition({
        getValues: getValuesCallback,
        onSelected: highlightRowsCallback
      }),
      scatterplotFunctionDefinition({
        getValues: async (datasetName: string, xVar: string, yVar: string) =>
          getScatterplotValuesFromDataset(visState.datasets, datasetName, xVar, yVar),
        onSelected: highlightRowsCallback
      }),
      dataClassifyFunctionDefinition({
        getValues: getValuesCallback
      }),
      spatialCountFunctionDefinition({
        getValues: getValuesCallback,
        getGeometries: (datasetName: string): SpatialJoinGeometries =>
          getGeometriesFromDataset(
            visState.datasets,
            visState.layers,
            visState.layerData,
            datasetName
          ),
        saveAsDataset: (datasetName: string, data: Record<string, number[]>) =>
          saveAsDataset(visState.datasets, datasetName, data, keplerGlActions.addDataToMap)
      })
    ];

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
      instructions: INSTRUCTIONS,
      functions
    };

    const {initializeAssistant, addAdditionalContext} = useAssistant(assistantProps);

    // initialize assistant with context
    const initializeAssistantWithContext = async () => {
      await initializeAssistant();
      const context = getDatasetContext(visState.datasets, visState.layers);
      addAdditionalContext({context});
    };

    // initialize assistant with context
    useEffect(() => {
      initializeAssistantWithContext();
      // re-initialize assistant when datasets, filters or layers change
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visState.datasets, visState.filters, visState.layers]);

    const onRestartAssistant = () => {
      // clean up aiAssistant state
      updateAiAssistantMessages([]);
      initializeAssistantWithContext();
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
