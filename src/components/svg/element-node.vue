<template>
  <v-component v-if="model.tag !== '#text'" :is="model.tag" v-bind="model.attributes">
    <element-node v-for="(item, index) in model.items" :key="index + (item.attributes.id || '')" :model="model.items[index]"/>
  </v-component>
  <text-node v-else :model="model"/>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import * as svg from '@/lib/svg';

@Observer
@Component
export default class ElementNode extends Vue {
  @Prop() private model!: svg.Item;

  private mounted() {
    this.model.mount(this.$el as SVGElement);
  }

  private beforeDestroy() {
    this.model.unmount();
  }
}
</script>
