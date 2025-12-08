import type p5 from "p5";
import { Entity } from "./Entity";

export abstract class EntitySketch {
  protected p: p5;
  private entities = new Set<Entity>();

  constructor(p: p5) {
    this.p = p;
    this.attach();
  }

  /**
   * Wire up p5 lifecycle methods.
   */
  private attach(): void {
    const p = this.p;

    p.setup = () => this.setup();
    p.draw = () => this.drawInternal();

    // Wire optional event handlers
    p.mousePressed = () => this.mousePressed();
    p.mouseReleased = () => this.mouseReleased();
    p.mouseMoved = () => this.mouseMoved();
    p.mouseDragged = () => this.mouseDragged();
    p.keyPressed = () => this.keyPressed();
    p.keyReleased = () => this.keyReleased();
    p.windowResized = () => this.windowResized();
  }

  /**
   * Called once at the start. Subclasses should create their canvas
   * and instantiate initial entities here.
   */
  abstract setup(): void;

  /**
   * Called before entities are updated/drawn each frame.
   * Override to clear background, set styles, etc.
   */
  protected preDraw(): void {}

  /**
   * Called after all entities are updated/drawn each frame.
   * Override for overlays, UI, debug info, etc.
   */
  protected postDraw(): void {}

  /**
   * Internal draw loop - calls preDraw, updates/draws entities, then postDraw.
   */
  private drawInternal(): void {
    this.preDraw();

    for (const entity of this.entities) {
      entity.update(this.p);
    }

    for (const entity of this.entities) {
      entity.draw(this.p);
    }

    this.postDraw();
  }

  /**
   * Add an entity to the update/draw loop.
   * Returns the entity for chaining.
   */
  add<T extends Entity>(entity: T): T {
    this.entities.add(entity);
    entity._setRemove(() => this.entities.delete(entity));
    entity.setup?.(this.p);
    return entity;
  }

  /**
   * Get the current number of registered entities.
   */
  get entityCount(): number {
    return this.entities.size;
  }

  // Optional event handlers - override in subclasses as needed
  protected mousePressed(): void {}
  protected mouseReleased(): void {}
  protected mouseMoved(): void {}
  protected mouseDragged(): void {}
  protected keyPressed(): void {}
  protected keyReleased(): void {}
  protected windowResized(): void {}
}
