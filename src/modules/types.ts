import { observable } from 'mobx';

export class Layout {
  public readonly id!: string;
  public readonly icon!: string;
  public readonly label!: string;
  public readonly show3d!: boolean;
  public readonly show2d!: boolean;

  public constructor(id: string, icon: string, label: string, show2d: boolean, show3d: boolean) {
    this.id = id;
    this.icon = icon;
    this.label = label;
    this.show2d = show2d;
    this.show3d = show3d;
  }
}

export class Tools {
  public readonly id!: string;
  @observable public icon!: string;
  @observable public label!: string;
  @observable public show!: boolean;

  public constructor(id: string, icon: string, label: string, show: boolean) {
    this.id = id;
    this.icon = icon;
    this.label = label;
    this.show = show;
  }
}

export enum Page {
  HOME = 0,
  VIEWS = 1,
}

export enum CameraType {
  PERSPECTIVE = 0,
  ORTHOGRAPHIC = 1,
}
