<template>
<div class="images-panel">
  <div class="filter-wrapper">
    <scroller :min="0" :max="100" v-model="model.grayscale"/>
  </div>
  <div class="filter-wrapper">
    <scroller :min="0" :max="100" v-model="model.brightness"/>
  </div>
  <div class="filter-wrapper">
    <scroller :min="0" :max="100" v-model="model.contrast"/>
  </div>
  <div class="filter-wrapper">
    <scroller :min="0" :max="model.images.items.length - 1" v-model="model.images.selectedIndex"/>
  </div>
</div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

import { ImagesTool as Model } from '@/modules/view-2d';

@Observer
@Component
export default class ImagesPanel extends Vue {
  @Prop() private model!: Model;
}
</script>

<style lang="scss">
.images-panel {
  position: absolute;
  right: 0;
  margin: 5px;
  padding: 0 2px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.4);
}
.filter-wrapper {
  display: inline-block;
  height: 100px;
  padding: 8px 4px 6px;
}
</style>
