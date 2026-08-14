// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component, createRef} from 'react';
import {easeInOut} from 'popmotion';
import download from 'downloadjs';
import styled from 'styled-components';
import {Button} from '../common';
import {
  DeckAdapter,
  KeplerAnimation,
  WebMEncoder,
  JPEGSequenceEncoder,
  PNGSequenceEncoder,
  GifEncoder,
  FormatConfigs,
  Timecode
} from '@hubble.gl/core';
import type {DeckProps, MapViewState} from '@deck.gl/core';
import {FILTER_VIEW_TYPES} from '@kepler.gl/constants';

import {parseSetCameraType, scaleToVideoExport, getResolutionSetting} from './hubble-utils';
import {GlobeExportVideoPreview} from './globe-export-video-preview';
import SwipeExportSettings from './swipe-export-settings';
import {getGlobeClearColor} from '@kepler.gl/deckgl-layers';

// No-op for the swipe-specific settings callbacks that this single-map globe
// exporter doesn't use (the swipe controls are hidden via `hideSwipe`).
const noop = () => undefined;

const ENCODERS = {
  gif: GifEncoder,
  webm: WebMEncoder,
  jpeg: JPEGSequenceEncoder,
  png: PNGSequenceEncoder
};

export type GlobeExportVideoSettings = {
  mediaType?: string;
  cameraPreset?: string;
  fileName?: string;
  resolution?: string;
  durationMs?: number;
};

type GlobeExportVideoPanelContainerProps = {
  initialState?: Partial<GlobeExportVideoPanelContainerState>;
  glContext?: WebGL2RenderingContext;
  exportVideoWidth: number;
  handleClose: () => void;
  mapData: any;
  header: boolean;
  deckProps?: DeckProps;
  mapProps: Record<string, any>;
  defaultFileName: string;
  animatableFilters: any;
  onTripFrameUpdate: (value: any) => void;
  onFilterFrameUpdate: (filterIdx: number, name: string, value: any) => void;
  getTimeRangeFilterKeyframes: (args: any) => any;
  onSettingsChange: (settings: GlobeExportVideoSettings) => void;
};

type GlobeExportVideoPanelContainerState = {
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
  grid-template-columns: ${props => props.$exportVideoWidth}px 280px;
  grid-template-rows: auto;
  grid-column-gap: 24px;
`;

const TimelineControls = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 16px;
`;

const timelinePlayButtonStyle = {
  cursor: 'pointer',
  height: '32px',
  width: '32px',
  fill: '#FFF'
};

const ButtonGroup = styled.div`
  display: flex;
`;

const StatusText = styled.div`
  font-size: 11px;
  color: ${props => props.theme.subtextColorLT || '#6A7485'};
  text-align: center;
  margin-top: 4px;
`;

const PlayIcon: React.FC<{style?: React.CSSProperties; onClick?: () => void}> = ({
  style,
  onClick
}) => (
  <svg className="data-ex-icons-play" viewBox="0 0 24 24" style={style} onClick={onClick}>
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M19.376 12.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z" />
  </svg>
);

const StopIcon: React.FC<{style?: React.CSSProperties; onClick?: () => void}> = ({
  style,
  onClick
}) => (
  <svg className="data-ex-icons-stop" viewBox="0 0 24 24" style={style} onClick={onClick}>
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M6 5h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
  </svg>
);

/**
 * Video export container for globe mode.
 *
 * hubble's built-in ExportVideoPanelContainer only drives its frame-capture
 * loop from the mapbox base map's 'render' event; in globe mode the base map is
 * disabled so that loop never fires and the export hangs. This container mirrors
 * the swipe-export approach: it owns a requestAnimationFrame capture loop and
 * reads the globe deck canvas directly, so recording works without a base map.
 */
export class GlobeExportVideoPanelContainer extends Component<
  GlobeExportVideoPanelContainerProps,
  GlobeExportVideoPanelContainerState
> {
  previewRef = createRef<GlobeExportVideoPreview>();
  animationFrameId: number | null = null;
  activeEncoder: any | null = null;
  // Reused across all captured frames to avoid allocating a full-resolution
  // canvas per frame (GC pressure/jank during a multi-second export).
  compositeCanvas: HTMLCanvasElement | null = null;

  constructor(props: GlobeExportVideoPanelContainerProps) {
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
      onCameraFrameUpdate: this.setViewState as any,
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
      mapData: {
        visState: {filters}
      },
      animatableFilters
    } = this.props;

    const filterKeyframes = (
      Array.isArray(animatableFilters) && animatableFilters.length
        ? animatableFilters
        : filters.filter(
            (f: any) => f.type === 'timeRange' && f.view === FILTER_VIEW_TYPES.enlarged
          )
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
      mapData: {
        visState: {layers, animationConfig}
      }
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

  /** CSS background color (area the globe doesn't cover), from globe config. */
  getBackgroundColor(): string {
    const bg = this.props.mapData?.mapState?.globe?.config?.backgroundColor;
    const [r, g, b] = getGlobeClearColor(bg);
    return `rgb(${r}, ${g}, ${b})`;
  }

  setStateAndNotify(update: GlobeExportVideoSettings) {
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

  /** Preview playback — animate the camera without encoding. */
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
   * Record — drive our own capture loop (hubble's built-in loop never fires
   * without a base map) and encode the globe deck canvas frame by frame.
   */
  onRenderVideo = () => {
    const {adapter} = this.state;
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
    this.activeEncoder = encoder;
    encoder.start();

    const frameLengthMs = Math.floor(1000 / timecode.framerate);
    let timeMs = timecode.start;
    let retryCount = 0;
    const MAX_RETRIES = 60;

    const captureNextFrame = () => {
      if (!this.state.rendering || this.activeEncoder !== encoder) return;

      adapter!.animationManager.timeline.setTime(timeMs);
      adapter!.animationManager.draw();
      this.setState({currentTimeMs: timeMs});

      // Allow state update → preview re-render → deck redraw before capturing.
      const waitAndCapture = () => {
        requestAnimationFrame(() => {
          if (this.activeEncoder !== encoder) return;
          requestAnimationFrame(() => {
            if (this.activeEncoder !== encoder) return;
            const preview = this.previewRef.current;
            if (!preview) return;

            // Wait for globe base/data layers (tiles included) to finish before
            // the first frame so we don't record a half-loaded planet.
            if (!preview.areLayersLoaded() && retryCount < MAX_RETRIES) {
              retryCount++;
              requestAnimationFrame(waitAndCapture);
              return;
            }
            retryCount = 0;

            const deckCanvas = preview.getCanvas();
            if (!deckCanvas) return;

            // Reuse a single offscreen canvas across frames (resized only when
            // the output dimensions change) instead of allocating one per frame.
            let offscreen = this.compositeCanvas;
            if (!offscreen) {
              offscreen = document.createElement('canvas');
              this.compositeCanvas = offscreen;
            }
            if (offscreen.width !== width || offscreen.height !== height) {
              offscreen.width = width;
              offscreen.height = height;
            }
            const offCtx = offscreen.getContext('2d');
            if (offCtx) {
              // deck's canvas is transparent where the globe isn't drawn
              // (clearColor is disabled to keep picking intact), so fill the
              // configured background first, then composite the deck frame.
              offCtx.fillStyle = this.getBackgroundColor();
              offCtx.fillRect(0, 0, width, height);
              offCtx.drawImage(deckCanvas, 0, 0, width, height);
            }

            encoder.add(offscreen).then(() => {
              if (this.activeEncoder !== encoder) return;
              timeMs += frameLengthMs;
              if (timeMs > timecode.end) {
                this.setState({saving: true});
                encoder.save().then((blob: Blob | null) => {
                  if (this.activeEncoder !== encoder) return;
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
      };

      waitAndCapture();
    };

    // Give the deck a moment to mount/draw before the first capture.
    setTimeout(() => captureNextFrame(), 500);
  };

  onStop = ({abort = false}: {abort?: boolean} = {}) => {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.activeEncoder = null;
    if (!abort) {
      this.setState({
        rendering: false,
        previewing: false,
        currentTimeMs: 0,
        viewState: this.state.memo?.viewState || this.state.viewState
      });
    }
  };

  render() {
    const {exportVideoWidth, mapData, deckProps} = this.props;

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
      <div className="export-video-panel">
        <PanelBody $exportVideoWidth={exportVideoWidth}>
          <GlobeExportVideoPreview
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
            backgroundColor={this.getBackgroundColor()}
          />
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
            swipeStartPct={0}
            swipeEndPct={100}
            swipeEasing={'ease-in-out'}
            disabled={isActive}
            onChangeStartPct={noop}
            onChangeEndPct={noop}
            onChangeEasing={noop}
            hideSwipe
          />
          <TimelineControls className="timeline-controls">
            {isActive ? (
              <StopIcon style={timelinePlayButtonStyle} onClick={() => this.onStop({})} />
            ) : (
              <PlayIcon style={timelinePlayButtonStyle} onClick={this.onPreviewVideo} />
            )}
          </TimelineControls>
          {saving && <StatusText>Saving...</StatusText>}
          {rendering && !saving && (
            <StatusText>Rendering... {Math.round((currentTimeMs / durationMs) * 100)}%</StatusText>
          )}
          <ButtonGroup>
            <Button
              style={{marginTop: '16px', width: '100%', height: '32px'}}
              className="export-video-button"
              onClick={this.onRenderVideo}
              disabled={isActive}
            >
              Render
            </Button>
          </ButtonGroup>
        </PanelBody>
      </div>
    );
  }
}
