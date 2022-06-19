import { Vector3 } from "../math/TSM";

export class BaseLight {
  public color: Vector3;
  public shininess: number;
  constructor(color = new Vector3([0, 0, 0]), shininess = 50) {
    this.color = color.normalize();
    this.shininess = shininess;
  }
}
