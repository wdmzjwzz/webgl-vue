/* eslint-disable */
import { HttpRequest } from "./HttpRequest"
interface TextureOption{
    url:string,
    wrapS:number,
    wrapT:number
}
export default class GLTexture {
    static async createTexture(gl: WebGL2RenderingContext, url: string,option?:{}) {

        var texture = gl.createTexture();

        const image = await HttpRequest.loadImageAsync(url)
        // 现在图像加载完成，拷贝到纹理中
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);

        return texture
    }
    static createColorTexture(gl: WebGL2RenderingContext, rgba: number[]) {

        var texture = gl.createTexture(); 
        // 现在图像加载完成，拷贝到纹理中
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([...rgba]));

        return texture
    }
}