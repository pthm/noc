import type p5 from "p5";
import type { Entity, EntitySketch } from "../../lib/entity-sketch";

export class BouncingBall implements Entity {
  private x: number;
  private y: number;
  private vx: number;
  private vy: number;
  private radius: number;
  private color: { r: number; g: number; b: number };

  constructor(
    private sketch: EntitySketch,
    x: number,
    y: number,
    radius = 20
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;

    // Random initial velocity
    this.vx = (Math.random() - 0.5) * 10;
    this.vy = (Math.random() - 0.5) * 10;

    // Random color
    this.color = {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
    };

    // Self-register with the sketch
    this.sketch.registerEntity(this);
  }

  update(p: p5): void {
    // Apply simple gravity
    this.vy += 0.2;

    // Update position
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off walls
    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.vx *= -0.9;
    } else if (this.x + this.radius > p.width) {
      this.x = p.width - this.radius;
      this.vx *= -0.9;
    }

    // Bounce off floor/ceiling
    if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.vy *= -0.9;
    } else if (this.y + this.radius > p.height) {
      this.y = p.height - this.radius;
      this.vy *= -0.9;
    }
  }

  draw(p: p5): void {
    p.fill(this.color.r, this.color.g, this.color.b, 200);
    p.noStroke();
    p.circle(this.x, this.y, this.radius * 2);
  }

  destroy(): void {
    this.sketch.unregisterEntity(this);
  }
}
