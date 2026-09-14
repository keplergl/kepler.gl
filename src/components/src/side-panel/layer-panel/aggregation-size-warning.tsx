// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {Button} from '../../common/styled-components';

const WarningBox = styled.div`
  margin-top: 8px;
  padding: 8px 10px;
  border-radius: 2px;
  background-color: ${props => props.theme.panelBackgroundHover};
  color: ${props => props.theme.textColor};
  font-size: 11px;
  line-height: 16px;
`;

const WarningText = styled.div`
  color: ${props => props.theme.warningColor || props.theme.errorColor || props.theme.textColorHl};
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  justify-content: flex-end;
`;

export type AggregationSizeWarningProps = {
  cellCount: number;
  onCancel?: () => void;
  onConfirm?: () => void;
  requireConfirm?: boolean;
};

function formatCells(n: number): string {
  return Math.round(n).toLocaleString();
}

export const AggregationSizeWarning: React.FC<AggregationSizeWarningProps> = ({
  cellCount,
  onCancel,
  onConfirm,
  requireConfirm = false
}) => (
  <WarningBox className="aggregation-size-warning">
    <WarningText>
      <FormattedMessage
        id="layer.aggregationSize.slow"
        defaultMessage="The layer aggregation may be slow with up to {cells} cells"
        values={{cells: formatCells(cellCount)}}
      />
    </WarningText>
    {requireConfirm && onConfirm ? (
      <Actions>
        {onCancel ? (
          <Button secondary small type="button" onClick={onCancel}>
            <FormattedMessage id="layer.aggregationSize.cancel" defaultMessage="Cancel" />
          </Button>
        ) : null}
        <Button small type="button" onClick={onConfirm}>
          <FormattedMessage id="layer.aggregationSize.continue" defaultMessage="Continue" />
        </Button>
      </Actions>
    ) : null}
  </WarningBox>
);

export default AggregationSizeWarning;
