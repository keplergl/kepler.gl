// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ChangeEvent, useMemo, useState} from 'react';
import styled, {ThemeProvider, useTheme} from 'styled-components';
import {SwipeEasing} from './swipe-composite-utils';

import Slider from '../common/slider/slider';
import ItemSelector from '../common/item-selector/item-selector';
import {InputLight} from '../common/styled-components';

// --- Styled components matching the regular export video modal ---

const StyledModalTab = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.borderColorLT};
  margin-bottom: 16px;
`;

const StyledTabItem = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  color: ${props => props.theme.subtextColorLT};
  border-bottom: 2px solid transparent;

  &.active {
    color: ${props => props.theme.textColorLT};
    border-bottom: 2px solid ${props => props.theme.textColorLT};
    font-weight: 500;
  }

  &:hover {
    color: ${props => props.theme.textColorLT};
  }
`;

const InputGrid = styled.div<{$rows?: number}>`
  display: grid;
  grid-template-columns: 100px 1fr;
  grid-row-gap: 12px;
  align-items: center;
`;

const StyledLabelCell = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: ${props => props.theme.subtextColorLT};
`;

const StyledValueCell = styled.div`
  font-size: 11px;
  color: ${props => props.theme.textColorLT};
`;

const SliderWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const VideoLengthDisplay = styled.span`
  font-size: 11px;
  color: ${props => props.theme.textColorLT};
  white-space: nowrap;
  margin-left: 8px;
  min-width: 42px;
`;

const SectionDivider = styled.div`
  margin: 14px 0 10px;
  padding-top: 10px;
  border-top: 1px solid ${props => props.theme.borderColorLT};
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.theme.textColorLT};
  margin-bottom: 10px;
`;

const SLIDER_LIGHT_OVERRIDES = {
  sliderBarColor: '#A0A7B4',
  sliderBarBgd: '#D3D8E0',
  sliderBarHoverColor: '#939BA8',
  sliderHandleColor: '#F7F7F7',
  sliderHandleHoverColor: '#F7F7F7',
  sliderInactiveBorderColor: '#F7F7F7',
  sliderHandleTextColor: '#F7F7F7',
  sliderHandleShadow: '0 2px 4px 0 rgba(0,0,0,0.20)'
};

// --- Options ---

const EASING_OPTIONS = [
  {id: 'ease-in-out', label: 'Ease In-Out'},
  {id: 'linear', label: 'Linear'}
];

const FORMAT_OPTIONS = [
  {value: 'gif', label: 'GIF'},
  {value: 'webm', label: 'WebM Video'},
  {value: 'png', label: 'PNG Sequence'},
  {value: 'jpeg', label: 'JPEG Sequence'}
];

const DEFAULT_PREVIEW_RESOLUTIONS: Record<string, string> = {'16:9': '1280x720', '4:3': '1280x960'};

const RESOLUTION_OPTIONS = [
  {value: '960x540', label: 'Good (540p)', aspectRatio: '16:9'},
  {value: '1280x720', label: 'High (720p)', aspectRatio: '16:9'},
  {value: '1920x1080', label: 'Highest (1080p)', aspectRatio: '16:9'},
  {value: '640x480', label: 'Good (480p)', aspectRatio: '4:3'},
  {value: '1280x960', label: 'High (960p)', aspectRatio: '4:3'},
  {value: '1920x1440', label: 'Highest (1440p)', aspectRatio: '4:3'}
];

const CAMERA_PRESETS = [
  'None',
  'Orbit (90º)',
  'Orbit (180º)',
  'Orbit (360º)',
  'Zoom Out',
  'Zoom In'
];

// --- Types ---

export type SwipeExportSettingsProps = {
  durationMs: number;
  mediaType: string;
  resolution: string;
  fileName: string;
  cameraPreset: string;
  frameRate: number;
  onChangeDuration: (value: number) => void;
  onChangeMediaType: (value: string) => void;
  onChangeResolution: (value: string) => void;
  onChangeFileName: (value: string) => void;
  onChangeCameraPreset: (value: string) => void;
  swipeStartPct: number;
  swipeEndPct: number;
  swipeEasing: SwipeEasing;
  disabled: boolean;
  onChangeStartPct: (value: number) => void;
  onChangeEndPct: (value: number) => void;
  onChangeEasing: (value: SwipeEasing) => void;
  // When true, hide the swipe-specific controls (used by single-map globe export).
  hideSwipe?: boolean;
};

// --- Utilities ---

function printDuration(durationMs: number): string {
  const seconds = Math.floor(durationMs / 1000) % 60;
  const minutes = Math.floor(durationMs / 60000);
  const ms = Math.floor((durationMs % 1000) / 100);
  const hh = minutes > 0 ? `${minutes}:` : '';
  return `${hh}${seconds < 10 ? '0' : ''}${seconds}.${ms}`;
}

function estimateFileSize(
  frameRate: number,
  resolution: [number, number],
  durationMs: number,
  mediaType: string
): string {
  const MB = 8 * 1024 * 1024;
  const seconds = Math.floor(durationMs / 1000);
  const COMPRESSION_RATIO = 0.8;
  const BIT_DEPTH = 6;

  if (mediaType === 'gif' || mediaType === 'png') {
    return `${Math.floor(
      ((resolution[0] * resolution[1] * BIT_DEPTH) / MB) * (frameRate * seconds) * COMPRESSION_RATIO
    )} MB`;
  }
  if (mediaType === 'webm') {
    return `${Math.ceil((resolution[0] / 1280) * frameRate * seconds * 0.125)} MB`;
  }
  if (mediaType === 'jpeg') {
    return `${Math.floor(
      ((resolution[0] * resolution[1] * BIT_DEPTH) / MB) * (frameRate * seconds) * 0.4
    )} MB`;
  }
  return '—';
}

// --- Sub-components ---

const LightSlider: React.FC<any> = props => {
  const theme = useTheme();
  const lightTheme = useMemo(() => ({...theme, ...SLIDER_LIGHT_OVERRIDES}), [theme]);
  return (
    <ThemeProvider theme={lightTheme}>
      <Slider {...props} />
    </ThemeProvider>
  );
};

const LightItemSelector: React.FC<any> = props => (
  <ItemSelector {...props} inputTheme="light" />
);

const getOptionValue = (o: any) => o.value;
const displayOption = (o: any) => o.label;

// --- Animation Tab ---

const AnimationTab: React.FC<{
  durationMs: number;
  cameraPreset: string;
  swipeStartPct: number;
  swipeEndPct: number;
  swipeEasing: SwipeEasing;
  disabled: boolean;
  hideSwipe?: boolean;
  onChangeDuration: (value: number) => void;
  onChangeCameraPreset: (value: string) => void;
  onChangeStartPct: (value: number) => void;
  onChangeEndPct: (value: number) => void;
  onChangeEasing: (value: SwipeEasing) => void;
}> = ({
  durationMs,
  cameraPreset,
  swipeStartPct,
  swipeEndPct,
  swipeEasing,
  disabled,
  hideSwipe,
  onChangeDuration,
  onChangeCameraPreset,
  onChangeStartPct,
  onChangeEndPct,
  onChangeEasing
}) => (
  <>
    <InputGrid>
      <StyledLabelCell>Duration</StyledLabelCell>
      <StyledValueCell>
        <SliderWrapper>
          <LightSlider
            showValues={false}
            enableBarDrag={!disabled}
            isRanged={false}
            value0={100}
            value1={durationMs}
            step={100}
            minValue={100}
            maxValue={10000}
            onSlider1Change={(v: number) => { if (!disabled) onChangeDuration(v); }}
          />
          <VideoLengthDisplay>{printDuration(durationMs)}</VideoLengthDisplay>
        </SliderWrapper>
      </StyledValueCell>

      <StyledLabelCell>Camera</StyledLabelCell>
      <LightItemSelector
        selectedItems={cameraPreset}
        options={CAMERA_PRESETS}
        multiSelect={false}
        searchable={false}
        onChange={onChangeCameraPreset}
        disabled={disabled}
      />
    </InputGrid>

    {!hideSwipe && (
      <>
        <SectionDivider>Swipe</SectionDivider>
        <InputGrid>
          <StyledLabelCell>Start ({Math.round(swipeStartPct)}%)</StyledLabelCell>
          <LightSlider
            showValues={false}
            isRanged={false}
            value1={swipeStartPct}
            minValue={0}
            maxValue={100}
            step={1}
            onSlider1Change={(v: number) => { if (!disabled) onChangeStartPct(v); }}
            disabled={disabled}
          />

          <StyledLabelCell>End ({Math.round(swipeEndPct)}%)</StyledLabelCell>
          <LightSlider
            showValues={false}
            isRanged={false}
            value1={swipeEndPct}
            minValue={0}
            maxValue={100}
            step={1}
            onSlider1Change={(v: number) => { if (!disabled) onChangeEndPct(v); }}
            disabled={disabled}
          />

          <StyledLabelCell>Easing</StyledLabelCell>
          <LightItemSelector
            selectedItems={EASING_OPTIONS.find(o => o.id === swipeEasing) || EASING_OPTIONS[0]}
            options={EASING_OPTIONS}
            multiSelect={false}
            searchable={false}
            onChange={(val: any) => onChangeEasing(val?.id || val)}
            disabled={disabled}
            getOptionValue={(o: any) => o.id}
            displayOption={(o: any) => o.label}
          />
        </InputGrid>
      </>
    )}
  </>
);

// --- Settings Tab (identical to regular export) ---

const SettingsTab: React.FC<{
  fileName: string;
  mediaType: string;
  resolution: string;
  frameRate: number;
  durationMs: number;
  disabled: boolean;
  onChangeFileName: (value: string) => void;
  onChangeMediaType: (value: string) => void;
  onChangeResolution: (value: string) => void;
}> = ({
  fileName,
  mediaType,
  resolution,
  frameRate,
  durationMs,
  disabled,
  onChangeFileName,
  onChangeMediaType,
  onChangeResolution
}) => {
  const [aspRatio, setAspRatio] = useState<string>('16:9');

  const resolutionParts = resolution.split('x').map(Number);
  const currentResolution: [number, number] = [resolutionParts[0] || 1280, resolutionParts[1] || 720];

  return (
    <InputGrid>
      <StyledLabelCell>File Name</StyledLabelCell>
      <InputLight
        value={fileName}
        placeholder="kepler.gl"
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeFileName(e.target.value)}
        disabled={disabled}
      />

      <StyledLabelCell>Media Type</StyledLabelCell>
      <LightItemSelector
        selectedItems={FORMAT_OPTIONS.find(o => o.value === mediaType) || FORMAT_OPTIONS[0]}
        options={FORMAT_OPTIONS}
        multiSelect={false}
        searchable={false}
        onChange={(val: any) => onChangeMediaType(val?.value || val)}
        disabled={disabled}
        getOptionValue={getOptionValue}
        displayOption={displayOption}
      />

      <StyledLabelCell>Ratio</StyledLabelCell>
      <LightItemSelector
        selectedItems={aspRatio}
        options={['4:3', '16:9']}
        multiSelect={false}
        searchable={false}
        onChange={(ratio: string) => {
          setAspRatio(ratio);
          onChangeResolution(DEFAULT_PREVIEW_RESOLUTIONS[ratio]);
        }}
        disabled={disabled}
      />

      <StyledLabelCell>Quality</StyledLabelCell>
      <LightItemSelector
        selectedItems={RESOLUTION_OPTIONS.find(o => o.value === resolution) || RESOLUTION_OPTIONS[1]}
        options={RESOLUTION_OPTIONS.filter(o => o.aspectRatio === aspRatio)}
        multiSelect={false}
        searchable={false}
        onChange={(val: any) => onChangeResolution(val?.value || val)}
        disabled={disabled}
        getOptionValue={getOptionValue}
        displayOption={displayOption}
      />

      <StyledLabelCell>File Size</StyledLabelCell>
      <StyledValueCell>
        Approx. {estimateFileSize(frameRate, currentResolution, durationMs, mediaType)}
      </StyledValueCell>
    </InputGrid>
  );
};

// --- Main Component ---

type TabId = 'animation' | 'settings';

const SwipeExportSettings: React.FC<SwipeExportSettingsProps> = ({
  durationMs,
  mediaType,
  resolution,
  fileName,
  cameraPreset,
  frameRate,
  onChangeDuration,
  onChangeMediaType,
  onChangeResolution,
  onChangeFileName,
  onChangeCameraPreset,
  swipeStartPct,
  swipeEndPct,
  swipeEasing,
  disabled,
  onChangeStartPct,
  onChangeEndPct,
  onChangeEasing,
  hideSwipe
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('animation');

  return (
    <div>
      <StyledModalTab>
        <StyledTabItem
          className={activeTab === 'animation' ? 'active' : ''}
          onClick={() => setActiveTab('animation')}
        >
          Animation
        </StyledTabItem>
        <StyledTabItem
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </StyledTabItem>
      </StyledModalTab>

      {activeTab === 'animation' && (
        <AnimationTab
          durationMs={durationMs}
          cameraPreset={cameraPreset}
          swipeStartPct={swipeStartPct}
          swipeEndPct={swipeEndPct}
          swipeEasing={swipeEasing}
          disabled={disabled}
          hideSwipe={hideSwipe}
          onChangeDuration={onChangeDuration}
          onChangeCameraPreset={onChangeCameraPreset}
          onChangeStartPct={onChangeStartPct}
          onChangeEndPct={onChangeEndPct}
          onChangeEasing={onChangeEasing}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsTab
          fileName={fileName}
          mediaType={mediaType}
          resolution={resolution}
          frameRate={frameRate}
          durationMs={durationMs}
          disabled={disabled}
          onChangeFileName={onChangeFileName}
          onChangeMediaType={onChangeMediaType}
          onChangeResolution={onChangeResolution}
        />
      )}
    </div>
  );
};

export default SwipeExportSettings;
