<template>
<div class="item-container">
  <div class="item">
    <div class="icon-root">
      <div class="icon small" :class="model.icon"></div>
    </div>
    <div>{{model.label}}</div>
  </div>
</div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

import * as models from '@/modules/models';

@Observer
@Component
export default class Item extends Vue {
  @Prop() private model!: models.Item;
}
</script>

<style lang="scss">
.item-container {
  display: flex;
  flex-direction: column;
}
.item {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
