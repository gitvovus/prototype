import { Container, ItemOptions, combineItemOptions } from '@/modules/svg/item';

export class Defs extends Container {
  public constructor(options?: Partial<ItemOptions>) {
    super(combineItemOptions({ tag: 'defs' }, options));
  }
}
