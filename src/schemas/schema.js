// Copyright (c) 2018 Uber Technologies, Inc.
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
  constructor({version, key, properties} = {}) {
    this.version = version;
    this.properties = properties;
    this.key = key;
  }

  loadPropertiesOrApplySchema(node, parent, accumulator) {
    return this._getPropertyValueFromSchema('load', node, parent, accumulator);
  }

  savePropertiesOrApplySchema(node, parent, accumulator) {
    return this._getPropertyValueFromSchema('save', node, parent, accumulator);
  }

  _getPropertyValueFromSchema(operation, node, parent, accumulator) {
    const internal = `_${operation}`;
    return {
      [this.key]: this.properties
        ? Object.keys(this.properties).reduce((accu, key) => {
            return {
              ...accu,
              ...(key in node
                ? this.properties[key]
                  ? // if it's another schema
                    this.properties[key][operation]
                    ? // call save or load
                      this.properties[key][internal](node[key], node, accu)
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
      Console.error(
        `${this.key} ${
          this.version
        } is outdated. save should not be called anymore`
      );
    }
  }

  _save(...args) {
    // make sure nothing is saved to an outdated version
    this.outdatedVersionError();
    return this.save(...args);
  }

  save(node, parent, accumulator = {}) {
    return this.savePropertiesOrApplySchema(node, parent, accumulator);
  }

  _load(...args) {
    return this.load(...args);
  }

  load(node, parent, accumulator = {}) {
    return this.loadPropertiesOrApplySchema(node, parent, accumulator);
  }
}
