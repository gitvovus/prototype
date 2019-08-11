import Vue from 'vue';
import { observable, reaction } from 'mobx';

import App from '@/components/app.vue';

import { List } from '@/modules/list';
import { View2d } from '@/modules/view-2d';
import { View3d } from '@/modules/view-3d';
import { ViewReact } from '@/modules/view-react';

import { Layout, Page, Tools } from '@/modules/types';

export class Application {
  @observable public page = Page.VIEWS;

  public readonly layouts = new List<Layout>([
    new Layout('view3d', 'icon-view3d', '3D view', false, true ),
    new Layout('view2d', 'icon-view2d', '2D view', true,  false),
    new Layout('views',  'icon-views',  '3D + 2D', true,  true ),
  ], 2);

  public readonly view3d = new View3d();
  public readonly view2d = new View2d();
  public readonly viewReact = new ViewReact();

  public readonly tools = new Tools('tools', 'icon-tools', 'Tools', false);
  public readonly lorem = new Tools('lorem', 'icon-tools', 'Lorem', false);
  public readonly react = new Tools('react', 'icon-tools', 'React', false);
  public readonly modal = new Tools('modal', 'icon-tools', 'Modal', false);
  public readonly fullscreen = new Tools('fullscreen', 'icon-fullscreen', 'Fullscreen', false);

  private vue!: Vue;

  public run() {
    this.setupReactions();
    this.setupEvents();

    this.vue = new Vue({ render: (h) => h(App, { props: { model: this } }) });
    this.vue.$mount('#app');
  }

  private setupReactions() {
    reaction(
      () => [this.layouts.selectedIndex, this.tools.show],
      () => Vue.nextTick(() => window.dispatchEvent(new Event('resize'))),
    );
    reaction(
      () => this.page,
      () => Vue.nextTick(() => Vue.nextTick(() => window.dispatchEvent(new Event('resize')))),
    );
    reaction(
      () => this.fullscreen.show,
      (show: boolean) => {
        if (show) {
          document.getElementsByClassName('main')[0]!.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      },
    );
  }

  private setupEvents() {
    window.addEventListener('contextmenu', (e: Event) => e.preventDefault());
    window.addEventListener('keydown', this.keyDown);
  }

  private keyDown = (e: KeyboardEvent) => {
    if (!e.altKey || e.shiftKey || e.ctrlKey) {
      return;
    }
    switch (e.code) {
      case 'Digit1':
        this.layouts.selectedIndex = 2;
        break;
      case 'Digit2':
        this.layouts.selectedIndex = 1;
        break;
      case 'Digit3':
        this.layouts.selectedIndex = 0;
        break;
      case 'KeyT':
        this.tools.show = !this.tools.show;
        break;
      case 'Enter':
        if (this.page === Page.VIEWS) {
          this.fullscreen.show = !this.fullscreen.show;
        } else {
          return;
        }
        break;
      default: return;
    }
    e.stopImmediatePropagation();
  }
}
