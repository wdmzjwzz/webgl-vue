/* eslint-disable */
import { Application, CanvasKeyBoardEvent } from "./Application";
import { Camera } from "../webglUtils/Camera";
import { GLProgram, GLSetters } from "../webglUtils/GLProgram";
// import vertexShader from "@/shaders/vertexShader.vert";
// import fragmentShader from "@/shaders/fragmentShader.frag";

import vertexShader from "@/shaders/vertexShader_texture.vert";
import fragmentShader from "@/shaders/fragmentShader_texture.frag";
import { Matrix4, Vector3 } from "../webglUtils/math/TSM";
import { GLHelper } from "../webglUtils/GLHepler";
import { PointLight } from "../webglUtils/Light/PointLight";
import { BaseLight } from "../webglUtils/Light/BaseLight";
import { BufferInfo, BufferInfoCreater } from "../webglUtils/GLBufferInfo";
import { GLWorldMatrixStack } from "../webglUtils/GLMatrixStack";
import GLTexture from "@/webglUtils/GLTexture";
import { HttpRequest } from "@/webglUtils/HttpRequest";


export class TextureApplication extends Application {
  public camera: Camera; // 在WebGLApplication的基础上增加了对摄像机系统的支持
  public angle = 0; // 用来更新旋转角度
  public gl: WebGL2RenderingContext;
  public program: GLProgram;
  public vao: WebGLVertexArrayObject | null = null;
  public light: BaseLight | null = null;

  public bufferInfo: BufferInfo | null = null;
  public uniformsData: { [key: string]: any } = {};

  public matStack: GLWorldMatrixStack;
  public constructor(canvas: HTMLCanvasElement, camera: Camera) {
    super(canvas);
    this.matStack = new GLWorldMatrixStack();
    const gl = this.canvas.getContext("webgl2");
    if (!gl) {
      throw new Error("canvas.getContext(webgl2) failed");
    }
    this.gl = gl;
    this.program = new GLProgram(this.gl, vertexShader, fragmentShader);

    this.camera = camera;
    this.vao = gl.createVertexArray();
    if (!this.vao) {
      throw new Error("createVertexArray failed");
    }
  }
  public addLight(light: BaseLight) {
    this.light = light;
  }
  public update(elapsedMsec: number, intervalSec: number): void {
    this.camera.update(intervalSec);
  }
  setGeometry() {
    var positions = new Float32Array([
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

    let mat = new Matrix4();
    let matrix = mat.translate(new Vector3([0, 50, 0]));
    matrix = matrix.rotate(Math.PI, Vector3.right)!;
    for (var ii = 0; ii < positions.length; ii += 3) {
      const vector = matrix.multiplyVector3(
        new Vector3([
          positions[ii + 0],
          positions[ii + 1],
          positions[ii + 2],
          1,
        ])
      )!;
      positions[ii + 0] = vector.x;
      positions[ii + 1] = vector.y;
      positions[ii + 2] = vector.z;
    }

    return positions;
  }
  async initData() {
    const tex = GLTexture.createColorTexture(this.gl, [255, 0, 0, 255]) 
    this.bufferInfo = BufferInfoCreater.createBufferInfoFromArrays(this.gl, {
      a_position: {
        data: new Float32Array(this.setGeometry()),
        numComponents: 3,
      },
      a_texcoord: {
        data: new Float32Array([
          // left column front
          38 / 255, 44 / 255,
          38 / 255, 223 / 255,
          113 / 255, 44 / 255,
          38 / 255, 223 / 255,
          113 / 255, 223 / 255,
          113 / 255, 44 / 255,

          // top rung front
          113 / 255, 44 / 255,
          113 / 255, 85 / 255,
          218 / 255, 44 / 255,
          113 / 255, 85 / 255,
          218 / 255, 85 / 255,
          218 / 255, 44 / 255,

          // middle rung front
          113 / 255, 112 / 255,
          113 / 255, 151 / 255,
          203 / 255, 112 / 255,
          113 / 255, 151 / 255,
          203 / 255, 151 / 255,
          203 / 255, 112 / 255,

          // left column back
          38 / 255, 44 / 255,
          113 / 255, 44 / 255,
          38 / 255, 223 / 255,
          38 / 255, 223 / 255,
          113 / 255, 44 / 255,
          113 / 255, 223 / 255,

          // top rung back
          113 / 255, 44 / 255,
          218 / 255, 44 / 255,
          113 / 255, 85 / 255,
          113 / 255, 85 / 255,
          218 / 255, 44 / 255,
          218 / 255, 85 / 255,

          // middle rung back
          113 / 255, 112 / 255,
          203 / 255, 112 / 255,
          113 / 255, 151 / 255,
          113 / 255, 151 / 255,
          203 / 255, 112 / 255,
          203 / 255, 151 / 255,

          // top
          0, 0,
          1, 0,
          1, 1,
          0, 0,
          1, 1,
          0, 1,

          // top rung right
          0, 0,
          1, 0,
          1, 1,
          0, 0,
          1, 1,
          0, 1,

          // under top rung
          0, 0,
          0, 1,
          1, 1,
          0, 0,
          1, 1,
          1, 0,

          // between top rung and middle
          0, 0,
          1, 1,
          0, 1,
          0, 0,
          1, 0,
          1, 1,

          // top of middle rung
          0, 0,
          1, 1,
          0, 1,
          0, 0,
          1, 0,
          1, 1,

          // right of middle rung
          0, 0,
          1, 1,
          0, 1,
          0, 0,
          1, 0,
          1, 1,

          // bottom of middle rung.
          0, 0,
          0, 1,
          1, 1,
          0, 0,
          1, 1,
          1, 0,

          // right of bottom
          0, 0,
          1, 1,
          0, 1,
          0, 0,
          1, 0,
          1, 1,

          // bottom
          0, 0,
          0, 1,
          1, 1,
          0, 0,
          1, 1,
          1, 0,

          // left side
          0, 0,
          0, 1,
          1, 1,
          0, 0,
          1, 1,
          1, 0,
        ]),
        numComponents: 2
      },
    });
    this.uniformsData = {
      u_texture: tex
    }
  }
  public async run(): Promise<void> {
    await this.initData();
    super.run();
  }
  public render(): void {
    this.angle += 1;
    GLHelper.setDefaultState(this.gl);

    const viewProjectionMatrix = this.camera.viewProjectionMatrix;

    // Draw a F at the origin with rotation
    this.matStack.pushMatrix();
    this.matStack.rotate(this.angle, Vector3.up)!;
    const worldViewProjectionMatrix = Matrix4.product(
      viewProjectionMatrix,
      this.matStack.modelViewMatrix
    );

    this.uniformsData.u_matrix = worldViewProjectionMatrix.values;

    this.program.bind();

    GLHelper.setBuffersAndAttributes(this.gl, this.program, this.bufferInfo);
    GLHelper.setUniforms(this.program, this.uniformsData);

    const primitiveType = this.gl.TRIANGLES;
    const offset = 0;
    const count = 16 * 6;
    this.gl.drawArrays(primitiveType, offset, count);
    this.matStack.popMatrix()
  }

  public onKeyPress(evt: CanvasKeyBoardEvent): void {
    if (evt.key === "w") {
      this.camera.moveForward(-10); // 摄像机向前运行
    } else if (evt.key === "s") {
      this.camera.moveForward(10); // 摄像机向后运行
    } else if (evt.key === "a") {
      this.camera.moveRightward(10); // 摄像机向右运行
    } else if (evt.key === "d") {
      this.camera.moveRightward(-10); // 摄像机向左运行
    } else if (evt.key === "z") {
      this.camera.moveUpward(10); // 摄像机向上运行
    } else if (evt.key === "x") {
      this.camera.moveUpward(-10); // 摄像机向下运行
    } else if (evt.key === "y") {
      this.camera.yaw(10); // 摄像机绕本身的Y轴旋转
    } else if (evt.key === "r") {
      this.camera.roll(10); // 摄像机绕本身的Z轴旋转
    } else if (evt.key == "p") {
      this.camera.pitch(10); // 摄像机绕本身的X轴旋转
    }
  }
}
