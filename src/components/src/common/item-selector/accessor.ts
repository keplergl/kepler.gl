// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const Accessor = {
  IDENTITY_FN: input => input,

  generateAccessor: (field: string) => (object: object) => object[field],

  generateOptionToStringFor: function generateOptionToStringFor(prop) {
    if (typeof prop === 'string') {
      return this.generateAccessor(prop);
    } else if (typeof prop === 'function') {
      return prop;
    }
    return this.IDENTITY_FN;
  },

  valueForOption: (option, object) => {
    if (typeof option === 'string') {
      return object[option];
    } else if (typeof option === 'function') {
      return option(object);
    }
    return object;
  }
};

export default Accessor;
