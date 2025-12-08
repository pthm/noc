// AUTO-GENERATED - Do not edit manually
// Run: bun run lib/generate-registry.ts

import type { SketchSetup } from "../sketches/types";

import waves from "../sketches/waves";
import circle from "../sketches/circle";
import walker from "../sketches/walker/index";
import bouncing_balls from "../sketches/bouncing-balls/index";
import perlin_noise from "../sketches/perlin-noise/index";
import perlin_waves from "../sketches/perlin-waves/index";
import camera_walker from "../sketches/camera-walker/index";

export const sketches: Record<string, SketchSetup> = {
  "waves": waves,
  "circle": circle,
  "walker": walker,
  "bouncing-balls": bouncing_balls,
  "perlin-noise": perlin_noise,
  "perlin-waves": perlin_waves,
  "camera-walker": camera_walker,
};
