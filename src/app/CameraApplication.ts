/* eslint-disable */
import { Application, CanvasKeyBoardEvent } from "./Application";
import { Camera } from "./Camera";

import vertexShader from "@/shaders/shodowShader.vert";
import fragmentShader from "@/shaders/shodowShader.frag";
import colorVS from "@/shaders/shodowColor.vert";
import colorFS from "@/shaders/shodowColor.frag";

import { BaseLight } from "./Light/BaseLight";
import { GLWorldMatrixStack } from "./GLMatrixStack";
import * as twgl from 'twgl.js'
export class CameraApplication extends Application {
  public camera: Camera; // 在WebGLApplication的基础上增加了对摄像机系统的支持
  public angle = 0; // 用来更新旋转角度
  public gl: WebGL2RenderingContext;

  public textureProgramInfo: twgl.ProgramInfo;
  public colorProgramInfo: twgl.ProgramInfo;
  public light: BaseLight | null = null;

  public bufferInfo: twgl.BufferInfo | null = null;
  public uniformsData: { [key: string]: any } = {};

  public matStack: GLWorldMatrixStack;

  public settings = {
    cameraX: 6,
    cameraY: 12,
    posX: 2.5,
    posY: 4.8,
    posZ: 7,
    targetX: 3.5,
    targetY: 0,
    targetZ: 3.5,
    projWidth: 10,
    projHeight: 10,
    perspective: false,
    fieldOfView: 120,
    bias: -0.006,
  };
  public constructor(canvas: HTMLCanvasElement, camera: Camera) {
    super(canvas);
    const gl = this.canvas.getContext("webgl2");
    if (!gl) {
      throw new Error("canvas.getContext(webgl2) failed");
    }
    this.gl = gl;
    const programOptions = {
      attribLocations: {
        'a_position': 0,
        'a_normal': 1,
        'a_texcoord': 2,
        'a_color': 3,
      },
    };
    this.textureProgramInfo = twgl.createProgramInfo(this.gl, [vertexShader, fragmentShader], programOptions);
    this.colorProgramInfo = twgl.createProgramInfo(this.gl, [colorVS, colorFS], programOptions);

    this.camera = camera;
    this.matStack = new GLWorldMatrixStack();
  }
  public addLight(light: BaseLight) {
    this.light = light;
  }
  public update(elapsedMsec: number, intervalSec: number): void {
    this.camera.update(intervalSec);
  }

  initData() {
    twgl.setAttributePrefix("a_");

    const sphereBufferInfo = twgl.primitives.createSphereBufferInfo(
      this.gl,
      1,  // radius
      32, // subdivisions around
      24, // subdivisions down
    );
    const sphereVAO = twgl.createVAOFromBufferInfo(
      this.gl, this.textureProgramInfo, sphereBufferInfo);
    const planeBufferInfo = twgl.primitives.createPlaneBufferInfo(
      this.gl,
      20,  // width
      20,  // height
      1,   // subdivisions across
      1,   // subdivisions down
    );
    const planeVAO = twgl.createVAOFromBufferInfo(
      this.gl, this.textureProgramInfo, planeBufferInfo);
    const cubeBufferInfo = twgl.primitives.createCubeBufferInfo(
      this.gl,
      2,  // size
    );
    const cubeVAO = twgl.createVAOFromBufferInfo(
      this.gl, this.textureProgramInfo, cubeBufferInfo);
    const cubeLinesBufferInfo = twgl.createBufferInfoFromArrays(this.gl, {
      position: [
        -1, -1, -1,
        1, -1, -1,
        -1, 1, -1,
        1, 1, -1,
        -1, -1, 1,
        1, -1, 1,
        -1, 1, 1,
        1, 1, 1,
      ],
      indices: [
        0, 1,
        1, 3,
        3, 2,
        2, 0,

        4, 5,
        5, 7,
        7, 6,
        6, 4,

        0, 4,
        1, 5,
        3, 7,
        2, 6,
      ],
    });
    const cubeLinesVAO = twgl.createVAOFromBufferInfo(
      this.gl, this.colorProgramInfo, cubeLinesBufferInfo);

    // make a 8x8 checkerboard texture
    const checkerboardTexture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, checkerboardTexture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,                // mip level
      this.gl.LUMINANCE,     // internal format
      8,                // width
      8,                // height
      0,                // border
      this.gl.LUMINANCE,     // format
      this.gl.UNSIGNED_BYTE, // type
      new Uint8Array([  // data
        0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
        0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
        0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
        0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
        0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
        0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
        0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
        0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
      ]));
    this.gl.generateMipmap(this.gl.TEXTURE_2D);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

    const depthTexture = this.gl.createTexture();
    const depthTextureSize = 512;
    this.gl.bindTexture(this.gl.TEXTURE_2D, depthTexture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,      // target
      0,                  // mip level
      this.gl.DEPTH_COMPONENT32F, // internal format
      depthTextureSize,   // width
      depthTextureSize,   // height
      0,                  // border
      this.gl.DEPTH_COMPONENT, // format
      this.gl.FLOAT,           // type
      null);              // data
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

    const depthFramebuffer = this.gl.createFramebuffer();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, depthFramebuffer);
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,       // target
      this.gl.DEPTH_ATTACHMENT,  // attachment point
      this.gl.TEXTURE_2D,        // texture target
      depthTexture,         // texture
      0);                   // mip level

    const fieldOfViewRadians = this.degToRad(60);

    // Uniforms for each object.
    const planeUniforms = {
      u_colorMult: [0.5, 0.5, 1, 1],  // lightblue
      u_color: [1, 0, 0, 1],
      u_texture: checkerboardTexture,
      u_world: twgl.m4.translation([0, 0, 0]),
    };
    const sphereUniforms = {
      u_colorMult: [1, 0.5, 0.5, 1],  // pink
      u_color: [0, 0, 1, 1],
      u_texture: checkerboardTexture,
      u_world: twgl.m4.translation([2, 3, 4]),
    };
    const cubeUniforms = {
      u_colorMult: [0.5, 1, 0.5, 1],  // lightgreen
      u_color: [0, 0, 1, 1],
      u_texture: checkerboardTexture,
      u_world: twgl.m4.translation([3, 1, 0]),
    };

    const drawScene = (
      projectionMatrix: any,
      cameraMatrix: any,
      textureMatrix: any,
      lightWorldMatrix: any,
      programInfo: twgl.ProgramInfo) => {
      // Make a view matrix from the camera matrix.
      const viewMatrix = twgl.m4.inverse(cameraMatrix);

      this.gl.useProgram(programInfo.program);

      // set uniforms that are the same for both the sphere and plane
      // note: any values with no corresponding uniform in the shader
      // are ignored.
      twgl.setUniforms(programInfo, {
        u_view: viewMatrix,
        u_projection: projectionMatrix,
        u_bias: this.settings.bias,
        u_textureMatrix: textureMatrix,
        u_projectedTexture: depthTexture,
        u_reverseLightDirection: lightWorldMatrix.slice(8, 11),
      });

      // ------ Draw the sphere --------

      // Setup all the needed attributes.
      this.gl.bindVertexArray(sphereVAO);

      // Set the uniforms unique to the sphere
      twgl.setUniforms(programInfo, sphereUniforms);

      // calls gl.drawArrays or gl.drawElements
      twgl.drawBufferInfo(this.gl, sphereBufferInfo);

      // ------ Draw the cube --------

      // Setup all the needed attributes.
      this.gl.bindVertexArray(cubeVAO);

      // Set the uniforms unique to the cube
      twgl.setUniforms(programInfo, cubeUniforms);

      // calls gl.drawArrays or gl.drawElements
      twgl.drawBufferInfo(this.gl, cubeBufferInfo);

      // ------ Draw the plane --------

      // Setup all the needed attributes.
      this.gl.bindVertexArray(planeVAO);

      // Set the uniforms unique to the cube
      twgl.setUniforms(programInfo, planeUniforms);

      // calls gl.drawArrays or gl.drawElements
      twgl.drawBufferInfo(this.gl, planeBufferInfo);
    }

    // Draw the scene.
    const render = () => {
      twgl.resizeCanvasToDisplaySize(this.canvas);

      this.gl.enable(this.gl.CULL_FACE);
      this.gl.enable(this.gl.DEPTH_TEST);

      // first draw from the POV of the light
      const lightWorldMatrix = twgl.m4.lookAt(
        [this.settings.posX, this.settings.posY, this.settings.posZ],          // position
        [this.settings.targetX, this.settings.targetY, this.settings.targetZ], // target
        [0, 1, 0],                                              // up
      );
      const lightProjectionMatrix = this.settings.perspective
        ? twgl.m4.perspective(
          this.degToRad(this.settings.fieldOfView),
          this.settings.projWidth / this.settings.projHeight,
          0.5,  // near
          10)   // far
        : twgl.m4.ortho(
          -this.settings.projWidth / 2,   // left
          this.settings.projWidth / 2,   // right
          -this.settings.projHeight / 2,  // bottom
          this.settings.projHeight / 2,  // top
          0.5,                      // near
          10);                      // far

      // draw to the depth texture
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, depthFramebuffer);
      this.gl.viewport(0, 0, depthTextureSize, depthTextureSize);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

      drawScene(
        lightProjectionMatrix,
        lightWorldMatrix,
        twgl.m4.identity(),
        lightWorldMatrix,
        this.colorProgramInfo);

      // now draw scene to the canvas projecting the depth texture into the scene
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
      this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
      this.gl.clearColor(0, 0, 0, 1);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

      let textureMatrix = twgl.m4.identity();
      textureMatrix = twgl.m4.translate(textureMatrix, [0.5, 0.5, 0.5]);
      textureMatrix = twgl.m4.scale(textureMatrix, [0.5, 0.5, 0.5]);
      textureMatrix = twgl.m4.multiply(textureMatrix, lightProjectionMatrix);
      // use the inverse of this world matrix to make
      // a matrix that will transform other positions
      // to be relative this this world space.
      textureMatrix = twgl.m4.multiply(
        textureMatrix,
        twgl.m4.inverse(lightWorldMatrix));

      // Compute the projection matrix
      const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      const projectionMatrix =
        twgl.m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

      // Compute the camera's matrix using look at.
      const cameraPosition = [this.settings.cameraX, this.settings.cameraY, 15];
      const target = [0, 0, 0];
      const up = [0, 1, 0];
      const cameraMatrix = twgl.m4.lookAt(cameraPosition, target, up);

      drawScene(
        projectionMatrix,
        cameraMatrix,
        textureMatrix,
        lightWorldMatrix,
        this.textureProgramInfo);

      // ------ Draw the frustum ------
      {
        const viewMatrix = twgl.m4.inverse(cameraMatrix);

        this.gl.useProgram(this.colorProgramInfo.program);

        // Setup all the needed attributes.
        this.gl.bindVertexArray(cubeLinesVAO);

        // scale the cube in Z so it's really long
        // to represent the texture is being projected to
        // infinity
        const mat = twgl.m4.multiply(
          lightWorldMatrix, twgl.m4.inverse(lightProjectionMatrix));

        // Set the uniforms we just computed
        twgl.setUniforms(this.colorProgramInfo, {
          u_color: [1, 1, 1, 1],
          u_view: viewMatrix,
          u_projection: projectionMatrix,
          u_world: mat,
        });

        // calls gl.drawArrays or gl.drawElements
        twgl.drawBufferInfo(this.gl, cubeLinesBufferInfo, this.gl.LINES);
      }
    }
    render();
  }
  public run(): void {
    this.initData();
    super.run();
  }
  public render(): void {

  }
  degToRad(d: number) {
    return d * Math.PI / 180;
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
