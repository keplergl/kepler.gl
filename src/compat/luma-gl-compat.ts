// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Compatibility shim for luma.gl 9.x
 *
 * In luma.gl 9.x, Geometry was moved from @luma.gl/core to @luma.gl/engine
 * This shim re-exports everything from @luma.gl/core AND Geometry from @luma.gl/engine
 * to maintain compatibility with packages like @nebula.gl/layers that expect Geometry in @luma.gl/core
 */

// Re-export everything from @luma.gl/core
export * from '@luma.gl/core';

// Re-export Geometry from @luma.gl/engine (it was moved there in 9.x)
export {Geometry} from '@luma.gl/engine';
