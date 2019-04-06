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
        <div class="v2-scroller">
          <scroller :min="0" :max="view2d.items.length - 1" v-model="view2d.selectedIndex"/>
        </div>
      </view-2d>
    </div>
    <tools v-show="tools.show">
      <div v-if="layouts.selectedItem.show2d">
        <div class="section">View 2D:</div>
        <div class="slider-container">
          <slider :min="0" :max="view2d.items.length - 1" v-model="view2d.selectedIndex"/>
        </div>
      </div>
      <div v-if="layouts.selectedItem.show3d">
        <div class="section">View 3D:</div>
        <v-component v-if="view3d.demo && view3d.demo.model" :is="view3d.demo.model.template" :model="view3d.demo.model"/>
      </div>
    </tools>
    <div class="toolbar">
      <div class="icons">
        <icon img="icon-home" for="page-home"/>
        <icon v-for="(item, index) in layouts.items" :key="index+200" :for="item.id" :img="item.icon" :checked="index === layouts.selectedIndex"/>
        <icon :for="tools.id" :img="tools.icon" :checked="tools.show"/>
        <icon :for="fullscreen.id" :img="fullscreen.icon" :checked="fullscreen.show"/>
      </div>
    </div>
  </div>
  <floating v-show="lorem.show">
    <div class="lorem">
      <div class="lorem-header">
        <div class="lorem-title">Lorem</div>
      </div>
      <div class="lorem-content" style="pointer-events: auto">
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

  private mounted() {
    this.disposer = reaction(
      () => this.model.fullscreen.show,
      (show: boolean) => {
        try {
          if (show) {
            this.$el.getElementsByClassName('main')[0]!.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
        } catch (e) {}
      },
    );
  }

  private beforeDestroy() {
    this.disposer();
  }
}
</script>

<style lang="scss">
@import '@/styles/main.scss';
@import '@/styles/icons.scss';

.lorem {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  pointer-events: none;
}
.lorem-header {
  color: white;
  font-size: $font-size-menu;
  text-shadow: $shadow-text;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $bg-menu;
  flex: 0 0 auto;
}
.lorem-title {
  padding: $padding-menu;
}
.lorem-content {
  flex: 1 1 auto;
  overflow: auto;
}
.article {
  display: flex;
  flex: 1 0 auto;
  flex-direction: row;
  overflow: auto;
  pointer-events: auto;
}
.column {
  flex: 1 1 0;
  padding: 5px;
}
.app-menu {
  display: none;
}
.section {
  padding: $padding-menu;
  color: white;
  text-shadow: $shadow-text;
  background-color: $bg-menu-medium;
}
.slider-container {
  margin: 10px;
}
.v2-scroller {
  position: absolute;
  right: 0;
  height: 100%;
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
