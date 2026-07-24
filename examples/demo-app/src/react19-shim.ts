// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// React 19 compatibility shim for libraries that access removed internals.
// React 19 renamed __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED to
// __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE.
// This shim bridges the gap for pre-built libraries (e.g. react-audio-voice-recorder).
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactInternals = React as any;

if (
  typeof ReactInternals.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED === 'undefined' &&
  ReactInternals.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE
) {
  ReactInternals.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED =
    ReactInternals.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
}
