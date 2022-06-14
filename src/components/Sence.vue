<template>
  <div class="senceContainer">
    <canvas id="canvas" ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { GLProgram } from "@/webglUtils/GLProgram";
import { CameraApplication } from "@/webglUtils/CameraApplication";
import { Camera } from "@/webglUtils/Camera";
@Options({
  props: {
  },
})
export default class Sence extends Vue {
  app: CameraApplication | null = null;

  mounted(): void {
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    this.resizeCanvasToDisplaySize(canvas);
    const camera = new Camera(canvas.width, canvas.height, 45, 0.1, 1000);
    camera.z = 500;
    const app = new CameraApplication(canvas, camera);
    app.run();
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
