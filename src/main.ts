import Vue, { VueConstructor } from 'vue';

import Floating from '@/components/floating.vue';
import Home from '@/components/home.vue';
import Icon from '@/components/icon.vue';
import Lorem from '@/components/lorem.vue';
import Modal from '@/components/modal.vue';
import SampleView from '@/components/sample-view.vue';
import Scroller from '@/components/scroller.vue';
import Slider from '@/components/slider.vue';
import Tools from '@/components/tools.vue';
import View2d from '@/components/view-2d.vue';
import View3d from '@/components/view-3d.vue';
import ViewReact from '@/components/view-react.vue';
import Views from '@/components/views.vue';

import ImagesPanel from '@/components/items/images-panel.vue';
import ImagesTool from '@/components/items/images-tool.vue';
import Item from '@/components/items/item.vue';
import Mockup from '@/components/items/mockup.vue';
import Object3D from '@/components/items/object-3d.vue';

import ElementNode from '@/components/svg/element-node.vue';
import TextNode from '@/components/svg/text-node.vue';

import { Application } from '@/modules/application';

Vue.config.productionTip = false;

(<Array<[string, VueConstructor<Vue>]>> [
  ['floating', Floating],
  ['home', Home],
  ['icon', Icon],
  ['lorem', Lorem],
  ['modal', Modal],
  ['sample-view', SampleView],
  ['scroller', Scroller],
  ['slider', Slider],
  ['tools', Tools],
  ['view-2d', View2d],
  ['view-3d', View3d],
  ['view-react', ViewReact],
  ['views', Views],
  ['images-panel', ImagesPanel],
  ['images-tool', ImagesTool],
  ['item', Item],
  ['mockup', Mockup],
  ['object-3d', Object3D],
  ['element-node', ElementNode],
  ['text-node', TextNode],
]).forEach(([name, constructor]) => Vue.component(name, constructor));

const app = new Application();
app.run();
