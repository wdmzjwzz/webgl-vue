import { uniformSetters } from "./constants";

export interface GLSetters {
    [key: string]: (...arg: any) => boolean;
}

export interface GLParamsInfo {
    localtion: number | WebGLUniformLocation;
    type: GLenum;
    size: number;
    name: string;
}
export interface BufferData {
    data: Float32Array;
    size: number;
    type: GLenum;
    stride?: number;
    offset?: number;
    normalize?: boolean;
}

export default class GLProgram {
    public gl: WebGL2RenderingContext; // WebGL上下文渲染对象
    public program: WebGLProgram; // 链接器
    public vsShader: WebGLShader; // vertex shader编译器
    public fsShader: WebGLShader; // fragment shader编译器

    public atrributeInfoMap: {
        [key: string]: GLParamsInfo;
    } = {};
    public uniformInfoMap: {
        [key: string]: GLParamsInfo;
    } = {};

    public constructor(
        gl: WebGL2RenderingContext,
        vsShader: string,
        fsShader: string
    ) {
        this.gl = gl;

        this.vsShader = this.createShader(this.gl.VERTEX_SHADER);

        this.fsShader = this.createShader(this.gl.FRAGMENT_SHADER); 
        
        this.loadShaders(vsShader, fsShader);

        this.program = this.createProgram();



        this.loadAttribInfo();
        this.loadUniformInfo();
    }
    private createShader(type: GLenum) {
        const shader = this.gl.createShader(type);
        if (!shader) {
            throw new Error(`createShader Error:${type}`);
        }
        return shader;
    }
    private compileShader(
        gl: WebGL2RenderingContext,
        code: string,
        shader: WebGLShader
    ): boolean {
        gl.shaderSource(shader, code); // 载入shader源码
        gl.compileShader(shader); // 编译shader源码

        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) === false) {
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return false;
        }
        return true;
    }
    private createProgram() {
        const program = this.gl.createProgram();
        if (!program) {
            throw new Error(`createProgram Error `);
        }
        this.linkProgram(this.gl, program, this.vsShader, this.fsShader);
        return program;
    }
    private linkProgram(
        gl: WebGL2RenderingContext,
        program: WebGLProgram,
        vsShader: WebGLShader,
        fsShader: WebGLShader
    ) {
        gl.attachShader(program, vsShader);
        gl.attachShader(program, fsShader);
        gl.linkProgram(program);

        gl.validateProgram(program);
        if (
            !gl.getProgramParameter(program, gl.VALIDATE_STATUS) ||
            !gl.getProgramParameter(program, gl.LINK_STATUS)
        ) {
            throw new Error("linkProgram failed");
        }
    }
    private loadShaders(vs: string, fs: string): void {
        this.compileShader(this.gl, vs, this.vsShader);
        this.compileShader(this.gl, fs, this.fsShader);
    }
    private loadAttribInfo() {
        const numAttribs = this.gl.getProgramParameter(
            this.program,
            this.gl.ACTIVE_ATTRIBUTES
        );
        for (let i = 0; i < numAttribs; ++i) {
            const attribInfo = this.gl.getActiveAttrib(this.program, i);
            if (!attribInfo) {
                throw new Error("getActiveAttrib error");
            }
            const location = this.gl.getAttribLocation(this.program, attribInfo.name);
            this.atrributeInfoMap[attribInfo.name] = {
                name: attribInfo.name,
                type: attribInfo.type,
                size: attribInfo.size,
                localtion: location,
            };
        }
    }

    private loadUniformInfo() {
        const numUniforms = this.gl.getProgramParameter(
            this.program,
            this.gl.ACTIVE_UNIFORMS
        );
        for (let ii = 0; ii < numUniforms; ++ii) {
            const uniformInfo = this.gl.getActiveUniform(this.program, ii);
            if (!uniformInfo) {
                throw new Error("getActiveAttrib error");
            }
            const location = this.gl.getUniformLocation(
                this.program,
                uniformInfo.name
            );
            // the uniform will have no location if it's in a uniform block
            if (!location) {
                continue;
            }
            this.uniformInfoMap[uniformInfo.name] = {
                name: uniformInfo.name,
                type: uniformInfo.type,
                size: uniformInfo.size,
                localtion: location,
            };
        }
    }

    public bind(): void {
        this.gl.useProgram(this.program);
    }

    public unbind(): void {
        this.gl.useProgram(null);
    }

    public setBufferInfo(bufferData: { [key: string]: BufferData }) {
        const keys = Object.keys(this.atrributeInfoMap);
        keys.forEach((key) => {
            const { data, size, type, stride, offset, normalize } = bufferData[key];

            const localtion = this.atrributeInfoMap[key].localtion as number;
            const normalBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);

            // Turn on the attribute
            this.gl.enableVertexAttribArray(localtion);
            this.gl.vertexAttribPointer(
                localtion,
                size,
                type,
                normalize || false,
                stride || 0,
                offset || 0
            );
        });
    }
    public setUniformInfo(uniformData: { [key: string]: any }) {
        const keys = Object.keys(this.uniformInfoMap);
        keys.forEach((key) => {
            const data = uniformData[key];
            const uniform = this.uniformInfoMap[key];
            const setter = uniformSetters[uniform.type];
            if (setter) {
                setter(this.gl, uniform.localtion, data);
            }
        });
    }
}
