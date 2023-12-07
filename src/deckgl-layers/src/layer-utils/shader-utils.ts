// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {console as Console} from 'global/window';

/*
 * Amendment to default layer vertex shader
 * @param {string} vs
 * @param {string} type
 * @param {string} originalText
 * @param {string} testToReplace
 * @return {string} output shader
 *
 */
export function editShader(vs: string, type: string, originalText: string, testToReplace: string) {
  if (!vs.includes(originalText)) {
    // Here we call Console.error when we fail to edit deck.gl shader
    // This should be caught by layer test
    Console.error(`Cannot edit ${type} layer shader`);
    return vs;
  }

  return vs.replace(originalText, testToReplace);
}
