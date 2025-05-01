// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState} from 'react';
import styled from 'styled-components';
import {useSelector, useDispatch} from 'react-redux';
import {
  Input,
  PanelLabelWrapper,
  ItemSelector,
  RangeSliderFactory,
  Button,
  LoadingSpinner,
  appInjector
} from '@kepler.gl/components';
import {State} from '../index';
import ApiKey from '../icons/api-key';
import PROVIDER_MODELS from '../config/models.json';
import {useLocalStorage} from 'usehooks-ts';
import {GetAssistantModelByProvider} from '@openassistant/core';
import {updateAiAssistantConfig} from '../actions';
import {IntlProvider} from 'react-intl';
import {messages} from '../localization';
import {flattenMessages} from '@kepler.gl/utils';

const SectionTitle = styled.div`
  font-size: ${props => props.theme.inputFontSize};
  color: ${props => props.theme.effectPanelTextSecondary1};
  text-transform: capitalize;
`;

const StyledAiAssistantConfig = styled.div`
  padding: 12px;
  font-size: ${props => props.theme.primaryBtnFontSizeDefault};
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: 100%;

  .api-key-input {
    box-shadow: ${props => props.theme.boxShadow};
    width: 100%;
    .api-key-input__icon {
      position: absolute;
      height: ${props => props.theme.geocoderInputHeight}px;
      width: 30px;
      padding-left: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${props => props.theme.subtextColor};
    }

    input {
      padding: 4px 36px;
      height: ${props => props.theme.geocoderInputHeight}px;
      caret-color: unset;
    }
  }
`;

const StyledWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledItemSelector = styled(ItemSelector)`
  .item-selector__dropdown {
    padding-left: 10px;
    border-radius: 4px;
  }
  .active {
    border-color: ${props => props.theme.activeColor};
    border-radius: 4px 4px 0px 0px !important;
  }
  width: 100%;
`;

const StyleSliderWrapper = styled.div`
  width: 100%;
  align-self: flex-start;
  height: 32px;
  display: flex;
  align-items: center;
  .kg-range-slider__input {
    height: 32px;
    text-align: center;
    padding: 3px 6px;
  }
  .kg-slider {
    padding-left: 6px;
  }
  .kg-range-slider {
    padding: 0px !important;
  }
`;

const StyledButton = styled.div`
  width: 100%;
  align-self: flex-start;
  margin-top: 12px;

  button div {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-right: 4px;
  }
`;

const StyleErrorMessage = styled.div`
  font-size: ${props => props.theme.primaryBtnFontSizeDefault};
  background-color: ${props => props.theme.errorColor};
  border-radius: 4px;
  padding: 4px 8px;
  color: ${props => props.theme.errorTextColor};
`;

const RangeSlider = appInjector.get(RangeSliderFactory);

export function AiAssistantConfig() {
  const dispatch = useDispatch();
  const aiAssistantConfig = useSelector((state: State) => state.demo.aiAssistant.config);

  const [provider, setProvider] = useLocalStorage(
    'ai-assistant-provider',
    aiAssistantConfig.provider || 'openai'
  );
  const [model, setModel] = useLocalStorage(
    'ai-assistant-model',
    aiAssistantConfig.model || PROVIDER_MODELS[provider][0]
  );
  const [apiKey, setApiKey] = useLocalStorage(
    'ai-assistant-api-key',
    aiAssistantConfig.apiKey || ''
  );
  const [temperature, setTemperature] = useLocalStorage(
    'ai-assistant-temperature',
    aiAssistantConfig.temperature || 0.0
  );
  const [topP, setTopP] = useLocalStorage('ai-assistant-top-p', aiAssistantConfig.topP || 1.0);
  const [baseUrl, setBaseUrl] = useLocalStorage(
    'ai-assistant-base-url',
    aiAssistantConfig.baseUrl || 'http://localhost:11434'
  );
  const [mapboxToken, setMapboxToken] = useLocalStorage(
    'ai-assistant-mapbox-token',
    aiAssistantConfig.mapboxToken || ''
  );
  const [connectionError, setConnectionError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const onAiProviderSelect = (value: string | number | boolean | object | null) => {
    if (typeof value === 'string') {
      setProvider(value);
      setModel(PROVIDER_MODELS[value][0]);
      setConnectionError(false);
      setErrorMessage('');
    }
  };

  const onLLMModelSelect = (value: string | number | boolean | object | null) => {
    if (typeof value === 'string') {
      setModel(value);
    }
  };

  const onApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    // reset previous key error if any
    setConnectionError(false);
    setErrorMessage('');
  };

  const onTemperatureChange = (value: number[]) => {
    setTemperature(value[1]);
  };

  const onTopPChange = (value: number[]) => {
    setTopP(value[1]);
  };

  const onBaseUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBaseUrl(e.target.value);
    setConnectionError(false);
    setErrorMessage('');
  };

  const onMapboxTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMapboxToken(e.target.value);
  };

  const onStartChat = async () => {
    setIsRunning(true);
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout after 15 seconds')), 15000);
      });

      const AssistantModel = GetAssistantModelByProvider({
        provider: provider
      });

      const success = (await Promise.race([
        AssistantModel?.testConnection(apiKey, model),
        timeoutPromise
      ])) as boolean;

      const errorMessage = !success
        ? provider === 'ollama'
          ? 'Connection failed: maybe invalid Ollama Base URL'
          : 'Connection failed: maybe invalid API Key'
        : '';
      setConnectionError(!success);
      setErrorMessage(errorMessage);
      dispatch(
        updateAiAssistantConfig({
          provider: provider,
          model: model,
          apiKey: apiKey,
          baseUrl: baseUrl,
          isReady: success,
          temperature: temperature,
          topP: topP,
          mapboxToken: mapboxToken
        })
      );
    } catch (error) {
      setConnectionError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Connection failed');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <IntlProvider locale="en" messages={flattenMessages(messages.en)}>
      <StyledAiAssistantConfig className="ai-assistant-config__type">
        <PanelLabelWrapper>
          <SectionTitle>Select AI Provider</SectionTitle>
        </PanelLabelWrapper>
        <StyledWrapper>
          <StyledItemSelector
            selectedItems={provider}
            options={Object.keys(PROVIDER_MODELS)}
            multiSelect={false}
            disabled={false}
            placeholder="aiAssistantManager.aiProvider"
            onChange={onAiProviderSelect}
            filterOption="name"
            getOptionValue={op => op}
            displayOption={op => op}
            searchable={false}
            showArrow={true}
          />
        </StyledWrapper>
        <PanelLabelWrapper>
          <SectionTitle>Select LLM Model</SectionTitle>
        </PanelLabelWrapper>
        <StyledWrapper>
          <StyledItemSelector
            selectedItems={model}
            options={PROVIDER_MODELS[provider]}
            multiSelect={false}
            disabled={false}
            placeholder="aiAssistantManager.llmModel.placeholder"
            onChange={onLLMModelSelect}
            filterOption="name"
            getOptionValue={op => op}
            displayOption={op => op}
            searchable={false}
            showArrow={true}
          />
        </StyledWrapper>
        {provider !== 'ollama' ? (
          <>
            <PanelLabelWrapper>
              <SectionTitle>Enter API Key</SectionTitle>
            </PanelLabelWrapper>
            <div className="api-key-input">
              <div className="api-key-input__icon">
                <ApiKey height="20px" />
              </div>
              <Input
                type="text"
                onChange={onApiKeyChange}
                placeholder="Enter your API Key"
                value={apiKey}
              />
            </div>
          </>
        ) : (
          <>
            <PanelLabelWrapper>
              <SectionTitle>Ollama Base URL</SectionTitle>
            </PanelLabelWrapper>
            <div className="api-key-input">
              <div className="api-key-input__icon">
                <ApiKey height="20px" />
              </div>
              <Input
                type="text"
                onChange={onBaseUrlChange}
                placeholder="Enter Ollama Base URL"
                value={baseUrl}
              />
            </div>
          </>
        )}
        {connectionError && (
          <StyleErrorMessage className="error-message">{errorMessage}</StyleErrorMessage>
        )}
        <PanelLabelWrapper>
          <SectionTitle>Temperature</SectionTitle>
        </PanelLabelWrapper>
        <StyleSliderWrapper>
          <RangeSlider
            showInput={true}
            isRanged={false}
            value0={0}
            value1={temperature}
            onChange={onTemperatureChange}
            range={[0, 2]}
            step={0.1}
          />
        </StyleSliderWrapper>
        <PanelLabelWrapper>
          <SectionTitle>Top P</SectionTitle>
        </PanelLabelWrapper>
        <StyleSliderWrapper>
          <RangeSlider
            showInput={true}
            isRanged={false}
            value0={0}
            value1={topP}
            onChange={onTopPChange}
            range={[0, 1]}
            step={0.1}
          />
        </StyleSliderWrapper>
        <>
          <PanelLabelWrapper>
            <SectionTitle>Mapbox Token (optional: route/isochrone)</SectionTitle>
          </PanelLabelWrapper>
          <div className="api-key-input">
            <div className="api-key-input__icon">
              <ApiKey height="20px" />
            </div>
            <Input
              type="text"
              onChange={onMapboxTokenChange}
              placeholder="Enter your Mapbox Token"
              value={mapboxToken}
            />
          </div>
        </>
        <StyledButton>
          <Button onClick={onStartChat} width={'100%'}>
            {isRunning && <LoadingSpinner size={12} />}
            Let's Chat
          </Button>
        </StyledButton>
      </StyledAiAssistantConfig>
    </IntlProvider>
  );
}
