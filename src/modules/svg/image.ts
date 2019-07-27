import { observable } from 'mobx';

import { Item, ItemOptions, combineItemOptions } from '@/modules/svg/item';

export interface ImageOptions extends ItemOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  href: string;
}

export class Image extends Item {
  @observable public x!: number;
  @observable public y!: number;
  @observable public width!: number;
  @observable public height!: number;
  @observable public href!: string;

  public constructor(options?: Partial<ImageOptions>) {
    super(combineItemOptions({ tag: 'image' }, options));
  }
}
