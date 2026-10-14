#!/usr/bin/env node

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * CI typechecks and tests on the Volta pin (Node 24). Node 18 crashes the
 * Tape suite with ERR_REQUIRE_ESM, so the agent commands refuse it up front.
 */
const major = Number(process.versions.node.split('.')[0]);

if (major < 20) {
  console.error(
    `Node ${process.versions.node} is below engines.node >=20. ` +
      'Node.js CI uses the Volta pin 24.21.0.'
  );
  process.exit(1);
}
