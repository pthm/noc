import type p5 from "p5";
import { EntitySketch } from "../../lib/entity-sketch";
import { Walker } from "./Walker";

export class WalkerSketch extends EntitySketch {
  constructor(p: p5) {
    super(p);
  }

  setup(): void {
    const p = this.p;
    p.createCanvas(window.innerWidth, window.innerHeight);
    p.frameRate(120);
    p.background(0);

    this.add(new Walker(p, p.width / 2, p.height / 2));
  }

  protected override windowResized(): void {
    this.p.resizeCanvas(window.innerWidth, window.innerHeight);
  }
}
