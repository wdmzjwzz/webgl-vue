<template>
  <div class="senceContainer">
    <canvas id="canvas" ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { CameraApplication } from "@/app/CameraApplication";
import { Camera } from "@/app/Camera";
@Options({
  props: {},
})
export default class Sence extends Vue {
  app: Sence | null = null;
  resizeCanvasToDisplaySize = () => {
    if (!this.$refs) {
      return;
    }
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    // const displayWidth = canvas.clientWidth;
    // const displayHeight = canvas.clientHeight;

    // const needResize =
    //   canvas.width !== displayWidth || canvas.height !== displayHeight;

    // if (needResize) {
    //   canvas.width = displayWidth;
    //   canvas.height = displayHeight;
    // }

    // return needResize;
  };
  mounted(): void {
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    if (!this.$refs) {
      return;
    }
    this.resizeCanvasToDisplaySize();
    const camera = new Camera(canvas.width, canvas.height, 45, 0.1, 1000);
    const sence = new CameraApplication(canvas, camera);

    sence.start();
    window.addEventListener("resize", this.resizeCanvasToDisplaySize);
  }
  unmounted() {
    window.removeEventListener("resize", this.resizeCanvasToDisplaySize);
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
