// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useLayoutEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {createPortal, flushSync} from 'react-dom';
import {domtoimage, getViewportFromMapState, getApplicationConfig} from '@kepler.gl/utils';
import {getLayerZoomOpacityFactor, getZoomOpacityAnnotationTargetId} from '@kepler.gl/reducers';
import {fontFamily} from '@kepler.gl/styles';
import AnnotationOverlay from '../annotations/annotation-overlay';
import {isAnnotationVisibleOnGlobe, MapViewport} from '../annotations/annotation-utils';
import type {VideoAnnotationFrame} from './video-annotation-encoder';

const noop = () => undefined;

function abortable<T>(promise: Promise<T>, signal?: AbortSignal): Promise<T> {
  if (!signal) return promise;
  return new Promise<T>((resolve, reject) => {
    const abort = () => reject(new DOMException('Video export stopped', 'AbortError'));
    if (signal.aborted) {
      abort();
      return;
    }
    signal.addEventListener('abort', abort, {once: true});
    promise.then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
  });
}

/** Shared DOM/SVG renderer: preview never rasterizes; encoders capture it separately. */
export function VideoAnnotationOverlay({
  frame,
  outputWidth = frame.width
}: {
  frame: VideoAnnotationFrame;
  outputWidth?: number;
}) {
  if (!frame.annotations.some(annotation => annotation.isVisible)) return null;
  const {mapState, width, height, interactionConfig, swipePercentage} = frame;
  const isGlobeEnabled = Boolean(mapState.globe?.enabled);
  const displayScale = 2 ** (mapState.zoomOffset || 0);
  const projectedViewport = getViewportFromMapState({
    ...mapState,
    zoom: mapState.zoom - (mapState.zoomOffset || 0),
    width: width / displayScale,
    height: height / displayScale
  }) as unknown as Pick<MapViewport, 'project' | 'unproject'>;
  const viewport = {
    project: (position: ReadonlyArray<number>) => projectedViewport.project(position),
    unproject: (position: ReadonlyArray<number>) => projectedViewport.unproject(position),
    longitude: mapState.longitude,
    latitude: mapState.latitude,
    width: width / displayScale,
    height: height / displayScale,
    zoom: mapState.zoom - (mapState.zoomOffset || 0)
  };
  const opacity = (id: string) =>
    getLayerZoomOpacityFactor(
      getZoomOpacityAnnotationTargetId(id),
      mapState.zoom,
      interactionConfig
    );
  const annotations = frame.annotations.filter(
    annotation =>
      annotation.isVisible &&
      opacity(annotation.id) > 0 &&
      ((annotation.mapIndex ?? 0) === 0 ||
        (swipePercentage !== undefined && annotation.mapIndex === 1)) &&
      (!isGlobeEnabled || isAnnotationVisibleOnGlobe(annotation, viewport))
  );
  if (!annotations.length) return null;

  const scale = (outputWidth / width) * displayScale;
  const split = Math.max(0, Math.min(100, swipePercentage ?? 100));
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 2,
        overflow: 'hidden',
        fontFamily,
        fontSize: '14px',
        width: viewport.width,
        height: viewport.height,
        transform: `scale(${scale})`,
        transformOrigin: 'top left'
      }}
    >
      {(swipePercentage === undefined ? [0] : [0, 1]).map(mapIndex => (
        <div
          key={mapIndex}
          style={{
            position: 'absolute',
            inset: 0,
            clipPath:
              swipePercentage === undefined
                ? undefined
                : mapIndex === 0
                ? `inset(0 ${100 - split}% 0 0)`
                : `inset(0 0 0 ${split}%)`
          }}
        >
          <AnnotationOverlay
            annotations={annotations}
            getAnnotationOpacity={opacity}
            selectedAnnotationId={null}
            isEditingAnnotationText={false}
            isAnnotationMode={false}
            mapIndex={mapIndex}
            viewport={viewport}
            isGlobeEnabled={isGlobeEnabled}
            updateAnnotation={noop}
            setSelectedAnnotation={noop}
          />
        </div>
      ))}
    </div>
  );
}

/** Hubble owns the regular preview DOM, so scope the portal to this panel only. */
export function VideoAnnotationPreview({
  frame,
  children
}: {
  frame: VideoAnnotationFrame;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  useLayoutEffect(() => {
    setTarget(panelRef.current?.querySelector<HTMLElement>('#deck-canvas') || null);
  }, []);
  return (
    <div ref={panelRef}>
      {children}
      {target && createPortal(<VideoAnnotationOverlay frame={frame} />, target)}
    </div>
  );
}

/** Experimental DOM capture preserves the existing rich text and SVG annotation renderer. */
export async function compositeVideoAnnotations(
  canvas: HTMLCanvasElement,
  frame: VideoAnnotationFrame,
  signal?: AbortSignal
): Promise<void> {
  const mount = document.createElement('div');
  mount.style.cssText = 'position:fixed;left:-100000px;top:0;pointer-events:none;';
  mount.setAttribute('aria-hidden', 'true');
  const rasterNode = document.createElement('div');
  Object.assign(rasterNode.style, {
    position: 'relative',
    width: `${canvas.width}px`,
    height: `${canvas.height}px`,
    overflow: 'hidden',
    fontFamily,
    fontSize: '14px'
  });
  mount.appendChild(rasterNode);
  document.body.appendChild(mount);
  const root = createRoot(rasterNode);
  let image: HTMLImageElement | null = null;
  try {
    flushSync(() => {
      root.render(<VideoAnnotationOverlay frame={frame} outputWidth={canvas.width} />);
    });
    if (!rasterNode.hasChildNodes()) return;
    await abortable(Promise.resolve(document.fonts?.ready), signal);
    const url = await abortable(
      domtoimage.toPng(rasterNode, {
        width: canvas.width,
        height: canvas.height,
        escapeXhtmlForWebpack: getApplicationConfig().escapeXhtmlForWebpack
      }),
      signal
    );
    const loadedImage = new Image();
    image = loadedImage;
    await abortable(
      new Promise<void>((resolve, reject) => {
        loadedImage.onload = () => resolve();
        loadedImage.onerror = () => reject(new Error('Could not rasterize video annotations'));
        loadedImage.src = url;
      }),
      signal
    );
    canvas.getContext('2d')!.drawImage(image, 0, 0);
  } finally {
    if (image) {
      image.onload = null;
      image.onerror = null;
    }
    root.unmount();
    mount.remove();
  }
}
