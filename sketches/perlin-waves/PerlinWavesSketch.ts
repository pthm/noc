import type p5 from "p5";
import { EntitySketch } from "../../lib/entity-sketch";
import { PerlinWaves } from "./PerlinWaves";

export class PerlinWavesSketch extends EntitySketch {
  constructor(p: p5) {
    super(p);
  }

  setup(): void {
    const p = this.p;
    p.createCanvas(window.innerWidth, window.innerHeight);

    // Create initial entity in the center

    let count = 0;
    for (let y = 0; y < p.height; y += p.height / 40) {
      count++;
      this.add(new PerlinWaves(p, 100, y, count));
    }
  }

  protected override preDraw(): void {
    this.p.background(30);
  }

  protected override windowResized(): void {
    this.p.resizeCanvas(window.innerWidth, window.innerHeight);
  }
}
