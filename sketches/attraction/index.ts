import type p5 from "p5";
import { defineSketch } from "../types";
import { AttractionSketch } from "./AttractionSketch";

export default defineSketch(
  {
    title: "Attraction",
    description: "TODO: Add description",
    date: "2025-12-10",
  },
  (p: p5) => {
    new AttractionSketch(p);
  }
);
