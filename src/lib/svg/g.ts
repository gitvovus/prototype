import { observable } from 'mobx';

import { Container, Options, combine } from '@/lib/svg/item';

export interface GOptions extends Options {
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
    super(combine({ tag: 'g' }, options));
  }
}
