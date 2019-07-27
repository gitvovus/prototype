import { observable } from 'mobx';

import { Item, ItemOptions, combineItemOptions } from '@/modules/svg/item';

export interface PathOptions extends ItemOptions {
  d: string;
}

export class Path extends Item {
  @observable public d!: string;

  public constructor(options?: Partial<PathOptions>) {
    super(combineItemOptions({ tag: 'path' }, options));
  }
}
