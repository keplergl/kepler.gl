// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {z} from 'zod';
import type Schema from './schema';

/**
 * Zod definitions own the persisted field list. The public Schema property maps
 * remain mutable compatibility adapters; their hooks retain version migrations
 * and live parent/accumulator access. Save/load does not opt into validation.
 */
export function schemaProperties<
  Shape extends z.ZodRawShape,
  Hooks extends Partial<Record<keyof Shape, Schema>> = Record<never, never>
>(schema: z.ZodObject<Shape>, hooks?: Hooks) {
  return Object.fromEntries(Object.keys(schema.shape).map(key => [key, hooks?.[key] ?? null])) as {
    [Key in keyof Shape]: Key extends keyof Hooks ? Hooks[Key] : null;
  };
}
