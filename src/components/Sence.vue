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
    msg: String,
  },
})
export default class Sence extends Vue {
  msg!: string;
  program: GLProgram | null = null;
  gl: WebGL2RenderingContext | null = null;
  canvas: HTMLCanvasElement | null = null;
  app: CameraApplication | null = null;

  mounted(): void {
    this.canvas = this.$refs.canvas as HTMLCanvasElement;
    this.resizeCanvasToDisplaySize(this.canvas);
    const camera = new Camera(
      this.canvas.width,
      this.canvas.height,
      45,
      0.1,
      1000
    );
    camera.z = 500;
    const app = new CameraApplication(this.canvas, camera);
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
