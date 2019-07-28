import { observable } from 'mobx';

interface Handler {
  el: Element;
  pick: EventListener;
  drag: EventListener;
  drop: EventListener;
}

interface Internal {
  capture: { x: number, y: number };
  cc: Handler;
  nw: Handler;
  nn: Handler;
  ne: Handler;
  ww: Handler;
  ee: Handler;
  ss: Handler;
  sw: Handler;
  se: Handler;
}

export class FloatingController {
  @observable public left: number = 100;
  @observable public top: number = 100;
  @observable public width: number = 800;
  @observable public height: number = 400;
  @observable public minWidth: number = 100;
  @observable public minHeight: number = 50;

  private root!: Element;
  private data!: Internal;

  public constructor() {
  }

  public mount(root: Element) {
    this.root = root;
    this.init();
    this.center();
  }

  public dispose() {
    this.data.cc.el.removeEventListener('pointerdown', this.data.cc.pick);
    this.data.nw.el.removeEventListener('pointerdown', this.data.nw.pick);
    this.data.nn.el.removeEventListener('pointerdown', this.data.nn.pick);
    this.data.ne.el.removeEventListener('pointerdown', this.data.ne.pick);
    this.data.ww.el.removeEventListener('pointerdown', this.data.ww.pick);
    this.data.ee.el.removeEventListener('pointerdown', this.data.ee.pick);
    this.data.sw.el.removeEventListener('pointerdown', this.data.sw.pick);
    this.data.ss.el.removeEventListener('pointerdown', this.data.ss.pick);
    this.data.se.el.removeEventListener('pointerdown', this.data.se.pick);
  }

  public center() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.left = Math.floor(0.5 * (width - this.width));
    this.top = Math.floor(0.5 * (height - this.height));
  }

  private init() {
    const el = this.root.firstChild as Element;
    this.data = {
      capture: { x: 0, y: 0 },

      cc: {
        el: el.children[4],
        pick: (e: Event) => this.ccPick(e as PointerEvent),
        drag: (e: Event) => this.ccDrag(e as PointerEvent),
        drop: (e: Event) => this.ccDrop(e as PointerEvent),
      },
      nw: {
        el: el.children[0],
        pick: (e: Event) => this.nwPick(e as PointerEvent),
        drag: (e: Event) => this.nwDrag(e as PointerEvent),
        drop: (e: Event) => this.nwDrop(e as PointerEvent),
      },
      nn: {
        el: el.children[1],
        pick: (e: Event) => this.nnPick(e as PointerEvent),
        drag: (e: Event) => this.nnDrag(e as PointerEvent),
        drop: (e: Event) => this.nnDrop(e as PointerEvent),
      },
      ne: {
        el: el.children[2],
        pick: (e: Event) => this.nePick(e as PointerEvent),
        drag: (e: Event) => this.neDrag(e as PointerEvent),
        drop: (e: Event) => this.neDrop(e as PointerEvent),
      },
      ww: {
        el: el.children[3],
        pick: (e: Event) => this.wwPick(e as PointerEvent),
        drag: (e: Event) => this.wwDrag(e as PointerEvent),
        drop: (e: Event) => this.wwDrop(e as PointerEvent),
      },
      ee: {
        el: el.children[5],
        pick: (e: Event) => this.eePick(e as PointerEvent),
        drag: (e: Event) => this.eeDrag(e as PointerEvent),
        drop: (e: Event) => this.eeDrop(e as PointerEvent),
      },
      sw: {
        el: el.children[6],
        pick: (e: Event) => this.swPick(e as PointerEvent),
        drag: (e: Event) => this.swDrag(e as PointerEvent),
        drop: (e: Event) => this.swDrop(e as PointerEvent),
      },
      ss: {
        el: el.children[7],
        pick: (e: Event) => this.ssPick(e as PointerEvent),
        drag: (e: Event) => this.ssDrag(e as PointerEvent),
        drop: (e: Event) => this.ssDrop(e as PointerEvent),
      },
      se: {
        el: el.children[8],
        pick: (e: Event) => this.sePick(e as PointerEvent),
        drag: (e: Event) => this.seDrag(e as PointerEvent),
        drop: (e: Event) => this.seDrop(e as PointerEvent),
      },
    };

    this.data.cc.el.addEventListener('pointerdown', this.data.cc.pick);
    this.data.nw.el.addEventListener('pointerdown', this.data.nw.pick);
    this.data.nn.el.addEventListener('pointerdown', this.data.nn.pick);
    this.data.ne.el.addEventListener('pointerdown', this.data.ne.pick);
    this.data.ww.el.addEventListener('pointerdown', this.data.ww.pick);
    this.data.ee.el.addEventListener('pointerdown', this.data.ee.pick);
    this.data.sw.el.addEventListener('pointerdown', this.data.sw.pick);
    this.data.ss.el.addEventListener('pointerdown', this.data.ss.pick);
    this.data.se.el.addEventListener('pointerdown', this.data.se.pick);
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

  // -----------------------------------------------------------
  private ccPick(e: PointerEvent) {
    if (e.target === this.data.cc.el && e.buttons & 1) {
      this.data.capture.x = e.screenX - this.left;
      this.data.capture.y = e.screenY - this.top;
      this.capture(this.data.cc, e);
    }
  }

  private ccDrag(e: PointerEvent) {
    this.left = e.screenX - this.data.capture.x;
    this.top = e.screenY - this.data.capture.y;
    e.preventDefault();
    e.stopPropagation();
  }

  private ccDrop(e: PointerEvent) {
    if (!(e.buttons & 1)) {
      this.release(this.data.cc, e);
    }
  }
  // -----------------------------------------------------------
  private nwPick(e: PointerEvent) {
    if (e.buttons & 1) {
      this.data.capture.x = e.screenX - this.left;
      this.data.capture.y = e.screenY - this.top;
      this.capture(this.data.nw, e);
    }
  }

  private nwDrag(e: PointerEvent) {
    const left = e.screenX - this.data.capture.x;
    const top = e.screenY - this.data.capture.y;
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
      this.release(this.data.nw, e);
    }
  }

  // -----------------------------------------------------------
  private nnPick(e: PointerEvent) {
    if (e.buttons & 1) {
      this.data.capture.y = e.screenY - this.top;
      this.capture(this.data.nn, e);
    }
  }

  private nnDrag(e: PointerEvent) {
    const top = e.screenY - this.data.capture.y;
    const height = Math.max(this.minHeight, this.top + this.height - top);

    this.top = this.top + this.height - height;
    this.height = height;

    e.preventDefault();
    e.stopPropagation();
  }

  private nnDrop(e: PointerEvent) {
    if (!(e.buttons & 1)) {
      this.release(this.data.nn, e);
    }
  }

  // -----------------------------------------------------------
  private nePick(e: PointerEvent) {
    if (e.buttons & 1) {
      this.data.capture.x = e.screenX - this.width;
      this.data.capture.y = e.screenY - this.top;
      this.capture(this.data.ne, e);
    }
  }

  private neDrag(e: PointerEvent) {
    const top = e.screenY - this.data.capture.y;
    const height = Math.max(this.minHeight, this.top + this.height - top);

    this.width = Math.max(this.minWidth, e.screenX - this.data.capture.x);
    this.top = this.top + this.height - height;
    this.height = height;

    e.preventDefault();
    e.stopPropagation();
  }

  private neDrop(e: PointerEvent) {
    if (!(e.buttons & 1)) {
      this.release(this.data.ne, e);
    }
  }

  // -----------------------------------------------------------
  private wwPick(e: PointerEvent) {
    if (e.buttons & 1) {
      this.data.capture.x = e.screenX - this.left;
      this.capture(this.data.ww, e);
    }
  }

  private wwDrag(e: PointerEvent) {
    const left = e.screenX - this.data.capture.x;
    const width = Math.max(this.minWidth, this.left + this.width - left);

    this.left = this.left + this.width - width;
    this.width = width;

    e.preventDefault();
    e.stopPropagation();
  }

  private wwDrop(e: PointerEvent) {
    if (!(e.buttons & 1)) {
      this.release(this.data.ww, e);
    }
  }

  // -----------------------------------------------------------
  private eePick(e: PointerEvent) {
    if (e.buttons & 1) {
      this.data.capture.x = e.screenX - this.width;
      this.capture(this.data.ee, e);
    }
  }

  private eeDrag(e: PointerEvent) {
    this.width = Math.max(this.minWidth, e.screenX - this.data.capture.x);
    e.preventDefault();
    e.stopPropagation();
  }

  private eeDrop(e: PointerEvent) {
    if (!(e.buttons & 1)) {
      this.release(this.data.ee, e);
    }
  }

  // -----------------------------------------------------------
  private swPick(e: PointerEvent) {
    if (e.buttons & 1) {
      this.data.capture.x = e.screenX - this.left;
      this.data.capture.y = e.screenY - this.height;
      this.capture(this.data.sw, e);
    }
  }

  private swDrag(e: PointerEvent) {
    const left = e.screenX - this.data.capture.x;
    const width = Math.max(this.minWidth, this.left + this.width - left);

    this.left = this.left + this.width - width;
    this.width = width;
    this.height = Math.max(this.minHeight, e.screenY - this.data.capture.y);

    e.preventDefault();
    e.stopPropagation();
  }

  private swDrop(e: PointerEvent) {
    if (!(e.buttons & 1)) {
      this.release(this.data.sw, e);
    }
  }

  // -----------------------------------------------------------
  private ssPick(e: PointerEvent) {
    if (e.buttons & 1) {
      this.data.capture.y = e.screenY - this.height;
      this.capture(this.data.ss, e);
    }
  }

  private ssDrag(e: PointerEvent) {
    this.height = Math.max(this.minHeight, e.screenY - this.data.capture.y);
    e.preventDefault();
    e.stopPropagation();
  }

  private ssDrop(e: PointerEvent) {
    if (!(e.buttons & 1)) {
      this.release(this.data.ss, e);
    }
  }

  // -----------------------------------------------------------
  private sePick(e: PointerEvent) {
    if (e.buttons & 1) {
      this.data.capture.x = e.screenX - this.width;
      this.data.capture.y = e.screenY - this.height;
      this.capture(this.data.se, e);
    }
  }

  private seDrag(e: PointerEvent) {
    this.width = Math.max(this.minWidth, e.screenX - this.data.capture.x);
    this.height = Math.max(this.minHeight, e.screenY - this.data.capture.y);
    e.preventDefault();
    e.stopPropagation();
  }

  private seDrop(e: PointerEvent) {
    if (!(e.buttons & 1)) {
      this.release(this.data.se, e);
    }
  }
}
