// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {console as Console} from 'global/window';

import {CURRENT_VERSION} from './versions';

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
    const internal = `_${operation}`;
    return {
      [this.key]: this.properties
        ? Object.keys(this.properties).reduce((accu, key) => {
            return {
              ...accu,
              ...(key in node
                ? // @ts-expect-error
                  this.properties[key]
                  ? // if it's another schema
                    // @ts-expect-error
                    this.properties[key][operation]
                    ? // call save or load
                      // @ts-expect-error
                      this.properties[key][internal](node[key], [...parents, node], accu)
                    : {}
                  : {[key]: node[key]}
                : {})
            };
          }, {})
        : node
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
