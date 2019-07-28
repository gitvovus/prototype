import { Container, Options, combine } from '@/lib/svg/item';

export class Defs extends Container {
  public constructor(options?: Partial<Options>) {
    super(combine({ tag: 'defs' }, options));
  }
}
