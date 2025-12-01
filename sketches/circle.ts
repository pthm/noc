import type p5 from "p5";
import { defineSketch } from "./types";

export default defineSketch(
  {
    title: "Pulsing Circle",
    description: "A simple circle that pulses using a sine wave",
    date: "2025-11-30",
  },
  (p: p5) => {
    p.setup = () => {
      p.background(220);
    };

    p.draw = () => {
      p.translate(p.width / 2, p.height / 2);
      p.circle(0, 0, Math.sin(p.frameCount * 0.1) * 500);
      p.translate(
        -p.width / 2 + Math.sin(p.frameCount * 0.1) * 100,
        -p.height / 2,
      );
    };
  },
);
