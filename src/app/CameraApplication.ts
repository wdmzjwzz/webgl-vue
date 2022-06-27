/* eslint-disable */
import { Application, CanvasKeyBoardEvent } from "./Application";
import { Camera } from "./Camera";

import colorVS from "@/shaders/shodowColor.vert";
import colorFS from "@/shaders/shodowColor.frag";

import { BaseLight } from "./Light/BaseLight";
import { GLWorldMatrixStack } from "./GLMatrixStack";
import * as twgl from "twgl.js";
import GLProgram, { BufferData, BufferInfo } from "./GLProgram";
import { GLHelper } from "./GLHepler";
import { Matrix4, Vector3 } from "./math/TSM";
export class CameraApplication extends Application {
  public camera: Camera; // 在WebGLApplication的基础上增加了对摄像机系统的支持
  public angle = 0; // 用来更新旋转角度
  public gl: WebGL2RenderingContext;

  public light: BaseLight | null = null;

  public bufferInfo: BufferInfo | null = null;
  public uniformsData: { [key: string]: any } = {};

  public matStack: GLWorldMatrixStack;

  public glProgram: GLProgram;

  public vao: WebGLVertexArrayObject;
  public constructor(canvas: HTMLCanvasElement, camera: Camera) {
    super(canvas);
    const gl = this.canvas.getContext("webgl2");
    if (!gl) {
      throw new Error("canvas.getContext(webgl2) failed");
    }
    const vao = gl.createVertexArray();
    if (!vao) {
      throw new Error("createVertexArray failed");
    }
    this.vao = vao;
    this.gl = gl;
    this.camera = camera;
    this.matStack = new GLWorldMatrixStack();
    this.glProgram = new GLProgram(gl, colorVS, colorFS);
  }
  public addLight(light: BaseLight) {
    this.light = light;
  }
  public update(elapsedMsec: number, intervalSec: number): void {}

  resizeCanvasToDisplaySize() {
    const canvas = this.gl.canvas as HTMLCanvasElement;
    if (canvas.width !== canvas.clientWidth) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    }
  }
  public start(): void {
    const { vertexes, colors, indices } = GLHelper.createFVertxes();

    const bufferData: {
      [key: string]: BufferData;
    } = {
      a_position: {
        data: vertexes,
        numComponents: 3,
      },
      a_color: {
        data: colors,
        numComponents: 4,
      },
      indices: {
        data: indices,
      },
    };
    this.bufferInfo = GLHelper.createBuffers(this.gl, bufferData);
    super.start();
  }
  public render(): void {
    GLHelper.setDefaultState(this.gl);
    this.matStack.pushMatrix();
    this.matStack.modelViewMatrix.translate(new Vector3([0, 0, -6]));
    const viewProjection = this.camera.viewProjection;
    const u_matrix = Matrix4.product(
      this.matStack.modelViewMatrix,
      viewProjection
    );
    GLHelper.setAttributeInfo(
      this.gl,
      this.bufferInfo!,
      this.glProgram.atrributeInfoMap
    );
    GLHelper.setUniformInfo(
      this.gl,
      {
        u_matrix: u_matrix.values,
      },
      this.glProgram.uniformInfoMap
    );
    this.glProgram.bind();

    const vertexCount = 4;
    const type = this.gl.UNSIGNED_SHORT;
    const offset = 0;
    this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset);
  }
  degToRad(d: number) {
    return (d * Math.PI) / 180;
  }
  public onKeyPress(evt: CanvasKeyBoardEvent): void {}
}
