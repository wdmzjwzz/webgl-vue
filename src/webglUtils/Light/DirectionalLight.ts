import { Vector3 } from "../math/TSM"

export enum LightType {
    Point,
    Directional,
    Spot
}
export class DirectionalLight {
    public color: Vector3
    public direction: Vector3
    constructor(direction: Vector3, color = new Vector3([0, 0, 0])) {
        this.color = color;
        this.direction = direction
    }
}