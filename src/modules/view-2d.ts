import * as img from '@/lib/images';
import * as msg from '@/modules/messages';
import { List } from '@/modules/list';

import Worker from 'worker-loader!@/modules/workers/image-generator';

export class View2d extends List<string> {
  private static readonly imagesCount = 5;
  private worker = new Worker();

  public constructor() {
    super([...Array(View2d.imagesCount)].map(() => ''), 0);
    this.createImages();
  }

  public dispose() {
    this.worker.terminate();
  }

  private createImages() {
    const radius = 200;
    const petals = 7;

    this.worker.onmessage = (e: MessageEvent) => {
      const data: msg.FlowerResponse = e.data;
      this.items[data.id] = img.fromImageBitmap(data.image);
    };

    this.items.forEach((value, index, array) => {
      this.worker.postMessage({ type: 'flower', id: index, radius, petals, t: index / (array.length - 1) });
    });
  }
}
