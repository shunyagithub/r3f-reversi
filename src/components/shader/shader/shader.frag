uniform float u_time;
uniform vec4 u_resolution;
varying vec2 vUv;
#pragma glslify: random = require(glsl-random)

void main() {
    gl_FragColor = vec4(vUv,0.0,1.);
}