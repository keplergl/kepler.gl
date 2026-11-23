// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import {createOrUpdateFilter, setFilter, setFilterAnimationWindow} from '@kepler.gl/actions';
import type {TimeRangeFilter} from '@kepler.gl/types';
import {getTimeFilterState} from './time-filter-state';
import type {KeplerContext, RoomCommand} from './types';

const identifier = z.string().min(1).regex(/\S/, 'Identifier must not be blank.');
const inputSchema = z
  .object({
    action: z.enum(['create', 'get', 'update']),
    filterId: identifier
      .optional()
      .describe('Stable filter ID. Required for update; omit on get to list time filters.'),
    bindings: z
      .array(
        z
          .object({
            datasetId: identifier,
            startField: identifier.describe(
              'TIMESTAMP field; a single timestamp when endField is omitted.'
            ),
            endField: identifier
              .nullable()
              .optional()
              .describe('Optional TIMESTAMP end of a visibility interval.')
          })
          .strict()
      )
      .min(1)
      .optional()
      .describe('Complete replacement bindings, one per dataset. Required for create.'),
    animationWindow: z.enum(['free', 'incremental', 'point', 'interval']).optional(),
    value: z
      .tuple([z.number().finite(), z.number().finite()])
      .optional()
      .describe('Selected native time window in epoch milliseconds, within domain.'),
    interval: z
      .enum(['1-second', '1-minute', '1-hour', '1-day', '1-week', '1-month', '3-month', '1-year'])
      .optional(),
    enabled: z.boolean().optional()
  })
  .strict();

export function getTimeFilterCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.time-filter';
  return {
    id,
    name: 'Configure shared time filters',
    group: 'Map',
    description:
      'Create, inspect or update native time filters with per-dataset timestamp or start/end bindings. ' +
      'Get without filterId lists all time filters. Updates preserve the filter ID and unspecified settings; bindings replace the entire dataset list. ' +
      'Returns the native domain, window, selected time, playback state and visibleCounts evaluated with all active filters (including GPU filters; layer-specific polygon results are unioned). ' +
      'Null counts mean the dataset cannot be evaluated locally. Edits pause this filter. Use map.data-playback to play, pause, seek or reset without moving the camera.',
    metadata: {readOnly: false, riskLevel: 'low'},
    inputSchema,
    execute: (_execution, input) => {
      try {
        const args = inputSchema.parse(input);
        const state = ctx.getVisState();
        const filters: TimeRangeFilter[] = state.filters ?? [];
        const existing = filters.find(filter => filter.id === args.filterId);
        if (args.action === 'get') {
          if (args.filterId && existing?.type !== 'timeRange')
            throw new Error('Time filter not found.');
          return {
            success: true,
            commandId: id,
            data: {
              filters: (args.filterId
                ? [existing!]
                : filters.filter(filter => filter.type === 'timeRange')
              ).map(filter => getTimeFilterState(ctx, filter))
            }
          };
        }
        if (args.action === 'create' && existing)
          throw new Error('filterId already exists; use update.');
        if (args.action === 'update' && (!args.filterId || existing?.type !== 'timeRange'))
          throw new Error('A valid time filterId is required for update.');
        if (args.action === 'create' && !args.bindings)
          throw new Error('bindings are required for create.');

        // Validate every binding and the final domain before dispatching anything.
        let domain = existing?.domain;
        if (args.bindings) {
          if (
            new Set(args.bindings.map(binding => binding.datasetId)).size !== args.bindings.length
          )
            throw new Error('Each datasetId may appear only once.');
          const domains: number[][] = [];
          for (const binding of args.bindings) {
            const dataset = state.datasets[binding.datasetId];
            if (!dataset || dataset.disableDataOperation)
              throw new Error(
                `Dataset "${binding.datasetId}" is not available for local filtering.`
              );
            if (binding.endField === binding.startField)
              throw new Error('Start and end fields must be different.');
            for (const name of [binding.startField, binding.endField].filter(
              (name): name is string => Boolean(name)
            )) {
              const field = dataset.fields.find(field => field.name === name);
              if (field?.type !== 'timestamp')
                throw new Error(
                  `Column "${name}" in "${binding.datasetId}" must be a TIMESTAMP field.`
                );
              const props = dataset.getColumnFilterProps(name);
              if (
                props?.type !== 'timeRange' ||
                !Array.isArray(props.domain) ||
                props.domain.length !== 2 ||
                !props.domain.every(Number.isFinite)
              )
                throw new Error(`Column "${name}" has no finite time domain.`);
              const hasTimestamps =
                'mappedValue' in props &&
                Array.isArray(props.mappedValue) &&
                props.mappedValue.some(Number.isFinite);
              if (!hasTimestamps && name === binding.startField)
                throw new Error(`Start column "${name}" has no valid timestamps.`);
              // A missing end is open-ended; its synthetic fallback domain must
              // not extend the domain beyond the actual observation timestamps.
              if (hasTimestamps) domains.push(props.domain as number[]);
            }
          }
          domain = [Math.min(...domains.map(d => d[0])), Math.max(...domains.map(d => d[1]))];
        }
        if (!domain) throw new Error('The filter has no time domain.');
        if (
          args.value &&
          (args.value[0] > args.value[1] || args.value[0] < domain[0] || args.value[1] > domain[1])
        )
          throw new Error('value must be ordered and within the native domain.');

        const oldValue = existing?.value;
        const filterIndex = existing ? filters.indexOf(existing) : filters.length;
        if (args.bindings) {
          const first = args.bindings[0];
          if (!existing) {
            ctx.dispatch(createOrUpdateFilter(args.filterId, first.datasetId, first.startField));
          } else if (existing.dataId.length === 1 && existing.dataId[0] !== first.datasetId) {
            // Removing the sole dataset resets the native filter. Append the
            // replacement first so all its window/playback settings survive.
            ctx.dispatch(
              setFilter(
                filterIndex,
                ['dataId', 'name', 'endName'],
                [first.datasetId, first.startField, first.endField ?? null],
                1
              )
            );
            ctx.dispatch(setFilter(filterIndex, 'dataId', null, 0));
          }
          // Bind each dataset and its fields together so plot recalculation never
          // observes a newly appended dataset without a selected timestamp.
          args.bindings.forEach((binding, index) => {
            const sameDataset =
              ctx.getVisState().filters[filterIndex].dataId[index] === binding.datasetId;
            ctx.dispatch(
              setFilter(
                filterIndex,
                sameDataset ? ['name', 'endName'] : ['endName', 'dataId', 'name', 'endName'],
                sameDataset
                  ? [binding.startField, binding.endField ?? null]
                  : [null, binding.datasetId, binding.startField, binding.endField ?? null],
                index
              )
            );
          });
          for (
            let index = ctx.getVisState().filters[filterIndex].dataId.length - 1;
            index >= args.bindings.length;
            index--
          ) {
            ctx.dispatch(setFilter(filterIndex, 'dataId', null, index));
          }
          if (existing)
            ctx.dispatch(
              setFilter(filterIndex, ['view', 'fixedDomain'], [existing.view, existing.fixedDomain])
            );
        }
        const filter = ctx.getVisState().filters[filterIndex] as TimeRangeFilter;
        ctx.dispatch(setFilter(filterIndex, 'isAnimating', false));
        if (args.interval)
          ctx.dispatch(
            setFilter(filterIndex, 'plotType', {...filter.plotType, interval: args.interval})
          );
        if (args.action === 'create' && !args.value && args.animationWindow === 'interval') {
          // Let the native window action select the first actual histogram bin.
          ctx.dispatch(setFilter(filterIndex, 'value', [domain[0], domain[0]]));
        }
        if (args.animationWindow)
          ctx.dispatch(
            setFilterAnimationWindow({id: filter.id, animationWindow: args.animationWindow})
          );
        if (args.enabled !== undefined)
          ctx.dispatch(setFilter(filterIndex, 'enabled', args.enabled));
        const value =
          args.value ??
          (oldValue && args.bindings
            ? oldValue.map(time => Math.max(domain![0], Math.min(domain![1], time)))
            : args.action === 'create'
            ? args.animationWindow === 'interval'
              ? undefined
              : args.animationWindow === 'point' || args.animationWindow === 'incremental'
              ? [domain[0], domain[0]]
              : domain
            : undefined);
        if (value) ctx.dispatch(setFilter(filterIndex, 'value', value));
        return {
          success: true,
          commandId: id,
          data: getTimeFilterState(ctx, ctx.getVisState().filters[filterIndex])
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
