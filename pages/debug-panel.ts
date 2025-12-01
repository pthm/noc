/**
 * Debug panel for displaying graphics performance metrics
 * - FPS (frames per second)
 * - Frame time (milliseconds) with min/max/avg
 * - Frame count
 * - Memory usage (Chrome only)
 * - Mouse position
 * - Canvas size / pixel density
 * - Rolling line chart of FPS/frame time
 */

interface DebugPanelOptions {
  historySeconds?: number;
}

interface P5Info {
  mouseX: number;
  mouseY: number;
  width: number;
  height: number;
  pixelDensity: number;
}

// Chrome-specific memory API
interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

declare global {
  interface Performance {
    memory?: PerformanceMemory;
  }
}

export class DebugPanel {
  private container: HTMLDivElement;
  private button: HTMLButtonElement;
  private panel: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private isVisible = false;
  private fpsHistory: number[] = [];
  private frameTimeHistory: number[] = [];
  private historyLength: number;

  private lastTime = performance.now();
  private frameCount = 0;
  private fps = 0;
  private frameTime = 0;
  private minFrameTime = Infinity;
  private maxFrameTime = 0;
  private frameTimeSum = 0;
  private frameTimeSamples = 0;

  private fpsEl: HTMLSpanElement;
  private frameTimeEl: HTMLSpanElement;
  private frameCountEl: HTMLSpanElement;
  private minFrameTimeEl: HTMLSpanElement;
  private maxFrameTimeEl: HTMLSpanElement;
  private avgFrameTimeEl: HTMLSpanElement;
  private memoryEl: HTMLSpanElement;
  private mouseEl: HTMLSpanElement;
  private canvasEl: HTMLSpanElement;

  constructor(options: DebugPanelOptions = {}) {
    const historySeconds = options.historySeconds ?? 10;
    const targetFps = 60;
    this.historyLength = historySeconds * targetFps;

    // Create container
    this.container = document.createElement("div");
    this.container.className = "debug-container";

    // Create toggle button
    this.button = document.createElement("button");
    this.button.className = "debug-toggle";
    this.button.textContent = "Debug";
    this.button.addEventListener("click", () => this.toggle());

    // Create panel
    this.panel = document.createElement("div");
    this.panel.className = "debug-panel";
    this.panel.style.display = "none";

    // Stats display
    const stats = document.createElement("div");
    stats.className = "debug-stats";

    const hasMemoryApi = !!performance.memory;

    stats.innerHTML = `
      <div class="debug-section-label">Performance</div>
      <div class="debug-stat">
        <span class="debug-label">FPS</span>
        <span class="debug-value" id="debug-fps">0</span>
      </div>
      <div class="debug-stat">
        <span class="debug-label">Frame Time</span>
        <span class="debug-value" id="debug-frame-time">0ms</span>
      </div>
      <div class="debug-stat">
        <span class="debug-label">Frame Count</span>
        <span class="debug-value" id="debug-frame-count">0</span>
      </div>
      <div class="debug-section-label">Frame Time Stats</div>
      <div class="debug-stat">
        <span class="debug-label">Min</span>
        <span class="debug-value" id="debug-min-frame-time">-</span>
      </div>
      <div class="debug-stat">
        <span class="debug-label">Max</span>
        <span class="debug-value" id="debug-max-frame-time">-</span>
      </div>
      <div class="debug-stat">
        <span class="debug-label">Avg</span>
        <span class="debug-value" id="debug-avg-frame-time">-</span>
      </div>
      ${
        hasMemoryApi
          ? `
      <div class="debug-section-label">Memory</div>
      <div class="debug-stat">
        <span class="debug-label">JS Heap</span>
        <span class="debug-value" id="debug-memory">-</span>
      </div>
      `
          : ""
      }
      <div class="debug-section-label">Input</div>
      <div class="debug-stat">
        <span class="debug-label">Mouse</span>
        <span class="debug-value" id="debug-mouse">0, 0</span>
      </div>
      <div class="debug-section-label">Canvas</div>
      <div class="debug-stat">
        <span class="debug-label">Size / Density</span>
        <span class="debug-value" id="debug-canvas">-</span>
      </div>
    `;

    // Chart canvas
    this.canvas = document.createElement("canvas");
    this.canvas.className = "debug-chart";
    this.canvas.width = 200;
    this.canvas.height = 80;
    this.ctx = this.canvas.getContext("2d")!;

    // Chart legend
    const legend = document.createElement("div");
    legend.className = "debug-legend";
    legend.innerHTML = `
      <span class="debug-legend-item"><span class="debug-legend-color debug-legend-color--fps"></span>FPS</span>
      <span class="debug-legend-item"><span class="debug-legend-color debug-legend-color--frame-time"></span>Frame Time</span>
    `;

    this.panel.appendChild(stats);
    this.panel.appendChild(this.canvas);
    this.panel.appendChild(legend);

    this.container.appendChild(this.button);
    this.container.appendChild(this.panel);

    document.body.appendChild(this.container);

    // Get references to value elements
    this.fpsEl = this.panel.querySelector("#debug-fps")!;
    this.frameTimeEl = this.panel.querySelector("#debug-frame-time")!;
    this.frameCountEl = this.panel.querySelector("#debug-frame-count")!;
    this.minFrameTimeEl = this.panel.querySelector("#debug-min-frame-time")!;
    this.maxFrameTimeEl = this.panel.querySelector("#debug-max-frame-time")!;
    this.avgFrameTimeEl = this.panel.querySelector("#debug-avg-frame-time")!;
    this.memoryEl = this.panel.querySelector("#debug-memory")!;
    this.mouseEl = this.panel.querySelector("#debug-mouse")!;
    this.canvasEl = this.panel.querySelector("#debug-canvas")!;
  }

  toggle() {
    this.isVisible = !this.isVisible;
    this.panel.style.display = this.isVisible ? "block" : "none";
    this.button.classList.toggle("active", this.isVisible);
  }

  /**
   * Call this every frame from the p5 draw loop
   * @param p5FrameCount - p5's frameCount value
   * @param p5DeltaTime - p5's deltaTime value (ms since last frame)
   * @param p5Info - Additional p5 instance info (mouse, canvas size, etc.)
   */
  update(p5FrameCount: number, p5DeltaTime: number, p5Info: P5Info) {
    this.frameCount = p5FrameCount;
    this.frameTime = p5DeltaTime;

    // Calculate FPS from delta time
    this.fps = p5DeltaTime > 0 ? 1000 / p5DeltaTime : 0;

    // Update min/max/avg frame time stats
    if (p5DeltaTime > 0) {
      this.minFrameTime = Math.min(this.minFrameTime, p5DeltaTime);
      this.maxFrameTime = Math.max(this.maxFrameTime, p5DeltaTime);
      this.frameTimeSum += p5DeltaTime;
      this.frameTimeSamples++;
    }

    // Update history
    this.fpsHistory.push(this.fps);
    this.frameTimeHistory.push(this.frameTime);

    // Trim to history length
    if (this.fpsHistory.length > this.historyLength) {
      this.fpsHistory.shift();
      this.frameTimeHistory.shift();
    }

    // Only update DOM if visible
    if (this.isVisible) {
      this.fpsEl.textContent = this.fps.toFixed(1);
      this.frameTimeEl.textContent = `${this.frameTime.toFixed(2)}ms`;
      this.frameCountEl.textContent = this.frameCount.toString();

      // Min/max/avg frame time
      this.minFrameTimeEl.textContent =
        this.minFrameTime === Infinity
          ? "-"
          : `${this.minFrameTime.toFixed(2)}ms`;
      this.maxFrameTimeEl.textContent =
        this.maxFrameTime === 0 ? "-" : `${this.maxFrameTime.toFixed(2)}ms`;
      const avgFrameTime =
        this.frameTimeSamples > 0
          ? this.frameTimeSum / this.frameTimeSamples
          : 0;
      this.avgFrameTimeEl.textContent =
        avgFrameTime > 0 ? `${avgFrameTime.toFixed(2)}ms` : "-";

      // Memory (Chrome only)
      if (this.memoryEl && performance.memory) {
        const usedMB = performance.memory.usedJSHeapSize / (1024 * 1024);
        const totalMB = performance.memory.totalJSHeapSize / (1024 * 1024);
        this.memoryEl.textContent = `${usedMB.toFixed(1)} / ${totalMB.toFixed(1)} MB`;
      }

      // Mouse position
      this.mouseEl.textContent = `${Math.round(p5Info.mouseX)}, ${Math.round(p5Info.mouseY)}`;

      // Canvas size and pixel density
      this.canvasEl.textContent = `${p5Info.width}×${p5Info.height} @${p5Info.pixelDensity}x`;

      this.drawChart();
    }
  }

  /**
   * Reset min/max/avg frame time statistics
   */
  resetStats() {
    this.minFrameTime = Infinity;
    this.maxFrameTime = 0;
    this.frameTimeSum = 0;
    this.frameTimeSamples = 0;
  }

  private drawChart() {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Clear
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (this.fpsHistory.length < 2) return;

    // Draw FPS line (scaled 0-120)
    this.drawLine(this.fpsHistory, "#4ecdc4", 0, 120);

    // Draw frame time line (scaled 0-50ms)
    this.drawLine(this.frameTimeHistory, "#ff6b6b", 0, 50);

    // Draw 60 FPS reference line
    const y60 = height - (60 / 120) * height;
    ctx.strokeStyle = "rgba(78, 205, 196, 0.3)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, y60);
    ctx.lineTo(width, y60);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw 16.67ms reference line (60fps frame time)
    const y16 = height - (16.67 / 50) * height;
    ctx.strokeStyle = "rgba(255, 107, 107, 0.3)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, y16);
    ctx.lineTo(width, y16);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  private drawLine(data: number[], color: string, min: number, max: number) {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const step = width / (this.historyLength - 1);

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    const startIdx = Math.max(0, this.historyLength - data.length);
    for (let i = 0; i < data.length; i++) {
      const x = (startIdx + i) * step;
      const normalized = Math.min(
        1,
        Math.max(0, (data[i] - min) / (max - min)),
      );
      const y = height - normalized * height;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
  }

  destroy() {
    this.container.remove();
  }
}
