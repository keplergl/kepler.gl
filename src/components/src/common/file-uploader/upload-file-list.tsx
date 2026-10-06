// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {FC} from 'react';
import styled, {keyframes} from 'styled-components';

import {media} from '@kepler.gl/styles';
import Checkbox from '../checkbox';
import {FileType} from '../icons';

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

const CardName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  font-weight: 500;
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
              <CardName title={item.name}>{item.name}</CardName>
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
