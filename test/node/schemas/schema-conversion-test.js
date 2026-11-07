// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';

import SchemaManager, {
  Schema,
  KeplerGLSchemaClass,
  ZodSchemas,
  visStateSchemaV1
} from '@kepler.gl/schemas';
import {LayerClasses} from '@kepler.gl/layers';
import {createEffect} from '@kepler.gl/effects';
import {
  EFFECT_DESCRIPTIONS,
  LAYER_TYPES,
  DEFAULT_GLOBE_CONFIG,
  MapViewMode,
  MapSplitMode
} from '@kepler.gl/constants';
import {
  InitialState,
  StateWFilesFiltersLayerColor,
  StateWEffects,
  StateWTripGeojson,
  StateWTripTable,
  StateWCustomMapStyleLegacy,
  StateWTooltipFormat,
  StateWLayerCustomColorBreaks
} from 'test/helpers/mock-state';
import {cmpParsedAppConfigs} from 'test/helpers/comparison-utils';
import {logStep} from '../../../scripts/log';

import {
  savedConfigV0 as savedConfig0,
  parsedConfigV0 as parsedConfig0
} from 'test/fixtures/config_v0_arc_cluster_point';

import {
  savedConfigV0 as savedConfig1,
  parsedConfigV0 as parsedConfig1
} from 'test/fixtures/config_v0_geojson_poly_fill_ele';

import {
  savedConfigV0 as savedConfig2,
  parsedConfigV0 as parsedConfig2
} from 'test/fixtures/config_v0_geojson_point';

import {
  savedConfigV0 as savedConfig3,
  parsedConfigV0 as parsecConfig3
} from 'test/fixtures/config_v0_geojson_polygon';

const TEST_CASES = [
  {
    name: 'v0 -> v1',
    cases: [
      {
        name: 'load config with arc cluster point layer',
        saved: savedConfig0,
        parsed: parsedConfig0
      },
      {
        name: 'load config with geojson layer',
        saved: savedConfig1,
        parsed: parsedConfig1
      },
      {
        name: 'load config with geojson contains points',
        saved: savedConfig2,
        parsed: parsedConfig2
      },
      {
        name: 'load config with geojson contains 3d and stroked polygon',
        saved: savedConfig3,
        parsed: parsecConfig3
      }
    ]
  }
];

test('#appSchema -> Convert Saved Configs', t => {
  TEST_CASES.forEach(({name, cases}) => {
    logStep(`---> test: ${name}`);

    cases.forEach(cs => {
      logStep(`------> test: ${cs.name}`);

      const parsed = SchemaManager.parseSavedConfig(cs.saved);
      cmpParsedAppConfigs(t, cs.parsed, parsed, {name: cs.name});
    });
  });

  t.end();
});

test('#Schema -> select properties without defaulting or cloning opaque values', t => {
  const cell = {toJSON: () => 'custom cell'};
  const rows = [[cell]];
  const schema = new Schema({
    key: 'config',
    properties: {
      missing: null,
      explicitUndefined: null,
      nullable: null,
      rows: null,
      nested: new Schema({key: 'nested', properties: {enabled: null}})
    }
  });
  const input = {
    explicitUndefined: undefined,
    nullable: null,
    rows,
    nested: {enabled: false, transient: true},
    transient: true
  };
  for (const operation of ['save', 'load']) {
    t.deepEqual(schema[operation]({}), {config: {}}, `${operation}: empty stays empty`);
    const {config} = schema[operation](input);
    t.deepEqual(
      config,
      {explicitUndefined: undefined, nullable: null, rows, nested: {enabled: false}},
      `${operation}: only declared and present properties survive`
    );
    t.ok('explicitUndefined' in config, `${operation}: retains explicit undefined`);
    t.notOk('missing' in config, `${operation}: does not invent missing properties`);
    t.equal(config.rows, rows, `${operation}: retains dataset row references`);
    t.equal(config.rows[0][0], cell, `${operation}: retains custom JSON serializers`);
    t.equal(input.nested.transient, true, `${operation}: does not mutate input`);
    t.throws(() => schema[operation](null), `${operation}: rejects a null property container`);
  }
  t.end();
});

test('#Schema -> custom hooks retain parents, order and accumulated output', t => {
  class CustomSchema extends Schema {
    save(value, parents, accumulated) {
      return {
        combined: [...accumulated.combined, value, parents[0].transient, parents[1].transient]
      };
    }
    load(...args) {
      return this.save(...args);
    }
  }
  const input = {nested: {first: ['start'], second: 'end', transient: 'child'}, transient: 'root'};
  const schema = new Schema({
    key: 'config',
    properties: {
      nested: new Schema({
        key: 'nested',
        properties: {
          first: new Schema({key: 'combined'}),
          second: new CustomSchema()
        }
      })
    }
  });
  for (const operation of ['save', 'load']) {
    t.deepEqual(
      schema[operation](input),
      {config: {nested: {combined: ['start', 'end', 'root', 'child']}}},
      `${operation}: hooks can rename fields and use original parents and earlier output`
    );
    const passthrough = new Schema({key: 'value'});
    for (const value of [undefined, null, input, []]) {
      t.equal(
        passthrough[operation](value).value,
        value,
        `${operation}: opaque values pass through`
      );
    }
  }
  t.end();
});

test('#Schema -> property declarations remain extensible after use', t => {
  const properties = {first: null};
  const schema = new Schema({key: 'config', properties});
  const input = {first: 1, second: 2};
  t.deepEqual(schema.save(input), {config: {first: 1}}, 'uses initial declaration');
  properties.second = null;
  delete properties.first;
  t.deepEqual(schema.save(input), {config: {second: 2}}, 'observes changed declaration keys');
  properties.second = new Schema({key: 'renamed'});
  t.deepEqual(schema.load(input), {config: {renamed: 2}}, 'observes replaced child schemas');
  schema.properties = {first: null};
  t.deepEqual(schema.load(input), {config: {first: 1}}, 'observes replaced declarations');
  t.end();
});

test('#Schema -> child hooks can update, add and remove later siblings', t => {
  class MutatingSchema extends Schema {
    save(value, parents) {
      const parent = parents[parents.length - 1];
      parent.second = 11;
      parent.added = 'created';
      delete parent.removed;
      return {[this.key]: value};
    }
    load(...args) {
      return this.save(...args);
    }
  }
  const schema = new Schema({
    key: 'config',
    properties: {
      first: new MutatingSchema({key: 'first'}),
      second: new Schema({key: 'second'}),
      added: null,
      removed: null,
      derived: null
    }
  });
  for (const operation of ['save', 'load']) {
    const input = {
      first: true,
      second: 0,
      removed: 'old',
      get derived() {
        return this.second * 2;
      }
    };
    t.deepEqual(
      schema[operation](input),
      {config: {first: true, second: 11, added: 'created', derived: 22}},
      `${operation}: reads sibling presence and values after earlier hooks run`
    );
  }
  t.end();
});

test('#Schema -> retains legacy container handling', t => {
  const schema = new Schema({key: 'config', properties: {value: null}});
  const emptySchema = new Schema({key: 'config', properties: {}});
  for (const operation of ['save', 'load']) {
    for (const input of [[], () => {}]) {
      t.deepEqual(schema[operation](input), {config: {}}, `${operation}: no declared properties`);
      input.value = 7;
      t.deepEqual(
        schema[operation](input),
        {config: {value: 7}},
        `${operation}: reads declared properties on array and function containers`
      );
    }
    for (const input of [null, undefined]) {
      t.deepEqual(
        emptySchema[operation](input),
        {config: {}},
        `${operation}: an empty declaration does not inspect the input`
      );
    }
  }
  t.end();
});

test('#Schema -> hooks can replace property declarations during traversal', t => {
  for (const operation of ['save', 'load']) {
    let schema;
    class ReplacingSchema extends Schema {
      save(value) {
        schema.properties = {first: this, second: new Schema({key: 'renamed'})};
        return {first: value};
      }
      load(value) {
        return this.save(value);
      }
    }
    schema = new Schema({key: 'config', properties: {first: new ReplacingSchema(), second: null}});
    t.deepEqual(
      schema[operation]({first: 1, second: 2}),
      {config: {first: 1, renamed: 2}},
      `${operation}: uses the replacement declaration for later siblings`
    );
  }
  t.end();
});

test('#ZodSchemas -> validate saved fixtures without defaults or value changes', t => {
  for (const [name, state] of Object.entries({
    InitialState,
    StateWFilesFiltersLayerColor,
    StateWEffects,
    StateWTripGeojson,
    StateWTripTable,
    StateWCustomMapStyleLegacy,
    StateWTooltipFormat,
    StateWLayerCustomColorBreaks
  })) {
    const saved = SchemaManager.getConfigToSave(state);
    const result = ZodSchemas.SavedConfigSchema.safeParse(saved);
    t.ok(
      result.success,
      `${name}: ${result.success ? 'valid' : JSON.stringify(result.error.issues)}`
    );
    if (result.success)
      t.deepEqual(result.data, saved, `${name}: no defaults, coercion or field loss`);
  }
  const savedMap = SchemaManager.save(StateWFilesFiltersLayerColor);
  const result = ZodSchemas.SavedMapSchema.safeParse(savedMap);
  t.ok(
    result.success,
    `complete map: ${result.success ? 'valid' : JSON.stringify(result.error.issues)}`
  );
  if (result.success)
    t.deepEqual(result.data, savedMap, 'complete map keeps datasets and metadata');
  t.deepEqual(
    ZodSchemas.SavedConfigSchema.parse({version: 'v1', config: {}}),
    {version: 'v1', config: {}},
    'partial configs acquire no defaults'
  );
  const invalid = {version: 'v1', config: {mapState: {zoom: 'legacy-value'}}};
  const rejected = ZodSchemas.SavedConfigSchema.safeParse(invalid);
  t.notOk(rejected.success, 'explicit validation rejects an invalid zoom type');
  if (!rejected.success)
    t.deepEqual(
      rejected.error.issues[0].path,
      ['config', 'mapState', 'zoom'],
      'reports the offending field'
    );
  t.deepEqual(
    SchemaManager.parseSavedConfig(invalid),
    invalid.config,
    'manager retains permissive loading independently of explicit validation'
  );
  t.end();
});

test('#ZodSchemas -> every current built-in layer has typed visualization settings', t => {
  t.deepEqual(
    Object.keys(ZodSchemas.BuiltInLayerSchemas).sort(),
    Object.keys(LAYER_TYPES).sort(),
    'supports every registered layer type'
  );
  for (const [type, LayerClass] of Object.entries(LayerClasses)) {
    const layer = new LayerClass({id: type, dataId: 'schema-test'});
    const saved = visStateSchemaV1.properties.layers.savePropertiesOrApplySchema(layer).layers;
    const result = ZodSchemas.LayerSchema.safeParse(saved);
    t.ok(
      result.success,
      `${type}: ${result.success ? 'valid' : JSON.stringify(result.error.issues)}`
    );
    if (result.success) t.deepEqual(result.data, saved, `${type}: preserves serialized values`);
    for (const [key, value] of Object.entries(layer.config.visConfig)) {
      if (!['number', 'boolean', 'string'].includes(typeof value)) continue;
      const invalid = {
        ...saved,
        config: {...saved.config, visConfig: {...saved.config.visConfig, [key]: {invalid: true}}}
      };
      t.notOk(
        ZodSchemas.LayerSchema.safeParse(invalid).success,
        `${type}.${key}: rejects the wrong type`
      );
    }
  }
  const custom = {
    id: 'custom',
    type: 'custom-layer',
    config: {dataId: 'data', visConfig: {plugin: {value: 1}}}
  };
  t.deepEqual(ZodSchemas.LayerSchema.parse(custom), custom, 'custom layer settings remain open');
  t.end();
});

test('#ZodSchemas -> current effects and filters validate their values', t => {
  for (const description of EFFECT_DESCRIPTIONS) {
    const effect = createEffect({id: description.type, type: description.type});
    const saved = {
      id: effect.id,
      type: effect.type,
      isEnabled: effect.isEnabled,
      parameters: effect.parameters
    };
    const result = ZodSchemas.EffectSchema.safeParse(saved);
    t.ok(
      result.success,
      `${effect.type}: ${result.success ? 'valid' : JSON.stringify(result.error.issues)}`
    );
    if (result.success)
      t.deepEqual(result.data, saved, `${effect.type}: no defaults or parameter loss`);
  }
  t.notOk(
    ZodSchemas.EffectSchema.safeParse({
      id: 'fog',
      type: 'surfaceFog',
      parameters: {density: 'invalid'}
    }).success,
    'invalid built-in effect cannot fall through to the custom effect schema'
  );
  const base = {id: 'filter', dataId: ['data'], name: ['value']};
  for (const [type, value] of [
    ['range', [0, 10]],
    ['timeRange', [0, 1000]],
    ['select', true],
    ['multiSelect', ['a']]
  ]) {
    const filter = {...base, type, value};
    t.deepEqual(ZodSchemas.FilterSchema.parse(filter), filter, `${type}: preserves partial filter`);
    t.notOk(
      ZodSchemas.FilterSchema.safeParse({...filter, value: {invalid: true}}).success,
      `${type}: validates value`
    );
  }
  t.end();
});

test('#ZodSchemas -> cover current map, camera, annotation and interaction features', t => {
  const config = {
    mapState: {
      mapViewMode: MapViewMode.MODE_GLOBE,
      mapSplitMode: MapSplitMode.SWIPE_COMPARE,
      swipeComparePercentage: 42,
      globe: {enabled: true, config: DEFAULT_GLOBE_CONFIG}
    },
    uiState: {locale: 'uk', theme: 'dark', mapControls: {cameraBookmarks: {show: true}}},
    visState: {
      cameraTour: {
        stops: [
          {
            id: 'stop',
            name: 'Stop',
            camera: {longitude: 1, latitude: 2, zoom: 3, bearing: 4, pitch: 5},
            holdDurationMs: 1000,
            travelDurationMs: 2000
          }
        ]
      },
      annotations: [
        {
          id: 'ruler',
          kind: 'RULER',
          anchorPoint: [1, 2, 3],
          endPoint: [4, 5, 6],
          editorState: null,
          mapIndex: null,
          showDistance: true,
          showCustomText: false
        }
      ],
      charts: [{id: 'chart', type: 'barChart', pinned: true, chartDisplay: {custom: true}}],
      interactionConfig: {
        zoomOpacity: {
          enabled: true,
          controllers: [
            {id: 'zoom', layerIds: ['layer'], stops: {appear: 1, full: 2, fade: 10, gone: 12}}
          ]
        }
      }
    }
  };
  t.deepEqual(
    ZodSchemas.ConfigSchema.parse(config),
    config,
    'current saved features survive validation'
  );
  t.end();
});

test('#appSchema -> partial saved configs keep their existing values', t => {
  for (const version of ['v0', 'v1']) {
    t.deepEqual(SchemaManager.parseSavedConfig({version, config: {}}), {}, `${version}: empty map`);
    t.deepEqual(
      SchemaManager.parseSavedConfig({
        version,
        config: {mapState: {longitude: 540, zoom: null, transient: true}, unknownReducer: {}}
      }),
      {mapState: {longitude: 540, zoom: null}},
      `${version}: no coercion, range restriction or new defaults`
    );
  }
  const customLayer = {
    id: 'custom',
    type: 'custom-layer',
    config: {dataId: 'data', visConfig: {extension: {enabled: true}}},
    visualChannels: {customField: {name: 'value', type: 'real'}, customScale: 'custom-scale'}
  };
  t.deepEqual(
    SchemaManager.parseSavedConfig({version: 'v1', config: {visState: {layers: [customLayer]}}}),
    {
      visState: {
        layers: [
          {
            id: customLayer.id,
            type: customLayer.type,
            config: {
              ...customLayer.config,
              ...customLayer.visualChannels
            }
          }
        ]
      }
    },
    'custom layer types, visConfig and visual channels survive loading'
  );
  t.end();
});

test('#appSchema -> custom reducer and composed schema hooks still run', t => {
  const customSchema = new Schema({key: 'custom', properties: {value: null}});
  const manager = new KeplerGLSchemaClass({
    reducers: {custom: {v1: customSchema}},
    composedReducerSchema: {
      save: state => ({custom: {value: state.custom.value + 1, transient: true}}),
      load: config => ({custom: {value: config.custom.value - 1, transient: true}})
    }
  });
  const saved = manager.getConfigToSave({custom: {value: 10}});
  t.deepEqual(saved, {version: 'v1', config: {custom: {value: 11}}}, 'composes before saving');
  t.deepEqual(manager.parseSavedConfig(saved), {custom: {value: 10}}, 'composes before loading');
  t.end();
});
