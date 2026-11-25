// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useId, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import styled from 'styled-components';

import {h3IsValid} from '@kepler.gl/common-utils';
import {ALL_FIELD_TYPES, DATASET_FORMATS} from '@kepler.gl/constants';
import type {FileLoading, ProtoDataset} from '@kepler.gl/types';

import {Button, TextAreaLight} from '../common/styled-components';

const INPUT_LIMIT = 250_000;
const ERROR_EXAMPLES = 5;

const PasteH3Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  min-height: 0;
  overflow-y: auto;

  textarea {
    width: 100%;
    box-sizing: border-box;
    resize: vertical;
  }

  .paste-h3-error {
    color: ${props => props.theme.errorColor};
    overflow-wrap: anywhere;
  }
`;

function parseH3Cells(input: string) {
  const ids = new Set<string>();
  const examples: string[] = [];
  const tooLong = input.length > INPUT_LIMIT;
  let invalidCount = 0;

  if (!tooLong) {
    for (const token of input.split(/[\s,]+/)) {
      if (!token) continue;
      const id = token.toLowerCase();
      if (/^[0-9a-f]{15}$/.test(id) && h3IsValid(id)) {
        ids.add(id);
      } else {
        invalidCount++;
        if (examples.length < ERROR_EXAMPLES) {
          examples.push(token.length > 40 ? `${token.slice(0, 40)}…` : token);
        }
      }
    }
  }
  return {ids, examples, invalidCount, tooLong};
}

type PasteH3Props = {
  onAddH3: (dataset: ProtoDataset) => void;
  fileLoading: FileLoading | false;
};

export default function PasteH3({onAddH3, fileLoading}: PasteH3Props) {
  const intl = useIntl();
  const id = useId();
  const [input, setInput] = useState('');
  const {ids, examples, invalidCount, tooLong} = useMemo(() => parseH3Cells(input), [input]);
  const canAdd = ids.size > 0 && !tooLong && !invalidCount && !fileLoading;
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;
  const hasError = tooLong || invalidCount > 0;
  const error = tooLong
    ? intl.formatMessage({id: 'modal.loadData.h3TooLong'}, {limit: INPUT_LIMIT})
    : intl.formatMessage(
        {id: 'modal.loadData.h3Invalid'},
        {count: invalidCount, examples: examples.join(', ')}
      );

  return (
    <PasteH3Form
      onSubmit={event => {
        event.preventDefault();
        if (!canAdd) return;

        onAddH3({
          info: {
            label: intl.formatMessage({id: 'modal.loadData.h3Label'}),
            format: DATASET_FORMATS.row
          },
          data: {
            fields: [{name: 'hex_id', type: ALL_FIELD_TYPES.h3, analyzerType: 'H3'}],
            rows: Array.from(ids, cell => [cell])
          }
        });
      }}
    >
      <label htmlFor={id}>{intl.formatMessage({id: 'modal.loadData.h3Label'})}</label>
      <div id={helpId}>{intl.formatMessage({id: 'modal.loadData.h3Help'})}</div>
      <TextAreaLight
        id={id}
        value={input}
        rows={6}
        spellCheck={false}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${helpId} ${errorId}` : helpId}
        onChange={event => setInput(event.target.value)}
      />
      {hasError && (
        <div id={errorId} role="status" className="paste-h3-error">
          {error}
        </div>
      )}
      <Button type="submit" cta disabled={!canAdd}>
        {intl.formatMessage({id: 'layerManager.addData'})}
      </Button>
    </PasteH3Form>
  );
}
