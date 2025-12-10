import p5 from "p5";
import { Entity } from "../../lib/entity-sketch";

export class MovingAttractor extends Entity {
  private pos: p5.Vector;
  private dir: p5.Vector;
  private vel: p5.Vector;

  private acceleration: p5.Vector;

  private topSpeed = 10;

  private radius: number;

  private originalY: number;

  private sinAmp: number = 40;

  constructor(
    private p: p5,
    x: number,
    y: number,
    radius = 50,
  ) {
    super();

    this.radius = radius;

    this.originalY = y;

    this.pos = p.createVector(x, y);
    this.dir = p.createVector(0, 0);
    this.vel = p.createVector(-15, 0);
  }

  update(p: p5): void {
    let target = p.createVector(p.width, this.pos.y);
    if (this.pos.x > p.width / 2) {
      target = p.createVector(0, this.pos.y);
    }

    const scaledDirection = p5.Vector.sub(target, this.pos)
      .normalize()
      .mult(0.2);

    this.acceleration = scaledDirection;

    this.vel.add(this.acceleration).limit(this.topSpeed);
    this.pos.add(this.vel);

    this.pos.y = this.originalY + p.sin(p.frameCount * 0.02) * this.sinAmp;
  }

  getPosition(): p5.Vector {
    return this.pos.copy();
  }

  draw(p: p5): void {
    p.fill(255);
    p.noStroke();
    p.circle(this.pos.x, this.pos.y, this.radius * 2);
  }
}
