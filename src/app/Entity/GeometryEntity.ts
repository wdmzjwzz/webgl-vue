import { m4 } from "twgl.js";
import { GLTexture } from "../GLTexture";
import { BaseEntity } from "./BaseEntity";

export class GeometryEntity extends BaseEntity {
    public textures: GLTexture[]
    public transform: m4.Mat4 | undefined;
    public vertices: any;
    constructor(texture: GLTexture[] = []) {
        super()
        this.textures = texture
    }
    addTexture(tex: GLTexture) {
        const hasTex = this.textures.find(item => item.id === tex.id)
        if (hasTex) {
            console.warn('texture不能重复添加!')
            return
        }
        this.textures.push(tex)
    }
}