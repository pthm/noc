import type p5 from "p5";
import { defineSketch } from "../types";
import { WalkerSketch } from "./WalkerSketch";

export default defineSketch(
  {
    title: "Walker",
    description:
      "A wandering spirit traces an unpredictable path through the void, each step a roll of the cosmic dice",
    date: "2025-12-02",
  },
  (p: p5) => {
    new WalkerSketch(p);
  },
);
