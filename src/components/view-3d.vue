<template>
<div class="view" tabindex="0">
  <canvas class="canvas-3d"></canvas>
  <element-node class='overlay' :model="model.root"/>
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
