import { observable } from 'mobx';

export function parse(text: string) {
  const parser = new DOMParser();
  const document = parser.parseFromString(text, 'image/svg+xml');
  return fromElement(document.documentElement);
}

export function fromElement(node: Node) {
  if (node.nodeType === node.TEXT_NODE) {

    const text = (node.nodeValue || '').trim();
    return text.length > 0 ? new Item(node.nodeName, text) : undefined;

  } else if (node instanceof Element) {

    const attributes: Attributes = {};
    for (const attr of node.attributes) {
      attributes[attr.name] = attr.value;
    }
    const item = new Item(node.nodeName, attributes);
    for (const child of node.childNodes) {
      const childItem = fromElement(child);
      if (childItem) {
        item.items.push(childItem);
      }
    }
    return item;
  }

  return undefined;
}

export interface Attributes {
  [key: string]: string | number;
}

export class Item {
  public readonly tag: string;
  @observable public readonly attributes: Attributes = {};
  @observable public text?: string;
  @observable.shallow public readonly items: Item[] = [];

  private el?: SVGElement;

  public constructor(tag: string, data?: Attributes | string) {
    this.tag = tag;
    if (data) {
      if (typeof data === 'string') {
        this.text = data;
      } else {
        Object.assign(this.attributes, data);
      }
    }
  }

  public get element() {
    return this.el;
  }

  public find(id: string): Item | undefined {
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
