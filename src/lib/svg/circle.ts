import { observable } from 'mobx';

import { Item, Options, combine } from '@/lib/svg/item';

export interface CircleOptions extends Options {
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
    super(combine({ tag: 'circle' }, options));
  }
}
