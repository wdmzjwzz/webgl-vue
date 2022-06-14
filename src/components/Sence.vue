<template>
  <div class="senceContainer">
    <canvas id="canvas" ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { GLProgram } from "@/webglUtils/GLProgram";
import vertexShader from "@/shaders/vertexShader.vert";
import fragmentShader from "@/shaders/fragmentShader.frag";
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
  data() {
    return {};
  }
  mounted() {
    this.canvas = this.$refs.canvas as HTMLCanvasElement;
    this.gl = this.canvas.getContext("webgl2");
    this.resizeCanvasToDisplaySize();
    this.program = new GLProgram(this.gl!, vertexShader, fragmentShader);
  }

  resizeCanvasToDisplaySize() {
    const canvas = this.$refs.canvas as HTMLCanvasElement;
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
