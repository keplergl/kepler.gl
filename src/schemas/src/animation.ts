// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';

import {TimeRangeFilterSchema} from './filter';

export const AnimationTimeFormat = z.enum(['L', 'L LT', 'L LTS']);
export type AnimationTimeFormat = z.infer<typeof AnimationTimeFormat>;

export const AnimationConfigSchema = z.preprocess(
  (config: any) => {
    // Remove null values so they are not saved and don't show up in the editors
    if (config?.timeFormat === null) {
      config = {...config};
      delete config.timeFormat;
    }
    if (config?.timezone === null) {
      config = {...config};
      delete config.timezone;
    }
    return config;
  },
  z.object({
    currentTime: z
      .number()
      .nullable()
      .optional()
      .describe('The current time of the animation in epoch milliseconds'),
    speed: z
      .number()
      .min(0)
      .max(10)
      .default(1)
      .describe('The speed of the animation, a number between 0 and 10'),
    domain: z
      .tuple([z.number(), z.number()])
      .optional()
      .describe(
        'Override the time domain of the animation (in epoch milliseconds). ' +
          'By default the domain is calculated from the data.'
      ),
    timeFormat: AnimationTimeFormat.optional().describe(
      'The format for displaying the animation time ' +
        'For the syntax check "Locale aware formats" here: https://momentjs.com/docs/#/parsing/string-format/'
    ),
    timezone: z
      .string()
      .optional()
      .describe(
        'The timezone for displaying the animation time e.g. "America/New_York"' +
          'For the list of timezones check here: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones'
      )
  })
);
export type AnimationConfigSchema = z.infer<typeof AnimationConfigSchema>;

export const SyncTimelineMode = z.enum(['start', 'end']);
export type SyncTimelineMode = z.infer<typeof SyncTimelineMode>;

/**
 * Subset of TimeRangeFilterSchema that is used for filter animation config JSON editor
 */
export const FilterAnimationSchema = TimeRangeFilterSchema.pick({
  dataId: true,
  value: true,
  animationWindow: true,
  speed: true,
  syncedWithLayerTimeline: true,
  syncTimelineMode: true,
  timezone: true
}).required({
  dataId: true,
  animationWindow: true
});

export type FilterAnimationSchema = z.infer<typeof FilterAnimationSchema>;
