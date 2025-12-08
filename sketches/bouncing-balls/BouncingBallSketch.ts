import { EntitySketch } from "../../lib/entity-sketch";
import { BouncingBall } from "./BouncingBall";

export class BouncingBallSketch extends EntitySketch {
  setup(): void {
    const p = this.p;
    p.createCanvas(window.innerWidth, window.innerHeight);

    // Create initial balls - they self-register
    for (let i = 0; i < 5; i++) {
      new BouncingBall(
        this,
        Math.random() * p.width,
        Math.random() * p.height * 0.5,
        20 + Math.random() * 30
      );
    }
  }

  protected override preDraw(): void {
    this.p.background(30);
  }

  protected override mousePressed(): void {
    // Spawn a new ball at mouse position
    new BouncingBall(this, this.p.mouseX, this.p.mouseY);
  }

  protected override windowResized(): void {
    this.p.resizeCanvas(window.innerWidth, window.innerHeight);
  }
}
