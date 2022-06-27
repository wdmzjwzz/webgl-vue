import { uniformSetters } from "./constants";
import { BufferData, BufferInfo, GLParamsInfo } from "./GLProgram";
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
    const canvas = gl.canvas as HTMLCanvasElement;
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // 每次清屏时，将颜色缓冲区设置为全透明黑色
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
      // Front face
      -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

      // Back face
      -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

      // Top face
      -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

      // Bottom face
      -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

      // Right face
      1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

      // Left face
      -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
    ]);
    const colors = new Float32Array([
      0.0,
      0.0,
      1.0,
      1.0, // Front face: white
      1.0,
      0.0,
      0.0,
      1.0, // Back face: red
      0.0,
      1.0,
      0.0,
      1.0, // Top face: green
      0.0,
      0.0,
      1.0,
      1.0, // Bottom face: blue
      1.0,
      1.0,
      0.0,
      1.0, // Right face: yellow
      1.0,
      0.0,
      1.0,
      1.0, // Left face: purple
    ]);
    const indices = new Uint16Array([
      0,
      1,
      2,
      0,
      2,
      3, // front
      4,
      5,
      6,
      4,
      6,
      7, // back
      8,
      9,
      10,
      8,
      10,
      11, // top
      12,
      13,
      14,
      12,
      14,
      15, // bottom
      16,
      17,
      18,
      16,
      18,
      19, // right
      20,
      21,
      22,
      20,
      22,
      23, // left
    ]);
    return { vertexes, colors, indices };
  }
  public static createBuffers(
    gl: WebGL2RenderingContext,
    bufferData: { [key: string]: BufferData }
  ) {
    const keys = Object.keys(bufferData);
    const buffers: BufferInfo = {};

    keys.forEach((key) => {
      const { data, numComponents, type, stride, offset, normalize } =
        bufferData[key];
      if (key === "indices") {
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

        buffers.indices = {
          buffer: indexBuffer!,
          elementType: gl.UNSIGNED_SHORT,
        };
        return;
      }

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

      buffers[key] = {
        buffer: buffer!,
        numComponents: numComponents,
        type: type || gl.FLOAT,
        normalize: normalize || false,
        stride: stride || 0,
        offset: offset || 0,
        drawType: gl.STATIC_DRAW,
      };
    });

    return buffers;
  }
  static setAttributeInfo(
    gl: WebGL2RenderingContext,
    buffers: BufferInfo,
    atrributeInfoMap: {
      [key: string]: GLParamsInfo;
    }
  ) {
    const keys = Object.keys(buffers);

    keys.forEach((key) => {
      const { buffer, numComponents, type, stride, offset, normalize } =
        buffers[key];
      if (key === "indices") {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        return;
      }
      const attribInfo = atrributeInfoMap[key];
      const localtion = attribInfo.localtion as number;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.vertexAttribPointer(
        localtion,
        numComponents || 3,
        type || gl.FLOAT,
        normalize || false,
        stride || 0,
        offset || 0
      );
      gl.enableVertexAttribArray(localtion);
    });
  }
  static setUniformInfo(
    gl: WebGL2RenderingContext,
    uniformData: { [key: string]: any },
    uniformInfoMap: {
      [key: string]: GLParamsInfo;
    }
  ) {
    const keys = Object.keys(uniformInfoMap);
    keys.forEach((key) => {
      const data = uniformData[key];
      const uniform = uniformInfoMap[key];
      const setter = uniformSetters[uniform.type];
      if (setter) {
        setter(gl, uniform.localtion, data);
      }
    });
  }
}
