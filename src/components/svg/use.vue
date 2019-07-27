<template>
<use :href="model.href"/>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import { Use } from '@/modules/svg/use';

@Observer
@Component
export default class UseItem extends Vue {
  @Prop() private model!: Use;
}
</script>
