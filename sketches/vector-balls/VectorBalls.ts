import p5 from "p5";
import { Entity } from "../../lib/entity-sketch";

export class VectorBalls extends Entity {
  private pos: p5.Vector;
  private vel: p5.Vector;
  private radius: number;
  private noiseOffset: number;
  private trail: p5.Vector[] = [];

  constructor(
    private p: p5,
    x: number,
    y: number,
    radius = 50,
  ) {
    super();
    this.pos = p.createVector(x, y);
    this.vel = p.createVector(0, 0);
    this.radius = radius;
    this.noiseOffset = p.random(1000);
  }

  update(p: p5): void {
    const mouseVector = p.createVector(p.mouseX, p.mouseY);
    const delta = p5.Vector.sub(mouseVector, this.pos);
    const distance = delta.mag();
    const speed = p.map(this.radius, 0, 50, 6, 0.5);

    if (distance <= speed) {
      this.remove();
      return;
    }

    // Get angle to mouse, then add noise-based wobble
    const baseAngle = delta.heading();
    const wobble = p.map(p.noise(this.noiseOffset), 0, 1, -1, 1);
    const angle = baseAngle + wobble;

    this.noiseOffset += 0.02;

    this.vel = p5.Vector.fromAngle(angle).mult(speed);
    this.trail.push(this.pos.copy());
    this.pos.add(this.vel);
  }

  draw(p: p5): void {
    // Draw trail
    p.noFill();
    p.stroke(255);
    p.beginShape();
    for (const point of this.trail) {
      p.vertex(point.x, point.y);
    }
    p.vertex(this.pos.x, this.pos.y);
    p.endShape();

    // Draw ball
    p.fill(255, 50);
    p.noStroke();
    p.circle(this.pos.x, this.pos.y, this.radius * 2);
  }
}
