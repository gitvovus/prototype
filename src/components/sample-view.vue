<template>
<div>
  <template v-for="(item, index) in model.items">
    <div class="sample" :class="{ selected: model.isSelected(item) }" :key="index" @click="model.invertSelection(item)">
      <input v-model="item.text"/><br/>
      {{item.length}}
    </div>
  </template>
</div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Sample, Selection, MultiSelection } from '@/lib/reactive';

@Observer
@Component
export default class SampleView extends Vue {
  @Prop() private model!: Selection<Sample> | MultiSelection<Sample>;
}
</script>

<style lang="scss">
@import '@/styles/vars.scss';

.sample {
  margin: 5px;
  padding: 5px;
  border: 1px solid gray;
  background-color: darkgray;
  border-radius: 5px;
}
.selected {
  color: white;
  background-color: $bg-menu-active;
}
</style>
