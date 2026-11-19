// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Keep the deferred import limited to WebM muxing. Importing the full namespace
// prevents single-file browser bundles from pruning unused readers and codecs.
export {
  BufferTarget,
  Output,
  WebMOutputFormat,
  EncodedVideoPacketSource,
  EncodedPacket
} from 'mediabunny';
