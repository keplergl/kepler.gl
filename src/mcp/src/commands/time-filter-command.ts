import type {RoomCommand} from './types';
import {z} from 'zod';
import KeplerTable, {Datasets} from '@kepler.gl/table';
import {
  addFilter,
  setFilter,
  setFilterAnimationTime,
  setFilterAnimationWindow
} from '@kepler.gl/actions';
import {KeplerContext} from './types';

export type IntervalKey =
  | '1-second'
  | '1-minute'
  | '1-hour'
  | '1-day'
  | '1-week'
  | '1-month'
  | '3-month'
  | '1-year';

const MILLIS_SECOND = 1_000;
const MILLIS_MINUTE = 60 * MILLIS_SECOND;
const MILLIS_HOUR = 60 * MILLIS_MINUTE;
const MILLIS_DAY = 24 * MILLIS_HOUR;
const MILLIS_WEEK = 7 * MILLIS_DAY;
const MILLIS_MONTH = 30 * MILLIS_DAY;
const MILLIS_3_MONTH = 91 * MILLIS_DAY;
const MILLIS_YEAR = 365 * MILLIS_DAY;

export const INTERVAL_MILLIS: Record<IntervalKey, number> = {
  '1-second': MILLIS_SECOND,
  '1-minute': MILLIS_MINUTE,
  '1-hour': MILLIS_HOUR,
  '1-day': MILLIS_DAY,
  '1-week': MILLIS_WEEK,
  '1-month': MILLIS_MONTH,
  '3-month': MILLIS_3_MONTH,
  '1-year': MILLIS_YEAR
};

/**
 * Infer a sensible animation interval from a time filter's domain and (when
 * available) the actual distinct timestamps in the dataset. Mirrors the logic
 * used by spatial-agent's `detectIntervalFromDomain` so the skill-path behaves
 * identically.
 */
export function detectIntervalFromDomain(
  domain: [number, number],
  mappedValues?: number[]
): IntervalKey {
  const span = domain[1] - domain[0];
  if (span <= 0) return '1-year';

  let numUniqueSteps: number;
  if (mappedValues && mappedValues.length > 0) {
    const unique = new Set(mappedValues.filter(v => v != null));
    numUniqueSteps = unique.size;
  } else {
    numUniqueSteps = 2;
  }

  if (numUniqueSteps <= 1) return '1-year';

  const avgGap = span / Math.max(numUniqueSteps - 1, 1);

  if (avgGap >= MILLIS_YEAR * 0.8) return '1-year';
  if (avgGap >= MILLIS_MONTH * 2.5) return '3-month';
  if (avgGap >= MILLIS_MONTH * 0.8) return '1-month';
  if (avgGap >= MILLIS_DAY * 5) return '1-week';
  if (avgGap >= MILLIS_DAY * 0.8) return '1-day';
  if (avgGap >= MILLIS_HOUR * 0.8) return '1-hour';
  if (avgGap >= MILLIS_MINUTE * 0.8) return '1-minute';
  return '1-second';
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const addTimeFilterCommandId = 'map.add-time-filter' as const;

export function getAddTimeFilterCommand(ctx: KeplerContext): RoomCommand {
  return {
    id: addTimeFilterCommandId,
    name: 'Add time filter',
    group: 'Map',
    description: `Add a time-range filter to animate a NON-trip layer over a TIMESTAMP/DATE column. The time controller appears at the bottom of the map.

DO NOT call this for a trip layer — trips have built-in time animation.

The dataset and a layer for it must already exist on the map (e.g. from map.add-layer or map.load-data).

Pass the datasetName and the dateTimeColumn to animate over. The interval is auto-detected from the data when omitted; pass it explicitly to override.`,
    metadata: {readOnly: false, riskLevel: 'medium', idempotent: false},
    inputSchema: z.object({
      datasetName: z.string().describe('The name (label) or id of the dataset to animate.'),
      dateTimeColumn: z
        .string()
        .describe(
          'A TIMESTAMP or DATE column in the dataset. Do NOT pass an integer/string epoch column — build a real TIMESTAMP column first.'
        ),
      interval: z
        .enum(['1-second', '1-minute', '1-hour', '1-day', '1-week', '1-month', '3-month', '1-year'])
        .optional()
        .describe(
          'Animation step. Auto-detected from the data span and distinct timestamps when omitted.'
        )
    }) as any,
    execute: async (_execCtx, input) => {
      const {datasetName, dateTimeColumn, interval} = (input ?? {}) as {
        datasetName: string;
        dateTimeColumn: string;
        interval?: IntervalKey;
      };
      try {
        const visState = ctx.getVisState();
        const datasets: Datasets = visState.datasets;

        const datasetId = Object.keys(datasets).find(
          dataId => datasets[dataId].label === datasetName || dataId === datasetName
        );
        if (!datasetId) {
          throw new Error(`Dataset ${datasetName} not found.`);
        }
        const dataset = datasets[datasetId] as KeplerTable;

        const filterField = dataset.fields?.find(f => f.name === dateTimeColumn);
        if (!filterField) {
          throw new Error(
            `Column ${dateTimeColumn} not found in dataset ${datasetName}. Available: ${dataset.fields
              ?.map(f => f.name)
              .join(', ')}`
          );
        }
        if (filterField.type !== 'timestamp' && filterField.type !== 'date') {
          throw new Error(
            `Column ${dateTimeColumn} is of type "${filterField.type}", not timestamp/date. Build a real TIMESTAMP column first (Kepler.gl cannot animate on integer/string epochs).`
          );
        }

        // Explicitly typed: `VisState.filters` is untyped (index signature) and
        // strict consumers (e.g. kepler-assistant, which vendors this module)
        // would otherwise flag the `.findIndex(f => …)` callback as implicit any.
        const filters: any[] = visState.filters ?? [];
        const existingFilterIdx = filters.findIndex(
          f =>
            (Array.isArray(f.dataId) ? f.dataId.includes(datasetId) : f.dataId === datasetId) &&
            (Array.isArray(f.name) ? f.name.includes(dateTimeColumn) : f.name === dateTimeColumn)
        );

        let filterIdx: number;
        let filterId: string;

        if (existingFilterIdx >= 0) {
          filterIdx = existingFilterIdx;
          filterId = filters[existingFilterIdx].id;
        } else {
          filterIdx = filters.length;
          ctx.dispatch(addFilter(datasetId));
          ctx.dispatch(setFilter(filterIdx, 'name', dateTimeColumn));
          await sleep(300);
          const filtersAfter = ctx.getVisState().filters ?? [];
          filterId = filtersAfter[filterIdx]?.id ?? '';
        }

        const currentFilters = ctx.getVisState().filters ?? [];
        const targetFilter = currentFilters[filterIdx];

        let resolvedInterval: IntervalKey | string | undefined = interval;

        if (targetFilter?.domain && targetFilter.domain.length === 2) {
          if (!resolvedInterval) {
            let mappedValues: number[] | undefined;
            const fieldIdx = dataset.fields?.indexOf(filterField) ?? -1;
            if (fieldIdx >= 0 && dataset.dataContainer) {
              const rows = dataset.dataContainer.numRows();
              mappedValues = [];
              for (let i = 0; i < rows; i++) {
                const val = dataset.dataContainer.valueAt(i, fieldIdx);
                if (val != null) {
                  const ts = typeof val === 'number' ? val : new Date(val as any).getTime();
                  if (!isNaN(ts)) mappedValues.push(ts);
                }
              }
            }
            resolvedInterval = detectIntervalFromDomain(
              targetFilter.domain as [number, number],
              mappedValues
            );
          }

          ctx.dispatch(setFilter(filterIdx, 'plotType', {interval: resolvedInterval}));
          ctx.dispatch(setFilterAnimationWindow({id: filterId, animationWindow: 'free'}));

          // Poll for timeBins to become available (kepler computes them async).
          let datasetBins: {x0: number; x1: number}[] | undefined;
          for (let attempt = 0; attempt < 10; attempt++) {
            await sleep(200);
            const updatedFilter = ctx.getVisState().filters?.[filterIdx];
            if (updatedFilter?.domain && updatedFilter.domain.length === 2) {
              const timeBins = (updatedFilter as any).timeBins;
              const bins =
                timeBins &&
                Object.keys(timeBins).length &&
                (Object.values(timeBins)[0] as any)?.[resolvedInterval as string];
              if (bins && bins.length > 0) {
                datasetBins = bins;
                break;
              }
            }
          }

          const finalFilter = ctx.getVisState().filters?.[filterIdx];
          if (finalFilter?.domain && finalFilter.domain.length === 2) {
            if (datasetBins && datasetBins.length > 0) {
              ctx.dispatch(
                setFilterAnimationTime(filterIdx, 'value', [datasetBins[0].x0, datasetBins[0].x1])
              );
            } else {
              const domainStart = (finalFilter.domain as number[])[0];
              const windowSize = INTERVAL_MILLIS[resolvedInterval as IntervalKey] ?? MILLIS_YEAR;
              ctx.dispatch(
                setFilterAnimationTime(filterIdx, 'value', [domainStart, domainStart + windowSize])
              );
            }
          }
        }

        return {
          success: true,
          commandId: addTimeFilterCommandId,
          data: {
            details: `Time filter added on column "${dateTimeColumn}" for dataset "${datasetName}" (interval: ${
              resolvedInterval ?? 'auto'
            }, filter index: ${filterIdx}). The time controller is now visible at the bottom of the map.`,
            filterIndex: filterIdx,
            interval: resolvedInterval
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: addTimeFilterCommandId,
          error: error instanceof Error ? error.message : 'Unknown error',
          data: {
            instruction:
              'Check that the dataset exists, the column is a TIMESTAMP/DATE, and a layer for the dataset is already on the map. Do not retry more than once.'
          }
        };
      }
    }
  };
}
