// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect} from 'react';
import styled, {withTheme} from 'styled-components';
import {
  AiAssistant,
  MessageModel,
  useAssistant,
  histogramFunctionDefinition
} from 'react-ai-assist';
import 'react-ai-assist/dist/index.css';

import {textColorLT} from '@kepler.gl/styles';
import {ActionHandler} from '@kepler.gl/actions';
import {MapStyle} from '@kepler.gl/reducers';
import {VisState} from '@kepler.gl/schemas';

import {basemapFunctionDefinition} from '../tools/basemap-functions';
import {loadUrlFunctionDefinition} from '../tools/loadurl-function';

import {AiAssistantState} from '../reducers';
import {
  addDatasetContext,
  setScreenCaptured,
  setStartScreenCapture,
  updateAiAssistantMessages
} from '../actions';
import {
  ASSISTANT_DESCRIPTION,
  ASSISTANT_NAME,
  ASSISTANT_VERSION,
  INSTRUCTIONS,
  WELCOME_MESSAGE
} from '../constants';
import {filterFunctionDefinition} from '../tools/filter-function';
import {addLayerFunctionDefinition} from '../tools/layer-creation-function';
import {updateLayerColorFunctionDefinition} from '../tools/layer-style-function';
import {SelectedKeplerGlActions} from './ai-assistant-manager';
import {getValuesFromDataset, highlightRows} from '../tools/utils';

export type AiAssistantComponentProps = {
  theme: any;
  aiAssistant: AiAssistantState;
  updateAiAssistantMessages: ActionHandler<typeof updateAiAssistantMessages>;
  setStartScreenCapture: ActionHandler<typeof setStartScreenCapture>;
  setScreenCaptured: ActionHandler<typeof setScreenCaptured>;
  addDatasetContext: ActionHandler<typeof addDatasetContext>;
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
  const AiAssistantComponent: React.FC<AiAssistantComponentProps> = ({
    theme,
    aiAssistant,
    updateAiAssistantMessages,
    setStartScreenCapture,
    setScreenCaptured,
    addDatasetContext,
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
      }),
      addLayerFunctionDefinition({
        addLayer: keplerGlActions.addLayer,
        datasets: visState.datasets
      }),
      updateLayerColorFunctionDefinition({
        layerVisualChannelConfigChange: keplerGlActions.layerVisualChannelConfigChange,
        layers: visState.layers
      }),
      filterFunctionDefinition({
        datasets: visState.datasets,
        filters: visState.filters,
        createOrUpdateFilter: keplerGlActions.createOrUpdateFilter,
        setFilter: keplerGlActions.setFilter,
        setFilterPlot: keplerGlActions.setFilterPlot
      }),
      histogramFunctionDefinition({
        getValues: (datasetName: string, variableName: string): number[] =>
          getValuesFromDataset(visState.datasets, datasetName, variableName),
        onSelected: (datasetName: string, selectedRowIndices: number[]) =>
          highlightRows(
            visState.datasets,
            visState.layers,
            datasetName,
            selectedRowIndices,
            keplerGlActions.layerSetIsValid
          )
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
      // re-initialize assistant when datasets, filters or layers change
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visState.datasets, visState.filters, visState.layers]);

    // show ideas for adding dataset context to the conversation
    const datasetContextIdeas = Object.values(visState.datasets)
      .filter(dataset => !aiAssistant.datasetContext.includes(dataset.id))
      .map(dataset => ({
        title: `Click to Add Dataset Context `,
        description: `The metadata of "${dataset.label}"`,
        icon: 'svg-spinners:pulse',
        context: `Please remember the following dataset context:\ndatasetName: ${
          dataset.label
        }\ndatasetId: ${dataset.id}\n${dataset.fields
          .map(field => `${field.name}: ${field.type}`)
          .join('\n')}\nPlease don't respond to this message.`,
        callback: () => {
          // add the dataset to the context
          addDatasetContext(dataset.id);
        }
      }));

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
          ideas={datasetContextIdeas}
        />
      </StyledAiAssistantComponent>
    );
  };

  return withTheme(AiAssistantComponent);
}

export default AiAssistantComponentFactory;
