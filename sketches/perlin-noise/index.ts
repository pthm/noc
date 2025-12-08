import type p5 from "p5";
import { defineSketch } from "../types";
import { PerlinNoiseSketch } from "./PerlinNoiseSketch";

export default defineSketch(
  {
    title: "Perlin Noise",
    description: "TODO: Add description",
    date: "2025-12-08",
  },
  (p: p5) => {
    const sketch = new PerlinNoiseSketch();
    sketch.attach(p);
  }
);
