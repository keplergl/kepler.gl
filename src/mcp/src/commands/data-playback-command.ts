// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import {
  setAnimationConfig,
  setFilter,
  setFilterAnimationTime,
  setLayerAnimationTime
} from '@kepler.gl/actions';
import {ANIMATION_WINDOW, FILTER_TYPES} from '@kepler.gl/constants';
import {getFilterBinThresholds, intervalBinFromMarks, snapToMarks} from '@kepler.gl/utils';
import type {TimeRangeFilter} from '@kepler.gl/types';
import type {KeplerContext, RoomCommand} from './types';
import {getTimeFilterState, getVisibleCounts} from './time-filter-state';

const identifier = z.string().trim().min(1);
const schema = z
  .object({
    action: z.enum(['get', 'play', 'pause', 'seek', 'reset']),
    target: z.union([
      z.object({filterId: identifier}).strict(),
      z.object({layerId: identifier}).strict()
    ]),
    time: z
      .number()
      .finite()
      .optional()
      .describe(
        'For seek: data timestamp in the native domain units (milliseconds for timestamps).'
      ),
    speed: z
      .number()
      .finite()
      .positive()
      .optional()
      .describe('For play: native playback speed multiplier.'),
    loop: z
      .boolean()
      .optional()
      .describe('For play: repeat after the final frame and optional hold.'),
    endHoldDurationMs: z
      .number()
      .finite()
      .min(0)
      .max(Number.MAX_SAFE_INTEGER)
      .optional()
      .describe(
        'For play: hold the last observation for this many presentation milliseconds before looping or stopping. Zero disables the hold; also used by video export.'
      )
  })
  .strict();

/** Seek the same native window the slider controls; time refers to its selected edge. */
export function getTimeFilterSeekValue(filter: TimeRangeFilter, time: number): [number, number] {
  if (filter.animationWindow === ANIMATION_WINDOW.interval) {
    return intervalBinFromMarks(getFilterBinThresholds(filter), time);
  }
  if (filter.animationWindow === ANIMATION_WINDOW.point) return [time, time];
  const [start, end] = filter.value;
  if (filter.animationWindow === ANIMATION_WINDOW.incremental) {
    return [Math.min(start, time), time];
  }
  const width = Math.max(0, end - start);
  return filter.syncedWithLayerTimeline && filter.syncTimelineMode === 0
    ? [time, time + width]
    : [time - width, time];
}

export function getDataPlaybackCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.data-playback';
  return {
    id,
    name: 'Control data playback',
    group: 'Map',
    description:
      'Inspect, play, pause, seek or reset a native data timeline without moving the camera. ' +
      'Target a time filter by filterId, or an animated layer such as a trip by layerId. Animated layers share one native clock; a linked time filter controls that clock. ' +
      'Seek pauses data playback and uses the native window (including interval snapping); reset seeks the domain start. ' +
      'Play pauses competing data clocks. Optional endHoldDurationMs keeps the final data timestamp fixed while presentation animation continues. ' +
      'Counts include all active dataset filters, including GPU filters; they are record counts, not rendered trip segments.',
    metadata: {readOnly: false, riskLevel: 'low'},
    inputSchema: schema,
    execute: (_execution, input) => {
      try {
        const args = schema.parse(input);
        if (args.action === 'seek' && args.time === undefined)
          throw new Error('time is required for seek.');
        if (args.action !== 'seek' && args.time !== undefined)
          throw new Error('time is only accepted for seek.');
        if (
          args.action !== 'play' &&
          [args.speed, args.loop, args.endHoldDurationMs].some(value => value !== undefined)
        ) {
          throw new Error('speed, loop and endHoldDurationMs are only accepted for play.');
        }
        const state = ctx.getVisState();
        const filters: TimeRangeFilter[] = state.filters ?? [];
        let filterIndex = -1;
        let layer: (typeof state.layers)[number] | undefined;
        const target = args.target;
        if ('filterId' in target) {
          filterIndex = filters.findIndex(filter => filter.id === target.filterId);
          if (filterIndex < 0 || filters[filterIndex].type !== FILTER_TYPES.timeRange) {
            throw new Error(`Time filter "${target.filterId}" not found.`);
          }
        } else {
          layer = state.layers.find(candidate => candidate.id === target.layerId);
          if (!layer?.config.animation?.enabled)
            throw new Error(`Animated layer "${target.layerId}" not found.`);
          filterIndex = filters.findIndex(filter => filter.syncedWithLayerTimeline);
        }
        const filter = filters[filterIndex];
        const clock = filter ?? state.animationConfig;
        if (!clock) throw new Error('The selected data clock is unavailable.');
        const domain = clock.domain;
        if (args.action !== 'get') {
          if (
            !Array.isArray(domain) ||
            domain.length !== 2 ||
            !domain.every(Number.isFinite) ||
            domain[1] < domain[0]
          ) {
            throw new Error('The selected data clock has no valid native domain.');
          }
          if (args.action === 'seek' && (args.time! < domain[0] || args.time! > domain[1])) {
            throw new Error(`time must be within the native domain [${domain[0]}, ${domain[1]}].`);
          }
          if (args.action === 'play' && domain[0] === domain[1])
            throw new Error('The selected data clock has no playable time span.');
          if (args.action === 'play' && layer && !layer.config.isVisible)
            throw new Error('Make the animated layer visible before playing.');

          // Native playback has a single active data controller. Stop competitors
          // before starting or seeking so another clock cannot alter the result.
          if (args.action !== 'pause') {
            filters.forEach((candidate, index) => {
              if (candidate.isAnimating)
                ctx.dispatch(setFilterAnimationTime(index, 'isAnimating', false));
            });
            if (state.animationConfig?.isAnimating)
              ctx.dispatch(setAnimationConfig({isAnimating: false} as any));
          }
          if (filter) {
            if (args.action === 'play') {
              const settings = {
                ...(args.speed !== undefined ? {speed: args.speed} : {}),
                ...(args.loop !== undefined ? {animationLoop: args.loop} : {}),
                ...(args.endHoldDurationMs !== undefined
                  ? {endHoldDurationMs: args.endHoldDurationMs}
                  : {}),
                isAnimating: true
              };
              ctx.dispatch(setFilter(filterIndex, Object.keys(settings), Object.values(settings)));
            } else {
              ctx.dispatch(setFilterAnimationTime(filterIndex, 'isAnimating', false));
              if (args.action === 'seek' || args.action === 'reset') {
                ctx.dispatch(
                  setFilterAnimationTime(
                    filterIndex,
                    'value',
                    getTimeFilterSeekValue(filter, args.action === 'reset' ? domain[0] : args.time!)
                  )
                );
              }
            }
          } else {
            ctx.dispatch(
              setAnimationConfig({
                isAnimating: args.action === 'play',
                ...(args.speed !== undefined ? {speed: args.speed} : {}),
                ...(args.loop !== undefined ? {animationLoop: args.loop} : {}),
                ...(args.endHoldDurationMs !== undefined
                  ? {endHoldDurationMs: args.endHoldDurationMs}
                  : {})
              } as any)
            );
            if (args.action === 'seek' || args.action === 'reset') {
              const time = args.action === 'reset' ? domain[0] : args.time!;
              const timeSteps = state.animationConfig.timeSteps;
              ctx.dispatch(
                setLayerAnimationTime(timeSteps?.length ? snapToMarks(time, timeSteps) : time)
              );
            }
          }
        }
        const updated = ctx.getVisState();
        const animation = updated.animationConfig;
        const animatedLayers = updated.layers.filter(
          candidate => candidate.config.animation?.enabled
        );
        return {
          success: true,
          commandId: id,
          data: {
            requestedTarget: args.target,
            clock: filter ? 'filter' : 'layer',
            ...(filter
              ? getTimeFilterState(ctx, updated.filters[filterIndex])
              : {
                  layerIds: animatedLayers.map(candidate => candidate.id),
                  domain: animation.domain,
                  selectedTime: animation.currentTime,
                  isAnimating: Boolean(animation.isAnimating),
                  speed: animation.speed,
                  animationLoop: animation.animationLoop !== false,
                  endHoldDurationMs: animation.endHoldDurationMs ?? 0,
                  timeSteps: animation.timeSteps,
                  visibleCounts: getVisibleCounts(ctx, [
                    ...new Set<string>(
                      animatedLayers.map(candidate => candidate.config.dataId).filter(Boolean)
                    )
                  ])
                })
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
