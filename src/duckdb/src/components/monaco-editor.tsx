// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo, useRef} from 'react';
import Editor, {OnChange, OnMount} from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
// import {tableSchema as DEFAULT_SCHEMA} from './table-schema';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';

const MONACO_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = {
  minimap: {enabled: false},
  language: 'sql',
  contextmenu: false,
  renderLineHighlight: 'none',
  scrollBeyondLastLine: false,
  scrollbar: {alwaysConsumeMouseWheel: false},
  overviewRulerLanes: 0,
  automaticLayout: true,
  acceptSuggestionOnEnter: 'on',
  quickSuggestionsDelay: 400,
  matchOnWordStartOnly: false,
  tabCompletion: 'off',
  lineNumbers: 'off'
};

function parseSqlAndFindTableNameAndAliases(sql: string) {
  const regex = /\b(?:FROM|JOIN)\s+([^\s.]+(?:\.[^\s.]+)?)\s*(?:AS)?\s*([^\s,]+)?/gi;
  const tables: {table_name: string; alias: string}[] = [];

  while (true) {
    const match = regex.exec(sql);
    if (!match) {
      break;
    }
    const table_name = match[1];
    if (!/\(/.test(table_name)) {
      // exclude function calls
      let alias = match[2] as string | null;
      if (alias && /on|where|inner|left|right|join/.test(alias)) {
        alias = null;
      }
      tables.push({
        table_name,
        alias: alias || table_name
      });
    }
  }

  return tables;
}

interface MonacoEditorProps {
  code: string;
  isReadOnly?: boolean;
  onChange: OnChange;
  onRunQuery: () => void;
  tableSchema?: {table_name: string; column_name: string}[];
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  onRunQuery,
  onChange,
  code,
  tableSchema,
  isReadOnly
}) => {
  // private editor?: monaco.editor.IStandaloneCodeEditor;
  const schemaTableNames = useMemo(
    () => (tableSchema ? uniq(tableSchema.map(d => d.table_name)) : []),
    [tableSchema]
  );
  const schemaTableNamesSet = useMemo(() => new Set(schemaTableNames), [schemaTableNames]);
  const handleRunQueryRef = useRef(onRunQuery);
  handleRunQueryRef.current = onRunQuery;

  const handleEditorDidMount: OnMount = useCallback(
    editor => {
      // this.editor = editor;
      editor.focus();

      editor.addAction({
        id: 'run-query',
        label: 'Run Query',
        keybindings: [
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
          monaco.KeyMod.Shift | monaco.KeyCode.Enter
        ],
        contextMenuGroupId: 'custom',
        contextMenuOrder: 0,
        run: () => handleRunQueryRef.current()
      });

      monaco.languages.registerCompletionItemProvider('*', {
        provideCompletionItems: (model, position, _context, _cancelationToken) => {
          const suggestions: monaco.languages.CompletionItem[] = [
            {
              label: 'myCustomSnippet',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'This is a piece of custom code',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'This is a piece of custom code'
              // TODO: range is missing
            } as monaco.languages.CompletionItem
          ];

          const fullQueryText = model.getValue();

          const tableNamesAndAliases = new Map<string, string>(
            parseSqlAndFindTableNameAndAliases(fullQueryText).map(({table_name, alias}) => [
              alias,
              table_name
            ])
          );

          const thisLine = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          });
          const thisToken = thisLine.trim().split(' ').slice(-1)?.[0] || '';

          const lastTokenBeforeSpace = /\s?(\w+)\s+\w+$/.exec(thisLine.trim())?.[1];
          const lastTokenBeforeDot = /(\w+)\.\w*$/.exec(thisToken)?.[1];

          // console.log(tableNamesAndAliases, thisToken, lastTokenBeforeSpace, lastTokenBeforeDot);

          if (lastTokenBeforeSpace && /from|join|update|into/.test(lastTokenBeforeSpace)) {
            suggestions.push(
              ...schemaTableNames.map(
                table_name =>
                  ({
                    label: table_name,
                    kind: monaco.languages.CompletionItemKind.Field,
                    insertText: table_name
                    // TODO: range is missing
                  } as monaco.languages.CompletionItem)
              )
            );
          }

          if (lastTokenBeforeDot) {
            let table_name = null as string | null;
            if (schemaTableNamesSet.has(lastTokenBeforeDot)) {
              table_name = lastTokenBeforeDot;
            } else if (tableNamesAndAliases.get(lastTokenBeforeDot)) {
              table_name = tableNamesAndAliases.get(lastTokenBeforeDot) as string;
            }
            if (table_name && tableSchema) {
              suggestions.push(
                ...tableSchema
                  .filter(d => d.table_name === table_name)
                  .map(
                    ({column_name}) =>
                      ({
                        label: column_name,
                        kind: monaco.languages.CompletionItemKind.Field,
                        insertText: column_name
                        // TODO: range is missing
                      } as monaco.languages.CompletionItem)
                  )
              );
            }
          }

          return {
            suggestions: uniqBy(suggestions, s => s.insertText)
          };
        }
      });
    },
    [tableSchema, schemaTableNames, schemaTableNamesSet]
  );

  return (
    <Editor
      height="100%"
      theme="vs-dark"
      defaultLanguage="sql"
      defaultValue={code}
      onChange={onChange}
      onMount={handleEditorDidMount}
      options={{
        ...MONACO_OPTIONS,
        readOnly: isReadOnly
      }}
    />
  );
};

export default MonacoEditor;
