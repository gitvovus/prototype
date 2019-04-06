<template>
<label>
  <div class="icon-root" :class="{ 'icon-checked': checked }">
    <div class="icon" :class="[subclass, img]"></div>
  </div>
</label>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({ inheritAttrs: true })
export default class Icon extends Vue {
  @Prop() private img!: string;
  @Prop() private checked!: boolean;
  @Prop() private subclass!: string;
}
</script>

<style lang="scss">
@import '@/styles/vars.scss';

$shadow-hover: 0 0 5px #ff8000;
$shadow-checked: 0 0 5px #80ff00;

.icon-root {
  display: inline-block;
  vertical-align: middle;
  filter: drop-shadow($shadow-text);
}
.icon-root:hover {
  filter: drop-shadow($shadow-hover);
}
.icon-checked {
  filter: drop-shadow($shadow-checked);
}
.icon {
  width: $icon-size;
  height: $icon-size;
  margin: $icon-margin;
  background-color: #ffffff;
  mask-position: center;
  mask-repeat: no-repeat;
}
.big {
  width: 72px;
  height: 72px;
}
.small {
  width: 16px;
  height: 16px;
}
</style>
