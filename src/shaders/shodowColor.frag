#version 300 es

precision highp float;


// uniform vec3 u_reverseLightDirection;
in vec4 u_color;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  outColor = u_color;
}