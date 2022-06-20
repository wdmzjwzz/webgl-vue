<template>
  <div class="senceContainer">
    <canvas id="canvas" ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { SenceApplication } from "@/app/SenceApplication";
import { Camera } from "@/app/Camera";
import { PointLight } from "@/app/Light/PointLight";
import { PlaneEntity } from "@/app/Entity/PlaneEntity";
import { SphereEntity } from "@/app/Entity/SphereEntity";
import { GLTexture } from "@/app/GLTexture";
import { DataType } from "@/app/constants";
import { m4, v3 } from "twgl.js";
@Options({
  props: {},
})
export default class Sence extends Vue {
  app: Sence | null = null;

  mounted(): void {
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    this.resizeCanvasToDisplaySize(canvas);
    const camera = new Camera(canvas.width, canvas.height, 45, 0.1, 1000);

    const pointLight = new PointLight(
      [0, 10, 200],
      5,
      [1, 1, 1, 1],
      [1, 1, 1, 1]
    );
    const plane = new PlaneEntity(20, 20);
    
    plane.setTexture(
      new GLTexture({
        mag: DataType.NEAREST,
        min: DataType.LINEAR,
        target: DataType.TEXTURE_2D,
        format: DataType.LUMINANCE,
        width: 8,
        height: 8,
        src: [
          0xff, 0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xcc, 0xff, 0xcc,
          0xff, 0xcc, 0xff, 0xcc, 0xff, 0xff, 0xcc, 0xff, 0xcc, 0xff, 0xcc,
          0xff, 0xcc, 0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xff, 0xff,
          0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xcc, 0xff, 0xcc, 0xff,
          0xcc, 0xff, 0xcc, 0xff, 0xff, 0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xff,
          0xcc, 0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xff,
        ],
      })
    );
    const sphere = new SphereEntity(1, 32, 24);
    sphere.setTexture(
      new GLTexture({
        mag: DataType.NEAREST,
        min: DataType.LINEAR,
        target: DataType.TEXTURE_2D,
        format: DataType.LUMINANCE,
        width: 8,
        height: 8,
        src: [
          0xff, 0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xcc, 0xff, 0xcc,
          0xff, 0xcc, 0xff, 0xcc, 0xff, 0xff, 0xcc, 0xff, 0xcc, 0xff, 0xcc,
          0xff, 0xcc, 0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xff, 0xff,
          0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xcc, 0xff, 0xcc, 0xff,
          0xcc, 0xff, 0xcc, 0xff, 0xff, 0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xff,
          0xcc, 0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xff,
        ],
      })
    );
    sphere.transform = m4.rotateX(sphere.transform, Math.PI / 3);
    const translate = m4.translate(m4.identity(), v3.create(0,0.8, 0));
    sphere.applyTransform(m4.multiply(translate, sphere.transform));

    const sence = new SenceApplication(canvas);
    sence.addCamera(camera);
    sence.addLight(pointLight);
    sence.addEntity(plane);
    sence.addEntity(sphere);
    sence.start();
  }

  resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): boolean {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    const needResize =
      canvas.width !== displayWidth || canvas.height !== displayHeight;

    if (needResize) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }

    return needResize;
  }
}
</script>

<style scoped>
#canvas {
  width: 100%;
  height: 100%;
  display: block;
}
.senceContainer {
  width: 100%;
  height: 100vh;
}
</style>
