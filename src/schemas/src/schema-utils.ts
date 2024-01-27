// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Recursively save / load value for state based on property keys,
 * if property[key] is another schema
 * Use is to get value to save
 * @param {Object} state - state to save
 * @param {Object} properties - properties schema
 * @returns {Object} - saved state
 */
export function savePropertiesOrApplySchema(state, properties) {
  return getPropertyValueFromSchema('save', state, properties);
}

export function loadPropertiesOrApplySchema(state, properties) {
  return getPropertyValueFromSchema('load', state, properties);
}

export function getPropertyValueFromSchema(operation, state, properties) {
  return Object.keys(properties).reduce(
    (accu, key) => ({
      ...accu,
      ...(key in state
        ? properties[key]
          ? // if it's another schema
            properties[key][operation]
            ? // call save or load
              properties[key][operation](state[key], state)
            : // if it's another property object
              getPropertyValueFromSchema(operation, state[key], properties[key])
          : {[key]: state[key]}
        : {})
    }),
    {}
  );
}
