// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';
import {TooltipConfigFactory} from '@kepler.gl/components';
import {Datasets} from '@kepler.gl/table';

import {getKeplerFactory} from './KeplerInjector';

const TooltipConfigWrapper = styled.div<{isDark: boolean}>`
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  overflow-y: visible;
  box-sizing: border-box;
  position: relative;
  contain: layout;

  .sortable-layer-items > div {
    padding: 2px 4px;
    background-color: ${props => props.theme.sidePanelBg || props.theme.panelBackground};
    border-radius: 4px;
  }
  .chickleted-input {
    background-color: ${props => (props.isDark ? '#0f172a' : '#F6F8FB')} !important;
    border-color: transparent;
    border-radius: 6px;
    font-weight: 400;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }
  .side-panel-section {
    position: relative !important;
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: hidden !important;
    box-sizing: border-box !important;
  }
  .side-panel-section > :first-child {
    display: flex;
    justify-content: space-between;
    position: absolute !important;
    left: 0 !important;
    right: 0 !important;
    width: auto !important;
    padding: 0px 9px;
    top: 8px;
    box-sizing: border-box !important;
  }
  .field-selector {
    padding-top: 32px;
    background-color: ${props => (props.isDark ? '#0f172a' : '#F6F8FB')} !important;
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: hidden !important;
    box-sizing: border-box !important;
  }
  .update-color {
    display: none;
  }
  .dataset-name {
    font-weight: 500;
    font-size: 12px;
  }
  .clear-all {
    width: 64px;
    font-weight: 400;
    color: #94a2b8 !important;
    font-size: 12px;
  }
  .item-selector {
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: hidden !important;
    box-sizing: border-box !important;
  }
  .item-selector > div {
    max-width: 100% !important;
    overflow-x: hidden !important;
    box-sizing: border-box !important;
  }
`;

type CustomTooltipConfigProps = {
  config: {
    fieldsToShow: {
      [key: string]: {name: string; format: string | null}[];
    };
    compareMode: boolean;
    compareType: string | null;
  };
  onChange: (config: {
    fieldsToShow: {
      [key: string]: {name: string; format: string | null}[];
    };
    compareMode: boolean;
    compareType: string | null;
  }) => void;
  datasets: Datasets;
  onDisplayFormatChange: (dataId: string, column: string, displayFormat: string) => void;
  isDark: boolean;
};

const TooltipConfig = getKeplerFactory(TooltipConfigFactory);

export const CustomTooltipConfig: React.FC<CustomTooltipConfigProps> = ({
  config,
  datasets,
  onChange,
  onDisplayFormatChange,
  isDark
}) => {
  const intl = useIntl();

  return (
    <TooltipConfigWrapper isDark={isDark}>
      <TooltipConfig
        config={config}
        datasets={datasets}
        onChange={onChange}
        onDisplayFormatChange={onDisplayFormatChange}
        {...(intl ? {intl} : {})}
      />
    </TooltipConfigWrapper>
  );
};
