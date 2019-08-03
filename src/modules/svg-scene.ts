import { computed, observable, reaction } from 'mobx';
import Vue from 'vue';

import * as svg from '@/lib/svg';
import { View2d } from '@/modules/view-2d';
import { Controller } from '@/modules/svg-controller';

import data from '!!raw-loader!@/assets/scene.svg';

export class SvgScene {
  @observable public root: svg.Item;

  private view2d: View2d;
  private controller: Controller;

  private grayscaleFilter: svg.Item;
  private brightnessFilter: svg.Item;
  private contrastFilter: svg.Item;
  @observable private grayscaleValue = 100;
  @observable private brightnessValue = 100;
  @observable private contrastValue = 100;

  private deck: svg.Item;
  private stamps: svg.Item[] = [];

  public constructor(view2d: View2d) {
    this.root = svg.parse(data)!;
    this.view2d = view2d;
    this.controller = new Controller(this.root);

    this.grayscaleFilter = this.root.find('image-grayscale')!;
    this.brightnessFilter = this.root.find('image-brightness')!;
    this.contrastFilter = this.root.find('image-contrast')!;

    this.deck = this.root.find('deck')!;
    this.deck.items.forEach(item => this.stamps.push(item));

    const image = this.root.find('image')!;
    reaction(
      () => this.view2d.selectedItem,
      () => Object.assign(image.attributes, { x: '-200', y: '-200', width: '400', height: '400', href: this.view2d.selectedItem!}),
      { fireImmediately: true },
    );
  }

  @computed public get grayscale() {
    return this.grayscaleValue;
  }

  public set grayscale(value: number) {
    this.grayscaleValue = value;
    const v = 1 - 0.01 * value;
    this.grayscaleFilter.attributes.values = [
      (0.2126 + 0.7874 * v), (0.7152 - 0.7152  * v), (0.0722 - 0.0722 * v), 0, 0,
      (0.2126 - 0.2126 * v), (0.7152 + 0.2848  * v), (0.0722 - 0.0722 * v), 0, 0,
      (0.2126 - 0.2126 * v), (0.7152 - 0.7152  * v), (0.0722 + 0.9278 * v), 0, 0,
      0, 0, 0, 1, 0,
    ].map(x => x.toFixed(4)).join(' ');
  }

  @computed public get brightness() {
    return this.brightnessValue;
  }

  public set brightness(value: number) {
    this.brightnessValue = value;
    for (const channel of this.brightnessFilter.items) {
      channel.attributes.slope = 0.01 * value;
    }
  }

  @computed public get contrast() {
    return this.contrastValue;
  }

  public set contrast(value: number) {
    this.contrastValue = value;
    for (const channel of this.contrastFilter.items) {
      channel.attributes.slope = 0.01 * value;
      channel.attributes.intercept = 0.5 * (1 - 0.01 * value);
    }
  }

  public mount(el: HTMLElement) {
    this.controller.mount(el);
    this.setup();
  }

  public unmount() {
    if (this.controller) {
      this.controller.unmount();
    }
  }

  public resize() {
    this.controller.resize();
  }

  private setup() {
    this.stamps.forEach(item => {
      item.on('pointerdown', (e: Event) => e.stopPropagation());
      item.on('click', (e: Event) => item.index = 2);
    });
  }
}
