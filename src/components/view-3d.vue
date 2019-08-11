<template>
<div class="v3" tabindex="0">
  <canvas class="v3-canvas"></canvas>
  <div class="v3-overlay">
    <element-node :model="model.root"/>
  </div>
  <slot/>
</div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

import { View3d as Model } from '@/modules/view-3d';

@Observer
@Component
export default class View3d extends Vue {
  @Prop() private model!: Model;

  private mounted() {
    this.model.mount(this.$el as HTMLElement);
  }

  private beforeDestroy() {
    this.model.unmount();
  }
}
</script>

<style lang="scss">
@import '@/styles/vars.scss';

.v3 {
  position: relative;
  width: 100%;
  height: 100%;
  flex: 1 1 0;
  background-color: $bg-main;
  outline: none;
}
.v3-canvas {
  position: absolute;
}
.v3-overlay {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: none;
}
</style>
