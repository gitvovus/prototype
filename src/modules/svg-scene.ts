import * as img from '@/lib/images';
import * as svg from '@/modules/svg';

import { Controller } from '@/modules/svg-controller';

import { observable } from 'mobx';

export class SvgScene {
  @observable public model: svg.Svg;

  private controller!: Controller;

  public constructor() {
    this.model = this.createModel();
    this.controller = new Controller(this.model);
  }

  public activate(el: HTMLDivElement) {
    this.controller.activate(el);
  }

  public deactivate() {
    if (this.controller) {
      this.controller.dispose();
    }
  }

  private createModel() {
    const width = 500;
    const height = 500;
    const model = new svg.Svg({ viewBox: `0 0 ${width} ${height}`, width, height, fill: 'white' });
    const defs = new svg.Defs();
    const g = new svg.G({ id: 'cam-pic' });
    g.items.push(
      new svg.Path({ d: 'M0 0v30 h10v-20h20v-10zM0 80h30v-10h-20v-20h-10zM80 80v-30 h-10v20h-20v10zM80 0h-30v10h20v20h10z' }),
      new svg.Circle({ cx: 40, cy: 40, r: 20, fill: 'red' }),
    );
    defs.items.push(g);

    const groups = [[10, 10], [410, 10], [10, 410], [410, 410]].map(([x, y]) => new svg.G({ transform: `translate(${x},${y})`}));
    groups.forEach(group => group.items.push(new svg.Use({ href: '#cam-pic' })));

    const size = 400;
    const step = 50;
    const lite: img.RGBA = [0xff, 0xff, 0xff, 0x40];
    const dark: img.RGBA = [0x00, 0x00, 0x00, 0x40];
    const imageData = img.fromImageData(img.generate(size, size, (x, y) => ((x - x % step) / step & 1) === ((y - y % step) / step & 1) ? lite : dark));
    const image = new svg.Image({ x: (width - size) / 2, y: (height - size) / 2, width: size, height: size, href: imageData });

    model.items.push(defs, image, ...groups);
    return model;
  }
}
