import type p5 from "p5";
import { defineSketch } from "../types";
import { PerlinNoiseSketch } from "./PerlinNoiseSketch";

export default defineSketch(
  {
    title: "Perlin Noise",
    description:
      "A visual atlas of controlled randomness—24 tiles reveal how Perlin noise transforms from silk-smooth gradients to turbulent static",
    date: "2025-12-08",
  },
  (p: p5) => {
    new PerlinNoiseSketch(p);
  },
);
