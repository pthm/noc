import type p5 from "p5";

export abstract class Entity {
  private _remove?: () => void;

  /** Remove this entity from the sketch */
  remove(): void {
    this._remove?.();
  }

  /** Called by EntitySketch.add() to wire up removal */
  _setRemove(fn: () => void): void {
    this._remove = fn;
  }

  setup?(p: p5): void;
  abstract update(p: p5): void;
  abstract draw(p: p5): void;
}
