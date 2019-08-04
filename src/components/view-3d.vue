<template>
<div class="v3">
  <canvas class="v3-viewport" tabindex="0"></canvas>
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
    this.model.mount(this.$el.getElementsByClassName('v3-viewport')[0] as HTMLCanvasElement);
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
}
.v3-viewport {
  position: absolute;
  background-color: $bg-main;
  outline: none;
}
</style>
