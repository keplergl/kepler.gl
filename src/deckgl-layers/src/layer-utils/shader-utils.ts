// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

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
    // Here we call console.error when we fail to edit deck.gl shader
    // This should be caught by layer test
    console.error(`Cannot edit ${type} layer shader`);
    return vs;
  }

  return vs.replace(originalText, testToReplace);
}
