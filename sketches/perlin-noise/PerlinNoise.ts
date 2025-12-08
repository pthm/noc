import type p5 from "p5";
import type { Entity, EntitySketch } from "../../lib/entity-sketch";

export class PerlinNoise implements Entity {
  private width: number;
  private height: number;
  private x: number;
  private y: number;

  private incr: number;

  constructor(
    private sketch: EntitySketch,
    width: number,
    height: number,
    x: number,
    y: number,

    incr: number,
  ) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;

    this.incr = incr;

    // Self-register with the sketch
    this.sketch.registerEntity(this);
  }

  setup(p: p5): void {}

  update(p: p5): void {
    // TODO: Add update logic
  }

  draw(p: p5): void {
    p.loadPixels();
    let yoff = 0;
    for (let y = this.y; y < this.y + this.height; y++) {
      let xoff = 0;
      for (let x = this.x; x < this.x + this.width; x++) {
        const idx = (x + y * p.width) * 4;
        const b = p.noise(xoff, yoff) * 255;
        p.pixels[idx] = b;
        p.pixels[idx + 1] = b;
        p.pixels[idx + 2] = b;
        p.pixels[idx + 3] = 255;

        xoff += this.incr;
      }
      yoff += this.incr;
    }
    p.updatePixels();
    p.rect(this.x, this.y, 120, 15);
    p.text(this.incr, this.x, this.y + 12);
  }

  destroy(): void {
    this.sketch.unregisterEntity(this);
  }
}
