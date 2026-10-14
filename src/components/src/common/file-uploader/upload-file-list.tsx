// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {FC} from 'react';
import {useIntl} from 'react-intl';
import styled, {keyframes} from 'styled-components';

import {media} from '@kepler.gl/styles';
import {getApplicationConfig} from '@kepler.gl/utils';
import Checkbox from '../checkbox';
import {FileType, WarningSign} from '../icons';
import TippyTooltip from '../tippy-tooltip';

function rowCountOf(record: Record<string, unknown>): number | null {
  const arrowTable = record.arrowTable as {numRows?: number} | undefined;
  if (typeof arrowTable?.numRows === 'number') {
    return arrowTable.numRows;
  }
  if (Array.isArray(record.cols) && record.cols.length) {
    const length = (record.cols[0] as {length?: number} | undefined)?.length;
    if (typeof length === 'number' && length > 0) {
      return length;
    }
  }
  if (Array.isArray(record.rows)) {
    return record.rows.length;
  }
  if (Array.isArray(record.allData)) {
    return record.allData.length;
  }
  return null;
}

/** Row count for a parsed file, including Arrow columns and saved maps. */
export function countDatasetRows(data: unknown, depth = 0): number | null {
  if (!data || typeof data !== 'object' || depth > 4) {
    return null;
  }
  const record = data as Record<string, unknown>;
  const direct = rowCountOf(record);
  if (direct != null) {
    return direct;
  }
  if (record.data && record.data !== data) {
    const nested = countDatasetRows(record.data, depth + 1);
    if (nested != null) {
      return nested;
    }
  }
  if (Array.isArray(record.datasets)) {
    let total = 0;
    let known = false;
    for (const dataset of record.datasets) {
      const count = countDatasetRows(dataset, depth + 1);
      if (count != null) {
        known = true;
        total += count;
      }
    }
    return known ? total : null;
  }
  return null;
}

/** True when the row count or the file size reaches its configured warning cutoff. */
export function isLargeDatasetUpload({
  rows,
  bytes
}: {
  rows?: number | null;
  bytes?: number | null;
} = {}): boolean {
  const {largeDatasetWarningRows, largeDatasetWarningBytes} = getApplicationConfig();
  if (
    largeDatasetWarningRows !== false &&
    typeof rows === 'number' &&
    rows >= largeDatasetWarningRows
  ) {
    return true;
  }
  return (
    largeDatasetWarningBytes !== false &&
    typeof bytes === 'number' &&
    bytes >= largeDatasetWarningBytes
  );
}

export type StagedDatasetRef = {
  info?: {id?: string; label?: string};
  metadata?: {source?: string};
};

/** Key shared by a card and the staged dataset it will add. Remote URLs use the URL. */
export function datasetSelectionKey(item?: StagedDatasetRef | null): string {
  return item?.metadata?.source || item?.info?.label || item?.info?.id || '';
}

export function selectedStagedDatasets<T extends StagedDatasetRef>(
  staged: T[] | null | undefined,
  deselected?: Record<string, boolean>
): T[] {
  return (staged || []).filter(item => {
    const key = datasetSelectionKey(item);
    return Boolean(key) && !deselected?.[key];
  });
}

export type UploadFileListItem = {
  id?: string;
  name: string;
  ext: string;
  status: string;
  percent: number;
  isError?: boolean;
  isSuccess?: boolean;
  isLarge?: boolean;
  selectable?: boolean;
  selected?: boolean;
  selectionLabel?: string;
  onToggle?: () => void;
};

type UploadFileListProps = {
  title?: string;
  items: UploadFileListItem[];
};

const List = styled.div.attrs({
  className: 'upload-file-list'
})`
  width: 320px;
  flex-shrink: 0;
  max-height: 420px;
  overflow-y: auto;

  ${media.portable`
    width: 100%;
    max-height: 240px;
  `}
`;

const ListTitle = styled.div`
  font-size: 13px;
  color: ${props => props.theme.textColorLT};
  margin-bottom: 8px;
`;

const Card = styled.div.attrs({
  className: 'file-upload-progress__message'
})<{$isError?: boolean}>`
  position: relative;
  overflow: hidden;
  background: #fff;
  color: ${props => (props.$isError ? props.theme.errorColor : props.theme.textColorLT)};
  border: 1px solid
    ${props => (props.$isError ? props.theme.errorColor : props.theme.selectBorderColorLT)};
  border-radius: 4px;
  box-shadow: 0 0 5px -2px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Progress = styled.div<{$percent: number}>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${props => props.$percent}%;
  background: rgba(36, 115, 189, 0.12);
`;

const CardBody = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  /* Icon is 36px. A centered 16px control then sits 18px from the top and bottom. */
  padding: 8px 18px 8px 8px;
`;

const IconWrap = styled.div`
  flex-shrink: 0;
  color: ${props => props.theme.subtextColorLT};
`;

const CardText = styled.div`
  min-width: 0;
  flex: 1;
`;

const CardNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
`;

const CardName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  font-weight: 500;
`;

const LargeDatasetTooltip = styled.div`
  max-width: 240px;
  white-space: normal;
  line-height: 1.4;
`;

const LargeDatasetTag = styled.button.attrs({
  type: 'button',
  className: 'upload-file-list__large-dataset'
})`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: 16px;
  margin: 0;
  padding: 0 5px 0 3px;
  border: 0;
  border-radius: 2px;
  background: #fff4e5;
  color: #9a5b00;
  font-size: 10px;
  font-weight: 600;
  line-height: 16px;
  cursor: help;

  svg {
    display: block;
  }
`;

const CardCheck = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.theme.checkboxWidth}px;
  height: ${props => props.theme.checkboxHeight}px;

  .kg-checkbox {
    margin: 0;
    min-height: 0;
    width: ${props => props.theme.checkboxWidth}px;
    height: ${props => props.theme.checkboxHeight}px;
  }

  .kg-checkbox__label {
    display: block;
    box-sizing: border-box;
    width: ${props => props.theme.checkboxWidth}px;
    height: ${props => props.theme.checkboxHeight}px;
    margin: 0;
    padding: 0 0 0 ${props => props.theme.checkboxWidth}px;
    line-height: ${props => props.theme.checkboxHeight}px;
  }

  .kg-checkbox__label::before {
    box-sizing: border-box;
    width: ${props => props.theme.checkboxWidth}px;
    height: ${props => props.theme.checkboxHeight}px;
  }
`;

/** Names the checkbox for assistive tech without taking space in the card. */
const CheckLabel = styled.span.attrs({
  className: 'upload-file-list__check-label'
})`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const CardStatus = styled.div<{$isError?: boolean}>`
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 11px;
  line-height: 14px;
  color: ${props => (props.$isError ? props.theme.errorColor : props.theme.subtextColorLT)};
`;

// Transform-only so the compositor can keep it moving while parsing blocks the main thread.
const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const StatusSpinner = styled.span.attrs({
  className: 'upload-file-list__spinner',
  'aria-hidden': true
})`
  display: block;
  flex-shrink: 0;
  width: ${props => props.theme.checkboxWidth}px;
  height: ${props => props.theme.checkboxHeight}px;
  box-sizing: border-box;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.borderColorLT};
  border-top-color: ${props => props.theme.primaryBtnBgd};
  will-change: transform;
  animation: ${spin} 0.7s linear infinite;
`;

const UploadFileList: FC<UploadFileListProps> = ({title, items}) => {
  const intl = useIntl();
  const largeDatasetLabel = intl.formatMessage({id: 'fileUploader.largeDataset'});
  const largeDatasetWarning = intl.formatMessage({id: 'fileUploader.largeDatasetWarning'});

  if (!items.length) {
    return null;
  }

  return (
    <List>
      {title ? <ListTitle>{title}</ListTitle> : null}
      {items.map((item, index) => (
        <Card key={`${item.id || item.name}-${item.status}`} $isError={item.isError}>
          {!item.isSuccess && !item.isError ? (
            <Progress $percent={Math.round(item.percent * 100)} />
          ) : null}
          <CardBody>
            <IconWrap>
              <FileType ext={item.ext} height="36px" fontSize="8px" />
            </IconWrap>
            <CardText>
              <CardNameRow>
                <CardName title={item.name}>{item.name}</CardName>
                {item.isLarge ? (
                  <TippyTooltip
                    placement="top"
                    isLightTheme
                    render={() => <LargeDatasetTooltip>{largeDatasetWarning}</LargeDatasetTooltip>}
                  >
                    <LargeDatasetTag
                      aria-label={largeDatasetWarning}
                      onClick={event => event.stopPropagation()}
                    >
                      <WarningSign height="12px" />
                      {largeDatasetLabel}
                    </LargeDatasetTag>
                  </TippyTooltip>
                ) : null}
              </CardNameRow>
              <CardStatus $isError={item.isError} title={item.status}>
                {item.status}
              </CardStatus>
            </CardText>
            {!item.isSuccess && !item.isError ? (
              <CardCheck>
                <StatusSpinner />
              </CardCheck>
            ) : item.selectable ? (
              <CardCheck title={item.selectionLabel} onClick={event => event.stopPropagation()}>
                <Checkbox
                  id={`upload-file-${index}`}
                  type="checkbox"
                  label={
                    item.selectionLabel ? <CheckLabel>{item.selectionLabel}</CheckLabel> : undefined
                  }
                  checked={Boolean(item.selected)}
                  onChange={() => item.onToggle?.()}
                />
              </CardCheck>
            ) : null}
          </CardBody>
        </Card>
      ))}
    </List>
  );
};

export default UploadFileList;
