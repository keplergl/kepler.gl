/**
 * Pure input-repair helpers for the `executeApi` tool. Kept dependency-free
 * (no `ai`/handler imports) so they can be unit-tested without pulling the
 * whole tool/handler graph (and its heavy runtime deps) into the test.
 *
 * Ported verbatim from `spatial-agent/src/skills/executeApi/normalizeInput.ts`
 * — the file is pure (no imports from the agent graph) so it carries over
 * without adaptation.
 */

/**
 * Find the index of the closing `}` that balances the opening `{` at position
 * `start`, respecting JSON string literals (including escapes). Returns -1 if
 * no balanced close is found.
 */
function findBalancedBrace(str: string, start: number): number {
  let depth = 0;
  let inString = false;
  for (let i = start; i < str.length; i++) {
    const ch = str[i];
    if (inString) {
      if (ch === '\\') {
        i++; // skip escaped char
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }
    if (ch === '"') {
      inString = true;
    } else if (ch === '{' || ch === '[') {
      depth++;
    } else if (ch === '}' || ch === ']') {
      depth--;
      if (depth === 0 && ch === '}') return i;
    }
  }
  return -1;
}

/**
 * Compute remaining brace depth at end-of-string (after scanning from `start`).
 * Used to determine how many `}`s are missing from a truncated JSON object.
 */
function remainingBraceDepth(str: string, start: number): number {
  let depth = 0;
  let inString = false;
  for (let i = start; i < str.length; i++) {
    const ch = str[i];
    if (inString) {
      if (ch === '\\') {
        i++;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }
    if (ch === '"') {
      inString = true;
    } else if (ch === '{' || ch === '[') {
      depth++;
    } else if (ch === '}' || ch === ']') {
      depth--;
    }
  }
  return depth;
}

/**
 * Result from the tolerant JSON extractor: the parsed leading object plus any
 * `reasoning` value found in the trailing junk after the balanced object.
 */
export type TolerantParseResult = {parsed: unknown; trailingReasoning?: string};

/**
 * Tolerant JSON object extractor. When strict `JSON.parse` fails on a string
 * that starts with `{`, this attempts to extract the leading balanced `{...}`
 * object (ignoring trailing content like `, "reasoning": "..."`). Returns
 * `null` if extraction fails.
 */
export function tolerantParseJsonObject(value: string): TolerantParseResult | null {
  const trimmed = value.trim();
  if (!trimmed.startsWith('{')) return null;
  const closeIdx = findBalancedBrace(trimmed, 0);
  if (closeIdx >= 0) {
    const objSlice = trimmed.slice(0, closeIdx + 1);
    const parsed = tryParse(objSlice);
    if (parsed !== undefined) {
      // Attempt to recover a trailing `"reasoning"` from the junk after the object.
      let trailingReasoning: string | undefined;
      const tail = trimmed.slice(closeIdx + 1).trim();
      if (tail.startsWith(',')) {
        const reasoningMatch = tail.match(/^,\s*"reasoning"\s*:\s*"((?:[^"\\]|\\.)*)"/);
        if (reasoningMatch) {
          trailingReasoning = tryParse(`"${reasoningMatch[1]}"`) as string | undefined;
        }
      }
      return {parsed, trailingReasoning};
    }
  }
  // No balanced close (or it didn't parse): the object may be truncated with
  // missing trailing `}`s (a common DeepSeek malformation). Compute how many
  // closes are missing and append them, then parse.
  const missing = remainingBraceDepth(trimmed, 0);
  if (missing > 0) {
    const repaired = trimmed + '}'.repeat(missing);
    const parsed = tryParse(repaired);
    if (parsed !== undefined) return {parsed};
  }
  return null;
}

/** `JSON.parse` returning `undefined` on failure (so `null`/`false` results survive). */
function tryParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

/** Try to JSON-parse a string; return the original string on failure. */
function tryParseJson(value: string): unknown {
  try {
    return JSON.parse(value.trim());
  } catch {
    // Fallback: extract the leading balanced JSON object (handles trailing junk).
    const result = tolerantParseJsonObject(value);
    if (result) return result.parsed;
    return value;
  }
}

/**
 * Iteratively peel JSON-string layers and unwrap redundant `{call}` envelopes
 * until we reach a `{apiName, args}`-shaped object (or run out of layers).
 * Also collects any `reasoning` recovered from trailing junk during tolerant
 * parsing (DeepSeek often folds `reasoning` into the stringified `call`).
 */
function unwrapCall(value: unknown): {result: unknown; trailingReasoning?: string} {
  let unwrapped = value;
  let trailingReasoning: string | undefined;
  for (let i = 0; i < 5; i++) {
    if (typeof unwrapped === 'string') {
      // Try strict parse first.
      try {
        unwrapped = JSON.parse((unwrapped as string).trim());
        continue;
      } catch {
        // Strict failed — try tolerant extraction with trailing-reasoning recovery.
        const tolerant = tolerantParseJsonObject(unwrapped as string);
        if (tolerant) {
          unwrapped = tolerant.parsed;
          if (tolerant.trailingReasoning) trailingReasoning = tolerant.trailingReasoning;
          continue;
        }
        break; // not recoverable — stop peeling
      }
    }
    if (unwrapped && typeof unwrapped === 'object' && 'call' in unwrapped && !('apiName' in unwrapped)) {
      unwrapped = (unwrapped as {call: unknown}).call;
      continue;
    }
    break;
  }
  return {result: unwrapped, trailingReasoning};
}

/** Known `data.query`/command input keys models often misplace directly under `args`. */
const EXECUTE_COMMAND_INPUT_KEYS = [
  'sqlQuery',
  'saveToTable',
  'numFirstRowsToLLM',
  'useCache',
  'iceberg',
  'prompt',
  'systemInstructions',
  'cacheKey',
  'contextQuery',
] as const;

/**
 * Repair the common `executeCommand` misplacement where models put command
 * input keys (e.g. `sqlQuery`) directly under `args` alongside `commandId`
 * instead of nesting them under `args.input`. `ExecuteCommandArgs` is `.strict()`,
 * so `{ commandId, sqlQuery }` hard-fails with `unrecognized_keys`. Fold any
 * recognized stray input keys into `args.input` (preserving an existing `input`),
 * leaving already-correct `{ commandId, input }` calls untouched.
 */
function repairExecuteCommandArgs(call: unknown): unknown {
  if (!call || typeof call !== 'object' || (call as {apiName?: unknown}).apiName !== 'executeCommand') {
    return call;
  }
  const args = (call as {args?: unknown}).args;
  if (!args || typeof args !== 'object' || !('commandId' in args)) return call;
  const argsObj = args as Record<string, unknown>;
  const strayKeys = EXECUTE_COMMAND_INPUT_KEYS.filter((k) => k in argsObj);
  if (strayKeys.length === 0) return call;
  const existingInput =
    argsObj.input && typeof argsObj.input === 'object' ? (argsObj.input as Record<string, unknown>) : {};
  const movedInput: Record<string, unknown> = {...existingInput};
  const nextArgs: Record<string, unknown> = {commandId: argsObj.commandId};
  for (const k of strayKeys) movedInput[k] = argsObj[k];
  nextArgs.input = movedInput;
  return {...(call as Record<string, unknown>), args: nextArgs};
}

/**
 * Repairs the common ways models malform the `executeApi` input before Zod
 * validation runs against the *whole* `{call, reasoning}` envelope:
 *
 *  - `call` emitted as a JSON string (or double-encoded string-of-a-string),
 *  - the real call wrapped in a redundant `{call, reasoning}` envelope (itself
 *    sometimes stringified),
 *  - `reasoning` buried *inside* the stringified `call` while the sibling
 *    top-level `reasoning` is left empty (the exact failure that hard-fails an
 *    otherwise-valid `createChart` call with `reasoning: expected string`),
 *  - `executeCommand` input keys (e.g. `sqlQuery`) placed directly under `args`
 *    instead of `args.input` (folded back into `args.input`).
 *
 * Operating on the envelope (not just `call`) lets us hoist a recovered
 * `reasoning` up to the top level so a single malformed call still validates.
 */
export function normalizeExecuteApiInput(input: unknown): unknown {
  // The whole input may itself be a JSON string or a nested `{call}` wrapper.
  let root = input;
  if (typeof root === 'string') root = tryParseJson(root);
  if (root && typeof root === 'object' && 'call' in root && !('apiName' in root)) {
    const envelope = root as {call: unknown; reasoning?: unknown};
    const {result: call, trailingReasoning} = unwrapCall(envelope.call);
    let reasoning = envelope.reasoning;
    // Hoist a `reasoning` the model buried inside the stringified call.
    if (reasoning == null && call && typeof call === 'object' && 'reasoning' in call) {
      reasoning = (call as {reasoning?: unknown}).reasoning;
    }
    // Hoist reasoning recovered from trailing junk in the malformed string.
    if (reasoning == null && trailingReasoning) {
      reasoning = trailingReasoning;
    }
    return {call: repairExecuteCommandArgs(call), reasoning};
  }
  // Bare `{apiName, args, reasoning?}` (no `call` wrapper) — wrap it.
  if (root && typeof root === 'object' && 'apiName' in root) {
    const bare = root as {reasoning?: unknown};
    return {call: repairExecuteCommandArgs(root), reasoning: bare.reasoning};
  }
  return root;
}