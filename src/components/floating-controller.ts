import { observable } from 'mobx';

interface Handler {
  el: Element;
  pick: EventListener;
  drag: EventListener;
  drop: EventListener;
}

export class FloatingController {
  @observable public left = 0;
  @observable public top = 0;
  @observable public width = 1000;
  @observable public height = 600;
  @observable public minWidth = 200;
  @observable public minHeight = 100;

  private root!: Element;
  private captured = { x: 0, y: 0 };
  private cc!: Handler;
  private nw!: Handler;
  private nn!: Handler;
  private ne!: Handler;
  private ww!: Handler;
  private ee!: Handler;
  private ss!: Handler;
  private sw!: Handler;
  private se!: Handler;

  public mount(root: Element) {
    this.root = root;
    this.init();
    this.center();
  }

  public dispose() {
    this.cc.el.removeEventListener('dblclick', this.dblClick);
    this.cc.el.removeEventListener('pointerdown', this.cc.pick);
    this.nw.el.removeEventListener('pointerdown', this.nw.pick);
    this.nn.el.removeEventListener('pointerdown', this.nn.pick);
    this.ne.el.removeEventListener('pointerdown', this.ne.pick);
    this.ww.el.removeEventListener('pointerdown', this.ww.pick);
    this.ee.el.removeEventListener('pointerdown', this.ee.pick);
    this.sw.el.removeEventListener('pointerdown', this.sw.pick);
    this.ss.el.removeEventListener('pointerdown', this.ss.pick);
    this.se.el.removeEventListener('pointerdown', this.se.pick);
  }

  private center() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.left = Math.floor(0.5 * (width - this.width));
    this.top = Math.floor(0.5 * (height - this.height));
  }

  private init() {
    const el = this.root.firstChild as Element;
    this.cc = {
      el: el.children[4],
      pick: (e: Event) => this.ccPick(e as PointerEvent),
      drag: (e: Event) => this.ccDrag(e as PointerEvent),
      drop: (e: Event) => this.ccDrop(e as PointerEvent),
    };
    this.nw = {
      el: el.children[0],
      pick: (e: Event) => this.nwPick(e as PointerEvent),
      drag: (e: Event) => this.nwDrag(e as PointerEvent),
      drop: (e: Event) => this.nwDrop(e as PointerEvent),
    },
    this.nn = {
      el: el.children[1],
      pick: (e: Event) => this.nnPick(e as PointerEvent),
      drag: (e: Event) => this.nnDrag(e as PointerEvent),
      drop: (e: Event) => this.nnDrop(e as PointerEvent),
    };
    this.ne = {
      el: el.children[2],
      pick: (e: Event) => this.nePick(e as PointerEvent),
      drag: (e: Event) => this.neDrag(e as PointerEvent),
      drop: (e: Event) => this.neDrop(e as PointerEvent),
    };
    this.ww = {
      el: el.children[3],
      pick: (e: Event) => this.wwPick(e as PointerEvent),
      drag: (e: Event) => this.wwDrag(e as PointerEvent),
      drop: (e: Event) => this.wwDrop(e as PointerEvent),
    };
    this.ee = {
      el: el.children[5],
      pick: (e: Event) => this.eePick(e as PointerEvent),
      drag: (e: Event) => this.eeDrag(e as PointerEvent),
      drop: (e: Event) => this.eeDrop(e as PointerEvent),
    };
    this.sw = {
      el: el.children[6],
      pick: (e: Event) => this.swPick(e as PointerEvent),
      drag: (e: Event) => this.swDrag(e as PointerEvent),
      drop: (e: Event) => this.swDrop(e as PointerEvent),
    };
    this.ss = {
      el: el.children[7],
      pick: (e: Event) => this.ssPick(e as PointerEvent),
      drag: (e: Event) => this.ssDrag(e as PointerEvent),
      drop: (e: Event) => this.ssDrop(e as PointerEvent),
    };
    this.se = {
      el: el.children[8],
      pick: (e: Event) => this.sePick(e as PointerEvent),
      drag: (e: Event) => this.seDrag(e as PointerEvent),
      drop: (e: Event) => this.seDrop(e as PointerEvent),
    };

    this.cc.el.addEventListener('dblclick', this.dblClick);
    this.cc.el.addEventListener('pointerdown', this.cc.pick);
    this.nw.el.addEventListener('pointerdown', this.nw.pick);
    this.nn.el.addEventListener('pointerdown', this.nn.pick);
    this.ne.el.addEventListener('pointerdown', this.ne.pick);
    this.ww.el.addEventListener('pointerdown', this.ww.pick);
    this.ee.el.addEventListener('pointerdown', this.ee.pick);
    this.sw.el.addEventListener('pointerdown', this.sw.pick);
    this.ss.el.addEventListener('pointerdown', this.ss.pick);
    this.se.el.addEventListener('pointerdown', this.se.pick);
  }

  private capture(h: Handler, e: PointerEvent) {
    h.el.addEventListener('pointermove', h.drag);
    h.el.addEventListener('pointerup', h.drop);
    h.el.setPointerCapture(e.pointerId);
    e.preventDefault();
    e.stopPropagation();
  }

  private release(h: Handler, e: PointerEvent) {
    h.el.removeEventListener('pointermove', h.drag);
    h.el.removeEventListener('pointerup', h.drop);
    h.el.releasePointerCapture(e.pointerId);
  }

  private dblClick = (e: Event) => {
    if (e.target === this.cc.el) {
      this.center();
    }
  }

  // -----------------------------------------------------------
  private ccPick(e: PointerEvent) {
    if (e.target === this.cc.el && e.buttons & 1) {
      this.captured.x = e.screenX - this.left;
      this.captured.y = e.screenY - this.top;
      this.capture(this.cc, e);
    }
  }

  private ccDrag(e: PointerEvent) {
    this.left = e.screenX - this.captured.x;
    this.top = e.screenY - this.captured.y;
    e.preventDefault();
    e.stopPropagation();
  }

  private ccDrop(e: PointerEvent) {
    if (!(e.buttons & 1)) {
      this.release(this.cc, e);
    }
  }
  // -----------------------------------------------------------
  private nwPick(e: PointerEvent) {
    if (e.buttons & 1) {
      this.captured.x = e.screenX - this.left;
      this.captured.y = e.screenY - this.top;
      this.capture(this.nw, e);
    }
  }

  private nwDrag(e: PointerEvent) {
    const left = e.screenX - this.captured.x;
    const top = e.screenY - this.captured.y;
    const width = Math.max(this.minWidth, this.left + this.width - left);
    const height = Math.max(this.minHeight, this.top + this.height - top);

    this.left = this.left + this.width - width;
    this.top = this.top + this.height - height;
    this.width = width;
    this.height = height;

    e.preventDefault();
    e.stopPropagation();
  }

  private nwDrop(e: PointerEvent) {
    if (!(e.buttons & 1)) {
      this.release(this.nw, e);
    }
  }

  // -----------------------------------------------------------
  private nnPick(e: PointerEvent) {
    if (e.buttons & 1) {
      this.captured.y = e.screenY - this.top;
      this.capture(this.nn, e);
    }
  }

  private nnDrag(e: PointerEvent) {
    const top = e.screenY - this.captured.y;
    const height = Math.max(this.minHeight, this.top + this.height - top);

    this.top = this.top + this.height - height;
    this.height = height;

    e.preventDefault();
    e.stopPropagation();
  }

  private nnDrop(e: PointerEvent) {
    if (!(e.buttons & 1)) {
      this.release(this.nn, e);
    }
  }

  // -----------------------------------------------------------
  private nePick(e: PointerEvent) {
    if (e.buttons & 1) {
      this.captured.x = e.screenX - this.width;
      this.captured.y = e.screenY - this.top;
      this.capture(this.ne, e);
    }
  }

  private neDrag(e: PointerEvent) {
    const top = e.screenY - this.captured.y;
    const height = Math.max(this.minHeight, this.top + this.height - top);

    this.width = Math.max(this.minWidth, e.screenX - this.captured.x);
    this.top = this.top + this.height - height;
    this.height = height;

    e.preventDefault();
    e.stopPropagation();
  }

  private neDrop(e: PointerEvent) {
    if (!(e.buttons & 1)) {
      this.release(this.ne, e);
    }
  }

  // -----------------------------------------------------------
  private wwPick(e: PointerEvent) {
    if (e.buttons & 1) {
      this.captured.x = e.screenX - this.left;
      this.capture(this.ww, e);
    }
  }

  private wwDrag(e: PointerEvent) {
    const left = e.screenX - this.captured.x;
    const width = Math.max(this.minWidth, this.left + this.width - left);

    this.left = this.left + this.width - width;
    this.width = width;

    e.preventDefault();
    e.stopPropagation();
  }

  private wwDrop(e: PointerEvent) {
    if (!(e.buttons & 1)) {
      this.release(this.ww, e);
    }
  }

  // -----------------------------------------------------------
  private eePick(e: PointerEvent) {
    if (e.buttons & 1) {
      this.captured.x = e.screenX - this.width;
      this.capture(this.ee, e);
    }
  }

  private eeDrag(e: PointerEvent) {
    this.width = Math.max(this.minWidth, e.screenX - this.captured.x);
    e.preventDefault();
    e.stopPropagation();
  }

  private eeDrop(e: PointerEvent) {
    if (!(e.buttons & 1)) {
      this.release(this.ee, e);
    }
  }

  // -----------------------------------------------------------
  private swPick(e: PointerEvent) {
    if (e.buttons & 1) {
      this.captured.x = e.screenX - this.left;
      this.captured.y = e.screenY - this.height;
      this.capture(this.sw, e);
    }
  }

  private swDrag(e: PointerEvent) {
    const left = e.screenX - this.captured.x;
    const width = Math.max(this.minWidth, this.left + this.width - left);

    this.left = this.left + this.width - width;
    this.width = width;
    this.height = Math.max(this.minHeight, e.screenY - this.captured.y);

    e.preventDefault();
    e.stopPropagation();
  }

  private swDrop(e: PointerEvent) {
    if (!(e.buttons & 1)) {
      this.release(this.sw, e);
    }
  }

  // -----------------------------------------------------------
  private ssPick(e: PointerEvent) {
    if (e.buttons & 1) {
      this.captured.y = e.screenY - this.height;
      this.capture(this.ss, e);
    }
  }

  private ssDrag(e: PointerEvent) {
    this.height = Math.max(this.minHeight, e.screenY - this.captured.y);
    e.preventDefault();
    e.stopPropagation();
  }

  private ssDrop(e: PointerEvent) {
    if (!(e.buttons & 1)) {
      this.release(this.ss, e);
    }
  }

  // -----------------------------------------------------------
  private sePick(e: PointerEvent) {
    if (e.buttons & 1) {
      this.captured.x = e.screenX - this.width;
      this.captured.y = e.screenY - this.height;
      this.capture(this.se, e);
    }
  }

  private seDrag(e: PointerEvent) {
    this.width = Math.max(this.minWidth, e.screenX - this.captured.x);
    this.height = Math.max(this.minHeight, e.screenY - this.captured.y);
    e.preventDefault();
    e.stopPropagation();
  }

  private seDrop(e: PointerEvent) {
    if (!(e.buttons & 1)) {
      this.release(this.se, e);
    }
  }
}
