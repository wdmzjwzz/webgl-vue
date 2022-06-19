/* eslint-disable */
import { m4 } from "twgl.js";
import { MathHelper } from "./math/MathHelper";
import { Matrix4, Vector2, Vector3 } from "./math/TSM";

export enum ECameraType {
  FPSCAMERA,
  FLYCAMERA,
}

export class Camera {
  public projectionMat4: m4.Mat4
  public position: m4.Mat4
  public viewMat4: m4.Mat4
  public viewInverseMat4: m4.Mat4
  public viewProjection: m4.Mat4
  public constructor(
    width: number,
    height: number,
    fovY: number = 45.0,
    zNear: number = 1,
    zFar: number = 1000
  ) {

    const fov = MathHelper.toRadian(fovY);
    const aspect = width / height;

    this.projectionMat4 = m4.perspective(fov, aspect, zNear, zFar);
    this.position = [0, 0, -30];
    const target = [0, 0, 0];
    const up = [0, 1, 0];

    this.viewMat4 = m4.lookAt(this.position, target, up);
    this.viewInverseMat4 = m4.inverse(this.viewMat4);
    this.viewProjection = m4.multiply(this.projectionMat4, this.viewMat4);

  }
  setPositon(position: number[]) {
    this.position = position
  }
}
