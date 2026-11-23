// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, render} from '@testing-library/react';
import {domtoimage, getApplicationConfig, getViewportFromMapState} from '@kepler.gl/utils';
import {getLayerZoomOpacityFactor} from '@kepler.gl/reducers';
import {
  compositeVideoAnnotations,
  VideoAnnotationOverlay,
  VideoAnnotationPreview
} from './video-annotation-overlay';
import type {VideoAnnotationFrame} from './video-annotation-encoder';

jest.mock('@kepler.gl/utils', () => ({
  getLayerOpacityFactor: jest.requireActual('../../../utils/src/layer-visibility')
    .getLayerOpacityFactor,
  domtoimage: {toPng: jest.fn()},
  getApplicationConfig: jest.fn(() => ({escapeXhtmlForWebpack: false})),
  getViewportFromMapState: jest.fn(state => {
    const {WebMercatorViewport, _GlobeViewport} = require('@deck.gl/core');
    return new (state.globe?.enabled ? _GlobeViewport : WebMercatorViewport)(state);
  })
}));
jest.mock('@kepler.gl/reducers', () => ({
  getZoomOpacityAnnotationTargetId: id => `annotation:${id}`,
  getLayerZoomOpacityFactor: jest.fn(() => 1)
}));
jest.mock('@kepler.gl/layers', () => ({formatLineLengthLabel: meters => `${meters} m`}));

const annotation = {
  id: 'label',
  kind: 'TEXT',
  isVisible: true,
  mapIndex: 0,
  label: 'Visible export annotation',
  anchorPoint: [0, 0],
  autoSize: true,
  autoSizeY: true,
  textWidth: 150,
  textHeight: 40,
  lineColor: '#FFFFFF',
  lineWidth: 2
};

function setup(overrides: Record<string, any> = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const frame = {
    annotations: [annotation],
    mapState: {longitude: 0, latitude: 0, zoom: 2, pitch: 0, bearing: 0, zoomOffset: -1},
    width: 320,
    height: 180,
    ...overrides
  } as unknown as VideoAnnotationFrame;
  return {canvas, frame};
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(getLayerZoomOpacityFactor).mockReturnValue(1);
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    drawImage: jest.fn()
  } as any);
  jest.spyOn(window, 'Image').mockImplementation(() => {
    const image = document.createElement('img');
    Object.defineProperty(image, 'src', {
      set: () => queueMicrotask(() => image.onload?.(new Event('load')))
    });
    return image;
  });
  jest.mocked(domtoimage.toPng).mockResolvedValue('data:image/png;base64,annotation');
});
afterEach(() => jest.restoreAllMocks());

test('preview and encoded annotations share elapsed opacity, hold gaps and restore static zoom opacity', async () => {
  const {canvas, frame} = setup({
    annotations: [
      {
        ...annotation,
        kind: 'POINT',
        armLength: 20,
        angle: 0,
        propertyTransitions: {
          opacity: [
            {
              id: 'in',
              startTimeMs: 1000,
              endTimeMs: 3000,
              startValue: 0,
              endValue: 0.6,
              easing: 'linear'
            },
            {
              id: 'dim',
              startTimeMs: 5000,
              endTimeMs: 7000,
              startValue: 0.6,
              endValue: 0.2,
              easing: 'linear'
            }
          ]
        }
      }
    ],
    animationTimeMs: 0
  });
  const savedAnnotation = JSON.parse(JSON.stringify(frame.annotations[0]));
  jest.mocked(getLayerZoomOpacityFactor).mockReturnValue(0.8);
  const view = render(<VideoAnnotationOverlay frame={frame} />);
  expect(view.container).toBeEmptyDOMElement();
  await act(async () => compositeVideoAnnotations(canvas, frame));
  expect(domtoimage.toPng).not.toHaveBeenCalled();
  for (const [time, expected] of [
    [2000, 0.24],
    [4000, 0.48],
    [8000, 0.16],
    [undefined, 0.8]
  ] as const) {
    frame.animationTimeMs = time;
    view.rerender(<VideoAnnotationOverlay frame={frame} />);
    const assertOpacity = (node: HTMLElement) => {
      const parts = node.querySelectorAll<HTMLElement>('[data-annotation-id]');
      expect(parts).toHaveLength(2);
      parts.forEach(part => expect(Number(part.style.opacity)).toBeCloseTo(expected));
    };
    assertOpacity(view.container);
    jest.mocked(domtoimage.toPng).mockImplementation(async node => {
      assertOpacity(node);
      return 'data:image/png;base64,annotation';
    });
    await act(async () => compositeVideoAnnotations(canvas, frame));
  }
  expect(domtoimage.toPng).toHaveBeenCalledTimes(4);
  expect(frame.annotations[0]).toEqual(savedAnnotation);
});

test('rasterizes the existing text and shape renderer at output resolution', async () => {
  const {canvas, frame} = setup({
    annotations: [
      annotation,
      {...annotation, id: 'point', kind: 'POINT', armLength: 20, angle: 0},
      {
        ...annotation,
        id: 'rich-text',
        viewport: {anchor: 'top-left', margin: [24, 24]},
        readout: {type: 'count', dataId: 'points'},
        editorState: {
          root: {
            type: 'root',
            version: 1,
            direction: null,
            format: '',
            indent: 0,
            children: [
              {
                type: 'paragraph',
                version: 1,
                direction: null,
                format: '',
                indent: 0,
                children: [
                  {
                    type: 'text',
                    version: 1,
                    text: 'Bold export annotation',
                    format: 1,
                    detail: 0,
                    mode: 'normal',
                    style: 'color: rgb(255, 0, 0); font-size: 32px'
                  }
                ]
              }
            ]
          }
        }
      },
      {...annotation, id: 'hidden', isVisible: false},
      {...annotation, id: 'other-map', mapIndex: 1}
    ],
    readoutValues: {'rich-text': '123'}
  });
  jest.mocked(domtoimage.toPng).mockImplementation(async node => {
    expect(node.querySelectorAll('[data-annotation-part="text"]')).toHaveLength(3);
    expect(node.querySelector('[data-annotation-id="hidden"]')).toBeNull();
    expect(node.querySelector('[data-annotation-id="other-map"]')).toBeNull();
    expect(node.textContent).toContain(annotation.label);
    expect(node.querySelector('.lexical-text-bold')).toHaveTextContent('Bold export annotation');
    const readout = node.querySelector('[data-annotation-part="readout"] [data-lexical-text]');
    expect(readout).toHaveTextContent('123');
    expect(readout).toHaveStyle({fontSize: '32px', color: 'rgb(255, 0, 0)'});
    expect(node.querySelector('svg')).toBeTruthy();
    expect(node.querySelector('[contenteditable="true"]')).toBeNull();
    return 'data:image/png;base64,annotation';
  });
  await act(async () => compositeVideoAnnotations(canvas, frame));
  expect(domtoimage.toPng).toHaveBeenCalledWith(expect.any(HTMLElement), {
    width: 1280,
    height: 720,
    escapeXhtmlForWebpack: false
  });
  expect(getViewportFromMapState).toHaveBeenCalledWith(
    expect.objectContaining({zoom: 3, width: 640, height: 360})
  );
  expect(canvas.getContext('2d')!.drawImage).toHaveBeenCalledWith(
    expect.any(HTMLImageElement),
    0,
    0
  );
  expect(document.querySelector('[aria-hidden="true"]')).toBeNull();
});

test('clips geographic annotations and viewport captions to the same map panes', async () => {
  const {canvas, frame} = setup({
    annotations: [
      annotation,
      {...annotation, id: 'right', mapIndex: 1},
      {...annotation, id: 'caption-left', viewport: {anchor: 'top-left', margin: [24, 24]}},
      {
        ...annotation,
        id: 'caption-right',
        mapIndex: 1,
        viewport: {anchor: 'top-right', margin: [24, 24]}
      }
    ],
    swipePercentage: 25
  });
  jest.mocked(domtoimage.toPng).mockImplementation(async node => {
    const clips = Array.from((node as HTMLElement).querySelectorAll<HTMLElement>('[style]'))
      .map(element => element.style.clipPath)
      .filter(Boolean);
    expect(clips).toEqual(['inset(0 75% 0 0)', 'inset(0 0 0 25%)']);
    expect(node.querySelectorAll('[data-annotation-part="text"]')).toHaveLength(4);
    for (const [id, clip] of [
      ['caption-left', 'inset(0 75% 0 0)'],
      ['caption-right', 'inset(0 0 0 25%)']
    ]) {
      const caption = (node as HTMLElement).querySelector<HTMLElement>(
        `[data-annotation-id="${id}"]`
      )!;
      let parent = caption.parentElement;
      while (parent && !parent.style.clipPath) parent = parent.parentElement;
      expect(parent?.style.clipPath).toBe(clip);
    }
    return 'data:image/png;base64,annotation';
  });
  await act(async () => compositeVideoAnnotations(canvas, frame));
});

test.each([false, true])(
  'preserves annotation text through SVG serialization with webpack escaping configured as %s',
  async escapeXhtmlForWebpack => {
    jest.mocked(getApplicationConfig).mockReturnValue({
      ...getApplicationConfig(),
      escapeXhtmlForWebpack
    });
    const label = 'Rank #1 — Київ 🌍';
    const {canvas, frame} = setup({annotations: [{...annotation, label}]});
    const {domtoimage: actualDomtoimage} = jest.requireActual('@kepler.gl/utils');
    const getComputedStyle = window.getComputedStyle.bind(window);
    // jsdom cannot compute pseudo-element styles; keep the real text styles.
    jest
      .spyOn(window, 'getComputedStyle')
      .mockImplementation((element, pseudo) =>
        pseudo ? document.createElement('div').style : getComputedStyle(element)
      );
    let serializedSvg = '';
    jest.mocked(domtoimage.toPng).mockImplementation(async (node, options) => {
      const text = node.querySelector('[data-annotation-part="text"]');
      const url = await actualDomtoimage.toSvg(text, options);
      serializedSvg = Buffer.from(url.split(',')[1], 'base64').toString('utf8');
      return 'data:image/png;base64,annotation';
    });
    await act(async () => compositeVideoAnnotations(canvas, frame));
    expect(serializedSvg).toContain(label);
  }
);

test('skips rasterization for annotations hidden by zoom opacity or globe occlusion', async () => {
  const {canvas, frame} = setup();
  jest.mocked(getLayerZoomOpacityFactor).mockReturnValue(0);
  await compositeVideoAnnotations(canvas, frame);
  expect(domtoimage.toPng).not.toHaveBeenCalled();
  jest.mocked(getLayerZoomOpacityFactor).mockReturnValue(1);
  await act(async () =>
    compositeVideoAnnotations(canvas, {
      ...frame,
      mapState: {...frame.mapState, globe: {enabled: true}} as any,
      annotations: [{...annotation, anchorPoint: [180, 0]} as any]
    })
  );
  expect(domtoimage.toPng).not.toHaveBeenCalled();
});

test('unmounts pending annotation DOM immediately when capture is canceled', async () => {
  const {canvas, frame} = setup();
  const abort = new AbortController();
  jest.mocked(domtoimage.toPng).mockImplementation(() => new Promise(() => undefined));
  let pending!: Promise<void>;
  await act(async () => {
    pending = compositeVideoAnnotations(canvas, frame, abort.signal);
    // Attach before aborting to avoid an unhandled rejection in the test.
    pending.catch(() => undefined);
    await Promise.resolve();
  });
  expect(document.querySelector('[data-annotation-id="label"]')).toBeTruthy();
  await act(async () => {
    abort.abort();
    await expect(pending).rejects.toMatchObject({name: 'AbortError'});
  });
  expect(document.querySelector('[data-annotation-id="label"]')).toBeNull();
  expect(document.querySelector('[aria-hidden="true"]')).toBeNull();
  expect(canvas.getContext('2d')!.drawImage).not.toHaveBeenCalled();
});

test('cleans up annotation DOM if rasterization fails', async () => {
  const {canvas, frame} = setup();
  const failure = new Error('image capture failed');
  jest.mocked(domtoimage.toPng).mockRejectedValueOnce(failure);
  await act(async () => {
    await expect(compositeVideoAnnotations(canvas, frame)).rejects.toBe(failure);
  });
  expect(document.querySelector('[data-annotation-id="label"]')).toBeNull();
  expect(document.querySelector('[aria-hidden="true"]')).toBeNull();
  expect(canvas.getContext('2d')!.drawImage).not.toHaveBeenCalled();
});

test('renders live annotations at preview scale and updates camera, swipe and visibility without rasterization', () => {
  const {frame} = setup({
    annotations: [annotation, {...annotation, id: 'right', mapIndex: 1}],
    swipePercentage: 25
  });
  const view = render(<VideoAnnotationOverlay frame={frame} />);
  expect(view.container.textContent).toContain(annotation.label);
  expect(view.container.firstChild).toHaveStyle({
    transform: 'scale(0.5)',
    pointerEvents: 'none',
    zIndex: 2
  });
  expect(
    Array.from(view.container.querySelectorAll<HTMLElement>('div')).map(node => node.style.clipPath)
  ).toContain('inset(0 75% 0 0)');
  view.rerender(
    <VideoAnnotationOverlay
      frame={{...frame, swipePercentage: 75, mapState: {...frame.mapState, longitude: 20}}}
    />
  );
  expect(getViewportFromMapState).toHaveBeenLastCalledWith(
    expect.objectContaining({longitude: 20})
  );
  expect(
    Array.from(view.container.querySelectorAll<HTMLElement>('div')).map(node => node.style.clipPath)
  ).toContain('inset(0 25% 0 0)');
  jest.mocked(getLayerZoomOpacityFactor).mockReturnValue(0);
  view.rerender(<VideoAnnotationOverlay frame={frame} />);
  expect(view.container).toBeEmptyDOMElement();
  jest.mocked(getLayerZoomOpacityFactor).mockReturnValue(1);
  view.rerender(
    <VideoAnnotationOverlay
      frame={{
        ...frame,
        mapState: {...frame.mapState, globe: {enabled: true}} as any,
        annotations: [{...annotation, anchorPoint: [180, 0]} as any]
      }}
    />
  );
  expect(view.container).toBeEmptyDOMElement();
  expect(domtoimage.toPng).not.toHaveBeenCalled();
});

test('mounts regular preview annotations only inside its own map and removes them on close', () => {
  const {frame} = setup();
  const otherMap = document.createElement('div');
  otherMap.id = 'deck-canvas';
  document.body.appendChild(otherMap);
  const view = render(
    <VideoAnnotationPreview frame={frame}>
      <div id="deck-canvas" />
    </VideoAnnotationPreview>
  );
  expect(otherMap).toBeEmptyDOMElement();
  expect(view.container.querySelector('#deck-canvas')).toHaveTextContent(annotation.label);
  view.unmount();
  otherMap.remove();
  expect(document.querySelector('[data-annotation-id="label"]')).toBeNull();
  expect(domtoimage.toPng).not.toHaveBeenCalled();
});

test('applies the Kepler box model only to the offscreen capture subtree', async () => {
  const {canvas, frame} = setup({annotations: [{...annotation, autoSize: false, textWidth: 150}]});
  const hostLabel = document.createElement('div');
  hostLabel.style.boxSizing = 'content-box';
  document.body.appendChild(hostLabel);
  try {
    jest.mocked(domtoimage.toPng).mockImplementation(async node => {
      const label = node.querySelector('[data-annotation-part="text"]') as HTMLElement;
      expect(getComputedStyle(label).boxSizing).toBe('border-box');
      expect(getComputedStyle(label).width).toBe('150px');
      expect(getComputedStyle(label.firstElementChild as HTMLElement).boxSizing).toBe('border-box');
      expect(getComputedStyle(hostLabel).boxSizing).toBe('content-box');
      return 'data:image/png;base64,annotation';
    });
    await act(async () => compositeVideoAnnotations(canvas, frame));
    expect(document.querySelector('[data-video-annotation-capture]')).toBeNull();
  } finally {
    hostLabel.remove();
  }
});

test.each([1280, 1920])(
  'keeps viewport captions inside frame margins during camera pans at %i output width',
  async outputWidth => {
    const {canvas, frame} = setup({
      annotations: [
        {
          ...annotation,
          viewport: {anchor: 'bottom-right', margin: [24, 16]},
          // Even a geographic position behind the globe cannot hide a viewport caption.
          anchorPoint: [180, 0],
          readout: {type: 'time'}
        }
      ],
      mapState: {longitude: 0, latitude: 0, zoom: 2, zoomOffset: -1, globe: {enabled: true}},
      readoutValues: {label: '2026-01-01'}
    });
    canvas.width = outputWidth;
    canvas.height = (outputWidth * 9) / 16;
    const saved = JSON.parse(JSON.stringify(frame.annotations));
    const view = render(<VideoAnnotationOverlay frame={frame} />);
    const assertCaption = (node: HTMLElement, scale: number) => {
      const captions = node.querySelectorAll<HTMLElement>('[data-annotation-part="text"]');
      expect(captions).toHaveLength(1);
      const caption = captions[0];
      expect(caption).toHaveTextContent(annotation.label);
      expect(caption).toHaveTextContent(frame.readoutValues!.label);
      // These logical margins use the same uniformly scaled composition in preview and capture.
      expect(Number.parseFloat(caption.style.right) * scale).toBe(24 * scale);
      expect(Number.parseFloat(caption.style.bottom) * scale).toBe(16 * scale);
      expect(Number.parseFloat(caption.style.maxWidth) * scale).toBe((640 - 48) * scale);
      expect(Number.parseFloat(caption.style.maxHeight) * scale).toBe((360 - 32) * scale);
    };
    assertCaption(view.container, 0.5);
    for (const longitude of [30, 120]) {
      frame.mapState = {...frame.mapState, longitude};
      frame.readoutValues = {label: longitude === 30 ? '2026-01-02' : '2026-01-03'};
      view.rerender(<VideoAnnotationOverlay frame={frame} />);
      assertCaption(view.container, 0.5);
      jest.mocked(domtoimage.toPng).mockImplementation(async node => {
        assertCaption(node, outputWidth / 640);
        expect((node.firstElementChild as HTMLElement).style.transform).toBe(
          `scale(${outputWidth / 640})`
        );
        return 'data:image/png;base64,annotation';
      });
      await act(async () => compositeVideoAnnotations(canvas, frame));
    }
    expect(frame.annotations).toEqual(saved);
    expect(domtoimage.toPng).toHaveBeenCalledTimes(2);
  }
);
