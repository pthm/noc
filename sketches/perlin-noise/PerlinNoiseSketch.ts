import { EntitySketch } from "../../lib/entity-sketch";
import { PerlinNoise } from "./PerlinNoise";

export class PerlinNoiseSketch extends EntitySketch {
  setup(): void {
    const p = this.p;
    p.createCanvas(window.innerWidth, window.innerHeight);
    p.pixelDensity(1);

    const frameWidth = p.width / 6;
    const frameHeight = p.height / 4;

    let count = 0;
    for (let x = 0; x < p.width / frameWidth; x++) {
      for (let y = 0; y < p.height / frameHeight; y++) {
        new PerlinNoise(
          this,
          frameWidth,
          frameHeight,
          frameWidth * x,
          frameHeight * y,
          0.000001 * 10 ** count,
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
