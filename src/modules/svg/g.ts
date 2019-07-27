import { observable } from 'mobx';

import { Container, ItemOptions, combineItemOptions } from '@/modules/svg/item';

export interface GOptions extends ItemOptions {
  id: string;
  viewBox: string;
  width: number;
  height: number;
  transform: string;
}

export class G extends Container {
  @observable public id!: string;
  @observable public viewBox!: string;
  @observable public width!: number;
  @observable public height!: number;
  @observable public transform!: string;

  public constructor(options?: Partial<GOptions>) {
    super(combineItemOptions({ tag: 'g' }, options));
  }
}
