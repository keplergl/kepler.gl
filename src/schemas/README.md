# Saved-map schemas

`ZodSchemas` exports composable Zod 4 definitions and inferred types for saved v1
maps, datasets, map/UI state, every built-in layer, filters, effects, interactions,
charts, annotations, bookmarks, and camera tours. The definitions are the source
of persisted property lists used by the schema manager.

```ts
import KeplerGlSchema, {ZodSchemas} from '@kepler.gl/schemas';

const saved = KeplerGlSchema.getConfigToSave(state);
const result = ZodSchemas.SavedConfigSchema.safeParse(saved);
if (!result.success) {
  console.log(result.error.issues); // structured paths, e.g. config.mapState.zoom
}

type Config = ZodSchemas.Config;
type PointLayer = ZodSchemas.PointLayer;
```

Validation is explicit. `save`, `load`, `getConfigToSave`, and `parseSavedConfig`
retain their permissive compatibility contract: they do not reject old values,
coerce fields, or inject Zod defaults. Existing v0 migrations and subclass hooks
still run in declaration order against live parents and accumulated output.
The exported `Schema` class and its mutable property maps remain supported.

Use a specific schema, such as `PointLayerSchema` or `TimeRangeFilterSchema`, to
validate a known type. Built-in layer/effect unions validate known discriminants
without falling back to the custom-type branch on invalid input. Custom layer
and effect types remain supported. Layer visualization settings retain extension
properties; dataset cells, metadata, rich-text editor state and extension-owned
objects deliberately have open schemas.

Schemas describe persisted data rather than transient runtime state. They do not
carry slider bounds or UI defaults from the old #3040 proposal. Load a legacy
config through the manager and save it as v1 before explicitly validating it.
Zod parsing can clone structured values; use the existing manager's save/load
methods when dataset cell identity or custom JSON serializers must be preserved.
