import { observable } from 'mobx';

export function fromSource(text: string) {
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
        item.add(childItem);
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
  public readonly symbol = Symbol();
  public readonly tag: string;
  @observable public readonly attributes: Attributes = {};
  @observable public text?: string;
  @observable.shallow public readonly items: Item[] = [];
  public parent?: Item;

  private el?: SVGElement;
  private events = new Map<string, EventListener[]>();

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

  public get index() {
    return this.parent ? this.parent.items.indexOf(this) : -1;
  }

  public set index(toIndex: number) {
    if (this.parent) {
      this.parent.move(this, toIndex);
    }
  }

  public add(item: Item) {
    item.parent = this;
    this.items.push(item);
  }

  public remove(item: Item) {
    const index = this.items.indexOf(item);
    this.items.splice(index, 1);
    item.parent = undefined;
  }

  public move(item: Item, toIndex: number) {
    const index = this.items.indexOf(item);
    if (index !== toIndex) {
      this.items.splice(index, 1);
      this.items.splice(toIndex, 0, item);
    }
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

  public on(event: string, listener: EventListener) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    const listeners = this.events.get(event)!;
    if (listeners.includes(listener)) {
      return;
    }
    listeners.push(listener);
    if (this.el) {
      this.el.addEventListener(event, listener);
    }
  }

  public off(event?: string, listener?: EventListener) {
    if (!event) {
      if (this.el) {
        this.events.forEach((listeners, event) => listeners.forEach(listener => this.el!.removeEventListener(event, listener)));
      }
      this.events.clear();
      return;
    }
    if (!this.events.has(event)) {
      return;
    }
    const listeners = this.events.get(event)!;
    if (!listener) {
      if (this.el) {
        listeners.forEach(listener => this.el!.removeEventListener(event, listener));
      }
      this.events.delete(event);
    } else {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        if (this.el) {
          this.el.removeEventListener(event, listener);
        }
        listeners.splice(index, 1);
      }
    }
  }

  public mount(el: SVGElement) {
    this.unmount();
    this.el = el;
    this.events.forEach((events, event) => events.forEach(listener => this.el!.addEventListener(event, listener)));
  }

  public unmount() {
    if (this.el) {
      this.events.forEach((events, event) => events.forEach(listener => this.el!.removeEventListener(event, listener)));
      this.el = undefined;
    }
  }
}
