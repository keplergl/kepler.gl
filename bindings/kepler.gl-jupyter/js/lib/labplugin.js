// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

var keplerglJupyter = require('./index');
var base = require('@jupyter-widgets/base');

module.exports = {
  id: 'keplergl-jupyter',
  requires: [base.IJupyterWidgetRegistry],
  activate(app, widgets) {
      widgets.registerWidget({
          name: 'keplergl-jupyter',
          version: keplerglJupyter.version,
          exports: keplerglJupyter
      });
  },
  autoStart: true
};

