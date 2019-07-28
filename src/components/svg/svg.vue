<template>
<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  :viewBox="model.viewBox"
  :width="model.width"
  :height="model.height"
  :fill="model.fill"
  :opacity="model.opacity">
  <v-component v-for="(item, index) in model.items" :is="`${item.tag}-item`" :key="index" :model="model.items[index]"/>
</svg>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import { Svg } from '@/lib/svg/svg';

@Observer
@Component
export default class SvgItem extends Vue {
  @Prop() private model!: Svg;
}
</script>
