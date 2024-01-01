varying vec3 vNormal;

uniform float normScale;
uniform float normalizationFactor;
uniform float displacement;

void main() {
      vNormal = normal;
      vec4 modelViewPosition = modelViewMatrix * vec4(position + normal * normalizationFactor * (displacement + normScale) , 1.0);
      gl_Position = projectionMatrix * modelViewPosition; 
}