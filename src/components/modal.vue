<template>
<div class="modal" v-show="model.show">
  <div class="modal-frame">
    <div class="modal-header">
      <div class="modal-title">Modal title</div>
    </div>
    <div class="modal-content">
      <slot/>
    </div>
    <div class="modal-footer">
      <button @click="model.show = false">Close</button>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { Tools } from '@/modules/types';

@Component
export default class Modal extends Vue {
  @Prop() private model!: Tools;
}
</script>

<style lang="scss">
@import '@/styles/vars.scss';

.modal {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: $z-modal;
}
.modal-frame {
  max-width: 60%;
  max-height: 60%;
  display: flex;
  flex-direction: column;
  box-shadow: $shadow-box;
}
.modal-header, .modal-footer {
  color: white;
  font-size: $font-size-menu;
  text-shadow: $shadow-text;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $bg-menu;
  flex: 0 0 auto;
}
.modal-title {
  padding: 9px 12px;
}
.modal-content {
  flex: 1 1 auto;
  overflow: auto;
}
</style>
