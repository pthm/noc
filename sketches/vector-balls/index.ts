import type p5 from "p5";
import { defineSketch } from "../types";
import { VectorBallsSketch } from "./VectorBallsSketch";

export default defineSketch(
  {
    title: "Vector Balls",
    description: "Wobbly orbs chase your cursor like tipsy fireflies",
    date: "2025-12-09",
  },
  (p: p5) => {
    new VectorBallsSketch(p);
  },
);
