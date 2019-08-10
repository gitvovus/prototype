import { IObjectDidChange, action, computed, observable, observe } from 'mobx';
import { assert } from '@/lib/std';

export type ArrayChange<T> = {
  object: T[];
  type: 'splice';
  index: number;
  removed: T[];
  removedCount: number;
  added: T[];
  addedCount: number;
} | {
  object: T[];
  type: 'update';
  oldValue: T;
  newValue: T;
};

export class Selection<T> {
  @observable public readonly items: T[];
  @observable public selectedItem?: T;

  public constructor(items: T[]) {
    this.items = items;
    observe(this.items, this.onItemsChanged);
  }

  @computed public get isSelected() {
    return (item: T) => item === this.selectedItem;
  }

  @action public select(item: T) {
    this.selectedItem = item;
  }

  @action public unselect(item: T) {
    if (this.selectedItem === item) {
      this.selectedItem = undefined;
    }
  }

  public invertSelection(item: T) {
    this.selectedItem = (item !== this.selectedItem) ? item : undefined;
  }

  private onItemsChanged = (c: IObjectDidChange) => {
    const change = c as any as ArrayChange<T>;
    switch (change.type) {
      case 'update':
        this.unselect(change.oldValue);
        break;
      case 'splice':
        change.removed.forEach(item => this.unselect(item));
        break;
      default:
        assert(false);
    }
  }
}

export class MultiSelection<T> {
  @observable public readonly items: T[];
  @observable private readonly selected: T[] = [];

  public constructor(items: T[]) {
    this.items = items;
    observe(this.items, this.onItemsChanged);
  }

  @computed public get selectedItems() {
    return this.selected;
  }

  public set selectedItems(items: T[]) {
    this.selected.splice(0, this.selected.length, ...items);
  }

  @action public select(item: T) {
    if (!this.selected.includes(item)) {
      this.selected.push(item);
    }
  }

  @action public unselect(item: T) {
    const index = this.selected.indexOf(item);
    if (index !== -1) {
      this.selected.splice(index, 1);
    }
  }

  @computed public get isSelected() {
    return (item: T) => this.selected.includes(item);
  }

  @action public invertSelection(item: T) {
    const index = this.selected.indexOf(item);
    if (index === -1) {
      this.selected.push(item);
    } else {
      this.selected.splice(index, 1);
    }
  }

  @action public clear() {
    this.selected.length = 0;
  }

  private onItemsChanged = (c: IObjectDidChange) => {
    const change = c as any as ArrayChange<T>;
    switch (change.type) {
      case 'update':
        this.unselect(change.oldValue);
        break;
      case 'splice':
        change.removed.forEach(item => this.unselect(item));
        break;
      default:
        assert(false);
    }
  }
}

export class Sample {
  @observable public text: string;

  public constructor(text: string) {
    this.text = text;
  }

  @computed public get length() {
    return this.text.length;
  }
}
