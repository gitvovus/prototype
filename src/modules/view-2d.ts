import * as img from '@/lib/images';
import * as msg from '@/modules/messages';
import { List } from '@/modules/list';

import Worker from 'worker-loader!@/modules/workers/image-generator';

export class View2d extends List<string> {
  private worker = new Worker();

  public constructor() {
    super([''], 0);
    this.createImages();
  }

  public dispose() {
    this.worker.terminate();
  }

  private createImages() {
    const count = 50;
    const radius = 200;
    const petals = 7;
    for (let i = 1; i < count; ++i) {
      this.items.push('');
    }

    let i = 0;
    this.worker.onmessage = (e: MessageEvent) => {
      const data: msg.FlowerResponse = e.data;
      this.items[data.id] = img.fromImageBitmap(data.image);
      if (++i < count) {
        this.worker.postMessage({ type: 'flower', id: i, radius, petals, t: i / (count - 1) });
      } else {
        this.worker.terminate();
      }
    };

    this.worker.postMessage({ type: 'flower', id: i, radius, petals, t: i / (count - 1) });
  }
}
