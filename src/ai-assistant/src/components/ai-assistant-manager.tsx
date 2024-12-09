// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import styled from 'styled-components';
import {injectIntl, IntlShape} from 'react-intl';

import {MapStyle, mapStyleLens, visStateLens} from '@kepler.gl/reducers';
import {
  ActionHandler,
  mapStyleChange,
  loadFiles,
  addDataToMap,
  addLayer,
  createOrUpdateFilter,
  setFilter,
  setFilterPlot,
  layerSetIsValid,
  layerVisualChannelConfigChange
} from '@kepler.gl/actions';
import {withState, SidePanelTitleFactory, Icons} from '@kepler.gl/components';
import {VisState} from '@kepler.gl/schemas';

import {AiAssistantState} from '../index';
import {
  updateAiAssistantConfig,
  updateAiAssistantMessages,
  setStartScreenCapture,
  setScreenCaptured
} from '../actions';
import AiAssistantConfigFactory from './ai-assistant-config';
import AiAssistantComponentFactory from './ai-assistant-component';

export type SelectedKeplerGlActions = {
  mapStyleChange: ActionHandler<typeof mapStyleChange>;
  loadFiles: ActionHandler<typeof loadFiles>;
  addDataToMap: ActionHandler<typeof addDataToMap>;
  addLayer: ActionHandler<typeof addLayer>;
  layerVisualChannelConfigChange: ActionHandler<typeof layerVisualChannelConfigChange>;
  createOrUpdateFilter: ActionHandler<typeof createOrUpdateFilter>;
  setFilter: ActionHandler<typeof setFilter>;
  setFilterPlot: ActionHandler<typeof setFilterPlot>;
  layerSetIsValid: ActionHandler<typeof layerSetIsValid>;
};

export type AiAssistantManagerState = {
  aiAssistantActions: {
    updateAiAssistantConfig: ActionHandler<typeof updateAiAssistantConfig>;
    updateAiAssistantMessages: ActionHandler<typeof updateAiAssistantMessages>;
    setStartScreenCapture: ActionHandler<typeof setStartScreenCapture>;
    setScreenCaptured: ActionHandler<typeof setScreenCaptured>;
  };
  keplerGlActions: SelectedKeplerGlActions;
  aiAssistant: AiAssistantState;
  mapStyle: MapStyle;
  visState: VisState;
  children: React.ReactNode;
};

export type AiAssistantManagerProps = AiAssistantManagerWithIntlProp & AiAssistantManagerState;

export type AiAssistantManagerWithIntlProp = {intl: IntlShape};

const StyledAiAssistantPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  pointer-events: none !important; /* prevent padding from blocking input */
  flex-grow: 1;
  justify-content: space-between;
  overflow: hidden;
  height: 100%;
  min-width: ${props => props.theme.aiAssistantPanelWidth}px;
  max-width: ${props => props.theme.aiAssistantPanelWidth}px;
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

AiAssistantManagerFactory.deps = [
  SidePanelTitleFactory,
  AiAssistantConfigFactory,
  AiAssistantComponentFactory
];

function AiAssistantManagerFactory(
  SidePanelTitle: ReturnType<typeof SidePanelTitleFactory>,
  AiAssistantConfig: ReturnType<typeof AiAssistantConfigFactory>,
  AiAssistantComponent: ReturnType<typeof AiAssistantComponentFactory>
): React.FC<AiAssistantManagerProps> {
  const AiAssistantManager = (props: AiAssistantManagerWithIntlProp & AiAssistantManagerState) => {
    const {intl, aiAssistantActions, aiAssistant, children, keplerGlActions, mapStyle, visState} =
      props;

    const onConfigButtonClick = useCallback(() => {
      // set aiAssistant.config.isReady to false so we can render the config component
      aiAssistantActions.updateAiAssistantConfig({...aiAssistant.config, isReady: false});
    }, [aiAssistant.config, aiAssistantActions]);

    return (
      <StyledAiAssistantPanelContainer className="ai-assistant-manager">
        <StyledAiAssistantPanel>
          <StyledAiAssistantPanelHeader>
            <SidePanelTitle
              className="ai-assistant-manager-title"
              title={intl.formatMessage({
                id: 'aiAssistantManager.title',
                defaultMessage: 'AI Assistant'
              })}
            >
              <Icons.Settings onClick={onConfigButtonClick} />
            </SidePanelTitle>
          </StyledAiAssistantPanelHeader>

          <StyledAiAssistantPanelContent>
            {!aiAssistant.config.isReady ? (
              <AiAssistantConfig
                aiAssistantConfig={aiAssistant.config}
                updateAiAssistantConfig={aiAssistantActions.updateAiAssistantConfig}
              />
            ) : (
              <AiAssistantComponent
                aiAssistant={aiAssistant}
                updateAiAssistantMessages={aiAssistantActions.updateAiAssistantMessages}
                setStartScreenCapture={aiAssistantActions.setStartScreenCapture}
                setScreenCaptured={aiAssistantActions.setScreenCaptured}
                keplerGlActions={keplerGlActions}
                mapStyle={mapStyle}
                visState={visState}
              />
            )}
          </StyledAiAssistantPanelContent>
        </StyledAiAssistantPanel>
        {children}
      </StyledAiAssistantPanelContainer>
    );
  };

  return withState(
    [visStateLens, mapStyleLens],
    state => {
      // todo: find a better way to get the state key
      const stateKey = Object.keys(state)[0];
      return {
        aiAssistant: state[stateKey].aiAssistant
      };
    },
    {
      keplerGlActions: {
        mapStyleChange,
        loadFiles,
        addDataToMap,
        addLayer,
        createOrUpdateFilter,
        setFilter,
        setFilterPlot,
        layerSetIsValid,
        layerVisualChannelConfigChange
      },
      aiAssistantActions: {
        updateAiAssistantConfig,
        updateAiAssistantMessages,
        setStartScreenCapture,
        setScreenCaptured
      }
    }
  )(injectIntl(AiAssistantManager)) as React.FC<AiAssistantManagerProps>;
}

export default AiAssistantManagerFactory;
