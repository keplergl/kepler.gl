// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck

/**
 * Set standalone (non-UBO) uniforms on a luma.gl 9 Model's pipeline.
 *
 * luma.gl 9 only manages UBO-backed uniforms through shaderInputs. Legacy raster
 * shader modules declare standalone uniforms (e.g. `uniform int uHasCategoricalColors`)
 * that are not part of any uniform block. This helper sets those uniforms via the
 * WebGL2 API using the pipeline's own program handle, avoiding the need to call
 * gl.useProgram() with an externally obtained handle.
 *
 * Must be called during draw(), just before model.draw(). The pipeline's internal
 * gl.useProgram() in its draw() call will use the same program handle, so standalone
 * uniforms we set here persist correctly.
 */
export function setStandaloneUniforms(
  model: any,
  uniforms: Record<string, number | number[]>,
  intUniforms?: Set<string>
): void {
  if (!uniforms || Object.keys(uniforms).length === 0) return;

  const gl: WebGL2RenderingContext | undefined = model.device?.gl;
  const program: WebGLProgram | undefined = model.pipeline?.handle;
  if (!gl || !program) return;

  gl.useProgram(program);

  for (const [name, value] of Object.entries(uniforms)) {
    const loc = gl.getUniformLocation(program, name);
    if (loc === null) continue;

    if (typeof value === 'number') {
      if (intUniforms?.has(name)) {
        gl.uniform1i(loc, value);
      } else {
        gl.uniform1f(loc, value);
      }
    } else if (Array.isArray(value)) {
      switch (value.length) {
        case 2:
          gl.uniform2fv(loc, value);
          break;
        case 3:
          gl.uniform3fv(loc, value);
          break;
        case 4:
          gl.uniform4fv(loc, value);
          break;
        case 16:
          gl.uniformMatrix4fv(loc, false, value);
          break;
        default:
          break;
      }
    }
  }
}

/**
 * Collect the names of `int`-typed uniforms declared in a shader module's source.
 */
export function collectIntUniforms(mod: any): Set<string> {
  const result = new Set<string>();
  const sources = [mod.fs2, mod.fs, mod.vs].filter(Boolean);
  for (const src of sources) {
    const re = /uniform\s+(int|ivec[234]|uint|uvec[234])\s+(\w+)/g;
    let m;
    while ((m = re.exec(src)) !== null) {
      result.add(m[2]);
    }
  }
  return result;
}
