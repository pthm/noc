import type p5 from "p5";
import { EntitySketch } from "../../lib/entity-sketch";
import { MovingAttractor } from "./MovingAttractor";
import { AttractedObject } from "./AttractedObject";

export class AttractionSketch extends EntitySketch {
  constructor(p: p5) {
    super(p);
  }

  setup(): void {
    const p = this.p;
    p.createCanvas(window.innerWidth, window.innerHeight);

    const attractor = new MovingAttractor(p, p.width / 2, p.height / 2, 20);
    this.add(attractor);

    for (let x = 0; x < 20; x++) {
      this.add(
        new AttractedObject(
          p,
          p.random(0, p.width),
          p.random(0, p.height),
          p.random(5, 20),
          attractor,
        ),
      );
    }
    
    
  }

  protected override preDraw(): void {
    this.p.background(30);
  }

  protected override windowResized(): void {
    this.p.resizeCanvas(window.innerWidth, window.innerHeight);
  }
}
