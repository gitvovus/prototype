<template>
<div class="window">
  <div class="window-header">
    <div class="window-title">
      viewport: {{model.controller.width}} &times; {{model.controller.height}} |
      offset: {{model.controller.offsetX.toFixed()}} {{model.controller.offsetY.toFixed()}} |
      scale: {{model.controller.scale.toFixed(2)}}
    </div>
  </div>
  <div class="window-content">
    <div class="svg-container" tabindex="0">
      <svg-node :model="model.root"/>
    </div>
    <div class="anchor h-center bottom">
      <div class="toolbar">
        <div class="filter-wrapper">
          <slider :min="0" :max="100" v-model="model.brightness"/>
        </div>
        <div class="filter-wrapper">
          <slider :min="0" :max="100" v-model="model.contrast"/>
        </div>
      </div>
    </div>
  </div>
</div>
</template>


<script lang="ts">
import { Observer } from 'mobx-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

import { SvgScene } from '@/modules/svg-scene';

@Observer
@Component
export default class ViewSvg extends Vue {
  @Prop() private model!: SvgScene;

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
.filter-wrapper {
  display: inline-block;
  width: 100px;
  margin: 10px;
}
</style>
