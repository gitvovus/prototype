import { observable, reaction } from 'mobx';
import * as svg from '@/lib/svg';
import { View2d } from '@/modules/view-2d';
import { Controller } from '@/modules/svg-controller';
import data from '!!raw-loader!@/assets/scene.svg';

export class SvgScene {
  @observable public root: svg.Node;

  private view2d: View2d;
  private controller: Controller;

  public constructor(view2d: View2d) {
    this.root = svg.parse(data);
    this.view2d = view2d;
    this.controller = new Controller(this.root);

    const image = this.root.find('image')!;
    reaction(
      () => this.view2d.selectedItem,
      () => image.attributes.href = this.view2d.selectedItem!,
      { fireImmediately: true },
    );
  }

  public mount(el: HTMLElement) {
    this.controller.activate(el);
  }

  public unmount() {
    if (this.controller) {
      this.controller.dispose();
    }
  }

  public resize() {
    this.controller.resize();
  }
}
