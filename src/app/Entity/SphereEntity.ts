/* eslint-disable */
import { GeometryEntity } from "./GeometryEntity";
import { m4 } from "twgl.js";
import { GLUtils } from "../lib/GLUtils";
import { EntityType } from "../constants";

export class SphereEntity extends GeometryEntity {
  public type = EntityType.Plane;
  constructor(
    public radius: number,
    public subdivisionsAxis: number,
    public subdivisionsHeight: number,
    public opt_startLatitudeInRadians?: number | undefined,
    public opt_endLatitudeInRadians?: number | undefined,
    public opt_startLongitudeInRadians?: number | undefined,
    public opt_endLongitudeInRadians?: number | undefined
  ) {
    super();

    this.vertices = GLUtils.createSphereVertices(
      radius,
      subdivisionsAxis,
      subdivisionsHeight,
      opt_startLatitudeInRadians,
      opt_endLatitudeInRadians,
      opt_startLongitudeInRadians,
      opt_endLongitudeInRadians
    );
  }
  public applyTransform(transform: m4.Mat4) {
    this.transform = transform;
    this.update();
  }

  update() {}
}
