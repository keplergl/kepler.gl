// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {console as Console} from 'global/window';
import {z} from 'zod';

import {CURRENT_VERSION} from './versions';

const propertyValueSchema = z.unknown().optional();
const propertySchemas = new WeakMap<
  object,
  {keys: string[]; schema: z.ZodObject<Record<string, typeof propertyValueSchema>>}
>();

/** Compile the legacy property declarations without narrowing saved-map values. */
function getPropertySchema(properties: object) {
  const keys = Object.keys(properties);
  const cached = propertySchemas.get(properties);
  if (
    cached &&
    cached.keys.length === keys.length &&
    cached.keys.every((key, index) => key === keys[index])
  ) {
    return cached.schema;
  }

  const schema = z.object(Object.fromEntries(keys.map(key => [key, propertyValueSchema])));
  propertySchemas.set(properties, {keys, schema});
  return schema;
}

export default class Schema {
  version: string;
  key: string;
  properties:
    | {
        [key: string]: null | Schema;
      }
    | string[]
    | null;

  constructor({
    version = CURRENT_VERSION,
    key = '',
    properties = null
  }: {
    version?: string;
    key?: string;
    properties?:
      | {
          [key: string]: null | Schema;
        }
      | string[]
      | null;
  } = {}) {
    this.version = version;
    this.properties = properties;
    this.key = key;
  }

  loadPropertiesOrApplySchema(
    node: any,
    parents: any[] = [],
    accumulator?: any
  ): {[key: string]: any} {
    return this._getPropertyValueFromSchema('load', node, parents, accumulator);
  }

  savePropertiesOrApplySchema(
    node: any,
    parents: object[] = [],
    accumulator?: any
  ): {[key: string]: any} {
    return this._getPropertyValueFromSchema('save', node, parents, accumulator);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getPropertyValueFromSchema(operation, node: any, parents: object[] = [], accumulator) {
    const properties = this.properties;
    if (!properties) {
      return {[this.key]: node};
    }

    // Zod selects declared properties and preserves absent vs explicitly undefined
    // values. Leaves remain opaque: layers, metadata and custom extensions own
    // their validation, and dataset cells must retain their JSON serializers.
    const selected = getPropertySchema(properties).parse(node);
    const internal = `_${operation}`;
    return {
      [this.key]: Object.keys(selected).reduce((accu, key) => {
        const property = properties[key];
        return {
          ...accu,
          ...(property
            ? property[operation]
              ? property[internal](selected[key], [...parents, node], accu)
              : {}
            : {[key]: selected[key]})
        };
      }, {})
    };
  }

  _isCurrentVersion() {
    return this.version === CURRENT_VERSION;
  }

  outdatedVersionError() {
    if (!this._isCurrentVersion()) {
      Console.error(`${this.key} ${this.version} is outdated. save should not be called anymore`);
    }
  }

  _save(...args) {
    // make sure nothing is saved to an outdated version
    this.outdatedVersionError();
    // @ts-expect-error
    return this.save(...args);
  }

  save(node: any, parents: object[] = [], accumulator: any = {}): {[key: string]: any} {
    return this.savePropertiesOrApplySchema(node, parents, accumulator);
  }

  _load(...args) {
    // @ts-expect-error
    return this.load(...args);
  }

  load(node: any, parents: object[] = [], accumulator: any = {}): {[key: string]: any} {
    return this.loadPropertiesOrApplySchema(node, parents, accumulator);
  }
}
