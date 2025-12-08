import p5 from "p5";
import { EntitySketch } from "../../lib/entity-sketch";
import { Walker } from "./Walker";

export class WalkerSketch extends EntitySketch {
  private capture!: p5.Element;
  private captureBuffer!: p5.Graphics;
  private drawingLayer!: p5.Graphics;
  private captureWidth!: number;
  private captureHeight!: number;

  setup(): void {
    const p = this.p;
    p.createCanvas(window.innerWidth, window.innerHeight);
    p.frameRate(24);

    this.captureWidth = 160;
    this.captureHeight = Math.floor(this.captureWidth * (p.height / p.width));
    this.capture = p.createCapture(p.VIDEO);
    this.capture.size(this.captureWidth, this.captureHeight);
    this.capture.hide();

    this.captureBuffer = p.createGraphics(
      this.captureWidth,
      this.captureHeight,
    );
    this.drawingLayer = p.createGraphics(p.width, p.height);
    this.drawingLayer.clear();

    new Walker(this, p.width / 2, p.height / 2);
  }

  get graphics(): p5.Graphics {
    return this.drawingLayer;
  }

  /**
   * Get brightness (0-255) at a canvas position from the video feed.
   * Uses the low-res capture, mapping canvas coords to capture coords.
   */
  getBrightnessAt(canvasX: number, canvasY: number): number {
    const p = this.p;
    const video = this.capture.elt as HTMLVideoElement;
    if (!video.videoWidth) return 128;

    const captureX = Math.floor((canvasX / p.width) * this.captureWidth);
    const captureY = Math.floor((canvasY / p.height) * this.captureHeight);

    this.captureBuffer.loadPixels();
    const pixels = this.captureBuffer.pixels;
    const index = (captureY * this.captureWidth + captureX) * 4;

    const r = pixels[index] ?? 128;
    const g = pixels[index + 1] ?? 128;
    const b = pixels[index + 2] ?? 128;

    return (r + g + b) / 3;
  }

  protected override preDraw(): void {
    const p = this.p;
    // Update capture buffer for pixel reading
    this.captureBuffer.image(this.capture, 0, 0);

    p.push();
    p.tint(255);
    p.image(this.capture, 0, 0, p.width, p.height);
    p.filter(p.GRAY);
    p.pop();
  }

  protected override postDraw(): void {
    this.p.image(this.drawingLayer, 0, 0);
  }

  protected override windowResized(): void {
    const p = this.p;
    p.resizeCanvas(window.innerWidth, window.innerHeight);
    this.capture.size(p.width, p.height);

    const oldLayer = this.drawingLayer;
    this.drawingLayer = p.createGraphics(p.width, p.height);
    this.drawingLayer.image(oldLayer, 0, 0);
    oldLayer.remove();
  }
}
