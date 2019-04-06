<template>
<div class="sl-root">
  <div class="sl-track">
    <div class="sl-left"></div>
    <div class="sl-slide">
      <div class="sl-run" :style="{ width: 100 * (value - min) / (max - min) + '%' }"></div>
      <div class="sl-thumb" :style="{ left: 100 * (value - min) / (max - min) + '%' }"></div>
    </div>
  </div>
  <input type="range" :min="min" :max="max" :value="value" @input="input"/>
</div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Observer
@Component
export default class Slider extends Vue {
  @Prop() private value!: number;
  @Prop() private min!: number;
  @Prop() private max!: number;

  private scrollHandler!: EventListener;

  private input(e: any) {
    this.$emit('input', Number.parseFloat(e.target.value));
  }

  private mounted() {
    this.scrollHandler = (e: Event) => this.scroll(e as WheelEvent);
    this.$el.addEventListener('wheel', this.scrollHandler);
  }

  private beforeDestroy() {
    this.$el.removeEventListener('wheel', this.scrollHandler);
  }

  private scroll(e: WheelEvent) {
    const dy = -Math.sign(e.deltaY);
    if (dy < 0 && this.value > this.min) {
      this.$emit('input', this.value - 1);
    } else if (dy > 0 && this.value < this.max) {
      this.$emit('input', this.value + 1);
    }
    e.stopPropagation();
    e.preventDefault();
  }
}
</script>

<style lang="scss">
@import '@/styles/vars.scss';

$slider-width: 16px;
$track-width: 4px;

$thumb-width: $slider-width;
$thumb-height: $slider-width;
$thumb-radius: $slider-width / 2;

$track-radius: $track-width / 2;
$track-top: ($slider-width - $track-width) / 2;

.sl-root {
  position: relative;
  width: 100%;
  height: $slider-width;
}
.sl-track {
  position: absolute;
  width: 100%;
  height: $track-width;
  top: $track-top;
  border-radius: $track-radius;
  background-color: #c0c0c0;
  box-shadow: 0 0 3px #404040 inset;
}
.sl-left {
  position: absolute;
  width: $thumb-radius;
  height: $track-width;
  border-radius: $track-radius 0 0 $track-radius;
  background-color: $bg-menu-medium;
}
.sl-slide {
  position: absolute;
  left: $thumb-radius;
  right: $thumb-radius;
  height: 100%;
}
.sl-run {
  position: absolute;
  height: 100%;
  background-color: $bg-menu-medium;
}
.sl-thumb {
  position: absolute;
  top: 50%;
  width: $thumb-width;
  height: $thumb-height;
  border-radius: $thumb-radius;
  border: 2px solid $color-menu;
  background-color: $bg-menu-active;
  box-shadow: $shadow-text;
  transform: translate(-$thumb-radius, -$thumb-radius);
}
.sl-root input {
  position: absolute;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  opacity: 0;
}
</style>
