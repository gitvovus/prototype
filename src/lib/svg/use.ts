import { observable } from 'mobx';

import { Item, Options, combine } from '@/lib/svg/item';

export interface UseOptions extends Options {
  href: string;
}

export class Use extends Item {
  @observable public href!: string;

  public constructor(options?: Partial<UseOptions>) {
    super(combine({ tag: 'use' }, options));
  }
}
