<script lang="ts">
import { Observer } from 'mobx-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

import * as svg from '@/lib/svg';

@Observer
@Component
export default class TextNode extends Vue {
  @Prop() private model!: svg.Item;

  private render(h: any) {
    // Hacky: _v method references to createTextVNode function, see Vue sources.
    return (this as any)._v(this.model.text);
  }
}
</script>
