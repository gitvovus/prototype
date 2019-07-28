<template>
<path :d="model.d"/>
</template>

<script lang="ts">
import { Vue, Component, Model } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import { Path as ViewModel } from '@/lib/svg/path';

@Observer
@Component
export default class PathItem extends Vue {
  @Model() private model!: ViewModel;
}
</script>
