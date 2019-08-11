<template>
<div class="sample-wrapper">
  <div>
    Selection:<br/>
    <sample-view :model="model.selection"/>
  </div>
  <div>
    Multi selection:<br/>
    <sample-view :model="model.multiSelection"/>
  </div>
  <div>
    <br/>
    <input v-model="model.textToApply"/><br/><br/>
    <input v-model.number="model.indexToApply"/><br/>
    <button @click="model.add()">Add</button>
    <button @click="model.remove()">Remove</button>
  </div>
</div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ViewReact as Model } from '@/modules/view-react';

@Observer
@Component
export default class ViewReact extends Vue {
  @Prop() private model!: Model;
}
</script>

<style lang="scss">
@import '@/styles/vars.scss';

.sample-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 5px;
  display: grid;
  grid-template-columns: auto auto auto;
  grid-column-gap: 10px;
}
</style>
