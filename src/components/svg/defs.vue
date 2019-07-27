<template>
<defs>
  <v-component v-for="(item, index) in model.items" :is="`${item.tag}-item`" :key="index" :model="model.items[index]"/>
</defs>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import { Defs } from '@/modules/svg/defs';

@Observer
@Component
export default class DefsItem extends Vue {
  @Prop() private model!: Defs;
}
</script>
