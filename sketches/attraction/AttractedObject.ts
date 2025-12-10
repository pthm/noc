import p5 from "p5";
import { Entity } from "../../lib/entity-sketch";
import { MovingAttractor } from "./MovingAttractor";

export class AttractedObject extends Entity {
  private pos: p5.Vector;
  private dir: p5.Vector;
  private vel: p5.Vector;

  private acceleration: p5.Vector;
  private topSpeed = 10;

  private radius: number;
  private trail: p5.Vector[] = [];
  private target: MovingAttractor;
  private col: p5.Color;

  constructor(
    private p: p5,
    x: number,
    y: number,
    radius = 50,
    target: MovingAttractor,
  ) {
    super();

    this.radius = radius;

    this.topSpeed = p.map(radius, 5, 20, 10, 5);

    this.target = target;

    this.col = p.color(p.map(radius, 5, 20, 10, 255), 120, 120);

    this.pos = p.createVector(x, y);
    this.dir = p.createVector(0, 0);
    this.vel = p.createVector(0, 0);
  }

  update(p: p5): void {
    const targetPos = this.target.getPosition();

    const scaledDirection = p5.Vector.sub(targetPos, this.pos)
      .normalize()
      .mult(0.2);

    this.acceleration = scaledDirection;

    this.vel.add(this.acceleration).limit(this.topSpeed);
    this.pos.add(this.vel);
    this.trail.push(this.pos.copy());
    if (this.trail.length > 1000) {
      this.trail.shift();
    }
  }

  draw(p: p5): void {
    p.fill(this.col);
    p.noStroke();
    p.circle(this.pos.x, this.pos.y, this.radius * 2);

    p.noFill();
    p.stroke(this.col);
    p.beginShape();
    for (const point of this.trail) {
      p.vertex(point.x, point.y);
    }
    p.vertex(this.pos.x, this.pos.y);
    p.endShape();
  }
}
