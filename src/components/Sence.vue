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
  
  mounted(): void {
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    if (!this.$refs) {
      return;
    } 
    const camera = new Camera(canvas.width, canvas.height, 45, 0.1, 1000);
    const sence = new CameraApplication(canvas, camera); 
    sence.start(); 
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
