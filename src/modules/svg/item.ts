import { observable } from 'mobx';

export interface ItemOptions {
  tag: string;
}

export function combineItemOptions(options: Partial<ItemOptions>, add?: Partial<ItemOptions>) {
  Object.assign(options, add);
  return options;
}

export class Item {
  public readonly tag!: string;

  public constructor(options?: Partial<ItemOptions>) {
    Object.assign(this, combineItemOptions({ tag: '' }, options));
  }
}

export class Container extends Item {
  @observable.shallow public readonly items: Item[] = [];
}
