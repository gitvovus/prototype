import Vue from 'vue';
import { observable, reaction } from 'mobx';

import App from '@/components/app.vue';

import * as svg from '@/lib/svg';

import { List } from '@/modules/list';
import { View2d } from '@/modules/view-2d';
import { View3d } from '@/modules/view-3d';
import { SvgScene } from '@/modules/svg-scene';

export class Layout {
  public readonly id!: string;
  public readonly icon!: string;
  public readonly label!: string;
  public readonly show3d!: boolean;
  public readonly show2d!: boolean;

  public constructor(id: string, icon: string, label: string, show2d: boolean, show3d: boolean) {
    this.id = id;
    this.icon = icon;
    this.label = label;
    this.show2d = show2d;
    this.show3d = show3d;
  }
}

export class Tools {
  public readonly id!: string;
  @observable public icon!: string;
  @observable public label!: string;
  @observable public show!: boolean;

  public constructor(id: string, icon: string, label: string, show: boolean) {
    this.id = id;
    this.icon = icon;
    this.label = label;
    this.show = show;
  }
}

export enum Page {
  HOME = 0,
  VIEWS = 1,
}

export class Application {
  @observable public page = Page.VIEWS;
  public readonly layouts = new List<Layout>(
    [
      new Layout('view3d', 'icon-view3d', '3D view', false, true ),
      new Layout('view2d', 'icon-view2d', '2D view', true,  false),
      new Layout('views',  'icon-views',  '3D + 2D', true,  true ),
    ],
    2,
  );
  public readonly view3d = new View3d();
  public readonly view2d = new View2d();
  public readonly tools = new Tools('tools', 'icon-tools', 'Tools', false);
  public readonly lorem = new Tools('lorem', 'icon-tools', 'Lorem', false);
  public readonly svg = new Tools('svg', 'icon-tools', 'SVG', true);
  public readonly modal = new Tools('modal', 'icon-tools', 'Modal', false);
  public readonly fullscreen = new Tools('fullscreen', 'icon-fullscreen', 'Fullscreen', false);

  public readonly svgScene = new SvgScene();

  private vue!: Vue;

  public run() {
    this.setupReactions();
    this.setupEvents();

    this.vue = new Vue({ render: (h) => h(App, { props: { model: this } }) });
    this.vue.$mount('#app');
  }

  private setupReactions() {
    // TODO: move this code somewhere.
    // Bind view-2d's selected image to svg scene.
    let scene: svg.Node = undefined!;
    for (const item of this.svgScene.model.items) {
      if (item.attributes.id === 'scene') {
        scene = item;
      }
    }
    if (scene) {
      let image: svg.Node = undefined!;
      for (const item of scene.items) {
        if (item.attributes.id === 'image') {
          image = item;
        }
      }
      if (image) {
        reaction(
          () => this.view2d.selectedItem,
          () => image.attributes['xlink:href'] = this.view2d.selectedItem!,
          { fireImmediately: true },
        );
      }
    }

    reaction(
      () => [this.layouts.selectedIndex, this.tools.show],
      () => Vue.nextTick(() => window.dispatchEvent(new Event('resize'))),
    );
    reaction(
      () => this.page,
      () => Vue.nextTick(() => Vue.nextTick(() => window.dispatchEvent(new Event('resize')))),
    );
    reaction(
      () => this.svg.show,
      () => Vue.nextTick(() => this.svgScene.resize()),
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
      case 'KeyS':
        this.svg.show = !this.svg.show;
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
