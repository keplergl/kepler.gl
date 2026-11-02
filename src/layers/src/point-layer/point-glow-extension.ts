// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Layer, LayerExtension} from '@deck.gl/core';

export type PointGlowProps = {
  glowExtent?: number;
  glowStrength?: number;
};

const uniformBlock = `\
layout(std140) uniform pointGlowUniforms {
  float extent;
  float strength;
} pointGlow;
`;

const pointGlowUniforms = {
  name: 'pointGlow',
  vs: uniformBlock,
  fs: uniformBlock,
  uniformTypes: {extent: 'f32', strength: 'f32'} as const
};

export function getPointGlowUniforms(props: PointGlowProps) {
  return {
    extent: Number.isFinite(props.glowExtent)
      ? Math.min(5, Math.max(1, props.glowExtent as number))
      : 2,
    strength: Number.isFinite(props.glowStrength)
      ? Math.min(1, Math.max(0, props.glowStrength as number))
      : 0.5
  };
}

/** A static halo drawn behind the ordinary point, including Arrow batch primitives. */
export default class PointGlowExtension extends LayerExtension {
  static extensionName = 'PointGlowExtension';
  static defaultProps = {glowExtent: 2, glowStrength: 0.5};

  getShaders() {
    return {
      modules: [pointGlowUniforms],
      inject: {
        // Expand after ScatterplotLayer applies units, pixel limits and outline width.
        'vs:DECKGL_FILTER_SIZE': 'size *= pointGlow.extent;',
        'fs:DECKGL_FILTER_COLOR': `
          float radius = length(geometry.uv);
          float coreRadius = 1.0 / pointGlow.extent;
          if (radius <= coreRadius || pointGlow.extent <= 1.0 || pointGlow.strength <= 0.0) {
            discard;
          }
          float fade = 1.0 - smoothstep(coreRadius, 1.0, radius);
          color.a *= pointGlow.strength * fade * fade;
        `
      }
    };
  }

  draw(this: Layer<PointGlowProps>) {
    const uniforms = getPointGlowUniforms(this.props);
    for (const model of this.getModels()) {
      model.shaderInputs.setProps({pointGlow: uniforms});
    }
  }
}
