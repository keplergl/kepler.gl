// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ShaderModule} from './webgl/types';

/**
 * Test if two lists of modules are equal
 *
 * @param modules     Modules list
 * @param oldModules  Modules list
 *
 * @return true if both lists are equal
 */
export function modulesEqual(modules: ShaderModule[], oldModules: ShaderModule[]): boolean {
  if (modules.length !== oldModules.length) {
    return false;
  }

  for (let i = 0; i < modules.length; i++) {
    if (modules[i].name !== oldModules[i].name) {
      return false;
    }
  }

  return true;
}

function isUniformValue(value: unknown): boolean {
  return (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    ArrayBuffer.isView(value) ||
    Array.isArray(value)
  );
}

/**
 * Apply module uniforms/bindings to shaderInputs, calling each module's
 * getUniforms exactly once and writing the result directly — avoiding the
 * double-getUniforms bug where shaderInputs.setProps() would re-invoke
 * getUniforms on already-transformed values.
 */
export function applyModuleUniforms(
  shaderInputs: {
    moduleUniforms: Record<string, Record<string, unknown>>;
    moduleBindings: Record<string, Record<string, unknown>>;
    setProps?: (props: any) => void;
  },
  modules: ShaderModule[],
  allModuleProps: Record<string, unknown>
): void {
  for (const mod of modules) {
    if (mod.getUniforms) {
      const result = mod.getUniforms(allModuleProps as object);
      if (result) {
        const uniforms: Record<string, unknown> = {};
        const bindings: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(result)) {
          if (isUniformValue(value)) {
            uniforms[key] = value;
          } else {
            bindings[key] = value;
          }
        }
        try {
          if (!shaderInputs.moduleUniforms[mod.name]) {
            shaderInputs.moduleUniforms[mod.name] = {};
          }
          if (!shaderInputs.moduleBindings[mod.name]) {
            shaderInputs.moduleBindings[mod.name] = {};
          }
          Object.assign(shaderInputs.moduleUniforms[mod.name], uniforms);
          Object.assign(shaderInputs.moduleBindings[mod.name], bindings);
        } catch {
          // Fallback: use the public setProps API if direct mutation is blocked
          shaderInputs.setProps?.({[mod.name]: result});
        }
      }
    }
  }
}
