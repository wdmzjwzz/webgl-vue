/* eslint-disable */
import { Application, CanvasKeyBoardEvent } from "./Application";
import { Camera } from "./Camera";
import { GLProgram } from "./GLProgram";
import vertexShader from "@/shaders/vertexShader.vert";
import fragmentShader from "@/shaders/fragmentShader.frag";
import { Matrix4, Vector3, Vector4 } from "./math/TSM";
import { GLHelper } from "./WebGLHepler";
export class CameraApplication extends Application {
  public camera: Camera; // 在WebGLApplication的基础上增加了对摄像机系统的支持
  public angle = 0; // 用来更新旋转角度
  public gl: WebGL2RenderingContext;
  public program: GLProgram;
  public vao: WebGLVertexArrayObject | null = null;
  uniformLocations: { [key: string]: WebGLUniformLocation | null } = {};
  public constructor(canvas: HTMLCanvasElement, camera: Camera) {
    super(canvas);
    const gl = this.canvas.getContext("webgl2");
    if (!gl) {
      throw new Error("canvas.getContext(webgl2) failed");
    }
    this.gl = gl;
    const program = new GLProgram(this.gl, vertexShader, fragmentShader);
    this.program = program;
    this.camera = camera;
  }

  public update(elapsedMsec: number, intervalSec: number): void {
    this.camera.update(intervalSec);
  }
  public run(): void {

    const gl = this.gl;
    const program = this.program.program;
    // look up where the vertex data needs to go.
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const normalAttributeLocation = gl.getAttribLocation(program, "a_normal");
    // lookup uniforms
    // look up uniform locations
    this.uniformLocations.worldViewProjectionLocation = gl.getUniformLocation(program, "u_worldViewProjection");
    this.uniformLocations.worldInverseTransposeLocation =
      gl.getUniformLocation(program, "u_worldInverseTranspose");
    this.uniformLocations.colorLocation = gl.getUniformLocation(program, "u_color");
    this.uniformLocations.reverseLightDirectionLocation =
      gl.getUniformLocation(program, "u_reverseLightDirection");


    // Create a buffer and put a 2 points in it for 1 line
    const positionBuffer = gl.createBuffer();
    // Create a vertex array object (attribute state)
    this.vao = gl.createVertexArray();
    if (!this.vao) {
      throw new Error("createVertexArray failed");

    }
    // and make it the one we're currently working with
    gl.bindVertexArray(this.vao);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    this.setGeometry(gl)

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    const size = 3;          // 3 components per iteration
    const type = gl.FLOAT;   // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset);

    // create the normalr buffer, make it the current ARRAY_BUFFER
    // and copy in the normal values
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    this.setNormals(gl);

    // Turn on the attribute
    gl.enableVertexAttribArray(normalAttributeLocation);

    gl.vertexAttribPointer(
      normalAttributeLocation, size, type, normalize, stride, offset);
    super.run();
  }
  public render(): void {
    this.angle += 0.01
    GLHelper.setDefaultState(this.gl)
    this.program.bind()
    this.gl.bindVertexArray(this.vao);

    // create a viewProjection matrix. This will both apply perspective
    // AND move the world so that the camera is effectively the origin
    const viewProjectionMatrix = this.camera.viewProjectionMatrix

    // Draw a F at the origin with rotation
    let worldMatrix = new Matrix4()
    worldMatrix = worldMatrix.rotate(this.angle, Vector3.up)!
    const worldViewProjectionMatrix = Matrix4.product(viewProjectionMatrix, worldMatrix);

    const worldInverseMatrix = worldMatrix.copy().inverse()
    const worldInverseTransposeMatrix = worldInverseMatrix.copy().transpose();
   
    // Set the matrices
    this.gl.uniformMatrix4fv(
      this.uniformLocations.worldViewProjectionLocation, false,
      worldViewProjectionMatrix.values);
    this.gl.uniformMatrix4fv(
      this.uniformLocations.worldInverseTransposeLocation, false,
      worldInverseTransposeMatrix.values);

    // Set the color to use
    this.gl.uniform4fv(this.uniformLocations.colorLocation, [0.2, 1, 0.2, 1]); // green

    const mat = new Vector3([0.5, 0.7, 1]).normalize()
  
    // set the light direction.
    this.gl.uniform3fv(this.uniformLocations.reverseLightDirectionLocation, mat.values);


    // Draw the geometry.
    const primitiveType = this.gl.TRIANGLES;
    const offset = 0;
    const count = 16 * 6;
    this.gl.drawArrays(primitiveType, offset, count);
  }
  setGeometry(gl: WebGL2RenderingContext) {
    var positions = new Float32Array([
      // left column front
      0, 0, 0,
      0, 150, 0,
      30, 0, 0,
      0, 150, 0,
      30, 150, 0,
      30, 0, 0,

      // top rung front
      30, 0, 0,
      30, 30, 0,
      100, 0, 0,
      30, 30, 0,
      100, 30, 0,
      100, 0, 0,

      // middle rung front
      30, 60, 0,
      30, 90, 0,
      67, 60, 0,
      30, 90, 0,
      67, 90, 0,
      67, 60, 0,

      // left column back
      0, 0, 30,
      30, 0, 30,
      0, 150, 30,
      0, 150, 30,
      30, 0, 30,
      30, 150, 30,

      // top rung back
      30, 0, 30,
      100, 0, 30,
      30, 30, 30,
      30, 30, 30,
      100, 0, 30,
      100, 30, 30,

      // middle rung back
      30, 60, 30,
      67, 60, 30,
      30, 90, 30,
      30, 90, 30,
      67, 60, 30,
      67, 90, 30,

      // top
      0, 0, 0,
      100, 0, 0,
      100, 0, 30,
      0, 0, 0,
      100, 0, 30,
      0, 0, 30,

      // top rung right
      100, 0, 0,
      100, 30, 0,
      100, 30, 30,
      100, 0, 0,
      100, 30, 30,
      100, 0, 30,

      // under top rung
      30, 30, 0,
      30, 30, 30,
      100, 30, 30,
      30, 30, 0,
      100, 30, 30,
      100, 30, 0,

      // between top rung and middle
      30, 30, 0,
      30, 60, 30,
      30, 30, 30,
      30, 30, 0,
      30, 60, 0,
      30, 60, 30,

      // top of middle rung
      30, 60, 0,
      67, 60, 30,
      30, 60, 30,
      30, 60, 0,
      67, 60, 0,
      67, 60, 30,

      // right of middle rung
      67, 60, 0,
      67, 90, 30,
      67, 60, 30,
      67, 60, 0,
      67, 90, 0,
      67, 90, 30,

      // bottom of middle rung.
      30, 90, 0,
      30, 90, 30,
      67, 90, 30,
      30, 90, 0,
      67, 90, 30,
      67, 90, 0,

      // right of bottom
      30, 90, 0,
      30, 150, 30,
      30, 90, 30,
      30, 90, 0,
      30, 150, 0,
      30, 150, 30,

      // bottom
      0, 150, 0,
      0, 150, 30,
      30, 150, 30,
      0, 150, 0,
      30, 150, 30,
      30, 150, 0,

      // left side
      0, 0, 0,
      0, 0, 30,
      0, 150, 30,
      0, 0, 0,
      0, 150, 30,
      0, 150, 0,
    ]);

    // Center the F around the origin and Flip it around. We do this because
    // we're in 3D now with and +Y is up where as before when we started with 2D
    // we had +Y as down.

    // We could do by changing all the values above but I'm lazy.
    // We could also do it with a matrix at draw time but you should
    // never do stuff at draw time if you can do it at init time.
    let matrix = new Matrix4();
    matrix = matrix.rotate(Math.PI, Vector3.right)!
    matrix = matrix.translate(new Vector3([-50, -75, -15]));

    for (var ii = 0; ii < positions.length; ii += 3) {
      const vector = new Vector4([positions[ii + 0], positions[ii + 1], positions[ii + 2], 1])
      const translateVector = matrix.multiplyVector4(vector)
      positions[ii + 0] = translateVector.x;
      positions[ii + 1] = translateVector.y;
      positions[ii + 2] = translateVector.z;
    }

    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  }
  setNormals(gl: WebGL2RenderingContext) {
    var normals = new Float32Array([
      // left column front
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      // top rung front
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      // middle rung front
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      // left column back
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,

      // top rung back
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,

      // middle rung back
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,

      // top
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      // top rung right
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      // under top rung
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,

      // between top rung and middle
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      // top of middle rung
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      // right of middle rung
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      // bottom of middle rung.
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,

      // right of bottom
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      // bottom
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,

      // left side
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
  }
  public onKeyPress(evt: CanvasKeyBoardEvent): void {
    if (evt.key === "w") {
      this.camera.moveForward(-10); // 摄像机向前运行
    } else if (evt.key === "s") {
      this.camera.moveForward(10); // 摄像机向后运行
    } else if (evt.key === "a") {
      this.camera.moveRightward(10); // 摄像机向右运行
    } else if (evt.key === "d") {
      this.camera.moveRightward(-10); // 摄像机向左运行
    } else if (evt.key === "z") {
      this.camera.moveUpward(10); // 摄像机向上运行
    } else if (evt.key === "x") {
      this.camera.moveUpward(-10); // 摄像机向下运行
    } else if (evt.key === "y") {
      this.camera.yaw(10); // 摄像机绕本身的Y轴旋转
    } else if (evt.key === "r") {
      this.camera.roll(10); // 摄像机绕本身的Z轴旋转
    } else if (evt.key == "p") {
      this.camera.pitch(10); // 摄像机绕本身的X轴旋转
    }
  }
}
