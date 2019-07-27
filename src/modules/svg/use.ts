import { observable } from 'mobx';

import { Item, ItemOptions, combineItemOptions } from '@/modules/svg/item';

export interface UseOptions extends ItemOptions {
  href: string;
}

export class Use extends Item {
  @observable public href!: string;

  public constructor(options?: Partial<UseOptions>) {
    super(combineItemOptions({ tag: 'use' }, options));
  }
}
