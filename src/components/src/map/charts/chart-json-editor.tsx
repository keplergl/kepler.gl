// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';
import {updateChart} from '@kepler.gl/actions';
import {visStateLens} from '@kepler.gl/reducers';
import {VisState} from '@kepler.gl/schemas';
import {ChartConfig} from '@kepler.gl/types';

import {withState} from '../../injector';
import JsonEditor from '../../common/json-editor';
import {
  applyStatus,
  chartToJson,
  errorStatus,
  JsonEditorStatus,
  parseAndValidateChartConfig,
  useDebounce
} from '../../common/json-editor-utils';

const StyledChartJsonEditor = styled.div`
  padding: 8px 8px 12px;
  background-color: ${props => props.theme.panelBackground};
`;

export type ChartJsonEditorProps = {
  chart: ChartConfig;
  visState?: VisState;
  updateChart?: typeof updateChart;
  onClose?: (event?: React.MouseEvent) => void;
};

function ChartJsonEditorFactory() {
  const ChartJsonEditor: React.FC<ChartJsonEditorProps> = ({
    chart,
    visState,
    updateChart: updateChartAction,
    onClose
  }) => {
    const jsonText = useMemo(() => chartToJson(chart, visState?.schema), [chart, visState?.schema]);
    const debouncedJsonText = useDebounce(jsonText, 300);

    const handleApply = useCallback(
      (text: string): JsonEditorStatus => {
        try {
          if (!visState || !updateChartAction) {
            return applyStatus(false);
          }
          const parsed = parseAndValidateChartConfig(
            text,
            chart,
            visState.datasets,
            visState.layers
          );
          updateChartAction(chart.id, parsed);
          return applyStatus(true);
        } catch (error) {
          return errorStatus(error);
        }
      },
      [chart, updateChartAction, visState]
    );

    return (
      <StyledChartJsonEditor className="chart-json-editor">
        <JsonEditor
          jsonText={debouncedJsonText}
          onApply={handleApply}
          onClose={onClose}
          height={260}
        />
      </StyledChartJsonEditor>
    );
  };

  return withState([visStateLens], () => ({}), {updateChart})(
    ChartJsonEditor
  ) as React.FC<ChartJsonEditorProps>;
}

export default ChartJsonEditorFactory;
