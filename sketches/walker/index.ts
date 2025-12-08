import type p5 from "p5";
import { defineSketch } from "../types";
import { WalkerSketch } from "./WalkerSketch";

export default defineSketch(
  {
    title: "Walker",
    description: "A random walker",
    date: "2025-12-02",
  },
  (p: p5) => {
    const sketch = new WalkerSketch();
    sketch.attach(p);
  }
);
