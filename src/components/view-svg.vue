<template>
<div class="lorem">
  <div class="lorem-header">
    <div class="lorem-title">
      viewport: {{model.controller.width}} &times; {{model.controller.height}} |
      offset: {{model.controller.offsetX.toFixed()}} {{model.controller.offsetY.toFixed()}} |
      scale: {{model.controller.scale.toFixed(2)}}
    </div>
  </div>
  <div class="lorem-content">
    <div class="svg-container" tabindex="0">
      <svg-node :model="model.root"/>
    </div>
  </div>
</div>
</template>


<script lang="ts">
import { Observer } from 'mobx-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

import { SvgScene as Model } from '@/modules/svg-scene';

@Observer
@Component
export default class ViewSvg extends Vue {
  @Prop() private model!: Model;

  private mounted() {
    this.model.mount(this.$el.getElementsByClassName('svg-container')[0] as HTMLElement);
  }

  private beforeDestroy() {
    this.model.unmount();
  }
}
</script>

<style lang="scss">
.svg-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: none;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
