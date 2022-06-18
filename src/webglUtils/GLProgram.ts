import { Vector2, Vector3, Vector4, Matrix4, quat } from "./math/TSM";
import { GLHelper } from "./GLHepler";

export interface GLSetters {
  [key: string]: (...arg: unknown[]) => boolean;
}
export class GLProgram {
  public gl: WebGL2RenderingContext; // WebGL上下文渲染对象

  public program: WebGLProgram; // 链接器
  public vsShader: WebGLShader | null; // vertex shader编译器
  public fsShader: WebGLShader | null; // fragment shader编译器

  public attribSetters: GLSetters = {};
  public uniformSetters: GLSetters = {};

  public constructor(
    context: WebGL2RenderingContext,
    vsShader: string,
    fsShader: string
  ) {
    this.gl = context;

    this.vsShader = this.gl.createShader(this.gl.VERTEX_SHADER);

    this.fsShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

    const program = this.gl.createProgram();
    if (!program) {
      throw new Error("program failed");
    }
    this.program = program;
    this.loadShaders(vsShader, fsShader);
  }
  public loadShaders(vs: string, fs: string): void {
    if (!this.vsShader || !this.fsShader || !this.program) {
      throw new Error("createShader failed ");
    }
    GLHelper.compileShader(this.gl, vs, this.vsShader);
    GLHelper.compileShader(this.gl, fs, this.fsShader);
    GLHelper.linkProgram(this.gl, this.program, this.vsShader, this.fsShader);

    this.attribSetters = GLHelper.getAttribsSetters(this.gl, this.program);
    this.uniformSetters = GLHelper.getUniformsSetters(this.gl, this.program);
  }

  public bind(): void {
    this.gl.useProgram(this.program);
  }

  public unbind(): void {
    this.gl.useProgram(null);
  }

  public getUniformLocation(name: string): WebGLUniformLocation | null {
    if (!this.program) {
      throw new Error("createShader failed ");
    }
    return this.gl.getUniformLocation(this.program, name);
  }

  public getAttributeLocation(name: string): number {
    if (!this.program) {
      throw new Error("createShader failed ");
    }
    return this.gl.getAttribLocation(this.program, name);
  } 
}
