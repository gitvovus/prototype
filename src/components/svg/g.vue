<template>
<g :id="model.id" :transform="model.transform">
  <v-component v-for="(item, index) in model.items" :is="`${item.tag}-item`" :key="index" :model="model.items[index]"/>
</g>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import { G } from '@/modules/svg/g';

@Observer
@Component
export default class GItem extends Vue {
  @Prop() private model!: G;
}
</script>
