// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import styled from 'styled-components';

import {InputLight} from '@kepler.gl/components';
import {VectorTileMetadata} from '@kepler.gl/layers';

export type DatasetCreationAttributes = {
  name: string;
  type: string;
  metadata: Record<string, any>;
};

export type MetaResponse = {
  metadata?: VectorTileMetadata | null;
  dataset?: DatasetCreationAttributes | null;
  loading?: boolean;
  error?: Error | null;
};

const EditorInputLight: typeof InputLight = styled(InputLight)`
  border-radius: ${props => props.theme.borderRadius6};
  background-color: ${props => props.theme.WHITE};
  border-color: ${props => props.theme.WHITE};
  font-size: ${props => props.theme.title2Size};

  &:hover {
    border-color: ${props => props.theme.selectBackgroundLT};
    background-color: ${props => props.theme.selectBackgroundLT};
  }

  &:active,
  &:focus,
  &.focus,
  &.active {
    background-color: ${props => props.theme.selectBackgroundLT};
    border-color: ${props => props.theme.inputBorderActiveColorLT};
  }

  &.invalid {
    border: 1px solid ${props => props.theme.errorColor};
  }
`;

export const StyledInput = styled(EditorInputLight)`
  background-color: ${props => props.theme.GREY10};
  &::placeholder {
    color: ${props => props.theme.AZURE200};
  }
`;
