// Vertex Shader

varying vec3 vNormal;  // Pass normal to fragment shader
varying vec2 vUv;      // Pass UV coordinates to fragment shader

uniform float time;    // Time uniform to control animation

void main() {
    vNormal = normalize(normalMatrix * normal);  // Transform normal to camera space
    vUv = uv;  // Pass UV coordinates

    // Pulsating effect: modify the radius using a sine function
    float pulsation = 1.0 + 0.1 * sin(time);  // Adjust the frequency and amplitude as needed
    vec3 newPosition = position * vec3(pulsation, 1.0, pulsation);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
