<template>
<div class="tools">
<div class="inner">
  <slot/>
</div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Tools extends Vue {
}
</script>

<style lang="scss">
@import '@/styles/vars.scss';

.tools {
  position: relative;
  min-width: 300px;
  background-color: $bg-dark;
}
.inner {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
</style>
