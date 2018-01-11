/*
 * Amendment to default layer vertex shader
 * @param {string} vs
 * @param {bool} opt.highlightPicked - whether to highlight picked element
 *
 */
export function getCellLayerVertex(vs, {highlightPicked}) {
  let output = vs;

  if (highlightPicked) {
    output = output.replace(
      'vec3 lightWeightedColor = lightWeight * instanceColors.rgb;',

      `vec3 lightWeightedColor = lightWeight * mix(1.0, mix(1.0, 1.2, selected), extruded) * instanceColors.rgb;`
    );
  }

  return output;
}
