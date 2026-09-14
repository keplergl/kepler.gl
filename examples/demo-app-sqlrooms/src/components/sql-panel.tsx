// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Panel, PanelGroup, PanelResizeHandle} from 'react-resizable-panels';
import {Download, LoaderCircle, Play} from 'lucide-react';
import {SchemaExplorer, SqlCodeMirrorEditor} from '@sqlrooms/sql-editor';
import {DataTableArrowPaginated} from '@sqlrooms/data-table';
import {TableSchemaTree} from '@sqlrooms/schema-tree';
import {useStoreWithDuckDb} from '@sqlrooms/duckdb';
import {Button, TooltipProvider} from '@sqlrooms/ui';
import {addDataToMap} from '@kepler.gl/actions';
import {generateHashId} from '@kepler.gl/common-utils';
import {arrowSchemaToFields} from '@kepler.gl/processors';
import {downloadQueryResult} from './sql-export';
import {executeSql, type SqlResult} from './sql-query';

export function useSqlPanelState(initialSql = '') {
  const dispatch = useDispatch();
  const [sql, setSql] = useState(
    () => new URLSearchParams(location.search).get('sql') || initialSql
  );
  const [result, setResult] = useState<SqlResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [schemaVersion, setSchemaVersion] = useState(0);
  const busy = useRef(false);
  const resultCount = useRef(0);
  const editor = useRef<
    Parameters<NonNullable<React.ComponentProps<typeof SqlCodeMirrorEditor>['onMount']>>[0] | null
  >(null);

  useEffect(() => {
    setSql(initialSql);
  }, [initialSql]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (sql) url.searchParams.set('sql', sql);
    else url.searchParams.delete('sql');
    window.history.replaceState(window.history.state, '', url);
  }, [sql]);

  const runQuery = useCallback(async (query: string) => {
    if (busy.current) return;
    busy.current = true;
    setIsRunning(true);
    setError(null);
    setResult(null);
    setHasRun(false);
    try {
      setResult(await executeSql(query));
      setHasRun(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      busy.current = false;
      setIsRunning(false);
      setSchemaVersion(version => version + 1);
    }
  }, []);

  const runSelection = useCallback(() => {
    const state = editor.current?.state;
    const selection = state?.selection.main;
    void runQuery(
      state && selection && !selection.empty ? state.sliceDoc(selection.from, selection.to) : sql
    );
  }, [runQuery, sql]);

  const addResultToMap = useCallback(() => {
    if (!result) return;
    const index = resultCount.current++;
    dispatch(
      addDataToMap({
        datasets: [
          {
            data: {
              fields: arrowSchemaToFields(result.table, result.tableDuckDBTypes),
              rows: result.table as any
            },
            info: {
              id: generateHashId(),
              label: `query_result${index ? `_${index}` : ''}`,
              format: 'arrow'
            }
          }
        ]
      })
    );
  }, [dispatch, result]);

  return {
    sql,
    setSql,
    result,
    error,
    isRunning,
    hasRun,
    schemaVersion,
    editor,
    runQuery,
    runSelection,
    addResultToMap
  };
}

export function SqlPanel({state}: {state: ReturnType<typeof useSqlPanelState>}) {
  const {
    sql,
    setSql,
    result,
    error,
    isRunning,
    hasRun,
    schemaVersion,
    editor,
    runQuery,
    runSelection,
    addResultToMap
  } = state;

  const tables = useStoreWithDuckDb(s => s.db.tables);
  const schemaTrees = useStoreWithDuckDb(s => s.db.schemaTrees);
  const connector = useStoreWithDuckDb(s => s.db.connector);
  const refreshSchemas = useStoreWithDuckDb(s => s.db.refreshTableSchemas);
  const datasets = useSelector((s: any) => s.demo?.keplerGl?.map?.visState.datasets);
  const [schemaError, setSchemaError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    refreshSchemas()
      .then(() => {
        if (active) setSchemaError(null);
      })
      .catch(cause => {
        if (active) setSchemaError(String(cause));
      });
    return () => {
      active = false;
    };
  }, [datasets, schemaVersion, refreshSchemas]);

  return (
    <TooltipProvider>
      <section className="h-full min-h-0 bg-background text-foreground" aria-label="SQL panel">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={20} minSize={15}>
            <SchemaExplorer>
              <SchemaExplorer.Header>
                <TableSchemaTree.RefreshButton />
              </SchemaExplorer.Header>
              {schemaError && (
                <div role="alert" className="p-2 text-xs text-destructive">
                  {schemaError}
                </div>
              )}
              <TableSchemaTree schemaTrees={schemaTrees} />
            </SchemaExplorer>
          </Panel>
          <PanelResizeHandle
            className="w-1 bg-border hover:bg-primary"
            aria-label="Resize schema browser"
          />
          <Panel minSize={40}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={40} minSize={20}>
                <div className="flex h-full min-h-0">
                  <div className="shrink-0 p-1">
                    <Button
                      size="icon"
                      className="h-7 w-7"
                      aria-label="Run query"
                      title="Run query (⌘/Ctrl+Enter)"
                      disabled={isRunning || !sql.trim()}
                      onClick={runSelection}
                    >
                      <Play className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                  <SqlCodeMirrorEditor
                    className="min-h-0 min-w-0 flex-1 pt-2"
                    value={sql}
                    onChange={setSql}
                    readOnly={isRunning}
                    onMount={view => {
                      editor.current = view;
                    }}
                    onRunQuery={runQuery}
                    tableSchemas={tables}
                    connector={connector}
                  />
                </div>
              </Panel>
              <PanelResizeHandle
                className="h-1 bg-border hover:bg-primary"
                aria-label="Resize query editor"
              />
              <Panel minSize={20}>
                {isRunning ? (
                  <div className="flex h-full items-center justify-center gap-2" role="status">
                    <LoaderCircle className="h-5 w-5 animate-spin" /> Running query…
                  </div>
                ) : error ? (
                  <pre
                    role="alert"
                    className="h-full overflow-auto whitespace-pre-wrap p-3 text-xs text-destructive"
                  >
                    {error}
                  </pre>
                ) : result ? (
                  <DataTableArrowPaginated
                    className="h-full"
                    table={result.table}
                    footerActions={
                      <div className="ml-auto flex shrink-0 items-center gap-2">
                        <Button
                          size="icon"
                          className="h-7 w-7"
                          variant="ghost"
                          aria-label="Export CSV"
                          title="Export CSV"
                          onClick={() => downloadQueryResult(result.table)}
                        >
                          <Download className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button size="sm" onClick={addResultToMap}>
                          Add to Map
                        </Button>
                      </div>
                    }
                  />
                ) : hasRun ? (
                  <div className="p-3 text-xs" role="status">
                    Query completed successfully.
                  </div>
                ) : null}
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </section>
    </TooltipProvider>
  );
}
