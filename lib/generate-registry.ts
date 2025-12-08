// Run this script to regenerate the sketch registry after adding new sketches
// Usage: bun run lib/generate-registry.ts

import { Glob } from "bun";
import path from "path";

const SKETCHES_DIR = path.join(import.meta.dir, "../sketches");
const OUTPUT_FILE = path.join(import.meta.dir, "../pages/sketch-registry.ts");

async function generateRegistry() {
  const imports: string[] = [];
  const entries: string[] = [];

  const glob = new Glob("**/*.ts");

  for await (const file of glob.scan(SKETCHES_DIR)) {
    // Skip utility files
    if (file === "types.ts" || file === "index.ts") continue;

    // Only include top-level .ts files or folder/index.ts files
    // Skip non-index files inside folders (like entity classes)
    const isTopLevel = !file.includes("/");
    const isFolderIndex = file.endsWith("/index.ts");
    if (!isTopLevel && !isFolderIndex) continue;

    // Derive slug
    let slug: string;
    if (file.endsWith("/index.ts")) {
      slug = path.dirname(file);
    } else {
      slug = path.basename(file, ".ts");
    }

    // Create safe variable name
    const varName = slug.replace(/[^a-zA-Z0-9]/g, "_");

    imports.push(`import ${varName} from "../sketches/${file.replace(".ts", "")}";`);
    entries.push(`  "${slug}": ${varName},`);
  }

  const content = `// AUTO-GENERATED - Do not edit manually
// Run: bun run lib/generate-registry.ts

import type { SketchSetup } from "../sketches/types";

${imports.join("\n")}

export const sketches: Record<string, SketchSetup> = {
${entries.join("\n")}
};
`;

  await Bun.write(OUTPUT_FILE, content);
  console.log(`Generated registry with ${entries.length} sketch(es)`);
}

generateRegistry();
