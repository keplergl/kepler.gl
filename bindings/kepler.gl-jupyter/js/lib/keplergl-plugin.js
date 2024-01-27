// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as widgets from '@jupyter-widgets/base';
import KeplerGlJupyter from './keplergl/kepler.gl';
import log from './log';

// Custom Model. Custom widgets models must at least provide default values
// for model attributes, including
//
//  - `_view_name`
//  - `_view_module`
//  - `_view_module_version`
//
//  - `_model_name`
//  - `_model_module`
//  - `_model_module_version`
//
//  when different from the base class.

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be specified.

export const KeplerGlModal = widgets.DOMWidgetModel.extend({
  defaults: {
    ...widgets.DOMWidgetModel.prototype.defaults(),
    _model_name: 'KeplerGlModal',
    _view_name: 'KeplerGlView',
    _model_module: 'keplergl-jupyter',
    _view_module: 'keplergl-jupyter',

    data: {},
    config: {}
  }
});

export const KeplerGlView = widgets.DOMWidgetView.extend({
  render() {
    log('KeplerGlModal start render');
    this.keplergl = new KeplerGlJupyter();

    this.keplergl.create(this);

    // event listener
    this.model.on('change:data', this.data_changed, this);
    this.model.on('change:config', this.config_changed, this);

    window.dom = this.el;
  },

  data_changed() {
    log('KeplerGlModal start data_changed');

    this.keplergl.onDataChange(this);
  },

  config_changed() {
    log('KeplerGlModal start config_change');

    this.keplergl.onConfigChange(this);
  }
});
