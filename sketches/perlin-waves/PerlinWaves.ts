import type p5 from "p5";
import { Entity } from "../../lib/entity-sketch";

export class PerlinWaves extends Entity {
  private amp: number;
  private y: number;

  private timeOffset: number;
  private incr: number;
  private speed: number;

  constructor(
    private p: p5,
    amp: number,
    y: number,
    offset: number,
  ) {
    super();
    this.amp = amp;
    this.y = y - amp / 2;

    this.timeOffset = offset;
    this.incr = 0.01; // spatial frequency - noise change per pixel
    this.speed = 1; // how fast we move through noise space (units per second)
  }

  override setup(p: p5): void {
    //this.timeOffset = p.random(0, 10000);
  }

  update(p: p5): void {
    // Move through noise space at a consistent rate regardless of frame rate
    const deltaSeconds = p.deltaTime / 1000;
    this.timeOffset += this.speed * deltaSeconds;
  }

  draw(p: p5): void {
    p.beginShape();
    p.noFill();
    p.stroke(255);

    for (let x = 0; x < p.width; x++) {
      const xoff = x * this.incr + this.timeOffset;
      const y = this.y + p.noise(xoff) * this.amp;
      p.vertex(x, y);
    }

    p.endShape();
  }
}
