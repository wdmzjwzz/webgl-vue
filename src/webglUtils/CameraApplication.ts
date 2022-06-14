import { Application, CanvasKeyBoardEvent } from "./Application";
import { Camera } from "./Camera";
import { GLProgram } from "./GLProgram";
import vertexShader from "@/shaders/vertexShader.vert";
import fragmentShader from "@/shaders/fragmentShader.frag";
export class CameraApplication extends Application {
  public camera: Camera; // 在WebGLApplication的基础上增加了对摄像机系统的支持
  public angle = 0; // 用来更新旋转角度
  public gl: WebGL2RenderingContext;
  public program: GLProgram;
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

  public render(): void {
    const gl = this.gl;
    const program = this.program.program;
    // look up where the vertex data needs to go.
    const positionAttributeLocation = gl.getAttribLocation(
      program,
      "a_position"
    );

    // lookup uniforms
    const colorLocation = gl.getUniformLocation(program, "u_color");
    const matrixLocation = gl.getUniformLocation(program, "u_matrix");

    // Create a buffer and put a 2 points in it for 1 line
    const positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [-2, -2, 2, 2];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Create a vertex array object (attribute state)
    const vao = gl.createVertexArray();

    // and make it the one we're currently working with
    gl.bindVertexArray(vao);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);
    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    const size = 2; // 2 components per iteration
    const type = gl.FLOAT; // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(vao);

    // Compute the matrices
    const matrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

    // Set the matrix.
    gl.uniformMatrix3fv(matrixLocation, false, matrix);

    // Draw in Red
    gl.uniform4fv(colorLocation, [1, 0, 0, 1]);

    gl.drawArrays(gl.LINES, offset, 2);
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
