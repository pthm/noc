import type p5 from "p5";
import { defineSketch } from "../types";
import { BouncingBallSketch } from "./BouncingBallSketch";

export default defineSketch(
  {
    title: "Bouncing Balls",
    description:
      "Colorful spheres ricochet through space, pulled by invisible gravity. Click anywhere to birth new chaos into the system",
    date: "2025-12-07",
  },
  (p: p5) => {
    new BouncingBallSketch(p);
  },
);
