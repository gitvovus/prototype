import { computed, observable, reaction} from 'mobx';

import * as img from '@/lib/images';
import * as svg from '@/lib/svg';
import * as utils from '@/lib/utils';
import * as msg from '@/modules/messages';
import { Controller } from '@/modules/view-2d-controller';
import { List } from '@/modules/list';

import Worker from 'worker-loader!@/modules/workers/image-generator';

import source from '!!raw-loader!@/assets/scene.svg';

export class ImageData {
  public width: number;
  public height: number;
  @observable public source: string;

  public constructor(width: number, height: number, source: string) {
    this.width = width;
    this.height = height;
    this.source = source;
  }
}

export class View2d {
  private static readonly imagesCount = 11;

  public images!: List<ImageData>;
  @observable public root: svg.Item;

  private controller: Controller;

  private grayscaleFilter: svg.Item;
  private brightnessFilter: svg.Item;
  private contrastFilter: svg.Item;
  @observable private grayscaleValue = 100;
  @observable private brightnessValue = 100;
  @observable private contrastValue = 100;

  private deck: svg.Item;
  private stamps: svg.Item[] = [];


  private worker = new Worker();

  public constructor() {
    this.images = new List<ImageData>([...Array(View2d.imagesCount)].map(() => new ImageData(0, 0, '')), 0);
    this.root = svg.fromSource(source)!;
    this.controller = new Controller(this.root);

    this.grayscaleFilter = this.root.find('image-grayscale')!;
    this.brightnessFilter = this.root.find('image-brightness')!;
    this.contrastFilter = this.root.find('image-contrast')!;

    this.deck = this.root.find('deck')!;
    this.deck.items.forEach(item => this.stamps.push(item));

    const image = this.root.find('image')!;
    reaction(
      () => this.images.selectedItem!,
      (item) => Object.assign(image.attributes, { x: -item.width / 2, y: -item.height / 2, width: item.width, height: item.height, href: item.source }),
      { fireImmediately: true },
    );

    this.createImages();
  }

  public dispose() {
    this.worker.terminate();
  }

  @computed public get grayscale() {
    return this.grayscaleValue;
  }

  public set grayscale(value: number) {
    this.grayscaleValue = value;
    const v = 1 - 0.01 * value;
    this.grayscaleFilter.attributes.values = [
      (0.2126 + 0.7874 * v), (0.7152 - 0.7152  * v), (0.0722 - 0.0722 * v), 0, 0,
      (0.2126 - 0.2126 * v), (0.7152 + 0.2848  * v), (0.0722 - 0.0722 * v), 0, 0,
      (0.2126 - 0.2126 * v), (0.7152 - 0.7152  * v), (0.0722 + 0.9278 * v), 0, 0,
      0, 0, 0, 1, 0,
    ].map(x => x.toFixed(4)).join(' ');
  }

  @computed public get brightness() {
    return this.brightnessValue;
  }

  public set brightness(value: number) {
    this.brightnessValue = value;
    for (const channel of this.brightnessFilter.items) {
      channel.attributes.slope = 0.01 * value;
    }
  }

  @computed public get contrast() {
    return this.contrastValue;
  }

  public set contrast(value: number) {
    this.contrastValue = value;
    for (const channel of this.contrastFilter.items) {
      channel.attributes.slope = 0.01 * value;
      channel.attributes.intercept = 0.5 * (1 - 0.01 * value);
    }
  }

  public mount(el: HTMLElement) {
    this.controller.mount(el);
    this.stamps.forEach(item => {
      item.on('pointerdown', utils.stopPropagation);
      item.on('click', () => item.index = 2);
    });
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  public unmount() {
    window.removeEventListener('resize', this.resize);
    if (this.controller) {
      this.controller.unmount();
    }
    this.stamps.forEach(item => item.off());
  }

  public resize = () => {
    this.controller.resize();
  }

  private createImages() {
    const radius = 200;
    const petals = 7;

    this.worker.onmessage = (e: MessageEvent) => {
      const data: msg.FlowerResponse = e.data;
      this.images.items[data.id] = new ImageData(data.radius * 2, data.radius * 2, img.fromImageBitmap(data.image));
    };

    this.images.items.forEach((value, index, array) => {
      this.worker.postMessage({ type: 'flower', id: index, radius, petals, t: index / (array.length - 1) });
    });
  }
}
