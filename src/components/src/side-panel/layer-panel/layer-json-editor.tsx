// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import {applyLayerConfig} from '@kepler.gl/actions';
import {Layer} from '@kepler.gl/layers';
import {visStateLens} from '@kepler.gl/reducers';
import {VisState} from '@kepler.gl/schemas';

import {withState} from '../../injector';
import JsonEditor from '../../common/json-editor';
import {
  applyStatus,
  errorStatus,
  JsonEditorStatus,
  layerToJson,
  parseAndValidateLayerConfig,
  useDebounce
} from '../../common/json-editor-utils';

export type LayerJsonEditorProps = {
  layer: Layer;
  visState?: VisState;
  applyLayerConfig?: typeof applyLayerConfig;
};

function LayerJsonEditorFactory() {
  const LayerJsonEditor: React.FC<LayerJsonEditorProps> = ({
    layer,
    visState,
    applyLayerConfig: applyLayerConfigAction
  }) => {
    const jsonText = useMemo(
      () => (visState?.schema ? layerToJson(layer, visState.schema) : '{}'),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [layer, layer.config, visState?.schema]
    );
    const debouncedJsonText = useDebounce(jsonText, 300);

    const handleApply = useCallback(
      (text: string): JsonEditorStatus => {
        try {
          if (!visState || !applyLayerConfigAction) {
            return applyStatus(false);
          }
          const parsed = parseAndValidateLayerConfig(
            text,
            visState.datasets,
            visState.layerClasses,
            visState.schema
          );
          const layerIndex = visState.layers.findIndex(item => item.id === layer.id);
          applyLayerConfigAction(layer.id, parsed, layerIndex >= 0 ? layerIndex : undefined);
          return applyStatus(true);
        } catch (error) {
          return errorStatus(error);
        }
      },
      [applyLayerConfigAction, layer.id, visState]
    );

    return <JsonEditor jsonText={debouncedJsonText} onApply={handleApply} height={280} />;
  };

  return withState([visStateLens], () => ({}), {applyLayerConfig})(
    LayerJsonEditor
  ) as React.FC<LayerJsonEditorProps>;
}

export default LayerJsonEditorFactory;
