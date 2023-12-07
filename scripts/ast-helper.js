// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import fs from 'fs';
import {join} from 'path';

export function walkSync(dir, fileList = []) {
  dir.forEach(dir => {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const path = join(dir, file);

      if (fs.statSync(path).isDirectory()) {
        fileList = walkSync(path, fileList);
      } else if (path.endsWith('.js')){
        fileList.push(path);
      }
    });
  });

  return fileList;
};
