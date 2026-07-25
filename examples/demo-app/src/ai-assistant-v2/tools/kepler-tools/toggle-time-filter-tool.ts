import {tool} from '../ai-tool-shim';
import {z} from 'zod';
import {setFilterView} from '@kepler.gl/actions';
import {KeplerContext} from '../../types';

export function getToggleTimeFilterTool(ctx: KeplerContext) {
  return tool({
    description: `Show or hide the enlarged time controller at the bottom of the map.

A time filter must already exist on the map (created via map.add-time-filter).

- action: "show" — enlarge the time controller so it is visible at the bottom of the map.
- action: "hide" — collapse the time controller back to the side panel.`,
    inputSchema: z.object({
      action: z.enum(['show', 'hide']).describe(
        '"show" enlarges the time controller at the bottom of the map; "hide" collapses it to the side panel.'
      ),
      filterIndex: z
        .number()
        .optional()
        .describe(
          'Index of the time filter to toggle. If omitted, the first time-range filter found is used.'
        )
    }),
    execute: async ({action, filterIndex}, {abortSignal}) => {
      try {
        abortSignal?.throwIfAborted();
        const visState = ctx.getVisState();
        const filters = visState.filters ?? [];

        if (filters.length === 0) {
          return {
            success: false,
            error:
              'No filters found on the map. Add a time filter first via map.add-time-filter.',
            instruction: 'Call map.add-time-filter before map.toggle-time-filter.'
          };
        }

        let targetIdx: number;
        if (filterIndex === undefined) {
          const found = filters.findIndex(
            (f: any) => f.type === 'timeRange' || f.type === 'time'
          );
          targetIdx = found < 0 ? 0 : found;
        } else {
          targetIdx = filterIndex;
        }

        if (targetIdx < 0 || targetIdx >= filters.length) {
          return {
            success: false,
            error: `Filter index ${targetIdx} is out of range. There are ${filters.length} filter(s).`,
            instruction: `Use a filterIndex between 0 and ${filters.length - 1}.`
          };
        }

        const view = action === 'show' ? 'enlarged' : 'side';
        ctx.dispatch(setFilterView(targetIdx, view as any));

        return {
          success: true,
          details:
            action === 'show'
              ? `Time filter at index ${targetIdx} is now enlarged. The time controller is visible at the bottom of the map.`
              : `Time filter at index ${targetIdx} has been collapsed back to the side panel.`
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          instruction:
            'Check that a time filter exists. If the error persists, ask the user to try with different parameters.'
        };
      }
    }
  });
}