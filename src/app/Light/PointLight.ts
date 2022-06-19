import { Vector3 } from "../math/TSM";
import { BaseLight } from "./BaseLight";

export class PointLight extends BaseLight {
  public position: Vector3;
  public specularColor: Vector3;
  constructor(
    position: Vector3,
    shininess = 50,
    specularColor = new Vector3([0, 0, 0]),
    color = new Vector3([0, 0, 0])
  ) {
    super(color, shininess);
    
    this.position = position; 
    this.specularColor = specularColor.normalize();
  }
}
