// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {cloneElement} from 'react';
import type {CameraTour} from '@kepler.gl/types';
import {cameraForMap, evaluateCameraTour, getCameraTourDuration} from '@kepler.gl/utils';
import type {CameraKeyframeProps} from '@hubble.gl/core';
import {getFlatExportLayers} from './hubble-utils';

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
      if (this.props.deckProps?.layers) return panel;
      // Hubble's default renderer bypasses Kepler's zoom opacity rules. Supply
      // layers from the current frame, including ordinary camera presets.
      return cloneElement(panel, {
        deckProps: {
          ...this.props.deckProps,
          layers: getFlatExportLayers(this.props.mapData, {
            mapIndex: 0,
            viewState: this.state.viewState,
            beforeId: this.props.mapboxLayerBeforeId
          })
        }
      });
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
