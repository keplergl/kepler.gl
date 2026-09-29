// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {FC} from 'react';
import styled from 'styled-components';

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
  padding: 8px 12px 8px 8px;
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

  .kg-checkbox,
  .kg-checkbox__label {
    margin-left: 0;
    margin-bottom: 0;
  }
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
            {item.selectable ? (
              <CardCheck title={item.selectionLabel} onClick={event => event.stopPropagation()}>
                <Checkbox
                  id={`upload-file-${index}`}
                  type="checkbox"
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
