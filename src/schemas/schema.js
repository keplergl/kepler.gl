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
