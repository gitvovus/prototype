import { computed, observable, reaction } from 'mobx';

export class List<T> {
  @observable.shallow public readonly items: T[];
  @observable private index?: number;

  public constructor(items?: T[], index?: number) {
    this.items = items || [];
    this.selectedIndex = index;
    reaction(
      () => this.items.length,
      (length) => {
        if (this.index !== undefined && this.index >= length) {
          this.index = length === 0 ? undefined : length - 1;
        }
      },
    );
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
      if (index !== -1) { this.index = index; }
    }
  }
}
