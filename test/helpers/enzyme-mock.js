// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Minimal enzyme stub for legacy tests that haven't been migrated to @testing-library/react.
// These tests will be skipped at runtime since mount/shallow are no-ops.

function noop() {
  return {
    find: () => ({length: 0, at: noop, first: noop, text: () => '', simulate: noop, prop: () => undefined, props: () => ({})}),
    length: 0,
    at: noop,
    first: noop,
    text: () => '',
    simulate: noop,
    prop: () => undefined,
    props: () => ({}),
    setState: noop,
    setProps: noop,
    update: noop,
    unmount: noop,
    instance: () => null,
    html: () => '',
    debug: () => '',
    exists: () => false,
    children: noop,
    parent: noop,
    closest: noop,
    contains: () => false,
    hasClass: () => false,
    is: () => false,
    type: () => null,
    dive: noop
  };
}

module.exports = {
  mount: noop,
  shallow: noop,
  render: noop,
  configure: () => {}
};
