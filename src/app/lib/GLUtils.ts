import * as twgl from "twgl.js";
import { m4 } from "twgl.js";
export class GLUtils {
  static createPlaneVertices(
    width?: number,
    depth?: number,
    subdivisionsWidth?: number,
    subdivisionsDepth?: number,
    matrix?: m4.Mat4
  ) {
    return twgl.primitives.createPlaneVertices(
      width,
      depth,
      subdivisionsWidth,
      subdivisionsDepth,
      matrix
    );
  }
  static createSphereVertices(
    radius: number,
    subdivisionsAxis: number,
    subdivisionsHeight: number,
    opt_startLatitudeInRadians?: number | undefined,
    opt_endLatitudeInRadians?: number | undefined,
    opt_startLongitudeInRadians?: number | undefined,
    opt_endLongitudeInRadians?: number | undefined
  ) {
    return twgl.primitives.createSphereVertices(
      radius,
      subdivisionsAxis,
      subdivisionsHeight,
      opt_startLatitudeInRadians,
      opt_endLatitudeInRadians,
      opt_startLongitudeInRadians,
      opt_endLongitudeInRadians
    );
  }
  static createBufferInfoFromVertices(
    gl: WebGL2RenderingContext,
    vertices: twgl.Arrays
  ) {
    return twgl.createBufferInfoFromArrays(gl, vertices);
  }
  static createTexture(
    gl: WebGL2RenderingContext,
    options?: twgl.TextureOptions
  ) {
    return twgl.createTexture(gl, options);
  }
  static createProgramInfo(
    gl: WebGL2RenderingContext,
    shaderSources: string[],
    opt_attribs?: any,
    opt_errorCallback?: () => void
  ) {
    const program = twgl.createProgramFromSources(
      gl,
      shaderSources,
      opt_attribs,
      opt_errorCallback
    );
    return twgl.createProgramInfoFromProgram(gl, program);
  }
  static rand(min: number, max: number) {
    return min + Math.random() * (max - min);
  }
}
