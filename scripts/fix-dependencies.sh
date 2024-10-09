#!/bin/bash

# Here we patch up the dependencies that need to be tweaked to work with our build system after installed

# Per https://github.com/visgl/deck.gl/issues/7735, @mapbox/tiny-sdf is a ESM that we need to transpile
# and consume the cjs version. For some reason, trying to force transpile it through Babel does not work
# as crash happens before it even gets to that point
# We use tail to avoid the first line of the the output which is the command itself
yarn babel node_modules/@mapbox/tiny-sdf/index.js | tail -n +2 > node_modules/@mapbox/tiny-sdf/index.cjs

# Patch for an issue with react-virtualized output having an invalid import
# https://github.com/bvaughn/react-virtualized/issues/1212
if [[ -f "node_modules/react-virtualized/dist/es/WindowScroller/utils/onScroll.js" ]]; then
  sed -i -e '/import { bpfrpt_proptype_WindowScroller } from "..\/WindowScroller.js";/d' node_modules/react-virtualized/dist/es/WindowScroller/utils/onScroll.js
fi
