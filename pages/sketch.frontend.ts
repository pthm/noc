import p5 from "p5";
import { sketches } from "./sketch-registry";

function loadSketch() {
  // Get slug from URL path: /sketch/:slug
  const slug = window.location.pathname.split("/sketch/")[1];

  if (!slug) {
    showError("No sketch specified");
    return;
  }

  const sketch = sketches[slug];

  if (!sketch) {
    showError(`Sketch "${slug}" not found`);
    return;
  }

  // Update page title
  document.title = `${sketch.meta.title} - Nature of Code`;

  // Wrap the sketch to handle canvas creation and resizing
  const instance = new p5((p: p5) => {
    // Store original setup if defined
    sketch.sketch(p);
    const userSetup = p.setup;

    // Override setup to create fullscreen canvas first
    p.setup = () => {
      p.createCanvas(window.innerWidth, window.innerHeight);
      userSetup?.();
    };
  });

  // Handle window resize globally - all sketches auto-resize to fullscreen
  window.addEventListener("resize", () => {
    instance.resizeCanvas(window.innerWidth, window.innerHeight);
  });
}

function showError(message: string) {
  const div = document.createElement("div");
  div.className = "error";
  div.textContent = message;
  document.body.appendChild(div);
}

loadSketch();
