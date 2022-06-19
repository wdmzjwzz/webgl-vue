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
import { Vector3 } from "@/app/math/TSM";
import { PlaneEntity } from "@/app/Entity/PlaneEntity";
@Options({
  props: {},
})
export default class Sence extends Vue {
  app: Sence | null = null;

  mounted(): void {
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    this.resizeCanvasToDisplaySize(canvas);
    const camera = new Camera(canvas.width, canvas.height, 45, 0.1, 100);
    const pointLight = new PointLight(
      [1, 8, 10],
      50,
      [1, 1, 1, 1],
      [1, 1, 1, 1]
    );
    const plane = new PlaneEntity(20, 20);
    const sence = new SenceApplication(canvas);
    sence.addCamera(camera);
    sence.addLight(pointLight);
    sence.addEntity(plane);
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
