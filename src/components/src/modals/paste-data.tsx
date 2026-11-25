// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useId, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import styled from 'styled-components';

import {h3IsValid} from '@kepler.gl/common-utils';
import {ALL_FIELD_TYPES, DATASET_FORMATS} from '@kepler.gl/constants';
import {processCsvData, processGeojson} from '@kepler.gl/processors';
import type {FileLoading, ProtoDataset} from '@kepler.gl/types';

import {Button, TextAreaLight} from '../common/styled-components';

const INPUT_LIMIT = 250_000;
const ERROR_EXAMPLES = 5;

const PasteDataForm = styled.form`
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

  .paste-data-error {
    color: ${props => props.theme.errorColor};
    overflow-wrap: anywhere;
  }
`;

const H3_ID_PATTERN = /^[0-9a-f]{15}$/i;

function detectFormat(input: string) {
  if (/^[{\[]/.test(input)) return 'geojson';
  const lineBreak = input.search(/[\r\n]/);
  if (lineBreak < 0) return 'h3';
  const header = input.slice(0, lineBreak);
  // An unheaded H3 list may also contain commas and newlines. Do not read
  // the first of those IDs as CSV column headings.
  if (header.split(/[\s,]+/).some(token => H3_ID_PATTERN.test(token))) return 'h3';
  if (header.includes(',') || /^(h3|h3_id|hex_id|hexagon_id)$/i.test(header.trim())) return 'csv';
  if (
    /^[a-z_][\w .-]*$/i.test(header) &&
    !input.split(/[\s,]+/).some(id => H3_ID_PATTERN.test(id))
  ) {
    return 'csv';
  }
  return 'h3';
}

function parseH3Cells(input: string) {
  const ids = new Set<string>();
  const examples: string[] = [];
  let invalidCount = 0;
  for (const token of input.split(/[\s,]+/)) {
    if (!token) continue;
    const id = token.toLowerCase();
    if (H3_ID_PATTERN.test(id) && h3IsValid(id)) {
      ids.add(id);
    } else {
      invalidCount++;
      if (examples.length < ERROR_EXAMPLES) {
        examples.push(token.length > 40 ? `${token.slice(0, 40)}…` : token);
      }
    }
  }
  return {ids, examples, invalidCount};
}

type PasteDataProps = {
  onAddPastedData: (dataset: ProtoDataset) => void;
  fileLoading: FileLoading | false;
  supportsH3: boolean;
};

export default function PasteData({onAddPastedData, fileLoading, supportsH3}: PasteDataProps) {
  const intl = useIntl();
  const id = useId();
  const [input, setInput] = useState('');
  const [parseError, setParseError] = useState('');
  const tooLong = input.length > INPUT_LIMIT;
  const text = tooLong ? '' : input.trim();
  const format = useMemo(() => detectFormat(text), [text]);
  const h3 = useMemo(() => (text && format === 'h3' ? parseH3Cells(text) : null), [format, text]);
  const invalidH3 = Boolean(h3 && h3.invalidCount);
  const unsupportedH3 = Boolean(h3?.ids.size && !supportsH3);
  const canAdd =
    Boolean(text && (format !== 'h3' || (h3?.ids.size && !invalidH3))) &&
    !unsupportedH3 &&
    !fileLoading;
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;
  let error = parseError;
  if (tooLong) {
    error = intl.formatMessage({id: 'modal.loadData.pasteTooLong'}, {limit: INPUT_LIMIT});
  } else if (invalidH3 && h3) {
    error = intl.formatMessage(
      {id: 'modal.loadData.h3Invalid'},
      {count: h3.invalidCount, examples: h3.examples.join(', ')}
    );
  } else if (unsupportedH3) {
    error = intl.formatMessage({id: 'modal.loadData.pasteH3Unavailable'});
  }

  function add() {
    if (h3) {
      onAddPastedData({
        info: {
          label: intl.formatMessage({id: 'modal.loadData.h3Label'}),
          format: DATASET_FORMATS.row
        },
        data: {
          fields: [{name: 'hex_id', type: ALL_FIELD_TYPES.h3, analyzerType: 'H3'}],
          rows: Array.from(h3.ids, cell => [cell])
        }
      });
      return;
    }

    const geojson = format === 'geojson';
    let data: ProtoDataset['data'];
    try {
      const processed = geojson ? processGeojson(JSON.parse(text)) : processCsvData(text);
      if (
        !processed ||
        !processed.rows.length ||
        !processed.fields.length ||
        (!geojson &&
          (processed.fields.some(field => !field.name.trim()) ||
            processed.rows.some(row => row.length !== processed.fields.length)))
      ) {
        throw new Error('Paste input does not contain valid rows');
      }
      data = processed;
    } catch {
      setParseError(
        intl.formatMessage({
          id: geojson ? 'modal.loadData.pasteInvalidGeojson' : 'modal.loadData.pasteInvalidCsv'
        })
      );
      return;
    }

    onAddPastedData({
      info: {
        label: intl.formatMessage({
          id: geojson ? 'modal.loadData.pasteGeojsonLabel' : 'modal.loadData.pasteCsvLabel'
        }),
        format: geojson ? DATASET_FORMATS.geojson : DATASET_FORMATS.csv
      },
      data
    });
  }
  return (
    <PasteDataForm
      onSubmit={event => {
        event.preventDefault();
        if (canAdd) add();
      }}
    >
      <label htmlFor={id}>{intl.formatMessage({id: 'modal.loadData.pasteLabel'})}</label>
      <div id={helpId}>
        {intl.formatMessage({
          id: supportsH3 ? 'modal.loadData.pasteHelp' : 'modal.loadData.pasteHelpWithoutH3'
        })}
      </div>
      <TextAreaLight
        id={id}
        value={input}
        rows={6}
        spellCheck={false}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${helpId} ${errorId}` : helpId}
        onChange={event => {
          setInput(event.target.value);
          setParseError('');
        }}
      />
      {error && (
        <div id={errorId} role="status" className="paste-data-error">
          {error}
        </div>
      )}
      <Button type="submit" cta disabled={!canAdd}>
        {intl.formatMessage({id: 'layerManager.addData'})}
      </Button>
    </PasteDataForm>
  );
}
