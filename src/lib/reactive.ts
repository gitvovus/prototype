import { IObjectDidChange, action, computed, observable, observe, reaction } from 'mobx';
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

export class List<T> {
  @observable public readonly items: T[];
  @observable private index?: number;
  private disposer: () => void;

  public constructor(items?: T[], index?: number) {
    this.items = items || [];
    this.selectedIndex = index;
    this.disposer = reaction(
      () => this.items.length,
      (length) => {
        if (this.index !== undefined && this.index >= length) {
          this.index = length === 0 ? undefined : length - 1;
        }
      },
    );
  }

  public dispose() {
    this.disposer();
  }

  @computed public get selectedIndex() {
    return this.index;
  }

  public set selectedIndex(value: number | undefined) {
    if (value === undefined) {
      this.index = undefined;
    } else if (value >= 0 && value < this.items.length && value === Math.round(value)) {
      this.index = value;
    }
  }

  @computed public get selectedItem() {
    return this.index === undefined ? undefined : this.items[this.index];
  }

  public set selectedItem(value: T | undefined) {
    if (value === undefined) {
      this.index = undefined;
    } else {
      const index = this.items.indexOf(value);
      if (index !== -1) {
        this.index = index;
      }
    }
  }
}

export class Selection<T> {
  @observable public readonly items: T[];
  @observable private item?: T;
  private disposer: () => void;

  public constructor(items: T[]) {
    this.items = items;
    this.disposer = observe(this.items, this.onItemsChanged);
  }

  public dispose() {
    this.disposer();
  }

  @computed public get selectedItem() {
    return this.item;
  }

  public set selectedItem(item: T | undefined) {
    this.item = item;
  }

  @computed public get isSelected() {
    return (item: T) => item === this.item;
  }

  @action public select(item: T) {
    this.item = item;
  }

  @action public unselect(item: T) {
    if (this.item === item) {
      this.item = undefined;
    }
  }

  @action public invertSelection(item: T) {
    this.item = (item !== this.item) ? item : undefined;
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
  private disposer: () => void;

  public constructor(items: T[]) {
    this.items = items;
    this.disposer = observe(this.items, this.onItemsChanged);
  }

  public dispose() {
    this.disposer();
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
