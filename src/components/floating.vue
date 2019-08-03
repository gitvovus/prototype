<template>
<div class="floating" :style="{ left: `${controller.left}px`, top: `${controller.top}px`, width: `${controller.width}px`, height: `${controller.height}px` }">
  <div class="floating-panel" :style="{ width: `${controller.width + 10}px`, height: `${controller.height + 10}px` }">
    <div class="nw-resize"></div>
    <div class="nn-resize"></div>
    <div class="ne-resize"></div>
    <div class="ww-resize"></div>
    <div class="floating-content"><slot/></div>
    <div class="ee-resize"></div>
    <div class="sw-resize"></div>
    <div class="ss-resize"></div>
    <div class="se-resize"></div>
  </div>
</div>
</template>

<script lang="ts">
import { reaction } from 'mobx';
import { Observer } from 'mobx-vue';
import { Component, Vue } from 'vue-property-decorator';
import { FloatingController } from '@/components/floating-controller';

@Observer
@Component
export default class Floating extends Vue {
  private controller!: FloatingController;
  private disposers!: Array<() => void>;

  private created() {
    this.controller = new FloatingController();
  }

  private mounted() {
    this.controller.mount(this.$el as Element);
    this.disposers = [
      reaction(
        () => [this.controller.width, this.controller.height],
        () => this.$emit('resize'),
        { fireImmediately: true },
      ),
    ];
  }

  private beforeDestroy() {
    this.disposers.forEach(disposer => disposer());
    this.disposers = [];
    this.controller.dispose();
  }
}
</script>

<style lang="scss">
@import '@/styles/vars.scss';

$resize-border: 5px;

.floating {
  position: fixed;
  box-shadow: $shadow-soft;
  z-index: $z-floating;
}
.floating-panel {
  display: grid;
  position: relative;
  left: -$resize-border;
  top: -$resize-border;
  grid-template-columns: $resize-border * 2 auto $resize-border * 2;
  grid-template-rows:  $resize-border * 2 auto $resize-border * 2;
}
.floating-content {
  z-index: 1;
  margin: -$resize-border;
  overflow: auto;
  cursor: default;
}
.nw-resize { cursor: nw-resize; }
.nn-resize { cursor: n-resize; }
.ne-resize { cursor: ne-resize; }
.ww-resize { cursor: w-resize; }
.ee-resize { cursor: e-resize; }
.sw-resize { cursor: sw-resize; }
.ss-resize { cursor: s-resize; }
.se-resize { cursor: se-resize; }
</style>
