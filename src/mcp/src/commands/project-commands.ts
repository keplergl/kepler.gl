// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import {addDataToMap, resetMapConfig} from '@kepler.gl/actions';
import {
  hydrateExternallyHostedDataset,
  needsExternallyHostedHydrate,
  processKeplerglJSON
} from '@kepler.gl/processors';
import {serializeProject} from './project-export';
import {prepareProjectMapStyles} from './project-map-styles';
import type {KeplerContext, RoomCommand, VisState} from './types';

// Hosts should reuse a context for each map, including across agent surfaces.
const activeProjectImports = new WeakSet<KeplerContext>();
const projectImports = new WeakMap<
  KeplerContext,
  {state: 'ready' | 'failed'; datasets: VisState['datasets']; layers: VisState['layers']}
>();

export type ProjectStatus = {
  state: 'unknown' | 'loading' | 'ready' | 'failed';
  /** Only map.open-project imports are tracked; native UI/URL loads are not. */
  scope: 'mcp-open-project';
  timedOut?: true;
};

export const projectStatusInput = z
  .object({
    waitUntilReady: z.boolean().optional().describe('Wait while an MCP project import is loading.'),
    timeoutMs: z
      .number()
      .int()
      .min(1)
      .max(30000)
      .optional()
      .describe('Wait limit, default 30000 ms.')
  })
  .strict();

function readProjectStatus(ctx: KeplerContext): ProjectStatus {
  const status: ProjectStatus = {state: 'unknown', scope: 'mcp-open-project'};
  // Cancellation may return before the dataset tasks settle. Keep reporting
  // loading until those tasks release the same lock used by open-project.
  if (activeProjectImports.has(ctx)) return {...status, state: 'loading'};
  const imported = projectImports.get(ctx);
  if (!imported) return status;
  try {
    const current = ctx.getVisState();
    if (
      current.datasets !== imported.datasets ||
      current.layers !== imported.layers ||
      current.fileLoading ||
      current.loadingIndicatorValue > 0
    ) {
      // Never reinterpret the completion of an untracked load as success.
      projectImports.delete(ctx);
      return status;
    }
    return {...status, state: imported.state};
  } catch {
    projectImports.delete(ctx);
    return status;
  }
}

function waitForStatusPoll(delay: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const finish = () => {
      signal?.removeEventListener('abort', abort);
      resolve();
    };
    const timer = setTimeout(finish, delay);
    const abort = () => {
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
      reject(new Error('Project readiness wait cancelled.'));
    };
    signal?.addEventListener('abort', abort, {once: true});
    if (signal?.aborted) abort();
  });
}

export function getProjectStatusCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.get-project-status';
  return {
    id,
    name: 'Get project readiness',
    group: 'Map',
    description:
      'Report readiness of the latest map.open-project import: unknown, loading, ready or failed. ' +
      'Optionally wait up to 30 seconds while it loads. Empty projects can be ready. ' +
      'UI/URL loads are not tracked; unknown returns immediately. Ready covers project registration, not tile rendering.',
    metadata: {readOnly: true, riskLevel: 'low'},
    inputSchema: projectStatusInput,
    execute: async (execution, input) => {
      try {
        const args = projectStatusInput.parse(input);
        const deadline = Date.now() + (args.timeoutMs ?? 30000);
        let status = readProjectStatus(ctx);
        while (args.waitUntilReady && status.state === 'loading') {
          const remaining = deadline - Date.now();
          if (remaining <= 0) {
            status = {...status, timedOut: true};
            break;
          }
          await waitForStatusPoll(Math.min(100, remaining), execution.signal);
          status = readProjectStatus(ctx);
        }
        return {success: true, commandId: id, data: status};
      } catch (error) {
        return {
          success: false,
          commandId: id,
          error: error instanceof Error ? error.message : String(error)
        };
      }
    }
  };
}

const openSchema = z
  .object({
    url: z
      .string()
      .trim()
      .min(1)
      .describe('Saved-map JSON URL (HTTP(S), same-origin path or data URL).')
  })
  .strict()
  .meta({'x-kepler-local-resource': 1});

const saveSchema = z
  .object({
    dataMode: z
      .enum(['embedded', 'references'])
      .default('embedded')
      .describe(
        'Embed loaded tabular data for portability, or preserve supported source references. Tiled data remains remote.'
      ),
    includeCredentials: z
      .boolean()
      .describe(
        'Explicitly choose whether to include stored credentials. Use false for sharing; credentials in arbitrary data cells are not removed.'
      )
  })
  .strict();

function projectUrl(value: string): URL {
  const origin = typeof window === 'undefined' ? undefined : window.location.origin;
  const url = new URL(value, origin);
  if (!['http:', 'https:', 'data:'].includes(url.protocol)) {
    throw new Error('Use an HTTP(S) URL, a same-origin path, or the stdio bridge filePath input.');
  }
  if (url.protocol === 'data:' && url.href.length > 2 * 1024 * 1024) {
    throw new Error(
      'Data URL exceeds 2 MiB. Use a project URL or the stdio bridge filePath input.'
    );
  }
  return url;
}

function validateProject(raw: any, schema: VisState['schema']): void {
  if (!raw || !Array.isArray(raw.datasets) || !raw.config?.config?.visState) {
    throw new Error('Expected a saved kepler.gl project with datasets and a versioned config.');
  }
  const versions = Object.values(schema._validVersions);
  if (!versions.includes(raw.config.version)) {
    throw new Error(`Unsupported project config version: ${String(raw.config.version)}.`);
  }
  const ids = new Set<string>();
  for (const key of ['layers', 'filters', 'effects', 'cameraBookmarks']) {
    const value = raw.config.config.visState[key];
    if (value !== undefined && !Array.isArray(value)) {
      throw new Error(`Project ${key} must be an array.`);
    }
  }
  for (const dataset of raw.datasets) {
    const data = dataset?.data;
    if (!versions.includes(dataset?.version)) {
      throw new Error(`Unsupported dataset version: ${String(dataset?.version)}.`);
    }
    if (
      !data ||
      typeof data.id !== 'string' ||
      !data.id.trim() ||
      ['__proto__', 'constructor', 'prototype'].includes(data.id) ||
      ids.has(data.id) ||
      !Array.isArray(data.fields) ||
      !Array.isArray(data.allData)
    ) {
      throw new Error('Every saved dataset must have a unique ID, fields, and allData arrays.');
    }
    ids.add(data.id);
  }
}

function animationWarnings(raw: any, state: VisState) {
  const warnings: Array<{
    code: string;
    effectId: string;
    effectType: string;
    parameter: string;
    message: string;
  }> = [];
  for (const saved of raw.config.config.visState.effects ?? []) {
    if (!saved?.animation || typeof saved.animation !== 'object') continue;
    const restored = state.effects?.find(effect => effect.id === saved.id);
    for (const parameter of Object.keys(saved.animation)) {
      if (restored?.animation?.[parameter]?.length) continue;
      warnings.push({
        code: 'unsupported-effect-animation',
        effectId: saved.id,
        effectType: saved.type,
        parameter,
        message:
          `Skipped animation for effect "${saved.id}" (${saved.type}), parameter "${parameter}". ` +
          'Use timed blocks with explicit start/end values and elapsed times; no duration was inferred.'
      });
    }
  }
  return warnings;
}

function skippedConfigWarnings(raw: any, state: VisState) {
  return ['effects', 'cameraBookmarks'].flatMap(kind =>
    (raw.config.config.visState[kind] ?? [])
      .filter(saved => !state[kind]?.some(item => item.id === saved?.id))
      .map(saved => ({
        code: 'unsupported-project-config',
        kind,
        id: saved?.id,
        message: `Skipped unsupported or invalid ${kind} entry "${saved?.id}".`
      }))
  );
}

/** This promise settles only after every dispatched task has settled. */
async function dispatchProject(ctx: KeplerContext, payload: any, signal?: AbortSignal) {
  signal?.throwIfAborted();
  // addDataToMap alone reuses same-ID tables and retains old source metadata.
  await ctx.dispatch(resetMapConfig());
  signal?.throwIfAborted();
  await prepareProjectMapStyles(ctx, signal);
  signal?.throwIfAborted();
  await ctx.dispatch(addDataToMap(payload));
  signal?.throwIfAborted();
}

/** Cancellation returns promptly without releasing an import still mutating the map. */
function waitForProjectDispatch(completion: Promise<void>, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const onAbort = () =>
      reject(new Error('Project import cancelled; pending dataset loads may still complete.'));
    if (signal?.aborted) onAbort();
    else signal?.addEventListener('abort', onAbort, {once: true});
    completion.then(resolve, reject).finally(() => signal?.removeEventListener('abort', onAbort));
  });
}

export function getOpenProjectCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.open-project';
  return {
    id,
    name: 'Open a saved project',
    group: 'Map',
    description:
      'Replace the current map with a saved kepler.gl JSON project, including datasets, layers, filters, effects, tooltips and camera bookmarks. ' +
      'Accepts a browser-accessible URL; the stdio bridge also accepts filePath for one selected local JSON file. ' +
      'Waits for dataset registration and reports failures or skipped effect animations. Remote source references must remain accessible. ' +
      'Unavailable or invalid remote dataset files leave the current map unchanged. Other failures or cancellation after replacement starts may leave a partially loaded map.',
    metadata: {readOnly: false, riskLevel: 'medium', requiresConfirmation: true},
    inputSchema: openSchema,
    execute: async (execution, input) => {
      let ownsImport = false;
      let outcome: 'ready' | 'failed' = 'failed';
      let dispatchCompletion: Promise<void> | undefined;
      try {
        const args = openSchema.parse(input);
        execution.signal?.throwIfAborted();
        if (activeProjectImports.has(ctx)) {
          throw new Error(
            'A project import is already in progress for this map. Wait for it to finish.'
          );
        }
        // Acquire before the first await so simultaneous calls cannot both reset the map.
        activeProjectImports.add(ctx);
        projectImports.delete(ctx);
        ownsImport = true;
        const response = await fetch(projectUrl(args.url).href, {signal: execution.signal});
        if (!response.ok) throw new Error(`Project request failed (HTTP ${response.status}).`);
        const raw = await response.json();
        execution.signal?.throwIfAborted();
        const schema = ctx.getVisState().schema;
        validateProject(raw, schema);
        const parsed = processKeplerglJSON(raw, schema);
        if (!parsed?.config || !parsed.datasets || parsed.datasets.length !== raw.datasets.length) {
          throw new Error(
            'The project could not be parsed completely. No map changes were applied.'
          );
        }
        if (ctx.getVisState().fileLoading || ctx.getVisState().loadingIndicatorValue > 0) {
          throw new Error('Wait for the current dataset load to finish before opening a project.');
        }
        if (
          Object.keys(parsed.config.mapStyle?.mapStyles ?? {}).length &&
          !ctx.getKeplerState?.()
        ) {
          throw new Error(
            'This host must provide KeplerContext.getKeplerState to replace custom project basemaps.'
          );
        }
        // Resolve references before changing any live state. Pass their loaded
        // data to the normal reducer so a successful open does not download twice.
        const datasets = parsed.datasets.some(needsExternallyHostedHydrate)
          ? await Promise.all(
              parsed.datasets.map(async dataset => {
                try {
                  return await hydrateExternallyHostedDataset(dataset, {signal: execution.signal});
                } catch {
                  if (execution.signal?.aborted) {
                    throw new Error('Project import cancelled. No map changes were applied.');
                  }
                  // A loader error may contain authenticated URLs or raw data.
                  throw new Error(
                    `Project dataset "${dataset.info.id}" could not be loaded. ` +
                      'Check source availability and data format. No map changes were applied.'
                  );
                }
              })
            )
          : parsed.datasets;
        execution.signal?.throwIfAborted();
        if (ctx.getVisState().fileLoading || ctx.getVisState().loadingIndicatorValue > 0) {
          throw new Error('Wait for the current dataset load to finish before opening a project.');
        }
        dispatchCompletion = dispatchProject(
          ctx,
          {
            ...parsed,
            datasets,
            options: {centerMap: false, autoCreateLayers: false, keepExistingConfig: false}
          },
          execution.signal
        );
        await waitForProjectDispatch(dispatchCompletion, execution.signal);
        const state = ctx.getVisState();
        const missingDatasets = raw.datasets
          .map(dataset => dataset.data.id)
          .filter(id => !state.datasets[id]);
        if (missingDatasets.length || state.loadingIndicatorValue > 0) {
          throw new Error(
            `Project dataset registration failed${
              missingDatasets.length ? `: ${missingDatasets.join(', ')}` : ''
            }. ` +
              'Check source availability and data format. The host must return its task middleware completion promise from dispatch. The map may be partially loaded.'
          );
        }
        for (const key of ['layers', 'filters'] as const) {
          const missing = (parsed.config.visState?.[key] ?? []).filter(
            saved => !state[key]?.some(item => item.id === saved.id)
          );
          if (missing.length)
            throw new Error(
              `Project ${key} could not be restored: ${missing
                .map(item => item.id)
                .join(', ')}. The map may be partially loaded.`
            );
        }
        outcome = 'ready';
        return {
          success: true,
          commandId: id,
          data: {
            status: 'loaded',
            datasets: Object.values(state.datasets).map(dataset => ({
              id: dataset.id,
              label: dataset.label
            })),
            layerIds: state.layers.map(layer => layer.id),
            warnings: [...animationWarnings(raw, state), ...skippedConfigWarnings(raw, state)]
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: id,
          error: error instanceof Error ? error.message : String(error)
        };
      } finally {
        if (ownsImport) {
          const release = () => {
            activeProjectImports.delete(ctx);
            try {
              const {datasets, layers} = ctx.getVisState();
              projectImports.set(ctx, {state: outcome, datasets, layers});
            } catch {
              projectImports.delete(ctx);
            }
          };
          if (dispatchCompletion) {
            // The caller may have cancelled while the reducer's tasks are still running.
            void dispatchCompletion.then(release, release);
          } else {
            release();
          }
        }
      }
    }
  };
}

export function getSaveProjectCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.save-project';
  return {
    id,
    name: 'Save the current project',
    group: 'Map',
    description:
      'Export the complete current map as saved-map JSON. Choose embedded tabular data or supported source references and explicitly choose credential inclusion. ' +
      'The stdio MCP bridge returns a retrievable artifact URI; other hosts receive the JSON artifact text. Remote tiles, images and Zarr data remain source references.',
    metadata: {readOnly: true, riskLevel: 'medium'},
    inputSchema: saveSchema,
    execute: (execution, input) => {
      try {
        const args = saveSchema.parse(input);
        execution.signal?.throwIfAborted();
        const state = ctx.getKeplerState?.();
        if (!state)
          throw new Error(
            'This host does not provide complete project state. Wire KeplerContext.getKeplerState to enable project export.'
          );
        if (state.visState.fileLoading || state.visState.loadingIndicatorValue > 0)
          throw new Error('Wait for datasets to finish loading before exporting the project.');
        const {text, warnings} = serializeProject(state, args);
        return {
          success: true,
          commandId: id,
          data: {
            artifact: {fileName: 'kepler-project.json', mimeType: 'application/json', text},
            dataMode: args.dataMode,
            includeCredentials: args.includeCredentials,
            warnings
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: id,
          error: error instanceof Error ? error.message : String(error)
        };
      }
    }
  };
}
