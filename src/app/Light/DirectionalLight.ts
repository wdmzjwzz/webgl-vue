import { Vector3 } from "../math/TSM";
import { BaseLight } from "./BaseLight";

export class DirectionalLight extends BaseLight {
  public direction: Vector3;
  constructor(direction: Vector3, color = new Vector3([0, 0, 0])) {
    super(color);

    this.direction = direction;
  }
}
