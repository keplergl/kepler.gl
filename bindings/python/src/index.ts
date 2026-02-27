import type {WidgetModel} from './types';
import {KeplerGlWidget} from './widget';
import './styles.css';

export default {
  initialize({model}: {model: WidgetModel}) {
    return () => {};
  },

  render({model, el}: {model: WidgetModel; el: HTMLElement}) {
    const widget = new KeplerGlWidget(model, el);
    widget.mount();

    model.on('change:data', () => widget.onDataChange());
    model.on('change:config', () => widget.onConfigChange());
    model.on('change:height', () => widget.onHeightChange());

    return () => {
      widget.unmount();
    };
  }
};
