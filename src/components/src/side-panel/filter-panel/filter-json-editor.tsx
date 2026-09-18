// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';
import {applyFilterConfig} from '@kepler.gl/actions';
import {visStateLens} from '@kepler.gl/reducers';
import {VisState} from '@kepler.gl/schemas';
import {Filter} from '@kepler.gl/types';

import {withState} from '../../injector';
import JsonEditor from '../../common/json-editor';
import {
  applyStatus,
  errorStatus,
  filterToJson,
  jsonToFilterConfig,
  JsonEditorStatus,
  useDebounce
} from '../../common/json-editor-utils';

const StyledFilterJsonEditor = styled.div`
  padding: 8px 12px 12px;
  background-color: ${props => props.theme.panelBackground};
`;

export type FilterJsonEditorProps = {
  filter: Filter;
  visState?: VisState;
  applyFilterConfig?: typeof applyFilterConfig;
};

function FilterJsonEditorFactory() {
  const FilterJsonEditor: React.FC<FilterJsonEditorProps> = ({
    filter,
    visState,
    applyFilterConfig: applyFilterConfigAction
  }) => {
    const jsonText = useMemo(
      () => (visState?.schema ? filterToJson(filter, visState.schema) : '{}'),
      [filter, visState?.schema]
    );
    const debouncedJsonText = useDebounce(jsonText, 300);

    const handleApply = useCallback(
      (text: string): JsonEditorStatus => {
        try {
          if (!applyFilterConfigAction) {
            return applyStatus(false);
          }
          applyFilterConfigAction(filter.id, jsonToFilterConfig(text, filter));
          return applyStatus(true);
        } catch (error) {
          return errorStatus(error);
        }
      },
      [applyFilterConfigAction, filter]
    );

    return (
      <StyledFilterJsonEditor className="filter-json-editor">
        <JsonEditor jsonText={debouncedJsonText} onApply={handleApply} height={220} />
      </StyledFilterJsonEditor>
    );
  };

  return withState([visStateLens], () => ({}), {applyFilterConfig})(
    FilterJsonEditor
  ) as React.FC<FilterJsonEditorProps>;
}

export default FilterJsonEditorFactory;
