// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as arrow from 'apache-arrow';

export interface DatabaseConnection {
  query(statement: string): Promise<arrow.Table>;
  insertArrowTable(arrowTable: arrow.Table, {name}: {name: string}): Promise<void>;
  close();
}

export interface DatabaseAdapter {
  connect(): Promise<DatabaseConnection>;
  registerFileText(name: string, text: string): Promise<void>;
  registerFileHandle(name: string, handle: any, protocol: number, directIO: boolean): Promise<void>;
}
