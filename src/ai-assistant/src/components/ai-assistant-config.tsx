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
  appInjector,
  Checkbox
} from '@kepler.gl/components';
import {State} from '../index';
import ApiKey from '../icons/api-key';
import PROVIDER_MODELS from '../config/models.json';
import {useLocalStorage} from 'usehooks-ts';
import {GetAssistantModelByProvider} from '@openassistant/core';
import {updateAiAssistantConfig} from '../actions';
import {FormattedMessage, useIntl} from 'react-intl';

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

// Ollama model input wrapper: checkbox + 'Input Model Name:' + input
// all children element have width based on the content
const OllamaModelInputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;
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
  const intl = useIntl();

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
    aiAssistantConfig.baseUrl || 'http://localhost:11434/api'
  );
  const [mapboxToken, setMapboxToken] = useLocalStorage(
    'ai-assistant-mapbox-token',
    aiAssistantConfig.mapboxToken || ''
  );
  const [ollamaModelInputChecked, setOllamaModelInputChecked] = useState(false);
  const [ollamaModelInputValue, setOllamaModelInputValue] = useState('');
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

  const onOllamaModelInputChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOllamaModelInputChecked(e.target.checked);
    if (!e.target.checked) {
      // use model from selector
      setModel('');
    }
  };

  const onOllamaModelInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOllamaModelInputValue(e.target.value);
    setModel(e.target.value);
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
    <StyledAiAssistantConfig className="ai-assistant-config__type">
      <PanelLabelWrapper>
        <SectionTitle>
          <FormattedMessage id="aiAssistantManager.aiProvider" />
        </SectionTitle>
      </PanelLabelWrapper>
      <StyledWrapper>
        <StyledItemSelector
          selectedItems={provider}
          options={Object.keys(PROVIDER_MODELS)}
          multiSelect={false}
          disabled={false}
          onChange={onAiProviderSelect}
          filterOption="name"
          getOptionValue={op => op}
          displayOption={op => op}
          searchable={false}
          showArrow={true}
        />
      </StyledWrapper>
      <PanelLabelWrapper>
        <SectionTitle>
          <FormattedMessage id="aiAssistantManager.llmModel.title" />
        </SectionTitle>
      </PanelLabelWrapper>
      {((provider === 'ollama' && !ollamaModelInputChecked) || provider !== 'ollama') && (
        <StyledWrapper>
          <StyledItemSelector
            selectedItems={model}
            options={PROVIDER_MODELS[provider]}
            multiSelect={false}
            disabled={provider === 'ollama' ? ollamaModelInputChecked : false}
            placeholder="Select LLM Model"
            onChange={onLLMModelSelect}
            filterOption="name"
            getOptionValue={op => op}
            displayOption={op => op}
            searchable={false}
            showArrow={true}
          />
        </StyledWrapper>
      )}
      {provider === 'ollama' && (
        <OllamaModelInputWrapper>
          <div style={{width: '250px'}}>
            <Checkbox
              id="ollama-model-input"
              label="Input Model Name"
              onChange={onOllamaModelInputChecked}
              checked={ollamaModelInputChecked}
            />
          </div>
          <Input
            type="text"
            onChange={onOllamaModelInputValueChange}
            placeholder="Enter Model Name"
            value={ollamaModelInputValue}
            disabled={!ollamaModelInputChecked}
          />
        </OllamaModelInputWrapper>
      )}
      {provider !== 'ollama' ? (
        <>
          <PanelLabelWrapper>
            <SectionTitle>
              <FormattedMessage id="aiAssistantManager.apiKey.placeholder" />
            </SectionTitle>
          </PanelLabelWrapper>
          <div className="api-key-input">
            <div className="api-key-input__icon">
              <ApiKey height="20px" />
            </div>
            <Input
              type="text"
              onChange={onApiKeyChange}
              placeholder={intl.formatMessage({id: 'aiAssistantManager.apiKey.placeholder'})}
              value={apiKey}
            />
          </div>
        </>
      ) : (
        <>
          <PanelLabelWrapper>
            <SectionTitle>
              <FormattedMessage id="aiAssistantManager.baseUrl.placeholder" />
            </SectionTitle>
          </PanelLabelWrapper>
          <div className="api-key-input">
            <div className="api-key-input__icon">
              <ApiKey height="20px" />
            </div>
            <Input
              type="text"
              onChange={onBaseUrlChange}
              placeholder={intl.formatMessage({id: 'aiAssistantManager.baseUrl.placeholder'})}
              value={baseUrl}
            />
          </div>
        </>
      )}
      {connectionError && (
        <StyleErrorMessage className="error-message">{errorMessage}</StyleErrorMessage>
      )}
      <PanelLabelWrapper>
        <SectionTitle>
          <FormattedMessage id="aiAssistantManager.temperature.title" />
        </SectionTitle>
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
        <SectionTitle>
          <FormattedMessage id="aiAssistantManager.topP.title" />
        </SectionTitle>
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
          <SectionTitle>Mapbox Token (optional for route/isochrone)</SectionTitle>
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
          <FormattedMessage id="aiAssistantManager.startChat" />
        </Button>
      </StyledButton>
    </StyledAiAssistantConfig>
  );
}
