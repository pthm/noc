import type p5 from "p5";
import { defineSketch } from "../types";
import { PerlinWavesSketch } from "./PerlinWavesSketch";

export default defineSketch(
  {
    title: "Perlin Waves",
    description:
      "Forty organic waveforms flow and interweave like ribbons in wind, their motion governed by the natural mathematics of Perlin noise",
    date: "2025-12-08",
  },
  (p: p5) => {
    new PerlinWavesSketch(p);
  },
);
