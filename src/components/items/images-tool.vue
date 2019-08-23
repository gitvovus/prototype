<template>
<div class="images-tool">
  <div>Grayscale</div>
  <slider :min="0" :max="100" v-model="model.grayscale"/>
  <div class="number">{{model.grayscale}}</div>
  <div>Brightness</div>
  <slider :min="0" :max="100" v-model="model.brightness"/>
  <div class="number">{{model.brightness}}</div>
  <div>Contrast</div>
  <slider :min="0" :max="100" v-model="model.contrast"/>
  <div class="number">{{model.contrast}}</div>
  <div>Image</div>
  <slider :min="0" :max="model.images.items.length - 1" v-model="model.images.selectedIndex"/>
  <div class="number">{{model.images.selectedIndex}}</div>
</div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

import { ImagesTool as Model } from '@/modules/view-2d';

@Observer
@Component
export default class ImagesTool extends Vue {
  @Prop() private model!: Model;
}
</script>

<style lang="scss">
.images-tool {
  display: grid;
  grid-template-columns: 1fr 1fr 2em;
  grid-gap: 10px;
  padding: 10px;
}
</style>
