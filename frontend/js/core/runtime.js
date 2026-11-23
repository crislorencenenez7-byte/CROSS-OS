"use strict";

(() => {
  const PREFIX = "crossos.";

  /* EVENT BUS */
  class EventBus {
    constructor() {
      this.listeners = new Map();
    }

    on(name, callback) {
      if (!this.listeners.has(name)) {
        this.listeners.set(name, new Set());
      }

      this.listeners.get(name).add(callback);

      return () => this.off(name, callback);
    }

    off(name, callback) {
      this.listeners.get(name)?.delete(callback);
    }

    emit(name, detail = {}) {
      const callbacks = this.listeners.get(name);
      if (!callbacks) return;

      for (const callback of [...callbacks]) {
        try {
          callback(detail);
        } catch (error) {
          console.error("CROSS OS event error:", name, error);
        }
      }
    }
  }

  /* CENTRALIZED SANDBOX STORAGE */
  class StorageManager {
    get(key, fallback = null) {
      try {
        const value = localStorage.getItem(PREFIX + key);
        return value === null ? fallback : JSON.parse(value);
      } catch {
        return fallback;
      }
    }

    set(key, value) {
      try {
        localStorage.setItem(PREFIX + key, JSON.stringify(value));
        events.emit("storage:changed", { key });
        return true;
      } catch (error) {
        console.error("CROSS OS storage error:", error);
        events.emit("storage:error", { key, message: error.message });
        return false;
      }
    }

    remove(key) {
      try {
        localStorage.removeItem(PREFIX + key);
        events.emit("storage:removed", { key });
        return true;
      } catch {
        return false;
      }
    }

    has(key) {
      try {
        return localStorage.getItem(PREFIX + key) !== null;
      } catch {
        return false;
      }
    }

    keys() {
      const result = [];

      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith(PREFIX)) {
            result.push(key.slice(PREFIX.length));
          }
        }
      } catch {}

      return result;
    }

    usage() {
      let bytes = 0;

      try {
        for (const key of this.keys()) {
          const value = localStorage.getItem(PREFIX + key) || "";
          bytes += (PREFIX + key).length * 2 + value.length * 2;
        }
      } catch {}

      return {
        bytes,
        kilobytes: Math.round(bytes / 1024 * 100) / 100
      };
    }
  }

  const events = new EventBus();
  const storage = new StorageManager();

  /* APPLICATION MANAGER */
  class AppManager {
    constructor() {
      this.registry = new Map();
      this.api = null;
    }

    connect(api, definitions) {
      this.api = api;

      for (const [id, app] of Object.entries(definitions)) {
        this.registry.set(id, {
          id,
          name: app.name,
          icon: app.icon,
          render: app.render
        });
      }

      events.emit("apps:ready", { count: this.registry.size });
    }

    list() {
      return [...this.registry.values()].map(app => ({
        id: app.id,
        name: app.name,
        icon: app.icon
      }));
    }

    get(id) {
      const app = this.registry.get(id);
      if (!app) return null;

      return {
        id: app.id,
        name: app.name,
        icon: app.icon
      };
    }

    launch(id) {
      if (!this.registry.has(id) || !this.api) return false;

      this.api.open(id);
      events.emit("app:launched", { id });
      return true;
    }

    close(id) {
      if (!this.registry.has(id) || !this.api) return false;

      this.api.close(id);
      events.emit("app:closed", { id });
      return true;
    }
  }

  /* WINDOW MANAGER BRIDGE */
  class WindowManager {
    constructor() {
      this.api = null;
    }

    connect(api) {
      this.api = api;
    }

    open(id) {
      if (!this.api) return false;
      this.api.open(id);
      return true;
    }

    close(id) {
      if (!this.api) return false;
      this.api.close(id);
      return true;
    }

    minimize(id) {
      if (!this.api) return false;
      this.api.minimize(id);
      return true;
    }

    maximize(id) {
      if (!this.api) return false;
      this.api.maximize(id);
      return true;
    }

    list() {
      return [...document.querySelectorAll(".window")]
        .filter(win => !win.classList.contains("minimized"))
        .map(win => ({
          id: win.id.replace(/^window-/, ""),
          title: win.querySelector(".window-title")?.innerText || "",
          focused: win.classList.contains("focused"),
          maximized: win.classList.contains("maximized")
        }));
    }

    count() {
      return document.querySelectorAll(".window").length;
    }
  }

  /* THEME ENGINE */
  class ThemeEngine {
    applyAccent(color) {
      if (!/^#[0-9a-fA-F]{6}$/.test(color)) return false;

      document.documentElement.style.setProperty("--accent", color);
      storage.set("theme.accent", color);
      events.emit("theme:accent", { color });

      return true;
    }

    applyMode(mode) {
      if (!["dark", "light", "hybrid"].includes(mode)) return false;

      document.documentElement.dataset.theme = mode;
      storage.set("theme.mode", mode);
      events.emit("theme:mode", { mode });

      return true;
    }

    restore() {
      const accent = storage.get("theme.accent");
      const mode = storage.get("theme.mode");

      if (accent) this.applyAccent(accent);
      if (mode) this.applyMode(mode);
    }
  }

  /* BROWSER-AVAILABLE SYSTEM INFORMATION */
  class SystemMonitor {
    snapshot() {
      const memory = navigator.deviceMemory || null;
      const cores = navigator.hardwareConcurrency || null;
      const connection = navigator.connection || null;

      return {
        platform: "CROSS OS Browser Simulator",
        screen: {
          width: screen.width,
          height: screen.height,
          viewportWidth: innerWidth,
          viewportHeight: innerHeight,
          pixelRatio: devicePixelRatio || 1
        },
        browser: {
          language: navigator.language,
          online: navigator.onLine,
          cores,
          estimatedMemoryGB: memory
        },
        network: connection ? {
          type: connection.effectiveType || "unknown",
          saveData: !!connection.saveData
        } : null,
        windows: windowManager.count(),
        storage: storage.usage(),
        timestamp: Date.now()
      };
    }
  }

  const appManager = new AppManager();
  const windowManager = new WindowManager();
  const themeEngine = new ThemeEngine();
  const systemMonitor = new SystemMonitor();

  function connect(api, definitions) {
    appManager.connect(api, definitions);
    windowManager.connect(api);

    document.addEventListener("click", event => {
      const button = event.target.closest(".window-controls button.close");
      if (!button) return;

      const win = button.closest(".window");
      if (win) {
        events.emit("window:close-request", {
          id: win.id.replace(/^window-/, "")
        });
      }
    });

    events.emit("system:connected", { version: "2.0.0" });
  }

  window.CROSSCore = Object.freeze({
    version: "2.0.0",
    connect,
    events,
    storage,
    apps: appManager,
    windows: windowManager,
    themes: themeEngine,
    monitor: systemMonitor
  });
})();
