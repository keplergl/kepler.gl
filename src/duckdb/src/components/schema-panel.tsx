import React, {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import {arrowDataTypeToFieldType} from '@kepler.gl/utils';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {Tree, DatasetNode, ColumnNode} from './tree';
import {getDuckDB} from '../init';

const StyledSchemaPanel = styled.div`
  color: ${props => props.theme.textColor};
  font-size: 12px;
  padding: 12px;
  font-family: ${props => props.theme.fontFamily};
`;

async function getColumnSchema(c, name) {
  const columnResult = await c.query(`Select * from '${name}' LIMIT 1;`);

  return {
    key: name,
    object: {
      type: 'dataset',
      tableName: name
    },
    children: columnResult.schema.fields.map(field => {
      const isGeoArrowColumn = field.metadata.get('ARROW:extension:name')?.startsWith('geoarrow');
      return {
        key: field.name,
        object: {
          type: 'column',
          name: field.name,
          arrowType: field.type,
          fieldType: isGeoArrowColumn
            ? ALL_FIELD_TYPES.geoarrow
            : arrowDataTypeToFieldType(field.type)
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
  const [columnSchemas, setColumnSchemas] = useState([]);
  const datasets = useSelector(state => state?.demo?.keplerGl?.map?.visState.datasets);
  useEffect(() => {
    getTableSchema();
  }, [datasets]);
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

  return (
    <StyledSchemaPanel>
      {columnSchemas?.length ? (
        columnSchemas.map(data => (
          <Tree
            key={data.key}
            treeData={data}
            renderNode={(node, isOpen) => {
              if (node.object.type === 'dataset') {
                return <DatasetNode node={node} />;
              } else if (node.object.type === 'column') {
                return <ColumnNode node={node} />;
              }
            }}
          />
        ))
      ) : (
        <div>No tables found</div>
      )}
    </StyledSchemaPanel>
  );
};
