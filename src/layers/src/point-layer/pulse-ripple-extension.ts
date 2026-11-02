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
    ? Math.min(50, Math.max(1, props.pulseExpansion as number))
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

export type EventPulseRippleProps = PulseRippleProps & {
  pulseCurrentTime?: number | null;
  pulseDurationMs?: number;
  getPulseStartTime?: (row: {index: number}) => number[];
};

/** Split milliseconds before uploading to float32 attributes/uniforms. The third
 * component distinguishes a missing timestamp from the valid Unix epoch. */
export function encodePulseTime(time: number | null | undefined): number[] {
  if (!Number.isFinite(time)) return [0, 0, 0];
  const high = Math.fround(time as number);
  return [high, (time as number) - high, 1];
}

export function isPulseTimeActive(time: unknown, start: number, duration: number): boolean {
  return (
    typeof time === 'number' &&
    Number.isFinite(time) &&
    Number.isFinite(start) &&
    Number.isFinite(duration) &&
    duration > 0 &&
    time >= start &&
    time - start < duration
  );
}

const eventUniformBlock = `\
layout(std140) uniform eventPulseUniforms {
  vec3 currentTime;
  float duration;
  float expansion;
  float ripple;
} eventPulse;
`;

const eventPulseUniforms = {
  name: 'eventPulse',
  vs: eventUniformBlock,
  fs: eventUniformBlock,
  uniformTypes: {
    currentTime: 'vec3<f32>',
    duration: 'f32',
    expansion: 'f32',
    ripple: 'f32'
  } as const
};

/** A transient, non-pickable overlay. Only the Kepler playhead advances it. */
export class EventPulseRippleExtension extends LayerExtension {
  static extensionName = 'EventPulseRippleExtension';
  static defaultProps = {
    pulseCurrentTime: null,
    pulseDurationMs: 1000,
    pulseExpansion: 2,
    pulseMode: 'pulse',
    getPulseStartTime: {type: 'accessor', value: [0, 0, 0]}
  };

  initializeState(this: Layer<EventPulseRippleProps>) {
    this.getAttributeManager()?.addInstanced({
      instancePulseStartTime: {size: 3, accessor: 'getPulseStartTime'}
    });
  }

  getShaders() {
    return {
      modules: [eventPulseUniforms],
      inject: {
        'vs:#decl': 'in vec3 instancePulseStartTime; out float pulseOpacity;',
        'fs:#decl': 'in float pulseOpacity;',
        'vs:DECKGL_FILTER_SIZE': `
          float age = (eventPulse.currentTime.x - instancePulseStartTime.x)
            + (eventPulse.currentTime.y - instancePulseStartTime.y);
          bool eventActive = eventPulse.currentTime.z > 0.5 && instancePulseStartTime.z > 0.5
            && eventPulse.duration > 0.0 && age >= 0.0 && age < eventPulse.duration;
          float phase = eventActive ? age / eventPulse.duration : 0.0;
          float breath = (1.0 - cos(phase * 6.28318530718)) / 2.0;
          float growth = eventPulse.ripple > 0.5 ? phase : breath;
          size *= 1.0 + (eventPulse.expansion - 1.0) * growth;
          pulseOpacity = eventActive
            ? (eventPulse.ripple > 0.5 ? pow(1.0 - phase, 2.0) : breath) : 0.0;
        `,
        'fs:DECKGL_FILTER_COLOR': `
          if (pulseOpacity <= 0.0) discard;
          if (eventPulse.ripple > 0.5) {
            float radius = length(geometry.uv);
            float edge = max(fwidth(radius), 0.001);
            float ring = smoothstep(0.88 - edge, 0.88 + edge, radius);
            if (ring <= 0.0) discard;
            color.a *= ring;
          }
          color.a *= pulseOpacity;
        `
      }
    };
  }

  draw(this: Layer<EventPulseRippleProps>) {
    const {pulseCurrentTime, pulseDurationMs, pulseExpansion, pulseMode} = this.props;
    const uniforms = {
      currentTime: encodePulseTime(pulseCurrentTime),
      duration:
        Number.isFinite(pulseDurationMs) && (pulseDurationMs as number) > 0
          ? (pulseDurationMs as number)
          : 0,
      expansion: Number.isFinite(pulseExpansion)
        ? Math.min(50, Math.max(1, pulseExpansion as number))
        : 2,
      ripple: pulseMode === 'ripple' ? 1 : 0
    };
    for (const model of this.getModels()) {
      model.shaderInputs.setProps({eventPulse: uniforms});
    }
  }
}
