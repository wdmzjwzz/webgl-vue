
import { GeometryEntity } from "./GeometryEntity";
import { m4 } from 'twgl.js';
import { GLUtils } from "../lib/GLUtils";
import { EntityType } from "../constants";

export class PlaneEntity extends GeometryEntity {
    public type = EntityType.Plane
    constructor(public width: number, public depth: number, public subdivisionsWidth?: number, public subdivisionsDepth?: number, matrix?: m4.Mat4) {
        super()
        this.transform = matrix;
        this.vertices = GLUtils.createPlaneVertices(this.width, this.depth, this.subdivisionsWidth, this.subdivisionsDepth, this.transform)
    }
    public applyTransform(transform: m4.Mat4) {
        this.transform = transform;
        this.update()
    }
    
    update() {
        this.vertices = GLUtils.createPlaneVertices(this.width, this.depth, this.subdivisionsWidth, this.subdivisionsDepth, this.transform)
    }
}