// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {cloneElement, createElement, Fragment} from 'react';
import type {CameraTour} from '@kepler.gl/types';
import {cameraForMap, evaluateCameraTour, getCameraTourDuration} from '@kepler.gl/utils';
import type {CameraKeyframeProps} from '@hubble.gl/core';
import {getFlatExportLayers, getResolutionSetting} from './hubble-utils';
import {createAnnotationVideoEncoder} from './video-annotation-encoder';
import {VideoAnnotationPreview} from './video-annotation-overlay';
import {createNativeWebMEncoder, NativeWebMEncoder} from './native-webm-encoder';
import {
  NATIVE_WEBM_FORMAT,
  NATIVE_WEBM_FALLBACK,
  VIDEO_ENCODING_ERROR
} from './video-export-formats';
import {StyledModalInputFootnote} from '../common/styled-components';

export const CAMERA_TOUR_PRESET = 'Camera Animation';

/** Drive the authored evaluator with Hubble's linear export clock, rather than
 * approximating holds, cuts and shortest rotations with fly-to keyframes. */
export function getCameraTourExportKeyframes(
  tour: CameraTour | null | undefined,
  preset: string,
  durationMs: number,
  size: {width: number; height: number}
): CameraKeyframeProps | null {
  const tourDuration = getCameraTourDuration(tour);
  if (preset !== CAMERA_TOUR_PRESET || tourDuration <= 0 || durationMs <= 0) return null;
  return {
    ...size,
    timings: [0, durationMs],
    keyframes: [{cameraTourTime: 0}, {cameraTourTime: tourDuration}]
  } as unknown as CameraKeyframeProps;
}

export function resolveCameraTourExportFrame<T extends object>(
  frame: T,
  tour: CameraTour | null | undefined,
  current: object = {},
  globe = false,
  zoomOffset = 0
): T {
  const time = (frame as {cameraTourTime?: number}).cameraTourTime;
  if (time === undefined) return frame;
  const camera = evaluateCameraTour(tour, time);
  if (!camera) return {...current} as T;
  // Globe bounds apply to the authored zoom, before fitting the smaller export
  // preview. Clamping the scaled zoom directly would enlarge the globe again.
  const adapted = cameraForMap({...camera, zoom: camera.zoom - zoomOffset}, globe);
  return {...current, ...adapted, zoom: adapted.zoom + zoomOffset} as T;
}

/** Reuse Hubble's export UI and presets, with opt-in native video encoding. */
export function withCameraTourExport(Base: any) {
  return class CameraTourExportContainer extends Base {
    private finishNativeRecording?: (blob: Blob | null) => void;

    componentDidMount() {
      super.componentDidMount?.();
      const {adapter} = this.state;
      if (!adapter) return;

      let requestedFrame = 0;
      let committedFrame = -1;
      let refreshingDeck = false;
      const seek = adapter.seek.bind(adapter);
      const onAfterRender = adapter.onAfterRender.bind(adapter);

      adapter.seek = (options: {timeMs: number}) => {
        const frame = ++requestedFrame;
        const capture = adapter.videoCapture;
        // Hubble unlocks capture before seeking. React may defer the camera
        // update, so map render events must not capture the previous view.
        committedFrame = -1;
        seek(options);
        // This callback runs after the camera/layer props reach the preview.
        // Request a commit even for holds and filter-only animation frames.
        this.setState({}, () => {
          if (
            requestedFrame !== frame ||
            adapter.videoCapture !== capture ||
            !capture.isRecording()
          )
            return;
          committedFrame = frame;
          adapter.deck?.redraw('video capture frame committed');
        });
      };
      adapter.onAfterRender = (nextFrame: (timeMs: number) => void, readyToCapture = true) => {
        if (!adapter.deck) {
          // Hubble reads deckRef before its overlay publishes the asynchronously
          // created renderer. Commit the ref, then let the preview pass it to
          // the adapter. A later map render also recovers recording started
          // before the map loaded; no timer or skipped readiness check is needed.
          if (!refreshingDeck) {
            refreshingDeck = true;
            this.forceUpdate(() => {
              this.forceUpdate(() => {
                refreshingDeck = false;
                adapter.deck?.redraw('video capture renderer ready');
              });
            });
          }
          return;
        }
        // Keep Hubble's tile/layer readiness checks, and only accept a render
        // after the requested frame has committed. Encoding remains serialized.
        onAfterRender(nextFrame, readyToCapture && committedFrame === requestedFrame);
      };
    }

    private resetVideoCapture() {
      const {adapter} = this.state;
      const capture = new adapter.videoCapture.constructor();
      let frameIndex = 0;
      // Hubble floors 1000 / fps and accumulates that error on every frame.
      // Derive each timestamp from its index, preserving its inclusive endpoint.
      capture._getNextTimeMs = () =>
        capture.timecode.start + (++frameIndex * 1000) / capture.timecode.framerate;
      adapter.videoCapture = capture;
      return capture;
    }

    getCanvasSize() {
      // Hubble's built-in lookup does not include Kepler's higher resolutions.
      const {width, height} = getResolutionSetting(this.state.resolution);
      return {width, height};
    }

    getBaseEncoder() {
      if (this.state.mediaType !== NATIVE_WEBM_FORMAT.value) return super.getEncoder();
      const capture = this.state.adapter.videoCapture;
      return createNativeWebMEncoder({
        onFallback: () => {
          if (this.state.adapter.videoCapture === capture) {
            this.setState({encodingNotice: NATIVE_WEBM_FALLBACK});
          }
        },
        onError: () => {
          if (this.state.adapter.videoCapture !== capture) return;
          this.onStop({abort: true});
          this.setState({
            encodingError: VIDEO_ENCODING_ERROR,
            rendering: false,
            saving: false,
            viewState: this.state.memo?.viewState || this.state.viewState
          });
        }
      });
    }

    getEncoder() {
      return createAnnotationVideoEncoder(
        this.getBaseEncoder(),
        () => ({
          annotations: this.props.mapData.visState.annotations || [],
          interactionConfig: this.props.mapData.visState.interactionConfig,
          mapState: {...this.props.mapData.mapState, ...this.state.viewState},
          ...this._getContainer()
        }),
        encoder => {
          const capture = this.state.adapter.videoCapture;
          return capture.isRecording() && capture.encoder === encoder;
        },
        error => {
          console.error('Video annotation capture failed:', error);
          this.onStop({abort: true});
        }
      );
    }

    onRenderVideo() {
      const adapter = this.state.adapter;
      if (this.state.encodingError || this.state.encodingNotice) {
        this.setState({encodingError: undefined, encodingNotice: undefined});
      }
      if (this.state.mediaType !== NATIVE_WEBM_FORMAT.value) {
        this.resetVideoCapture();
        return super.onRenderVideo();
      }
      if (this.state.rendering || this.state.saving) return;
      // Late completion of a cancelled add() must not advance a new recording.
      adapter.videoCapture.encoder?.cancel?.();
      const capture = this.resetVideoCapture();
      this.setState({
        encodingError: undefined,
        encodingNotice: undefined,
        rendering: true,
        saving: false,
        memo: {viewState: {...this.state.viewState}}
      });
      adapter.animationManager.setKeyframes('kepler', {
        ...this.getFilterKeyframes(),
        ...this.getTripKeyframes(),
        cameraKeyframe: this.getCameraKeyframes()
      });
      const finishNativeRecording = (blob: Blob | null) => {
        if (
          adapter.videoCapture !== capture ||
          this.finishNativeRecording !== finishNativeRecording
        )
          return;
        capture.download(blob);
        this.finishNativeRecording = undefined;
        this.setState({
          rendering: false,
          saving: false,
          viewState: {...this.state.memo.viewState}
        });
      };
      this.finishNativeRecording = finishNativeRecording;
      adapter.render({
        Encoder: this.getEncoder(),
        formatConfigs: this.getFormatConfigs(),
        timecode: this.getTimecode(),
        filename: this.getFileName(),
        onStopped: () => this.setState({saving: true}),
        // Hubble invokes onComplete before async save finishes. Complete this
        // experiment only when the encoded file has actually been finalized.
        onSave: this.finishNativeRecording
      });
    }

    onPreviewVideo() {
      this.resetVideoCapture();
      super.onPreviewVideo();
    }

    onStop(options: {abort?: boolean} = {}) {
      const adapter = this.state.adapter;
      const encoder = adapter.videoCapture.encoder;
      if (!options.abort) encoder?.cancelAnnotationCapture?.();
      if (options.abort) {
        encoder?.cancel?.();
        this.finishNativeRecording = undefined;
      } else if (encoder instanceof NativeWebMEncoder && this.finishNativeRecording) {
        adapter.stop({
          onStopped: () => this.setState({saving: true}),
          onSave: this.finishNativeRecording
        });
        return;
      }
      super.onStop(options);
    }

    render() {
      const panel = super.render();
      // Hubble's default renderer bypasses Kepler's zoom opacity rules. Supply
      // layers from the current frame, including ordinary camera presets.
      let preview = this.props.deckProps?.layers
        ? panel
        : cloneElement(panel, {
            deckProps: {
              ...this.props.deckProps,
              layers: getFlatExportLayers(this.props.mapData, {
                mapIndex: 0,
                viewState: this.state.viewState,
                beforeId: this.props.mapboxLayerBeforeId
              })
            }
          });
      if (this.props.mapData.visState.annotations?.length) {
        preview = createElement(VideoAnnotationPreview, {
          frame: {
            annotations: this.props.mapData.visState.annotations,
            interactionConfig: this.props.mapData.visState.interactionConfig,
            mapState: {...this.props.mapData.mapState, ...this.state.viewState},
            ...this._getContainer()
          },
          children: preview
        });
      }
      const message = this.state.encodingError || this.state.encodingNotice;
      return message
        ? createElement(
            Fragment,
            null,
            preview,
            createElement(
              StyledModalInputFootnote,
              {
                error: Boolean(this.state.encodingError),
                role: this.state.encodingError ? 'alert' : 'status'
              },
              message
            )
          )
        : preview;
    }

    getCameraKeyframes() {
      return (
        getCameraTourExportKeyframes(
          this.props.mapData.visState.cameraTour,
          this.state.cameraPreset,
          this.state.durationMs,
          this.getCanvasSize()
        ) || super.getCameraKeyframes()
      );
    }

    setCameraPreset(cameraPreset: string) {
      const duration = getCameraTourDuration(this.props.mapData.visState.cameraTour);
      this.setStateAndNotify({
        cameraPreset,
        ...(cameraPreset === CAMERA_TOUR_PRESET && duration > 0 ? {durationMs: duration} : {})
      });
    }

    setViewState(viewState: object) {
      super.setViewState(
        resolveCameraTourExportFrame(
          viewState,
          this.props.mapData.visState.cameraTour,
          this.state.viewState
        )
      );
    }
  };
}
