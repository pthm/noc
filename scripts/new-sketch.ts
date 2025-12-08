import { mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const sketchName = process.argv[2];

if (!sketchName) {
  console.error("Usage: mise new-sketch <Sketch Name>");
  console.error('Example: mise new-sketch "My Awesome Sketch"');
  process.exit(1);
}

// Convert "My Sketch Name" to "my-sketch-name" for folder
const kebabCase = sketchName
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

// Convert "My Sketch Name" to "MySketchName" for class
const pascalCase = sketchName
  .split(/[^a-zA-Z0-9]+/)
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  .join("");

const sketchDir = path.join(process.cwd(), "sketches", kebabCase);

if (existsSync(sketchDir)) {
  console.error(`Error: Sketch directory already exists: ${sketchDir}`);
  process.exit(1);
}

const today = new Date().toISOString().split("T")[0];

const className = pascalCase.endsWith("Sketch")
  ? pascalCase
  : `${pascalCase}Sketch`;

const indexTs = `import type p5 from "p5";
import { defineSketch } from "../types";
import { ${className} } from "./${className}";

export default defineSketch(
  {
    title: "${sketchName}",
    description: "TODO: Add description",
    date: "${today}",
  },
  (p: p5) => {
    new ${className}(p);
  }
);
`;

// Entity name from sketch name (e.g., "My Awesome Sketch" -> "MyAwesome")
const entityName = pascalCase.replace(/Sketch$/, "") || "Circle";

const sketchTs = `import type p5 from "p5";
import { EntitySketch } from "../../lib/entity-sketch";
import { ${entityName} } from "./${entityName}";

export class ${className} extends EntitySketch {
  constructor(p: p5) {
    super(p);
  }

  setup(): void {
    const p = this.p;
    p.createCanvas(window.innerWidth, window.innerHeight);

    this.add(new ${entityName}(p, p.width / 2, p.height / 2));
  }

  protected override preDraw(): void {
    this.p.background(30);
  }

  protected override windowResized(): void {
    this.p.resizeCanvas(window.innerWidth, window.innerHeight);
  }
}
`;

const entityTs = `import type p5 from "p5";
import { Entity } from "../../lib/entity-sketch";

export class ${entityName} extends Entity {
  private x: number;
  private y: number;
  private radius: number;

  constructor(
    private p: p5,
    x: number,
    y: number,
    radius = 50
  ) {
    super();
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  update(p: p5): void {
    // TODO: Add update logic
  }

  draw(p: p5): void {
    p.fill(255);
    p.noStroke();
    p.circle(this.x, this.y, this.radius * 2);
  }
}
`;

await mkdir(sketchDir, { recursive: true });
await writeFile(path.join(sketchDir, "index.ts"), indexTs);
await writeFile(path.join(sketchDir, `${className}.ts`), sketchTs);
await writeFile(path.join(sketchDir, `${entityName}.ts`), entityTs);

console.log(`Created new sketch: ${sketchName}`);
console.log(`  Directory: sketches/${kebabCase}/`);
console.log(`  Files:`);
console.log(`    - index.ts`);
console.log(`    - ${className}.ts`);
console.log(`    - ${entityName}.ts`);
