<template>
<image :x="model.x" :y="model.y" :width="model.width" :height="model.height" :xlink:href="model.href"/>
</template>

<script lang="ts">
import { Vue, Component, Model } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import { Image } from '@/lib/svg/image';

@Observer
@Component
export default class ImageItem extends Vue {
  @Model() private model!: Image;
}
</script>
