import { Glob } from "bun";
import path from "path";
import type { SketchMeta } from "../sketches/types";

export type SketchInfo = {
  slug: string;
  meta: SketchMeta;
};

const SKETCHES_DIR = path.join(import.meta.dir, "../sketches");

// Extract metadata from source without executing (avoids p5 import issues in Node)
function extractMeta(source: string): SketchMeta | null {
  // Match defineSketch({ title: "...", ... }, ...)
  const match = source.match(/defineSketch\s*\(\s*(\{[\s\S]*?\})\s*,/);
  if (!match) return null;

  try {
    // Simple extraction - handles basic object literals
    const metaStr = match[1];
    const title = metaStr.match(/title:\s*["'`]([^"'`]+)["'`]/)?.[1];
    const description = metaStr.match(/description:\s*["'`]([^"'`]+)["'`]/)?.[1];
    const date = metaStr.match(/date:\s*["'`]([^"'`]+)["'`]/)?.[1];

    if (!title) return null;
    return { title, description, date };
  } catch {
    return null;
  }
}

export async function discoverSketches(): Promise<SketchInfo[]> {
  const sketches: SketchInfo[] = [];

  // Find all potential sketch files/folders
  // Pattern 1: sketches/*.ts (single file sketches, excluding types.ts and index.ts)
  // Pattern 2: sketches/*/index.ts (folder-based sketches)
  const glob = new Glob("**/*.ts");

  for await (const file of glob.scan(SKETCHES_DIR)) {
    // Skip utility files
    if (file === "types.ts" || file === "index.ts") continue;

    // Only include top-level .ts files or folder/index.ts files
    const isTopLevel = !file.includes("/");
    const isFolderIndex = file.endsWith("/index.ts");
    if (!isTopLevel && !isFolderIndex) continue;

    const filePath = path.join(SKETCHES_DIR, file);

    try {
      const source = await Bun.file(filePath).text();
      const meta = extractMeta(source);

      if (!meta) {
        console.warn(`Skipping ${file}: couldn't extract meta`);
        continue;
      }

      // Derive slug from filename or folder name
      let slug: string;
      if (file.endsWith("/index.ts")) {
        slug = path.dirname(file);
      } else {
        slug = path.basename(file, ".ts");
      }

      sketches.push({ slug, meta });
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
