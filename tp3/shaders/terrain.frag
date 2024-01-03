#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying float blue;

uniform sampler2D uSampler;		// original textute
uniform sampler2D uSampler2;	// heightmap
uniform sampler2D uSampler3;	// gradient


void main() {
	// ---- original texture
	vec4 color = texture2D(uSampler, vTextureCoord);

	float y = (1.0 - blue) *1.25;
	if (y >= 0.99) y = 0.99;

	// ---- heightmap
	vec4 heightmap = texture2D(uSampler2, vTextureCoord);
	// ---- altimetry
	vec4 gradient = texture2D(uSampler3, vec2(0, y));

	color.r = (color.r*0.7 + gradient.r*0.3);
	color.g = (color.g*0.7 + gradient.g*0.3);
	color.b = (color.b*0.7 + gradient.b*0.3);
	
	gl_FragColor = color;
}