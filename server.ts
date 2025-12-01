import { discoverSketches } from "./lib/sketches";
import indexPage from "./pages/index.html";
import sketchPage from "./pages/sketch.html";

Bun.serve({
  port: 3000,
  routes: {
    // Index page - list all sketches
    "/": indexPage,

    // Sketch viewer - all sketches use the same page
    "/sketch/:slug": sketchPage,

    // API to get sketch metadata
    "/api/sketches": async () => {
      const sketches = await discoverSketches();
      return Response.json(sketches);
    },
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log("Server running at http://localhost:3000");
