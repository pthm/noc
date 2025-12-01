import { Glob } from "bun";
import path from "path";
import type { SketchMeta, SketchSetup } from "../sketches/types";

export type SketchInfo = {
  slug: string;
  meta: SketchMeta;
};

const SKETCHES_DIR = path.join(import.meta.dir, "../sketches");

export async function discoverSketches(): Promise<SketchInfo[]> {
  const sketches: SketchInfo[] = [];

  // Find all potential sketch files/folders
  // Pattern 1: sketches/*.ts (single file sketches, excluding types.ts and index.ts)
  // Pattern 2: sketches/*/index.ts (folder-based sketches)
  const glob = new Glob("**/*.ts");

  for await (const file of glob.scan(SKETCHES_DIR)) {
    // Skip utility files
    if (file === "types.ts" || file === "index.ts") continue;

    const filePath = path.join(SKETCHES_DIR, file);

    try {
      const mod = await import(filePath);
      const sketch: SketchSetup = mod.default;

      if (!sketch?.meta || !sketch?.sketch) {
        console.warn(
          `Skipping ${file}: missing default export with meta/sketch`,
        );
        continue;
      }

      // Derive slug from filename or folder name
      let slug: string;
      if (file.endsWith("/index.ts")) {
        // Folder-based: use folder name
        slug = path.dirname(file);
      } else {
        // Single file: use filename without extension
        slug = path.basename(file, ".ts");
      }

      sketches.push({
        slug,
        meta: sketch.meta,
      });
    } catch (e) {
      console.error(`Error loading sketch ${file}:`, e);
    }
  }

  // Sort by date (newest first) or title
  sketches.sort((a, b) => {
    if (a.meta.date && b.meta.date) {
      return b.meta.date.localeCompare(a.meta.date);
    }
    return a.meta.title.localeCompare(b.meta.title);
  });

  return sketches;
}

export async function getSketchPath(slug: string): Promise<string | null> {
  // Try single file first
  const singleFile = path.join(SKETCHES_DIR, `${slug}.ts`);
  if (await Bun.file(singleFile).exists()) {
    return singleFile;
  }

  // Try folder-based
  const folderIndex = path.join(SKETCHES_DIR, slug, "index.ts");
  if (await Bun.file(folderIndex).exists()) {
    return folderIndex;
  }

  return null;
}
