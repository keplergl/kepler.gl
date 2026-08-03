/**
 * AI SDK tool factories that the orchestrator/skill agents call directly (as
 * opposed to `RoomCommand`s, which are routed through the `executeApi`
 * command dispatcher — see `../commands/`).
 *
 * Charts are now routed through `executeApi` as `chart.*` commands (see
 * `../commands/chart-commands.ts`). The histogram renderer dispatches on
 * `output.commandId` rather than tool name — see `echarts-renderers.tsx`.
 *
 * The full command catalog (kepler / query / geo / spatial-analysis / chart)
 * lives in `../commands/index.ts` (`getAllCommands`).
 */
export {getEchartsTools} from './echarts-tools';
export {createWrappedQueryTool} from './query-tool-wrapper';
