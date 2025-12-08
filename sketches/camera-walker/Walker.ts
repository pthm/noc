import type p5 from "p5";
import type { Entity } from "../../lib/entity-sketch";
import type { WalkerSketch } from "./WalkerSketch";

export class Walker implements Entity {
  private x: number;
  private y: number;

  private size: number;

  constructor(
    private sketch: WalkerSketch,
    x: number,
    y: number,
  ) {
    this.x = x;
    this.y = y;
    this.size = 10;
    this.sketch.registerEntity(this);
  }

  // 8 directions: N, NE, E, SE, S, SW, W, NW
  private static readonly DIRECTIONS: [number, number][] = [
    [0, -1], // N
    [1, -1], // NE
    [1, 0], // E
    [1, 1], // SE
    [0, 1], // S
    [-1, 1], // SW
    [-1, 0], // W
    [-1, -1], // NW
  ];

  update(p: p5): void {
    // Get average brightness at current position
    const brightness = this.sketch.getBrightnessAt(this.x, this.y);

    // Map brightness (0-255) to direction index (0-7)
    const dirIndex = p.floor(p.map(brightness, 0, 255, 0, 8)) % 8;
    const [dx, dy] = Walker.DIRECTIONS[dirIndex];

    const xstep = dx * this.size;
    const ystep = dy * this.size;

    this.x = (this.x + xstep + p.width) % p.width;
    this.y = (this.y + ystep + p.height) % p.height;
  }

  draw(_p: p5): void {
    const g = this.sketch.graphics;
    g.stroke(255, 255);
    g.fill(255, 255);
    g.circle(this.x, this.y, this.size);
  }

  destroy(): void {
    this.sketch.unregisterEntity(this);
  }
}
