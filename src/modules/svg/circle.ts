import { observable } from 'mobx';

import { Item, ItemOptions, combineItemOptions } from '@/modules/svg/item';

export interface CircleOptions extends ItemOptions {
  cx: number;
  cy: number;
  r: number;
  fill: string;
}

export class Circle extends Item {
  @observable public cx!: number;
  @observable public cy!: number;
  @observable public r!: number;
  @observable public fill!: string;

  public constructor(options?: Partial<CircleOptions>) {
    super(combineItemOptions({ tag: 'circle' }, options));
  }
}
