<template>
<div class="v2" :style="{ backgroundImage: `url(${bg})` }">
  <div class="svg-container" tabindex="0">
    <element-node :model="model.root"/>
  </div>
  <slot/>
</div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

import * as img from '@/lib/images';
import { View2d as Model } from '@/modules/view-2d';

const step = 10;
const lite: img.RGBA = [0xc8, 0xd8, 0xe8, 0xff];
const dark: img.RGBA = [0xb0, 0xc0, 0xd0, 0xff];
const bg = img.fromImageData(img.generate(step * 2, step * 2, (x, y) => ((x - x % step) / step & 1) === ((y - y % step) / step & 1) ? lite : dark));

@Observer
@Component
export default class View2d extends Vue {
  @Prop() private model!: Model;
  private bg = bg;

  private mounted() {
    this.model.mount(this.$el.getElementsByClassName('svg-container')[0] as HTMLElement);
  }

  private beforeDestroy() {
    this.model.unmount();
  }
}
</script>

<style lang="scss">
@import '@/styles/vars.scss';

.v2 {
  position: relative;
  width: 100%;
  height: 100%;
  flex: 1 1 0;
  overflow: hidden;
}
.svg-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: none;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
