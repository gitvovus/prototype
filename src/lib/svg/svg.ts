import { observable } from 'mobx';

import { Container, Options, combine } from '@/lib/svg/item';

export interface SvgOptions extends Options {
  viewBox: string;
  width: number;
  height: number;
  fill: string;
  opacity: number;
}

export class Svg extends Container {
  @observable public viewBox!: string;
  @observable public width!: number;
  @observable public height!: number;
  @observable public fill!: string;
  @observable public opacity!: number;

  public constructor(options?: Partial<SvgOptions>) {
    super(combine({ tag: 'svg' }, options));
  }
}
