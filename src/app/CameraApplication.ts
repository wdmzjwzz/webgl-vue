/* eslint-disable */
import { Application, CanvasKeyBoardEvent } from "./Application";
import { Camera } from "./Camera";


import colorVS from "@/shaders/shodowColor.vert";
import colorFS from "@/shaders/shodowColor.frag";

import { BaseLight } from "./Light/BaseLight";
import { GLWorldMatrixStack } from "./GLMatrixStack";
import * as twgl from 'twgl.js'
import GLProgram, { BufferData } from "./GLProgram";
import { GLHelper } from "./GLHepler";
import { Matrix4, Vector3 } from "./math/TSM";
export class CameraApplication extends Application {
  public camera: Camera; // 在WebGLApplication的基础上增加了对摄像机系统的支持
  public angle = 0; // 用来更新旋转角度
  public gl: WebGL2RenderingContext;

  public light: BaseLight | null = null;

  public bufferInfo: twgl.BufferInfo | null = null;
  public uniformsData: { [key: string]: any } = {};

  public matStack: GLWorldMatrixStack;

  public glProgram: GLProgram

  public vao: WebGLVertexArrayObject
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
    this.vao = vao
    this.gl = gl;
    this.camera = camera;
    this.matStack = new GLWorldMatrixStack();
    this.glProgram = new GLProgram(gl, colorVS, colorFS)

  }
  public addLight(light: BaseLight) {
    this.light = light;
  }
  public update(elapsedMsec: number, intervalSec: number): void {

  }


  public start(): void {
    const { vertexes, normals } = GLHelper.createFVertxes()
    const bufferData: {
      [key: string]: BufferData
    } = {
      a_position: {
        data: vertexes,
        size: 3,
        type: this.gl.FLOAT,
        stride: 0,
        offset: 0,
        normalize: false
      },
      a_normal: {
        data: normals,
        size: 3,
        type: this.gl.FLOAT,
        stride: 0,
        offset: 0,
        normalize: false
      }
    }
    // and make it the one we're currently working with
    this.gl.bindVertexArray(this.vao);
    this.glProgram.setBufferInfo(bufferData)
    this.glProgram.bind()
    super.start();
  }
  public render(): void {
    GLHelper.setDefaultState(this.gl);
    // Compute the matrix
    this.angle += 0.1


    const viewProjectionMatrix = this.camera.viewProjection

    // Draw a F at the origin with rotation
    this.matStack.pushMatrix()
    // this.matStack.rotate(this.angle, Vector3.up)

    const worldMatrix = this.matStack.modelViewMatrix;
    const worldViewProjectionMatrix = Matrix4.product(viewProjectionMatrix, worldMatrix);
    worldMatrix.inverse();
    worldMatrix.transpose();

    const uniformInfo = {
      u_worldViewProjection: worldViewProjectionMatrix.values,
      u_worldInverseTranspose: worldMatrix.values,
      u_color: [0.2, 1, 0.2, 1],
      u_reverseLightDirection: new Vector3([0.2, 1, 0.2, 1]).normalize().values
    }
    this.glProgram.setUniformInfo(uniformInfo)
    // Draw the geometry.
    const primitiveType = this.gl.TRIANGLES;
    const offset = 0;
    const count = 16 * 6;
    this.gl.drawArrays(primitiveType, offset, count);
    this.matStack.popMatrix()
  }
  degToRad(d: number) {
    return d * Math.PI / 180;
  }
  public onKeyPress(evt: CanvasKeyBoardEvent): void {

  }
}
