import { observable } from 'mobx';

import { Item, Options, combine } from '@/lib/svg/item';

export interface ImageOptions extends Options {
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
    super(combine({ tag: 'image' }, options));
  }
}
