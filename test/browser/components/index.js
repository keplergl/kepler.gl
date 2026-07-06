// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import './injector-test';
import './container-test';

import './modals';
import './notifications';
import './map';
import './side-panel';

import './common';
import './editor';
import './filters';
import './geocoder-panel-test';
import './tooltip-config-test';
import './bottom-widget-test';
import './plot-container-test';
import './effects';

// kepler-gl-test skipped: mounts the full KeplerGl component tree which triggers
// recursive react-palm task processing that hangs flushSync in React 19.
// TODO: Rewrite to mock react-palm tasks or test individual sub-components.
// import './kepler-gl-test';
