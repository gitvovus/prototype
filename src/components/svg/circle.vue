<template>
<circle :cx="model.cx" :cy="model.cy" :r="model.r" :fill="model.fill"/>
</template>

<script lang="ts">
import { Vue, Component, Model } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import { Circle } from '@/modules/svg/circle';

@Observer
@Component
export default class CircleItem extends Vue {
  @Model() private model!: Circle;
}
</script>
