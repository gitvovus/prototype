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

// parse testcase:

// import sample from '!!raw-loader!@/assets/fullscreen.svg';
// function testParse() {
//   const node = svg.parse(sample);
//   console.log('sample:', sample);
//   console.log('node:', node);
// }
