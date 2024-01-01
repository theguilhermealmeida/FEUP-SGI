// Fragment Shader

varying vec3 vNormal;  // Normal received from the vertex shader
varying vec2 vUv;      // UV coordinates received from the vertex shader

uniform vec3 color;    // Color uniform for the cylinder

void main() {
    // Example: Use UV coordinates to create a simple pattern
    vec3 patternColor = vec3(0.5 + 0.5 * sin(vUv.x * 10.0), 0.5, 0.5);
    
    // Apply lighting using the normal
    float intensity = dot(normalize(vNormal), vec3(0.0, 1.0, 0.0));
    
    // Final color is a combination of the cylinder color, pattern, and lighting
    vec3 finalColor = color * patternColor * intensity;

    gl_FragColor = vec4(finalColor, 1.0);
}
