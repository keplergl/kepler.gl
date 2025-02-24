// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import {AsyncDuckDBConnection} from '@duckdb/duckdb-wasm';

import {arrowSchemaToFields} from '@kepler.gl/processors';
import {VisState} from '@kepler.gl/schemas';

import {Tree, DatasetNode, ColumnNode, TreeNodeData} from './tree';
import {getDuckDB} from '../init';
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
`;

async function getColumnSchema(connection: AsyncDuckDBConnection, tableName: string) {
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

function getSchemaSuggestion(result) {
  return result.reduce((accu, data) => {
    const columns = data.children.map(child => ({
      column_name: child.key,
      table_name: data.key
    }));
    return accu.concat(columns);
  }, []);
}
export const SchemaPanel = ({setTableSchema}) => {
  const [columnSchemas, setColumnSchemas] = useState<TreeNodeData<{type: string}>[]>([]);
  const datasets = useSelector((state: State) => state?.demo?.keplerGl?.map?.visState.datasets);

  const getTableSchema = useCallback(async () => {
    const db = await getDuckDB();
    const c = await db.connect();

    const tableResult = await c.query('SHOW TABLES;');

    const tableNames = tableResult.getChildAt(0)?.toJSON();

    const result = await Promise.all((tableNames || [])?.map(name => getColumnSchema(c, name)));
    const tableSchema = getSchemaSuggestion(result);

    setColumnSchemas(result);
    setTableSchema(tableSchema);
    c.close();
  }, [setColumnSchemas, setTableSchema]);

  useEffect(() => {
    getTableSchema();
  }, [datasets, getTableSchema]);

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
      ) : (
        <div>No tables found</div>
      )}
    </StyledSchemaPanel>
  );
};
