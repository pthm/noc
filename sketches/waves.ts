import type p5 from "p5";
import { defineSketch } from "./types";

export default defineSketch(
  {
    title: "Waves",
    description: "One hundred luminous waves cascade across darkness, their sinusoidal pulses creating an endless ocean of light in perpetual motion",
    date: "2025-11-30",
  },
  (p: p5) => {
    const numLines = 100;
    const amplitude = 20;
    const frequency = 0.05;

    p.setup = () => {
      p.background(20);
    };

    p.draw = () => {
      p.background(20);
      p.stroke(255);
      p.strokeWeight(1);
      p.noFill();

      const lineSpacing = p.height / (numLines + 1);

      for (let lineIdx = 0; lineIdx < numLines; lineIdx++) {
        const baseY = lineSpacing * (lineIdx + 1);

        p.beginShape();
        for (let x = 0; x < p.width; x++) {
          const y =
            baseY +
            Math.sin(x * frequency + p.frameCount * 0.05 + lineIdx * 0.5) *
              amplitude;
          p.vertex(x, y);
        }
        p.endShape();
      }
    };
  },
);
