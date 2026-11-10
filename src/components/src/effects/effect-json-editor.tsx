// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import {updateEffect} from '@kepler.gl/actions';
import {visStateLens} from '@kepler.gl/reducers';
import {VisState} from '@kepler.gl/schemas';
import {Effect, EffectPropsPartial} from '@kepler.gl/types';

import {withState} from '../injector';
import JsonEditor from '../common/json-editor';
import {
  applyStatus,
  effectToJson,
  errorStatus,
  jsonToEffectProps,
  JsonEditorStatus,
  useDebounce
} from '../common/json-editor-utils';

export type EffectJsonEditorProps = {
  effect: Effect;
  visState?: VisState;
  updateEffect?: typeof updateEffect;
  onClose?: (event?: React.MouseEvent) => void;
};

function EffectJsonEditorFactory() {
  const EffectJsonEditor: React.FC<EffectJsonEditorProps> = ({
    effect,
    visState,
    updateEffect: updateEffectAction,
    onClose
  }) => {
    // Effect instances are updated in place, so read their current properties on render.
    const jsonText = visState?.schema ? effectToJson(effect, visState.schema) : '{}';
    const debouncedJsonText = useDebounce(jsonText, 300);

    const handleApply = useCallback(
      (text: string): JsonEditorStatus => {
        try {
          if (!updateEffectAction) {
            return applyStatus(false);
          }
          updateEffectAction(effect.id, jsonToEffectProps(text, effect) as EffectPropsPartial);
          return applyStatus(true);
        } catch (error) {
          return errorStatus(error);
        }
      },
      [effect, updateEffectAction]
    );

    return (
      <JsonEditor
        jsonText={debouncedJsonText}
        onApply={handleApply}
        onClose={onClose}
        height={260}
      />
    );
  };

  return withState([visStateLens], () => ({}), {updateEffect})(
    EffectJsonEditor
  ) as React.FC<EffectJsonEditorProps>;
}

export default EffectJsonEditorFactory;
