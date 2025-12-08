import type p5 from "p5";
import { EntitySketch } from "../../lib/entity-sketch";
import { PerlinNoise } from "./PerlinNoise";

export class PerlinNoiseSketch extends EntitySketch {
  constructor(p: p5) {
    super(p);
  }

  setup(): void {
    const p = this.p;
    p.createCanvas(window.innerWidth, window.innerHeight);
    p.pixelDensity(1);

    const frameWidth = p.width / 6;
    const frameHeight = p.height / 4;

    let count = 0;
    for (let x = 0; x < p.width / frameWidth; x++) {
      for (let y = 0; y < p.height / frameHeight; y++) {
        this.add(
          new PerlinNoise(
            p,
            frameWidth,
            frameHeight,
            frameWidth * x,
            frameHeight * y,
            0.002 * 2 ** count,
          ),
        );
        count++;
      }
    }
  }

  protected override preDraw(): void {
    this.p.background(30);
  }

  protected override windowResized(): void {
    this.p.resizeCanvas(window.innerWidth, window.innerHeight);
  }
}
