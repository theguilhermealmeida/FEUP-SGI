#include <packing>
varying vec2 vUv;

varying vec3 vNormal;

uniform float normScale;
uniform float normalizationFactor;
uniform float displacement;
uniform sampler2D grayTexture;
uniform sampler2D colorTexture;
uniform float cameraNear;
uniform float cameraFar;

float readDepth( sampler2D depthSampler, vec2 coord ) {
    float fragCoordZ = texture2D( grayTexture, coord ).x;
    float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
	return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}

void main() {
    vNormal = normal;
	vUv = uv;
	// float colorDisplacement = texture2D(grayTexture, vUv).r;
	float colorDisplacement = readDepth( grayTexture, vUv ) * -1.0;
    vec3 newPosition = position + normal * normalizationFactor * (displacement + normScale * colorDisplacement);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}