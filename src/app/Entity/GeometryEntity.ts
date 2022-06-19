import { m4 } from "twgl.js";
import { GLTexture } from "../GLTexture";
import { BaseEntity } from "./BaseEntity";

export class GeometryEntity extends BaseEntity {
    public texture: GLTexture | undefined
    public transform: m4.Mat4 = m4.identity();
    public vertices: any;
    constructor(texture?: GLTexture) {
        super()
        this.texture = texture
    }
    setTexture(tex: GLTexture) {
        this.texture = tex
    }
}