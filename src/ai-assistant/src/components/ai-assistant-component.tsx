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
import {
  ActionHandler,
  addDataToMap,
  addLayer,
  createOrUpdateFilter,
  setFilter,
  mapStyleChange,
  setFilterPlot,
  loadFiles,
  layerSetIsValid
} from '@kepler.gl/actions';
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
  WELCOME_MESSAGE
} from '../constants';
import {addGeojsonLayerFunctionDefinition} from '../tools/geojson-layer-function';
import {filterFunctionDefinition} from '../tools/filter-function';

export type SelectedKeplerGlActions = {
  mapStyleChange: ActionHandler<typeof mapStyleChange>;
  loadFiles: ActionHandler<typeof loadFiles>;
  addDataToMap: ActionHandler<typeof addDataToMap>;
  addLayer: ActionHandler<typeof addLayer>;
  createOrUpdateFilter: ActionHandler<typeof createOrUpdateFilter>;
  setFilter: ActionHandler<typeof setFilter>;
  setFilterPlot: ActionHandler<typeof setFilterPlot>;
  layerSetIsValid: ActionHandler<typeof layerSetIsValid>;
};

export type AiAssistantComponentProps = {
  theme: any;
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
      }),
      addGeojsonLayerFunctionDefinition({
        addLayer: keplerGlActions.addLayer,
        datasets: visState.datasets
      }),
      filterFunctionDefinition({
        datasets: visState.datasets,
        filters: visState.filters,
        createOrUpdateFilter: keplerGlActions.createOrUpdateFilter,
        setFilter: keplerGlActions.setFilter,
        setFilterPlot: keplerGlActions.setFilterPlot
      }),
      histogramFunctionDefinition({
        getValues: (datasetName: string, variableName: string): number[] => {
          // find which dataset has the variableName
          const datasetId = Object.keys(visState.datasets).find(
            dataId => visState.datasets[dataId].label === datasetName
          );
          if (!datasetId) return [];
          const dataset = visState.datasets[datasetId];
          if (dataset) {
            return Array.from({length: dataset.length}, (_, i) =>
              dataset.getValue(variableName, i)
            );
          }
          return [];
        },
        onSelected: (datasetName: string, selectedRowIndices: number[]) => {
          // update the filteredIndex in the dataset
          const datasetId = Object.keys(visState.datasets).find(
            dataId => visState.datasets[dataId].label === datasetName
          );
          if (!datasetId) return;
          const dataset = visState.datasets[datasetId];
          if (dataset) {
            dataset.filteredIndex =
              selectedRowIndices.length === 0 ? dataset.allIndexes : selectedRowIndices;
            // get all layers that use this dataset
            const layers = visState.layers.filter(layer => layer.config.dataId === dataset.id);
            layers.forEach(layer => {
              layer.formatLayerData(visState.datasets);
            });
            // trigger a re-render using layerSetIsValid()
            keplerGlActions.layerSetIsValid(layers[0], true);
          }
        }
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
      // re-initialize assistant when datasets change
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visState.datasets, visState.filters]);

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
