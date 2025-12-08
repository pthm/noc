import type p5 from "p5";
import { defineSketch } from "../types";
import { WalkerSketch } from "./WalkerSketch";

export default defineSketch(
  {
    title: "Camera Walker",
    description:
      "Your camera becomes a compass—a luminous point navigates the grayscale terrain of your world, drawn toward light and shadow",
    date: "2025-12-07",
  },
  (p: p5) => {
    new WalkerSketch(p);
  },
);
