import type p5 from "p5";
import { defineSketch } from "../types";
import { BouncingBallSketch } from "./BouncingBallSketch";

export default defineSketch(
  {
    title: "Bouncing Balls",
    description: "Click to spawn bouncing balls - demonstrates EntitySketch architecture",
    date: "2025-12-07",
  },
  (p: p5) => {
    const sketch = new BouncingBallSketch();
    sketch.attach(p);
  }
);
