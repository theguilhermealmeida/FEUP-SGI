varying vec2 vUv;

varying vec3 vNormal;

uniform float normScale;
uniform float normalizationFactor;
uniform float displacement;
uniform sampler2D uSampler2;

void main() {
    vNormal = normal;
	vUv = uv;
	float colorDisplacement = texture2D(uSampler2, vUv).r;
    vec3 newPosition = position + normal * normalizationFactor * (displacement + normScale * colorDisplacement);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}