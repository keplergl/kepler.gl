// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {FIELD_TYPE_DISPLAY, FIELD_COLORS} from '@kepler.gl/constants';

export type FieldTokenProps = {
  type: string;
};

function FieldTokenFactory(
  fieldTypeDisplay: ReturnType<typeof getFieldTypes>,
  fieldColors: ReturnType<typeof getFieldColors>
): React.FC<FieldTokenProps> {
  const FieldTag = styled.div`
    background-color: rgba(${props => props.color}, 0.2);
    border-radius: 2px;
    border: 1px solid rgb(${props => props.color});
    color: rgb(${props => props.color});
    display: inline-block;
    font-size: 10px;
    font-weight: 400;
    padding: 0 5px;
    text-align: center;
    width: ${props => props.theme.fieldTokenWidth}px;
    line-height: ${props => props.theme.fieldTokenHeight}px;
  `;

  const FieldToken = ({type}: FieldTokenProps) => (
    <FieldTag
      color={(fieldTypeDisplay[type] && fieldTypeDisplay[type].color) || fieldColors.default}
    >
      {fieldTypeDisplay[type].label}
    </FieldTag>
  );
  return FieldToken;
}

function getFieldTypes() {
  return FIELD_TYPE_DISPLAY;
}

function getFieldColors() {
  return FIELD_COLORS;
}
FieldTokenFactory.deps = [getFieldTypes, getFieldColors];
export default FieldTokenFactory;
