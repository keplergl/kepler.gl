// Copyright (c) 2020 Uber Technologies, Inc.
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

/**
 * Recursively save / load value for state based on property keys,
 * if property[key] is another schema
 * Use is to get value to save
 * @param {Object} opertation - 'save' or 'load'
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
