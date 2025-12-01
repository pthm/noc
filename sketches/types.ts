import type p5 from "p5";

export type Sketch = (p: p5) => void;

export type SketchMeta = {
  title: string;
  description: string;
  date?: string;
};

export type SketchSetup = {
  meta: SketchMeta;
  sketch: Sketch;
};

// Helper to create a sketch with good ergonomics
export function defineSketch(meta: SketchMeta, sketch: Sketch): SketchSetup {
  return { meta, sketch };
}
