import { observable, reaction } from 'mobx';
import * as svg from '@/lib/svg';
import { View2d } from '@/modules/view-2d';
import { Controller } from '@/modules/svg-controller';
import svgContent from '!!raw-loader!@/assets/scene.svg';

export class SvgScene {
  @observable public model: svg.Node;

  private view2d: View2d;
  private controller!: Controller;

  public constructor(view2d: View2d) {
    this.model = svg.parse(svgContent);
    this.view2d = view2d;
    this.controller = new Controller(this.model);

    let scene: svg.Node = undefined!;
    for (const item of this.model.items) {
      if (item.attributes.id === 'scene') {
        scene = item;
      }
    }
    if (scene) {
      let image: svg.Node = undefined!;
      for (const item of scene.items) {
        if (item.attributes.id === 'image') {
          image = item;
        }
      }
      if (image) {
        reaction(
          () => this.view2d.selectedItem,
          () => image.attributes.href = this.view2d.selectedItem!,
          { fireImmediately: true },
        );
      }
    }
  }

  public activate(el: HTMLElement) {
    this.controller.activate(el);
  }

  public deactivate() {
    if (this.controller) {
      this.controller.dispose();
    }
  }

  public resize() {
    this.controller.resize();
  }
}
