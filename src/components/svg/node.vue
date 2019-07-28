<template>
<v-component :is="model.tag" v-bind="model.attributes">
  <template v-if="model.items">
    <svg-node v-for="(item, index) in model.items" :key="index" :model="model.items[index]"/>
  </template>
</v-component>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import { Node } from '@/lib/svg';

@Observer
@Component
export default class SvgItem extends Vue {
  @Prop() private model!: Node;
}
</script>
