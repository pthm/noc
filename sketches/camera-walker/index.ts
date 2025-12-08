import type p5 from "p5";
import { defineSketch } from "../types";
import { WalkerSketch } from "./WalkerSketch";

export default defineSketch(
  {
    title: "Camera Walker",
    description: "A random walker based on values from the system camera",
    date: "2025-12-07",
  },
  (p: p5) => {
    const sketch = new WalkerSketch();
    sketch.attach(p);
  },
);
