<template>
<div class="item-container">
  <item :model="model"/>
  <select v-if="model.items.length > 0" v-model="model.selectedIndex" style="margin: 5px;">
    <option v-for="(item, index) in model.items" :key="index" :value="index">{{item.label}}</option>
  </select>
  <v-component v-if="model.selectedItem" :is="model.selectedItem.template" :model="model.selectedItem"/>
</div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

import { MockupModel } from '@/modules/demos/mockup';

@Observer
@Component
export default class Mockup extends Vue {
  @Prop() private model!: MockupModel;
}
</script>
