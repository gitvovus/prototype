<template>
<div class="sc-root">
  <div class="sc-track">
    <div class="sc-bottom"></div>
    <div class="sc-slide">
      <div class="sc-run" :style="{ height: 100 * (value - min) / (max - min) + '%' }"></div>
      <div class="sc-thumb" :style="{ bottom: 100 * (value - min) / (max - min) + '%' }"></div>
    </div>
  </div>
  <input type="range" orient="vertical" :min="min" :max="max" :value="value" @input="input"/>
</div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

import Slider from '@/components/slider.vue';

@Observer
@Component
export default class Scroller extends Slider {}
</script>

<style lang="scss">
@import '@/styles/vars.scss';

$slider-width: 16px;
$track-width: 10px;

$thumb-width: $slider-width;
$thumb-height: $slider-width;
$thumb-radius: $thumb-width / 2;

$track-radius: $track-width / 2;
$track-left: ($slider-width - $track-width) / 2;

.sc-root {
  position: relative;
  width: $slider-width;
  height: 100%;
}
.sc-track {
  position: absolute;
  width: $track-width;
  height: 100%;
  left: $track-left;
  border-radius: $track-radius;
  background-color: rgba(white, 0.1);
  box-shadow: 0 0 $track-radius white inset;
}
.sc-bottom {
  position: absolute;
  bottom: 0;
  width: $track-width;
  height: $thumb-radius;
  border-radius: 0 0 $track-radius $track-radius;
}
.sc-slide {
  position: absolute;
  bottom: $thumb-radius;
  top: $thumb-radius;
  width: 100%;
}
.sc-run {
  position: absolute;
  bottom: 0;
  width: 100%;
}
.sc-thumb {
  position: absolute;
  left: 50%;
  width: $thumb-width;
  height: $thumb-height;
  border-radius: $thumb-radius;
  border: 2px solid $color-menu;
  background-color: $bg-menu-active;
  box-shadow: $shadow-text;
  transform: translate(-$thumb-radius, $thumb-height / 2);
}
.sc-root input {
  -webkit-appearance: slider-vertical;
  writing-mode: bt-lr;
  position: absolute;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  opacity: 0;
}
</style>
