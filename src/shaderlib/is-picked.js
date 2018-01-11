export default `\

uniform vec3 selectedPickingColor;

float isPicked(vec3 pickingColors) {
 return float(pickingColors.x == selectedPickingColor.x
 && pickingColors.y == selectedPickingColor.y
 && pickingColors.z == selectedPickingColor.z);
}

`;
