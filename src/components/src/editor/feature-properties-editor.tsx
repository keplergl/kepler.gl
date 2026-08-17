// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import styled from 'styled-components';
import {Feature} from '@deck.gl-community/editable-layers';
import {getUserFeatureProperties, isReservedEditorProperty} from '@kepler.gl/utils';

import {Input} from '../common/styled-components';
import {Trash} from '../common/icons';

type PropertyRow = {
  id: string;
  name: string;
  value: string;
};

type FeaturePropertiesEditorProps = {
  selectedFeature: Feature | null;
  onSetFeatureProperties?: (feature: Feature, properties: Record<string, unknown>) => void;
};

const StyledPropertiesEditor = styled.div`
  background-color: ${props => props.theme.dropdownListBgd};
  box-shadow: ${props => props.theme.dropdownListShadow};
  color: ${props => props.theme.textColor};
  min-width: 260px;
  padding: 8px;
  pointer-events: auto;
`;

const StyledHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 18px;
  gap: 6px;
  font-size: 11px;
  line-height: 12px;
  margin-bottom: 6px;
  opacity: 0.7;
  text-transform: none;
`;

const StyledRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 18px;
  gap: 6px;
  align-items: center;
  margin-bottom: 6px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const StyledPropertyInput = styled(Input)`
  height: 24px;
  font-size: 11px;
  padding: 2px 6px;
  text-transform: none;
  width: 100%;

  &:hover {
    cursor: text;
  }
`;

const StyledRemoveButton = styled.button`
  align-items: center;
  background: none;
  border: 0;
  color: ${props => props.theme.subtextColor};
  cursor: pointer;
  display: flex;
  height: 18px;
  justify-content: center;
  padding: 0;
  width: 18px;

  &:hover {
    color: ${props => props.theme.textColorHl};
  }
`;

let rowCounter = 0;

function createRow(name = '', value = ''): PropertyRow {
  rowCounter += 1;
  return {id: `property-row-${rowCounter}`, name, value};
}

function rowsFromFeature(feature: Feature | null): PropertyRow[] {
  const properties = getUserFeatureProperties(feature as any);
  const rows = Object.entries(properties).map(([name, value]) =>
    createRow(name, value == null ? '' : String(value))
  );
  rows.push(createRow());
  return rows;
}

function userPropertiesFromRows(rows: PropertyRow[]): Record<string, string> {
  return rows.reduce<Record<string, string>>((acc, row) => {
    const name = row.name.trim();
    if (!name || isReservedEditorProperty(name)) {
      return acc;
    }
    acc[name] = row.value;
    return acc;
  }, {});
}

function sameProperties(left: Record<string, unknown>, right: Record<string, unknown>): boolean {
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  for (const key of keys) {
    if (String(left[key] ?? '') !== String(right[key] ?? '')) {
      return false;
    }
  }
  return true;
}

function ensureTrailingEmptyRow(rows: PropertyRow[]): PropertyRow[] {
  const last = rows[rows.length - 1];
  if (!last || last.name.trim() || last.value) {
    return [...rows, createRow()];
  }
  return rows;
}

export default function FeaturePropertiesEditor({
  selectedFeature,
  onSetFeatureProperties
}: FeaturePropertiesEditorProps) {
  const intl = useIntl();
  const [rows, setRows] = useState<PropertyRow[]>(() => rowsFromFeature(selectedFeature));

  useEffect(() => {
    setRows(rowsFromFeature(selectedFeature));
  }, [selectedFeature?.id]);

  const commitRows = useCallback(
    (nextRows: PropertyRow[]) => {
      if (!selectedFeature || !onSetFeatureProperties) {
        return;
      }
      const properties = userPropertiesFromRows(nextRows);
      if (sameProperties(getUserFeatureProperties(selectedFeature as any), properties)) {
        return;
      }
      onSetFeatureProperties(selectedFeature, properties);
    },
    [onSetFeatureProperties, selectedFeature]
  );

  const updateRow = useCallback(
    (id: string, patch: Partial<PropertyRow>, shouldCommit: boolean) => {
      const nextRows = rows.map(row => (row.id === id ? {...row, ...patch} : row));
      const withEmpty = shouldCommit ? ensureTrailingEmptyRow(nextRows) : nextRows;
      setRows(withEmpty);
      if (shouldCommit) {
        commitRows(withEmpty);
      }
    },
    [commitRows, rows]
  );

  const removeRow = useCallback(
    (id: string) => {
      const remaining = rows.filter(row => row.id !== id);
      const nextRows = remaining.length ? ensureTrailingEmptyRow(remaining) : [createRow()];
      setRows(nextRows);
      commitRows(nextRows);
    },
    [commitRows, rows]
  );

  return (
    <StyledPropertiesEditor
      className="feature-properties-editor"
      onMouseDown={event => event.stopPropagation()}
      onClick={event => event.stopPropagation()}
    >
      <StyledHeader>
        <span>{intl.formatMessage({id: 'editor.propertyName', defaultMessage: 'Property'})}</span>
        <span>{intl.formatMessage({id: 'editor.propertyValue', defaultMessage: 'Value'})}</span>
      </StyledHeader>
      {rows.map(row => (
        <StyledRow key={row.id}>
          <StyledPropertyInput
            className="feature-property-name"
            secondary
            value={row.name}
            placeholder={intl.formatMessage({
              id: 'editor.propertyName',
              defaultMessage: 'Property'
            })}
            onChange={event => updateRow(row.id, {name: event.target.value}, false)}
            onBlur={() => updateRow(row.id, {}, true)}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                event.currentTarget.blur();
              }
            }}
          />
          <StyledPropertyInput
            className="feature-property-value"
            secondary
            value={row.value}
            placeholder={intl.formatMessage({
              id: 'editor.propertyValue',
              defaultMessage: 'Value'
            })}
            onChange={event =>
              updateRow(row.id, {value: event.target.value}, Boolean(row.name.trim()))
            }
            onBlur={() => updateRow(row.id, {}, true)}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                event.currentTarget.blur();
              }
            }}
          />
          {row.name.trim() || row.value ? (
            <StyledRemoveButton
              type="button"
              className="feature-property-remove"
              aria-label={intl.formatMessage({
                id: 'editor.removeProperty',
                defaultMessage: 'Remove property'
              })}
              onClick={() => removeRow(row.id)}
            >
              <Trash height="12px" />
            </StyledRemoveButton>
          ) : (
            <span />
          )}
        </StyledRow>
      ))}
    </StyledPropertiesEditor>
  );
}
