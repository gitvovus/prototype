import Vue from 'vue';

import Floating from '@/components/floating.vue';
import Home from '@/components/home.vue';
import Icon from '@/components/icon.vue';
import Item from '@/components/items/item.vue';
import Lorem from '@/components/lorem.vue';
import Mockup from '@/components/items/mockup.vue';
import Modal from '@/components/modal.vue';
import Object3D from '@/components/items/object-3d.vue';
import Scroller from '@/components/scroller.vue';
import Slider from '@/components/slider.vue';
import Tools from '@/components/tools.vue';
import View2d from '@/components/view-2d.vue';
import View3d from '@/components/view-3d.vue';
import ViewSvg from '@/components/view-svg.vue';
import Views from '@/components/views.vue';

import CircleItem from '@/components/svg/circle.vue';
import DefsItem from '@/components/svg/defs.vue';
import GItem from '@/components/svg/g.vue';
import Image from '@/components/svg/image.vue';
import PathItem from '@/components/svg/path.vue';
import SvgItem from '@/components/svg/svg.vue';
import UseItem from '@/components/svg/use.vue';

import { Application } from '@/modules/application';

Vue.config.productionTip = false;

Vue.component('floating', Floating);
Vue.component('home', Home);
Vue.component('icon', Icon);
Vue.component('item', Item);
Vue.component('lorem', Lorem);
Vue.component('mockup', Mockup);
Vue.component('modal', Modal);
Vue.component('object-3d', Object3D);
Vue.component('scroller', Scroller);
Vue.component('slider', Slider);
Vue.component('tools', Tools);
Vue.component('view-2d', View2d);
Vue.component('view-3d', View3d);
Vue.component('view-svg', ViewSvg);
Vue.component('views', Views);

Vue.component('circle-item', CircleItem);
Vue.component('defs-item', DefsItem);
Vue.component('g-item', GItem);
Vue.component('image-item', Image);
Vue.component('path-item', PathItem);
Vue.component('svg-item', SvgItem);
Vue.component('use-item', UseItem);

const app = new Application();
app.run();
