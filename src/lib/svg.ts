import { observable } from 'mobx';

export function parse(text: string) {
  const parser = new DOMParser();
  const document = parser.parseFromString(text, 'image/svg+xml');
  return fromElement(document.documentElement);
}

export function fromElement(el: Element) {
  const attributes: Attributes = {};
  for (const attr of el.attributes) {
    attributes[attr.name] = attr.value;
  }
  const node = new Node(el.tagName, attributes);
  for (const child of el.children) {
    node.items.push(fromElement(child));
  }
  return node;
}

export interface Attributes {
  [key: string]: string | number;
}

export class Node {
  public readonly tag: string;
  @observable public readonly attributes: Attributes = {};
  @observable.shallow public readonly items: Node[] = [];

  private el?: SVGElement;

  public constructor(tag: string, attributes?: Attributes) {
    this.tag = tag;
    Object.assign(this.attributes, attributes);
  }

  public get element() {
    return this.el;
  }

  public find(id: string): Node | undefined {
    if (this.attributes.id === id) {
      return this;
    }
    for (const item of this.items) {
      const result = item.find(id);
      if (result) {
        return result;
      }
    }
    return undefined;
  }

  public mount(el: SVGElement) {
    this.el = el;
  }

  public unmount() {
    this.el = undefined;
  }
}
