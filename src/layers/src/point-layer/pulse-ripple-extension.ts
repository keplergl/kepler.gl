// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Layer, LayerExtension} from '@deck.gl/core';

export type PulseRippleProps = {
  pulseEnabled?: boolean;
  pulseMode?: 'pulse' | 'ripple';
  pulseSpeed?: number;
  pulseExpansion?: number;
};

const uniformBlock = `\
layout(std140) uniform pulseRippleUniforms {
  float radiusScale;
  float opacity;
  float ripple;
} pulseRipple;
`;

const pulseRippleUniforms = {
  name: 'pulseRipple',
  vs: uniformBlock,
  fs: uniformBlock,
  uniformTypes: {
    radiusScale: 'f32',
    opacity: 'f32',
    ripple: 'f32'
  } as const
};

/** One shared clock keeps animation out of Redux and avoids per-point CPU updates. */
export function getPulseRippleUniforms(props: PulseRippleProps, timeMs: number) {
  if (!props.pulseEnabled) {
    return {radiusScale: 1, opacity: 1, ripple: 0};
  }
  const speed = Number.isFinite(props.pulseSpeed)
    ? Math.min(3, Math.max(0.1, props.pulseSpeed as number))
    : 1;
  const expansion = Number.isFinite(props.pulseExpansion)
    ? Math.min(5, Math.max(1, props.pulseExpansion as number))
    : 2;
  const phase = Number.isFinite(timeMs) ? ((Math.max(0, timeMs) / 1000) * speed) % 1 : 0;
  if (props.pulseMode === 'ripple') {
    return {
      radiusScale: 1 + (expansion - 1) * phase,
      opacity: (1 - phase) ** 2,
      ripple: 1
    };
  }
  const breath = (1 - Math.cos(phase * Math.PI * 2)) / 2;
  return {radiusScale: 1 + (expansion - 1) * breath, opacity: 1 - 0.6 * breath, ripple: 0};
}

/** Applied only to point circles, including the primitive circles in Arrow batches. */
export default class PulseRippleExtension extends LayerExtension {
  static extensionName = 'PulseRippleExtension';
  static defaultProps = {
    pulseEnabled: false,
    pulseMode: 'pulse',
    pulseSpeed: 1,
    pulseExpansion: 2
  };

  getShaders() {
    return {
      modules: [pulseRippleUniforms],
      inject: {
        'vs:DECKGL_FILTER_SIZE': 'size *= pulseRipple.radiusScale;',
        'fs:DECKGL_FILTER_COLOR': `
          if (pulseRipple.ripple > 0.5) {
            float radius = length(geometry.uv);
            float edge = max(fwidth(radius), 0.001);
            float ring = smoothstep(0.88 - edge, 0.88 + edge, radius);
            if (ring <= 0.0) {
              discard;
            }
            color.a *= ring;
          }
          color.a *= pulseRipple.opacity;
        `
      }
    };
  }

  draw(this: Layer<PulseRippleProps>) {
    const models = this.getModels();
    const uniforms = getPulseRippleUniforms(this.props, performance.now());
    for (const model of models) {
      model.shaderInputs.setProps({pulseRipple: uniforms});
    }
    if (this.props.pulseEnabled && this.props.visible && models.length && this.getNumInstances()) {
      // Use deck.gl's redraw loop; requesting a kepler map update would interrupt pan/zoom.
      this.setNeedsRedraw();
    }
  }
}
