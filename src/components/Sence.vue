<template>
  <div class="senceContainer">
    <canvas id="canvas" ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"; 
import { CameraApplication } from "@/app/CameraApplication";
import { Camera } from "@/webglUtils/Camera";
import { PointLight } from "@/webglUtils/Light/PointLight";
import { Vector3 } from "@/webglUtils/math/TSM";
@Options({
  props: {},
})
export default class Sence extends Vue {
  app: CameraApplication | null = null;

  mounted(): void {
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    this.resizeCanvasToDisplaySize(canvas);
    const camera = new Camera(canvas.width, canvas.height, 45, 0.1, 1000);
    camera.z = 500;
    const sence = new CameraApplication(canvas, camera);
    const pointLight = new PointLight(
      new Vector3([0, 0, 100]),
      50,
      new Vector3([1, 0.2, 0.2]),
      new Vector3([1, 0.6, 0.6])
    );
    sence.addLight(pointLight);
    sence.run();
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
