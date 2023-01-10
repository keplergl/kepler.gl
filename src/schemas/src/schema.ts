// Copyright (c) 2023 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

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
    parents: object[] = [],
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
