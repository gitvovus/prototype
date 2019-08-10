<template>
<div class="views">
  <div class="app-menu">
    <input type="radio" name="layouts" v-for="(item, index) in layouts.items"
      :key="index+100" :id="item.id" :value="index" v-model="layouts.selectedIndex">
    <input type="checkbox" :id="tools.id" v-model="tools.show">
    <input type="checkbox" :id="lorem.id" v-model="lorem.show">
    <input type="checkbox" :id="modal.id" v-model="modal.show">
    <input type="checkbox" :id="fullscreen.id" v-model="fullscreen.show">
  </div>
  <div class="header">
    <div class="menu">
      <label v-for="(item, index) in layouts.items" :key="index" :for="item.id" :class="{ active: index === layouts.selectedIndex }">
        {{item.label}}
      </label>
      <span class="separator"/>
      <label :for="tools.id" :class="{ active: tools.show }">{{tools.label}}</label>
      <label :for="lorem.id" :class="{ active: lorem.show }">{{lorem.label}}</label>
      <span class="separator"/>
      <label :for="modal.id" :class="{ active: modal.show }">{{modal.label}}</label>
    </div>
  </div>
  <div class="main">
    <div class="layout">
      <view-3d v-show="layouts.selectedItem.show3d" :model="view3d">
        <div class="tip right">
          <select v-model="view3d.selectedIndex">
            <option v-for="(item, index) in view3d.items" :key="index" :value="index">{{item}}</option>
          </select>
          <select v-model="view3d.cameraType">
            <option :value="0">3d</option>
            <option :value="1">iso</option>
          </select>
        </div>
      </view-3d>
      <view-2d v-show="layouts.selectedItem.show2d" :model="view2d">
        <div class="filter-panel">
          <div class="filter-wrapper">
            <scroller :min="0" :max="100" v-model="view2d.grayscale"/>
          </div>
          <div class="filter-wrapper">
            <scroller :min="0" :max="100" v-model="view2d.brightness"/>
          </div>
          <div class="filter-wrapper">
            <scroller :min="0" :max="100" v-model="view2d.contrast"/>
          </div>
          <div class="filter-wrapper">
            <scroller :min="0" :max="view2d.images.items.length - 1" v-model="view2d.images.selectedIndex"/>
          </div>
        </div>
      </view-2d>
      <div class="anchor h-center bottom">
        <div class="toolbar-bottom">
          <icon img="icon-home" for="page-home"/>
          <icon v-for="(item, index) in layouts.items" :key="index+200" :for="item.id" :img="item.icon" :checked="index === layouts.selectedIndex"/>
          <icon :for="tools.id" :img="tools.icon" :checked="tools.show"/>
          <icon :for="fullscreen.id" :img="fullscreen.icon" :checked="fullscreen.show"/>
        </div>
      </div>
      <!-- reactive tests -->
      <!-- <div class="sample-wrapper">
        <div>
          Selection:<br/>
          <sample-view :model="model.selection"/>
        </div>
        <div>
          Multi selection:<br/>
          <sample-view :model="model.multiSelection"/>
        </div>
      </div> -->
    </div>
    <tools v-show="tools.show">
      <div v-if="layouts.selectedItem.show2d">
        <div class="section">View 2D:</div>
        <div class="slider-container">
          <slider :min="0" :max="view2d.images.items.length - 1" v-model="view2d.images.selectedIndex"/>
        </div>
      </div>
      <div v-if="layouts.selectedItem.show3d">
        <div class="section">View 3D:</div>
        <v-component v-if="view3d.demo && view3d.demo.model" :is="view3d.demo.model.template" :model="view3d.demo.model"/>
      </div>
    </tools>
  </div>
  <floating v-show="lorem.show">
    <div class="window">
      <div class="window-header">
        <div class="window-title">Lorem</div>
      </div>
      <div class="window-content">
        <div class="article">
          <div class="column" style="background-color: #ffffe0">
            <lorem/>
          </div>
          <div class="column" style="background-color: #e0ffe0">
            <lorem/>
          </div>
        </div>
      </div>
    </div>
  </floating>
  <modal :model="modal">
    <div class="article">
      <div class="column" style="background-color: #ffffe0">
        <lorem/>
      </div>
      <div class="column" style="background-color: #e0ffe0">
        <lorem/>
      </div>
    </div>
  </modal>
</div>
</template>

<script lang="ts">
import { reaction } from 'mobx';
import { Observer } from 'mobx-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

import { Application } from '@/modules/application';

@Observer
@Component
export default class Views extends Vue {
  @Prop() private model!: Application;
  private disposer!: () => void;

  private get view3d() {
    return this.model.view3d;
  }

  private get view2d() {
    return this.model.view2d;
  }

  private get layouts() {
    return this.model.layouts;
  }

  private get tools() {
    return this.model.tools;
  }

  private get lorem() {
    return this.model.lorem;
  }

  private get modal() {
    return this.model.modal;
  }

  private get fullscreen() {
    return this.model.fullscreen;
  }
}
</script>

<style lang="scss">
@import '@/styles/main.scss';
@import '@/styles/icons.scss';
.article {
  display: flex;
  flex: 1 0 auto;
  flex-direction: row;
}
.column {
  flex: 1 1 auto;
  padding: 5px;
}
.app-menu {
  display: none;
}
.filter-panel {
  position: absolute;
  right: 0;
  margin: 5px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.2);
}
.filter-wrapper {
  display: inline-block;
  height: 100px;
  padding: 8px 8px 6px;
}
.sample-wrapper {
  position: absolute;
  margin: 5px;
  background-color: $bg-dark;
  box-shadow: $shadow-text;
  display: grid;
  grid-template-columns: auto auto;
  grid-column-gap: 10px;
}
</style>
