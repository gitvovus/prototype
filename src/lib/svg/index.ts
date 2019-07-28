import { observable } from 'mobx';

export interface Attributes {
  [key: string]: string | number;
}

export class Node {
  public readonly tag: string;
  @observable public readonly attributes: Attributes = {};
  @observable.shallow public readonly items: Node[] = [];

  public constructor(tag: string, attributes?: Attributes) {
    this.tag = tag;
    Object.assign(this.attributes, attributes);
  }
}
