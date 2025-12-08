import type p5 from "p5";
import { EntitySketch } from "../../lib/entity-sketch";
import { VectorBalls } from "./VectorBalls";

export class VectorBallsSketch extends EntitySketch {
  constructor(p: p5) {
    super(p);
  }

  setup(): void {
    const p = this.p;
    p.createCanvas(window.innerWidth, window.innerHeight);
  }

  protected override preDraw(): void {
    this.p.background(30);
    if (this.p.frameCount % 10 == 0) {
      const ballCount = this.p.random(3, 10);
      for (let x = 0; x < ballCount; x++) {
        this.add(
          new VectorBalls(
            this.p,
            this.p.random(0, this.p.width),
            this.p.random(0, this.p.height),
            this.p.random(5, 30),
          ),
        );
      }
    }
  }

  protected override windowResized(): void {
    this.p.resizeCanvas(window.innerWidth, window.innerHeight);
  }
}
