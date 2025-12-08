import type p5 from "p5";
import { defineSketch } from "../types";
import { PerlinWavesSketch } from "./PerlinWavesSketch";

export default defineSketch(
  {
    title: "Perlin Waves",
    description: "TODO: Add description",
    date: "2025-12-08",
  },
  (p: p5) => {
    const sketch = new PerlinWavesSketch();
    sketch.attach(p);
  }
);
