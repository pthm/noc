import type p5 from "p5";

export interface Entity {
  setup?(p: p5): void;
  update(p: p5): void;
  draw(p: p5): void;
}
