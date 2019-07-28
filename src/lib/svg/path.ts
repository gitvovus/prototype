import { observable } from 'mobx';

import { Item, Options, combine } from '@/lib/svg/item';

export interface PathOptions extends Options {
  d: string;
}

export class Path extends Item {
  @observable public d!: string;

  public constructor(options?: Partial<PathOptions>) {
    super(combine({ tag: 'path' }, options));
  }
}
