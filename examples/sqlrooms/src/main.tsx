import React from 'react';
import {ThemeProvider} from '@sqlrooms/ui';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import {Room} from './room';

import {configureMonacoLoader} from '@sqlrooms/monaco-editor';
import * as monaco from 'monaco-editor';

// Configure the monaco loader to bundle the editor
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
configureMonacoLoader({monaco, workers: {default: editorWorker}});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Missing application root element.');

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="sqlrooms-ui-theme">
      <Room />
    </ThemeProvider>
  </StrictMode>
);
