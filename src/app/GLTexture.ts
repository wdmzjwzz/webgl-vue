import { v4 as uuidv4 } from 'uuid';
export class GLTexture {
    public id: string;
    public texture: WebGLTexture;
    constructor(texture: WebGLTexture) {
        this.id = uuidv4()
        this.texture = texture
    }
}