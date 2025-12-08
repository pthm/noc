import type p5 from "p5";
import type { Entity } from "./Entity";

export abstract class EntitySketch {
  protected p!: p5;
  private entities = new Set<Entity>();

  /**
   * Attach this sketch to a p5 instance, wiring up lifecycle methods.
   * Call this from your p5 constructor callback.
   */
  attach(p: p5): void {
    this.p = p;

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
   * Register an entity to participate in the update/draw loop.
   * Typically called from the entity's constructor.
   * If the entity has a setup method, it will be called immediately.
   */
  registerEntity(entity: Entity): void {
    this.entities.add(entity);
    entity.setup?.(this.p);
  }

  /**
   * Remove an entity from the update/draw loop.
   * Call this from an entity's destroy() method.
   */
  unregisterEntity(entity: Entity): void {
    this.entities.delete(entity);
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
