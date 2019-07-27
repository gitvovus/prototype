<template>
<div class="lorem">
  <div class="lorem-header">
    <div class="lorem-title">SVG: {{model.controller.left.toFixed()}} {{model.controller.top.toFixed()}}</div>
  </div>
  <div class="lorem-content">
    <div class="svg-container">
      <svg-item class="svg" :style="{ left: `${model.controller.left}px`, top: `${model.controller.top}px` }" :model="model.model"/>
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
    this.model.activate(this.$el.getElementsByClassName('svg-container')[0] as HTMLDivElement);
  }

  private beforeDestroy() {
    this.model.deactivate();
  }
}
</script>

<style lang="scss">
.svg-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.75);
}
.svg {
  position: absolute;
}
</style>
