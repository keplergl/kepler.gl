// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import fs from 'fs';
import {join} from 'path';

export function walkSync(dir, fileList = []) {
  // Ensure dir is an array
  const directories = Array.isArray(dir) ? dir : [dir];

  directories.forEach(dirPath => {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      const path = join(dirPath, file);

      if (fs.statSync(path).isDirectory()) {
        fileList = walkSync(path, fileList);
      } else if (path.endsWith('.js')){
        fileList.push(path);
      }
    });
  });

  return fileList;
};
