import type p5 from "p5";
import { EntitySketch } from "../../lib/entity-sketch";
import { BouncingBall } from "./BouncingBall";

export class BouncingBallSketch extends EntitySketch {
  constructor(p: p5) {
    super(p);
  }

  setup(): void {
    const p = this.p;
    p.createCanvas(window.innerWidth, window.innerHeight);

    for (let i = 0; i < 5; i++) {
      this.add(
        new BouncingBall(
          p,
          p.random(p.width),
          p.random(p.height * 0.5),
          20 + p.random(30),
        ),
      );
    }
  }

  protected override preDraw(): void {
    this.p.background(30);
  }

  protected override mousePressed(): void {
    this.add(new BouncingBall(this.p, this.p.mouseX, this.p.mouseY));
  }

  protected override windowResized(): void {
    this.p.resizeCanvas(window.innerWidth, window.innerHeight);
  }
}
