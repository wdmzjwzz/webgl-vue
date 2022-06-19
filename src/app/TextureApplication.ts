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

  async initData() {
    const tex = GLTexture.createColorTexture(this.gl, [192, 192, 192, 255,])

    this.bufferInfo = BufferInfoCreater.createBufferInfoFromArrays(this.gl, {
      a_position: {
        data: new Float32Array([1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1]),
        numComponents: 3,
      },
      normal: {
        data: new Float32Array([1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1]),
        numComponents: 3
      },
      a_texcoord: {
        data: new Float32Array([1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1]),
        numComponents: 2
      },
      indices: {
        data: new Uint16Array([0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23]),
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

    this.gl.drawElements(this.gl.TRIANGLES, this.bufferInfo!.numElements!, this.gl.UNSIGNED_SHORT, 0);
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
