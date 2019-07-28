import * as img from '@/lib/images';
import * as svg from '@/lib/svg';

import { Controller } from '@/modules/svg-controller';

import { observable } from 'mobx';

export class SvgScene {
  @observable public model: svg.Svg;

  private controller!: Controller;

  public constructor() {
    this.model = this.createModel();
    this.controller = new Controller(this.model);
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

  private createModel() {
    const width = 500;
    const height = 500;
    const model = new svg.Svg({ viewBox: `0 0 ${width} ${height}`, width, height, fill: 'white' });
    const defs = new svg.Defs();
    const g = new svg.G({ id: 'cam-pic' });
    g.items.push(
      new svg.Path({ d: 'M-40 -40v30 h10v-20h20v-10zM40 -40h-30v10h20v20h10zM-40 40h30v-10h-20v-20h-10zM40 40v-30 h-10v20h-20v10z' }),
      new svg.Circle({ cx: 0, cy: 0, r: 20, fill: 'red' }),
    );
    defs.items.push(g);

    const groups = [[-200, -200], [200, -200], [-200, 200], [200, 200]].map(([x, y]) => new svg.G({ transform: `translate(${x},${y})`}));
    groups.forEach(group => group.items.push(new svg.Use({ href: '#cam-pic' })));

    const size = 400;
    const step = 50;
    const lite: img.RGBA = [0xff, 0xff, 0xff, 0x80];
    const dark: img.RGBA = [0x00, 0x00, 0x00, 0x80];
    const imageData = img.fromImageData(img.generate(size, size, (x, y) => ((x - x % step) / step & 1) === ((y - y % step) / step & 1) ? lite : dark));
    const image = new svg.Image({ id: 'image', x:  -size / 2, y:  -size / 2, width: size, height: size, href: imageData });

    const scene = new svg.G({ id: 'scene' });
    scene.items.push(image, ...groups);

    model.items.push(defs, scene);
    return model;
  }
}
