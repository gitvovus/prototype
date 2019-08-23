<template>
<div class="view" :style="{ backgroundImage: `url(${bg})` }">
  <element-node class="overlay" tabindex="0" :model="model.root"/>
  <slot/>
</div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

import * as img from '@/lib/images';
import { View2d as Model } from '@/modules/view-2d';

const step = 10;
const dark: img.RGBA = [0x80, 0x90, 0xa0, 0xff];
const lite: img.RGBA = [0xa0, 0xb0, 0xc0, 0xff];
const bg = img.fromImageData(img.generate(step * 2, step * 2, (x, y) => ((x - x % step) / step & 1) === ((y - y % step) / step & 1) ? lite : dark));

@Observer
@Component
export default class View2d extends Vue {
  @Prop() private model!: Model;
  private bg = bg;

  private mounted() {
    this.model.mount(this.$el as HTMLElement);
  }

  private beforeDestroy() {
    this.model.unmount();
  }
}
</script>

