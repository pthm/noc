import type p5 from "p5";
import type { Entity, EntitySketch } from "../../lib/entity-sketch";

export class Walker implements Entity {
  private x: number;
  private y: number;

  private size: number;

  constructor(
    private sketch: EntitySketch,
    x: number,
    y: number,
  ) {
    this.x = x;
    this.y = y;
    this.size = 10;
    this.sketch.registerEntity(this);
  }

  update(p: p5): void {
    const xstep = (p.floor(p.random(3)) - 1) * this.size;
    const ystep = (p.floor(p.random(3)) - 1) * this.size;

    console.log(xstep, ystep);
    this.x = (this.x + xstep + p.width) % p.width;
    this.y = (this.y + ystep + p.height) % p.height;
  }

  draw(p: p5): void {
    p.stroke(255, 30);
    p.fill(255, 30);
    p.circle(this.x, this.y, this.size);
  }

  destroy(): void {
    this.sketch.unregisterEntity(this);
  }
}
