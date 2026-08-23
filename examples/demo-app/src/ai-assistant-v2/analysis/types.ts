// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Shared types for the analysis engine (ported from the kepler-mcp service so
 * the same component is buildable in the demo-app).
 */

export interface AnalysisResult {
  success: boolean;
  data?: unknown;
  error?: string;
}
