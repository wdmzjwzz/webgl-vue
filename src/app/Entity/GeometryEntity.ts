import { m4 } from "twgl.js";
import { DataType } from "../constants";
import { GLTexture } from "../GLTexture";
import { BaseEntity } from "./BaseEntity";

export class GeometryEntity extends BaseEntity {
  public texture: GLTexture = new GLTexture({
    min: DataType.NEAREST,
    mag: DataType.NEAREST,
    src: [
      255, 255, 255, 255, 192, 192, 192, 255, 192, 192, 192, 255, 255, 255, 255,
      255,
    ],
  });
  public transform: m4.Mat4 = m4.identity();
  public vertices: any;
  constructor(texture?: GLTexture) {
    super();
    if (texture) {
      this.texture = texture;
    }
  }
  setTexture(tex: GLTexture) {
    this.texture = tex;
  }
}
