// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component, createRef} from 'react';
import {easeInOut} from 'popmotion';
import download from 'downloadjs';
import styled from 'styled-components';
import {
  DeckAdapter,
  KeplerAnimation,
  WebMEncoder,
  JPEGSequenceEncoder,
  PNGSequenceEncoder,
  PreviewEncoder,
  GifEncoder,
  FormatConfigs,
  Timecode
} from '@hubble.gl/core';
import type {DeckProps, MapViewState} from '@deck.gl/core';
import {FILTER_VIEW_TYPES} from '@kepler.gl/constants';

import {parseSetCameraType, scaleToVideoExport, getResolutionSetting} from './hubble-utils';
import {SwipeExportVideoPreview} from './swipe-export-video-preview';
import SwipeExportSettings from './swipe-export-settings';
import {
  compositeSwipeFrame,
  getSwipePercentageAtTime,
  SwipeEasing
} from './swipe-composite-utils';

const ENCODERS = {
  gif: GifEncoder,
  webm: WebMEncoder,
  jpeg: JPEGSequenceEncoder,
  png: PNGSequenceEncoder
};

export type SwipeExportVideoSettings = {
  mediaType?: string;
  cameraPreset?: string;
  fileName?: string;
  resolution?: string;
  durationMs?: number;
  swipeStartPct?: number;
  swipeEndPct?: number;
  swipeEasing?: SwipeEasing;
};

type SwipeExportVideoPanelContainerProps = {
  initialState?: Partial<SwipeExportVideoPanelContainerState>;
  glContext?: WebGL2RenderingContext;
  exportVideoWidth: number;
  handleClose: () => void;
  mapData: any;
  header: boolean;
  deckProps?: DeckProps;
  mapProps: Record<string, any>;
  disableBaseMap: boolean;
  mapboxLayerBeforeId?: string;
  defaultFileName: string;
  animatableFilters: any;
  onTripFrameUpdate: (value: any) => void;
  onFilterFrameUpdate: (filterIdx: number, name: string, value: any) => void;
  getTimeRangeFilterKeyframes: (args: any) => any;
  onSettingsChange: (settings: SwipeExportVideoSettings) => void;
  swipeStartPct: number;
  swipeEndPct: number;
  swipeEasing: SwipeEasing;
};

type SwipeExportVideoPanelContainerState = {
  adapter?: DeckAdapter;
  durationMs: number;
  mediaType: string;
  cameraPreset: string;
  fileName: string;
  resolution: string;
  viewState?: MapViewState;
  rendering: boolean;
  previewing: boolean;
  saving: boolean;
  currentTimeMs: number;
  memo?: {viewState: MapViewState};
};

const PanelBody = styled.div<{$exportVideoWidth: number}>`
  display: grid;
  grid-template-columns: ${props => props.$exportVideoWidth}px 1fr;
  grid-column-gap: 24px;
`;

const SettingsColumn = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 100%;
`;

const ButtonGroup = styled.div`
  grid-column: 1 / -1;
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const TimelineControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  gap: 12px;
`;

const PlayButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.primaryBtnActBgd || '#1FBAD6'};
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.primaryBtnActBgd || '#1FBAD6'};
  &:hover {
    background: ${props => props.theme.primaryBtnActBgd || '#1FBAD6'};
    color: white;
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const RenderButton = styled.button`
  width: 100%;
  height: 32px;
  margin-top: 16px;
  border: none;
  border-radius: 4px;
  background: ${props => props.theme.primaryBtnActBgd || '#1FBAD6'};
  color: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background: ${props => props.theme.primaryBtnActHover || '#108B96'};
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const StatusText = styled.div`
  font-size: 11px;
  color: ${props => props.theme.subtextColorLT || '#6A7485'};
  text-align: center;
  margin-top: 8px;
`;

/**
 * Orchestrates swipe video export recording.
 * Manages a DeckAdapter but overrides the capture pipeline to
 * composite left/right canvases with an animated swipe divider.
 */
export class SwipeExportVideoPanelContainer extends Component<
  SwipeExportVideoPanelContainerProps,
  SwipeExportVideoPanelContainerState
> {
  previewRef = createRef<SwipeExportVideoPreview>();
  compositeCanvasRef = createRef<HTMLCanvasElement>();
  animationFrameId: number | null = null;

  constructor(props: SwipeExportVideoPanelContainerProps) {
    super(props);

    const {
      initialState,
      mapData: {mapState},
      glContext
    } = props;

    this.state = {
      mediaType: 'webm',
      cameraPreset: 'None',
      fileName: '',
      resolution: '1280x720',
      durationMs: 1000,
      rendering: false,
      previewing: false,
      saving: false,
      currentTimeMs: 0,
      ...(initialState || {})
    };

    const viewState = scaleToVideoExport(mapState, this._getContainer());
    this.state = {
      ...this.state,
      viewState,
      memo: {viewState},
      adapter: new DeckAdapter({glContext})
    };
  }

  componentDidMount() {
    const {onTripFrameUpdate, onFilterFrameUpdate, getTimeRangeFilterKeyframes} = this.props;
    const animation = new KeplerAnimation({
      ...this.getFilterKeyframes(),
      ...this.getTripKeyframes(),
      cameraKeyframe: this.getCameraKeyframes(),
      onCameraFrameUpdate: this.setViewState,
      onTripFrameUpdate,
      onFilterFrameUpdate,
      getTimeRangeFilterKeyframes
    });
    this.state.adapter!.animationManager.attachAnimation(animation);
  }

  componentWillUnmount() {
    this.onStop({abort: true});
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  getFileName() {
    const {defaultFileName} = this.props;
    const {fileName} = this.state;
    return fileName || defaultFileName;
  }

  getCanvasSize() {
    const {resolution} = this.state;
    const {width, height} = getResolutionSetting(resolution);
    return {width, height};
  }

  _getContainer() {
    const {width, height} = this.getCanvasSize();
    const {exportVideoWidth} = this.props;
    const aspectRatio = width / height;
    return {height: exportVideoWidth / aspectRatio, width: exportVideoWidth};
  }

  getFormatConfigs(): Partial<FormatConfigs> {
    const {width, height} = this.getCanvasSize();
    return {
      webm: {quality: 0.8},
      jpeg: {quality: 0.8},
      png: {},
      gif: {sampleInterval: 1000, width, height}
    };
  }

  getTimecode(): Timecode {
    const {durationMs} = this.state;
    return {start: 0, end: durationMs, framerate: 30};
  }

  getEncoder() {
    const {mediaType} = this.state;
    return ENCODERS[mediaType];
  }

  getCameraKeyframes() {
    const {viewState, cameraPreset, durationMs} = this.state;
    const {longitude, latitude, zoom, pitch, bearing} = viewState!;
    const {width, height} = this.getCanvasSize();
    return {
      timings: [0, durationMs],
      keyframes: [
        {longitude, latitude, zoom, pitch, bearing},
        parseSetCameraType(cameraPreset, viewState!)
      ],
      easings: [easeInOut],
      width,
      height
    };
  }

  getFilterKeyframes() {
    const {
      mapData: {visState: {filters}},
      animatableFilters
    } = this.props;

    const filterKeyframes = (
      Array.isArray(animatableFilters) && animatableFilters.length
        ? animatableFilters
        : filters.filter((f: any) => f.type === 'timeRange' && f.view === FILTER_VIEW_TYPES.enlarged)
    ).map((f: any) => ({
      id: f.id,
      timings: [0, this.state.durationMs]
    }));

    if (filterKeyframes.length) {
      return {filters, filterKeyframes};
    }
    return {};
  }

  getTripKeyframes() {
    const {
      mapData: {visState: {layers, animationConfig}}
    } = this.props;

    const animatableLayer = layers.filter(
      (l: any) => l.config.animation && l.config.animation.enabled && l.config.isVisible
    );
    const readyToAnimation =
      Array.isArray(animationConfig.domain) && Number.isFinite(animationConfig.currentTime);
    if (animatableLayer.length && readyToAnimation) {
      return {
        animationConfig,
        tripKeyframe: {timings: [0, this.state.durationMs]}
      };
    }
    return {};
  }

  setViewState = (viewState: MapViewState) => {
    this.setState({viewState});
  };

  setStateAndNotify(update: SwipeExportVideoSettings) {
    const {onSettingsChange} = this.props;
    const {mediaType, cameraPreset, fileName, resolution, durationMs} = this.state;
    this.setState({...this.state, ...update} as any);
    if (onSettingsChange) {
      onSettingsChange({mediaType, cameraPreset, fileName, resolution, durationMs, ...update});
    }
  }

  setMediaType = (mediaType: string) => this.setStateAndNotify({mediaType});
  setCameraPreset = (cameraPreset: string) => this.setStateAndNotify({cameraPreset});
  setFileName = (fileName: string) => this.setStateAndNotify({fileName});
  setResolution = (resolution: string) => this.setStateAndNotify({resolution});
  setDuration = (durationMs: number) => this.setStateAndNotify({durationMs});

  /**
   * Start a preview playback — animates the swipe without encoding.
   */
  onPreviewVideo = () => {
    const {adapter, durationMs} = this.state;
    this.setState({
      previewing: true,
      currentTimeMs: 0,
      memo: {viewState: {...this.state.viewState!}}
    });

    adapter!.animationManager.setKeyframes('kepler', {
      ...this.getFilterKeyframes(),
      ...this.getTripKeyframes(),
      cameraKeyframe: this.getCameraKeyframes()
    });

    const startTime = performance.now();
    const animate = () => {
      const elapsed = performance.now() - startTime;
      const currentTimeMs = Math.min(elapsed, durationMs);

      adapter!.animationManager.timeline.setTime(currentTimeMs);
      adapter!.animationManager.draw();

      this.setState({currentTimeMs});

      if (currentTimeMs >= durationMs) {
        this.setState({
          previewing: false,
          currentTimeMs: 0,
          viewState: {...this.state.memo!.viewState}
        });
        return;
      }
      this.animationFrameId = requestAnimationFrame(animate);
    };
    this.animationFrameId = requestAnimationFrame(animate);
  };

  /**
   * Start actual recording — captures composited frames into the encoder.
   * Uses a timer-based approach: updates currentTimeMs, waits for the preview
   * to composite, then captures the composite canvas.
   */
  onRenderVideo = () => {
    const {adapter, durationMs} = this.state;
    const {swipeStartPct, swipeEndPct, swipeEasing} = this.props;
    const filename = this.getFileName();
    const Encoder = this.getEncoder();
    const formatConfigs = this.getFormatConfigs();
    const timecode = this.getTimecode();
    const {width, height} = this.getCanvasSize();

    this.setState({
      rendering: true,
      saving: false,
      currentTimeMs: 0,
      memo: {viewState: {...this.state.viewState!}}
    });

    adapter!.animationManager.setKeyframes('kepler', {
      ...this.getFilterKeyframes(),
      ...this.getTripKeyframes(),
      cameraKeyframe: this.getCameraKeyframes()
    });

    const encoder = new Encoder({...formatConfigs, framerate: timecode.framerate});
    encoder.start();

    const frameLengthMs = Math.floor(1000 / timecode.framerate);
    let timeMs = timecode.start;
    let retryCount = 0;
    const MAX_RETRIES = 10;

    const captureNextFrame = () => {
      if (!this.state.rendering) return;

      adapter!.animationManager.timeline.setTime(timeMs);
      adapter!.animationManager.draw();
      this.setState({currentTimeMs: timeMs});

      // Allow 3 frames for state update → preview re-render → composite
      const waitAndCapture = () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const preview = this.previewRef.current;
              if (!preview) return;

              // Use the composite canvas that the preview already updates
              const compositeCanvas = preview.getCompositeCanvas();
              if (!compositeCanvas) return;

              // Check if the canvas has any content (not blank)
              const ctx = compositeCanvas.getContext('2d');
              if (!ctx) return;

              // Verify canvas has content by checking a pixel
              const pixel = ctx.getImageData(0, 0, 1, 1).data;
              const hasContent = pixel[0] !== 0 || pixel[1] !== 0 || pixel[2] !== 0 || pixel[3] !== 0;

              if (!hasContent && retryCount < MAX_RETRIES) {
                retryCount++;
                // Trigger composite manually and retry
                preview._compositeFrame();
                requestAnimationFrame(waitAndCapture);
                return;
              }
              retryCount = 0;

              // Capture the composite canvas at target resolution
              const offscreen = document.createElement('canvas');
              offscreen.width = width;
              offscreen.height = height;
              const offCtx = offscreen.getContext('2d');
              if (offCtx) {
                offCtx.drawImage(compositeCanvas, 0, 0, width, height);
              }

              encoder.add(offscreen).then(() => {
                timeMs += frameLengthMs;
                if (timeMs > timecode.end) {
                  this.setState({saving: true});
                  encoder.save().then((blob: Blob | null) => {
                    if (blob) {
                      download(blob, filename + encoder.extension, encoder.mimeType);
                    }
                    this.setState({
                      rendering: false,
                      saving: false,
                      currentTimeMs: 0,
                      viewState: {...this.state.memo!.viewState}
                    });
                  });
                } else {
                  captureNextFrame();
                }
              });
            });
          });
        });
      };

      waitAndCapture();
    };

    // Wait for maps to be ready before starting capture
    setTimeout(() => captureNextFrame(), 500);
  };

  onStop = ({abort = false}: {abort?: boolean} = {}) => {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.setState({
      rendering: false,
      previewing: false,
      currentTimeMs: 0,
      viewState: this.state.memo?.viewState || this.state.viewState
    });
  };

  render() {
    const {
      exportVideoWidth,
      handleClose,
      mapData,
      deckProps,
      mapProps,
      disableBaseMap,
      mapboxLayerBeforeId,
      defaultFileName,
      swipeStartPct,
      swipeEndPct,
      swipeEasing,
      onSettingsChange
    } = this.props;

    const {
      adapter,
      durationMs,
      mediaType,
      cameraPreset,
      fileName,
      resolution,
      viewState,
      rendering,
      previewing,
      saving,
      currentTimeMs
    } = this.state;

    const timecode = this.getTimecode();
    let canvasSize = this.getCanvasSize();
    if (previewing) {
      canvasSize = this._getContainer();
    }

    const isActive = rendering || previewing;

    return (
      <div className="swipe-export-video-panel">
        <PanelBody $exportVideoWidth={exportVideoWidth}>
          <SwipeExportVideoPreview
            ref={this.previewRef}
            mapData={mapData}
            adapter={adapter!}
            setViewState={this.setViewState}
            exportVideoWidth={exportVideoWidth}
            resolution={[canvasSize.width, canvasSize.height]}
            viewState={viewState!}
            rendering={rendering}
            saving={saving}
            durationMs={durationMs}
            deckProps={deckProps}
            mapProps={mapProps}
            disableBaseMap={disableBaseMap}
            mapboxLayerBeforeId={mapboxLayerBeforeId}
            swipeStartPct={swipeStartPct}
            swipeEndPct={swipeEndPct}
            swipeEasing={swipeEasing}
            currentTimeMs={currentTimeMs}
          />
          <SettingsColumn>
            <SwipeExportSettings
              durationMs={durationMs}
              mediaType={mediaType}
              resolution={resolution}
              fileName={fileName}
              cameraPreset={cameraPreset}
              frameRate={timecode.framerate}
              onChangeDuration={this.setDuration}
              onChangeMediaType={this.setMediaType}
              onChangeResolution={this.setResolution}
              onChangeFileName={this.setFileName}
              onChangeCameraPreset={this.setCameraPreset}
              swipeStartPct={swipeStartPct}
              swipeEndPct={swipeEndPct}
              swipeEasing={swipeEasing}
              disabled={isActive}
              onChangeStartPct={(value: number) =>
                onSettingsChange({swipeStartPct: value})
              }
              onChangeEndPct={(value: number) =>
                onSettingsChange({swipeEndPct: value})
              }
              onChangeEasing={(value: SwipeEasing) =>
                onSettingsChange({swipeEasing: value})
              }
            />
            <TimelineControls>
              {isActive ? (
                <PlayButton onClick={() => this.onStop({})}>
                  &#9632;
                </PlayButton>
              ) : (
                <PlayButton onClick={this.onPreviewVideo}>
                  &#9654;
                </PlayButton>
              )}
            </TimelineControls>
            {saving && <StatusText>Saving...</StatusText>}
            {rendering && !saving && <StatusText>Rendering... {Math.round((currentTimeMs / durationMs) * 100)}%</StatusText>}
            <RenderButton onClick={this.onRenderVideo} disabled={isActive}>
              Render
            </RenderButton>
          </SettingsColumn>
        </PanelBody>
      </div>
    );
  }
}
