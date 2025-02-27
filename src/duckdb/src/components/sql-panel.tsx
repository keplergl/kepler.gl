// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as arrow from 'apache-arrow';
import React, {useCallback, useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import {Panel, PanelGroup, PanelResizeHandle} from 'react-resizable-panels';

import {addDataToMap} from '@kepler.gl/actions';
import {generateHashId} from '@kepler.gl/common-utils';
import {Button, IconButton, Icons, LoadingSpinner, Tooltip} from '@kepler.gl/components';
import {arrowSchemaToFields} from '@kepler.gl/processors';
import {sidePanelBg, panelBorderColor} from '@kepler.gl/styles';
import {isAppleDevice} from '@kepler.gl/utils';

import MonacoEditor from './monaco-editor';
import {SchemaPanel} from './schema-panel';
import {PreviewDataPanel, QueryResult} from './preview-data-panel';
import {getDuckDB} from '../init';
import {
  constructST_asWKBQuery,
  getDuckDBColumnTypes,
  getDuckDBColumnTypesMap,
  getGeometryColumns,
  setGeoArrowWKBExtension,
  splitSqlStatements,
  checkIsSelectQuery,
  removeSQLComments
} from '../table/duckdb-table-utils';

const StyledSqlPanel = styled.div`
  display: flex;
  height: 100%;
  background-color: ${sidePanelBg};
  border-left: 1px solid #333;
`;

const StyledSqlActions = styled.div`
  flex: 0 0 50px;
  display: flex;
  padding-top: 12px;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  border-bottom: 1px solid #333;
`;

const StyledSqlEditor = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  min-width: 0; // Prevents flex child from overflowing
  height: 100%;
`;

const StyledEditorPanel = styled.div`
  background-color: ${sidePanelBg};
  display: flex;
  height: 100%;
  flex-direction: row;
  gap: 5px;
  flex-grow: 1;
`;

const StyledDataPanel = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
`;

const StyledEditor = styled.div<{isRunning: boolean}>`
  display: flex;
  padding: 12px 12px 12px 0;
  background-color: rgb(30, 30, 30);
  opacity: ${props => (props.isRunning ? 0.5 : 1)};
  width: 100%;
  height: 100%;
  min-height: 0; // Prevents flex child from overflowing
`;

const StyledResultActions = styled.div`
  background-color: white;
  padding: 2px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
`;

const StyledResizeHandle = styled(PanelResizeHandle)`
  background-color: ${panelBorderColor};
  width: 4px;
  cursor: col-resize;

  &:hover {
    background-color: #555;
  }
`;

const StyledVerticalResizeHandle = styled(PanelResizeHandle)`
  background-color: ${panelBorderColor};
  height: 4px;
  cursor: row-resize;

  &:hover {
    background-color: #555;
  }
`;

const StyledLoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const StyledErrorContainer = styled.pre`
  padding: 12px;
  color: red;
  font-size: 12px;
  background-color: ${sidePanelBg};
  height: 100%;
  overflow: auto;
`;

type SqlPanelProps = {
  initialSql?: string;
};

const SCHEMA_PANEL_STYLE = {overflow: 'auto'};

export const SqlPanel: React.FC<SqlPanelProps> = ({initialSql = ''}) => {
  const [sql, setSql] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('sql') || initialSql;
  });
  const [result, setResult] = useState<null | QueryResult>(null);
  const [error, setError] = useState<Error | null>(null);
  const [counter, setCounter] = useState(0);
  const [tableSchema, setTableSchema] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isMac] = useState(() => isAppleDevice());
  const dispatch = useDispatch();

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    if (sql) {
      currentUrl.searchParams.set('sql', sql);
    } else {
      currentUrl.searchParams.delete('sql');
    }
    window.history.replaceState({}, '', currentUrl.toString());
  }, [sql]);

  const runQuery = useCallback(async () => {
    setIsRunning(true);
    try {
      const adjustedQuery = sql ? removeSQLComments(sql) : null;
      if (!adjustedQuery) {
        setError(new Error('Query is empty'));
        return;
      }

      const db = await getDuckDB();
      const connection = await db.connect();

      // TODO find a cheap way to get DuckDb types with a single query to a remote resource - temp table? cte?
      const tempTableName = 'temp_keplergl_table';

      // remove comments
      const sqlStatements = splitSqlStatements(adjustedQuery);

      let arrowResult: arrow.Table | null = null;
      let tableDuckDBTypes = {};

      for (const statement of sqlStatements) {
        const isLastQuery = statement === sqlStatements[sqlStatements.length - 1];
        if (isLastQuery && (await checkIsSelectQuery(connection, statement))) {
          // 1) create temp table from the original query.
          await connection.query(`CREATE OR REPLACE TABLE '${tempTableName}' AS ${statement}`);

          // 2) query duckdb types and detect candidate columns for ST_asWKB transform.
          const duckDbColumns = await getDuckDBColumnTypes(connection, tempTableName);
          tableDuckDBTypes = getDuckDBColumnTypesMap(duckDbColumns);
          const columnsToConvertToWKB = getGeometryColumns(duckDbColumns);

          // 3) query GEOMETRY columns as WKB.
          const adjustedQuery = constructST_asWKBQuery(tempTableName, columnsToConvertToWKB);
          arrowResult = await connection.query(adjustedQuery);

          // 4) set geoarrow extension for the arrow table as DuckDB doesn't support the geoarrow extension.
          setGeoArrowWKBExtension(arrowResult, duckDbColumns);

          // 5) remove temp table
          await connection.query(`DROP TABLE ${tempTableName};`);
        } else {
          await connection.query(statement);
        }
      }

      if (!arrowResult) {
        throw new Error('no result');
      }

      setResult({table: arrowResult, tableDuckDBTypes});
      setError(null);

      connection.close();
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsRunning(false);
    }
  }, [sql]);

  const onChange = useCallback(
    value => {
      setSql(value);
    },
    [setSql]
  );

  const onAddResultToMap = useCallback(() => {
    if (!result) return;

    const keplerFields = arrowSchemaToFields(result.table, result.tableDuckDBTypes);

    const datasetToAdd = {
      data: {
        fields: keplerFields,
        // TODO type AddDataToMapPayload -> rows -> + arrow.Table
        rows: result.table as any
      },
      info: {
        id: generateHashId(),
        label: `query_result${counter > 0 ? `_${counter}` : ''}`,
        format: 'arrow'
      }
    };

    dispatch(addDataToMap({datasets: [datasetToAdd]}));
    setCounter(counter + 1);
  }, [result, counter, dispatch]);

  return (
    <StyledSqlPanel>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={20} minSize={15} style={SCHEMA_PANEL_STYLE}>
          <SchemaPanel setTableSchema={setTableSchema} />
        </Panel>

        <StyledResizeHandle />

        <Panel minSize={40}>
          <StyledSqlEditor>
            <PanelGroup direction="vertical">
              <Panel defaultSize={30} className="editor-panel">
                <StyledEditorPanel>
                  <StyledSqlActions>
                    <IconButton
                      data-tip
                      data-for="run-query-tooltip"
                      onClick={runQuery}
                      disabled={isRunning || !sql}
                    >
                      <Icons.Play height="18px" />
                      <Tooltip id="run-query-tooltip" place="top" effect="solid">
                        Run Query ({isMac ? '⌘Enter' : 'Ctrl+Enter'} or Shift+Enter)
                      </Tooltip>
                    </IconButton>
                  </StyledSqlActions>
                  <StyledEditor isRunning={isRunning}>
                    <MonacoEditor
                      isReadOnly={isRunning}
                      onRunQuery={runQuery}
                      onChange={onChange}
                      tableSchema={tableSchema}
                      code={sql}
                    />
                  </StyledEditor>
                </StyledEditorPanel>
              </Panel>

              <StyledVerticalResizeHandle />
              <Panel>
                {isRunning ? (
                  <StyledLoadingContainer>
                    <LoadingSpinner />
                  </StyledLoadingContainer>
                ) : error ? (
                  <StyledErrorContainer>
                    <div>{error.message}</div>
                  </StyledErrorContainer>
                ) : result ? (
                  <StyledDataPanel>
                    <StyledResultActions>
                      <Button secondary onClick={onAddResultToMap}>
                        Add to Map
                      </Button>
                      <div>{result.table.numRows} rows</div>
                    </StyledResultActions>
                    <PreviewDataPanel
                      result={result}
                      dataTableStyle={{}}
                      onAddResultToMap={onAddResultToMap}
                    />
                  </StyledDataPanel>
                ) : null}
              </Panel>
            </PanelGroup>
          </StyledSqlEditor>
        </Panel>
      </PanelGroup>
    </StyledSqlPanel>
  );
};
