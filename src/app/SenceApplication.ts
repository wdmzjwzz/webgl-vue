/* eslint-disable */
import { Application } from "./Application";
import { Camera } from "./Camera";
import { GLUtils } from "./lib/GLUtils";
import vertexShader from "@/shaders/shodowShader.vert";
import fragmentShader from "@/shaders/shodowShader.frag";
import { DrawObject, drawObjectList, m4, ProgramInfo, resizeCanvasToDisplaySize, setDefaults } from "twgl.js";
import { GeometryEntity } from "./Entity/GeometryEntity";
import { GLTexture } from "./GLTexture";
import { PointLight } from "./Light/PointLight";
import { GLWorldMatrixStack } from "./GLMatrixStack";
import { Matrix4 } from "./math/TSM";
export class SenceApplication extends Application {
    public entities: GeometryEntity[] = [];
    public light: PointLight | null = null
    public camera: Camera | null = null;

    public drawObjects: DrawObject[] = []

    public programInfo: ProgramInfo
    public vao: WebGLVertexArrayObject | null = null
    public gl: WebGL2RenderingContext;

    public matStack: GLWorldMatrixStack;
    constructor(canvas: HTMLCanvasElement) {
        super(canvas)
        const gl = this.canvas.getContext("webgl2")
        if (!gl) {
            throw new Error("create gl error!");
        }
        this.gl = gl;

        this.vao = this.gl.createVertexArray();
        if (!this.vao) {
            throw new Error("createVertexArray error!");
        }
        this.gl.bindVertexArray(this.vao);
        this.programInfo = GLUtils.createProgramInfo(this.gl, [vertexShader, fragmentShader])
        this.matStack = new GLWorldMatrixStack()
    }

    addCamera(camera: Camera) {
        this.camera = camera
    }
    deleteCamera() {
        this.camera = null
    }
    addLight(light: PointLight) {
        this.light = light
    }
    deleteLight() {
        this.light = null
    }
    addEntity(entity: GeometryEntity) {
        this.entities.push(entity);
    }
    getEntites() {
        return this.entities
    }
    deleteEntity(entityId: string) {
        const deleteIndex = this.entities.findIndex((entity) => entity.id === entityId)
        if (deleteIndex === -1) {
            throw new Error("要删除的entity不存在！");
        }
        this.entities.splice(deleteIndex, 1)
    }
    public start(): void {
        super.start()
        setDefaults({ attribPrefix: "a_" });
        const tex = GLUtils.createTexture(this.gl, {
            mag: this.gl.NEAREST,
            min: this.gl.LINEAR,
            target: this.gl.TEXTURE_2D,
            format: this.gl.LUMINANCE,
            width: 8,
            height: 8,
            src: [
                0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
                0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
                0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
                0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
                0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
                0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
                0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
                0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
            ],
        });

        this.matStack.pushMatrix()


        const uniforms: any = {
            u_lightWorldPos: this.light?.position,
            u_lightColor: this.light?.color,
            u_diffuseMult: [0.4, 0.5, 0.8, 1],
            u_specular: this.light?.specularColor,
            u_shininess: 50,
            u_specularFactor: 1,
            u_diffuse: tex,
            u_viewInverse: [],
            u_world: [],
            u_worldInverseTranspose: [],
            u_worldViewProjection: [],
        };
        const projection = m4.perspective(30 * Math.PI / 180, this.canvas.clientWidth / this.canvas.clientHeight, 0.5, 100);
        const eye = [0, 0, 30];
        const target = [0, 0, 0];
        const up = [0, 1, 0];
        const camera = m4.lookAt(eye, target, up);;
        const view = m4.inverse(camera);
        const viewProjection = m4.multiply(projection, view)



        const world = uniforms.u_world;
        m4.identity(world);
        m4.rotateY(world, 0, world);
        m4.rotateZ(world, 0, world);
        m4.translate(world, [0, 0, 0], world);
        m4.rotateX(world, Math.PI / 2, world);
        m4.transpose(m4.inverse(world, uniforms.u_worldInverseTranspose), uniforms.u_worldInverseTranspose);
        m4.multiply(viewProjection, uniforms.u_world, uniforms.u_worldViewProjection);
        uniforms.u_viewInverse = view

        this.entities.forEach(entity => {
            entity.addTexture(new GLTexture(tex))
            const vertices = entity.vertices;
            const bufferInfo = GLUtils.createBufferInfoFromVertices(this.gl, vertices);
            this.drawObjects.push({
                programInfo: this.programInfo,
                bufferInfo: bufferInfo,
                uniforms: uniforms,
            });

        })
        resizeCanvasToDisplaySize(this.canvas);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);


        drawObjectList(this.gl, this.drawObjects);
    }
    render() {

    }
    destroy() {
        this.gl.bindVertexArray(null)
    }
}