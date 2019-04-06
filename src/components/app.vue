<template>
<div class="app" id="app">
  <div class="app-menu">
    <input type="radio" name="pages" id="page-home" :value="0" v-model.number="model.page">
    <input type="radio" name="pages" id="page-views" :value="1" v-model.number="model.page">
  </div>
  <keep-alive>
    <home v-if="model.page === 0"/>
    <views v-if="model.page === 1" :model="model"/>
  </keep-alive>
</div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

import { Application } from '@/modules/application';

@Observer
@Component
export default class App extends Vue {
  @Prop() private model!: Application;
}
</script>
