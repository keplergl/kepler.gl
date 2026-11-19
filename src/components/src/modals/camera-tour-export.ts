// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {cloneElement, createElement} from 'react';
import {VideoAnnotationPreview} from './video-annotation-overlay';
import type {CameraTour} from '@kepler.gl/types';
import {cameraForMap, evaluateCameraTour, getCameraTourDuration} from '@kepler.gl/utils';
import type {CameraKeyframeProps} from '@hubble.gl/core';
import {getFlatExportLayers} from './hubble-utils';
import {createAnnotationVideoEncoder} from './video-annotation-encoder';

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

/** Keep Hubble's encoder/capture implementation and its ordinary presets intact. */
export function withCameraTourExport(Base: any) {
  return class CameraTourExportContainer extends Base {
    render() {
      const panel = super.render();

      // Hubble's default renderer bypasses Kepler's zoom opacity rules. Supply
      // layers from the current frame, including ordinary camera presets.
      const preview = this.props.deckProps?.layers
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
      if (!this.props.mapData.visState.annotations?.length) return preview;
      return createElement(VideoAnnotationPreview, {
        frame: {
          annotations: this.props.mapData.visState.annotations,
          interactionConfig: this.props.mapData.visState.interactionConfig,
          mapState: {...this.props.mapData.mapState, ...this.state.viewState},
          ...this._getContainer()
        },
        children: preview
      });
    }

    onRenderVideo() {
      // A stopped asynchronous capture must not clear the next recording's
      // in-flight flag when its rasterization/encoding promise settles.
      const adapter = this.state.adapter;
      adapter.videoCapture = new adapter.videoCapture.constructor();
      super.onRenderVideo();
    }

    onPreviewVideo() {
      const adapter = this.state.adapter;
      adapter.videoCapture = new adapter.videoCapture.constructor();
      super.onPreviewVideo();
    }

    onStop(options: {abort?: boolean}) {
      const encoder = this.state.adapter.videoCapture.encoder;
      // A normal Hubble Stop saves completed frames. Abort only the pending
      // annotation rasterization in that case, keeping encoder output intact.
      if (options.abort) encoder?.cancel?.();
      else encoder?.cancelAnnotationCapture?.();
      super.onStop(options);
    }

    getEncoder() {
      return createAnnotationVideoEncoder(
        super.getEncoder(),
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
