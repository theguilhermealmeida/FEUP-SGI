varying vec2 vUv;
uniform sampler2D uSampler1;

void main() {
    // Sample the color from the RGB texture
    vec3 color = texture2D(uSampler1, vUv).rgb;

    gl_FragColor = vec4(color, 1.0);
}