/* eslint-disable */
import { Application, CanvasKeyBoardEvent } from "./Application";
import { Camera } from "./Camera";
import { GLProgram, GLSetters } from "./GLProgram";
// import vertexShader from "@/shaders/vertexShader.vert";
// import fragmentShader from "@/shaders/fragmentShader.frag";

import vertexShader from "@/shaders/vertexShader_pointLight.vert";
import fragmentShader from "@/shaders/fragmentShader_pointLight.frag";
import { Matrix4, Vector3, Vector4 } from "./math/TSM";
import { GLHelper } from "./GLHepler";
import { PointLight } from "./Light/PointLight";
import { BaseLight } from "./Light/BaseLight";
import { BufferInfo, BufferInfoCreater } from "./GLBufferInfo";
import { GLWorldMatrixStack } from "./GLMatrixStack";
export class CameraApplication extends Application {
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
    const program = new GLProgram(this.gl, vertexShader, fragmentShader);
    this.program = program;
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

  initData() {
    this.bufferInfo = BufferInfoCreater.createBufferInfoFromArrays(this.gl, {
      a_position: {
        data: new Float32Array([
          // left column front
          0, 0, 0, 0, 150, 0, 30, 0, 0, 0, 150, 0, 30, 150, 0, 30, 0, 0,

          // top rung front
          30, 0, 0, 30, 30, 0, 100, 0, 0, 30, 30, 0, 100, 30, 0, 100, 0, 0,

          // middle rung front
          30, 60, 0, 30, 90, 0, 67, 60, 0, 30, 90, 0, 67, 90, 0, 67, 60, 0,

          // left column back
          0, 0, 30, 30, 0, 30, 0, 150, 30, 0, 150, 30, 30, 0, 30, 30, 150, 30,

          // top rung back
          30, 0, 30, 100, 0, 30, 30, 30, 30, 30, 30, 30, 100, 0, 30, 100, 30,
          30,

          // middle rung back
          30, 60, 30, 67, 60, 30, 30, 90, 30, 30, 90, 30, 67, 60, 30, 67, 90,
          30,

          // top
          0, 0, 0, 100, 0, 0, 100, 0, 30, 0, 0, 0, 100, 0, 30, 0, 0, 30,

          // top rung right
          100, 0, 0, 100, 30, 0, 100, 30, 30, 100, 0, 0, 100, 30, 30, 100, 0,
          30,

          // under top rung
          30, 30, 0, 30, 30, 30, 100, 30, 30, 30, 30, 0, 100, 30, 30, 100, 30,
          0,

          // between top rung and middle
          30, 30, 0, 30, 60, 30, 30, 30, 30, 30, 30, 0, 30, 60, 0, 30, 60, 30,

          // top of middle rung
          30, 60, 0, 67, 60, 30, 30, 60, 30, 30, 60, 0, 67, 60, 0, 67, 60, 30,

          // right of middle rung
          67, 60, 0, 67, 90, 30, 67, 60, 30, 67, 60, 0, 67, 90, 0, 67, 90, 30,

          // bottom of middle rung.
          30, 90, 0, 30, 90, 30, 67, 90, 30, 30, 90, 0, 67, 90, 30, 67, 90, 0,

          // right of bottom
          30, 90, 0, 30, 150, 30, 30, 90, 30, 30, 90, 0, 30, 150, 0, 30, 150,
          30,

          // bottom
          0, 150, 0, 0, 150, 30, 30, 150, 30, 0, 150, 0, 30, 150, 30, 30, 150,
          0,

          // left side
          0, 0, 0, 0, 0, 30, 0, 150, 30, 0, 0, 0, 0, 150, 30, 0, 150, 0,
        ]),
        numComponents: 3,
      },
      a_normal: {
        data: new Float32Array([
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
        ]),
        numComponents: 3,
      },
    });
    const light = this.light as PointLight;
    this.uniformsData = {
      u_worldViewProjection: "",
      u_worldInverseTranspose: "",
      u_viewWorldPosition: "",
      u_world: "",
      u_color: [0.2, 1, 0.2, 1],
      u_shininess: light.shininess,
      u_lightColor: light.color.values,
      u_specularColor: light.specularColor.values,
      u_lightWorldPosition: light.position.values,
    };
  }
  public run(): void {
    this.initData();
    super.run();
  }
  public render(): void {
    this.angle +=1;
    GLHelper.setDefaultState(this.gl);

    const viewProjectionMatrix = this.camera.viewProjectionMatrix;

    // Draw a F at the origin with rotation
    this.matStack.pushMatrix();
    this.matStack.rotate(this.angle, Vector3.up)!;
    const worldViewProjectionMatrix = Matrix4.product(
      viewProjectionMatrix,
      this.matStack.modelViewMatrix
    );

    const worldInverseMatrix = this.matStack.modelViewMatrix.copy().inverse();
    const worldInverseTransposeMatrix = worldInverseMatrix.copy().transpose();

    this.uniformsData.u_worldInverseTranspose =
      worldInverseTransposeMatrix.values;
    this.uniformsData.u_worldViewProjection = worldViewProjectionMatrix.values;
    this.uniformsData.u_viewWorldPosition = this.camera.position.values;
    this.uniformsData.u_world = this.matStack.modelViewMatrix.values;

    this.program.bind();

    GLHelper.setBuffersAndAttributes(this.gl, this.program, this.bufferInfo);
    GLHelper.setUniforms(this.program, this.uniformsData);
    // this.matStack.popMatrix()
    // Draw the geometry.
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
