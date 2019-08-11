import { computed, observable } from 'mobx';

import * as reactive from '@/lib/reactive';

export class Sample {
  @observable public text: string;

  public constructor(text: string) {
    this.text = text;
  }

  @computed public get length() {
    return this.text.length;
  }
}

export class ViewReact {
  @observable public readonly sampleData: Sample[] = [...Array(5)].map((item, index) => new Sample(`sample #${index}`));
  public readonly selection = new reactive.Selection(this.sampleData);
  public readonly multiSelection = new reactive.MultiSelection(this.sampleData);

  @observable public textToApply = '';
  @observable public indexToApply = 0;

  public constructor() {
  }

  public add() {
    this.sampleData.splice(this.indexToApply, 0, new Sample(this.textToApply));
  }

  public remove() {
    this.sampleData.splice(this.indexToApply, 1);
  }
}
