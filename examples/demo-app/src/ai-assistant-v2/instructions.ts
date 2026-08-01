import type {StoreApi} from 'zustand';
import type {DuckDbSliceState} from '@sqlrooms/duckdb';
import {getKeplerVisState} from './store';
import {getDatasetContext} from './tools/utils';

/**
 * Generate the system instructions for the kepler.gl AI assistant.
 * Includes DuckDB syntax rules, tool usage guidelines, spatial analysis workflows,
 * and the currently loaded kepler.gl datasets/layers (name, fields, geometry).
 *
 * The dataset context is read live from the kepler.gl Redux `visState` on every
 * call (getInstructions runs fresh per chat request), matching the original
 * assistant behavior, so the schema always reflects the datasets currently on
 * the map. We intentionally do NOT read `store.getState().db.tables` here: the
 * tools use a standalone DuckDB connector separate from the store's DuckDB
 * slice, so that cache is never populated.
 */
export function createKeplerAiInstructions(
  _store: StoreApi<DuckDbSliceState & Record<string, unknown>>
): string {
  const visState = getKeplerVisState();
  const datasetContext = getDatasetContext(visState?.datasets, visState?.layers);

  return datasetContext ? `${INSTRUCTIONS}\n\n${datasetContext}` : INSTRUCTIONS;
}

const INSTRUCTIONS = `You are a Kepler.gl AI Assistant. You are a helpful assistant that can help users with their spatial analysis tasks.
Please act like an instructor and explain your reasoning in a concise and clear manner:
- Explain the terms in the user's question in a way that is easy to understand
- Explain the steps to achieve the user's goal in a way that is easy to understand
- Explain the results in a way that is easy to understand
`;
