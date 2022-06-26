import { Matrix4, Vector3, Vector4 } from "./math/TSM";

export enum EGLSLESDataType {
  FLOAT_Vector2 = 0x8b50,
  FLOAT_Vector3,
  FLOAT_Vector4,
  INT_Vector2,
  INT_Vector3,
  INT_Vector4,
  BOOL,
  BOOL_Vector2,
  BOOL_Vector3,
  BOOL_Vector4,
  FLOAT_MAT2,
  FLOAT_MAT3,
  FLOAT_Matrix4,
  SAMPLER_2D,
  SAMPLER_CUBE,

  FLOAT = 0x1406,
  INT = 0x1404,
}

export class GLHelper {
  public static printStates(gl: WebGL2RenderingContext): void {
    // 所有的boolean状态变量，共9个
    console.log("1. isBlendEnable = " + gl.isEnabled(gl.BLEND));
    console.log("2. isCullFaceEnable = " + gl.isEnabled(gl.CULL_FACE));
    console.log("3. isDepthTestEnable = " + gl.isEnabled(gl.DEPTH_TEST));
    console.log("4. isDitherEnable = " + gl.isEnabled(gl.DITHER));
    console.log(
      "5. isPolygonOffsetFillEnable = " + gl.isEnabled(gl.POLYGON_OFFSET_FILL)
    );
    console.log(
      "6. isSampleAlphtToCoverageEnable = " +
      gl.isEnabled(gl.SAMPLE_ALPHA_TO_COVERAGE)
    );
    console.log(
      "7. isSampleCoverageEnable = " + gl.isEnabled(gl.SAMPLE_COVERAGE)
    );
    console.log("8. isScissorTestEnable = " + gl.isEnabled(gl.SCISSOR_TEST));
    console.log("9. isStencilTestEnable = " + gl.isEnabled(gl.STENCIL_TEST));
  }

  public static printWebGLInfo(gl: WebGL2RenderingContext): void {
    console.log("renderer = " + gl.getParameter(gl.RENDERER));
    console.log("version = " + gl.getParameter(gl.VERSION));
    console.log("vendor = " + gl.getParameter(gl.VENDOR));
    console.log(
      "glsl version = " + gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
    );
  }

  public static printWebGLTextureInfo(gl: WebGL2RenderingContext): void {
    console.log(
      "MAX_COMBINED_TEXTURE_IMAGE_UNITS = ",
      gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)
    );
    console.log(
      "MAX_TEXTURE_IMAGE_UNITS = ",
      gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)
    );
    console.log("MAX_TEXTURE_SIZE = ", gl.getParameter(gl.MAX_TEXTURE_SIZE));
    console.log(
      "MAX_CUBE_MAP_TEXTURE_SIZE = ",
      gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE)
    );
  }

  public static triggerContextLostEvent(gl: WebGL2RenderingContext): void {
    const ret: WEBGL_lose_context | null =
      gl.getExtension("WEBGL_lose_context");
    if (ret !== null) {
      ret.loseContext();
    }
  }

  public static checkGLError(gl: WebGL2RenderingContext): boolean {
    const err: number = gl.getError();
    if (err === 0) {
      return false;
    } else {
      console.log("WebGL Error NO: ", err);
      return true;
    }
  }

  public static setDefaultState(gl: WebGL2RenderingContext): void {
    // default [r=0,g=0,b=0,a=0] 
    const canvas = (gl.canvas as HTMLCanvasElement) 

    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    gl.clearColor(0.0, 0.0, 0.0, 0.0); // 每次清屏时，将颜色缓冲区设置为全透明黑色
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // turn on depth testing
    gl.enable(gl.DEPTH_TEST);
    // tell webgl to cull faces
    gl.enable(gl.CULL_FACE);
  }
  public static getColorBufferData(gl: WebGL2RenderingContext): Uint8Array {
    const pixels: Uint8Array = new Uint8Array(
      gl.drawingBufferWidth * gl.drawingBufferHeight * 4
    );
    gl.readPixels(
      0,
      0,
      gl.drawingBufferWidth,
      gl.drawingBufferHeight,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixels
    );
    return pixels;
  }

  public static createFVertxes() {
    const vertexes = new Float32Array([
      // left column front
      0, 0, 0, 0, 150, 0, 30, 0, 0, 0, 150, 0, 30, 150, 0, 30, 0, 0,

      // top rung front
      30, 0, 0, 30, 30, 0, 100, 0, 0, 30, 30, 0, 100, 30, 0, 100, 0, 0,

      // middle rung front
      30, 60, 0, 30, 90, 0, 67, 60, 0, 30, 90, 0, 67, 90, 0, 67, 60, 0,

      // left column back
      0, 0, 30, 30, 0, 30, 0, 150, 30, 0, 150, 30, 30, 0, 30, 30, 150, 30,

      // top rung back
      30, 0, 30, 100, 0, 30, 30, 30, 30, 30, 30, 30, 100, 0, 30, 100, 30, 30,

      // middle rung back
      30, 60, 30, 67, 60, 30, 30, 90, 30, 30, 90, 30, 67, 60, 30, 67, 90, 30,

      // top
      0, 0, 0, 100, 0, 0, 100, 0, 30, 0, 0, 0, 100, 0, 30, 0, 0, 30,

      // top rung right
      100, 0, 0, 100, 30, 0, 100, 30, 30, 100, 0, 0, 100, 30, 30, 100, 0, 30,

      // under top rung
      30, 30, 0, 30, 30, 30, 100, 30, 30, 30, 30, 0, 100, 30, 30, 100, 30, 0,

      // between top rung and middle
      30, 30, 0, 30, 60, 30, 30, 30, 30, 30, 30, 0, 30, 60, 0, 30, 60, 30,

      // top of middle rung
      30, 60, 0, 67, 60, 30, 30, 60, 30, 30, 60, 0, 67, 60, 0, 67, 60, 30,

      // right of middle rung
      67, 60, 0, 67, 90, 30, 67, 60, 30, 67, 60, 0, 67, 90, 0, 67, 90, 30,

      // bottom of middle rung.
      30, 90, 0, 30, 90, 30, 67, 90, 30, 30, 90, 0, 67, 90, 30, 67, 90, 0,

      // right of bottom
      30, 90, 0, 30, 150, 30, 30, 90, 30, 30, 90, 0, 30, 150, 0, 30, 150, 30,

      // bottom
      0, 150, 0, 0, 150, 30, 30, 150, 30, 0, 150, 0, 30, 150, 30, 30, 150, 0,

      // left side
      0, 0, 0, 0, 0, 30, 0, 150, 30, 0, 0, 0, 0, 150, 30, 0, 150, 0,
    ]);
    const normals = new Float32Array([
      // left column front
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,

      // top rung front
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,

      // middle rung front
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,

      // left column back
      0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,

      // top rung back
      0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,

      // middle rung back
      0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,

      // top
      0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,

      // top rung right
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,

      // under top rung
      0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,

      // between top rung and middle
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,

      // top of middle rung
      0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,

      // right of middle rung
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,

      // bottom of middle rung.
      0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,

      // right of bottom
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,

      // bottom
      0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,

      // left side
      -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
    ]);
    const matrix = new Matrix4();
    matrix.rotate(Math.PI, Vector3.right)!;
    matrix.translate(new Vector3([-50, -75, -15]));

    for (let ii = 0; ii < vertexes.length; ii += 3) {
      const vector = matrix.multiplyVector4(
        new Vector4([vertexes[ii + 0], vertexes[ii + 1], vertexes[ii + 2], 1])
      );
      vertexes[ii + 0] = vector.x;
      vertexes[ii + 1] = vector.y;
      vertexes[ii + 2] = vector.z;
    }
    return { vertexes, normals };
  }
}
