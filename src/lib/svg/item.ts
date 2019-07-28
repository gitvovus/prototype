import { observable } from 'mobx';

export interface Options {
  tag: string;
}

export function combine(options: Partial<Options>, add?: Partial<Options>) {
  Object.assign(options, add);
  return options;
}

export class Item {
  public readonly tag!: string;

  public constructor(options?: Partial<Options>) {
    Object.assign(this, combine({ tag: '' }, options));
  }
}

export class Container extends Item {
  @observable.shallow public readonly items: Item[] = [];
}
