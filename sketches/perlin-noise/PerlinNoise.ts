import type p5 from "p5";
import { Entity } from "../../lib/entity-sketch";

export class PerlinNoise extends Entity {
  private width: number;
  private height: number;
  private x: number;
  private y: number;

  private incr: number;
  private buffer: p5.Graphics | null = null;
  private rendered = false;

  constructor(
    private p: p5,
    width: number,
    height: number,
    x: number,
    y: number,
    incr: number,
  ) {
    super();
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;

    this.incr = incr;
  }

  override setup(p: p5): void {
    this.buffer = p.createGraphics(this.width, this.height);
    this.buffer.pixelDensity(1);
  }

  update(p: p5): void {}

  draw(p: p5): void {
    if (!this.buffer) return;

    // Only render the noise once since it's static
    if (!this.rendered) {
      this.buffer.loadPixels();
      let yoff = 0;
      for (let y = 0; y < this.height; y++) {
        let xoff = 0;
        for (let x = 0; x < this.width; x++) {
          const idx = (x + y * this.width) * 4;
          const b = p.noise(xoff, yoff) * 255;
          this.buffer.pixels[idx] = b;
          this.buffer.pixels[idx + 1] = b;
          this.buffer.pixels[idx + 2] = b;
          this.buffer.pixels[idx + 3] = 255;

          xoff += this.incr;
        }
        yoff += this.incr;
      }
      this.buffer.updatePixels();
      this.rendered = true;
    }

    p.image(this.buffer, this.x, this.y);
    p.fill(255);
    p.rect(this.x, this.y, 120, 15);
    p.fill(0);
    p.text(this.incr, this.x + 2, this.y + 12);
  }
}
