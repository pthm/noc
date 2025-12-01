type SketchInfo = {
  slug: string;
  meta: {
    title: string;
    description: string;
    date?: string;
  };
};

async function loadSketches() {
  const container = document.getElementById("sketches")!;

  try {
    const response = await fetch("/api/sketches");
    const sketches: SketchInfo[] = await response.json();

    if (sketches.length === 0) {
      container.innerHTML = '<p class="empty">No sketches found</p>';
      return;
    }

    container.innerHTML = sketches
      .map(
        (sketch) => `
        <a href="/sketch/${sketch.slug}" class="sketch-card">
          <h2 class="sketch-title">${sketch.meta.title}</h2>
          <p class="sketch-description">${sketch.meta.description}</p>
          ${sketch.meta.date ? `<span class="sketch-date">${sketch.meta.date}</span>` : ""}
        </a>
      `
      )
      .join("");
  } catch (e) {
    container.innerHTML = '<p class="empty">Error loading sketches</p>';
    console.error(e);
  }
}

loadSketches();
