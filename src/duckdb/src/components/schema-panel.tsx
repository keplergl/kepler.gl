// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';

import {LoadingSpinner, Icons} from '@kepler.gl/components';
import {arrowSchemaToFields} from '@kepler.gl/processors';
import {VisState} from '@kepler.gl/schemas';
import {getApplicationConfig, DatabaseConnection} from '@kepler.gl/utils';

import {Tree, DatasetNode, ColumnNode, TreeNodeData} from './tree';
import {getDuckDBColumnTypes, getDuckDBColumnTypesMap} from '../table/duckdb-table-utils';

// TODO note that demo state is available in demo-app, but not when add modules to dependencies in a custom map
type State = {
  demo?: {
    keplerGl: {
      map: {
        visState: VisState;
      };
    };
  };
};

const StyledSchemaPanel = styled.div`
  color: ${props => props.theme.textColor};
  font-size: 12px;
  padding: 12px;
  font-family: ${props => props.theme.fontFamily};
  height: 100%;
`;

const StyledLoadingSpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

async function getColumnSchema(connection: DatabaseConnection, tableName: string) {
  const columnResult = await connection.query(`Select * from '${tableName}' LIMIT 1;`);

  const columnDescribe = await getDuckDBColumnTypes(connection, tableName);
  const keplerFields = arrowSchemaToFields(columnResult, getDuckDBColumnTypesMap(columnDescribe));

  return {
    key: tableName,
    object: {
      type: 'dataset',
      tableName: tableName
    },
    children: columnResult.schema.fields.map((field, fieldIndex) => {
      return {
        key: field.name,
        object: {
          type: 'column',
          name: field.name,
          arrowType: field.type,
          fieldType: keplerFields[fieldIndex].type
        }
      };
    })
  };
}

export type SchemaSuggestion = {column_name: string; table_name: string};

function getSchemaSuggestion(result: {key: string; children: {key: string}[]}[]) {
  return result.reduce((accu, data) => {
    const columns = data.children.map(child => ({
      column_name: child.key,
      table_name: data.key
    }));
    return accu.concat(columns);
  }, [] as SchemaSuggestion[]);
}

type SchemaPanelProps = {
  setTableSchema: (tableSchema: SchemaSuggestion[]) => void;
  droppedFile: File | null;
  schemaUpdateTrigger: number;
};

const StyledSchemaPanelDropMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-direction: column;
  text-align: center;

  div {
    margin: 5px;
  }
  .header {
    font-size: 15px;
  }
  .bold {
    font-weight: 700;
  }
`;

const StyledAddIcon = styled(Icons.Add)`
  display: inline;
  margin-top: -3px;
`;

export const SchemaPanelDropMessage = () => {
  return (
    <StyledSchemaPanelDropMessage>
      <div className="header">
        <StyledAddIcon /> Add files to DuckDB
      </div>
      <div className="bold">Supported formats: </div>
      <div>.csv, .json, .geojson, .parquet, .arrow</div>
      <div>Files you add will stay local to your browser.</div>
    </StyledSchemaPanelDropMessage>
  );
};

export const SchemaPanel = ({
  setTableSchema,
  droppedFile,
  schemaUpdateTrigger
}: SchemaPanelProps) => {
  const [columnSchemas, setColumnSchemas] = useState<TreeNodeData<{type: string}>[]>([]);
  const datasets = useSelector((state: State) => state?.demo?.keplerGl?.map?.visState.datasets);

  const getTableSchema = useCallback(async () => {
    const db = getApplicationConfig().database;
    if (!db) {
      console.error('The database is not configured properly.');
      return;
    }
    const c = await db.connect();

    const tableResult = await c.query('SHOW TABLES;');

    const tableNames: string[] | undefined = tableResult.getChildAt(0)?.toJSON();

    const result = await Promise.all((tableNames || [])?.map(name => getColumnSchema(c, name)));
    const tableSchema = getSchemaSuggestion(result);

    setColumnSchemas(result);
    setTableSchema(tableSchema);
    await c.close();

    // schemaUpdateTrigger indicates possible change in DuckDB
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setColumnSchemas, setTableSchema, schemaUpdateTrigger]);

  useEffect(() => {
    getTableSchema();
  }, [datasets, droppedFile, getTableSchema]);

  return (
    <StyledSchemaPanel>
      {columnSchemas?.length ? (
        columnSchemas.map(data => (
          <Tree
            key={data.key}
            treeData={data}
            renderNode={node => {
              if (node.object.type === 'dataset') {
                return <DatasetNode node={node} />;
              } else if (node.object.type === 'column') {
                return <ColumnNode node={node} />;
              }
              return null;
            }}
          />
        ))
      ) : droppedFile ? (
        <StyledLoadingSpinnerWrapper>
          <LoadingSpinner />
        </StyledLoadingSpinnerWrapper>
      ) : (
        <SchemaPanelDropMessage />
      )}
    </StyledSchemaPanel>
  );
};
