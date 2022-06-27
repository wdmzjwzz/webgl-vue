#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
in vec4 a_color;
uniform mat4 u_matrix;

// varying to pass the normal to the fragment shader
out vec4 u_color;

// all shaders have a main function
void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;
  u_color = a_color;
}