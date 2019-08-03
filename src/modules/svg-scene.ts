import { computed, observable, reaction } from 'mobx';

import * as svg from '@/lib/svg';
import { View2d } from '@/modules/view-2d';
import { Controller } from '@/modules/svg-controller';

import data from '!!raw-loader!@/assets/scene.svg';

export class SvgScene {
  @observable public root: svg.Item;

  private view2d: View2d;
  private controller: Controller;

  private brightnessFilter: svg.Item;
  private contrastFilter: svg.Item;
  @observable private brightnessValue = 100;
  @observable private contrastValue = 100;

  public constructor(view2d: View2d) {
    this.root = svg.parse(data)!;
    this.view2d = view2d;
    this.controller = new Controller(this.root);

    this.brightnessFilter = this.root.find('brightness')!;
    this.contrastFilter = this.root.find('contrast')!;

    const image = this.root.find('image')!;
    reaction(
      () => this.view2d.selectedItem,
      () => image.attributes.href = this.view2d.selectedItem!,
      { fireImmediately: true },
    );
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
  }

  public unmount() {
    if (this.controller) {
      this.controller.unmount();
    }
  }

  public resize() {
    this.controller.resize();
  }
}
