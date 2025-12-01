# Nature of Code Sketch Gallery

A p5.js sketch gallery showcasing my work as I progress through [The Nature of Code](https://natureofcode.com/) by Daniel Shiffman.

This project is part of a series of workshops and events at [TIAT](https://www.tiat.place/) in San Francisco.

## About The Nature of Code

The Nature of Code explores how to simulate natural systems using code. Topics include:

- Vectors and forces
- Oscillation and waves
- Particle systems
- Physics engines
- Autonomous agents
- Cellular automata
- Fractals
- Neural networks and genetic algorithms

Sketches in this gallery include exercises and examples from the book, as well as my own experiments and creative explorations.

## Running Locally

This project uses [mise](https://mise.jdx.dev/) to manage tools and tasks.

```bash
# Install tools (bun, watchexec)
mise install

# Start the dev server (with auto-registry regeneration)
mise run dev
```

Then visit [http://localhost:3000](http://localhost:3000) to browse the sketch gallery.

### Available Tasks

| Task                | Description                                       |
| ------------------- | ------------------------------------------------- |
| `mise run dev`      | Start dev server with automatic registry watching |
| `mise run registry` | Regenerate the sketch registry                    |

## Tech Stack

- **[mise](https://mise.jdx.dev/)** - Tool and task manager
- **[Bun](https://bun.sh)** - JavaScript runtime and bundler
- **[p5.js](https://p5js.org)** - Creative coding library
- **TypeScript** - Type safety
