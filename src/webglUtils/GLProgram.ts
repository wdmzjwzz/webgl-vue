import { Vector2, Vector3, Vector4, Matrix4, quat } from "./math/TSM";
import { GLHelper } from "./WebGLHepler";

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

    GLHelper.logProgramActiveAttribs(this.gl, this.program);
    GLHelper.logProgramAtciveUniforms(this.gl, this.program);
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

  public setAttributeLocation(name: string, loc: number): void {
    if (!this.program) {
      throw new Error("createShader failed ");
    }
    this.gl.bindAttribLocation(this.program, loc, name);
  }

  public loadSampler(unit = 0): boolean {
    return this.setSampler("u_diffuse", unit);
  }

  public setInt(name: string, i: number): boolean {
    const loc: WebGLUniformLocation | null = this.getUniformLocation(name);
    if (loc) {
      this.gl.uniform1i(loc, i);
      return true;
    }
    return false;
  }

  public setFloat(name: string, f: number): boolean {
    const loc: WebGLUniformLocation | null = this.getUniformLocation(name);
    if (loc) {
      this.gl.uniform1f(loc, f);
      return true;
    }
    return false;
  }

  public setVector2(name: string, v2: Vector2): boolean {
    const loc: WebGLUniformLocation | null = this.getUniformLocation(name);
    if (loc) {
      this.gl.uniform2fv(loc, v2.values);
      return true;
    }
    return false;
  }

  public setVector3(name: string, v3: Vector3): boolean {
    const loc: WebGLUniformLocation | null = this.getUniformLocation(name);
    if (loc) {
      this.gl.uniform3fv(loc, v3.values);
      return true;
    }
    return false;
  }

  public setVector4(name: string, v4: Vector4): boolean {
    const loc: WebGLUniformLocation | null = this.getUniformLocation(name);
    if (loc) {
      this.gl.uniform4fv(loc, v4.values);
      return true;
    }
    return false;
  }

  public setQuat(name: string, q: quat): boolean {
    const loc: WebGLUniformLocation | null = this.getUniformLocation(name);
    if (loc) {
      this.gl.uniform4fv(loc, q.values);
      return true;
    }
    return false;
  }

  public setMatrix3(name: string, mat: Matrix4): boolean {
    const loc: WebGLUniformLocation | null = this.getUniformLocation(name);
    if (loc) {
      this.gl.uniformMatrix3fv(loc, false, mat.values);
      return true;
    }
    return false;
  }

  public setMatrix4(name: string, mat: Matrix4): boolean {
    const loc: WebGLUniformLocation | null = this.getUniformLocation(name);
    if (loc) {
      this.gl.uniformMatrix4fv(loc, false, mat.values);
      return true;
    }
    return false;
  }

  public setSampler(name: string, sampler: number): boolean {
    const loc: WebGLUniformLocation | null = this.getUniformLocation(name);
    if (loc) {
      this.gl.uniform1i(loc, sampler);
      return true;
    }
    return false;
  }
}
