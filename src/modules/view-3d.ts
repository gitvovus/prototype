import { computed, observable, reaction } from 'mobx';

import { List } from '@/modules/list';
import { Scene } from '@/modules/scene';
import { CameraType } from '@/modules/types';

export class View3d extends List<string> {
  @observable public scene?: Scene;
  @observable public cameraType = CameraType.PERSPECTIVE;

  private disposers: Array<() => void> = [];

  public constructor() {
    super(['bicubic', 'mockup'], 1);
  }

  @computed public get demo() {
    return this.scene && this.scene.demo;
  }

  public mount(canvas: HTMLCanvasElement) {
    this.scene = new Scene(canvas);
    this.disposers = [
      reaction(
        () => this.selectedItem,
        () => this.scene!.load(this.selectedItem!),
        { fireImmediately: true },
      ),
      reaction(
        () => this.cameraType,
        () => this.scene!.setCameraType(this.cameraType),
        { fireImmediately: true },
      ),
    ];
  }

  public unmount() {
    this.disposers.forEach(disposer => disposer());
    this.disposers = [];
    if (this.scene) {
      this.scene.dispose();
      this.scene = undefined;
    }
  }
}
