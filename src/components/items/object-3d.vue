<template>
<div class="item-container">
  <item :model="model"/>
  <v-component v-for="(item, index) in model.items" :key="index" :is="item.template" :model="model.items[index]"/>
</div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

import * as models from '@/modules/models';

@Observer
@Component
export default class Object3D extends Vue {
  @Prop() private model!: models.Object3D;
}
</script>
