/* eslint-disable */
import { HttpRequest } from "./HttpRequest"
interface TextureOption {
    url: string,
    wrapS: number,
    wrapT: number
}
export default class GLTexture {
    static async createTexture(gl: WebGL2RenderingContext, url: string, option?: {}) {

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
        gl.activeTexture(gl.TEXTURE0 + 0);
        // 现在图像加载完成，拷贝到纹理中
        gl.bindTexture(gl.TEXTURE_2D, texture);


        const level = 0;
        const internalFormat = gl.R8;
        const width = 3;
        const height = 2;
        const border = 0;
        const format = gl.RED;
        const type = gl.UNSIGNED_BYTE;
        const data = new Uint8Array([
            128, 64, 128,
            0, 192, 0, 
        ]);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border,
            format, type, data);

        // set the filtering so we don't need mips
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return texture
    }
}