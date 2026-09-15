// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Video export (hubble) mutates window.devicePixelRatio so MapLibre/deck draw
 * at the output resolution into a small CSS preview. CollisionFilterEffect
 * still sizes its FBO from luma's CSS pixel size and projects with
 * window.devicePixelRatio, so the collision pass only fills the top-left of
 * the texture and every other label is culled.
 *
 * Same class of mismatch as alignExportShadowPass: size the collision map
 * from the live GL buffer and project with drawingBuffer / viewport CSS.
 */

/**
 * Append binary fade snapping to the collision shader *module* inject.
 *
 * Do not put an `{order, injection}` object on the extension's own `inject` map.
 * deck.gl mergeShaders concatenates injects with `+`, so an object becomes
 * `[object Object]` in GLSL (`'[' : syntax error`) when another layer (globe
 * back-face cull) already injected a string at the same hook.
 */
export function snapCollisionModuleFade(shaders: {modules?: any[]; inject?: any} = {}): {
  modules?: any[];
  inject?: any;
} {
  const positionHook = 'vs:DECKGL_FILTER_GL_POSITION';
  const modules = (shaders.modules || []).map((module: any) => {
    if (module?.name !== 'collision') {
      return module;
    }
    const baseInject = module.inject?.[positionHook];
    const baseInjectCode =
      typeof baseInject === 'string' ? baseInject : baseInject?.injection || '';
    return {
      ...module,
      inject: {
        ...module.inject,
        [positionHook]: `${baseInjectCode}
  if (collision.enabled) {
    if (collision_fade < 0.5) {
      collision_fade = 0.0;
      position = vec4(0.0, 0.0, 2.0, 1.0);
    } else {
      collision_fade = 1.0;
    }
  }`
      }
    };
  });
  return {...shaders, modules};
}

type CollisionFilterEffectLike = {
  id?: string;
  preRender?: (opts: unknown) => void;
  lastViewport?: unknown;
  context?: {device?: CanvasDevice};
  collisionFilterPass?: {device?: CanvasDevice};
};

type CanvasDevice = {
  gl?: {
    drawingBufferWidth?: number;
    drawingBufferHeight?: number;
  };
  canvasContext?: {
    getPixelSize?: () => [number, number];
    getDevicePixelRatio?: () => number;
    getDrawingBufferSize?: () => [number, number];
    cssToDeviceRatio?: () => number;
  };
};

type DeckLike = {
  __keplerCollisionFilterAligned?: boolean;
  _addDefaultEffect?: (effect: CollisionFilterEffectLike) => void;
};

function getCanvasDevice(effect: CollisionFilterEffectLike): CanvasDevice | undefined {
  return effect.context?.device || effect.collisionFilterPass?.device;
}

/**
 * Wrap CollisionFilterEffect.preRender so the collision FBO matches the color
 * pass during high-DPI / video-export canvas scaling.
 */
export function alignCollisionFilterEffect(effect: CollisionFilterEffectLike): void {
  const preRender = effect.preRender?.bind(effect);
  if (!preRender) {
    return;
  }

  let lastBufferKey = '';

  effect.preRender = function alignedCollisionPreRender(
    this: CollisionFilterEffectLike,
    opts: any
  ) {
    const device = getCanvasDevice(this);
    const canvasContext = device?.canvasContext;
    if (!canvasContext) {
      return preRender(opts);
    }

    const gl = device?.gl;
    const drawingBuffer = canvasContext.getDrawingBufferSize?.();
    const width = gl?.drawingBufferWidth || drawingBuffer?.[0];
    const height = gl?.drawingBufferHeight || drawingBuffer?.[1];
    const viewportWidth = opts?.viewports?.[0]?.width;

    const prevGetPixelSize = canvasContext.getPixelSize;
    const prevGetDevicePixelRatio = canvasContext.getDevicePixelRatio;

    if (width && height) {
      canvasContext.getPixelSize = () => [width, height];
      canvasContext.getDevicePixelRatio = () =>
        viewportWidth ? width / viewportWidth : canvasContext.cssToDeviceRatio?.() ?? 1;
    } else {
      canvasContext.getPixelSize = () => canvasContext.getDrawingBufferSize?.() ?? [1, 1];
      canvasContext.getDevicePixelRatio = () => canvasContext.cssToDeviceRatio?.() ?? 1;
    }

    const bufferKey = `${width || 0}x${height || 0}`;
    if (bufferKey !== lastBufferKey) {
      lastBufferKey = bufferKey;
      // CollisionFilterEffect skips redraw when only the FBO size changes
      // (visgl/deck.gl#10333). Force a new collision pass after resize.
      this.lastViewport = undefined;
    }

    try {
      return preRender(opts);
    } finally {
      canvasContext.getPixelSize = prevGetPixelSize;
      canvasContext.getDevicePixelRatio = prevGetDevicePixelRatio;
    }
  };
}

/**
 * CollisionFilterExtension adds CollisionFilterEffect via Deck._addDefaultEffect.
 * Wrap that once per Deck so the instance is aligned before setup().
 */
export function installCollisionFilterEffectAlignment(deck?: DeckLike | null): void {
  if (
    !deck ||
    deck.__keplerCollisionFilterAligned ||
    typeof deck._addDefaultEffect !== 'function'
  ) {
    return;
  }

  deck.__keplerCollisionFilterAligned = true;
  const addDefaultEffect = deck._addDefaultEffect.bind(deck);
  deck._addDefaultEffect = (effect: CollisionFilterEffectLike) => {
    if (effect?.id === 'collision-filter-effect') {
      alignCollisionFilterEffect(effect);
    }
    return addDefaultEffect(effect);
  };
}
